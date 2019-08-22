import JaegerState from '../JaegerState';
import { JaegerActions } from '../../actions/JaegerActions';
var initialState = {
    jaegerURL: '',
    enableIntegration: false
};
describe('JaegerState reducer', function () {
    var expectedState;
    beforeEach(function () {
        expectedState = initialState;
    });
    it('should set url', function () {
        var url = 'https://jaeger-query-istio-system.127.0.0.1.nip.io';
        expectedState.jaegerURL = url;
        expect(JaegerState(initialState, JaegerActions.setUrl(url))).toEqual(expectedState);
    });
    it('should enable integration', function () {
        expectedState.enableIntegration = true;
        expect(JaegerState(initialState, JaegerActions.setEnableIntegration(true))).toEqual(expectedState);
    });
    it('should store both url and integration', function () {
        var url = 'https://jaeger-query-istio-system.127.0.0.1.nip.io';
        expectedState.enableIntegration = true;
        expectedState.jaegerURL = url;
        expect(JaegerState(initialState, JaegerActions.setinfo({ jaegerURL: url, enableIntegration: true }))).toEqual(expectedState);
    });
});
//# sourceMappingURL=JaegerStateReducer.test.js.map