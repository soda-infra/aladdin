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
import { Col, Icon, Row } from 'patternfly-react';
import { checkForPath, globalChecks, highestSeverity, severityToColor, severityToIconName, validationToSeverity } from '../../../types/ServiceInfo';
import LocalTime from '../../../components/Time/LocalTime';
import DetailObject from '../../../components/Details/DetailObject';
import VirtualServiceRoute from './VirtualServiceRoute';
import { Link } from 'react-router-dom';
var VirtualServiceDetail = /** @class */ (function (_super) {
    __extends(VirtualServiceDetail, _super);
    function VirtualServiceDetail() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VirtualServiceDetail.prototype.validation = function (_virtualService) {
        return this.props.validation;
    };
    VirtualServiceDetail.prototype.globalStatus = function (rule) {
        var validation = this.validation(rule);
        if (!validation) {
            return '';
        }
        var checks = globalChecks(validation);
        var severity = validationToSeverity(validation);
        var iconName = severityToIconName(severity);
        var color = severityToColor(severity);
        var message = checks.map(function (check) { return check.message; }).join(',');
        if (!message.length) {
            if (validation && !validation.valid) {
                message = 'Not all checks passed!';
            }
        }
        if (message.length) {
            return (React.createElement("div", null,
                React.createElement("p", { style: { color: color } },
                    React.createElement(Icon, { type: "pf", name: iconName }),
                    " ",
                    message)));
        }
        else {
            return '';
        }
    };
    VirtualServiceDetail.prototype.hostStatusMessage = function (virtualService) {
        var checks = checkForPath(this.validation(virtualService), 'spec/hosts');
        var severity = highestSeverity(checks);
        return {
            message: checks.map(function (check) { return check.message; }).join(','),
            icon: severityToIconName(severity),
            color: severityToColor(severity)
        };
    };
    VirtualServiceDetail.prototype.parseHost = function (host) {
        if (host.includes('/')) {
            var gatewayParts = host.split('/');
            return {
                service: gatewayParts[1],
                namespace: gatewayParts[0]
            };
        }
        var hostParts = host.split('.');
        var h = {
            service: hostParts[0],
            namespace: this.props.namespace
        };
        if (hostParts.length > 1) {
            h.namespace = hostParts[1];
        }
        return h;
    };
    VirtualServiceDetail.prototype.generateGatewaysList = function (gateways) {
        var _this = this;
        var childrenList = [];
        Object.keys(gateways).forEach(function (key, j) {
            var host = _this.parseHost(gateways[key]);
            childrenList.push(React.createElement("li", { key: 'gateway_' + host.service + '_' + j }, host.service === 'mesh' ? (host.service) : (React.createElement(Link, { to: "/namespaces/" + host.namespace + "/istio/gateways/" + host.service }, gateways[key]))));
        });
        return (React.createElement("div", null,
            React.createElement("strong", { className: "text-capitalize" }, "Gateways"),
            React.createElement("ul", { className: 'details' }, childrenList)));
    };
    VirtualServiceDetail.prototype.rawConfig = function (virtualService) {
        return (React.createElement("div", { className: "card-pf-body", key: 'virtualServiceConfig' },
            React.createElement("h4", null,
                "VirtualService: ",
                virtualService.metadata.name),
            React.createElement("div", null, this.globalStatus(virtualService)),
            React.createElement("div", null,
                React.createElement("strong", null, "Created at"),
                ": ",
                React.createElement(LocalTime, { time: virtualService.metadata.creationTimestamp || '' })),
            React.createElement("div", null,
                React.createElement("strong", null, "Resource Version"),
                ": ",
                virtualService.metadata.resourceVersion),
            virtualService.spec.hosts && virtualService.spec.hosts.length > 0 ? (React.createElement(DetailObject, { name: "Hosts", detail: virtualService.spec.hosts, validation: this.hostStatusMessage(virtualService) })) : (undefined),
            virtualService.spec.gateways && virtualService.spec.gateways.length > 0
                ? this.generateGatewaysList(virtualService.spec.gateways)
                : undefined));
    };
    VirtualServiceDetail.prototype.weights = function (virtualService) {
        return (React.createElement(Row, { className: "card-pf-body", key: 'virtualServiceWeights' },
            React.createElement(Col, null,
                virtualService.spec.http && virtualService.spec.http.length > 0 ? (React.createElement(React.Fragment, null,
                    React.createElement(VirtualServiceRoute, { name: virtualService.metadata.name, namespace: virtualService.metadata.namespace || '', kind: "HTTP", routes: virtualService.spec.http, validation: this.props.validation }))) : (undefined),
                virtualService.spec.tcp && virtualService.spec.tcp.length > 0 ? (React.createElement(React.Fragment, null,
                    React.createElement(VirtualServiceRoute, { name: virtualService.metadata.name, namespace: virtualService.metadata.namespace || '', kind: "TCP", routes: virtualService.spec.tcp, validation: this.props.validation }))) : (undefined),
                virtualService.spec.tls && virtualService.spec.tls.length > 0 ? (React.createElement(React.Fragment, null,
                    React.createElement(VirtualServiceRoute, { name: virtualService.metadata.name, namespace: virtualService.metadata.namespace || '', kind: "TLS", routes: virtualService.spec.tls, validation: this.props.validation }))) : (undefined))));
    };
    VirtualServiceDetail.prototype.render = function () {
        return (React.createElement(Row, { className: "row-cards-pf" },
            React.createElement(Col, { xs: 12, sm: 12, md: 3, lg: 3 }, this.rawConfig(this.props.virtualService)),
            React.createElement(Col, { xs: 12, sm: 12, md: 9, lg: 9 }, this.weights(this.props.virtualService))));
    };
    return VirtualServiceDetail;
}(React.Component));
export default VirtualServiceDetail;
//# sourceMappingURL=VirtualServiceDetail.js.map