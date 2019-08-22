import { getType } from 'typesafe-actions';
import { GrafanaActions } from '../actions/GrafanaActions';
export var INITIAL_GRAFANA_STATE = null;
// This Reducer allows changes to the 'graphDataState' portion of Redux Store
var GrafanaState = function (state, action) {
    if (state === void 0) { state = INITIAL_GRAFANA_STATE; }
    switch (action.type) {
        case getType(GrafanaActions.setinfo):
            if (!action.payload) {
                // Ex: in case of response 204
                return null;
            }
            // Spread types can only be created from object types so need to use Object.assign here
            // tslint:disable-next-line
            return Object.assign({}, INITIAL_GRAFANA_STATE, {
                url: action.payload.url,
                serviceDashboardPath: action.payload.serviceDashboardPath,
                workloadDashboardPath: action.payload.workloadDashboardPath,
            });
        default:
            return state;
    }
};
export default GrafanaState;
//# sourceMappingURL=GrafanaState.js.map