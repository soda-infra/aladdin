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
var _this = this;
import axios from 'axios';
import * as React from 'react';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { Router, withRouter } from 'react-router-dom';
import * as Visibility from 'visibilityjs';
import { GlobalActions } from '../actions/GlobalActions';
import NavigationContainer from '../components/Nav/Navigation';
import { store, persistor } from '../store/ConfigStore';
import AuthenticationControllerContainer from './AuthenticationController';
import history from './History';
import InitializingScreen from './InitializingScreen';
import StartupInitializer from './StartupInitializer';
import LoginPageContainer from '../pages/Login/LoginPage';
import { LoginActions } from '../actions/LoginActions';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/themes/light-border.css';
/**
 * Use the Patternfly RCUE productized css styles if set by the environment
 * @example 'env REACT_APP_RCUE=true yarn start'
 */
var loadRcueCssIfNeeded = function () { return __awaiter(_this, void 0, void 0, function () {
    var useRcue;
    return __generator(this, function (_a) {
        useRcue = process.env.REACT_APP_RCUE;
        if (useRcue === 'true') {
            console.info('REACT_APP_RCUE set to true');
            Promise.all([require('patternfly/dist/css/rcue.css'), require('patternfly/dist/css/rcue-additions.css')]);
            console.info('Loaded RCUE css libraries loaded');
        }
        return [2 /*return*/];
    });
}); };
Visibility.change(function (_e, state) {
    // There are 3 states, visible, hidden and prerender, consider prerender as hidden.
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
    if (state === 'visible') {
        store.dispatch(GlobalActions.setPageVisibilityVisible());
    }
    else {
        store.dispatch(GlobalActions.setPageVisibilityHidden());
    }
});
if (Visibility.hidden()) {
    store.dispatch(GlobalActions.setPageVisibilityHidden());
}
else {
    store.dispatch(GlobalActions.setPageVisibilityVisible());
}
var getIsLoadingState = function () {
    var state = store.getState();
    return state && state.globalState.loadingCounter > 0;
};
var decrementLoadingCounter = function () {
    if (getIsLoadingState()) {
        store.dispatch(GlobalActions.decrementLoadingCounter());
    }
};
// intercept all Axios requests and dispatch the INCREMENT_LOADING_COUNTER Action
axios.interceptors.request.use(function (request) {
    // dispatch an action to turn spinner on
    store.dispatch(GlobalActions.incrementLoadingCounter());
    return request;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
});
// intercept all Axios responses and dispatch the DECREMENT_LOADING_COUNTER Action
axios.interceptors.response.use(function (response) {
    decrementLoadingCounter();
    return response;
}, function (error) {
    // The response was rejected, turn off the spinning
    decrementLoadingCounter();
    if (error.response.status === 401) {
        store.dispatch(LoginActions.sessionExpired());
    }
    return Promise.reject(error);
});
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.initializationFinishedHandler = function () {
            _this.setState({ isInitialized: true });
        };
        _this.state = {
            isInitialized: false
        };
        loadRcueCssIfNeeded();
        var Navigator = withRouter(NavigationContainer);
        _this.protectedArea = (React.createElement(Router, { history: history },
            React.createElement(Navigator, null)));
        return _this;
    }
    App.prototype.render = function () {
        return (React.createElement(Provider, { store: store },
            React.createElement(PersistGate, { loading: React.createElement(InitializingScreen, null), persistor: persistor }, this.state.isInitialized ? (React.createElement(AuthenticationControllerContainer, { publicAreaComponent: function (isPostLoginPerforming, errorMsg) { return (React.createElement(LoginPageContainer, { isPostLoginPerforming: isPostLoginPerforming, postLoginErrorMsg: errorMsg })); }, protectedAreaComponent: this.protectedArea })) : (React.createElement(StartupInitializer, { onInitializationFinished: this.initializationFinishedHandler })))));
    };
    return App;
}(React.Component));
export default App;
//# sourceMappingURL=App.js.map