import * as Api from '../services/Api';
import { NamespaceActions } from './NamespaceAction';
var shouldFetchNamespaces = function (state) {
    if (!state) {
        return true;
    }
    else {
        return !state.namespaces.isFetching;
    }
};
var NamespaceThunkActions = {
    asyncFetchNamespaces: function () {
        return function (dispatch) {
            dispatch(NamespaceActions.requestStarted());
            return Api.getNamespaces()
                .then(function (response) { return response.data; })
                .then(function (data) {
                dispatch(NamespaceActions.receiveList(data.slice(), new Date()));
            })
                .catch(function () { return dispatch(NamespaceActions.requestFailed()); });
        };
    },
    fetchNamespacesIfNeeded: function () {
        // Note that the function also receives getState()
        // which lets you choose what to dispatch next.
        // This is useful for avoiding a network request if
        // a cached value is already available.
        return function (dispatch, getState) {
            if (shouldFetchNamespaces(getState())) {
                var state = getState().authentication;
                if (!state || !state.session) {
                    return Promise.resolve();
                }
                // Dispatch a thunk from thunk!
                return dispatch(NamespaceThunkActions.asyncFetchNamespaces());
            }
            else {
                // Let the calling code know there's nothing to wait for.
                return Promise.resolve();
            }
        };
    }
};
export default NamespaceThunkActions;
//# sourceMappingURL=NamespaceThunkActions.js.map