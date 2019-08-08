import * as API from '../Api';
describe('#GetErrorMessage', function () {
    var errormsg = 'Error sample';
    it('should return an error message with status', function () {
        var axErr = {
            config: { method: 'GET' },
            name: 'AxiosError',
            message: 'Error in Response',
            response: {
                data: null,
                status: 400,
                statusText: 'InternalError',
                headers: null,
                config: {}
            }
        };
        expect(API.getErrorMsg(errormsg, axErr)).toEqual(errormsg + ", Error: [ InternalError ]");
    });
    it('should return an error message with data', function () {
        var responseServerError = 'Internal Error';
        var axErr = {
            config: { method: 'GET' },
            name: 'AxiosError',
            message: 'Error in Response',
            response: {
                data: { error: responseServerError },
                status: 400,
                statusText: 'InternalError',
                headers: null,
                config: {}
            }
        };
        expect(API.getErrorMsg(errormsg, axErr)).toEqual(errormsg + ", Error: [ " + responseServerError + " ]");
    });
    it('should return specific error message for unauthorized', function () {
        var axErr = {
            config: { method: 'GET' },
            name: 'AxiosError',
            message: 'Error in Response',
            response: {
                data: null,
                status: 401,
                statusText: 'Unauthorized',
                headers: null,
                config: {}
            }
        };
        expect(API.getErrorMsg(errormsg, axErr)).toEqual(errormsg + ", Error: [ Unauthorized ] Has your session expired? Try logging in again.");
    });
});
describe('#Test Methods return a Promise', function () {
    var evaluatePromise = function (result) {
        expect(result).toBeDefined();
        expect(typeof result).toEqual('object');
        expect(typeof result.then).toEqual('function');
        expect(typeof result.catch).toEqual('function');
    };
    it('#login', function () {
        var result = API.login({ username: 'admin', password: 'admin' });
        evaluatePromise(result);
    });
    it('#getStatus', function () {
        var result = API.getStatus();
        evaluatePromise(result);
    });
    it('#getNamespaces', function () {
        var result = API.getNamespaces();
        evaluatePromise(result);
    });
    it('#getNamespaceMetrics', function () {
        var result = API.getNamespaceMetrics('istio-system', {});
        evaluatePromise(result);
    });
    it('#getServices', function () {
        var result = API.getServices('istio-system');
        evaluatePromise(result);
    });
    it('#getAppMetrics', function () {
        var result = API.getAppMetrics('istio-system', 'book-info', {});
        evaluatePromise(result);
    });
    it('#getServiceHealth', function () {
        var result = API.getServiceHealth('istio-system', 'book-info', 60, true);
        evaluatePromise(result);
    });
    it('#getGrafanaInfo', function () {
        var result = API.getGrafanaInfo();
        evaluatePromise(result);
    });
    it('#getJaegerInfo', function () {
        var result = API.getJaegerInfo();
        evaluatePromise(result);
    });
    it('#getGraphElements', function () {
        var result = API.getGraphElements({ namespaces: 'istio-system' });
        evaluatePromise(result);
    });
    it('#getServiceDetail', function () {
        var result = API.getServiceDetail('istio-system', '', false);
        evaluatePromise(result);
    });
});
//# sourceMappingURL=ApiMethods.test.tsx.js.map