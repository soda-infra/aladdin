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
import _ from 'lodash';
import * as React from 'react';
import { matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, NavList, NavItem, PageSidebar } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import history from '../../app/History';
import { navItems } from '../../routes';
var ExternalLink = function (_a) {
    var href = _a.href, name = _a.name;
    return (React.createElement(NavItem, { isActive: false, key: name },
        React.createElement("a", { className: "pf-c-nav__link", href: href, target: "_blank" },
            name,
            " ",
            React.createElement(ExternalLinkAltIcon, { style: { margin: '-4px 0 0 5px' } }))));
};
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(props) {
        var _this = _super.call(this, props) || this;
        _this.renderMenuItems = function () {
            var location = _this.props.location;
            var activeItem = navItems.find(function (item) {
                var isRoute = matchPath(location.pathname, { path: item.to, exact: true, strict: false }) ? true : false;
                if (!isRoute && item.pathsActive) {
                    isRoute = _.filter(item.pathsActive, function (path) { return path.test(location.pathname); }).length > 0;
                }
                return isRoute;
            });
            return navItems.map(function (item) {
                if (item.title === 'Distributed Tracing' && !_this.props.jaegerIntegration && _this.props.jaegerUrl !== '') {
                    return React.createElement(ExternalLink, { key: item.to, href: _this.props.jaegerUrl, name: "Distributed Tracing" });
                }
                return item.title === 'Distributed Tracing' && _this.props.jaegerUrl === '' ? ('') : (React.createElement(NavItem, { isActive: activeItem === item, key: item.to },
                    React.createElement(Link, { id: item.title, to: item.to, onClick: function () { return history.push(item.to); } }, item.title)));
            });
        };
        _this.state = {
            activeItem: 'Overview'
        };
        return _this;
    }
    Menu.prototype.render = function () {
        var isNavOpen = this.props.isNavOpen;
        var PageNav = (React.createElement(Nav, { onSelect: function () { return undefined; }, onToggle: function () { return undefined; }, "aria-label": "Nav" },
            React.createElement(NavList, null, this.renderMenuItems())));
        return React.createElement(PageSidebar, { isNavOpen: isNavOpen, nav: PageNav });
    };
    Menu.contextTypes = {
        router: function () { return null; }
    };
    return Menu;
}(React.Component));
export default Menu;
//# sourceMappingURL=Menu.js.map