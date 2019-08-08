import { UserSettingsActions } from './UserSettingsActions';
var UserSettingsThunkActions = {
    setNavCollapsed: function (collapsed) { return function (dispatch) {
        return dispatch(UserSettingsActions.navCollapse(collapsed));
    }; }
};
export default UserSettingsThunkActions;
//# sourceMappingURL=UserSettingsThunkActions.js.map