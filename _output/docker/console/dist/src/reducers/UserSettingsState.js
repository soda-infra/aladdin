import { getType } from 'typesafe-actions';
import { config } from '../config';
import { updateState } from '../utils/Reducer';
import { UserSettingsActions } from '../actions/UserSettingsActions';
export var INITIAL_USER_SETTINGS_STATE = {
    interface: { navCollapse: false },
    duration: config.toolbar.defaultDuration,
    refreshInterval: config.toolbar.defaultPollInterval
};
var UserSettingsState = function (state, action) {
    if (state === void 0) { state = INITIAL_USER_SETTINGS_STATE; }
    switch (action.type) {
        case getType(UserSettingsActions.navCollapse):
            return updateState(state, {
                interface: { navCollapse: action.payload.collapse }
            });
        case getType(UserSettingsActions.setDuration):
            return updateState(state, {
                duration: action.payload
            });
        case getType(UserSettingsActions.setRefreshInterval):
            return updateState(state, {
                refreshInterval: action.payload
            });
        default:
            return state;
    }
};
export default UserSettingsState;
//# sourceMappingURL=UserSettingsState.js.map