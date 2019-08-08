import * as React from 'react';
import { shallow } from 'enzyme';
import ServiceInfoWorkload from '../ServiceInfoWorkload';
import { shallowToJson } from 'enzyme-to-json';
var workloads = [
    {
        name: 'reviews-v2',
        type: 'Deployment',
        istioSidecar: true,
        resourceVersion: '081020181987',
        createdAt: '2018-03-14T10:17:52Z"',
        labels: { app: 'reviews', version: 'v2' }
    },
    {
        name: 'reviews-v3',
        type: 'Deployment',
        istioSidecar: true,
        resourceVersion: '081020181987',
        createdAt: '2018-03-14T10:17:52Z"',
        labels: { app: 'reviews', version: 'v3' }
    },
    {
        name: 'reviews-v1',
        type: 'Deployment',
        istioSidecar: true,
        resourceVersion: '081020181987',
        createdAt: '2018-03-14T10:17:52Z"',
        labels: { app: 'reviews', version: 'v1' }
    }
];
describe('#ServiceInfoWorkload render correctly with data', function () {
    it('should render service pods', function () {
        var wrapper = shallow(React.createElement(ServiceInfoWorkload, { workloads: workloads, namespace: 'ns' }));
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=ServiceInfoWorkloads.test.js.map