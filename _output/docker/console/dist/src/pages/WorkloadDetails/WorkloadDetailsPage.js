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
import * as API from '../../services/Api';
import { emptyWorkload } from '../../types/Workload';
import { Nav, NavItem, TabContainer, TabContent, TabPane } from 'patternfly-react';
import WorkloadInfo from './WorkloadInfo';
import * as MessageCenter from '../../utils/MessageCenter';
import IstioMetricsContainer from '../../components/Metrics/IstioMetrics';
import { MetricsObjectTypes } from '../../types/Metrics';
import CustomMetricsContainer from '../../components/Metrics/CustomMetrics';
import { serverConfig } from '../../config/ServerConfig';
import BreadcrumbView from '../../components/BreadcrumbView/BreadcrumbView';
import PfTitle from '../../components/Pf/PfTitle';
import { GraphType, NodeType } from '../../types/Graph';
import { fetchTrafficDetails } from '../../helpers/TrafficDetailsHelper';
import TrafficDetails from '../../components/Metrics/TrafficDetails';
import MetricsDuration from '../../components/MetricsOptions/MetricsDuration';
import WorkloadPodLogs from './WorkloadInfo/WorkloadPodLogs';
import { connect } from 'react-redux';
import { durationSelector } from '../../store/Selectors';
var WorkloadDetails = /** @class */ (function (_super) {
    __extends(WorkloadDetails, _super);
    function WorkloadDetails(props) {
        var _this = _super.call(this, props) || this;
        _this.doRefresh = function () {
            var currentTab = _this.activeTab('tab', 'info');
            if (_this.state.workload === emptyWorkload || currentTab === 'info') {
                _this.setState({ trafficData: null });
                _this.fetchWorkload();
            }
            if (currentTab === 'traffic') {
                _this.fetchTrafficData();
            }
        };
        _this.fetchTrafficData = function () {
            var node = {
                workload: _this.props.match.params.workload,
                namespace: { name: _this.props.match.params.namespace },
                nodeType: NodeType.WORKLOAD,
                // unneeded
                app: '',
                service: '',
                version: ''
            };
            var restParams = {
                duration: MetricsDuration.initialDuration() + "s",
                graphType: GraphType.WORKLOAD,
                injectServiceNodes: true,
                appenders: 'deadNode'
            };
            fetchTrafficDetails(node, restParams).then(function (trafficData) {
                if (trafficData !== undefined) {
                    _this.setState({ trafficData: trafficData });
                }
            });
        };
        _this.fetchWorkload = function () {
            API.getWorkload(_this.props.match.params.namespace, _this.props.match.params.workload)
                .then(function (details) {
                _this.setState({
                    workload: details.data,
                    validations: _this.workloadValidations(details.data),
                    istioEnabled: details.data.istioSidecar
                });
                return API.getWorkloadHealth(_this.props.match.params.namespace, _this.props.match.params.workload, _this.props.duration, details.data.istioSidecar);
            })
                .then(function (health) { return _this.setState({ health: health }); })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not fetch Workload', error));
            });
        };
        _this.checkIstioEnabled = function (validations) {
            var istioEnabled = true;
            Object.keys(validations)
                .map(function (key) { return validations[key]; })
                .forEach(function (obj) {
                Object.keys(obj).forEach(function (key) {
                    istioEnabled = obj[key].checks.filter(function (check) { return check.message === 'Pod has no Istio sidecar'; }).length < 1;
                });
            });
            return istioEnabled;
        };
        _this.activeTab = function (tabName, whenEmpty) {
            return new URLSearchParams(_this.props.location.search).get(tabName) || whenEmpty;
        };
        _this.handleTrafficDurationChange = function () {
            _this.fetchTrafficData();
        };
        _this.tabChangeHandler = function (tabName) {
            if (tabName === 'traffic' && _this.state.trafficData === null) {
                _this.fetchTrafficData();
            }
        };
        _this.tabSelectHandler = function (tabName, postHandler) {
            return function (tabKey) {
                if (!tabKey) {
                    return;
                }
                var urlParams = new URLSearchParams('');
                urlParams.set(tabName, tabKey);
                _this.props.history.push(_this.props.location.pathname + '?' + urlParams.toString());
                if (postHandler) {
                    postHandler(tabKey);
                }
            };
        };
        _this.state = {
            workload: emptyWorkload,
            validations: {},
            istioEnabled: true,
            trafficData: null
        };
        return _this;
    }
    WorkloadDetails.prototype.componentDidMount = function () {
        this.doRefresh();
    };
    WorkloadDetails.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (this.props.match.params.namespace !== prevProps.match.params.namespace ||
            this.props.match.params.workload !== prevProps.match.params.workload ||
            this.props.duration !== prevProps.duration) {
            this.setState({
                workload: emptyWorkload,
                validations: {},
                istioEnabled: true,
                health: undefined
            }, function () { return _this.doRefresh(); });
        }
    };
    // All information for validations is fetched in the workload, no need to add another call
    WorkloadDetails.prototype.workloadValidations = function (workload) {
        var noIstiosidecar = { message: 'Pod has no Istio sidecar', severity: 'warning', path: '' };
        var noAppLabel = { message: 'Pod has no app label', severity: 'warning', path: '' };
        var noVersionLabel = { message: 'Pod has no version label', severity: 'warning', path: '' };
        var pendingPod = { message: 'Pod is in Pending Phase', severity: 'warning', path: '' };
        var unknownPod = { message: 'Pod is in Unknown Phase', severity: 'warning', path: '' };
        var failedPod = { message: 'Pod is in Failed Phase', severity: 'error', path: '' };
        var validations = {};
        if (workload.pods.length > 0) {
            validations.pod = {};
            workload.pods.forEach(function (pod) {
                validations.pod[pod.name] = {
                    name: pod.name,
                    objectType: 'pod',
                    valid: true,
                    checks: []
                };
                if (!pod.istioContainers || pod.istioContainers.length === 0) {
                    validations.pod[pod.name].checks.push(noIstiosidecar);
                }
                if (!pod.labels) {
                    validations.pod[pod.name].checks.push(noAppLabel);
                    validations.pod[pod.name].checks.push(noVersionLabel);
                }
                else {
                    if (!pod.appLabel) {
                        validations.pod[pod.name].checks.push(noAppLabel);
                    }
                    if (!pod.versionLabel) {
                        validations.pod[pod.name].checks.push(noVersionLabel);
                    }
                }
                switch (pod.status) {
                    case 'Pending':
                        validations.pod[pod.name].checks.push(pendingPod);
                        break;
                    case 'Unknown':
                        validations.pod[pod.name].checks.push(unknownPod);
                        break;
                    case 'Failed':
                        validations.pod[pod.name].checks.push(failedPod);
                        break;
                    default:
                    // Pod healthy
                }
                validations.pod[pod.name].valid = validations.pod[pod.name].checks.length === 0;
            });
        }
        return validations;
    };
    WorkloadDetails.prototype.render = function () {
        var _this = this;
        var app = this.state.workload.labels[serverConfig.istioLabels.appLabelName];
        var version = this.state.workload.labels[serverConfig.istioLabels.versionLabelName];
        var isLabeled = app && version;
        var hasPods = this.state.workload.pods && this.state.workload.pods.length > 0;
        return (React.createElement(React.Fragment, null,
            React.createElement(BreadcrumbView, { location: this.props.location }),
            React.createElement(PfTitle, { location: this.props.location, istio: this.state.istioEnabled }),
            React.createElement(TabContainer, { id: "basic-tabs", activeKey: this.activeTab('tab', 'info'), onSelect: this.tabSelectHandler('tab', this.tabChangeHandler) },
                React.createElement("div", null,
                    React.createElement(Nav, { bsClass: "nav nav-tabs nav-tabs-pf" },
                        React.createElement(NavItem, { eventKey: "info" }, "Overview"),
                        React.createElement(NavItem, { eventKey: "traffic" }, "Traffic"),
                        React.createElement(NavItem, { eventKey: "logs" }, "Logs"),
                        React.createElement(NavItem, { eventKey: "in_metrics" }, "Inbound Metrics"),
                        React.createElement(NavItem, { eventKey: "out_metrics" }, "Outbound Metrics"),
                        isLabeled &&
                            this.state.workload.runtimes.map(function (runtime) {
                                return runtime.dashboardRefs.map(function (dashboard) {
                                    return (React.createElement(NavItem, { key: dashboard.template, eventKey: dashboard.template }, dashboard.title));
                                });
                            })),
                    React.createElement(TabContent, null,
                        React.createElement(TabPane, { eventKey: "info", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(WorkloadInfo, { workload: this.state.workload, namespace: this.props.match.params.namespace, validations: this.state.validations, onRefresh: this.doRefresh, activeTab: this.activeTab, onSelectTab: this.tabSelectHandler, istioEnabled: this.state.istioEnabled, health: this.state.health })),
                        React.createElement(TabPane, { eventKey: "traffic", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(TrafficDetails, { trafficData: this.state.trafficData, itemType: MetricsObjectTypes.WORKLOAD, namespace: this.props.match.params.namespace, workloadName: this.state.workload.name, onDurationChanged: this.handleTrafficDurationChange, onRefresh: this.doRefresh })),
                        React.createElement(TabPane, { eventKey: "logs", mountOnEnter: true, unmountOnExit: true }, hasPods ? (React.createElement(WorkloadPodLogs, { namespace: this.props.match.params.namespace, pods: this.state.workload.pods })) : ('There are no logs to display because the workload has no pods.')),
                        React.createElement(TabPane, { eventKey: "in_metrics", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(IstioMetricsContainer, { namespace: this.props.match.params.namespace, object: this.props.match.params.workload, objectType: MetricsObjectTypes.WORKLOAD, direction: 'inbound' })),
                        React.createElement(TabPane, { eventKey: "out_metrics", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(IstioMetricsContainer, { namespace: this.props.match.params.namespace, object: this.props.match.params.workload, objectType: MetricsObjectTypes.WORKLOAD, direction: 'outbound' })),
                        isLabeled &&
                            this.state.workload.runtimes.map(function (runtime) {
                                return runtime.dashboardRefs.map(function (dashboard) {
                                    return (React.createElement(TabPane, { key: dashboard.template, eventKey: dashboard.template, mountOnEnter: true, unmountOnExit: true },
                                        React.createElement(CustomMetricsContainer, { namespace: _this.props.match.params.namespace, app: app, version: version, template: dashboard.template })));
                                });
                            }))))));
    };
    return WorkloadDetails;
}(React.Component));
var mapStateToProps = function (state) { return ({
    duration: durationSelector(state)
}); };
var WorkloadDetailsContainer = connect(mapStateToProps)(WorkloadDetails);
export default WorkloadDetailsContainer;
//# sourceMappingURL=WorkloadDetailsPage.js.map