import * as React from 'react';
import { shallow } from 'enzyme';
import { TagsControl } from '../TagsControl';
import { shallowToJson } from 'enzyme-to-json';
describe('TagsControls', function () {
    var wrapper, onChangeMock;
    beforeEach(function () {
        onChangeMock = jest.fn();
        wrapper = shallow(React.createElement(TagsControl, { onChange: onChangeMock, disable: false, tags: '' }));
    });
    it('renders TagsControl correctly', function () {
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=TagsControl.test.js.map