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
import * as React from 'react';
import { Icon, Nav, NavItem, TabContainer, TabContent, TabPane } from 'patternfly-react';
import { RateTableGrpc, RateTableHttp } from '../../components/SummaryPanel/RateTable';
import { RpsChart, TcpChart } from '../../components/SummaryPanel/RpsChart';
import ResponseTimeChart from '../../components/SummaryPanel/ResponseTimeChart';
import { GraphType, NodeType, Protocol } from '../../types/Graph';
import { renderTitle } from './SummaryLink';
import { shouldRefreshData, nodeData, getDatapoints, getNodeMetrics, getNodeMetricType, renderNoTraffic, NodeMetricType, renderLabels } from './SummaryPanelCommon';
import { makeCancelablePromise } from '../../utils/CancelablePromises';
import { serverConfig } from '../../config/ServerConfig';
import { CyEdge } from '../../components/CytoscapeGraph/CytoscapeGraphUtils';
import { icons } from '../../config';
import { ResponseTable } from '../../components/SummaryPanel/ResponseTable';
var defaultSummaryPanelState = {
    loading: true,
    reqRates: null,
    errRates: [],
    rtAvg: [],
    rtMed: [],
    rt95: [],
    rt99: [],
    tcpSent: [],
    tcpReceived: [],
    metricsLoadError: null
};
var SummaryPanelEdge = /** @class */ (function (_super) {
    __extends(SummaryPanelEdge, _super);
    function SummaryPanelEdge(props) {
        var _this = _super.call(this, props) || this;
        _this.getByLabels = function (sourceMetricType, destMetricType) {
            var sourceLabel;
            switch (sourceMetricType) {
                case NodeMetricType.APP:
                    sourceLabel = 'source_app';
                    break;
                case NodeMetricType.SERVICE:
                    sourceLabel = 'destination_service_name';
                    break;
                case NodeMetricType.WORKLOAD:
                // fall through, workload is default
                default:
                    sourceLabel = 'source_workload';
                    break;
            }
            // For special service dest nodes we want to narrow the data to only TS with 'unknown' workloads (see the related
            // comparator in getNodeDatapoints).
            return _this.isSpecialServiceDest(destMetricType) ? [sourceLabel, 'destination_workload'] : [sourceLabel];
        };
        _this.getNodeDataPoints = function (m, title, sourceMetricType, destMetricType, data) {
            var sourceLabel;
            var sourceValue;
            switch (sourceMetricType) {
                case NodeMetricType.APP:
                    sourceLabel = 'source_app';
                    sourceValue = data.app;
                    break;
                case NodeMetricType.SERVICE:
                    sourceLabel = 'destination_service_name';
                    sourceValue = data.service;
                    break;
                case NodeMetricType.WORKLOAD:
                // fall through, use workload as the default
                default:
                    sourceLabel = 'source_workload';
                    sourceValue = data.workload;
            }
            var comparator = function (metric) {
                if (_this.isSpecialServiceDest(destMetricType)) {
                    return metric[sourceLabel] === sourceValue && metric.destination_workload === 'unknown';
                }
                return metric[sourceLabel] === sourceValue;
            };
            return getDatapoints(m, title, comparator);
        };
        _this.updateCharts = function (props) {
            var edge = props.data.summaryTarget;
            var sourceData = nodeData(edge.source());
            var destData = nodeData(edge.target());
            var sourceMetricType = getNodeMetricType(sourceData);
            var destMetricType = getNodeMetricType(destData);
            var protocol = edge.data(CyEdge.protocol);
            var isGrpc = protocol === Protocol.GRPC;
            var isHttp = protocol === Protocol.HTTP;
            var isTcp = protocol === Protocol.TCP;
            if (_this.metricsPromise) {
                _this.metricsPromise.cancel();
                _this.metricsPromise = undefined;
            }
            // Just return if the metric types are unset, there is no data, destination node is "unknown" or charts are unsupported
            if (!destMetricType ||
                !sourceMetricType ||
                !_this.hasSupportedCharts(edge) ||
                (!isGrpc && !isHttp && !isTcp) ||
                destData.isInaccessible) {
                _this.setState({
                    loading: false
                });
                return;
            }
            var quantiles = ['0.5', '0.95', '0.99'];
            var byLabels = _this.getByLabels(sourceMetricType, destMetricType);
            var promiseRps, promiseTcp;
            if (isGrpc || isHttp) {
                var reporterRps = sourceData.nodeType === NodeType.UNKNOWN ||
                    sourceData.nodeType === NodeType.SERVICE ||
                    sourceData.namespace === serverConfig.istioNamespace ||
                    destData.namespace === serverConfig.istioNamespace
                    ? 'destination'
                    : 'source';
                var filtersRps = ['request_count', 'request_duration', 'request_error_count'];
                promiseRps = getNodeMetrics(destMetricType, edge.target(), props, filtersRps, 'inbound', reporterRps, protocol, quantiles, byLabels);
            }
            else {
                // TCP uses slightly different reporting
                var reporterTCP = sourceData.nodeType === NodeType.UNKNOWN || sourceData.namespace === serverConfig.istioNamespace
                    ? 'destination'
                    : 'source';
                var filtersTCP = ['tcp_sent', 'tcp_received'];
                promiseTcp = getNodeMetrics(destMetricType, edge.target(), props, filtersTCP, 'inbound', reporterTCP, undefined, // tcp metrics use dedicated metrics (i.e. no request_protocol label)
                quantiles, byLabels);
            }
            _this.metricsPromise = makeCancelablePromise(promiseRps ? promiseRps : promiseTcp);
            _this.metricsPromise.promise
                .then(function (response) {
                var metrics = response.data.metrics;
                var histograms = response.data.histograms;
                var reqRates = defaultSummaryPanelState.reqRates, errRates = defaultSummaryPanelState.errRates, rtAvg = defaultSummaryPanelState.rtAvg, rtMed = defaultSummaryPanelState.rtMed, rt95 = defaultSummaryPanelState.rt95, rt99 = defaultSummaryPanelState.rt99, tcpSent = defaultSummaryPanelState.tcpSent, tcpReceived = defaultSummaryPanelState.tcpReceived;
                if (isGrpc || isHttp) {
                    reqRates = _this.getNodeDataPoints(metrics.request_count, 'RPS', sourceMetricType, destMetricType, sourceData);
                    errRates = _this.getNodeDataPoints(metrics.request_error_count, 'Error', sourceMetricType, destMetricType, sourceData);
                    rtAvg = _this.getNodeDataPoints(histograms.request_duration.avg, 'Average', sourceMetricType, destMetricType, sourceData);
                    rtMed = _this.getNodeDataPoints(histograms.request_duration['0.5'], 'Median', sourceMetricType, destMetricType, sourceData);
                    rt95 = _this.getNodeDataPoints(histograms.request_duration['0.95'], '95th', sourceMetricType, destMetricType, sourceData);
                    rt99 = _this.getNodeDataPoints(histograms.request_duration['0.99'], '99th', sourceMetricType, destMetricType, sourceData);
                }
                else {
                    // TCP
                    tcpSent = _this.getNodeDataPoints(metrics.tcp_sent, 'Sent', sourceMetricType, destMetricType, sourceData);
                    tcpReceived = _this.getNodeDataPoints(metrics.tcp_received, 'Received', sourceMetricType, destMetricType, sourceData);
                }
                _this.setState({
                    loading: false,
                    reqRates: reqRates,
                    errRates: errRates,
                    rtAvg: rtAvg,
                    rtMed: rtMed,
                    rt95: rt95,
                    rt99: rt99,
                    tcpSent: tcpSent,
                    tcpReceived: tcpReceived
                });
            })
                .catch(function (error) {
                if (error.isCanceled) {
                    console.debug('SummaryPanelEdge: Ignore fetch error (canceled).');
                    return;
                }
                var errorMsg = error.response && error.response.data.error ? error.response.data.error : error.message;
                _this.setState({
                    loading: false,
                    metricsLoadError: errorMsg,
                    reqRates: null
                });
            });
            _this.setState({ loading: true, metricsLoadError: null });
        };
        _this.safeRate = function (s) {
            return isNaN(s) ? 0.0 : Number(s);
        };
        _this.renderCharts = function (edge, isGrpc, isHttp, isTcp) {
            if (!_this.hasSupportedCharts(edge)) {
                return isGrpc || isHttp ? (React.createElement(React.Fragment, null,
                    React.createElement(Icon, { type: "pf", name: "info" }),
                    " Service graphs do not support service-to-service aggregate sparklines. See the chart above for aggregate traffic or use the workload graph type to observe individual workload-to-service edge sparklines.")) : (React.createElement(React.Fragment, null,
                    React.createElement(Icon, { type: "pf", name: "info" }),
                    " Service graphs do not support service-to-service aggregate sparklines. Use the workload graph type to observe individual workload-to-service edge sparklines."));
            }
            var source = nodeData(edge.source());
            var target = nodeData(edge.target());
            if (target.isInaccessible) {
                return (React.createElement(React.Fragment, null,
                    React.createElement(Icon, { type: "pf", name: "info" }),
                    " Sparkline charts cannot be shown because the destination is inaccessible."));
            }
            if (source.isServiceEntry || target.isServiceEntry) {
                return (React.createElement(React.Fragment, null,
                    React.createElement(Icon, { type: "pf", name: "info" }),
                    " Sparkline charts cannot be shown because the source or destination is a serviceEntry."));
            }
            if (_this.state.loading && !_this.state.reqRates) {
                return React.createElement("strong", null, "Loading charts...");
            }
            if (_this.state.metricsLoadError) {
                return (React.createElement("div", null,
                    React.createElement(Icon, { type: "pf", name: "warning-triangle-o" }),
                    " ",
                    React.createElement("strong", null, "Error loading metrics: "),
                    _this.state.metricsLoadError));
            }
            var rpsChart, tcpChart;
            if (isGrpc || isHttp) {
                var labelRps = isGrpc ? 'GRPC Request Traffic' : 'HTTP Request Traffic';
                var labelRt = isGrpc ? 'GRPC Request Response Time (ms)' : 'HTTP Request Response Time (ms)';
                rpsChart = (React.createElement(React.Fragment, null,
                    React.createElement(RpsChart, { label: labelRps, dataRps: _this.state.reqRates, dataErrors: _this.state.errRates }),
                    React.createElement("hr", null),
                    React.createElement(ResponseTimeChart, { label: labelRt, rtAvg: _this.state.rtAvg, rtMed: _this.state.rtMed, rt95: _this.state.rt95, rt99: _this.state.rt99 }),
                    React.createElement("hr", null)));
            }
            else if (isTcp) {
                tcpChart = React.createElement(TcpChart, { label: "TCP Traffic", sentRates: _this.state.tcpSent, receivedRates: _this.state.tcpReceived });
            }
            return (React.createElement(React.Fragment, null,
                rpsChart,
                tcpChart));
        };
        _this.hasSupportedCharts = function (edge) {
            var sourceData = nodeData(edge.source());
            var destData = nodeData(edge.target());
            var sourceMetricType = getNodeMetricType(sourceData);
            var destMetricType = getNodeMetricType(destData);
            // service-to-service edges are unsupported because they represent aggregations (of multiple workload to service edges)
            var chartsSupported = sourceMetricType !== NodeMetricType.SERVICE || destMetricType !== NodeMetricType.SERVICE;
            return chartsSupported;
        };
        _this.renderBadgeSummary = function (mTLSPercentage) {
            var mtls = 'mTLS Enabled';
            var isMtls = Number(mTLSPercentage) > 0;
            if (isMtls && Number(mTLSPercentage) < 100.0) {
                mtls = mtls + " [" + mTLSPercentage + "% of request traffic]";
            }
            return (React.createElement(React.Fragment, null, isMtls && (React.createElement("div", null,
                React.createElement(Icon, { name: icons.istio.mtls.name, type: icons.istio.mtls.type, style: { width: '10px' } }),
                React.createElement("span", { style: { paddingLeft: '6px' } }, mtls)))));
        };
        _this.state = __assign({}, defaultSummaryPanelState);
        _this.mainDivRef = React.createRef();
        return _this;
    }
    SummaryPanelEdge.prototype.componentDidMount = function () {
        this.updateCharts(this.props);
    };
    SummaryPanelEdge.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.data.summaryTarget !== this.props.data.summaryTarget) {
            this.setState({
                loading: true,
                reqRates: null
            });
            if (this.mainDivRef.current) {
                this.mainDivRef.current.scrollTop = 0;
            }
        }
        if (shouldRefreshData(prevProps, this.props)) {
            this.updateCharts(this.props);
        }
    };
    SummaryPanelEdge.prototype.componentWillUnmount = function () {
        if (this.metricsPromise) {
            this.metricsPromise.cancel();
        }
    };
    SummaryPanelEdge.prototype.render = function () {
        var _this = this;
        var edge = this.props.data.summaryTarget;
        var source = edge.source();
        var dest = edge.target();
        var mTLSPercentage = edge.data(CyEdge.isMTLS);
        var isMtls = mTLSPercentage && Number(mTLSPercentage) > 0;
        var protocol = edge.data(CyEdge.protocol);
        var isGrpc = protocol === Protocol.GRPC;
        var isHttp = protocol === Protocol.HTTP;
        var isTcp = protocol === Protocol.TCP;
        var HeadingBlock = function (_a) {
            var prefix = _a.prefix, node = _a.node;
            var data = nodeData(node);
            return (React.createElement("div", { className: "panel-heading label-collection" },
                React.createElement("strong", null, prefix),
                " ",
                renderTitle(data),
                React.createElement("br", null),
                renderLabels(data)));
        };
        var MTLSBlock = function () {
            return React.createElement("div", { className: "panel-heading label-collection" }, _this.renderBadgeSummary(mTLSPercentage));
        };
        return (React.createElement("div", { ref: this.mainDivRef, className: "panel panel-default", style: SummaryPanelEdge.panelStyle },
            React.createElement(HeadingBlock, { prefix: "From", node: source }),
            React.createElement(HeadingBlock, { prefix: "To", node: dest }),
            isMtls && React.createElement(MTLSBlock, null),
            (isGrpc || isHttp) && (React.createElement("div", { className: "panel-body", style: { padding: '0px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '15px' } },
                React.createElement(TabContainer, { id: "basic-tabs", defaultActiveKey: "traffic" },
                    React.createElement("div", null,
                        React.createElement(Nav, { bsClass: "nav nav-tabs nav-tabs-pf", style: { paddingLeft: '20px' } },
                            React.createElement(NavItem, { eventKey: "traffic" },
                                React.createElement("div", null, "Traffic")),
                            React.createElement(NavItem, { eventKey: "responses" },
                                React.createElement("div", null, "Response Codes"))),
                        React.createElement(TabContent, { style: { paddingTop: '10px' } },
                            React.createElement(TabPane, { eventKey: "traffic", mountOnEnter: true, unmountOnExit: true },
                                isGrpc && (React.createElement(React.Fragment, null,
                                    React.createElement(RateTableGrpc, { title: "GRPC requests per second:", rate: this.safeRate(edge.data(CyEdge.grpc)), rateErr: this.safeRate(edge.data(CyEdge.grpcPercentErr)) }))),
                                isHttp && (React.createElement(React.Fragment, null,
                                    React.createElement(RateTableHttp, { title: "HTTP requests per second:", rate: this.safeRate(edge.data(CyEdge.http)), rate3xx: this.safeRate(edge.data(CyEdge.http3xx)), rate4xx: this.safeRate(edge.data(CyEdge.http4xx)), rate5xx: this.safeRate(edge.data(CyEdge.http5xx)) })))),
                            React.createElement(TabPane, { eventKey: "responses", mountOnEnter: true, unmountOnExit: true },
                                React.createElement(ResponseTable, { title: isGrpc ? 'GRPC codes:' : 'HTTP codes:', responses: edge.data(CyEdge.responses) }))))),
                React.createElement("hr", null),
                this.renderCharts(edge, isGrpc, isHttp, isTcp))),
            isTcp && (React.createElement("div", { className: "panel-body" },
                React.createElement(ResponseTable, { title: "TCP Responses:", responses: edge.data(CyEdge.responses) }),
                React.createElement("hr", null),
                this.renderCharts(edge, isGrpc, isHttp, isTcp))),
            !isGrpc && !isHttp && !isTcp && React.createElement("div", { className: "panel-body" }, renderNoTraffic())));
    };
    // We need to handle the special case of a dest service node showing client failures. These service nodes show up in
    // non-service graphs, even when not injecting service nodes.
    SummaryPanelEdge.prototype.isSpecialServiceDest = function (destMetricType) {
        return (destMetricType === NodeMetricType.SERVICE &&
            !this.props.injectServiceNodes &&
            this.props.graphType !== GraphType.SERVICE);
    };
    SummaryPanelEdge.panelStyle = {
        height: '100%',
        margin: 0,
        minWidth: '25em',
        overflowY: 'auto',
        width: '25em'
    };
    return SummaryPanelEdge;
}(React.Component));
export default SummaryPanelEdge;
//# sourceMappingURL=SummaryPanelEdge.js.map