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
import { updateState } from '../utils/Reducer';
import { NamespaceActions } from '../actions/NamespaceAction';
export var INITIAL_NAMESPACE_STATE = {
    activeNamespaces: [],
    isFetching: false,
    items: [],
    lastUpdated: undefined,
    filter: ''
};
var namespaces = function (state, action) {
    if (state === void 0) { state = INITIAL_NAMESPACE_STATE; }
    switch (action.type) {
        case getType(NamespaceActions.toggleActiveNamespace):
            var namespaceIndex = state.activeNamespaces.findIndex(function (namespace) { return namespace.name === action.payload.name; });
            if (namespaceIndex === -1) {
                return updateState(state, {
                    activeNamespaces: state.activeNamespaces.concat([{ name: action.payload.name }])
                });
            }
            else {
                var activeNamespaces = state.activeNamespaces.slice();
                activeNamespaces.splice(namespaceIndex, 1);
                return updateState(state, { activeNamespaces: activeNamespaces });
            }
        case getType(NamespaceActions.setActiveNamespaces):
            return updateState(state, { activeNamespaces: action.payload });
        case getType(NamespaceActions.setFilter):
            return updateState(state, { filter: action.payload });
        case getType(NamespaceActions.requestStarted):
            return updateState(state, {
                isFetching: true
            });
        case getType(NamespaceActions.receiveList):
            var names_1 = action.payload.list.map(function (ns) { return ns.name; });
            var validActive = state.activeNamespaces.filter(function (an) { return names_1.includes(an.name); });
            var updatedActive = {};
            if (state.activeNamespaces.length !== validActive.length) {
                updatedActive = { activeNamespaces: validActive };
            }
            return updateState(state, __assign({ isFetching: false, items: action.payload.list, lastUpdated: action.payload.receivedAt }, updatedActive));
        case getType(NamespaceActions.requestFailed):
            return updateState(state, {
                isFetching: false
            });
        default:
            return state;
    }
};
export default namespaces;
//# sourceMappingURL=NamespaceState.js.map