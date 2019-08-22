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
import { URLParam, HistoryManager } from '../../app/History';
import { ToolbarDropdown } from '../ToolbarDropdown/ToolbarDropdown';
import { serverConfig } from '../../config/ServerConfig';
var MetricsDuration = /** @class */ (function (_super) {
    __extends(MetricsDuration, _super);
    function MetricsDuration(props) {
        var _this = _super.call(this, props) || this;
        _this.onDurationChanged = function (key) {
            sessionStorage.setItem(URLParam.DURATION, key);
            HistoryManager.setParam(URLParam.DURATION, key);
            _this.duration = Number(key);
            _this.props.onChanged(_this.duration);
        };
        _this.duration = MetricsDuration.initialDuration();
        return _this;
    }
    MetricsDuration.prototype.render = function () {
        return (React.createElement(ToolbarDropdown, { id: 'metrics_filter_interval_duration', disabled: this.props.disabled, handleSelect: this.onDurationChanged, initialValue: this.duration, initialLabel: serverConfig.durations[this.duration], options: serverConfig.durations, tooltip: this.props.tooltip || 'Time range for metrics data' }));
    };
    // Default to 10 minutes. Showing timeseries to only 1 minute doesn't make so much sense.
    MetricsDuration.DefaultDuration = 600;
    MetricsDuration.initialDuration = function () {
        var urlDuration = HistoryManager.getDuration();
        if (urlDuration !== undefined) {
            sessionStorage.setItem(URLParam.DURATION, String(urlDuration));
            return urlDuration;
        }
        var storageDuration = sessionStorage.getItem(URLParam.DURATION);
        return storageDuration !== null ? Number(storageDuration) : MetricsDuration.DefaultDuration;
    };
    return MetricsDuration;
}(React.Component));
export default MetricsDuration;
//# sourceMappingURL=MetricsDuration.js.map