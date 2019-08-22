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
import { Col, Icon, Nav, NavItem, Row, TabContainer, TabContent, TabPane } from 'patternfly-react';
import WorkloadDescription from './WorkloadInfo/WorkloadDescription';
import WorkloadPods from './WorkloadInfo/WorkloadPods';
import WorkloadServices from './WorkloadInfo/WorkloadServices';
import { severityToIconName, validationToSeverity } from '../../types/ServiceInfo';
import { DurationDropdownContainer } from '../../components/DurationDropdown/DurationDropdown';
import RefreshButtonContainer from '../../components/Refresh/RefreshButton';
var tabName = 'list';
var tabIconStyle = style({
    fontSize: '0.9em'
});
var floatRightStyle = style({
    float: 'right'
});
var WorkloadInfo = /** @class */ (function (_super) {
    __extends(WorkloadInfo, _super);
    function WorkloadInfo(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    WorkloadInfo.prototype.validationChecks = function () {
        var _this = this;
        var validationChecks = {
            hasPodsChecks: false
        };
        var pods = this.props.workload.pods || [];
        validationChecks.hasPodsChecks = pods.some(function (pod) {
            return _this.props.validations.pod &&
                _this.props.validations.pod[pod.name] &&
                _this.props.validations.pod[pod.name].checks.length > 0;
        });
        return validationChecks;
    };
    WorkloadInfo.prototype.render = function () {
        var _this = this;
        var workload = this.props.workload;
        var pods = workload.pods || [];
        var services = workload.services || [];
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
                var validations = _this.props.validations[type][key];
                if (validationToSeverity(validations) === 'error') {
                    severity = 'error';
                }
            });
            return getSeverityIcon(severity);
        };
        return (React.createElement("div", null,
            React.createElement("div", { className: "container-fluid container-cards-pf" },
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                        React.createElement("span", { className: floatRightStyle },
                            React.createElement(DurationDropdownContainer, { id: "workload-info-duration-dropdown" }),
                            ' ',
                            React.createElement(RefreshButtonContainer, { handleRefresh: this.props.onRefresh })))),
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                        React.createElement(WorkloadDescription, { workload: workload, namespace: this.props.namespace, istioEnabled: this.props.istioEnabled, health: this.props.health }))),
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                        React.createElement(TabContainer, { id: "service-tabs", activeKey: this.props.activeTab(tabName, 'pods'), onSelect: this.props.onSelectTab(tabName) },
                            React.createElement("div", null,
                                React.createElement(Nav, { bsClass: "nav nav-tabs nav-tabs-pf" },
                                    React.createElement(NavItem, { eventKey: 'pods' },
                                        'Pods (' + pods.length + ')',
                                        validationChecks.hasPodsChecks
                                            ? getValidationIcon((this.props.workload.pods || []).map(function (a) { return a.name; }), 'pod')
                                            : undefined),
                                    React.createElement(NavItem, { eventKey: 'services' }, 'Services (' + services.length + ')')),
                                React.createElement(TabContent, null,
                                    React.createElement(TabPane, { eventKey: 'pods' }, pods.length > 0 && (React.createElement(WorkloadPods, { namespace: this.props.namespace, pods: pods, validations: this.props.validations.pod }))),
                                    React.createElement(TabPane, { eventKey: 'services' }, services.length > 0 && React.createElement(WorkloadServices, { services: services, namespace: this.props.namespace }))))))))));
    };
    return WorkloadInfo;
}(React.Component));
export default WorkloadInfo;
//# sourceMappingURL=WorkloadInfo.js.map