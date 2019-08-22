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
import { connect } from 'react-redux';
import RenderPage from './RenderPage';
import Masthead from './Masthead/Masthead';
import Menu from './Menu';
import { Page, PageHeader, PageSection, Brand } from '@patternfly/react-core';
import { style } from 'typestyle';
import MessageCenterContainer from '../../components/MessageCenter/MessageCenter';
import { kialiLogo, serverConfig } from '../../config';
import UserSettingsThunkActions from '../../actions/UserSettingsThunkActions';
var flexBoxColumnStyle = style({
    display: 'flex',
    flexDirection: 'column'
});
var Navigation = /** @class */ (function (_super) {
    __extends(Navigation, _super);
    function Navigation(props) {
        var _this = _super.call(this, props) || this;
        _this.setControlledState = function (event) {
            if ('navCollapsed' in event) {
                _this.props.setNavCollapsed(_this.props.navCollapsed);
            }
        };
        _this.isContentScrollable = function () {
            return !_this.props.location.pathname.startsWith('/graph');
        };
        _this.onNavToggleDesktop = function () {
            _this.setState({
                isNavOpenDesktop: !_this.state.isNavOpenDesktop
            });
            _this.props.setNavCollapsed(!_this.props.navCollapsed);
        };
        _this.onNavToggleMobile = function () {
            _this.setState({
                isNavOpenMobile: !_this.state.isNavOpenMobile
            });
        };
        _this.onPageResize = function (_a) {
            var mobileView = _a.mobileView, windowSize = _a.windowSize;
            var ismobile = mobileView;
            if (windowSize < 1000) {
                ismobile = true;
            }
            _this.setState({
                isMobileView: ismobile
            });
        };
        _this.state = {
            isMobileView: false,
            isNavOpenDesktop: true,
            isNavOpenMobile: false
        };
        return _this;
    }
    Navigation.prototype.goTojaeger = function () {
        window.open(this.props.jaegerUrl, '_blank');
    };
    Navigation.prototype.componentDidMount = function () {
        document.title = serverConfig.installationTag ? serverConfig.installationTag : 'Kiali Console';
    };
    Navigation.prototype.render = function () {
        var _a = this.state, isNavOpenDesktop = _a.isNavOpenDesktop, isNavOpenMobile = _a.isNavOpenMobile, isMobileView = _a.isMobileView;
        var Header = (React.createElement(PageHeader, { logo: React.createElement(Brand, { src: kialiLogo, alt: "Kiali Logo" }), toolbar: React.createElement(Masthead, null), showNavToggle: true, onNavToggle: isMobileView ? this.onNavToggleMobile : this.onNavToggleDesktop, isNavOpen: isMobileView ? isNavOpenMobile : isNavOpenDesktop || !this.props.navCollapsed }));
        var Sidebar = (React.createElement(Menu, { isNavOpen: isMobileView ? isNavOpenMobile : isNavOpenDesktop || !this.props.navCollapsed, jaegerIntegration: this.props.jaegerIntegration, location: this.props.location, jaegerUrl: this.props.jaegerUrl }));
        return (React.createElement(Page, { header: Header, sidebar: Sidebar, onPageResize: this.onPageResize },
            React.createElement(MessageCenterContainer, { drawerTitle: "Message Center" }),
            React.createElement(PageSection, { className: flexBoxColumnStyle, variant: 'light' },
                React.createElement(RenderPage, { needScroll: this.isContentScrollable() }))));
    };
    Navigation.contextTypes = {
        router: function () { return null; }
    };
    return Navigation;
}(React.Component));
var mapStateToProps = function (state) { return ({
    navCollapsed: state.userSettings.interface.navCollapse,
    jaegerUrl: state.jaegerState ? state.jaegerState.jaegerURL : '',
    jaegerIntegration: state.jaegerState ? state.jaegerState.enableIntegration : false
}); };
var mapDispatchToProps = function (dispatch) { return ({
    setNavCollapsed: function (collapse) { return dispatch(UserSettingsThunkActions.setNavCollapsed(collapse)); }
}); };
var NavigationContainer = connect(mapStateToProps, mapDispatchToProps)(Navigation);
export default NavigationContainer;
//# sourceMappingURL=Navigation.js.map