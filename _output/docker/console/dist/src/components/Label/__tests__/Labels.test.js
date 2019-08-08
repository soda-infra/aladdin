import * as React from 'react';
import { shallow } from 'enzyme';
import Labels from '../Labels';
import { shallowToJson } from 'enzyme-to-json';
var mockBadge = function (labels) {
    var component = React.createElement(Labels, { labels: labels });
    return shallow(component);
};
describe('#Labels render correctly with data', function () {
    it('should render badges with More labels link', function () {
        var wrapper = mockBadge({
            app: 'bookinfo',
            version: 'v1',
            env: 'prod',
            team: 'A'
        });
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    it('should render badges without More labels link', function () {
        var wrapper = mockBadge({
            app: 'bookinfo',
            version: 'v1'
        });
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=Labels.test.js.map