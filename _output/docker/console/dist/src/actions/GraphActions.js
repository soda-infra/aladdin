import { createAction, createStandardAction } from 'typesafe-actions';
import { ActionKeys } from './ActionKeys';
export var GraphActions = {
    changed: createAction(ActionKeys.GRAPH_CHANGED),
    setLayout: createStandardAction(ActionKeys.GRAPH_SET_LAYOUT)(),
    setNode: createStandardAction(ActionKeys.GRAPH_SET_NODE)(),
    updateGraph: createStandardAction(ActionKeys.UPDATE_GRAPH)(),
    updateSummary: createStandardAction(ActionKeys.UPDATE_SUMMARY)()
};
//# sourceMappingURL=GraphActions.js.map