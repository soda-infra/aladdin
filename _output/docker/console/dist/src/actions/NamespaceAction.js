import { createAction, createStandardAction } from 'typesafe-actions';
import { ActionKeys } from './ActionKeys';
export var NamespaceActions = {
    toggleActiveNamespace: createStandardAction(ActionKeys.TOGGLE_ACTIVE_NAMESPACE)(),
    setActiveNamespaces: createStandardAction(ActionKeys.SET_ACTIVE_NAMESPACES)(),
    setFilter: createStandardAction(ActionKeys.NAMESPACE_SET_FILTER)(),
    requestStarted: createAction(ActionKeys.NAMESPACE_REQUEST_STARTED),
    requestFailed: createAction(ActionKeys.NAMESPACE_FAILED),
    receiveList: createAction(ActionKeys.NAMESPACE_SUCCESS, function (resolve) { return function (newList, receivedAt) {
        return resolve({
            list: newList,
            receivedAt: receivedAt
        });
    }; })
};
//# sourceMappingURL=NamespaceAction.js.map