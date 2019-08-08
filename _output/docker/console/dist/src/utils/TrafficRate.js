import { CyNode, CyEdge } from '../components/CytoscapeGraph/CytoscapeGraphUtils';
var safeRate = function (rate) { return (isNaN(rate) ? 0.0 : Number(rate)); };
var NODE_GRPC_IN = {
    RATE: CyNode.grpcIn,
    RATEERR: CyNode.grpcInErr
};
var EDGE_GRPC = {
    RATE: CyEdge.grpc,
    RATEERR: CyEdge.grpcErr
};
export var getTrafficRateGrpc = function (element, trafficType) {
    if (trafficType === void 0) { trafficType = NODE_GRPC_IN; }
    return {
        rate: safeRate(element.data(trafficType.RATE)),
        rateErr: safeRate(element.data(trafficType.RATEERR))
    };
};
export var getAccumulatedTrafficRateGrpc = function (elements) {
    return elements.reduce(function (r, element) {
        var elementTrafficRate = getTrafficRateGrpc(element, EDGE_GRPC);
        r.rate += elementTrafficRate.rate;
        r.rateErr += elementTrafficRate.rateErr;
        return r;
    }, { rate: 0, rateErr: 0 });
};
var NODE_HTTP_IN = {
    RATE: CyNode.httpIn,
    RATE3XX: CyNode.httpIn3xx,
    RATE4XX: CyNode.httpIn4xx,
    RATE5XX: CyNode.httpIn5xx
};
var EDGE_HTTP = {
    RATE: CyEdge.http,
    RATE3XX: CyEdge.http3xx,
    RATE4XX: CyEdge.http4xx,
    RATE5XX: CyEdge.http5xx
};
export var getTrafficRateHttp = function (element, trafficType) {
    if (trafficType === void 0) { trafficType = NODE_HTTP_IN; }
    return {
        rate: safeRate(element.data(trafficType.RATE)),
        rate3xx: safeRate(element.data(trafficType.RATE3XX)),
        rate4xx: safeRate(element.data(trafficType.RATE4XX)),
        rate5xx: safeRate(element.data(trafficType.RATE5XX))
    };
};
export var getAccumulatedTrafficRateHttp = function (elements) {
    return elements.reduce(function (r, element) {
        var elementTrafficRate = getTrafficRateHttp(element, EDGE_HTTP);
        r.rate += elementTrafficRate.rate;
        r.rate3xx += elementTrafficRate.rate3xx;
        r.rate4xx += elementTrafficRate.rate4xx;
        r.rate5xx += elementTrafficRate.rate5xx;
        return r;
    }, { rate: 0, rate3xx: 0, rate4xx: 0, rate5xx: 0 });
};
//# sourceMappingURL=TrafficRate.js.map