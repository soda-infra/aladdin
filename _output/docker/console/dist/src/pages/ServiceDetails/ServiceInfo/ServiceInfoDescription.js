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
import { Col, Row } from 'patternfly-react';
import LocalTime from '../../../components/Time/LocalTime';
import { DisplayMode, HealthIndicator } from '../../../components/Health/HealthIndicator';
import { style } from 'typestyle';
import { ConfigIndicator, NOT_VALID, SMALL_SIZE, MEDIUM_SIZE } from '../../../components/ConfigValidation/ConfigIndicator';
import { Popover, OverlayTrigger, Icon, Tooltip } from 'patternfly-react';
import './ServiceInfoDescription.css';
import Labels from '../../../components/Label/Labels';
var listStyle = style({
    listStyleType: 'none',
    padding: 0
});
var labelTitleStyle = style({
    marginBottom: '2px'
});
var labelListStyle = style({
    marginBottom: '4px'
});
var ExternalNameType = 'ExternalName';
var ServiceInfoDescription = /** @class */ (function (_super) {
    __extends(ServiceInfoDescription, _super);
    function ServiceInfoDescription() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServiceInfoDescription.prototype.getValidations = function () {
        return this.props.validations ? this.props.validations : {};
    };
    ServiceInfoDescription.prototype.getPortOver = function (portId) {
        return (React.createElement(Popover, { id: portId + '-config-validation', title: NOT_VALID.name, style: { maxWidth: '80%', minWidth: '200px' } },
            React.createElement("div", null, this.getPortIssue(portId))));
    };
    ServiceInfoDescription.prototype.getPortIssue = function (portId) {
        var message = '';
        if (this.props.validations && this.props.validations.checks) {
            message = this.props.validations.checks
                .filter(function (c) { return c.path === 'spec/ports[' + portId + ']'; })
                .map(function (c) { return c.message; })
                .join(',');
        }
        return message;
    };
    ServiceInfoDescription.prototype.hasIssue = function (portId) {
        return this.getPortIssue(portId) !== '';
    };
    ServiceInfoDescription.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "card-pf" },
            React.createElement("div", { className: "card-pf-body" },
                React.createElement(Row, null,
                    React.createElement(Col, { xs: 12, sm: 6, md: 5, lg: 5 },
                        React.createElement("div", { id: "labels" },
                            React.createElement("div", { className: 'progress-description ' + labelTitleStyle },
                                React.createElement("strong", null, "Labels")),
                            React.createElement("div", { className: 'label-collection ' + labelListStyle },
                                React.createElement(Labels, { labels: this.props.labels || {} }))),
                        React.createElement("div", { id: "selectors" },
                            React.createElement("div", { className: 'progress-description ' + labelTitleStyle },
                                React.createElement("strong", null, "Selectors")),
                            React.createElement("div", { className: 'label-collection ' + labelListStyle },
                                React.createElement(Labels, { labels: this.props.selectors || {} }))),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Type"),
                            " ",
                            this.props.type ? this.props.type : ''),
                        this.props.type !== ExternalNameType ? (React.createElement("div", null,
                            React.createElement("strong", null, "IP"),
                            " ",
                            this.props.ip ? this.props.ip : '')) : (React.createElement("div", null,
                            React.createElement("strong", null, "ExternalName"),
                            " ",
                            this.props.externalName ? this.props.externalName : '')),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Created at"),
                            " ",
                            React.createElement(LocalTime, { time: this.props.createdAt })),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Resource Version"),
                            " ",
                            this.props.resourceVersion),
                        this.props.threeScaleServiceRule && this.props.threeScaleServiceRule.threeScaleHandlerName !== '' && (React.createElement("span", null,
                            "Service linked with 3scale API Handler ",
                            React.createElement("i", null, this.props.threeScaleServiceRule.threeScaleHandlerName)))),
                    React.createElement(Col, { xs: 12, sm: 4, md: 2, lg: 2 },
                        React.createElement("div", { className: "progress-description" },
                            React.createElement(ConfigIndicator, { id: this.props.name + '-config-validation', validations: [this.getValidations()], size: MEDIUM_SIZE }),
                            React.createElement("strong", null, "Ports")),
                        React.createElement("ul", { className: listStyle }, (this.props.ports || []).map(function (port, i) { return (React.createElement("li", { key: 'port_' + i },
                            _this.hasIssue(i) ? (React.createElement(OverlayTrigger, { placement: 'right', overlay: _this.getPortOver(i), trigger: ['hover', 'focus'], rootClose: false },
                                React.createElement("span", { style: { color: NOT_VALID.color } },
                                    React.createElement(Icon, { type: "pf", name: "error-circle-o", style: { fontSize: SMALL_SIZE }, className: "health-icon", tabIndex: "0" })))) : (undefined),
                            port.protocol,
                            " ",
                            port.name,
                            " (",
                            port.port,
                            ")")); }))),
                    React.createElement(Col, { xs: 12, sm: 6, md: 2, lg: 2 },
                        React.createElement("div", { className: "progress-description" },
                            React.createElement("strong", null, "Endpoints")),
                        (this.props.endpoints || []).map(function (endpoint, i) { return (React.createElement(Row, { key: 'endpoint_' + i },
                            React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                                React.createElement("ul", { className: listStyle }, (endpoint.addresses || []).map(function (address, u) {
                                    var id = 'endpoint_' + i + '_address_' + u;
                                    return (React.createElement("li", { key: id },
                                        React.createElement(OverlayTrigger, { overlay: React.createElement(Tooltip, { id: id + '_tooltip' }, address.name), trigger: ['hover', 'focus'], rootClose: false },
                                            React.createElement("strong", null,
                                                address.ip,
                                                " "))));
                                }))))); })),
                    React.createElement(Col, { xs: 12, sm: 6, md: 3, lg: 3 },
                        React.createElement("div", { className: "progress-description" },
                            React.createElement("strong", null, "Health")),
                        React.createElement(HealthIndicator, { id: this.props.name, health: this.props.health, mode: DisplayMode.LARGE, tooltipPlacement: "left" }))))));
    };
    return ServiceInfoDescription;
}(React.Component));
export default ServiceInfoDescription;
//# sourceMappingURL=ServiceInfoDescription.js.map