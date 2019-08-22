var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import moment from 'moment';
import { LoginActions } from './LoginActions';
import * as API from '../services/Api';
import * as Login from '../services/Login';
import { AuthResult, AuthStrategy } from '../types/Auth';
import { MessageCenterActions } from './MessageCenterActions';
import authenticationConfig from '../config/AuthenticationConfig';
var Dispatcher = new Login.LoginDispatcher();
var shouldRelogin = function (state) {
    return !state || !state.session || moment(state.session.expiresOn).diff(moment()) > 0;
};
var loginSuccess = function (dispatch, session) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        dispatch(LoginActions.loginSuccess(session));
        return [2 /*return*/];
    });
}); };
// Performs the user login, dispatching to the proper login implementations.
// The `data` argument is defined as `any` because the dispatchers receive
// different kinds of data (such as e-mail/password, tokens).
var performLogin = function (dispatch, state, data) {
    var bail = function (loginResult) {
        if (authenticationConfig.strategy === AuthStrategy.openshift) {
            dispatch(LoginActions.loginFailure(loginResult.error));
        }
        else {
            data ? dispatch(LoginActions.loginFailure(loginResult.error)) : dispatch(LoginActions.logoutSuccess());
        }
    };
    Dispatcher.prepare().then(function (result) {
        if (result === AuthResult.CONTINUE) {
            Dispatcher.perform({ dispatch: dispatch, state: state, data: data }).then(function (loginResult) { return loginSuccess(dispatch, loginResult.session); }, function (error) { return bail(error); });
        }
        else {
            bail({ status: AuthResult.FAILURE, error: 'Preparation for login failed, try again.' });
        }
    });
};
var LoginThunkActions = {
    authenticate: function (username, password) {
        return function (dispatch, getState) {
            dispatch(LoginActions.loginRequest());
            performLogin(dispatch, getState(), { username: username, password: password });
        };
    },
    checkCredentials: function () {
        return function (dispatch, getState) {
            // If Openshift login strategy is enabled, or anonymous mode is enabled,
            // perform the login cycle. Else, it doesn't make sense to login with
            // blank credentials.
            if (authenticationConfig.strategy !== AuthStrategy.login) {
                var state = getState();
                dispatch(LoginActions.loginRequest());
                if (shouldRelogin(state.authentication)) {
                    performLogin(dispatch, state);
                }
                else {
                    loginSuccess(dispatch, state.authentication.session);
                }
            }
        };
    },
    extendSession: function (session) {
        return function (dispatch) {
            dispatch(LoginActions.loginExtend(session));
        };
    },
    logout: function () {
        return function (dispatch) { return __awaiter(_this, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, API.logout()];
                    case 1:
                        response = _a.sent();
                        if (response.status === 204) {
                            dispatch(LoginActions.logoutSuccess());
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        dispatch(MessageCenterActions.addMessage(API.getErrorMsg('Logout failed', err_1)));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
};
export default LoginThunkActions;
//# sourceMappingURL=LoginThunkActions.js.map