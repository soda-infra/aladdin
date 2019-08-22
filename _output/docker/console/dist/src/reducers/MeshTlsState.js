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
import { MeshTlsActions } from '../actions/MeshTlsActions';
export var INITIAL_MESH_TLS_STATE = {
    status: ''
};
// This Reducer allows changes to the 'graphDataState' portion of Redux Store
var MeshTlsState = function (state, action) {
    if (state === void 0) { state = INITIAL_MESH_TLS_STATE; }
    switch (action.type) {
        case getType(MeshTlsActions.setinfo):
            return __assign({}, INITIAL_MESH_TLS_STATE, { status: action.payload.status });
        default:
            return state;
    }
};
export default MeshTlsState;
//# sourceMappingURL=MeshTlsState.js.map