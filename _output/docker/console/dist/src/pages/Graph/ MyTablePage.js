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
import { makeCancelablePromise } from '../../utils/CancelablePromises';
import * as API from '../../services/Api';
import { MyTable } from '../../components/SummaryPanel/MyTable';
import { shouldRefreshData } from './SummaryPanelCommon';
import { mergeMetricsResponses } from './SummaryPanelCommon';
import update from 'react-addons-update';
var MyTablePage = /** @class */ (function (_super) {
    __extends(MyTablePage, _super);
    function MyTablePage(props) {
        var _this = _super.call(this, props) || this;
        _this.updateMyTable = function (props) {
            var objectLists = [];
            for (var i = 0; i < _this.props.namespaces.length; i++) {
                var optionsRequest = {
                    filters: ['request_count', 'request_error_count'],
                    queryTime: props.queryTime,
                    duration: props.duration,
                    step: props.step,
                    rateInterval: props.rateInterval,
                    direction: 'inbound',
                    reporter: 'destination',
                    byLabels: ['destination_workload', 'destination_workload_namespace', 'destination_service'],
                };
                var promiseRequest = API.getNamespaceMetrics(props.namespaces[i].name, optionsRequest);
                var optionsLatency = {
                    filters: ['request_duration'],
                    queryTime: props.queryTime,
                    duration: props.duration,
                    step: props.step,
                    rateInterval: props.rateInterval,
                    direction: 'inbound',
                    reporter: 'destination',
                    byLabels: ['destination_workload', 'destination_workload_namespace'],
                    quantiles: ['0.5', '0.9', '0.99']
                };
                var promiseLatency = API.getNamespaceMetrics(props.namespaces[i].name, optionsLatency);
                _this.metricsPromise = makeCancelablePromise(mergeMetricsResponses([promiseRequest, promiseLatency]));
                _this.metricsPromise.promise
                    .then(function (response) {
                    var metrics = response.data.metrics;
                    var histograms = response.data.histograms;
                    for (var j = 0; j < metrics.request_count.matrix.length; j++) {
                        var service = metrics.request_count.matrix[j].metric['destination_service'];
                        var workload = metrics.request_count.matrix[j].metric['destination_workload'];
                        var requestRate = metrics.request_count.matrix[j].values.slice(-1)[0][1] * 1;
                        var rt50 = histograms.request_duration['0.5'];
                        var rt90 = histograms.request_duration['0.9'];
                        var rt99 = histograms.request_duration['0.99'];
                        var p50Latency = rt50.matrix[j].values.slice(-1)[0][1] * 1000;
                        var p90Latency = rt90.matrix[j].values.slice(-1)[0][1] * 1000;
                        var p99Latency = rt99.matrix[j].values.slice(-1)[0][1] * 1000;
                        var errorTotal = 0;
                        if (metrics.request_error_count.matrix.length != 0) {
                            errorTotal = metrics.request_error_count.matrix[j].values.slice(-1)[0][1];
                        }
                        var successRate = (errorTotal != 0) ? (errorTotal / requestRate) * 100 : 100;
                        objectLists.push({
                            service: service,
                            workload: workload,
                            requests: requestRate,
                            p50Latency: p50Latency,
                            p90Latency: p90Latency,
                            p99Latency: p99Latency,
                            successRate: successRate
                        });
                    }
                    if (!_this.state.loading) {
                        _this.setState({
                            meshData: update(_this.state.meshData, {
                                $splice: [[0, 1]],
                                $push: objectLists
                            }),
                        });
                    }
                    else {
                        _this.setState({
                            meshData: update(_this.state.meshData, {
                                $set: objectLists
                            }),
                        });
                    }
                });
            }
            ;
        };
        _this.state = {
            loading: false,
            meshData: [
                {
                    id: 0,
                    service: "",
                    workload: "",
                    p50Latency: 0,
                    p90Latency: 0,
                    p99Latency: 0,
                    requests: 0,
                    successRate: 0
                }
            ]
        };
        return _this;
    }
    MyTablePage.prototype.componentDidMount = function () {
        if (this.shouldShowMyTable()) {
            this.updateMyTable(this.props);
            this.setState({
                loading: true,
            });
        }
    };
    MyTablePage.prototype.componentDidUpdate = function (prevProps) {
        if (shouldRefreshData(prevProps, this.props)) {
            if (this.shouldShowMyTable()) {
                this.updateMyTable(this.props);
            }
        }
    };
    MyTablePage.prototype.componentWillUnmount = function () {
        if (this.metricsPromise) {
            this.metricsPromise.cancel();
        }
    };
    MyTablePage.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("table", { className: "table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Service"),
                        React.createElement("th", null, "Workload"),
                        React.createElement("th", null, "Requests"),
                        React.createElement("th", null, "P50 Latency"),
                        React.createElement("th", null, "P90 Latency"),
                        React.createElement("th", null, "P99 Latency"),
                        React.createElement("th", null, "Success Rate"))),
                React.createElement("tbody", null, (this.state.meshData || []).map(function (mesh, id) {
                    return (React.createElement(MyTable, { id: id, service: mesh.service, workload: mesh.workload, requests: mesh.requests, p50Latency: mesh.p50Latency, p90Latency: mesh.p90Latency, p99Latency: mesh.p99Latency, successRate: mesh.successRate }));
                })))));
    };
    MyTablePage.prototype.shouldShowMyTable = function () {
        // TODO we omit the rps chart when dealing with multiple namespaces. There is no backend
        // API support to gather the data. The whole-graph chart is of nominal value, it will likely be OK.
        return this.props.namespaces.length >= 1;
    };
    return MyTablePage;
}(React.Component));
export { MyTablePage };
//# sourceMappingURL= MyTablePage.js.map