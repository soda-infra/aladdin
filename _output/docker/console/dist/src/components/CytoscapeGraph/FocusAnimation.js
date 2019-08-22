import { PfColors } from '../Pf/PfColors';
// How fast refresh (frame rate)
var FRAME_RATE = 1 / 30;
// Radio of the biggest circle (i.e. when it starts)
var MAX_RADIO = 60;
var LINE_WIDTH = 1;
// Time the animation will take in ms
var ANIMATION_DURATION = 2000;
var FocusAnimation = /** @class */ (function () {
    function FocusAnimation(cy) {
        var _this = this;
        // This methods needs to be an arrow function.
        // the reason is that we call this method from a window.setInterval and having an arrow function is a way to preserve
        // "this".
        this.processStep = function () {
            try {
                if (_this.startTimestamp === undefined) {
                    _this.startTimestamp = Date.now();
                }
                var current = Date.now();
                var step_1 = (current - _this.startTimestamp) / ANIMATION_DURATION;
                _this.layer.clear(_this.context);
                _this.layer.setTransform(_this.context);
                if (step_1 >= 1) {
                    _this.stop();
                    if (_this.onFinishedCallback) {
                        _this.onFinishedCallback();
                    }
                    return;
                }
                _this.elements.forEach(function (element) { return _this.render(element, _this.easingFunction(step_1) * MAX_RADIO); });
            }
            catch (exception) {
                // If a step failed, the next step is likely to fail.
                // Stop the rendering and throw the exception
                _this.stop();
                throw exception;
            }
        };
        this.layer = cy.cyCanvas();
        this.context = this.layer.getCanvas().getContext('2d');
        cy.one('destroy', function () { return _this.stop(); });
    }
    FocusAnimation.prototype.onFinished = function (onFinishedCallback) {
        this.onFinishedCallback = onFinishedCallback;
    };
    FocusAnimation.prototype.start = function (elements) {
        this.stop();
        this.elements = elements;
        this.animationTimer = window.setInterval(this.processStep, FRAME_RATE * 1000);
    };
    FocusAnimation.prototype.stop = function () {
        if (this.animationTimer) {
            window.clearInterval(this.animationTimer);
            this.animationTimer = undefined;
            this.clear();
        }
    };
    FocusAnimation.prototype.clear = function () {
        this.layer.clear(this.context);
    };
    FocusAnimation.prototype.easingFunction = function (t) {
        // Do a focus animation in, out and in again.
        // Make the first focus slower and the subsequent bit faster
        if (t < 0.5) {
            // %50 of the time is spent on the first in
            return 1 - t * 2;
        }
        else if (t < 0.75) {
            // 25% is spent in the out animation
            return (t - 0.5) * 4;
        }
        return 1 - (t - 0.75) * 4; // 25% is spent in the second in
    };
    FocusAnimation.prototype.getCenter = function (element) {
        if (element.isNode()) {
            return element.position();
        }
        else {
            return element.midpoint();
        }
    };
    FocusAnimation.prototype.render = function (element, radio) {
        var _a = this.getCenter(element), x = _a.x, y = _a.y;
        this.context.strokeStyle = PfColors.Blue300;
        this.context.lineWidth = LINE_WIDTH;
        this.context.beginPath();
        this.context.arc(x, y, radio, 0, 2 * Math.PI, true);
        this.context.stroke();
    };
    return FocusAnimation;
}());
export default FocusAnimation;
//# sourceMappingURL=FocusAnimation.js.map