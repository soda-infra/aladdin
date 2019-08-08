import { createAction } from 'typesafe-actions';
import { ActionKeys } from './ActionKeys';
// synchronous action creators
export var GraphDataActions = {
    getGraphDataStart: createAction(ActionKeys.GET_GRAPH_DATA_START),
    getGraphDataSuccess: createAction(ActionKeys.GET_GRAPH_DATA_SUCCESS, function (resolve) { return function (timestamp, graphDuration, graphData) {
        return resolve({
            timestamp: timestamp,
            graphDuration: graphDuration,
            graphData: graphData
        });
    }; }),
    getGraphDataFailure: createAction(ActionKeys.GET_GRAPH_DATA_FAILURE, function (resolve) { return function (error) {
        return resolve({ error: error });
    }; }),
    getGraphDataWithoutNamespaces: createAction(ActionKeys.GET_GRAPH_DATA_WITHOUT_NAMESPACES),
    handleLegend: createAction(ActionKeys.HANDLE_LEGEND)
};
//# sourceMappingURL=GraphDataActions.js.map