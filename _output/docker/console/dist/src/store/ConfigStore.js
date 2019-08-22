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
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { persistFilter } from 'redux-persist-transform-filter';
import { createTransform } from 'redux-persist';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
// defaults to localStorage for web and AsyncStorage for react-native
import storage from 'redux-persist/lib/storage';
import { INITIAL_GLOBAL_STATE } from '../reducers/GlobalState';
import { INITIAL_LOGIN_STATE } from '../reducers/LoginState';
import { INITIAL_GRAPH_STATE } from '../reducers/GraphDataState';
import { INITIAL_USER_SETTINGS_STATE } from '../reducers/UserSettingsState';
import { INITIAL_MESSAGE_CENTER_STATE } from '../reducers/MessageCenter';
import { INITIAL_STATUS_STATE } from '../reducers/HelpDropdownState';
import { INITIAL_NAMESPACE_STATE } from '../reducers/NamespaceState';
import { INITIAL_GRAFANA_STATE } from '../reducers/GrafanaState';
import { INITIAL_JAEGER_STATE } from '../reducers/JaegerState';
import { INITIAL_MESH_TLS_STATE } from '../reducers/MeshTlsState';
var webRoot = window.WEB_ROOT ? window.WEB_ROOT : undefined;
var persistKey = 'kiali-' + (webRoot && webRoot !== '/' ? webRoot.substring(1) : 'root');
// Needed to be able to whitelist fields but allowing to keep an initialState
var whitelistInputWithInitialState = function (reducerName, inboundPaths, initialState) {
    return createTransform(function (inboundState) { return persistFilter(inboundState, inboundPaths, 'whitelist'); }, function (outboundState) { return (__assign({}, initialState, outboundState)); }, { whitelist: [reducerName] });
};
var namespacePersistFilter = whitelistInputWithInitialState('namespaces', ['activeNamespaces'], INITIAL_NAMESPACE_STATE);
var persistConfig = {
    key: persistKey,
    storage: storage,
    whitelist: ['namespaces', 'jaegerState', 'statusState'],
    transforms: [namespacePersistFilter]
};
var composeEnhancers = (process.env.NODE_ENV === 'development' && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
var configureStore = function (initialState) {
    // configure middlewares
    var middlewares = [thunk];
    // compose enhancers
    var enhancer = composeEnhancers(applyMiddleware.apply(void 0, middlewares));
    // persist reducers
    var persistentReducer = persistReducer(persistConfig, rootReducer);
    return createStore(persistentReducer, initialState, enhancer);
};
// Setup the initial state of the Redux store with defaults
// (instead of having things be undefined until they are populated by query)
// Redux 4.0 actually required this
var initialStore = {
    globalState: INITIAL_GLOBAL_STATE,
    statusState: INITIAL_STATUS_STATE,
    namespaces: INITIAL_NAMESPACE_STATE,
    authentication: INITIAL_LOGIN_STATE,
    messageCenter: INITIAL_MESSAGE_CENTER_STATE,
    graph: INITIAL_GRAPH_STATE,
    userSettings: INITIAL_USER_SETTINGS_STATE,
    grafanaInfo: INITIAL_GRAFANA_STATE,
    jaegerState: INITIAL_JAEGER_STATE,
    meshTLSStatus: INITIAL_MESH_TLS_STATE
};
// pass an optional param to rehydrate state on app start
export var store = configureStore(initialStore);
export var persistor = persistStore(store);
//# sourceMappingURL=ConfigStore.js.map