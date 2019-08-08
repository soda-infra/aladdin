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
import { Link } from 'react-router-dom';
import { RateTableGrpc, RateTableHttp } from '../../components/SummaryPanel/RateTable';
import { RpsChart, TcpChart } from '../../components/SummaryPanel/RpsChart';
import { NodeType } from '../../types/Graph';
import { getAccumulatedTrafficRateGrpc, getAccumulatedTrafficRateHttp } from '../../utils/TrafficRate';
import * as API from '../../services/Api';
import { Icon } from 'patternfly-react';
import { shouldRefreshData, getDatapoints, mergeMetricsResponses } from './SummaryPanelCommon';
import { makeCancelablePromise } from '../../utils/CancelablePromises';
import { Paths } from '../../config';
var SummaryPanelGraph = /** @class */ (function (_super) {
    __extends(SummaryPanelGraph, _super);
    function SummaryPanelGraph(props) {
        var _this = _super.call(this, props) || this;
        _this.updateRpsChart = function (props) {
            var options = {
                filters: ['request_count', 'request_error_count'],
                queryTime: props.queryTime,
                duration: props.duration,
                step: props.step,
                rateInterval: props.rateInterval,
                direction: 'inbound',
                reporter: 'destination'
            };
            var promiseHTTP = API.getNamespaceMetrics(props.namespaces[0].name, options);
            // TCP metrics are only available for reporter="source"
            var optionsTCP = {
                filters: ['tcp_sent', 'tcp_received'],
                queryTime: props.queryTime,
                duration: props.duration,
                step: props.step,
                rateInterval: props.rateInterval,
                direction: 'inbound',
                reporter: 'source'
            };
            var promiseTCP = API.getNamespaceMetrics(props.namespaces[0].name, optionsTCP);
            _this.metricsPromise = makeCancelablePromise(mergeMetricsResponses([promiseHTTP, promiseTCP]));
            _this.metricsPromise.promise
                .then(function (response) {
                var reqRates = getDatapoints(response.data.metrics.request_count, 'RPS');
                var errRates = getDatapoints(response.data.metrics.request_error_count, 'Error');
                var tcpSent = getDatapoints(response.data.metrics.tcp_sent, 'Sent');
                var tcpReceived = getDatapoints(response.data.metrics.tcp_received, 'Received');
                _this.setState({
                    loading: false,
                    reqRates: reqRates,
                    errRates: errRates,
                    tcpSent: tcpSent,
                    tcpReceived: tcpReceived
                });
            })
                .catch(function (error) {
                if (error.isCanceled) {
                    console.debug('SummaryPanelGraph: Ignore fetch error (canceled).');
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
        _this.renderTopologySummary = function (numSvc, numWorkloads, numApps, numEdges) { return (React.createElement("div", null,
            React.createElement(Link, { key: "appsLink", to: "/" + Paths.APPLICATIONS + "?namespaces=" + _this.props.namespaces.map(function (ns) { return ns.name; }).join(',') }, ' applications'),
            React.createElement(Link, { key: "servicesLink", to: "/" + Paths.SERVICES + "?namespaces=" + _this.props.namespaces.map(function (ns) { return ns.name; }).join(',') }, ', services'),
            React.createElement(Link, { key: "workloadsLink", to: "/" + Paths.WORKLOADS + "?namespaces=" + _this.props.namespaces.map(function (ns) { return ns.name; }).join(',') }, ', workloads'),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("strong", null, "Current Graph:"),
            React.createElement("br", null),
            numApps > 0 && (React.createElement(React.Fragment, null,
                React.createElement(Icon, { name: "applications", type: "pf", style: { padding: '0 1em' } }),
                numApps.toString(),
                " ",
                numApps === 1 ? 'app' : 'apps',
                React.createElement("br", null))),
            numSvc > 0 && (React.createElement(React.Fragment, null,
                React.createElement(Icon, { name: "service", type: "pf", style: { padding: '0 1em' } }),
                numSvc.toString(),
                " ",
                numSvc === 1 ? 'service' : 'services',
                React.createElement("br", null))),
            numWorkloads > 0 && (React.createElement(React.Fragment, null,
                React.createElement(Icon, { name: "bundle", type: "pf", style: { padding: '0 1em' } }),
                numWorkloads.toString(),
                " ",
                numWorkloads === 1 ? 'workload' : 'workloads',
                React.createElement("br", null))),
            numEdges > 0 && (React.createElement(React.Fragment, null,
                React.createElement(Icon, { name: "topology", type: "pf", style: { padding: '0 1em' } }),
                numEdges.toString(),
                " ",
                numEdges === 1 ? 'edge' : 'edges')))); };
        _this.renderRpsChart = function () {
            if (_this.state.loading && !_this.state.reqRates) {
                return React.createElement("strong", null, "Loading chart...");
            }
            else if (_this.state.metricsLoadError) {
                return (React.createElement("div", null,
                    React.createElement(Icon, { type: "pf", name: "warning-triangle-o" }),
                    " ",
                    React.createElement("strong", null, "Error loading metrics: "),
                    _this.state.metricsLoadError));
            }
            return (React.createElement(React.Fragment, null,
                React.createElement(RpsChart, { label: "HTTP - Total Request Traffic", dataRps: _this.state.reqRates, dataErrors: _this.state.errRates }),
                React.createElement(TcpChart, { label: "TCP - Total Traffic", receivedRates: _this.state.tcpReceived, sentRates: _this.state.tcpSent })));
        };
        _this.state = {
            loading: true,
            reqRates: null,
            errRates: [],
            tcpSent: [],
            tcpReceived: [],
            metricsLoadError: null
        };
        return _this;
    }
    SummaryPanelGraph.prototype.componentDidMount = function () {
        if (this.shouldShowRPSChart()) {
            this.updateRpsChart(this.props);
        }
    };
    SummaryPanelGraph.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.data.summaryTarget !== this.props.data.summaryTarget) {
            this.setState({
                reqRates: null,
                loading: true
            });
        }
        if (shouldRefreshData(prevProps, this.props)) {
            if (this.shouldShowRPSChart()) {
                this.updateRpsChart(this.props);
            }
        }
    };
    SummaryPanelGraph.prototype.componentWillUnmount = function () {
        if (this.metricsPromise) {
            this.metricsPromise.cancel();
        }
    };
    SummaryPanelGraph.prototype.render = function () {
        var cy = this.props.data.summaryTarget;
        if (!cy) {
            return null;
        }
        var numSvc = cy.$("node[nodeType = \"" + NodeType.SERVICE + "\"]").size();
        var numWorkloads = cy.$("node[nodeType = \"" + NodeType.WORKLOAD + "\"]").size();
        var numApps = cy.$("node[nodeType = \"" + NodeType.APP + "\"][!isGroup]").size();
        var numEdges = cy.edges().size();
        // when getting accumulated traffic rates don't count requests from injected service nodes
        var nonServiceEdges = cy.$("node[nodeType != \"" + NodeType.SERVICE + "\"][!isGroup]").edgesTo('*');
        var trafficRateGrpc = getAccumulatedTrafficRateGrpc(nonServiceEdges);
        var trafficRateHttp = getAccumulatedTrafficRateHttp(nonServiceEdges);
        return (React.createElement("div", { className: "panel panel-default", style: SummaryPanelGraph.panelStyle },
            React.createElement("div", { className: "panel-heading" },
                React.createElement("strong", null,
                    "Namespace",
                    this.props.namespaces.length > 1 ? 's' : '',
                    ": "),
                this.props.namespaces.map(function (namespace) { return namespace.name; }).join(', '),
                this.renderTopologySummary(numSvc, numWorkloads, numApps, numEdges)),
            React.createElement("div", { className: "panel-body" },
                React.createElement("div", null,
                    trafficRateGrpc.rate > 0 && (React.createElement(RateTableGrpc, { title: "GRPC Traffic (requests per second):", rate: trafficRateGrpc.rate, rateErr: trafficRateGrpc.rateErr })),
                    trafficRateHttp.rate > 0 && (React.createElement(RateTableHttp, { title: "HTTP Traffic (requests per second):", rate: trafficRateHttp.rate, rate3xx: trafficRateHttp.rate3xx, rate4xx: trafficRateHttp.rate4xx, rate5xx: trafficRateHttp.rate5xx })),
                    this.shouldShowRPSChart() && (React.createElement("div", null,
                        React.createElement("hr", null),
                        this.renderRpsChart()))))));
    };
    SummaryPanelGraph.prototype.shouldShowRPSChart = function () {
        // TODO we omit the rps chart when dealing with multiple namespaces. There is no backend
        // API support to gather the data. The whole-graph chart is of nominal value, it will likely be OK.
        return this.props.namespaces.length === 1;
    };
    SummaryPanelGraph.panelStyle = {
        height: '100%',
        margin: 0,
        minWidth: '25em',
        overflowY: 'auto',
        width: '25em'
    };
    return SummaryPanelGraph;
}(React.Component));
export default SummaryPanelGraph;
//# sourceMappingURL=SummaryPanelGraph.js.map