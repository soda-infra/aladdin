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
import { shallowToJson } from 'enzyme-to-json';
import { LoginPage } from '../LoginPage';
import { LoginStatus } from '../../../store/Store';
var LoginProps = {
    status: LoginStatus.loggedOut,
    authenticate: jest.fn(),
    checkCredentials: jest.fn(),
    isPostLoginPerforming: false
};
var wrapper = shallow(React.createElement(LoginPage, __assign({}, LoginProps)));
var username = 'admin';
var password = 'admin';
describe('#LoginPage render correctly', function () {
    it('should render LoginPage', function () {
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    it('should have a handles methods defined', function () {
        var instance = wrapper.instance();
        expect('handleUsernameChange' in instance).toBeTruthy();
        expect('handlePasswordChange' in instance).toBeTruthy();
        expect('handleSubmit' in instance).toBeTruthy();
    });
    it('handleChange should change state', function () {
        var instance = wrapper.instance();
        instance.handleUsernameChange(username);
        expect(instance.state.username).toBe(username);
        instance.handlePasswordChange(password);
        expect(instance.state.password).toBe(password);
    });
    it('handleSubmit should call authenticate', function () {
        var instance = wrapper.instance();
        instance.setState({ username: username, password: password });
        var spy = jest.spyOn(instance.props, 'authenticate');
        var event = {
            preventDefault: function () {
                return null;
            }
        };
        instance.handleSubmit(event);
        expect(spy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=LoginPage.test.js.map