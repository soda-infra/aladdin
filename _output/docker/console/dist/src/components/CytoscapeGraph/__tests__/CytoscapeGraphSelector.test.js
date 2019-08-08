import { CytoscapeGraphSelectorBuilder } from '../CytoscapeGraphSelector';
import { NodeType } from '../../../types/Graph';
describe('CytoscapeGraphSelector test', function () {
    it('Generates selector for app', function () {
        var selector = new CytoscapeGraphSelectorBuilder().app('myapp').build();
        expect(selector).toEqual('node[app="myapp"]');
    });
    it('Generates selector for id', function () {
        var selector = new CytoscapeGraphSelectorBuilder().id('myid').build();
        expect(selector).toEqual('node[id="myid"]');
    });
    it('Generates selector for namespace', function () {
        var selector = new CytoscapeGraphSelectorBuilder().namespace('mynamespace').build();
        expect(selector).toEqual('node[namespace="mynamespace"]');
    });
    it('Generates selector for nodeType', function () {
        var selector = new CytoscapeGraphSelectorBuilder().nodeType(NodeType.APP).build();
        expect(selector).toEqual('node[nodeType="app"]');
    });
    it('Generates selector for service', function () {
        var selector = new CytoscapeGraphSelectorBuilder().service('myservice').build();
        expect(selector).toEqual('node[service="myservice"]');
    });
    it('Generates selector for version', function () {
        var selector = new CytoscapeGraphSelectorBuilder().version('myversion').build();
        expect(selector).toEqual('node[version="myversion"]');
    });
    it('Generates selector for workload', function () {
        var selector = new CytoscapeGraphSelectorBuilder().workload('myworkload').build();
        expect(selector).toEqual('node[workload="myworkload"]');
    });
    it('Generates selector for isGroup', function () {
        var selector = new CytoscapeGraphSelectorBuilder().isGroup('mygroup').build();
        expect(selector).toEqual('node[isGroup="mygroup"]');
    });
    it('Generates falsy selector for isGroup', function () {
        var selector = new CytoscapeGraphSelectorBuilder().isGroup(null).build();
        expect(selector).toEqual('node[!isGroup]');
    });
    it('Generates selector for two properties', function () {
        var selector = new CytoscapeGraphSelectorBuilder()
            .workload('myworkload')
            .app('myapp')
            .build();
        expect(selector).toEqual('node[workload="myworkload"][app="myapp"]');
    });
    it('Generates selector for multiple properties', function () {
        var selector = new CytoscapeGraphSelectorBuilder()
            .workload('myworkload')
            .id('myid')
            .version('myversion')
            .service('myservice')
            .build();
        expect(selector).toEqual('node[workload="myworkload"][id="myid"][version="myversion"][service="myservice"]');
    });
});
//# sourceMappingURL=CytoscapeGraphSelector.test.js.map