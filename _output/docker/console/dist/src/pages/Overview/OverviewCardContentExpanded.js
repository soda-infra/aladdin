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
import { AggregateStatusNotification, AggregateStatusNotifications, StackedBarChart, SparklineChart } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { DEGRADED, FAILURE, HEALTHY } from '../../types/Health';
import OverviewStatus from './OverviewStatus';
import { switchType } from './OverviewHelper';
import { Paths } from '../../config';
import graphUtils from '../../utils/Graphing';
import { getName } from '../../utils/RateIntervals';
var OverviewCardContentExpanded = /** @class */ (function (_super) {
    __extends(OverviewCardContentExpanded, _super);
    function OverviewCardContentExpanded() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OverviewCardContentExpanded.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { width: '50%', display: 'inline-block', height: 90 } }, this.renderLeft()),
            React.createElement("div", { style: {
                    width: '50%',
                    display: 'inline-block',
                    height: 90,
                    borderLeft: '1px solid #d1d1d1',
                    paddingLeft: 10,
                    verticalAlign: 'top'
                } }, this.renderRight())));
    };
    OverviewCardContentExpanded.prototype.renderLeft = function () {
        var targetPage = switchType(this.props.type, Paths.APPLICATIONS, Paths.SERVICES, Paths.WORKLOADS);
        var name = this.props.name;
        var status = this.props.status;
        var nbItems = status.inError.length + status.inWarning.length + status.inSuccess.length + status.notAvailable.length;
        var text;
        if (nbItems === 1) {
            text = switchType(this.props.type, '1 Application', '1 Service', '1 Workload');
        }
        else {
            text = nbItems + switchType(this.props.type, ' Applications', ' Services', ' Workloads');
        }
        var mainLink = React.createElement(Link, { to: "/" + targetPage + "?namespaces=" + name }, text);
        if (nbItems === status.notAvailable.length) {
            return (React.createElement(React.Fragment, null,
                mainLink,
                React.createElement(AggregateStatusNotifications, null,
                    React.createElement(AggregateStatusNotification, null, "N/A"))));
        }
        return (React.createElement(React.Fragment, null,
            mainLink,
            React.createElement(StackedBarChart, { style: { paddingLeft: 13 }, id: 'card-barchart-' + name, size: { height: 50 }, axis: { rotated: true, x: { show: false, categories: ['Health'], type: 'category' }, y: { show: false } }, grid: { x: { show: false }, y: { show: false } }, tooltip: { show: false }, data: {
                    groups: [[FAILURE.name, DEGRADED.name, HEALTHY.name]],
                    columns: [
                        [FAILURE.name, status.inError.length],
                        [DEGRADED.name, status.inWarning.length],
                        [HEALTHY.name, status.inSuccess.length]
                    ],
                    order: null,
                    type: 'bar'
                }, color: { pattern: [FAILURE.color, DEGRADED.color, HEALTHY.color] }, bar: { width: 20 }, legend: { hide: true } }),
            React.createElement(AggregateStatusNotifications, { style: { marginTop: -20, position: 'relative' } },
                status.inError.length > 0 && (React.createElement(OverviewStatus, { id: name + '-failure', namespace: name, status: FAILURE, items: status.inError, targetPage: targetPage })),
                status.inWarning.length > 0 && (React.createElement(OverviewStatus, { id: name + '-degraded', namespace: name, status: DEGRADED, items: status.inWarning, targetPage: targetPage })),
                status.inSuccess.length > 0 && (React.createElement(OverviewStatus, { id: name + '-healthy', namespace: name, status: HEALTHY, items: status.inSuccess, targetPage: targetPage })))));
    };
    OverviewCardContentExpanded.prototype.renderRight = function () {
        if (this.props.metrics && this.props.metrics.length > 0) {
            return (React.createElement(React.Fragment, null,
                'Traffic, ' + getName(this.props.duration).toLowerCase(),
                React.createElement(SparklineChart, { id: 'card-sparkline-' + this.props.name, data: { x: 'x', columns: graphUtils.toC3Columns(this.props.metrics, 'RPS'), type: 'area' }, tooltip: {}, axis: {
                        x: { show: false, type: 'timeseries', tick: { format: '%H:%M:%S' } },
                        y: { show: false }
                    } })));
        }
        return React.createElement("div", { style: { marginTop: 20 } }, "No traffic");
    };
    return OverviewCardContentExpanded;
}(React.Component));
export default OverviewCardContentExpanded;
//# sourceMappingURL=OverviewCardContentExpanded.js.map