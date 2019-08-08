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
var MetricsReporter = /** @class */ (function (_super) {
    __extends(MetricsReporter, _super);
    function MetricsReporter(props) {
        var _this = _super.call(this, props) || this;
        _this.onReporterChanged = function (reporter) {
            HistoryManager.setParam(URLParam.REPORTER, reporter);
            _this.reporter = reporter;
            _this.props.onChanged(_this.reporter);
        };
        _this.reporter = MetricsReporter.initialReporter(props.direction);
        return _this;
    }
    MetricsReporter.prototype.render = function () {
        return (React.createElement(ToolbarDropdown, { id: 'metrics_filter_reporter', disabled: false, handleSelect: this.onReporterChanged, nameDropdown: 'Reported from', value: this.reporter, initialLabel: MetricsReporter.ReporterOptions[this.reporter], options: MetricsReporter.ReporterOptions }));
    };
    MetricsReporter.ReporterOptions = {
        destination: 'Destination',
        source: 'Source'
    };
    MetricsReporter.initialReporter = function (direction) {
        var reporterParam = HistoryManager.getParam(URLParam.REPORTER);
        if (reporterParam !== undefined) {
            return reporterParam;
        }
        return direction === 'inbound' ? 'destination' : 'source';
    };
    return MetricsReporter;
}(React.Component));
export default MetricsReporter;
//# sourceMappingURL=MetricsReporter.js.map