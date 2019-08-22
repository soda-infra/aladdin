import * as React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { HealthDetails } from '../HealthDetails';
import { ServiceHealth } from '../../../types/Health';
describe('HealthDetails', function () {
    it('renders healthy', function () {
        var health = new ServiceHealth({ errorRatio: -1, inboundErrorRatio: -1, outboundErrorRatio: -1 }, { rateInterval: 60, hasSidecar: true });
        var wrapper = shallow(React.createElement(HealthDetails, { health: health }));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    it('renders deployments failure', function () {
        var health = new ServiceHealth({ errorRatio: -1, inboundErrorRatio: -1, outboundErrorRatio: -1 }, { rateInterval: 60, hasSidecar: true });
        var wrapper = shallow(React.createElement(HealthDetails, { health: health }));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=HealthDetails.test.js.map