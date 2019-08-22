var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getType } from 'typesafe-actions';
import { LoginStatus } from '../store/Store';
import { LoginActions } from '../actions/LoginActions';
import authenticationConfig from '../config/AuthenticationConfig';
export var INITIAL_LOGIN_STATE = {
    status: LoginStatus.loggedOut,
    session: undefined,
    message: ''
};
// This Reducer allows changes to the 'loginState' portion of Redux Store
var loginState = function (state, action) {
    if (state === void 0) { state = INITIAL_LOGIN_STATE; }
    switch (action.type) {
        case getType(LoginActions.loginRequest):
            return __assign({}, INITIAL_LOGIN_STATE, { status: LoginStatus.logging });
        case getType(LoginActions.loginSuccess):
            return __assign({}, INITIAL_LOGIN_STATE, action.payload);
        case getType(LoginActions.loginExtend):
            return __assign({}, INITIAL_LOGIN_STATE, { status: LoginStatus.loggedIn, session: action.payload.session });
        case getType(LoginActions.loginFailure):
            var message = 'Error connecting to Kiali';
            authenticationConfig.secretMissing = false;
            if (action.payload.error.request.status === 401) {
                message =
                    'Unauthorized. The provided credentials are not valid to access Kiali. Please check your credentials and try again.';
            }
            else if (action.payload.error.request.status === 520) {
                authenticationConfig.secretMissing = true;
            }
            return __assign({}, INITIAL_LOGIN_STATE, { status: LoginStatus.error, message: message });
        case getType(LoginActions.logoutSuccess):
            // If login succeeds, we clear the secret missing flag, since the server
            // allowed the authentication
            authenticationConfig.secretMissing = false;
            return INITIAL_LOGIN_STATE;
        case getType(LoginActions.sessionExpired):
            return __assign({}, INITIAL_LOGIN_STATE, { status: LoginStatus.expired, message: 'Your session has expired or was terminated in another window.' });
        default:
            return state;
    }
};
export default loginState;
//# sourceMappingURL=LoginState.js.map