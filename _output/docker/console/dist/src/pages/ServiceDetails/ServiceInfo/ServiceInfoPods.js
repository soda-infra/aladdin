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
import { Col, Row, OverlayTrigger, Tooltip } from 'patternfly-react';
import { groupPods } from './ServiceInfoPodsGrouping';
import Label from '../../../components/Label/Label';
var ServiceInfoPods = /** @class */ (function (_super) {
    __extends(ServiceInfoPods, _super);
    function ServiceInfoPods(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { groups: ServiceInfoPods.updateGroups(props) };
        return _this;
    }
    ServiceInfoPods.getDerivedStateFromProps = function (props, _currentState) {
        return { groups: ServiceInfoPods.updateGroups(props) };
    };
    ServiceInfoPods.updateGroups = function (props) {
        if (props.pods) {
            return groupPods(props.pods);
        }
        else {
            return [];
        }
    };
    ServiceInfoPods.prototype.render = function () {
        return (React.createElement("div", { className: "card-pf" },
            React.createElement(Row, { className: "row-cards-pf" },
                React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 }, (this.state.groups || []).map(function (group, u) { return (React.createElement("div", { className: "card-pf-body", key: 'pods_' + u },
                    React.createElement("h3", null, group.numberOfPods > 1 ? (React.createElement(OverlayTrigger
                    // Prettier makes irrelevant line-breaking clashing with tslint
                    // prettier-ignore
                    , { 
                        // Prettier makes irrelevant line-breaking clashing with tslint
                        // prettier-ignore
                        overlay: React.createElement(Tooltip, { id: 'pod_names_' + u, title: "Pod Names" }, group.names.join(', ')), placement: "top", trigger: ['hover', 'focus'] },
                        React.createElement("span", null, group.commonPrefix + '... (' + group.numberOfPods + ' replicas)'))) : (group.commonPrefix + ' (1 replica)')),
                    React.createElement("div", { key: "labels", className: "label-collection" }, Object.keys(group.commonLabels).map(function (key, i) { return (React.createElement(Label, { key: 'pod_' + u + '_' + i, name: key, value: group.commonLabels[key] })); })),
                    React.createElement("div", null,
                        React.createElement("span", null, group.createdAtStart === group.createdAtEnd ? (React.createElement(React.Fragment, null,
                            React.createElement("strong", null, "Created at: "),
                            new Date(group.createdAtStart).toLocaleString())) : (React.createElement(React.Fragment, null,
                            React.createElement("strong", null, "Created between: "),
                            new Date(group.createdAtStart).toLocaleString() +
                                ' and ' +
                                new Date(group.createdAtEnd).toLocaleString())))),
                    group.createdBy.length > 0 && (React.createElement("div", null,
                        React.createElement("span", null,
                            React.createElement("strong", null, "Created by: "),
                            group.createdBy.map(function (ref) { return ref.name + ' (' + ref.kind + ')'; }).join(', ')))),
                    group.istioInitContainers && (React.createElement("div", null,
                        React.createElement("span", null,
                            React.createElement("strong", null, "Istio init containers: "),
                            group.istioInitContainers.map(function (c) { return c.name + " [" + c.image + "]"; }).join(', ')))),
                    group.istioContainers && (React.createElement("div", null,
                        React.createElement("span", null,
                            React.createElement("strong", null, "Istio containers: "),
                            group.istioContainers.map(function (c) { return c.name + " [" + c.image + "]"; }).join(', ')))),
                    React.createElement("hr", null))); })))));
    };
    return ServiceInfoPods;
}(React.Component));
export default ServiceInfoPods;
//# sourceMappingURL=ServiceInfoPods.js.map