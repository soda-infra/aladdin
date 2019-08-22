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
import { Redirect, Route } from 'react-router-dom';
import SwitchErrorBoundary from '../SwitchErrorBoundary/SwitchErrorBoundary';
import { pathRoutes, defaultRoute, secondaryMastheadRoutes } from '../../routes';
import { style } from 'typestyle';
var containerStyle = style({ marginLeft: 0, marginRight: 0 });
var RenderPage = /** @class */ (function (_super) {
    __extends(RenderPage, _super);
    function RenderPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderPage.prototype.renderPaths = function (paths) {
        return paths.map(function (item, index) {
            return React.createElement(Route, { key: index, path: item.path, component: item.component });
        });
    };
    RenderPage.prototype.renderSecondaryMastheadRoutes = function () {
        return this.renderPaths(secondaryMastheadRoutes);
    };
    RenderPage.prototype.renderPathRoutes = function () {
        return this.renderPaths(pathRoutes);
    };
    RenderPage.prototype.render = function () {
        var component = (React.createElement("div", { className: "container-fluid " + containerStyle },
            React.createElement(SwitchErrorBoundary, { fallBackComponent: function () { return React.createElement("h2", null, "Sorry, there was a problem. Try a refresh or navigate to a different page."); } },
                this.renderPathRoutes(),
                React.createElement(Redirect, { from: "/", to: defaultRoute }))));
        return (React.createElement(React.Fragment, null,
            this.renderSecondaryMastheadRoutes(),
            this.props.needScroll ? React.createElement("div", { id: "content-scrollable" }, component) : component));
    };
    return RenderPage;
}(React.Component));
export default RenderPage;
//# sourceMappingURL=RenderPage.js.map