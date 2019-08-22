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
import { Row, Col, ListView, ListViewItem, ListViewIcon, Icon } from 'patternfly-react';
import { DisplayMode, HealthIndicator } from '../../../components/Health/HealthIndicator';
import MissingSidecar from '../../../components/MissingSidecar/MissingSidecar';
import { WorkloadIcon } from '../../../types/Workload';
import { Link } from 'react-router-dom';
var AppDescription = /** @class */ (function (_super) {
    __extends(AppDescription, _super);
    function AppDescription(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    AppDescription.prototype.istioSidecar = function () {
        var istioSidecar = true; // true until proven otherwise (workload with missing sidecar exists)
        this.props.app.workloads.forEach(function (wkd) {
            istioSidecar = istioSidecar && wkd.istioSidecar;
        });
        return istioSidecar;
    };
    AppDescription.prototype.serviceLink = function (namespace, service) {
        return '/namespaces/' + namespace + '/services/' + service;
    };
    AppDescription.prototype.workloadLink = function (namespace, workload) {
        return '/namespaces/' + namespace + '/workloads/' + workload;
    };
    AppDescription.prototype.renderServices = function (namespace, workload, serviceNames) {
        var _this = this;
        var iconType = 'pf';
        var iconName = 'service';
        return serviceNames.map(function (service) { return (React.createElement("div", { key: 'workload_' + workload + '_service_' + service, className: "ServiceList-Title" },
            React.createElement(Icon, { type: iconType, name: iconName, className: "service-icon" }),
            React.createElement(Link, { to: _this.serviceLink(namespace, service) }, service))); });
    };
    AppDescription.prototype.renderWorkloadItem = function (namespace, workload) {
        /*
          Not sure if we need a common icon per Workload instead of an icon per type of Workload
         */
        var iconName = WorkloadIcon;
        var iconType = 'pf';
        var heading = (React.createElement("div", { className: "ServiceList-Heading" },
            React.createElement("div", { className: "ServiceList-Title" },
                React.createElement("div", { className: "component-label" },
                    "Workload",
                    ' ',
                    !workload.istioSidecar && React.createElement(MissingSidecar, { style: { marginLeft: '10px' }, tooltip: true, text: '' })),
                React.createElement(Link, { to: this.workloadLink(namespace, workload.workloadName) }, workload.workloadName))));
        var content = (React.createElement(ListViewItem, { leftContent: React.createElement(ListViewIcon, { type: iconType, name: iconName }), key: "AppWorkload_" + workload.workloadName, heading: heading }));
        return content;
    };
    AppDescription.prototype.renderServiceItem = function (namespace, _appName, serviceName) {
        var iconName = 'service';
        var iconType = 'pf';
        var heading = (React.createElement("div", { className: "ServiceList-Heading" },
            React.createElement("div", { className: "ServiceList-Title" },
                React.createElement("div", { className: "component-label" }, "Service"),
                React.createElement(Link, { to: this.serviceLink(namespace, serviceName) }, serviceName))));
        var content = (React.createElement(ListViewItem, { leftContent: React.createElement(ListViewIcon, { type: iconType, name: iconName }), key: "AppService_" + serviceName, heading: heading }));
        return content;
    };
    AppDescription.prototype.renderEmptyItem = function (type) {
        var message = 'No ' + type + ' found for this app.';
        return React.createElement(ListViewItem, { description: message });
    };
    AppDescription.prototype.workloadList = function () {
        var _this = this;
        var ns = this.props.app.namespace.name;
        var workloads = this.props.app.workloads;
        return workloads.length > 0
            ? workloads.map(function (wkd) { return _this.renderWorkloadItem(ns, wkd); })
            : this.renderEmptyItem('workloads');
    };
    AppDescription.prototype.serviceList = function () {
        var _this = this;
        var ns = this.props.app.namespace.name;
        var services = this.props.app.serviceNames;
        return services.length > 0
            ? services.map(function (sn) { return _this.renderServiceItem(ns, _this.props.app.name, sn); })
            : this.renderEmptyItem('services');
    };
    AppDescription.prototype.render = function () {
        var app = this.props.app;
        return app ? (React.createElement("div", { className: "card-pf" },
            React.createElement("div", { className: "card-pf-body" },
                React.createElement(Row, null,
                    React.createElement(Col, { xs: 12, sm: 6, md: 4, lg: 4 },
                        React.createElement(ListView, null, this.workloadList())),
                    React.createElement(Col, { xs: 12, sm: 6, md: 4, lg: 4 },
                        React.createElement(ListView, null, this.serviceList())),
                    React.createElement(Col, { xs: 0, sm: 0, md: 1, lg: 1 }),
                    React.createElement(Col, { xs: 12, sm: 6, md: 3, lg: 3 },
                        React.createElement("div", { className: "progress-description" },
                            React.createElement("strong", null, "Health")),
                        React.createElement(HealthIndicator, { id: app.name, health: this.props.health, mode: DisplayMode.LARGE, tooltipPlacement: "left" })))))) : ('Loading');
    };
    return AppDescription;
}(React.Component));
export default AppDescription;
//# sourceMappingURL=AppDescription.js.map