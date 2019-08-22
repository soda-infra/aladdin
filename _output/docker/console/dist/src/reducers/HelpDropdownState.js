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
import { HelpDropdownActions } from '../actions/HelpDropdownActions';
export var INITIAL_STATUS_STATE = {
    status: {},
    components: [],
    warningMessages: []
};
// This Reducer allows changes to the 'graphDataState' portion of Redux Store
var HelpDropdownState = function (state, action) {
    if (state === void 0) { state = INITIAL_STATUS_STATE; }
    switch (action.type) {
        case getType(HelpDropdownActions.statusRefresh):
            return __assign({}, INITIAL_STATUS_STATE, { status: action.payload.status, components: action.payload.components, warningMessages: action.payload.warningMessages });
        default:
            return state;
    }
};
export default HelpDropdownState;
//# sourceMappingURL=HelpDropdownState.js.map