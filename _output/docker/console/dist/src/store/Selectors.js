import { createSelector } from 'reselect';
import * as GraphData from './Selectors/GraphData';
import { isMTLSEnabled } from '../types/TLSStatus';
var createIdentitySelector = function (selector) {
    return createSelector(selector, function (x) { return x; });
};
// select the proper field from Redux State
var activeNamespaces = function (state) { return state.namespaces.activeNamespaces; };
// Select from the above field(s) and the last function is the formatter
export var activeNamespacesSelector = createIdentitySelector(activeNamespaces);
/**
 * Gets a comma separated list of the namespaces for displaying
 * @type {OutputSelector<KialiAppState, any, (res: Namespace[]) => any>}
 */
export var activeNamespacesAsStringSelector = createSelector(activeNamespaces, function (namespaces) { return namespaces.map(function (namespace) { return namespace.name; }).join(', '); });
var duration = function (state) { return state.userSettings.duration; };
export var durationSelector = createIdentitySelector(duration);
var namespaceFilter = function (state) { return state.namespaces.filter; };
export var namespaceFilterSelector = createIdentitySelector(namespaceFilter);
var edgeLabelMode = function (state) { return state.graph.filterState.edgeLabelMode; };
export var edgeLabelModeSelector = createIdentitySelector(edgeLabelMode);
var findValue = function (state) { return state.graph.filterState.findValue; };
export var findValueSelector = createIdentitySelector(findValue);
var graphType = function (state) { return state.graph.filterState.graphType; };
export var graphTypeSelector = createIdentitySelector(graphType);
var hideValue = function (state) { return state.graph.filterState.hideValue; };
export var hideValueSelector = createIdentitySelector(hideValue);
var namespaceItems = function (state) { return state.namespaces.items; };
export var namespaceItemsSelector = createIdentitySelector(namespaceItems);
var refreshInterval = function (state) { return state.userSettings.refreshInterval; };
export var refreshIntervalSelector = createIdentitySelector(refreshInterval);
var lastRefreshAt = function (state) { return state.globalState.lastRefreshAt; };
export var lastRefreshAtSelector = createIdentitySelector(lastRefreshAt);
var showServiceNodes = function (state) { return state.graph.filterState.showServiceNodes; };
export var showServiceNodesSelector = createIdentitySelector(showServiceNodes);
var showUnusedNodes = function (state) { return state.graph.filterState.showUnusedNodes; };
export var showUnusedNodesSelector = createIdentitySelector(showUnusedNodes);
export var graphDataSelector = GraphData.graphDataSelector;
var meshwideMTLSStatus = function (state) { return state.meshTLSStatus.status; };
export var meshWideMTLSStatusSelector = createIdentitySelector(meshwideMTLSStatus);
var meshwideMTLSEnabled = function (state) { return isMTLSEnabled(state.meshTLSStatus.status); };
export var meshWideMTLSEnabledSelector = createIdentitySelector(meshwideMTLSEnabled);
//# sourceMappingURL=Selectors.js.map