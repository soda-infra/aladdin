var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { createSelector } from 'reselect';
// When updating the cytoscape graph, the element data expects to have all the changes
// non provided values are taken as "this didn't change", similar as setState does.
// Put default values for all fields that are omitted.
export var decorateGraphData = function (graphData) {
    var elementsDefaults = {
        edges: {
            grpc: 'NaN',
            grpcErr: 'NaN',
            grpcPercentErr: 'NaN',
            grpcPercentReq: 'NaN',
            http: 'NaN',
            http3xx: 'NaN',
            http4xx: 'NaN',
            http5xx: 'NaN',
            httpPercentErr: 'NaN',
            httpPercentReq: 'NaN',
            isMTLS: '-1',
            protocol: undefined,
            responses: undefined,
            responseTime: 'NaN',
            tcp: 'NaN'
        },
        nodes: {
            app: undefined,
            destServices: undefined,
            grpcIn: 'NaN',
            grpcInErr: 'NaN',
            grpcOut: 'NaN',
            hasCB: undefined,
            hasMissingSC: undefined,
            hasVS: undefined,
            httpIn: 'NaN',
            httpIn3xx: 'NaN',
            httpIn4xx: 'NaN',
            httpIn5xx: 'NaN',
            httpOut: 'NaN',
            isDead: undefined,
            isGroup: undefined,
            isInaccessible: undefined,
            isMisconfigured: undefined,
            isOutside: undefined,
            isRoot: undefined,
            isServiceEntry: undefined,
            isUnused: undefined,
            service: undefined,
            tcpIn: 'NaN',
            tcpOut: 'NaN',
            version: undefined,
            workload: undefined
        }
    };
    // It's not easy to get find/hide to work exactly as users users may expect.  Because edges represent
    // traffic for only one protocol it is best to use 0 defaults for that one protocol, and leave the others
    // as NaN. In that way numerical expressions affect only edges for a desired protocol.  Because nodes
    // can involve traffic from multiple protocols, it seems (for now) best to only set the values explicitly
    // supplied in the JSON.
    var edgeProtocolDefaults = {
        grpc: {
            grpc: 0,
            grpcErr: 0,
            grpcPercentErr: 0,
            grpcPercentReq: 0
        },
        http: {
            http: 0,
            http3xx: 0,
            http4xx: 0,
            http5xx: 0,
            httpPercentErr: 0,
            httpPercentReq: 0
        },
        tcp: {
            tcp: 0
        }
    };
    var decoratedGraph = {};
    if (graphData) {
        if (graphData.nodes) {
            decoratedGraph.nodes = graphData.nodes.map(function (node) {
                var decoratedNode = __assign({}, node);
                // parse out the traffic data into top level fields for the various protocols. This is done
                // to be back compatible with our existing ui code that expects the explicit http and tcp fields.
                // We can then set the 'traffic' field undefined because it is unused in the cy element handling.
                if (decoratedNode.data.traffic) {
                    var traffic = decoratedNode.data.traffic;
                    decoratedNode.data.traffic = undefined;
                    traffic.forEach(function (protocol) {
                        decoratedNode.data = __assign({}, protocol.rates, decoratedNode.data);
                    });
                }
                // prettier-ignore
                decoratedNode.data = __assign({}, elementsDefaults.nodes, decoratedNode.data);
                // prettier-ignore
                return decoratedNode;
            });
        }
        if (graphData.edges) {
            decoratedGraph.edges = graphData.edges.map(function (edge) {
                var decoratedEdge = __assign({}, edge);
                var _a = edge.data, traffic = _a.traffic, edgeData = __rest(_a, ["traffic"]);
                // see comment above about the 'traffic' data handling
                if (traffic && traffic.protocol !== '') {
                    decoratedEdge.data = __assign({ protocol: traffic.protocol, responses: traffic.responses }, edgeProtocolDefaults[traffic.protocol], traffic.rates, edgeData);
                }
                // prettier-ignore
                decoratedEdge.data = __assign({}, elementsDefaults.edges, decoratedEdge.data);
                // prettier-ignore
                return decoratedEdge;
            });
        }
    }
    return decoratedGraph;
};
var getGraphData = function (state) { return state.graph.graphData; };
export var graphDataSelector = createSelector(getGraphData, 
// This allows us to save the actual response from the server in the store, but avoid calling the decorateGraphData every time we need to access it
function (graphData) { return decorateGraphData(graphData); });
//# sourceMappingURL=GraphData.js.map