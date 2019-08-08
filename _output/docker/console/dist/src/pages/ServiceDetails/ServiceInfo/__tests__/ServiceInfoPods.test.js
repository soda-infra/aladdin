import * as React from 'react';
import { shallow } from 'enzyme';
import ServiceInfoPods from '../ServiceInfoPods';
import { shallowToJson } from 'enzyme-to-json';
var pods = [
    {
        name: 'reviews-v2-1234',
        labels: { app: 'reviews', version: 'v2' },
        createdAt: '2018-03-14T10:17:52Z',
        createdBy: [],
        status: '',
        appLabel: false,
        versionLabel: false
    },
    {
        name: 'reviews-v3-1234',
        labels: { app: 'reviews', version: 'v3' },
        createdAt: '2018-03-14T10:17:52Z',
        createdBy: [],
        status: '',
        appLabel: false,
        versionLabel: false
    },
    {
        name: 'reviews-v1-1234',
        labels: { app: 'reviews', version: 'v1' },
        createdAt: '2018-03-14T10:17:52Z',
        createdBy: [],
        status: '',
        appLabel: false,
        versionLabel: false
    }
];
// Mocking "toLocaleString", which is used for dates display
//  since it may produce different results on CI and dev machines, breaking snapshots.
Date.prototype.toLocaleString = jest.fn(Date.prototype.toISOString);
describe('#ServiceInfoPods render correctly with data', function () {
    it('should render service pods', function () {
        var wrapper = shallow(React.createElement(ServiceInfoPods, { pods: pods }));
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=ServiceInfoPods.test.js.map