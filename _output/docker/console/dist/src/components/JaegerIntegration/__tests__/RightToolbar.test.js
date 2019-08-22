var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { shallow } from 'enzyme';
import RightToolbar from '../RightToolbar';
import { shallowToJson } from 'enzyme-to-json';
describe('RightToolbar', function () {
    var wrapper, onSubmit;
    beforeEach(function () {
        onSubmit = jest.fn();
        var props = {
            disabled: false,
            onSubmit: onSubmit
        };
        wrapper = shallow(React.createElement(RightToolbar, __assign({}, props)));
    });
    it('renders RightToolbar correctly', function () {
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=RightToolbar.test.js.map