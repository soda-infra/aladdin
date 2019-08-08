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
import * as React from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { SessionTimeout } from '../../SessionTimeout/SessionTimeout';
import { config } from '../../../config';
import { MILLISECONDS } from '../../../types/Common';
import authenticationConfig from '../../../config/AuthenticationConfig';
import { AuthStrategy } from '../../../types/Auth';
import moment from 'moment';
import LoginThunkActions from '../../../actions/LoginThunkActions';
import { connect } from 'react-redux';
import * as API from '../../../services/Api';
var UserDropdownConnected = /** @class */ (function (_super) {
    __extends(UserDropdownConnected, _super);
    function UserDropdownConnected(props) {
        var _this = _super.call(this, props) || this;
        _this.timeLeft = function () {
            var expiresOn = moment(_this.props.session.expiresOn);
            if (expiresOn <= moment()) {
                _this.props.logout();
            }
            return expiresOn.diff(moment());
        };
        _this.checkSession = function () {
            if (_this.timeLeft() < config.session.timeOutforWarningUser) {
                _this.setState({ showSessionTimeOut: true });
            }
        };
        _this.handleLogout = function (e) {
            e.preventDefault();
            if (authenticationConfig.logoutEndpoint) {
                API.logout();
                document.getElementById('openshiftlogout').submit();
            }
            else {
                _this.props.logout();
            }
        };
        _this.extendSession = function (session) {
            _this.props.extendSession(session);
            _this.setState({ showSessionTimeOut: false });
        };
        _this.onDropdownToggle = function (isDropdownOpen) {
            _this.setState({
                isDropdownOpen: isDropdownOpen
            });
        };
        _this.onDropdownSelect = function (_event) {
            _this.setState({
                isDropdownOpen: !_this.state.isDropdownOpen
            });
        };
        _this.dismissHandler = function () {
            _this.setState({ isSessionTimeoutDismissed: true });
        };
        _this.state = {
            showSessionTimeOut: false,
            timeCountDownSeconds: _this.timeLeft() / MILLISECONDS,
            isSessionTimeoutDismissed: false,
            isDropdownOpen: false
        };
        return _this;
    }
    UserDropdownConnected.prototype.componentDidMount = function () {
        var _this = this;
        var checkSessionTimerId = setInterval(function () {
            _this.checkSession();
        }, 3000);
        var timeLeftTimerId = setInterval(function () {
            _this.setState({ timeCountDownSeconds: _this.timeLeft() / MILLISECONDS });
        }, 1000);
        this.setState({
            checkSessionTimerId: checkSessionTimerId,
            timeLeftTimerId: timeLeftTimerId
        });
    };
    UserDropdownConnected.prototype.componentWillUnmount = function () {
        if (this.state.checkSessionTimerId) {
            clearInterval(this.state.checkSessionTimerId);
        }
        if (this.state.timeLeftTimerId) {
            clearInterval(this.state.timeLeftTimerId);
        }
    };
    UserDropdownConnected.prototype.render = function () {
        var isDropdownOpen = this.state.isDropdownOpen;
        var isAnonymous = authenticationConfig.strategy === AuthStrategy.anonymous;
        var userDropdownItems = (React.createElement(DropdownItem, { key: 'user_logout_option', onClick: this.handleLogout, isDisabled: isAnonymous }, "Logout"));
        return (React.createElement(React.Fragment, null,
            React.createElement(SessionTimeout, { onLogout: this.props.logout, onExtendSession: this.extendSession, onDismiss: this.dismissHandler, show: this.state.showSessionTimeOut && !this.state.isSessionTimeoutDismissed, timeOutCountDown: this.state.timeCountDownSeconds }),
            this.props.session && (React.createElement(Dropdown, { isPlain: true, position: "right", onSelect: this.onDropdownSelect, isOpen: isDropdownOpen, toggle: React.createElement(DropdownToggle, { onToggle: this.onDropdownToggle }, this.props.session.username), dropdownItems: [userDropdownItems] })),
            authenticationConfig.strategy === AuthStrategy.openshift && authenticationConfig.logoutEndpoint && (React.createElement("form", { id: "openshiftlogout", action: authenticationConfig.logoutEndpoint, method: "post" },
                React.createElement("input", { type: "hidden", name: "then", value: authenticationConfig.logoutRedirect })))));
    };
    return UserDropdownConnected;
}(React.Component));
var mapStateToProps = function (state) { return ({
    session: state.authentication.session
}); };
var mapDispatchToProps = function (dispatch) { return ({
    logout: function () { return dispatch(LoginThunkActions.logout()); },
    extendSession: function (session) { return dispatch(LoginThunkActions.extendSession(session)); },
    checkCredentials: function () { return dispatch(LoginThunkActions.checkCredentials()); }
}); };
var UserDropdown = connect(mapStateToProps, mapDispatchToProps)(UserDropdownConnected);
export default UserDropdown;
//# sourceMappingURL=UserDropdown.js.map