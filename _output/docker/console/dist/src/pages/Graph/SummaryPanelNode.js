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
import { renderDestServicesLinks, RenderLink, renderTitle } from './SummaryLink';
import { Icon } from 'patternfly-react';
import { getAccumulatedTrafficRateGrpc, getAccumulatedTrafficRateHttp, getTrafficRateGrpc, getTrafficRateHttp } from '../../utils/TrafficRate';
import { InOutRateTableGrpc, InOutRateTableHttp } from '../../components/SummaryPanel/InOutRateTable';
import { RpsChart, TcpChart } from '../../components/SummaryPanel/RpsChart';
import { GraphType, NodeType, Protocol } from '../../types/Graph';
import { shouldRefreshData, updateHealth, nodeData, NodeMetricType, getDatapoints, getNodeMetrics, getNodeMetricType, renderLabels, renderNoTraffic, mergeMetricsResponses } from './SummaryPanelCommon';
import { HealthIndicator, DisplayMode } from '../../components/Health/HealthIndicator';
import { makeCancelablePromise } from '../../utils/CancelablePromises';
import { icons } from '../../config/Icons';
import { serverConfig } from '../../config/ServerConfig';
import { CyNode } from '../../components/CytoscapeGraph/CytoscapeGraphUtils';
var SummaryPanelNode = /** @class */ (function (_super) {
    __extends(SummaryPanelNode, _super);
    function SummaryPanelNode(props) {
        var _this = _super.call(this, props) || this;
        _this.isActiveNamespace = function (namespace) {
            if (!namespace) {
                return false;
            }
            for (var _i = 0, _a = _this.props.namespaces; _i < _a.length; _i++) {
                var ns = _a[_i];
                if (ns.name === namespace) {
                    return true;
                }
            }
            return false;
        };
        _this.renderGrpcRates = function (node) {
            var incoming = getTrafficRateGrpc(node);
            var outgoing = getAccumulatedTrafficRateGrpc(_this.props.data.summaryTarget.edgesTo('*'));
            return (React.createElement(React.Fragment, null,
                React.createElement(InOutRateTableGrpc, { title: "GRPC Traffic (requests per second):", inRate: incoming.rate, inRateErr: incoming.rateErr, outRate: outgoing.rate, outRateErr: outgoing.rateErr }),
                React.createElement("hr", null)));
        };
        _this.renderHttpRates = function (node) {
            var incoming = getTrafficRateHttp(node);
            var outgoing = getAccumulatedTrafficRateHttp(_this.props.data.summaryTarget.edgesTo('*'));
            return (React.createElement(React.Fragment, null,
                React.createElement(InOutRateTableHttp, { title: "HTTP Traffic (requests per second):", inRate: incoming.rate, inRate3xx: incoming.rate3xx, inRate4xx: incoming.rate4xx, inRate5xx: incoming.rate5xx, outRate: outgoing.rate, outRate3xx: outgoing.rate3xx, outRate4xx: outgoing.rate4xx, outRate5xx: outgoing.rate5xx }),
                React.createElement("hr", null)));
        };
        _this.renderCharts = function (node) {
            var data = nodeData(node);
            if (NodeType.UNKNOWN === data.nodeType) {
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", null,
                        React.createElement(Icon, { type: "pf", name: "info" }),
                        " Sparkline charts not supported for unknown node. Use edge for details.",
                        React.createElement("hr", null))));
            }
            else if (data.isInaccessible) {
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", null,
                        React.createElement(Icon, { type: "pf", name: "info" }),
                        " Sparkline charts cannot be shown because the selected node is inaccessible.",
                        React.createElement("hr", null))));
            }
            else if (data.isServiceEntry) {
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", null,
                        React.createElement(Icon, { type: "pf", name: "info" }),
                        " Sparkline charts cannot be shown because the selected node is a serviceEntry.",
                        React.createElement("hr", null))));
            }
            if (_this.state.loading && !_this.state.grpcRequestCountIn) {
                return React.createElement("strong", null, "Loading charts...");
            }
            if (_this.state.metricsLoadError) {
                return (React.createElement("div", null,
                    React.createElement(Icon, { type: "pf", name: "warning-triangle-o" }),
                    " ",
                    React.createElement("strong", null, "Error loading metrics: "),
                    _this.state.metricsLoadError));
            }
            var isServiceNode = node.data(CyNode.nodeType) === NodeType.SERVICE;
            var serviceWithUnknownSource = false;
            if (isServiceNode) {
                for (var _i = 0, _a = node.incomers(); _i < _a.length; _i++) {
                    var n = _a[_i];
                    if (NodeType.UNKNOWN === n.data(CyNode.nodeType)) {
                        serviceWithUnknownSource = true;
                        break;
                    }
                }
            }
            var grpcCharts, httpCharts, tcpCharts;
            if (_this.hasGrpcTraffic(node)) {
                grpcCharts = (React.createElement(React.Fragment, null,
                    React.createElement(RpsChart, { label: isServiceNode ? 'GRPC - Request Traffic' : 'GRPC - Inbound Request Traffic', dataRps: _this.state.grpcRequestCountIn, dataErrors: _this.state.grpcErrorCountIn }),
                    serviceWithUnknownSource && (React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            React.createElement(Icon, { type: "pf", name: "info" }),
                            " Traffic from unknown not included. Use edge for details."))),
                    React.createElement(RpsChart, { label: "GRPC - Outbound Request Traffic", dataRps: _this.state.grpcRequestCountOut, dataErrors: _this.state.grpcErrorCountOut, hide: isServiceNode }),
                    _this.isIstioOutgoingCornerCase(node) && (React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            React.createElement(Icon, { type: "pf", name: "info" }),
                            " Traffic to istio-system not included. Use edge for details."))),
                    React.createElement("hr", null)));
            }
            if (_this.hasHttpTraffic(node)) {
                httpCharts = (React.createElement(React.Fragment, null,
                    React.createElement(RpsChart, { label: isServiceNode ? 'HTTP - Request Traffic' : 'HTTP - Inbound Request Traffic', dataRps: _this.state.httpRequestCountIn, dataErrors: _this.state.httpErrorCountIn }),
                    serviceWithUnknownSource && (React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            React.createElement(Icon, { type: "pf", name: "info" }),
                            " Traffic from unknown not included. Use edge for details."))),
                    React.createElement(RpsChart, { label: "HTTP - Outbound Request Traffic", dataRps: _this.state.httpRequestCountOut, dataErrors: _this.state.httpErrorCountOut, hide: isServiceNode }),
                    _this.isIstioOutgoingCornerCase(node) && (React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            React.createElement(Icon, { type: "pf", name: "info" }),
                            " Traffic to istio-system not included. Use edge for details."))),
                    React.createElement("hr", null)));
            }
            if (_this.hasTcpTraffic(node)) {
                tcpCharts = (React.createElement(React.Fragment, null,
                    React.createElement(TcpChart, { label: isServiceNode ? 'TCP - Traffic' : 'TCP - Inbound Traffic', receivedRates: _this.state.tcpReceivedIn, sentRates: _this.state.tcpSentIn }),
                    React.createElement(TcpChart, { label: "TCP - Outbound Traffic", receivedRates: _this.state.tcpReceivedOut, sentRates: _this.state.tcpSentOut, hide: isServiceNode }),
                    React.createElement("hr", null)));
            }
            return (React.createElement(React.Fragment, null,
                grpcCharts,
                httpCharts,
                tcpCharts));
        };
        // TODO:(see https://github.com/kiali/kiali-design/issues/63) If we want to show an icon for SE uncomment below
        _this.renderBadgeSummary = function (hasCB, hasVS, hasMissingSC, isDead) {
            return (React.createElement(React.Fragment, null,
                hasCB && (React.createElement("div", null,
                    React.createElement(Icon, { name: icons.istio.circuitBreaker.name, type: icons.istio.circuitBreaker.type, style: { width: '10px' } }),
                    React.createElement("span", { style: { paddingLeft: '4px' } }, "Has Circuit Breaker"))),
                hasVS && (React.createElement("div", null,
                    React.createElement(Icon, { name: icons.istio.virtualService.name, type: icons.istio.virtualService.type, style: { width: '10px' } }),
                    React.createElement("span", { style: { paddingLeft: '4px' } }, "Has Virtual Service"))),
                hasMissingSC && (React.createElement("div", null,
                    React.createElement(Icon, { name: icons.istio.missingSidecar.name, type: icons.istio.missingSidecar.type, style: { width: '10px', marginRight: '5px' } }),
                    React.createElement("span", { style: { paddingLeft: '4px' } }, "Has Missing Sidecar"))),
                isDead && (React.createElement("div", null,
                    React.createElement(Icon, { type: "pf", name: "info", style: { width: '10px', marginRight: '5px' } }),
                    React.createElement("span", { style: { paddingLeft: '4px' } }, "Has No Running Pods")))));
        };
        _this.renderDestServices = function (node) {
            var destServices = node.data(CyNode.destServices);
            var entries = [];
            if (!destServices) {
                return entries;
            }
            destServices.forEach(function (ds) {
                var service = ds.name;
                var key = ds.namespace + ".svc." + service;
                var displayName = service;
                entries.push(React.createElement("span", { key: key }, displayName));
                entries.push(React.createElement("span", { key: "comma-after-" + ds.name }, ", "));
            });
            if (entries.length > 0) {
                entries.pop();
            }
            return entries;
        };
        // We need to handle the special case of a dest service node showing client failures. These service nodes show up in
        // non-service graphs, even when not injecting service nodes.
        _this.isServiceDestCornerCase = function (nodeMetricType) {
            return (nodeMetricType === NodeMetricType.SERVICE &&
                !_this.props.injectServiceNodes &&
                _this.props.graphType !== GraphType.SERVICE);
        };
        // We need to handle the special case of a non-istio-system, non-unknown node with outgoing traffic to istio-system.
        // The traffic is lost because it is dest-only and we use source-reporting.
        _this.isIstioOutgoingCornerCase = function (node) {
            var nodeType = node.data(CyNode.nodeType);
            var namespace = node.data(CyNode.namespace);
            var istioNamespace = serverConfig.istioNamespace;
            if (nodeType === NodeType.UNKNOWN || namespace === istioNamespace) {
                return false;
            }
            return node.edgesTo("node[" + CyNode.namespace + " = \"" + istioNamespace + "\"]").size() > 0;
        };
        _this.hasGrpcTraffic = function (node) {
            return node.data(CyNode.grpcIn) > 0 || node.data(CyNode.grpcOut) > 0;
        };
        _this.hasHttpTraffic = function (node) {
            return node.data(CyNode.httpIn) > 0 || node.data(CyNode.httpOut) > 0;
        };
        _this.hasTcpTraffic = function (node) {
            return node.data(CyNode.tcpIn) > 0 || node.data(CyNode.tcpOut) > 0;
        };
        _this.showRequestCountMetrics = _this.showRequestCountMetrics.bind(_this);
        _this.state = {
            loading: true,
            grpcRequestCountIn: null,
            grpcRequestCountOut: [],
            grpcErrorCountIn: [],
            grpcErrorCountOut: [],
            httpRequestCountIn: null,
            httpRequestCountOut: [],
            httpErrorCountIn: [],
            httpErrorCountOut: [],
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
    SummaryPanelNode.prototype.componentDidMount = function () {
        this.updateCharts(this.props);
        updateHealth(this.props.data.summaryTarget, this.setState.bind(this));
    };
    SummaryPanelNode.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.data.summaryTarget !== this.props.data.summaryTarget) {
            this.setState({
                grpcRequestCountIn: null,
                loading: true
            });
            if (this.mainDivRef.current) {
                this.mainDivRef.current.scrollTop = 0;
            }
        }
        if (shouldRefreshData(prevProps, this.props)) {
            this.updateCharts(this.props);
            updateHealth(this.props.data.summaryTarget, this.setState.bind(this));
        }
    };
    SummaryPanelNode.prototype.componentWillUnmount = function () {
        if (this.metricsPromise) {
            this.metricsPromise.cancel();
        }
    };
    SummaryPanelNode.prototype.updateCharts = function (props) {
        var _this = this;
        var target = props.data.summaryTarget;
        var data = nodeData(target);
        var nodeMetricType = getNodeMetricType(data);
        if (this.metricsPromise) {
            this.metricsPromise.cancel();
            this.metricsPromise = undefined;
        }
        if (!this.hasGrpcTraffic(target) && !this.hasHttpTraffic(target) && !this.hasTcpTraffic(target)) {
            this.setState({ loading: false });
            return;
        }
        // If destination node is inaccessible, we cannot query the data.
        if (data.isInaccessible) {
            this.setState({ loading: false });
            return;
        }
        var promiseOut = Promise.resolve({ data: { metrics: {}, histograms: {} } });
        var promiseIn = Promise.resolve({ data: { metrics: {}, histograms: {} } });
        // Ignore outgoing traffic if it is a non-root outsider (because they have no outgoing edges) or a
        // service node (because they don't have "real" outgoing edges).
        if (data.nodeType !== NodeType.SERVICE && (data.isRoot || !data.isOutsider)) {
            var filters = ['request_count', 'request_error_count', 'tcp_sent', 'tcp_received'];
            // use source metrics for outgoing, except for:
            // - unknown nodes (no source telemetry)
            // - istio namespace nodes (no source telemetry)
            var reporter = data.nodeType === NodeType.UNKNOWN || data.namespace === serverConfig.istioNamespace ? 'destination' : 'source';
            // note: request_protocol is not a valid byLabel for tcp filters but it is ignored by prometheus
            var byLabels = data.isRoot ? ['destination_service_namespace', 'request_protocol'] : ['request_protocol'];
            promiseOut = getNodeMetrics(nodeMetricType, target, props, filters, 'outbound', reporter, undefined, undefined, byLabels);
        }
        // set incoming unless it is a root (because they have no incoming edges)
        if (!data.isRoot) {
            var filtersRps = ['request_count', 'request_error_count'];
            // use dest metrics for incoming, except for service nodes which need source metrics to capture source errors
            var reporter = data.nodeType === NodeType.SERVICE && data.namespace !== serverConfig.istioNamespace ? 'source' : 'destination';
            // For special service dest nodes we want to narrow the data to only TS with 'unknown' workloads (see the related
            // comparator in getNodeDatapoints).
            var isServiceDestCornerCase = this.isServiceDestCornerCase(nodeMetricType);
            var byLabelsRps = isServiceDestCornerCase ? ['destination_workload', 'request_protocol'] : ['request_protocol'];
            var promiseRps = getNodeMetrics(nodeMetricType, target, props, filtersRps, 'inbound', reporter, undefined, undefined, byLabelsRps);
            var filtersTCP = ['tcp_sent', 'tcp_received'];
            var byLabelsTCP = isServiceDestCornerCase ? ['destination_workload'] : undefined;
            var promiseTCP = getNodeMetrics(nodeMetricType, target, props, filtersTCP, 'inbound', 'source', undefined, undefined, byLabelsTCP);
            promiseIn = mergeMetricsResponses([promiseRps, promiseTCP]);
        }
        this.metricsPromise = makeCancelablePromise(Promise.all([promiseOut, promiseIn]));
        this.metricsPromise.promise
            .then(function (responses) {
            _this.showRequestCountMetrics(responses[0].data, responses[1].data, data, nodeMetricType);
        })
            .catch(function (error) {
            if (error.isCanceled) {
                console.debug('SummaryPanelNode: Ignore fetch error (canceled).');
                return;
            }
            var errorMsg = error.response && error.response.data.error ? error.response.data.error : error.message;
            _this.setState({
                loading: false,
                metricsLoadError: errorMsg,
                grpcRequestCountIn: null
            });
        });
        this.setState({ loading: true, metricsLoadError: null });
    };
    SummaryPanelNode.prototype.showRequestCountMetrics = function (outbound, inbound, data, nodeMetricType) {
        var _this = this;
        var comparator = function (metric, protocol) {
            return protocol ? metric.request_protocol === protocol : true;
        };
        if (this.isServiceDestCornerCase(nodeMetricType)) {
            comparator = function (metric, protocol) {
                return (protocol ? metric.request_protocol === protocol : true) && metric.destination_workload === 'unknown';
            };
        }
        else if (data.isRoot) {
            comparator = function (metric, protocol) {
                return ((protocol ? metric.request_protocol === protocol : true) &&
                    _this.isActiveNamespace(metric.destination_service_namespace));
            };
        }
        var rcOut = outbound.metrics.request_count;
        var ecOut = outbound.metrics.request_error_count;
        var tcpSentOut = outbound.metrics.tcp_sent;
        var tcpReceivedOut = outbound.metrics.tcp_received;
        var rcIn = inbound.metrics.request_count;
        var ecIn = inbound.metrics.request_error_count;
        var tcpSentIn = inbound.metrics.tcp_sent;
        var tcpReceivedIn = inbound.metrics.tcp_received;
        this.setState({
            loading: false,
            grpcRequestCountOut: getDatapoints(rcOut, 'RPS', comparator, Protocol.GRPC),
            grpcErrorCountOut: getDatapoints(ecOut, 'Error', comparator, Protocol.GRPC),
            grpcRequestCountIn: getDatapoints(rcIn, 'RPS', comparator, Protocol.GRPC),
            grpcErrorCountIn: getDatapoints(ecIn, 'Error', comparator, Protocol.GRPC),
            httpRequestCountOut: getDatapoints(rcOut, 'RPS', comparator, Protocol.HTTP),
            httpErrorCountOut: getDatapoints(ecOut, 'Error', comparator, Protocol.HTTP),
            httpRequestCountIn: getDatapoints(rcIn, 'RPS', comparator, Protocol.HTTP),
            httpErrorCountIn: getDatapoints(ecIn, 'Error', comparator, Protocol.HTTP),
            tcpSentOut: getDatapoints(tcpSentOut, 'Sent', comparator),
            tcpReceivedOut: getDatapoints(tcpReceivedOut, 'Received', comparator),
            tcpSentIn: getDatapoints(tcpSentIn, 'Sent', comparator),
            tcpReceivedIn: getDatapoints(tcpReceivedIn, 'Received', comparator)
        });
    };
    SummaryPanelNode.prototype.render = function () {
        var node = this.props.data.summaryTarget;
        var data = nodeData(node);
        var nodeType = data.nodeType, workload = data.workload, isServiceEntry = data.isServiceEntry;
        var servicesList = nodeType !== NodeType.SERVICE && renderDestServicesLinks(node);
        var destsList = nodeType === NodeType.SERVICE && isServiceEntry && this.renderDestServices(node);
        var shouldRenderDestsList = destsList && destsList.length > 0;
        var shouldRenderSvcList = servicesList && servicesList.length > 0;
        var shouldRenderWorkload = nodeType !== NodeType.WORKLOAD && nodeType !== NodeType.UNKNOWN && workload;
        return (React.createElement("div", { ref: this.mainDivRef, className: "panel panel-default", style: SummaryPanelNode.panelStyle },
            React.createElement("div", { className: "panel-heading" },
                this.state.healthLoading ? (
                // Remove glitch while health is being reloaded
                React.createElement("span", { style: { width: 18, height: 17, display: 'inline-block' } })) : (this.state.health && (React.createElement(HealthIndicator, { id: "graph-health-indicator", mode: DisplayMode.SMALL, health: this.state.health, tooltipPlacement: "left" }))),
                React.createElement("span", null,
                    " ",
                    renderTitle(data)),
                renderLabels(data),
                this.renderBadgeSummary(node.data(CyNode.hasCB), node.data(CyNode.hasVS), node.data(CyNode.hasMissingSC), node.data(CyNode.isDead))),
            React.createElement("div", { className: "panel-body" },
                shouldRenderDestsList && (React.createElement("div", null,
                    React.createElement("strong", null, "Destinations: "),
                    destsList)),
                shouldRenderSvcList && (React.createElement("div", null,
                    React.createElement("strong", null, "Services: "),
                    servicesList)),
                shouldRenderWorkload && (React.createElement("div", null,
                    React.createElement("strong", null, "Workload: "),
                    React.createElement(RenderLink, { data: data, nodeType: NodeType.WORKLOAD }))),
                (shouldRenderDestsList || shouldRenderSvcList || shouldRenderWorkload) && React.createElement("hr", null),
                this.hasGrpcTraffic(node) && this.renderGrpcRates(node),
                this.hasHttpTraffic(node) && this.renderHttpRates(node),
                React.createElement("div", null, this.renderCharts(node)),
                !this.hasGrpcTraffic(node) && renderNoTraffic('GRPC'),
                !this.hasHttpTraffic(node) && renderNoTraffic('HTTP'))));
    };
    SummaryPanelNode.panelStyle = {
        height: '100%',
        margin: 0,
        minWidth: '25em',
        overflowY: 'auto',
        width: '25em'
    };
    return SummaryPanelNode;
}(React.Component));
export default SummaryPanelNode;
//# sourceMappingURL=SummaryPanelNode.js.map