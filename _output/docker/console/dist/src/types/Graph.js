export var SUMMARY_PANEL_CHART_WIDTH = 250;
export var Protocol;
(function (Protocol) {
    Protocol["GRPC"] = "grpc";
    Protocol["HTTP"] = "http";
    Protocol["TCP"] = "tcp";
})(Protocol || (Protocol = {}));
export var GraphType;
(function (GraphType) {
    GraphType["APP"] = "app";
    GraphType["SERVICE"] = "service";
    GraphType["VERSIONED_APP"] = "versionedApp";
    GraphType["WORKLOAD"] = "workload";
})(GraphType || (GraphType = {}));
export var GroupByType;
(function (GroupByType) {
    GroupByType["APP"] = "app";
    GroupByType["NONE"] = "none";
    GroupByType["VERSION"] = "version";
})(GroupByType || (GroupByType = {}));
export var NodeType;
(function (NodeType) {
    NodeType["APP"] = "app";
    NodeType["SERVICE"] = "service";
    NodeType["UNKNOWN"] = "unknown";
    NodeType["WORKLOAD"] = "workload";
})(NodeType || (NodeType = {}));
// This data is stored in the _global scratch area in the cy graph
// for use by code that needs access to it.
// We can add more props to this scratch data as the need arises.
export var CytoscapeGlobalScratchNamespace = '_global';
//# sourceMappingURL=Graph.js.map