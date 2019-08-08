import { updateState } from '../utils/Reducer';
import { getType } from 'typesafe-actions';
import { JaegerActions } from '../actions/JaegerActions';
export var INITIAL_JAEGER_STATE = {
    jaegerURL: '',
    enableIntegration: false
};
var JaegerStateGenerator = function (state, action) {
    if (state === void 0) { state = INITIAL_JAEGER_STATE; }
    switch (action.type) {
        case getType(JaegerActions.setEnableIntegration):
            return updateState(state, {
                enableIntegration: action.payload
            });
        case getType(JaegerActions.setUrl):
            return updateState(state, {
                jaegerURL: action.payload.url
            });
        case getType(JaegerActions.setinfo):
            if (!action.payload) {
                return null;
            }
            return updateState(state, {
                jaegerURL: action.payload.jaegerURL,
                enableIntegration: action.payload.enableIntegration
            });
        default:
            return state;
    }
};
export default JaegerStateGenerator;
//# sourceMappingURL=JaegerState.js.map