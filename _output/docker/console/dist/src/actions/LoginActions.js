import { createAction } from 'typesafe-actions';
import { LoginStatus } from '../store/Store';
import { ActionKeys } from './ActionKeys';
// synchronous action creators
export var LoginActions = {
    loginRequest: createAction(ActionKeys.LOGIN_REQUEST),
    loginExtend: createAction(ActionKeys.LOGIN_EXTEND, function (resolve) { return function (session) {
        return resolve({
            status: LoginStatus.loggedIn,
            session: session,
            error: undefined
        });
    }; }),
    loginSuccess: createAction(ActionKeys.LOGIN_SUCCESS, function (resolve) { return function (session) {
        return resolve({
            status: LoginStatus.loggedIn,
            session: session,
            error: undefined,
            uiExpiresOn: session.expiresOn
        });
    }; }),
    loginFailure: createAction(ActionKeys.LOGIN_FAILURE, function (resolve) { return function (error) {
        return resolve({
            status: LoginStatus.error,
            session: undefined,
            error: error
        });
    }; }),
    logoutSuccess: createAction(ActionKeys.LOGOUT_SUCCESS, function (resolve) { return function () {
        return resolve({
            status: LoginStatus.loggedOut,
            session: undefined,
            error: undefined
        });
    }; }),
    sessionExpired: createAction(ActionKeys.SESSION_EXPIRED)
};
//# sourceMappingURL=LoginActions.js.map