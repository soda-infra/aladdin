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
import { Toolbar, ToolbarRightContent, FormGroup } from 'patternfly-react';
import { PF3Dashboard } from 'k-charted-react';
import { serverConfig } from '../../config/ServerConfig';
import history from '../../app/History';
import RefreshContainer from '../../components/Refresh/Refresh';
import * as API from '../../services/Api';
import * as MessageCenter from '../../utils/MessageCenter';
import * as MetricsHelper from './Helper';
import { MetricsSettingsDropdown } from '../MetricsOptions/MetricsSettings';
import MetricsRawAggregation from '../MetricsOptions/MetricsRawAggregation';
import MetricsDuration from '../MetricsOptions/MetricsDuration';
var CustomMetrics = /** @class */ (function (_super) {
    __extends(CustomMetrics, _super);
    function CustomMetrics(props) {
        var _this = _super.call(this, props) || this;
        _this.fetchMetrics = function () {
            API.getCustomDashboard(_this.props.namespace, _this.props.template, _this.options)
                .then(function (response) {
                var labelValues = MetricsHelper.extractLabelValues(response.data, _this.state.labelValues);
                _this.setState({
                    dashboard: response.data,
                    labelValues: labelValues
                });
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Cannot fetch custom dashboard', error));
                console.error(error);
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
        _this.onRawAggregationChanged = function (aggregator) {
            _this.options.rawDataAggregator = aggregator;
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
        _this.state = {
            labelValues: new Map()
        };
        return _this;
    }
    CustomMetrics.prototype.initOptions = function () {
        var filters = serverConfig.istioLabels.appLabelName + ":" + this.props.app;
        var options = this.props.version
            ? {
                labelsFilters: filters + "," + serverConfig.istioLabels.versionLabelName + ":" + this.props.version
            }
            : {
                labelsFilters: filters,
                additionalLabels: 'version:Version'
            };
        MetricsHelper.initMetricsSettings(options);
        MetricsHelper.initDuration(options);
        return options;
    };
    CustomMetrics.prototype.componentDidMount = function () {
        this.fetchMetrics();
    };
    CustomMetrics.prototype.render = function () {
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
    CustomMetrics.prototype.renderOptionsBar = function () {
        var hasHistograms = this.state.dashboard !== undefined &&
            this.state.dashboard.charts.some(function (chart) {
                if (chart.histogram) {
                    return Object.keys(chart.histogram).length > 0;
                }
                return false;
            });
        return (React.createElement(Toolbar, null,
            React.createElement(FormGroup, null,
                React.createElement(MetricsSettingsDropdown, { onChanged: this.onMetricsSettingsChanged, onLabelsFiltersChanged: this.onLabelsFiltersChanged, labelValues: this.state.labelValues, hasHistograms: hasHistograms })),
            React.createElement(FormGroup, null,
                React.createElement(MetricsRawAggregation, { onChanged: this.onRawAggregationChanged })),
            React.createElement(ToolbarRightContent, null,
                React.createElement(MetricsDuration, { onChanged: this.onDurationChanged }),
                React.createElement(RefreshContainer, { id: "metrics-refresh", handleRefresh: this.fetchMetrics, hideLabel: true }))));
    };
    CustomMetrics.defaultProps = {
        isPageVisible: true
    };
    return CustomMetrics;
}(React.Component));
var mapStateToProps = function (state) { return ({
    isPageVisible: state.globalState.isPageVisible
}); };
var CustomMetricsContainer = withRouter(connect(mapStateToProps)(CustomMetrics));
export default CustomMetricsContainer;
//# sourceMappingURL=CustomMetrics.js.map