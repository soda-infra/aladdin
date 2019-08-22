var ColaGraph = /** @class */ (function () {
    function ColaGraph() {
    }
    ColaGraph.getLayout = function () {
        return {
            name: 'cola',
            animate: false,
            fit: false,
            flow: { axis: 'x' },
            nodeDimensionsIncludeLabels: true,
            randomize: false
        };
    };
    return ColaGraph;
}());
export { ColaGraph };
//# sourceMappingURL=ColaGraph.js.map