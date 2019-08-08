import graphDataState from '../GraphDataState';
import { GraphActions } from '../../actions/GraphActions';
import { GraphDataActions } from '../../actions/GraphDataActions';
import { GlobalActions } from '../../actions/GlobalActions';
import { EdgeLabelMode } from '../../types/GraphFilter';
import { GraphType } from '../../types/Graph';
import { DagreGraph } from '../../components/CytoscapeGraph/graphs/DagreGraph';
describe('GraphDataState', function () {
    it('should return the initial state', function () {
        expect(graphDataState(undefined, GlobalActions.unknown())).toEqual({
            cyData: null,
            error: undefined,
            isLoading: false,
            isError: false,
            filterState: {
                edgeLabelMode: EdgeLabelMode.NONE,
                findValue: '',
                graphType: GraphType.VERSIONED_APP,
                hideValue: '',
                showCircuitBreakers: true,
                showFindHelp: false,
                showLegend: false,
                showMissingSidecars: true,
                showNodeLabels: true,
                showSecurity: false,
                showServiceNodes: true,
                showTrafficAnimation: false,
                showUnusedNodes: false,
                showVirtualServices: true
            },
            graphDataTimestamp: 0,
            graphDataDuration: 0,
            graphData: {},
            layout: DagreGraph.getLayout(),
            node: undefined,
            summaryData: null
        });
    });
    it('should handle GET_GRAPH_DATA_START', function () {
        var action = GraphDataActions.getGraphDataStart();
        var updatedState = graphDataState(undefined, action);
        expect(updatedState.summaryData).toBeNull();
        expect(updatedState.isLoading).toBeTruthy();
    });
    it('should handle GET_GRAPH_DATA_SUCCESS', function () {
        var action = GraphDataActions.getGraphDataSuccess(100, 10, {});
        var updatedState = graphDataState(undefined, action);
        expect(updatedState.isLoading).toBeFalsy();
        expect(updatedState.isError).toBeFalsy();
        expect(updatedState.error).toBeUndefined();
        expect(updatedState).toMatchObject({
            isLoading: false,
            graphDataTimestamp: 100,
            graphDataDuration: 10,
            graphData: {}
        });
    });
    it('should handle GET_GRAPH_DATA_FAILURE', function () {
        var action = GraphDataActions.getGraphDataFailure('error description');
        var updatedState = graphDataState(undefined, action);
        expect(updatedState.isLoading).toBeFalsy();
        expect(updatedState.isError).toBeTruthy();
        expect(updatedState.error).toBeDefined();
    });
    it('should handle UPDATE_SUMMARY', function () {
        var action = GraphActions.updateSummary({ summaryType: 'node', summaryTarget: 'mynode' });
        var updatedState = graphDataState(undefined, action);
        expect(updatedState.summaryData).toEqual({ summaryType: 'node', summaryTarget: 'mynode' });
    });
});
//# sourceMappingURL=GraphDataState.test.js.map