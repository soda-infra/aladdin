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
import { runtimesLogoProviders } from '../../../config/Logos';
import Labels from '../../../components/Label/Labels';
var WorkloadDescription = /** @class */ (function (_super) {
    __extends(WorkloadDescription, _super);
    function WorkloadDescription(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    WorkloadDescription.prototype.renderLogo = function (name, idx) {
        var logoProvider = runtimesLogoProviders[name];
        if (logoProvider) {
            return React.createElement("img", { key: 'logo-' + idx, src: logoProvider(), alt: name, title: name });
        }
        return React.createElement("span", { key: 'runtime-' + idx }, name);
    };
    WorkloadDescription.prototype.render = function () {
        var _this = this;
        var workload = this.props.workload;
        var isTemplateLabels = workload &&
            ['Deployment', 'ReplicaSet', 'ReplicationController', 'DeploymentConfig', 'StatefulSet'].indexOf(workload.type) >=
                0;
        return workload ? (React.createElement("div", { className: "card-pf" },
            React.createElement("div", { className: "card-pf-body" },
                React.createElement(Row, null,
                    React.createElement(Col, { xs: 12, sm: 8, md: 6, lg: 6 },
                        React.createElement("div", { id: "labels" },
                            React.createElement("div", { className: "progress-description" },
                                React.createElement("strong", null, isTemplateLabels ? 'Template Labels' : 'Labels')),
                            React.createElement("div", { className: "label-collection" },
                                React.createElement(Labels, { labels: workload.labels }))),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Type"),
                            " ",
                            workload.type ? workload.type : ''),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Created at"),
                            " ",
                            React.createElement(LocalTime, { time: workload.createdAt })),
                        React.createElement("div", null,
                            React.createElement("strong", null, "Resource Version"),
                            " ",
                            workload.resourceVersion),
                        workload.runtimes.length > 0 && (React.createElement("div", null,
                            React.createElement("br", null),
                            workload.runtimes
                                .filter(function (r) { return r.name !== ''; })
                                .map(function (rt, idx) { return _this.renderLogo(rt.name, idx); })
                                .reduce(function (list, elem) {
                                return list.length > 0 ? list.concat([React.createElement("span", { key: "sep" }, " | "), elem]) : [elem];
                            }, [])))),
                    React.createElement(Col, { xs: 12, sm: 4, md: 3, lg: 3 }),
                    React.createElement(Col, { xs: 12, sm: 4, md: 3, lg: 3 },
                        React.createElement("div", { className: "progress-description" },
                            React.createElement("strong", null, "Health")),
                        React.createElement(HealthIndicator, { id: workload.name, health: this.props.health, mode: DisplayMode.LARGE, tooltipPlacement: "left" })))))) : ('Loading');
    };
    return WorkloadDescription;
}(React.Component));
export default WorkloadDescription;
//# sourceMappingURL=WorkloadDescription.js.map