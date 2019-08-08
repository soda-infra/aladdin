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
// import { Link } from 'react-router-dom';
// import { RateTableGrpc, RateTableHttp } from '../../components/SummaryPanel/RateTable';
// import { RpsChart, TcpChart } from '../../components/SummaryPanel/RpsChart';
// import {MyTable} from '../../components/SummaryPanel/MyTable';
import { NodeType } from '../../types/Graph';
import { getAccumulatedTrafficRateHttp } from '../../utils/TrafficRate';
import * as API from '../../services/Api';
// import { Icon } from 'patternfly-react';
import { getDatapoints, mergeMetricsResponses } from './SummaryPanelCommon';
import { makeCancelablePromise } from '../../utils/CancelablePromises';
var SummaryPanelMesh = /** @class */ (function (_super) {
    __extends(SummaryPanelMesh, _super);
    function SummaryPanelMesh() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getRequestTotal = function (props) {
            var options = {
                filters: ['request_count', 'request_error_count'],
                queryTime: props.queryTime,
                duration: props.duration,
                step: props.step,
                rateInterval: props.rateInterval,
                direction: 'inbound',
                reporter: 'destination',
                byLabels: ['destination_workload', 'destination_workload_namespace', 'destination_service']
            };
            var promiseHTTP = API.getNamespaceMetrics(props.namespaces[0].name, options);
            _this.metricsPromise = makeCancelablePromise(mergeMetricsResponses([promiseHTTP]));
            console.log("1111********************");
            console.log(_this.metricsPromise);
            console.log("1111********************");
            _this.metricsPromise.promise
                .then(function (response) {
                console.log("2222********************");
                console.log(response.data.metrics);
                console.log("2222********************");
                var reqTotal = getDatapoints(response.data.metrics.request_count, 'RPS');
                // const errRates = getDatapoints(response.data.metrics.request_error_count, 'Error');
                // const tcpSent = getDatapoints(response.data.metrics.tcp_sent, 'Sent');
                // const tcpReceived = getDatapoints(response.data.metrics.tcp_received, 'Received');
                _this.setState({
                    loading: false,
                    reqRates: reqTotal,
                });
            })
                .catch(function (error) {
                if (error.isCanceled) {
                    console.debug('SummaryPanelMesh: Ignore fetch error (canceled).');
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
        return _this;
    }
    SummaryPanelMesh.prototype.render = function () {
        var cy = this.props.data.summaryTarget;
        if (!cy) {
            return null;
        }
        // when getting accumulated traffic rates don't count requests from injected service nodes
        var nonServiceEdges = cy.$("node[nodeType != \"" + NodeType.SERVICE + "\"][!isGroup]").edgesTo('*');
        var trafficRateHttp = getAccumulatedTrafficRateHttp(nonServiceEdges);
        var requestTotal = this.getRequestTotal(this.props);
        console.log("0000********************");
        console.log(requestTotal);
        console.log("0000********************");
        return (React.createElement("div", { className: "panel panel-default", style: SummaryPanelMesh.panelStyle },
            React.createElement("div", { className: "panel-body" },
                React.createElement("div", null, trafficRateHttp.rate > 0
                // && (
                //   <MyTable
                //     Requests={requestTotal.reqRates}
                // rate3xx={trafficRateHttp.rate3xx}
                // rate4xx={trafficRateHttp.rate4xx}
                // rate5xx={trafficRateHttp.rate5xx}
                //   />
                // )
                ))));
    };
    SummaryPanelMesh.panelStyle = {
        height: '100%',
        margin: 0,
        minWidth: '25em',
        overflowY: 'auto',
        width: '25em'
    };
    return SummaryPanelMesh;
}(React.Component));
export default SummaryPanelMesh;
//# sourceMappingURL=SummaryPanelMesh.js.map