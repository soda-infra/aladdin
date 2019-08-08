import { GraphActions } from './GraphActions';
var GraphThunkActions = {
    graphReady: function (cyRef) {
        return function (dispatch) {
            dispatch(GraphActions.updateSummary({
                summaryType: 'graph',
                summaryTarget: cyRef
            }));
        };
    },
    updateGraph: function (cyData) {
        return function (dispatch) {
            dispatch(GraphActions.updateGraph(cyData));
        };
    }
};
export default GraphThunkActions;
//# sourceMappingURL=GraphThunkActions.js.map