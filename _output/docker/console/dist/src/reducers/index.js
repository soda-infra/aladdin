import { combineReducers } from 'redux';
import messageCenter from './MessageCenter';
import loginState from './LoginState';
import HelpDropdownState from './HelpDropdownState';
import graphDataState from './GraphDataState';
import globalState from './GlobalState';
import namespaceState from './NamespaceState';
import UserSettingsState from './UserSettingsState';
import GrafanaState from './GrafanaState';
import JaegerState from './JaegerState';
import MeshTlsState from './MeshTlsState';
var rootReducer = combineReducers({
    authentication: loginState,
    globalState: globalState,
    grafanaInfo: GrafanaState,
    graph: graphDataState,
    messageCenter: messageCenter,
    namespaces: namespaceState,
    statusState: HelpDropdownState,
    userSettings: UserSettingsState,
    jaegerState: JaegerState,
    meshTLSStatus: MeshTlsState
});
export default rootReducer;
//# sourceMappingURL=index.js.map