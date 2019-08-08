import * as React from 'react';
import { shallow } from 'enzyme';
import ItemDescription from '../ItemDescription';
import { ServiceHealth } from '../../../types/Health';
var health = new ServiceHealth({ errorRatio: 0.1, inboundErrorRatio: 0.17, outboundErrorRatio: -1 }, { rateInterval: 60, hasSidecar: true });
describe('ItemDescription', function () {
    var resolver;
    var item;
    beforeEach(function () {
        resolver = undefined;
        item = {
            name: 'svc',
            namespace: 'ns',
            istioSidecar: false,
            healthPromise: new Promise(function (r) { return (resolver = r); }),
            validation: {}
        };
    });
    it('should render with promise resolving', function () {
        var wrapper = shallow(React.createElement(ItemDescription, { item: item }));
        expect(wrapper.text()).toBe('');
        resolver(health);
        return new Promise(function (r) { return setImmediate(r); }).then(function () {
            wrapper.update();
            expect(wrapper.find('HealthIndicator')).toHaveLength(1);
        });
    });
});
//# sourceMappingURL=ItemDescription.test.js.map