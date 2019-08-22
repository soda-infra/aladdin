import { createAction, createStandardAction } from 'typesafe-actions';
import { ActionKeys } from './ActionKeys';
export var UserSettingsActions = {
    navCollapse: createAction(ActionKeys.NAV_COLLAPSE, function (resolve) { return function (collapsed) {
        return resolve({ collapse: collapsed });
    }; }),
    setDuration: createStandardAction(ActionKeys.SET_DURATION)(),
    setRefreshInterval: createStandardAction(ActionKeys.SET_REFRESH_INTERVAL)()
};
//# sourceMappingURL=UserSettingsActions.js.map