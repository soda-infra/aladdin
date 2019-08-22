import { createAction, createStandardAction } from 'typesafe-actions';
import { ActionKeys } from './ActionKeys';
// synchronous action creators
export var JaegerActions = {
    setUrl: createAction(ActionKeys.JAEGER_SET_URL, function (resolve) { return function (url) {
        return resolve({
            url: url
        });
    }; }),
    setEnableIntegration: createStandardAction(ActionKeys.JAEGER_SET_ENABLE_INTEGRATION)(),
    setinfo: createStandardAction(ActionKeys.JAEGER_SET_INFO)()
};
//# sourceMappingURL=JaegerActions.js.map