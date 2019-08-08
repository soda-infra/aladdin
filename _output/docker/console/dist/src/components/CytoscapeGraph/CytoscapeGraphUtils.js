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
import * as LayoutDictionary from './graphs/LayoutDictionary';
import { CytoscapeGlobalScratchNamespace } from '../../types/Graph';
import { DagreGraph } from './graphs/DagreGraph';
export var CyEdge = {
    grpc: 'grpc',
    grpcErr: 'grpcErr',
    grpcPercentErr: 'grpcPercentErr',
    grpcPercentReq: 'grpcPercentReq',
    http: 'http',
    http3xx: 'http3xx',
    http4xx: 'http4xx',
    http5xx: 'http5xx',
    httpPercentErr: 'httpPercentErr',
    httpPercentReq: 'httpPercentReq',
    id: 'id',
    isMTLS: 'isMTLS',
    protocol: 'protocol',
    responses: 'responses',
    responseTime: 'responseTime',
    tcp: 'tcp'
};
export var CyNode = {
    app: 'app',
    destServices: 'destServices',
    grpcIn: 'grpcIn',
    grpcInErr: 'grpcInErr',
    grpcOut: 'grpcOut',
    hasCB: 'hasCB',
    hasMissingSC: 'hasMissingSC',
    hasVS: 'hasVS',
    httpIn: 'httpIn',
    httpIn3xx: 'httpIn3xx',
    httpIn4xx: 'httpIn4xx',
    httpIn5xx: 'httpIn5xx',
    httpOut: 'httpOut',
    id: 'id',
    isDead: 'isDead',
    isGroup: 'isGroup',
    isInaccessible: 'isInaccessible',
    isMisconfigured: 'isMisconfigured',
    isOutside: 'isOutside',
    isRoot: 'isRoot',
    isServiceEntry: 'isServiceEntry',
    isUnused: 'isUnused',
    namespace: 'namespace',
    nodeType: 'nodeType',
    service: 'service',
    tcpIn: 'tcpIn',
    tcpOut: 'tcpOut',
    version: 'version',
    workload: 'workload'
};
export var ZoomOptions = {
    fitPadding: 25
};
export var safeFit = function (cy, centerElements) {
    cy.fit(centerElements, ZoomOptions.fitPadding);
    if (cy.zoom() > 2.5) {
        cy.zoom(2.5);
        cy.center(centerElements);
    }
};
export var runLayout = function (cy, layout) {
    // Enable labels when doing a relayout, layouts can be told to take into account the labels to avoid
    // overlap, but we need to have them enabled (nodeDimensionsIncludeLabels: true)
    var showNodeLabels = cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels;
    cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels = true;
    var layoutOptions = LayoutDictionary.getLayout(layout);
    if (cy.nodes('$node > node').length > 0) {
        // if there is any parent node, run the group-compound-layout
        cy.layout(__assign({}, layoutOptions, { name: 'group-compound-layout', realLayout: layout.name, 
            // Currently we do not support non discrete layouts for the compounds, but this can be supported if needed.
            compoundLayoutOptions: LayoutDictionary.getLayout(DagreGraph.getLayout()) })).run();
    }
    else {
        cy.layout(layoutOptions).run();
    }
    cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels = showNodeLabels;
};
//# sourceMappingURL=CytoscapeGraphUtils.js.map