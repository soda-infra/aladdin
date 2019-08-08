import { updateState } from '../utils/Reducer';
import { GlobalActions } from '../actions/GlobalActions';
import { getType } from 'typesafe-actions';
export var INITIAL_GLOBAL_STATE = {
    loadingCounter: 0,
    isPageVisible: true,
    lastRefreshAt: 0
};
// This Reducer allows changes to the 'globalState' portion of Redux Store
var globalState = function (state, action) {
    if (state === void 0) { state = INITIAL_GLOBAL_STATE; }
    switch (action.type) {
        case getType(GlobalActions.incrementLoadingCounter):
            return updateState(state, { loadingCounter: state.loadingCounter + 1 });
        case getType(GlobalActions.decrementLoadingCounter):
            return updateState(state, { loadingCounter: Math.max(0, state.loadingCounter - 1) });
        case getType(GlobalActions.setPageVisibilityHidden):
            return updateState(state, { isPageVisible: false });
        case getType(GlobalActions.setPageVisibilityVisible):
            return updateState(state, { isPageVisible: true });
        case getType(GlobalActions.setLastRefreshAt):
            return updateState(state, { lastRefreshAt: action.payload });
        default:
            return state;
    }
};
export default globalState;
//# sourceMappingURL=GlobalState.js.map