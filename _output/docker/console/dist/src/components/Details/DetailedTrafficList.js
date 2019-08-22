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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Icon } from 'patternfly-react';
import { TableGrid } from 'patternfly-react-extensions';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { NodeType } from '../../types/Graph';
import { REQUESTS_THRESHOLDS } from '../../types/Health';
import history, { URLParam } from '../../app/History';
var statusColumnSizes = {
    md: 1,
    sm: 1,
    xs: 1
};
var workloadColumnSizes = {
    md: 3,
    sm: 3,
    xs: 3
};
var metricsLinksColumnsSizes = workloadColumnSizes;
var typeColumnSizes = statusColumnSizes;
var trafficColumnSizes = workloadColumnSizes;
var DetailedTrafficList = /** @class */ (function (_super) {
    __extends(DetailedTrafficList, _super);
    function DetailedTrafficList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderMetricsLinksColumn = function (node) {
            var metricsDirection = _this.props.direction === 'inbound' ? 'in_metrics' : 'out_metrics';
            var metricsLink = history.location.pathname + '?';
            metricsLink += "tab=" + metricsDirection;
            if (node.type === NodeType.APP) {
                // All metrics tabs can filter by remote app. No need to switch context.
                metricsLink += '&' + URLParam.BY_LABELS + '=' + encodeURIComponent('Remote app=' + node.name);
            }
            else if (node.type === NodeType.SERVICE) {
                // Filter by remote service only available in the Outbound Metrics tab. For inbound traffic,
                // switch context to the service details page.
                if (_this.props.direction === 'outbound') {
                    metricsLink += '&' + URLParam.BY_LABELS + '=' + encodeURIComponent('Remote service=' + node.name);
                }
                else {
                    // Services have only one metrics tab.
                    metricsLink = "/namespaces/" + node.namespace + "/services/" + node.name + "?tab=metrics";
                }
            }
            else if (node.type === NodeType.WORKLOAD) {
                // No filters available for workloads. Context switch is mandatory.
                // Since this will switch context (i.e. will redirect the user to the workload details page),
                // user is redirected to the "opposite" metrics. When looking at certain item, if traffic is *incoming*
                // from a certain workload, that traffic is reflected in the *outbound* metrics of the workload (and vice-versa).
                var inverseMetricsDirection = _this.props.direction === 'inbound' ? 'out_metrics' : 'in_metrics';
                metricsLink = "/namespaces/" + node.namespace + "/workloads/" + node.name + "?tab=" + inverseMetricsDirection;
            }
            else {
                return null;
            }
            return (React.createElement(TableGrid.Col, __assign({}, metricsLinksColumnsSizes),
                React.createElement(Link, { to: metricsLink }, "View metrics")));
        };
        _this.renderStatusColumn = function (traffic) {
            if (traffic.protocol === 'tcp' || !traffic.protocol) {
                return (React.createElement(TableGrid.Col, __assign({}, statusColumnSizes),
                    React.createElement(Icon, { type: "pf", name: "unknown" })));
            }
            else {
                var percentError = void 0;
                if (traffic.protocol === 'http') {
                    percentError = traffic.rates.httpPercentErr ? Number(traffic.rates.httpPercentErr) : 0;
                }
                else {
                    percentError = traffic.rates.grpcPercentErr ? Number(traffic.rates.grpcPercentErr) : 0;
                }
                var healthIcon = React.createElement(Icon, { type: "pf", name: "ok" });
                if (percentError > REQUESTS_THRESHOLDS.failure) {
                    healthIcon = React.createElement(Icon, { type: "pf", name: "error-circle-o" });
                }
                else if (percentError > REQUESTS_THRESHOLDS.degraded) {
                    healthIcon = React.createElement(Icon, { type: "pf", name: "warning-triangle-o" });
                }
                return React.createElement(TableGrid.Col, __assign({}, statusColumnSizes), healthIcon);
            }
        };
        _this.renderWorkloadColumn = function (node, isProxyed) {
            var style = isProxyed ? { paddingLeft: '2em' } : {};
            var icon = React.createElement(Icon, { type: "pf", name: "unknown", style: style });
            var name = React.createElement(React.Fragment, null, node.name);
            if (NodeType.WORKLOAD === node.type) {
                icon = React.createElement(Icon, { type: "pf", name: "bundle", style: style });
                if (!node.isInaccessible) {
                    name = (React.createElement(Link, { to: "/namespaces/" + encodeURIComponent(node.namespace) + "/workloads/" + encodeURIComponent(node.name) }, node.name));
                }
            }
            else if (NodeType.SERVICE === node.type) {
                icon = React.createElement(Icon, { type: "pf", name: "service", style: style });
                if (!node.isServiceEntry && !node.isInaccessible) {
                    name = (React.createElement(Link, { to: "/namespaces/" + encodeURIComponent(node.namespace) + "/services/" + encodeURIComponent(node.name) }, node.name));
                }
            }
            else if (NodeType.APP === node.type) {
                icon = React.createElement(Icon, { type: "pf", name: "applications", style: style });
                if (!node.isInaccessible) {
                    name = (React.createElement(Link, { to: "/namespaces/" + encodeURIComponent(node.namespace) + "/applications/" + encodeURIComponent(node.name) }, node.name));
                    if (node.version) {
                        name = (React.createElement(Link, { to: "/namespaces/" + encodeURIComponent(node.namespace) + "/applications/" + encodeURIComponent(node.name) }, node.name + " / " + node.version));
                    }
                }
            }
            return (React.createElement(TableGrid.Col, __assign({}, workloadColumnSizes),
                icon,
                " ",
                name));
        };
        _this.renderTrafficColumn = function (traffic) {
            if (traffic.protocol === 'tcp') {
                return React.createElement(TableGrid.Col, __assign({}, trafficColumnSizes), Number(traffic.rates.tcp).toFixed(2));
            }
            else if (!traffic.protocol) {
                return React.createElement(TableGrid.Col, __assign({}, trafficColumnSizes), "N/A");
            }
            else {
                var rps = void 0;
                var percentError = void 0;
                if (traffic.protocol === 'http') {
                    rps = Number(traffic.rates.http);
                    percentError = traffic.rates.httpPercentErr ? Number(traffic.rates.httpPercentErr) : 0;
                }
                else {
                    rps = Number(traffic.rates.grpc);
                    percentError = traffic.rates.grpcPercentErr ? Number(traffic.rates.grpcPercentErr) : 0;
                }
                return (React.createElement(TableGrid.Col, __assign({}, trafficColumnSizes),
                    rps.toFixed(2),
                    "rps | ",
                    (100 - percentError).toFixed(1),
                    "% success"));
            }
        };
        _this.renderTypeColumn = function (traffic) {
            if (!traffic.protocol) {
                return React.createElement(TableGrid.Col, __assign({}, typeColumnSizes), "N/A");
            }
            return React.createElement(TableGrid.Col, __assign({}, typeColumnSizes), traffic.protocol.toUpperCase());
        };
        _this.getSortedTraffic = function () {
            var sortFn = function (a, b) {
                if (!a.proxy && !b.proxy) {
                    return a.node.name.localeCompare(b.node.name);
                }
                else if (a.proxy && b.proxy) {
                    var proxyCompare = a.proxy.node.name.localeCompare(b.proxy.node.name);
                    if (proxyCompare === 0) {
                        return a.node.name.localeCompare(b.node.name);
                    }
                    return proxyCompare;
                }
                else {
                    var proxyedItem = a.proxy ? a : b;
                    var proxyItem = a.proxy ? b : a;
                    if (proxyItem === proxyedItem.proxy) {
                        return proxyItem === a ? -1 : 1;
                    }
                    var cmp = proxyItem.node.name.localeCompare(proxyedItem.proxy.node.name);
                    return proxyItem === a ? cmp : -cmp;
                }
            };
            return _this.props.traffic.slice().sort(sortFn);
        };
        return _this;
    }
    DetailedTrafficList.prototype.render = function () {
        var _this = this;
        var sortedTraffic = this.getSortedTraffic();
        return (React.createElement(TableGrid, { id: "table-grid", bordered: true, selectType: "none", style: { clear: 'both' } },
            React.createElement(TableGrid.Head, null,
                React.createElement(TableGrid.ColumnHeader, __assign({}, statusColumnSizes), "Status"),
                React.createElement(TableGrid.ColumnHeader, __assign({}, workloadColumnSizes), this.props.direction === 'inbound' ? 'Source' : 'Destination'),
                React.createElement(TableGrid.ColumnHeader, __assign({}, typeColumnSizes), "Type"),
                React.createElement(TableGrid.ColumnHeader, __assign({}, trafficColumnSizes), "Traffic")),
            React.createElement(TableGrid.Body, null,
                sortedTraffic.length === 0 && (React.createElement(TableGrid.Row, null,
                    React.createElement(TableGrid.Col, { md: 10, sm: 10, xs: 10 },
                        React.createElement(Icon, { type: "pf", name: "info" }),
                        " Not enough ",
                        this.props.direction,
                        " traffic to generate info"))),
                sortedTraffic.map(function (item) {
                    return (React.createElement(TableGrid.Row, { key: item.node.id },
                        _this.renderStatusColumn(item.traffic),
                        _this.renderWorkloadColumn(item.node, item.proxy !== undefined),
                        _this.renderTypeColumn(item.traffic),
                        _this.renderTrafficColumn(item.traffic),
                        _this.renderMetricsLinksColumn(item.node)));
                }))));
    };
    return DetailedTrafficList;
}(React.Component));
export default DetailedTrafficList;
//# sourceMappingURL=DetailedTrafficList.js.map