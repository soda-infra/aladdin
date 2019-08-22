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
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Icon, Toolbar, ToolbarRightContent, FormGroup } from 'patternfly-react';
import { PF3Dashboard } from 'k-charted-react';
import RefreshContainer from '../../components/Refresh/Refresh';
import * as API from '../../services/Api';
import * as MessageCenter from '../../utils/MessageCenter';
import * as MetricsHelper from './Helper';
import { MetricsSettingsDropdown } from '../MetricsOptions/MetricsSettings';
import MetricsReporter from '../MetricsOptions/MetricsReporter';
import MetricsDuration from '../MetricsOptions/MetricsDuration';
import history, { URLParam } from '../../app/History';
import { MetricsObjectTypes } from '../../types/Metrics';
var IstioMetrics = /** @class */ (function (_super) {
    __extends(IstioMetrics, _super);
    function IstioMetrics(props) {
        var _this = _super.call(this, props) || this;
        _this.fetchMetrics = function () {
            var promise;
            switch (_this.props.objectType) {
                case MetricsObjectTypes.WORKLOAD:
                    promise = API.getWorkloadDashboard(_this.props.namespace, _this.props.object, _this.options);
                    break;
                case MetricsObjectTypes.APP:
                    promise = API.getAppDashboard(_this.props.namespace, _this.props.object, _this.options);
                    break;
                case MetricsObjectTypes.SERVICE:
                default:
                    promise = API.getServiceDashboard(_this.props.namespace, _this.props.object, _this.options);
                    break;
            }
            return promise
                .then(function (response) {
                var labelValues = MetricsHelper.extractLabelValues(response.data, _this.state.labelValues);
                _this.setState({
                    dashboard: response.data,
                    labelValues: labelValues
                });
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Cannot fetch metrics', error));
                console.error(error);
                throw error;
            });
        };
        _this.onMetricsSettingsChanged = function (settings) {
            MetricsHelper.settingsToOptions(settings, _this.options, _this.state.dashboard && _this.state.dashboard.aggregations);
            _this.fetchMetrics();
        };
        _this.onLabelsFiltersChanged = function (label, value, checked) {
            var newValues = MetricsHelper.mergeLabelFilter(_this.state.labelValues, label, value, checked);
            _this.setState({ labelValues: newValues });
        };
        _this.onDurationChanged = function (duration) {
            MetricsHelper.durationToOptions(duration, _this.options);
            _this.fetchMetrics();
        };
        _this.onReporterChanged = function (reporter) {
            _this.options.reporter = reporter;
            _this.fetchMetrics();
        };
        _this.expandHandler = function (expandedChart) {
            var urlParams = new URLSearchParams(history.location.search);
            urlParams.delete('expand');
            if (expandedChart) {
                urlParams.set('expand', expandedChart);
            }
            history.push(history.location.pathname + '?' + urlParams.toString());
        };
        _this.options = _this.initOptions();
        _this.grafanaLink = _this.getGrafanaLink();
        _this.state = {
            labelValues: new Map()
        };
        return _this;
    }
    IstioMetrics.prototype.initOptions = function () {
        var options = {
            reporter: MetricsReporter.initialReporter(this.props.direction),
            direction: this.props.direction
        };
        MetricsHelper.initMetricsSettings(options);
        MetricsHelper.initDuration(options);
        return options;
    };
    IstioMetrics.prototype.componentDidMount = function () {
        var _this = this;
        this.fetchMetrics().then(function () {
            var urlParams = new URLSearchParams(history.location.search);
            var byLabels = urlParams.getAll(URLParam.BY_LABELS);
            if (byLabels.length === 0 || !_this.state.dashboard) {
                return;
            }
            // On first load, if there are aggregations enabled,
            // re-initialize the options.
            MetricsHelper.initMetricsSettings(_this.options, _this.state.dashboard.aggregations);
            // Get the labels passed by URL
            var labelsMap = new Map();
            byLabels.forEach(function (val) {
                var splitted = val.split('=', 2);
                labelsMap.set(splitted[0], splitted[1] ? splitted[1].split(',') : []);
            });
            // Then, set label values using the URL, if aggregation was applied.
            var newLabelValues = new Map();
            _this.state.dashboard.aggregations.forEach(function (aggregation) {
                if (!_this.state.labelValues.has(aggregation.displayName)) {
                    return;
                }
                var lblVal = _this.state.labelValues.get(aggregation.displayName);
                newLabelValues.set(aggregation.displayName, lblVal);
                if (!_this.options.byLabels.includes(aggregation.label)) {
                    return;
                }
                var urlLabels = labelsMap.get(aggregation.displayName);
                var newVals = {};
                urlLabels.forEach(function (val) {
                    newVals[val] = true;
                });
                newLabelValues.set(aggregation.displayName, newVals);
            });
            // Fetch again to display the right groupings for the initial load
            _this.setState({
                labelValues: newLabelValues
            }, _this.fetchMetrics);
        });
    };
    IstioMetrics.prototype.getGrafanaLink = function () {
        if (this.props.grafanaInfo) {
            switch (this.props.objectType) {
                case MetricsObjectTypes.SERVICE:
                    return "" + this.props.grafanaInfo.url + this.props.grafanaInfo.serviceDashboardPath + "?var-service=" + this.props.object + "." + this.props.namespace + ".svc.cluster.local";
                case MetricsObjectTypes.WORKLOAD:
                    return "" + this.props.grafanaInfo.url + this.props.grafanaInfo.workloadDashboardPath + "?var-namespace=" + this.props.namespace + "&var-workload=" + this.props.object;
                default:
                    return undefined;
            }
        }
        return undefined;
    };
    IstioMetrics.prototype.render = function () {
        if (!this.props.isPageVisible) {
            return null;
        }
        if (!this.state.dashboard) {
            return this.renderOptionsBar();
        }
        var urlParams = new URLSearchParams(history.location.search);
        var expandedChart = urlParams.get('expand') || undefined;
        var convertedLabels = MetricsHelper.convertAsPromLabels(this.state.dashboard.aggregations, this.state.labelValues);
        return (React.createElement("div", null,
            this.renderOptionsBar(),
            React.createElement(PF3Dashboard, { dashboard: this.state.dashboard, labelValues: convertedLabels, expandedChart: expandedChart, expandHandler: this.expandHandler })));
    };
    IstioMetrics.prototype.renderOptionsBar = function () {
        return (React.createElement(Toolbar, null,
            React.createElement(FormGroup, null,
                React.createElement(MetricsSettingsDropdown, { onChanged: this.onMetricsSettingsChanged, onLabelsFiltersChanged: this.onLabelsFiltersChanged, labelValues: this.state.labelValues, hasHistograms: true })),
            React.createElement(FormGroup, null,
                React.createElement(MetricsReporter, { onChanged: this.onReporterChanged, direction: this.props.direction })),
            this.grafanaLink && (React.createElement(FormGroup, { style: { borderRight: 'none' } },
                React.createElement("a", { id: 'grafana_link', href: this.grafanaLink, target: "_blank", rel: "noopener noreferrer" },
                    "View in Grafana ",
                    React.createElement(Icon, { type: 'fa', name: 'external-link' })))),
            React.createElement(ToolbarRightContent, null,
                React.createElement(MetricsDuration, { onChanged: this.onDurationChanged }),
                React.createElement(RefreshContainer, { id: "metrics-refresh", handleRefresh: this.fetchMetrics, hideLabel: true }))));
    };
    IstioMetrics.defaultProps = {
        isPageVisible: true
    };
    return IstioMetrics;
}(React.Component));
var mapStateToProps = function (state) { return ({
    isPageVisible: state.globalState.isPageVisible,
    grafanaInfo: state.grafanaInfo || undefined
}); };
var IstioMetricsContainer = withRouter(connect(mapStateToProps)(IstioMetrics));
export default IstioMetricsContainer;
//# sourceMappingURL=IstioMetrics.js.map