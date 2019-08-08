import * as React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import ServiceInfo from '../ServiceInfo';
jest.mock('../../../services/Api');
var API = require('../../../services/Api');
describe('#ServiceInfo render correctly with data', function () {
    it('should render serviceInfo with data', function () {
        return API.getServiceDetail('istio-system', 'reviews', true).then(function (data) {
            var wrapper = shallow(React.createElement(ServiceInfo, { namespace: "istio-system", service: "reviews", serviceDetails: data, gateways: [], validations: data.validations, onRefresh: jest.fn(), onSelectTab: jest.fn(), activeTab: jest.fn(), threeScaleInfo: {
                    enabled: false,
                    permissions: {
                        create: false,
                        update: false,
                        delete: false
                    }
                } }));
            expect(shallowToJson(wrapper)).toBeDefined();
            expect(shallowToJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('ServiceInfoDescription').length === 1).toBeTruthy();
            expect(wrapper.find('InfoRoutes').length === 1).toBeFalsy();
            expect(wrapper.find('ServiceInfoVirtualServices').length === 1).toBeTruthy();
            expect(wrapper.find('ServiceInfoDestinationRules').length === 1).toBeTruthy();
        });
    });
});
//# sourceMappingURL=ServiceInfo.test.js.map