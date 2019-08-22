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
import { Icon } from 'patternfly-react';
import { InOutRateTableGrpc, InOutRateTableHttp } from '../../components/SummaryPanel/InOutRateTable';
import { RpsChart, TcpChart } from '../../components/SummaryPanel/RpsChart';
import { NodeType } from '../../types/Graph';
import graphUtils from '../../utils/Graphing';
import { getAccumulatedTrafficRateGrpc, getAccumulatedTrafficRateHttp } from '../../utils/TrafficRate';
import { RenderLink, renderTitle } from './SummaryLink';
import { shouldRefreshData, updateHealth, nodeData, getNodeMetrics, getNodeMetricType, renderNoTraffic } from './SummaryPanelCommon';
import { DisplayMode, HealthIndicator } from '../../components/Health/HealthIndicator';
import Label from '../../components/Label/Label';
import { makeCancelablePromise } from '../../utils/CancelablePromises';
import { serverConfig } from '../../config/ServerConfig';
import { CyNode } from '../../components/CytoscapeGraph/CytoscapeGraphUtils';
import { icons } from '../../config';
var SummaryPanelGroup = /** @class */ (function (_super) {
    __extends(SummaryPanelGroup, _super);
    function SummaryPanelGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.updateRpsCharts = function (props) {
            var target = props.data.summaryTarget;
            var data = nodeData(target);
            var nodeMetricType = getNodeMetricType(data);
            if (_this.metricsPromise) {
                _this.metricsPromise.cancel();
                _this.metricsPromise = undefined;
            }
            if (!_this.hasGrpcTraffic(target) && !_this.hasHttpTraffic(target) && !_this.hasTcpTraffic(target)) {
                _this.setState({ loading: false });
                return;
            }
            var filters = ['request_count', 'request_error_count', 'tcp_sent', 'tcp_received'];
            var reporter = _this.props.data.summaryTarget.namespace === serverConfig.istioNamespace ? 'destination' : 'source';
            var promiseOut = getNodeMetrics(nodeMetricType, target, props, filters, 'outbound', reporter);
            // use dest metrics for incoming
            var promiseIn = getNodeMetrics(nodeMetricType, target, props, filters, 'inbound', 'destination');
            _this.metricsPromise = makeCancelablePromise(Promise.all([promiseOut, promiseIn]));
            _this.metricsPromise.promise
                .then(function (responses) {
                var metricsOut = responses[0].data.metrics;
                var metricsIn = responses[1].data.metrics;
                var rcOut = metricsOut.request_count;
                var ecOut = metricsOut.request_error_count;
                var tcpSentOut = metricsOut.tcp_sent;
                var tcpReceivedOut = metricsOut.tcp_received;
                var rcIn = metricsIn.request_count;
                var ecIn = metricsIn.request_error_count;
                var tcpSentIn = metricsIn.tcp_sent;
                var tcpReceivedIn = metricsIn.tcp_received;
                _this.setState({
                    loading: false,
                    requestCountIn: graphUtils.toC3Columns(rcIn.matrix, 'RPS'),
                    errorCountIn: graphUtils.toC3Columns(ecIn.matrix, 'Error'),
                    requestCountOut: graphUtils.toC3Columns(rcOut.matrix, 'RPS'),
                    errorCountOut: graphUtils.toC3Columns(ecOut.matrix, 'Error'),
                    tcpSentOut: graphUtils.toC3Columns(tcpSentOut.matrix, 'Sent'),
                    tcpReceivedOut: graphUtils.toC3Columns(tcpReceivedOut.matrix, 'Received'),
                    tcpSentIn: graphUtils.toC3Columns(tcpSentIn.matrix, 'Sent'),
                    tcpReceivedIn: graphUtils.toC3Columns(tcpReceivedIn.matrix, 'Received')
                });
            })
                .catch(function (error) {
                if (error.isCanceled) {
                    console.log('SummaryPanelGroup: Ignore fetch error (canceled).');
                    return;
                }
                var errorMsg = error.response && error.response.data.error ? error.response.data.error : error.message;
                _this.setState({
                    loading: false,
                    metricsLoadError: errorMsg,
                    requestCountIn: null
                });
            });
            _this.setState({ loading: true, metricsLoadError: null });
        };
        _this.renderVersionBadges = function () {
            return _this.props.data.summaryTarget
                .children("node[" + CyNode.version + "]")
                .toArray()
                .map(function (c, _i) { return (React.createElement(Label, { key: c.data(CyNode.version), name: serverConfig.istioLabels.versionLabelName, value: c.data(CyNode.version) })); });
        };
        _this.renderBadgeSummary = function (group) {
            var hasCB = group.data(CyNode.hasCB) === true;
            var hasVS = group.data(CyNode.hasVS) === true;
            group
                .children("node[" + CyNode.hasCB + "],[" + CyNode.hasVS + "]")
                .nodes()
                .forEach(function (n) {
                hasCB = hasCB || n.data(CyNode.hasCB);
                hasVS = hasVS || n.data(CyNode.hasVS);
            });
            return (React.createElement(React.Fragment, null,
                hasCB && (React.createElement("div", null,
                    React.createElement(Icon, { name: icons.istio.circuitBreaker.name, type: icons.istio.circuitBreaker.type, style: { width: '10px' } }),
                    React.createElement("span", { style: { paddingLeft: '4px' } }, "Has Circuit Breaker"))),
                hasVS && (React.createElement("div", null,
                    React.createElement(Icon, { name: icons.istio.virtualService.name, type: icons.istio.virtualService.type, style: { width: '10px' } }),
                    React.createElement("span", { style: { paddingLeft: '4px' } }, "Has Virtual Service")))));
        };
        _this.renderGrpcRates = function (group) {
            var nonServiceChildren = group.children('node[nodeType != "' + NodeType.SERVICE + '"]');
            var incoming = getAccumulatedTrafficRateGrpc(nonServiceChildren.incomers('edge'));
            var outgoing = getAccumulatedTrafficRateGrpc(nonServiceChildren.edgesTo('*'));
            return (React.createElement(React.Fragment, null,
                React.createElement(InOutRateTableGrpc, { title: "GRPC Traffic (requests per second):", inRate: incoming.rate, inRateErr: incoming.rateErr, outRate: outgoing.rate, outRateErr: outgoing.rateErr }),
                React.createElement("hr", null)));
        };
        _this.renderHttpRates = function (group) {
            var nonServiceChildren = group.children("node[nodeType != \"" + NodeType.SERVICE + "\"]");
            var incoming = getAccumulatedTrafficRateHttp(nonServiceChildren.incomers('edge'));
            var outgoing = getAccumulatedTrafficRateHttp(nonServiceChildren.edgesTo('*'));
            return (React.createElement(React.Fragment, null,
                React.createElement(InOutRateTableHttp, { title: "HTTP Traffic (requests per second):", inRate: incoming.rate, inRate3xx: incoming.rate3xx, inRate4xx: incoming.rate4xx, inRate5xx: incoming.rate5xx, outRate: outgoing.rate, outRate3xx: outgoing.rate3xx, outRate4xx: outgoing.rate4xx, outRate5xx: outgoing.rate5xx }),
                React.createElement("hr", null)));
        };
        _this.renderSparklines = function (group) {
            if (_this.state.loading && !_this.state.requestCountIn) {
                return React.createElement("strong", null, "Loading charts...");
            }
            else if (_this.state.metricsLoadError) {
                return (React.createElement("div", null,
                    React.createElement(Icon, { type: "pf", name: "warning-triangle-o" }),
                    " ",
                    React.createElement("strong", null, "Error loading metrics: "),
                    _this.state.metricsLoadError));
            }
            var tcpCharts, httpCharts;
            if (_this.hasHttpTraffic(group)) {
                httpCharts = (React.createElement(React.Fragment, null,
                    React.createElement(RpsChart, { key: "http-inbound-request", label: "HTTP - Inbound Request Traffic", dataRps: _this.state.requestCountIn, dataErrors: _this.state.errorCountIn }),
                    React.createElement(RpsChart, { key: "http-outbound-request", label: "HTTP - Outbound Request Traffic", dataRps: _this.state.requestCountOut, dataErrors: _this.state.errorCountOut }),
                    React.createElement("hr", null)));
            }
            if (_this.hasTcpTraffic(group)) {
                tcpCharts = (React.createElement(React.Fragment, null,
                    React.createElement(TcpChart, { key: "tcp-inbound-request", label: "TCP - Inbound Traffic", receivedRates: _this.state.tcpReceivedIn, sentRates: _this.state.tcpSentIn }),
                    React.createElement(TcpChart, { key: "tcp-outbound-request", label: "TCP - Outbound Traffic", receivedRates: _this.state.tcpReceivedOut, sentRates: _this.state.tcpSentOut }),
                    React.createElement("hr", null)));
            }
            return (React.createElement(React.Fragment, null,
                httpCharts,
                tcpCharts));
        };
        _this.renderServiceList = function (group) {
            // likely 0 or 1 but support N in case of unanticipated labeling
            var serviceList = [];
            group.children("node[nodeType = \"" + NodeType.SERVICE + "\"]").forEach(function (node, index) {
                var data = nodeData(node);
                serviceList.push(React.createElement(RenderLink, { key: "node-" + index, data: data, nodeType: NodeType.SERVICE }));
                serviceList.push(React.createElement("span", { key: "node-comma-" + index }, ", "));
            });
            if (serviceList.length > 0) {
                serviceList.pop();
            }
            return serviceList;
        };
        _this.renderWorkloadList = function (group) {
            var workloadList = [];
            group.children('node[workload]').forEach(function (node, index) {
                var data = nodeData(node);
                workloadList.push(React.createElement(RenderLink, { key: "node-" + index, data: data, nodeType: NodeType.WORKLOAD }));
                workloadList.push(React.createElement("span", { key: "node-comma-" + index }, ", "));
            });
            if (workloadList.length > 0) {
                workloadList.pop();
            }
            return workloadList;
        };
        _this.hasGrpcTraffic = function (group) {
            if (group
                .children()
                .filter('[grpcIn > 0],[grpcOut > 0]')
                .size() > 0) {
                return true;
            }
            return false;
        };
        _this.hasHttpTraffic = function (group) {
            if (group
                .children()
                .filter('[httpIn > 0],[httpOut > 0]')
                .size() > 0) {
                return true;
            }
            return false;
        };
        _this.hasTcpTraffic = function (group) {
            if (group
                .children()
                .filter('[tcpIn > 0],[tcpOut > 0]')
                .size() > 0) {
                return true;
            }
            return false;
        };
        _this.state = {
            loading: true,
            requestCountIn: null,
            requestCountOut: [],
            errorCountIn: [],
            errorCountOut: [],
            tcpSentIn: [],
            tcpSentOut: [],
            tcpReceivedIn: [],
            tcpReceivedOut: [],
            healthLoading: false,
            metricsLoadError: null
        };
        _this.mainDivRef = React.createRef();
        return _this;
    }
    SummaryPanelGroup.prototype.componentDidMount = function () {
        this.updateRpsCharts(this.props);
        updateHealth(this.props.data.summaryTarget, this.setState.bind(this));
    };
    SummaryPanelGroup.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.data.summaryTarget !== this.props.data.summaryTarget) {
            this.setState({
                requestCountIn: null,
                loading: true
            });
            if (this.mainDivRef.current) {
                this.mainDivRef.current.scrollTop = 0;
            }
        }
        if (shouldRefreshData(prevProps, this.props)) {
            this.updateRpsCharts(this.props);
            updateHealth(this.props.data.summaryTarget, this.setState.bind(this));
        }
    };
    SummaryPanelGroup.prototype.componentWillUnmount = function () {
        if (this.metricsPromise) {
            this.metricsPromise.cancel();
        }
    };
    SummaryPanelGroup.prototype.render = function () {
        var group = this.props.data.summaryTarget;
        var data = nodeData(group);
        var namespace = data.namespace;
        var serviceList = this.renderServiceList(group);
        var workloadList = this.renderWorkloadList(group);
        return (React.createElement("div", { ref: this.mainDivRef, className: "panel panel-default", style: SummaryPanelGroup.panelStyle },
            React.createElement("div", { className: "panel-heading" },
                this.state.healthLoading ? (
                // Remove glitch while health is being reloaded
                React.createElement("span", { style: { width: 18, height: 17, display: 'inline-block' } })) : (this.state.health && (React.createElement(HealthIndicator, { id: "graph-health-indicator", mode: DisplayMode.SMALL, health: this.state.health, tooltipPlacement: "left" }))),
                React.createElement("span", null,
                    " ",
                    renderTitle(data)),
                React.createElement("div", { className: "label-collection", style: { paddingTop: '3px' } },
                    React.createElement(Label, { name: "namespace", value: namespace, key: namespace }),
                    this.renderVersionBadges()),
                this.renderBadgeSummary(group)),
            React.createElement("div", { className: "panel-body" },
                serviceList.length > 0 && (React.createElement("div", null,
                    React.createElement("strong", null, "Services: "),
                    serviceList)),
                workloadList.length > 0 && (React.createElement("div", null,
                    React.createElement("strong", null, "Workloads: "),
                    workloadList)),
                (serviceList.length > 0 || workloadList.length > 0) && React.createElement("hr", null),
                this.hasGrpcTraffic(group) ? this.renderGrpcRates(group) : renderNoTraffic('GRPC'),
                this.hasHttpTraffic(group) ? this.renderHttpRates(group) : renderNoTraffic('HTTP'),
                React.createElement("div", null, this.renderSparklines(group)))));
    };
    SummaryPanelGroup.panelStyle = {
        height: '100%',
        margin: 0,
        minWidth: '25em',
        overflowY: 'auto',
        width: '25em'
    };
    return SummaryPanelGroup;
}(React.Component));
export default SummaryPanelGroup;
//# sourceMappingURL=SummaryPanelGroup.js.map