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
import { style } from 'typestyle';
import { Col, Icon, Nav, NavItem, Row, TabContainer, TabContent, ToastNotification, ToastNotificationList } from 'patternfly-react';
import ServiceInfoDescription from './ServiceInfo/ServiceInfoDescription';
import { severityToIconName, validationToSeverity } from '../../types/ServiceInfo';
import ServiceInfoVirtualServices from './ServiceInfo/ServiceInfoVirtualServices';
import ServiceInfoDestinationRules from './ServiceInfo/ServiceInfoDestinationRules';
import ServiceInfoWorkload from './ServiceInfo/ServiceInfoWorkload';
import { TabPaneWithErrorBoundary } from '../../components/ErrorBoundary/WithErrorBoundary';
import IstioWizardDropdown from '../../components/IstioWizards/IstioWizardDropdown';
import { DurationDropdownContainer } from '../../components/DurationDropdown/DurationDropdown';
import RefreshButtonContainer from '../../components/Refresh/RefreshButton';
var tabName = 'list';
var tabIconStyle = style({
    fontSize: '0.9em'
});
var ServiceInfo = /** @class */ (function (_super) {
    __extends(ServiceInfo, _super);
    function ServiceInfo(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            error: false,
            errorMessage: ''
        };
        return _this;
    }
    ServiceInfo.prototype.validationChecks = function () {
        var validationChecks = {
            hasVirtualServiceChecks: false,
            hasDestinationRuleChecks: false
        };
        var validations = this.props.validations || {};
        validationChecks.hasVirtualServiceChecks = this.props.serviceDetails.virtualServices.items.some(function (virtualService) {
            return validations.virtualservice &&
                validations.virtualservice[virtualService.metadata.name] &&
                validations.virtualservice[virtualService.metadata.name].checks &&
                validations.virtualservice[virtualService.metadata.name].checks.length > 0;
        });
        validationChecks.hasDestinationRuleChecks = this.props.serviceDetails.destinationRules.items.some(function (destinationRule) {
            return validations.destinationrule &&
                destinationRule.metadata &&
                validations.destinationrule[destinationRule.metadata.name] &&
                validations.destinationrule[destinationRule.metadata.name].checks &&
                validations.destinationrule[destinationRule.metadata.name].checks.length > 0;
        });
        return validationChecks;
    };
    ServiceInfo.prototype.errorBoundaryMessage = function (resourceName) {
        return "One of the " + resourceName + " associated to this service has an invalid format";
    };
    ServiceInfo.prototype.getServiceValidation = function () {
        if (this.props.validations && this.props.validations.service) {
            return this.props.validations.service[this.props.serviceDetails.service.name];
        }
        return {};
    };
    ServiceInfo.prototype.render = function () {
        var _this = this;
        var workloads = this.props.serviceDetails.workloads || [];
        var virtualServices = this.props.serviceDetails.virtualServices || [];
        var destinationRules = this.props.serviceDetails.destinationRules || [];
        var validations = this.props.validations || {};
        var validationChecks = this.validationChecks();
        var getSeverityIcon = function (severity) {
            if (severity === void 0) { severity = 'error'; }
            return (React.createElement("span", { className: tabIconStyle },
                ' ',
                React.createElement(Icon, { type: "pf", name: severityToIconName(severity) })));
        };
        var getValidationIcon = function (keys, type) {
            var severity = 'warning';
            keys.forEach(function (key) {
                var validationsForIcon = (_this.props.validations || {})[type][key];
                if (validationToSeverity(validationsForIcon) === 'error') {
                    severity = 'error';
                }
            });
            return getSeverityIcon(severity);
        };
        return (React.createElement("div", null,
            this.state.error ? (React.createElement(ToastNotificationList, null,
                React.createElement(ToastNotification, { type: "danger" },
                    React.createElement("span", null,
                        React.createElement("strong", null, "Error "),
                        this.state.errorMessage)))) : null,
            React.createElement("div", { className: "container-fluid container-cards-pf" },
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                        React.createElement("span", { style: { float: 'right' } },
                            React.createElement(DurationDropdownContainer, { id: "service-info-duration-dropdown" }),
                            ' ',
                            React.createElement(RefreshButtonContainer, { handleRefresh: this.props.onRefresh }),
                            "\u00A0",
                            React.createElement(IstioWizardDropdown, { namespace: this.props.namespace, serviceName: this.props.serviceDetails.service.name, show: false, workloads: workloads, virtualServices: virtualServices, destinationRules: destinationRules, gateways: this.props.gateways, tlsStatus: this.props.serviceDetails.namespaceMTLS, onChange: this.props.onRefresh, threeScaleInfo: this.props.threeScaleInfo, threeScaleServiceRule: this.props.threeScaleServiceRule })))),
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                        React.createElement(ServiceInfoDescription, { name: this.props.serviceDetails.service.name, namespace: this.props.namespace, createdAt: this.props.serviceDetails.service.createdAt, resourceVersion: this.props.serviceDetails.service.resourceVersion, istioEnabled: this.props.serviceDetails.istioSidecar, labels: this.props.serviceDetails.service.labels, selectors: this.props.serviceDetails.service.selectors, ports: this.props.serviceDetails.service.ports, type: this.props.serviceDetails.service.type, ip: this.props.serviceDetails.service.ip, endpoints: this.props.serviceDetails.endpoints, health: this.props.serviceDetails.health, externalName: this.props.serviceDetails.service.externalName, threeScaleServiceRule: this.props.threeScaleServiceRule, validations: this.getServiceValidation() }))),
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                        React.createElement(TabContainer, { id: "service-tabs", activeKey: this.props.activeTab(tabName, 'workloads'), onSelect: this.props.onSelectTab(tabName) },
                            React.createElement("div", null,
                                React.createElement(Nav, { bsClass: "nav nav-tabs nav-tabs-pf" },
                                    React.createElement(NavItem, { eventKey: 'workloads' }, 'Workloads (' + Object.keys(workloads).length + ')'),
                                    React.createElement(NavItem, { eventKey: 'virtualservices' },
                                        'Virtual Services (' + virtualServices.items.length + ')',
                                        validationChecks.hasVirtualServiceChecks
                                            ? getValidationIcon((this.props.serviceDetails.virtualServices.items || []).map(function (a) { return a.metadata.name; }), 'virtualservice')
                                            : undefined),
                                    React.createElement(NavItem, { eventKey: 'destinationrules' },
                                        'Destination Rules (' + destinationRules.items.length + ')',
                                        validationChecks.hasDestinationRuleChecks
                                            ? getValidationIcon((this.props.serviceDetails.destinationRules.items || []).map(function (a) { return a.metadata.name; }), 'destinationrule')
                                            : undefined)),
                                React.createElement(TabContent, null,
                                    React.createElement(TabPaneWithErrorBoundary, { eventKey: 'workloads', message: this.errorBoundaryMessage('Workloads') }, (Object.keys(workloads).length > 0 || this.props.serviceDetails.istioSidecar) && (React.createElement(ServiceInfoWorkload, { workloads: workloads, namespace: this.props.namespace }))),
                                    React.createElement(TabPaneWithErrorBoundary, { eventKey: 'virtualservices', message: this.errorBoundaryMessage('Virtual Services') }, (virtualServices.items.length > 0 || this.props.serviceDetails.istioSidecar) && (React.createElement(ServiceInfoVirtualServices, { virtualServices: virtualServices.items, validations: validations.virtualservice }))),
                                    React.createElement(TabPaneWithErrorBoundary, { eventKey: 'destinationrules', message: this.errorBoundaryMessage('Destination Rules') }, (destinationRules.items.length > 0 || this.props.serviceDetails.istioSidecar) && (React.createElement(ServiceInfoDestinationRules, { destinationRules: destinationRules.items, validations: validations.destinationrule })))))))))));
    };
    return ServiceInfo;
}(React.Component));
export default ServiceInfo;
//# sourceMappingURL=ServiceInfo.js.map