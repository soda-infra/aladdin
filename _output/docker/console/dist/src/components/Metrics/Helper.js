import assign from 'lodash/fp/assign';
import { MetricsSettingsDropdown } from '../MetricsOptions/MetricsSettings';
import MetricsDuration from '../MetricsOptions/MetricsDuration';
import { computePrometheusRateParams } from '../../services/Prometheus';
export var extractLabelValuesOnSeries = function (series, aggregations, extracted) {
    series.forEach(function (ts) {
        Object.keys(ts.labelSet).forEach(function (k) {
            var agg = aggregations.find(function (a) { return a.label === k; });
            if (agg) {
                var value = ts.labelSet[k];
                var values = extracted.get(agg.displayName);
                if (!values) {
                    values = {};
                    extracted.set(agg.displayName, values);
                }
                values[value] = true;
            }
        });
    });
};
export var extractLabelValues = function (dashboard, previousValues) {
    // Find all labels on all series
    var labelsWithValues = new Map();
    dashboard.aggregations.forEach(function (agg) { return labelsWithValues.set(agg.displayName, {}); });
    dashboard.charts.forEach(function (chart) {
        if (chart.metric) {
            extractLabelValuesOnSeries(chart.metric, dashboard.aggregations, labelsWithValues);
        }
        if (chart.histogram) {
            Object.keys(chart.histogram).forEach(function (stat) {
                extractLabelValuesOnSeries(chart.histogram[stat], dashboard.aggregations, labelsWithValues);
            });
        }
    });
    // Keep existing show flag
    labelsWithValues.forEach(function (values, key) {
        var previous = previousValues.get(key);
        if (previous) {
            Object.keys(values).forEach(function (k) {
                if (previous.hasOwnProperty(k)) {
                    values[k] = previous[k];
                }
                else if (Object.getOwnPropertyNames(previous).length > 0) {
                    values[k] = false;
                }
            });
        }
    });
    return labelsWithValues;
};
export var mergeLabelFilter = function (labelValues, label, value, checked) {
    var newLabels = new Map();
    labelValues.forEach(function (val, key) {
        var newVal = assign(val)({});
        if (key === label) {
            newVal[value] = checked;
        }
        newLabels.set(key, newVal);
    });
    return newLabels;
};
export var convertAsPromLabels = function (aggregations, labels) {
    var promLabels = new Map();
    labels.forEach(function (val, k) {
        var chartLabel = aggregations.find(function (l) { return l.displayName === k; });
        if (chartLabel) {
            promLabels.set(chartLabel.label, val);
        }
    });
    return promLabels;
};
export var settingsToOptions = function (settings, opts, aggregations) {
    opts.avg = settings.showAverage;
    opts.quantiles = settings.showQuantiles;
    opts.byLabels = [];
    if (aggregations) {
        settings.activeLabels.forEach(function (lbl) {
            var agg = aggregations.find(function (a) { return a.displayName === lbl; });
            if (agg) {
                opts.byLabels.push(agg.label);
            }
        });
    }
};
export var initMetricsSettings = function (opts, aggregations) {
    settingsToOptions(MetricsSettingsDropdown.initialMetricsSettings(), opts, aggregations);
};
export var durationToOptions = function (duration, opts) {
    opts.duration = duration;
    var intervalOpts = computePrometheusRateParams(duration);
    opts.step = intervalOpts.step;
    opts.rateInterval = intervalOpts.rateInterval;
};
export var initDuration = function (opts) {
    durationToOptions(MetricsDuration.initialDuration(), opts);
    return opts;
};
//# sourceMappingURL=Helper.js.map