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
import { JaegerToolbar } from '../JaegerToolbar';
import { FormControl } from 'patternfly-react';
describe('LookBack', function () {
    var wrapper, requestSearchURL, updateURL;
    beforeEach(function () {
        requestSearchURL = jest.fn();
        updateURL = jest.fn();
        var props = {
            disableSelector: false,
            tagsValue: '',
            disabled: false,
            limit: 0,
            requestSearchURL: requestSearchURL,
            updateURL: updateURL,
            urlJaeger: '',
            serviceSelected: 'details.bookinfo'
        };
        wrapper = shallow(React.createElement(JaegerToolbar, __assign({}, props)));
    });
    it('renders JaegerToolbar correctly', function () {
        expect(wrapper).toBeDefined();
    });
    it('renders JaegerToolbar correctly without namespace selector', function () {
        wrapper.setProps({ disableSelector: true });
        expect(wrapper).toBeDefined();
    });
    describe('Form', function () {
        it('FormControl should be disabled', function () {
            wrapper.find(FormControl).forEach(function (f) {
                expect(f.props().disabled).toBeFalsy();
            });
            wrapper.setProps({ disabled: true });
            wrapper.find(FormControl).forEach(function (f) {
                expect(f.props().disabled).toBeTruthy();
            });
        });
    });
});
//# sourceMappingURL=JaegerToolbar.test.js.map