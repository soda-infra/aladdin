import { clamp, quadraticBezier, linearInterpolation, distance, bezierLength } from '../../../utils/MathUtils';
import { DimClass } from '../graphs/GraphStyles';
import { PfColors } from '../../Pf/PfColors';
import { TrafficPointCircleRenderer, TrafficPointConcentricDiamondRenderer, Diamond } from './TrafficPointRenderer';
import { CyEdge } from '../CytoscapeGraphUtils';
import { Protocol } from '../../../types/Graph';
var TCP_SETTINGS = {
    baseSpeed: 0.5,
    timer: {
        max: 600,
        min: 150
    },
    sentRate: {
        min: 50,
        max: 1024 * 1024
    },
    errorRate: 0
};
// Min and max values to clamp the request per second rate
var TIMER_REQUEST_PER_SECOND_MIN = 0;
var TIMER_REQUEST_PER_SECOND_MAX = 750;
// Range of time to use between spawning a new dot.
// At higher request per second rate, faster dot spawning.
var TIMER_TIME_BETWEEN_DOTS_MIN = 20;
var TIMER_TIME_BETWEEN_DOTS_MAX = 1000;
// Clamp response time from min to max
var SPEED_RESPONSE_TIME_MIN = 0;
var SPEED_RESPONSE_TIME_MAX = 10000;
// Speed to travel trough an edge
var SPEED_RATE_MIN = 0.1;
var SPEED_RATE_MAX = 2.0;
var BASE_LENGTH = 50;
// How often paint a frame
var FRAME_RATE = 1 / 60;
var EdgeConnectionType;
(function (EdgeConnectionType) {
    EdgeConnectionType[EdgeConnectionType["LINEAR"] = 0] = "LINEAR";
    EdgeConnectionType[EdgeConnectionType["CURVE"] = 1] = "CURVE";
    EdgeConnectionType[EdgeConnectionType["LOOP"] = 2] = "LOOP";
})(EdgeConnectionType || (EdgeConnectionType = {}));
var TrafficEdgeType;
(function (TrafficEdgeType) {
    TrafficEdgeType[TrafficEdgeType["RPS"] = 0] = "RPS";
    TrafficEdgeType[TrafficEdgeType["TCP"] = 1] = "TCP";
    TrafficEdgeType[TrafficEdgeType["NONE"] = 2] = "NONE";
})(TrafficEdgeType || (TrafficEdgeType = {}));
/**
 * Returns a TrafficPointRenderer for an RPS error point
 * @param edge
 * @returns {TrafficPointRenderer}
 */
var getTrafficPointRendererForRpsError = function (_edge) {
    return new TrafficPointConcentricDiamondRenderer(new Diamond(2.5, PfColors.White, PfColors.Red100, 1.0), new Diamond(1, PfColors.Red100, PfColors.Red100, 1.0));
};
/**
 * Returns a TrafficPointRenderer for a RPS success point
 * @param edge
 * @returns {TrafficPointRenderer}
 */
var getTrafficPointRendererForRpsSuccess = function (edge) {
    return new TrafficPointCircleRenderer(1, PfColors.White, edge.style('line-color'), 2);
};
/**
 * Returns a TrafficPointRenderer for a Tcp point
 * @param edge
 * @returns {TrafficPointCircleRenderer}
 */
var getTrafficPointRendererForTcp = function (_edge) {
    return new TrafficPointCircleRenderer(0.8, PfColors.Black100, PfColors.Black500, 1);
};
/**
 * Helps generate traffic points
 * timer - defines how fast to generate a new point, its in milliseconds.
 * timerForNextPoint - keeps track of how many milliseconds to generate the next point.
 * speed - defines the speed of the next point (see TrafficPoint.speed)
 */
var TrafficPointGenerator = /** @class */ (function () {
    function TrafficPointGenerator() {
        this.speed = 0;
        this.errorRate = 0;
        this.type = TrafficEdgeType.NONE;
    }
    /**
     * Process a render step for the generator, decrements the timerForNextPoint and
     * returns a new point if it reaches zero (or is close).
     * This method adds some randomness to avoid the "flat" look that all the points
     * are synchronized.
     */
    TrafficPointGenerator.prototype.processStep = function (step, edge) {
        if (this.timerForNextPoint !== undefined) {
            this.timerForNextPoint -= step;
            // Add some random-ness to make it less "flat"
            if (this.timerForNextPoint <= Math.random() * 200) {
                this.timerForNextPoint = this.timer;
                return this.nextPoint(edge);
            }
        }
        return undefined;
    };
    TrafficPointGenerator.prototype.setTimer = function (timer) {
        this.timer = timer;
        // Start as soon as posible, unless we have no traffic
        if (this.timerForNextPoint === undefined) {
            this.timerForNextPoint = timer;
        }
    };
    TrafficPointGenerator.prototype.setSpeed = function (speed) {
        this.speed = speed;
    };
    TrafficPointGenerator.prototype.setErrorRate = function (errorRate) {
        this.errorRate = errorRate;
    };
    TrafficPointGenerator.prototype.setType = function (type) {
        this.type = type;
    };
    TrafficPointGenerator.prototype.nextPoint = function (edge) {
        var renderer;
        var offset;
        var isErrorPoint = Math.random() <= this.errorRate;
        if (this.type === TrafficEdgeType.RPS) {
            renderer = isErrorPoint ? getTrafficPointRendererForRpsError(edge) : getTrafficPointRendererForRpsSuccess(edge);
        }
        else if (this.type === TrafficEdgeType.TCP) {
            renderer = getTrafficPointRendererForTcp(edge);
            // Cheap way to put some offset around the edge, I think this is enough unless we want more accuracy
            // More accuracy would need to identify the slope of current segment of the edgge (for curves and loops) to only do
            // offsets perpendicular to it, instead of it, we are moving around a circle area
            // Random offset (x,y); 'x' in [-1.5, 1.5] and 'y' in [-1.5, 1.5]
            offset = { x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5 };
        }
        return {
            speed: this.speed,
            delta: 0,
            renderer: renderer,
            offset: offset
        };
    };
    return TrafficPointGenerator;
}());
/**
 * Holds the list of points an edge has.
 * points - list of active points the edge has, points are discarded when they
 *  reach their target.
 * generator - Generates the next point
 * edge - Edge where the traffic is tracked
 */
var TrafficEdge = /** @class */ (function () {
    function TrafficEdge() {
        this.points = [];
        this.type = TrafficEdgeType.NONE;
        this.generator = new TrafficPointGenerator();
    }
    /**
     * Process a step for the Traffic Edge, increments the delta of the points
     * Calls `processStep` for the generator and adds a new point if any.
     */
    TrafficEdge.prototype.processStep = function (step) {
        this.points = this.points.map(function (p) {
            p.delta += (step * p.speed) / 1000;
            return p;
        });
        var point = this.generator.processStep(step, this.edge);
        if (point) {
            this.points.push(point);
        }
    };
    TrafficEdge.prototype.getPoints = function () {
        return this.points;
    };
    TrafficEdge.prototype.getEdge = function () {
        return this.edge;
    };
    TrafficEdge.prototype.getType = function () {
        return this.type;
    };
    TrafficEdge.prototype.setTimer = function (timer) {
        this.generator.setTimer(timer);
    };
    /**
     * When a point is 1 or over it, is time to discard it.
     */
    TrafficEdge.prototype.removeFinishedPoints = function () {
        this.points = this.points.filter(function (p) { return p.delta <= 1; });
    };
    TrafficEdge.prototype.setSpeed = function (speed) {
        this.generator.setSpeed(speed);
    };
    TrafficEdge.prototype.setErrorRate = function (errorRate) {
        this.generator.setErrorRate(errorRate);
    };
    TrafficEdge.prototype.setEdge = function (edge) {
        this.edge = edge;
    };
    TrafficEdge.prototype.setType = function (type) {
        this.type = type;
        this.generator.setType(type);
    };
    return TrafficEdge;
}());
/**
 * Renders the traffic going from edges using the edge information to compute
 * their rate and speed
 *
 * rate determines how often to put a TrafficPoint in the edge.
 * responseTime determines how fast the TrafficPoint should travel from the start to the end of the edge.
 * percentErr determine if the next TrafficPoint is error or not.
 */
var TrafficRenderer = /** @class */ (function () {
    function TrafficRenderer(cy, edges) {
        var _this = this;
        this.trafficEdges = {};
        /**
         * Process a step, clears the canvas, sets the graph transformation to render
         * every dot.
         */
        this.processStep = function () {
            try {
                if (_this.previousTimestamp === undefined) {
                    _this.previousTimestamp = Date.now();
                }
                var nextTimestamp = Date.now();
                var step_1 = _this.currentStep(nextTimestamp);
                _this.layer.clear(_this.context);
                _this.layer.setTransform(_this.context);
                Object.keys(_this.trafficEdges).forEach(function (edgeId) {
                    var trafficEdge = _this.trafficEdges[edgeId];
                    // Skip if edge is currently hidden
                    if (trafficEdge.getEdge().visible()) {
                        trafficEdge.processStep(step_1);
                        trafficEdge.removeFinishedPoints();
                        _this.render(trafficEdge);
                    }
                });
                _this.previousTimestamp = nextTimestamp;
            }
            catch (exception) {
                // If a step failed, the next step is likely to fail.
                // Stop the rendering and throw the exception
                _this.stop();
                throw exception;
            }
        };
        this.layer = cy.cyCanvas();
        this.canvas = this.layer.getCanvas();
        this.context = this.canvas.getContext('2d');
        this.setEdges(edges);
    }
    /**
     * Starts the rendering loop, discards any other rendering loop that was started
     */
    TrafficRenderer.prototype.start = function () {
        this.stop();
        this.animationTimer = window.setInterval(this.processStep, FRAME_RATE * 1000);
    };
    /**
     * Stops the rendering loop if any
     */
    TrafficRenderer.prototype.stop = function () {
        if (this.animationTimer) {
            window.clearInterval(this.animationTimer);
            this.animationTimer = undefined;
            this.clear();
        }
    };
    TrafficRenderer.prototype.setEdges = function (edges) {
        this.trafficEdges = this.processEdges(edges);
    };
    TrafficRenderer.prototype.clear = function () {
        this.layer.clear(this.context);
    };
    /**
     * Renders the points inside the TrafficEdge (unless is dimmed)
     *
     */
    TrafficRenderer.prototype.render = function (trafficEdge) {
        var _this = this;
        var edge = trafficEdge.getEdge();
        if (edge.hasClass(DimClass)) {
            return;
        }
        trafficEdge.getPoints().forEach(function (point) {
            var controlPoints = _this.edgeControlPoints(edge);
            try {
                var pointInGraph = _this.pointWithOffset(_this.pointInGraph(controlPoints, point.delta), point.offset);
                if (pointInGraph) {
                    point.renderer.render(_this.context, pointInGraph);
                }
            }
            catch (error) {
                console.log("Error rendering TrafficEdge, it won't be rendered: " + error.message);
            }
        });
    };
    TrafficRenderer.prototype.pointInGraph = function (controlPoints, t) {
        /*
         * Control points are build so that if you have p0, p1, p2, p3, p4 points, you need to build 2 quadratic bezier:
         * 1) p0 (t=0), p1 (t=0.5) and p2 (t=1) and 2) p2 (t=0), p3 (t=0.5) and p4 (t=1)
         * p0 and p4 (or pn) are always the source and target of an edge.
         * Commonly there is only 2 points for straight lines, 3  points for curves and 5 points for loops.
         * Not going to generalize them now to avoid having a more complex code that is needed.
         * https://github.com/cytoscape/cytoscape.js/issues/2139#issuecomment-398473432
         */
        var edgeConnectionType = this.edgeConnectionTypeFromControlPoints(controlPoints);
        switch (edgeConnectionType) {
            case EdgeConnectionType.LINEAR:
                return linearInterpolation(controlPoints[0], controlPoints[1], t);
            case EdgeConnectionType.CURVE:
                return quadraticBezier(controlPoints[0], controlPoints[1], controlPoints[2], t);
            case EdgeConnectionType.LOOP:
                // Find the local t depending the current step
                if (t < 0.5) {
                    // Normalize [0, 0.5)
                    return quadraticBezier(controlPoints[0], controlPoints[1], controlPoints[2], t / 0.5);
                }
                else {
                    // Normalize [0.5, 1]
                    return quadraticBezier(controlPoints[2], controlPoints[3], controlPoints[4], (t - 0.5) * 2);
                }
            default:
                throw Error('Unhandled EdgeConnectionType:' + edgeConnectionType);
        }
    };
    TrafficRenderer.prototype.pointWithOffset = function (point, offset) {
        return offset === undefined ? point : { x: point.x + offset.x, y: point.y + offset.y };
    };
    TrafficRenderer.prototype.currentStep = function (currentTime) {
        var step = currentTime - this.previousTimestamp;
        return step === 0 ? FRAME_RATE * 1000 : step;
    };
    TrafficRenderer.prototype.getTrafficEdgeType = function (edge) {
        switch (edge.data(CyEdge.protocol)) {
            case Protocol.GRPC:
            case Protocol.HTTP:
                return TrafficEdgeType.RPS;
            case Protocol.TCP:
                return TrafficEdgeType.TCP;
            default:
                return TrafficEdgeType.NONE;
        }
    };
    TrafficRenderer.prototype.processEdges = function (edges) {
        var _this = this;
        return edges.reduce(function (trafficEdges, edge) {
            var type = _this.getTrafficEdgeType(edge);
            if (type !== TrafficEdgeType.NONE) {
                var edgeId = edge.data(CyEdge.id);
                if (edgeId in _this.trafficEdges) {
                    trafficEdges[edgeId] = _this.trafficEdges[edgeId];
                }
                else {
                    trafficEdges[edgeId] = new TrafficEdge();
                }
                trafficEdges[edgeId].setType(type);
                _this.fillTrafficEdge(edge, trafficEdges[edgeId]);
            }
            return trafficEdges;
        }, {});
    };
    TrafficRenderer.prototype.fillTrafficEdge = function (edge, trafficEdge) {
        // Need to identify if we are going to fill an RPS or TCP traffic edge
        // RPS traffic has rate, responseTime, percentErr (among others) where TCP traffic only has: tcpSentRate
        var edgeLengthFactor = 1;
        try {
            var edgeLength = this.edgeLength(edge);
            edgeLengthFactor = BASE_LENGTH / Math.max(edgeLength, 1);
        }
        catch (error) {
            console.error("Error when finding the length of the edge for the traffic animation, this TrafficEdge won't be rendered: " + error.message);
        }
        if (trafficEdge.getType() === TrafficEdgeType.RPS) {
            var isHttp = edge.data(CyEdge.protocol) === Protocol.HTTP;
            var rate = isHttp ? CyEdge.http : CyEdge.grpc;
            var pErr = isHttp ? CyEdge.httpPercentErr : CyEdge.grpcPercentErr;
            var timer = this.timerFromRate(edge.data(rate));
            // The edge of the length also affects the speed, include a factor in the speed to even visual speed for
            // long and short edges.
            var speed = this.speedFromResponseTime(edge.data(CyEdge.responseTime)) * edgeLengthFactor;
            var errorRate = edge.data(pErr) === undefined ? 0 : edge.data(pErr) / 100;
            trafficEdge.setSpeed(speed);
            trafficEdge.setTimer(timer);
            trafficEdge.setEdge(edge);
            trafficEdge.setErrorRate(errorRate);
        }
        else if (trafficEdge.getType() === TrafficEdgeType.TCP) {
            trafficEdge.setSpeed(TCP_SETTINGS.baseSpeed * edgeLengthFactor);
            trafficEdge.setErrorRate(TCP_SETTINGS.errorRate);
            trafficEdge.setTimer(this.timerFromTcpSentRate(edge.data(CyEdge.tcp))); // 150 - 500
            trafficEdge.setEdge(edge);
        }
    };
    // see for easing functions https://gist.github.com/gre/1650294
    TrafficRenderer.prototype.timerFromRate = function (rate) {
        if (isNaN(rate) || rate === 0) {
            return undefined;
        }
        // Normalize requests per second within a range
        var delta = clamp(rate, TIMER_REQUEST_PER_SECOND_MIN, TIMER_REQUEST_PER_SECOND_MAX) / TIMER_REQUEST_PER_SECOND_MAX;
        // Invert and scale
        return (TIMER_TIME_BETWEEN_DOTS_MIN + Math.pow(1 - delta, 2) * (TIMER_TIME_BETWEEN_DOTS_MAX - TIMER_TIME_BETWEEN_DOTS_MIN));
    };
    TrafficRenderer.prototype.timerFromTcpSentRate = function (tcpSentRate) {
        if (isNaN(tcpSentRate) || tcpSentRate === 0) {
            return undefined;
        }
        // Normalize requests per second within a range
        var delta = clamp(tcpSentRate, TCP_SETTINGS.sentRate.min, TCP_SETTINGS.sentRate.max) / TCP_SETTINGS.sentRate.max;
        // Invert and scale
        return TCP_SETTINGS.timer.min + Math.pow(1 - delta, 2) * (TCP_SETTINGS.timer.max - TCP_SETTINGS.timer.min);
    };
    TrafficRenderer.prototype.speedFromResponseTime = function (responseTime) {
        // Consider NaN response time as "everything is going as fast as possible"
        if (isNaN(responseTime)) {
            return SPEED_RATE_MAX;
        }
        // Normalize
        var delta = clamp(responseTime, SPEED_RESPONSE_TIME_MIN, SPEED_RESPONSE_TIME_MAX) / SPEED_RESPONSE_TIME_MAX;
        // Scale
        return SPEED_RATE_MIN + (1 - delta) * (SPEED_RATE_MAX - SPEED_RATE_MIN);
    };
    TrafficRenderer.prototype.edgeLength = function (edge) {
        var controlPoints = this.edgeControlPoints(edge);
        var edgeConnectionType = this.edgeConnectionTypeFromControlPoints(controlPoints);
        switch (edgeConnectionType) {
            case EdgeConnectionType.LINEAR:
                return distance(controlPoints[0], controlPoints[1]);
            case EdgeConnectionType.CURVE:
                return bezierLength(controlPoints[0], controlPoints[1], controlPoints[2]);
            case EdgeConnectionType.LOOP:
                return (bezierLength(controlPoints[0], controlPoints[1], controlPoints[2]) +
                    bezierLength(controlPoints[2], controlPoints[3], controlPoints[4]));
            default:
                throw Error('Unhandled EdgeConnectionType:' + edgeConnectionType);
        }
    };
    TrafficRenderer.prototype.edgeControlPoints = function (edge) {
        var controlPoints = [edge.sourceEndpoint()];
        var rawControlPoints = edge.controlPoints();
        if (rawControlPoints) {
            for (var i = 0; i < rawControlPoints.length; ++i) {
                controlPoints.push(rawControlPoints[i]);
                // If there is a next point, we are going to use the midpoint for the next point
                if (i + 1 < rawControlPoints.length) {
                    controlPoints.push({
                        x: (rawControlPoints[i].x + rawControlPoints[i + 1].x) / 2,
                        y: (rawControlPoints[i].y + rawControlPoints[i + 1].y) / 2
                    });
                }
            }
        }
        controlPoints.push(edge.targetEndpoint());
        return controlPoints;
    };
    TrafficRenderer.prototype.edgeConnectionTypeFromControlPoints = function (controlPoints) {
        if (controlPoints.length === 2) {
            return EdgeConnectionType.LINEAR;
        }
        else if (controlPoints.length === 3) {
            return EdgeConnectionType.CURVE;
        }
        else if (controlPoints.length === 5) {
            return EdgeConnectionType.LOOP;
        }
        else {
            throw Error('Unknown EdgeConnectionType, ControlPoint.length=' + controlPoints.length);
        }
    };
    return TrafficRenderer;
}());
export default TrafficRenderer;
//# sourceMappingURL=TrafficRenderer.js.map