import * as React from 'react';
import { shallow } from 'enzyme';
import { CytoscapeGraph } from '../CytoscapeGraph';
import * as GRAPH_DATA from '../../../services/__mockData__/getGraphElements';
import { EdgeLabelMode } from '../../../types/GraphFilter';
import EmptyGraphLayoutContainer from '../../EmptyGraphLayout';
import { GraphType } from '../../../types/Graph';
import { decorateGraphData } from '../../../store/Selectors/GraphData';
jest.mock('../../../services/Api');
var testNamespace = 'ISTIO_SYSTEM';
var testClickHandler = function () {
    console.log('click');
};
var testReadyHandler = function () {
    console.log('ready');
};
var testSetHandler = function () {
    console.log('set');
};
describe('CytoscapeGraph component test', function () {
    it('should set correct elements data', function () {
        var myLayout = { name: 'breadthfirst' };
        var myEdgeLabelMode = EdgeLabelMode.NONE;
        var wrapper = shallow(React.createElement(CytoscapeGraph, { activeNamespaces: [{ name: testNamespace }], duration: 60, edgeLabelMode: myEdgeLabelMode, elements: decorateGraphData(GRAPH_DATA[testNamespace].elements), layout: myLayout, updateGraph: testClickHandler, updateSummary: testClickHandler, onReady: testReadyHandler, refresh: testClickHandler, refreshInterval: 0, setActiveNamespaces: testSetHandler, setNode: testSetHandler, isMTLSEnabled: false, showCircuitBreakers: false, showMissingSidecars: true, showNodeLabels: true, showSecurity: true, showServiceNodes: true, showTrafficAnimation: false, showUnusedNodes: false, showVirtualServices: true, isLoading: false, isError: false, graphType: GraphType.VERSIONED_APP }));
        var emptyGraphLayoutWrapper = wrapper.find(EmptyGraphLayoutContainer);
        var emptyGraphDecorated = decorateGraphData(GRAPH_DATA[testNamespace].elements);
        expect(emptyGraphLayoutWrapper.prop('elements').nodes).toEqual(emptyGraphDecorated.nodes);
        expect(emptyGraphLayoutWrapper.prop('elements').edges).toEqual(emptyGraphDecorated.edges);
    });
});
//# sourceMappingURL=CytoscapeGraph.test.js.map