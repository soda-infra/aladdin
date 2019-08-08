import * as React from 'react';
import { shallow } from 'enzyme';
import Label from '../Label';
import { shallowToJson } from 'enzyme-to-json';
var mockBadge = function (name, value) {
    if (name === void 0) { name = 'my_key'; }
    if (value === void 0) { value = 'my_value'; }
    var component = React.createElement(Label, { value: value, name: name });
    return shallow(component);
};
describe('#Badge render correctly with data', function () {
    it('should render badge', function () {
        var key = 'app';
        var value = 'bookinfo';
        var wrapper = mockBadge(key, value);
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.name()).toEqual('span');
        expect(wrapper.props().className).toEqual('label-pair');
        var labelKey = wrapper.find('Label').getElements()[0];
        var labelValue = wrapper.find('Label').getElements()[1];
        expect(labelKey.props.className).toEqual('label-key');
        expect(labelValue.props.className).toEqual('label-value');
        expect(labelKey.props.children).toEqual(key);
        expect(labelValue.props.children).toEqual(value);
    });
});
//# sourceMappingURL=Label.test.js.map