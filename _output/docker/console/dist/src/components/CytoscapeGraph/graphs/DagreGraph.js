var DagreGraph = /** @class */ (function () {
    function DagreGraph() {
    }
    DagreGraph.getLayout = function () {
        return {
            name: 'dagre',
            fit: false,
            nodeDimensionsIncludeLabels: true,
            rankDir: 'LR'
        };
    };
    return DagreGraph;
}());
export { DagreGraph };
//# sourceMappingURL=DagreGraph.js.map