import { mergeJsonPatch } from '../IstioConfigUtils';
describe('Validate JSON Patchs', function () {
    var gateway = {
        kind: 'Gateway',
        namespace: {
            name: 'bookinfo'
        },
        spec: {
            selector: {
                istio: 'ingressgateway'
            },
            servers: [
                {
                    port: {
                        number: 80,
                        name: 'http',
                        protocol: 'HTTP'
                    },
                    hosts: ['*']
                }
            ]
        }
    };
    var gatewayModified = {
        apiVersion: 'networking.istio.io/v1alpha3',
        kind: 'Gateway',
        spec: {
            selector: {
                app: 'myapp'
            },
            servers: [
                {
                    port: {
                        number: 80,
                        name: 'http',
                        protocol: 'HTTP'
                    },
                    hosts: ['*']
                }
            ]
        }
    };
    it('Dummy test', function () {
        mergeJsonPatch(gatewayModified, gateway);
        // tslint:disable-next-line
        expect(gatewayModified['namespace']).toBeNull();
        // tslint:disable-next-line
        expect(gatewayModified['spec']['selector']['istio']).toBeNull();
    });
});
//# sourceMappingURL=IstioConfigUtils.test.js.map