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
import { Link } from 'react-router-dom';
import { Icon, OverlayTrigger, Tooltip } from 'patternfly-react';
import { style } from 'typestyle';
import { Paths } from '../../config';
var iconStyle = style({
    paddingLeft: 10,
    paddingRight: 10
});
var OverviewCardLinks = /** @class */ (function (_super) {
    __extends(OverviewCardLinks, _super);
    function OverviewCardLinks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OverviewCardLinks.prototype.render = function () {
        return (React.createElement("div", { style: { marginTop: '10px' } },
            React.createElement(OverlayTrigger, { key: "ot_graph", placement: "top", overlay: React.createElement(Tooltip, { id: "tt_graph" }, "Go to graph") },
                React.createElement(Link, { to: "/graph/namespaces?namespaces=" + this.props.name },
                    React.createElement(Icon, { type: "pf", name: "topology", className: iconStyle }))),
            React.createElement(OverlayTrigger, { key: "ot_apps", placement: "top", overlay: React.createElement(Tooltip, { id: "tt_apps" }, "Go to applications") },
                React.createElement(Link, { to: "/" + Paths.APPLICATIONS + "?namespaces=" + this.props.name },
                    React.createElement(Icon, { type: "pf", name: "applications", className: iconStyle }))),
            React.createElement(OverlayTrigger, { key: "ot_workloads", placement: "top", overlay: React.createElement(Tooltip, { id: "tt_workloads" }, "Go to workloads") },
                React.createElement(Link, { to: "/" + Paths.WORKLOADS + "?namespaces=" + this.props.name },
                    React.createElement(Icon, { type: "pf", name: "bundle", className: iconStyle }))),
            React.createElement(OverlayTrigger, { key: "ot_services", placement: "top", overlay: React.createElement(Tooltip, { id: "tt_services" }, "Go to services") },
                React.createElement(Link, { to: "/" + Paths.SERVICES + "?namespaces=" + this.props.name },
                    React.createElement(Icon, { type: "pf", name: "service", className: iconStyle }))),
            React.createElement(OverlayTrigger, { key: "ot_istio", placement: "top", overlay: React.createElement(Tooltip, { id: "tt_istio" }, "Go to Istio config") },
                React.createElement(Link, { to: "/" + Paths.ISTIO + "?namespaces=" + this.props.name },
                    React.createElement(Icon, { type: "pf", name: "template", className: iconStyle })))));
    };
    return OverviewCardLinks;
}(React.Component));
export default OverviewCardLinks;
//# sourceMappingURL=OverviewCardLinks.js.map