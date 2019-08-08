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
import { TabContainer, Nav, NavItem, TabContent, TabPane } from 'patternfly-react';
import AppInfo from './AppInfo';
import * as MessageCenter from '../../utils/MessageCenter';
import IstioMetricsContainer from '../../components/Metrics/IstioMetrics';
import { MetricsObjectTypes } from '../../types/Metrics';
import CustomMetricsContainer from '../../components/Metrics/CustomMetrics';
import BreadcrumbView from '../../components/BreadcrumbView/BreadcrumbView';
import { GraphType, NodeType } from '../../types/Graph';
import { fetchTrafficDetails } from '../../helpers/TrafficDetailsHelper';
import TrafficDetails from '../../components/Metrics/TrafficDetails';
import MetricsDuration from '../../components/MetricsOptions/MetricsDuration';
import PfTitle from '../../components/Pf/PfTitle';
import { durationSelector } from '../../store/Selectors';
import { connect } from 'react-redux';
var emptyApp = {
    namespace: { name: '' },
    name: '',
    workloads: [],
    serviceNames: [],
    runtimes: []
};
var AppDetails = /** @class */ (function (_super) {
    __extends(AppDetails, _super);
    function AppDetails(props) {
        var _this = _super.call(this, props) || this;
        _this.doRefresh = function () {
            var currentTab = _this.activeTab('tab', 'info');
            if (_this.state.app === emptyApp || currentTab === 'info') {
                _this.setState({ trafficData: null });
                _this.fetchApp();
            }
            if (currentTab === 'traffic') {
                _this.fetchTrafficData();
            }
        };
        _this.fetchApp = function () {
            API.getApp(_this.props.match.params.namespace, _this.props.match.params.app)
                .then(function (details) {
                _this.setState({ app: details.data });
                var hasSidecar = details.data.workloads.some(function (w) { return w.istioSidecar; });
                return API.getAppHealth(_this.props.match.params.namespace, _this.props.match.params.app, _this.props.duration, hasSidecar);
            })
                .then(function (health) { return _this.setState({ health: health }); })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not fetch App Details', error));
            });
        };
        _this.fetchTrafficData = function () {
            var node = {
                app: _this.props.match.params.app,
                namespace: { name: _this.props.match.params.namespace },
                nodeType: NodeType.APP,
                // unneeded
                workload: '',
                service: '',
                version: ''
            };
            var restParams = {
                duration: MetricsDuration.initialDuration() + "s",
                graphType: GraphType.APP,
                injectServiceNodes: true,
                appenders: 'deadNode'
            };
            fetchTrafficDetails(node, restParams).then(function (trafficData) {
                if (trafficData !== undefined) {
                    _this.setState({ trafficData: trafficData });
                }
            });
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
            app: emptyApp,
            trafficData: null
        };
        return _this;
    }
    AppDetails.prototype.componentDidMount = function () {
        this.doRefresh();
    };
    AppDetails.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (this.props.match.params.namespace !== prevProps.match.params.namespace ||
            this.props.match.params.app !== prevProps.match.params.app ||
            this.props.duration !== prevProps.duration) {
            this.setState({
                app: emptyApp,
                health: undefined
            }, function () { return _this.doRefresh(); });
        }
    };
    AppDetails.prototype.istioSidecar = function () {
        var istioSidecar = true; // assume true until proven otherwise
        this.state.app.workloads.forEach(function (wkd) {
            istioSidecar = istioSidecar && wkd.istioSidecar;
        });
        return istioSidecar;
    };
    AppDetails.prototype.render = function () {
        var _this = this;
        var istioSidecar = this.istioSidecar();
        return (React.createElement(React.Fragment, null,
            React.createElement(BreadcrumbView, { location: this.props.location }),
            React.createElement(PfTitle, { location: this.props.location, istio: istioSidecar }),
            React.createElement(TabContainer, { id: "basic-tabs", activeKey: this.activeTab('tab', 'info'), onSelect: this.tabSelectHandler('tab', this.tabChangeHandler) },
                React.createElement("div", null,
                    React.createElement(Nav, { bsClass: "nav nav-tabs nav-tabs-pf" },
                        React.createElement(NavItem, { eventKey: "info" }, "Overview"),
                        React.createElement(NavItem, { eventKey: "traffic" }, "Traffic"),
                        React.createElement(NavItem, { eventKey: "in_metrics" }, "Inbound Metrics"),
                        React.createElement(NavItem, { eventKey: "out_metrics" }, "Outbound Metrics"),
                        this.state.app.runtimes.map(function (runtime) {
                            return runtime.dashboardRefs.map(function (dashboard) {
                                return (React.createElement(NavItem, { key: dashboard.template, eventKey: dashboard.template }, dashboard.title));
                            });
                        })),
                    React.createElement(TabContent, null,
                        React.createElement(TabPane, { eventKey: "info", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(AppInfo, { app: this.state.app, namespace: this.props.match.params.namespace, onRefresh: this.doRefresh, activeTab: this.activeTab, onSelectTab: this.tabSelectHandler, health: this.state.health })),
                        React.createElement(TabPane, { eventKey: "traffic", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(TrafficDetails, { trafficData: this.state.trafficData, itemType: MetricsObjectTypes.APP, namespace: this.state.app.namespace.name, appName: this.state.app.name, onDurationChanged: this.handleTrafficDurationChange, onRefresh: this.doRefresh })),
                        React.createElement(TabPane, { eventKey: "in_metrics", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(IstioMetricsContainer, { namespace: this.props.match.params.namespace, object: this.props.match.params.app, objectType: MetricsObjectTypes.APP, direction: 'inbound' })),
                        React.createElement(TabPane, { eventKey: "out_metrics", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(IstioMetricsContainer, { namespace: this.props.match.params.namespace, object: this.props.match.params.app, objectType: MetricsObjectTypes.APP, direction: 'outbound' })),
                        this.state.app.runtimes.map(function (runtime) {
                            return runtime.dashboardRefs.map(function (dashboard) {
                                return (React.createElement(TabPane, { key: dashboard.template, eventKey: dashboard.template, mountOnEnter: true, unmountOnExit: true },
                                    React.createElement(CustomMetricsContainer, { namespace: _this.props.match.params.namespace, app: _this.props.match.params.app, template: dashboard.template })));
                            });
                        }))))));
    };
    return AppDetails;
}(React.Component));
var mapStateToProps = function (state) { return ({
    duration: durationSelector(state)
}); };
var AppDetailsContainer = connect(mapStateToProps)(AppDetails);
export default AppDetailsContainer;
//# sourceMappingURL=AppDetailsPage.js.map