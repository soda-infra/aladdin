var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import { connect } from 'react-redux';
import { Button, ListItem, LoginFooterItem, LoginForm, LoginPage as LoginNext } from '@patternfly/react-core';
import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { LoginStatus } from '../../store/Store';
import { AuthStrategy } from '../../types/Auth';
import { authenticationConfig, kialiLogo } from '../../config';
import LoginThunkActions from '../../actions/LoginThunkActions';
var LoginPage = /** @class */ (function (_super) {
    __extends(LoginPage, _super);
    function LoginPage(props) {
        var _this = _super.call(this, props) || this;
        _this.handleUsernameChange = function (value) {
            _this.setState({ username: value });
        };
        _this.handlePasswordChange = function (passwordValue) {
            _this.setState({ password: passwordValue });
        };
        _this.handleSubmit = function (e) {
            e.preventDefault();
            if (authenticationConfig.strategy === AuthStrategy.openshift) {
                // If we are using OpenShift OAuth, take the user back to the OpenShift OAuth login
                window.location.href = authenticationConfig.authorizationEndpoint;
            }
            else {
                _this.setState({
                    isValidUsername: !!_this.state.username,
                    isValidPassword: !!_this.state.password,
                    filledInputs: !!_this.state.username && !!_this.state.password
                });
                if (!!_this.state.username && !!_this.state.password && _this.props.authenticate) {
                    _this.props.authenticate(_this.state.username, _this.state.password);
                    _this.setState({ showHelperText: false, errorInput: '' });
                }
                else {
                    var message = 'Invalid login credentials.';
                    message +=
                        !!!_this.state.username && !!!_this.state.password
                            ? 'Username and password are required.'
                            : !!_this.state.username
                                ? 'Password is required.'
                                : 'Username is required.';
                    _this.setState({
                        showHelperText: true,
                        errorInput: message,
                        isValidUsername: false,
                        isValidPassword: false
                    });
                }
            }
        };
        _this.renderMessage = function (message, type) {
            if (!message) {
                return '';
            }
            var variant = type
                ? type
                : _this.props.status === LoginStatus.error || _this.state.filledInputs
                    ? 'danger'
                    : 'warning';
            var icon = variant === 'danger' ? React.createElement(ExclamationCircleIcon, null) : React.createElement(ExclamationTriangleIcon, null);
            return (React.createElement("span", { key: message, style: { color: variant === 'danger' ? '#c00' : '#f0ab00', fontWeight: 'bold', fontSize: 16 } },
                icon,
                "\u00A0 ",
                message));
        };
        _this.getHelperMessage = function () {
            var messages = [];
            if (_this.state.showHelperText) {
                messages.push(_this.renderMessage(_this.state.errorInput));
            }
            if (authenticationConfig.secretMissing) {
                messages.push(_this.renderMessage("The Kiali secret is missing. Users are prohibited from accessing Kiali until an administrator\n          creates a valid secret. Please refer to the Kiali documentation for more details.", 'danger'));
            }
            if (_this.props.status === LoginStatus.expired) {
                messages.push(_this.renderMessage('Your session has expired or was terminated in another window.', 'warning'));
            }
            if (!authenticationConfig.secretMissing && _this.props.status === LoginStatus.error) {
                messages.push(_this.props.message);
            }
            if (_this.props.postLoginErrorMsg) {
                messages.push(_this.renderMessage(_this.props.postLoginErrorMsg));
            }
            return messages;
        };
        _this.state = {
            username: '',
            password: '',
            isValidUsername: true,
            isValidPassword: true,
            filledInputs: false,
            showHelperText: false,
            errorInput: ''
        };
        return _this;
    }
    LoginPage.prototype.componentDidMount = function () {
        // handle initial path from the browser
        this.props.checkCredentials();
        var loginInput = document.getElementById('pf-login-username-id');
        if (loginInput) {
            loginInput.focus();
        }
    };
    LoginPage.prototype.render = function () {
        var _this = this;
        var loginLabel = 'Log In';
        if (authenticationConfig.strategy === AuthStrategy.openshift) {
            loginLabel = 'Log In With OpenShift';
        }
        var messages = this.getHelperMessage();
        var isLoggingIn = this.props.isPostLoginPerforming || this.props.status === LoginStatus.logging;
        // Unfortunately, typescripg typings are wrong in the PatternFly
        // library. So, this casts LoginForm as "any" so that it is
        // possible to use the "isLoginButtonDisabled" property.
        var Form = LoginForm;
        var loginForm = (React.createElement(Form, { usernameLabel: "Username", showHelperText: this.state.showHelperText || this.props.message !== '' || messages.length > 0, helperText: React.createElement(React.Fragment, null, messages), usernameValue: this.state.username, onChangeUsername: this.handleUsernameChange, isValidUsername: this.state.isValidUsername && this.props.status !== LoginStatus.error, passwordLabel: "Password", passwordValue: this.state.password, onChangePassword: this.handlePasswordChange, isValidPassword: this.state.isValidPassword && this.props.status !== LoginStatus.error, rememberMeAriaLabel: "Remember me Checkbox", onLoginButtonClick: function (e) { return _this.handleSubmit(e); }, style: { marginTop: '10px' }, loginButtonLabel: isLoggingIn ? 'Logging in...' : undefined, isLoginButtonDisabled: isLoggingIn || this.props.postLoginErrorMsg }));
        var listItem = (React.createElement(React.Fragment, null,
            React.createElement(ListItem, null,
                React.createElement(LoginFooterItem, { href: "https://www.kiali.io/" }, "Documentation")),
            React.createElement(ListItem, null,
                React.createElement(LoginFooterItem, { href: "https://github.com/kiali/kiali" }, "Contribute"))));
        return (React.createElement(LoginNext, { footerListVariants: "inline", brandImgSrc: kialiLogo, brandImgAlt: "Kiali logo", footerListItems: listItem, textContent: "Service Mesh Observability.", loginTitle: "Log in Aladdin" }, authenticationConfig.strategy === AuthStrategy.login ? (loginForm) : (React.createElement(Button, { onClick: this.handleSubmit, style: { width: '100%' }, variant: "primary" }, loginLabel))));
    };
    LoginPage.contextTypes = {
        store: function () { return null; }
    };
    return LoginPage;
}(React.Component));
export { LoginPage };
var mapStateToProps = function (state) { return ({
    status: state.authentication.status,
    message: state.authentication.message
}); };
var mapDispatchToProps = function (dispatch) { return ({
    authenticate: function (username, password) { return dispatch(LoginThunkActions.authenticate(username, password)); },
    checkCredentials: function () { return dispatch(LoginThunkActions.checkCredentials()); }
}); };
var LoginPageContainer = connect(mapStateToProps, mapDispatchToProps)(LoginPage);
export default LoginPageContainer;
//# sourceMappingURL=LoginPage.js.map