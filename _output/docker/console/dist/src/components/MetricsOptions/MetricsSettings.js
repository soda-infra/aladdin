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
import { Button, Icon, OverlayTrigger, Popover } from 'patternfly-react';
import { style } from 'typestyle';
import isEqual from 'lodash/fp/isEqual';
import history, { URLParam } from '../../app/History';
var allQuantiles = ['0.5', '0.95', '0.99', '0.999'];
var checkboxStyle = style({ marginLeft: 5 });
var secondLevelStyle = style({ marginLeft: 14 });
var spacerStyle = style({ height: '1em' });
var MetricsSettingsDropdown = /** @class */ (function (_super) {
    __extends(MetricsSettingsDropdown, _super);
    function MetricsSettingsDropdown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shouldReportOptions = false;
        _this.settings = MetricsSettingsDropdown.initialMetricsSettings();
        _this.onGroupingChanged = function (label, checked) {
            var newLabels = checked
                ? [label].concat(_this.settings.activeLabels)
                : _this.settings.activeLabels.filter(function (g) { return label !== g; });
            var urlParams = new URLSearchParams(history.location.search);
            urlParams.delete(URLParam.BY_LABELS);
            newLabels.forEach(function (lbl) { return urlParams.append(URLParam.BY_LABELS, lbl); });
            history.replace(history.location.pathname + '?' + urlParams.toString());
        };
        _this.onHistogramAverageChanged = function (checked) {
            var urlParams = new URLSearchParams(history.location.search);
            urlParams.set(URLParam.SHOW_AVERAGE, String(checked));
            history.replace(history.location.pathname + '?' + urlParams.toString());
        };
        _this.onHistogramOptionsChanged = function (quantile, checked) {
            var newQuantiles = checked
                ? [quantile].concat(_this.settings.showQuantiles)
                : _this.settings.showQuantiles.filter(function (q) { return quantile !== q; });
            var urlParams = new URLSearchParams(history.location.search);
            urlParams.set(URLParam.QUANTILES, newQuantiles.join(' '));
            history.replace(history.location.pathname + '?' + urlParams.toString());
        };
        return _this;
    }
    MetricsSettingsDropdown.prototype.componentDidUpdate = function () {
        if (this.shouldReportOptions) {
            this.shouldReportOptions = false;
            this.props.onChanged(this.settings);
        }
    };
    MetricsSettingsDropdown.prototype.render = function () {
        var hasHistograms = this.props.hasHistograms;
        var hasLabels = this.props.labelValues.size > 0;
        if (!hasHistograms && !hasLabels) {
            return null;
        }
        this.processUrlParams();
        var metricsSettingsPopover = (React.createElement(Popover, { id: "layers-popover" },
            hasLabels && this.renderLabelOptions(),
            hasHistograms && this.renderHistogramOptions()));
        return (React.createElement(OverlayTrigger, { overlay: metricsSettingsPopover, placement: "bottom", trigger: ['click'], rootClose: true },
            React.createElement(Button, null,
                "Metrics Settings ",
                React.createElement(Icon, { name: "angle-down" }))));
    };
    MetricsSettingsDropdown.prototype.renderLabelOptions = function () {
        var _this = this;
        var displayGroupingLabels = [];
        this.props.labelValues.forEach(function (values, name) {
            var checked = _this.settings.activeLabels.includes(name);
            var labelsHTML = values
                ? Object.keys(values).map(function (val) { return (React.createElement("div", { key: 'groupings_' + name + '_' + val, className: secondLevelStyle },
                    React.createElement("label", null,
                        React.createElement("input", { type: "checkbox", checked: values[val], onChange: function (event) { return _this.props.onLabelsFiltersChanged(name, val, event.target.checked); } }),
                        React.createElement("span", { className: checkboxStyle }, val)))); })
                : null;
            displayGroupingLabels.push(React.createElement("div", { key: 'groupings_' + name },
                React.createElement("label", null,
                    React.createElement("input", { type: "checkbox", checked: checked, onChange: function (event) { return _this.onGroupingChanged(name, event.target.checked); } }),
                    React.createElement("span", { className: checkboxStyle }, name)),
                checked && labelsHTML));
        });
        return (React.createElement(React.Fragment, null,
            React.createElement("label", null, "Show metrics by:"),
            displayGroupingLabels,
            React.createElement("div", { className: spacerStyle })));
    };
    MetricsSettingsDropdown.prototype.renderHistogramOptions = function () {
        var _this = this;
        // Prettier removes the parenthesis introducing JSX
        // prettier-ignore
        var displayHistogramOptions = [(React.createElement("div", { key: 'histo_avg' },
                React.createElement("label", null,
                    React.createElement("input", { type: "checkbox", checked: this.settings.showAverage, onChange: function (event) { return _this.onHistogramAverageChanged(event.target.checked); } }),
                    React.createElement("span", { className: checkboxStyle }, "Average"))))].concat(allQuantiles.map(function (o, idx) {
            var checked = _this.settings.showQuantiles.includes(o);
            return (React.createElement("div", { key: 'histo_' + idx },
                React.createElement("label", null,
                    React.createElement("input", { type: "checkbox", checked: checked, onChange: function (event) { return _this.onHistogramOptionsChanged(o, event.target.checked); } }),
                    React.createElement("span", { className: checkboxStyle },
                        "Quantile ",
                        o))));
        }));
        return (React.createElement(React.Fragment, null,
            React.createElement("label", null, "Histograms:"),
            displayHistogramOptions,
            React.createElement("div", { className: spacerStyle })));
    };
    MetricsSettingsDropdown.prototype.processUrlParams = function () {
        var metricsSettings = MetricsSettingsDropdown.initialMetricsSettings();
        this.shouldReportOptions = !isEqual(metricsSettings)(this.settings);
        this.settings = metricsSettings;
    };
    MetricsSettingsDropdown.initialMetricsSettings = function () {
        var urlParams = new URLSearchParams(history.location.search);
        var settings = {
            showAverage: true,
            showQuantiles: ['0.5', '0.95', '0.99'],
            activeLabels: []
        };
        var avg = urlParams.get(URLParam.SHOW_AVERAGE);
        if (avg !== null) {
            settings.showAverage = avg === 'true';
        }
        var quantiles = urlParams.get(URLParam.QUANTILES);
        if (quantiles !== null) {
            if (quantiles.trim().length !== 0) {
                settings.showQuantiles = quantiles.split(' ').map(function (val) { return val.trim(); });
            }
            else {
                settings.showQuantiles = [];
            }
        }
        var byLabels = urlParams.getAll(URLParam.BY_LABELS);
        if (byLabels.length !== 0) {
            byLabels.forEach(function (val, idx) {
                byLabels[idx] = val.split('=', 1)[0];
            });
            settings.activeLabels = byLabels;
        }
        return settings;
    };
    return MetricsSettingsDropdown;
}(React.Component));
export { MetricsSettingsDropdown };
//# sourceMappingURL=MetricsSettings.js.map