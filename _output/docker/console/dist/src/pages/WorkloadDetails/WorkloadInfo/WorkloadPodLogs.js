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
import { Toolbar } from 'patternfly-react';
import { style } from 'typestyle';
import { getPodLogs } from '../../../services/Api';
import { makeCancelablePromise } from '../../../utils/CancelablePromises';
import { ToolbarDropdown } from '../../../components/ToolbarDropdown/ToolbarDropdown';
import MetricsDurationContainer from '../../../components/MetricsOptions/MetricsDuration';
import MetricsDuration from '../../../components/MetricsOptions/MetricsDuration';
import RefreshButtonContainer from '../../../components/Refresh/RefreshButton';
var TailLinesDefault = 500;
var TailLinesOptions = {
    '-1': 'All lines',
    '10': '10 lines',
    '50': '50 lines',
    '100': '100 lines',
    '300': '300 lines',
    '500': '500 lines',
    '1000': '1000 lines',
    '5000': '5000 lines'
};
var logsTextarea = style({
    width: '100%',
    // 75px is the height of the toolbar inside "Logs" tab
    height: 'calc(var(--kiali-details-pages-tab-content-height) - 75px)',
    overflow: 'auto',
    resize: 'vertical',
    color: '#fff',
    backgroundColor: '#003145',
    fontFamily: 'monospace',
    fontSize: '11pt'
});
var WorkloadPodLogs = /** @class */ (function (_super) {
    __extends(WorkloadPodLogs, _super);
    function WorkloadPodLogs(props) {
        var _this = _super.call(this, props) || this;
        _this.podOptions = {};
        _this.setPod = function (podValue) {
            var pod = _this.props.pods[Number(podValue)];
            var containerInfo = _this.getContainerInfo(pod);
            _this.setState({ containerInfo: containerInfo, podValue: Number(podValue) });
        };
        _this.setContainer = function (container) {
            _this.setState({
                containerInfo: { container: container, containerOptions: _this.state.containerInfo.containerOptions }
            });
        };
        _this.setDuration = function (duration) {
            _this.setState({ duration: duration });
        };
        _this.setTailLines = function (tailLines) {
            _this.setState({ tailLines: tailLines });
        };
        _this.handleRefresh = function () {
            var pod = _this.props.pods[_this.state.podValue];
            _this.fetchLogs(_this.props.namespace, pod.name, _this.state.containerInfo.container, _this.state.tailLines, _this.state.duration);
        };
        _this.getContainerInfo = function (pod) {
            var containers = pod.containers ? pod.containers : [];
            containers.push.apply(containers, (pod.istioContainers ? pod.istioContainers : []));
            var containerNames = containers.map(function (c) { return c.name; });
            var options = {};
            containerNames.forEach(function (c) {
                options[c] = c;
            });
            return { container: containerNames[0], containerOptions: options };
        };
        _this.fetchLogs = function (namespace, podName, container, tailLines, duration) {
            var sinceTime = Math.floor(Date.now() / 1000) - duration;
            var promise = getPodLogs(namespace, podName, container, tailLines, sinceTime);
            _this.loadPodLogsPromise = makeCancelablePromise(Promise.all([promise]));
            _this.loadPodLogsPromise.promise
                .then(function (response) {
                var podLogs = response[0].data;
                _this.setState({
                    loadingPodLogs: false,
                    podLogs: podLogs.logs ? podLogs : { logs: 'No logs found for the time period.' }
                });
                return;
            })
                .catch(function (error) {
                if (error.isCanceled) {
                    console.debug('PodLogs: Ignore fetch error (canceled).');
                    _this.setState({ loadingPodLogs: false });
                    return;
                }
                var errorMsg = error.response && error.response.data.error ? error.response.data.error : error.message;
                _this.setState({
                    loadingPodLogs: false,
                    podLogs: { logs: "Failed to fetch pod logs: " + errorMsg }
                });
            });
            _this.setState({
                loadingPodLogs: true,
                podLogs: undefined
            });
        };
        if (_this.props.pods.length < 1) {
            _this.state = {
                duration: MetricsDuration.initialDuration(),
                loadingPodLogs: false,
                loadingPodLogsError: 'There are no logs to display because no pods are available.',
                tailLines: TailLinesDefault
            };
            return _this;
        }
        if (_this.props.pods.length > 0) {
            for (var i = 0; i < _this.props.pods.length; ++i) {
                _this.podOptions["" + i] = _this.props.pods[i].name;
            }
        }
        var podValue = 0;
        var pod = _this.props.pods[podValue];
        var containerInfo = _this.getContainerInfo(pod);
        _this.state = {
            containerInfo: containerInfo,
            duration: MetricsDuration.initialDuration(),
            loadingPodLogs: false,
            podValue: podValue,
            tailLines: TailLinesDefault
        };
        return _this;
    }
    WorkloadPodLogs.prototype.componentDidMount = function () {
        if (this.state.containerInfo) {
            var pod = this.props.pods[this.state.podValue];
            this.fetchLogs(this.props.namespace, pod.name, this.state.containerInfo.container, this.state.tailLines, this.state.duration);
        }
    };
    WorkloadPodLogs.prototype.componentDidUpdate = function (_prevProps, prevState) {
        var prevContainer = prevState.containerInfo ? prevState.containerInfo.container : undefined;
        var newContainer = this.state.containerInfo ? this.state.containerInfo.container : undefined;
        var updateContainerInfo = this.state.containerInfo && this.state.containerInfo !== prevState.containerInfo;
        var updateContainer = newContainer && newContainer !== prevContainer;
        var updateDuration = this.state.duration && prevState.duration !== this.state.duration;
        var updateTailLines = this.state.tailLines && prevState.tailLines !== this.state.tailLines;
        if (updateContainerInfo || updateContainer || updateDuration || updateTailLines) {
            var pod = this.props.pods[this.state.podValue];
            this.fetchLogs(this.props.namespace, pod.name, newContainer, this.state.tailLines, this.state.duration);
        }
    };
    WorkloadPodLogs.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            this.state.containerInfo && (React.createElement(React.Fragment, null,
                React.createElement(Toolbar, null,
                    React.createElement(ToolbarDropdown, { id: 'wpl_pods', nameDropdown: "Pod", tooltip: "Display logs for the selected pod", handleSelect: function (key) { return _this.setPod(key); }, value: this.state.podValue, label: this.props.pods[this.state.podValue].name, options: this.podOptions }),
                    React.createElement(ToolbarDropdown, { id: 'wpl_containers', nameDropdown: "\u00A0\u00A0\u00A0Container", tooltip: "Display logs for the selected pod container", handleSelect: function (key) { return _this.setContainer(key); }, value: this.state.containerInfo.container, label: this.state.containerInfo.container, options: this.state.containerInfo.containerOptions }),
                    React.createElement(Toolbar.RightContent, null,
                        React.createElement(ToolbarDropdown, { id: 'wpl_tailLines', nameDropdown: "Tail", handleSelect: function (key) { return _this.setTailLines(Number(key)); }, value: this.state.tailLines, label: TailLinesOptions[this.state.tailLines], options: TailLinesOptions, tooltip: 'Show up to last N log lines' }),
                        '   ',
                        React.createElement(MetricsDurationContainer, { tooltip: "Time range for log messages", onChanged: this.setDuration }),
                        '  ',
                        React.createElement(RefreshButtonContainer, { id: 'wpl_refresh', disabled: !this.state.podLogs, handleRefresh: this.handleRefresh }))),
                React.createElement("textarea", { className: logsTextarea, readOnly: true, value: this.state.podLogs ? this.state.podLogs.logs : 'Loading logs...' }))),
            this.state.loadingPodLogsError && React.createElement("div", null, this.state.loadingPodLogsError)));
    };
    return WorkloadPodLogs;
}(React.Component));
export default WorkloadPodLogs;
//# sourceMappingURL=WorkloadPodLogs.js.map