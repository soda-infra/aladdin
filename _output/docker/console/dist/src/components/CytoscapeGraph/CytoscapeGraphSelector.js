var CytoscapeGraphSelectorBuilder = /** @class */ (function () {
    function CytoscapeGraphSelectorBuilder() {
        this.data = {};
    }
    CytoscapeGraphSelectorBuilder.prototype.app = function (app) {
        this.data.app = app;
        return this;
    };
    CytoscapeGraphSelectorBuilder.prototype.id = function (id) {
        this.data.id = id;
        return this;
    };
    CytoscapeGraphSelectorBuilder.prototype.isGroup = function (isGroup) {
        this.data.isGroup = isGroup;
        return this;
    };
    CytoscapeGraphSelectorBuilder.prototype.namespace = function (namespace) {
        this.data.namespace = namespace;
        return this;
    };
    CytoscapeGraphSelectorBuilder.prototype.nodeType = function (nodeType) {
        this.data.nodeType = nodeType;
        return this;
    };
    CytoscapeGraphSelectorBuilder.prototype.service = function (service) {
        this.data.service = service;
        return this;
    };
    CytoscapeGraphSelectorBuilder.prototype.version = function (version) {
        this.data.version = version;
        return this;
    };
    CytoscapeGraphSelectorBuilder.prototype.workload = function (workload) {
        this.data.workload = workload;
        return this;
    };
    CytoscapeGraphSelectorBuilder.prototype.build = function () {
        return 'node' + this.buildDataSelector();
    };
    CytoscapeGraphSelectorBuilder.prototype.buildDataSelector = function () {
        var _this = this;
        return Object.keys(this.data).reduce(function (dataSelector, key) {
            return dataSelector + (_this.data[key] == null ? "[!" + key + "]" : "[" + key + "=\"" + _this.data[key] + "\"]");
        }, '');
    };
    return CytoscapeGraphSelectorBuilder;
}());
export { CytoscapeGraphSelectorBuilder };
//# sourceMappingURL=CytoscapeGraphSelector.js.map