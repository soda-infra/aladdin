var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LoginStatus } from '../store/Store';
import * as API from '../services/Api';
import { HelpDropdownActions } from '../actions/HelpDropdownActions';
import { JaegerActions } from '../actions/JaegerActions';
import { MessageCenterActions } from '../actions/MessageCenterActions';
import { MessageType } from '../types/MessageCenter';
import { GrafanaActions } from '../actions/GrafanaActions';
import InitializingScreen from './InitializingScreen';
import { isKioskMode } from '../utils/SearchParamUtils';
import * as MessageCenter from '../utils/MessageCenter';
import { setServerConfig } from '../config/ServerConfig';
import { MeshTlsActions } from '../actions/MeshTlsActions';
var LoginStage;
(function (LoginStage) {
    LoginStage[LoginStage["LOGIN"] = 0] = "LOGIN";
    LoginStage[LoginStage["POST_LOGIN"] = 1] = "POST_LOGIN";
    LoginStage[LoginStage["LOGGED_IN"] = 2] = "LOGGED_IN";
    LoginStage[LoginStage["LOGGED_IN_AT_LOAD"] = 3] = "LOGGED_IN_AT_LOAD";
})(LoginStage || (LoginStage = {}));
var AuthenticationController = /** @class */ (function (_super) {
    __extends(AuthenticationController, _super);
    function AuthenticationController(props) {
        var _this = _super.call(this, props) || this;
        _this.doPostLoginActions = function () { return __awaiter(_this, void 0, void 0, function () {
            var getStatusPromise, getGrafanaInfoPromise, getJaegerInfoPromise, configs, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        getStatusPromise = API.getStatus()
                            .then(function (response) { return _this.props.setServerStatus(response.data); })
                            .catch(function (error) {
                            MessageCenter.add(API.getErrorMsg('Error fetching status.', error), 'default', MessageType.WARNING);
                        });
                        getGrafanaInfoPromise = API.getGrafanaInfo()
                            .then(function (response) { return _this.props.setGrafanaInfo(response.data); })
                            .catch(function (error) {
                            _this.props.setGrafanaInfo(null);
                            MessageCenter.add(API.getInfoMsg('Could not fetch Grafana info. Turning off links to Grafana.', error), 'default', MessageType.INFO);
                        });
                        getJaegerInfoPromise = API.getJaegerInfo()
                            .then(function (response) { return _this.setJaegerInfo(response.data); })
                            .catch(function (error) {
                            _this.props.setJaegerInfo(null);
                            MessageCenter.add(API.getInfoMsg('Could not fetch Jaeger info. Turning off Jaeger integration.', error), 'default', MessageType.INFO);
                        });
                        return [4 /*yield*/, Promise.all([
                                API.getServerConfig(),
                                getStatusPromise,
                                getGrafanaInfoPromise,
                                getJaegerInfoPromise
                            ])];
                    case 1:
                        configs = _a.sent();
                        setServerConfig(configs[0].data);
                        this.setState({ stage: LoginStage.LOGGED_IN });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Error on post-login actions.', err_1);
                        this.setState({ isPostLoginError: true });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.setDocLayout = function () {
            if (document.documentElement) {
                document.documentElement.className = isKioskMode() ? 'kiosk' : '';
            }
        };
        _this.setJaegerInfo = function (jaegerInfo) {
            var jaegerState = { jaegerURL: '', enableIntegration: false };
            if (jaegerInfo.url) {
                jaegerState = {
                    jaegerURL: jaegerInfo.url,
                    // If same protocol enable integration, otherwise new tab is open
                    enableIntegration: jaegerInfo.url.startsWith(window.location.protocol)
                };
            }
            _this.props.setJaegerInfo(jaegerState);
        };
        _this.state = {
            stage: _this.props.authenticated ? LoginStage.LOGGED_IN_AT_LOAD : LoginStage.LOGIN,
            isPostLoginError: false
        };
        return _this;
    }
    AuthenticationController.prototype.componentDidMount = function () {
        if (this.state.stage === LoginStage.LOGGED_IN_AT_LOAD) {
            this.doPostLoginActions();
        }
        this.setDocLayout();
    };
    AuthenticationController.prototype.componentDidUpdate = function (prevProps, _prevState) {
        if (!prevProps.authenticated && this.props.authenticated) {
            this.setState({ stage: LoginStage.POST_LOGIN });
            this.doPostLoginActions();
        }
        else if (prevProps.authenticated && !this.props.authenticated) {
            this.setState({ stage: LoginStage.LOGIN });
        }
        this.setDocLayout();
    };
    AuthenticationController.prototype.render = function () {
        if (this.state.stage === LoginStage.LOGGED_IN) {
            return this.props.protectedAreaComponent;
        }
        else if (this.state.stage === LoginStage.LOGGED_IN_AT_LOAD) {
            return !this.state.isPostLoginError ? (React.createElement(InitializingScreen, null)) : (React.createElement(InitializingScreen, { errorMsg: AuthenticationController.PostLoginErrorMsg }));
        }
        else if (this.state.stage === LoginStage.POST_LOGIN) {
            return !this.state.isPostLoginError
                ? this.props.publicAreaComponent(true)
                : this.props.publicAreaComponent(false, AuthenticationController.PostLoginErrorMsg);
        }
        else {
            return this.props.publicAreaComponent(false);
        }
    };
    AuthenticationController.PostLoginErrorMsg = 'You are logged in, but there was a problem when fetching some required server ' +
        'configurations. Please, try refreshing the page.';
    return AuthenticationController;
}(React.Component));
var processServerStatus = function (dispatch, serverStatus) {
    dispatch(HelpDropdownActions.statusRefresh(serverStatus.status, serverStatus.externalServices, serverStatus.warningMessages));
    serverStatus.warningMessages.forEach(function (wMsg) {
        dispatch(MessageCenterActions.addMessage(wMsg, 'systemErrors', MessageType.WARNING));
    });
};
var mapStateToProps = function (state) { return ({
    authenticated: state.authentication.status === LoginStatus.loggedIn
}); };
var mapDispatchToProps = function (dispatch) {
    return {
        setGrafanaInfo: bindActionCreators(GrafanaActions.setinfo, dispatch),
        setJaegerInfo: bindActionCreators(JaegerActions.setinfo, dispatch),
        setServerStatus: function (serverStatus) { return processServerStatus(dispatch, serverStatus); },
        setMeshTlsStatus: bindActionCreators(MeshTlsActions.setinfo, dispatch)
    };
};
var AuthenticationControllerContainer = connect(mapStateToProps, mapDispatchToProps)(AuthenticationController);
export default AuthenticationControllerContainer;
//# sourceMappingURL=AuthenticationController.js.map