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
var MetricsRawAggregation = /** @class */ (function (_super) {
    __extends(MetricsRawAggregation, _super);
    function MetricsRawAggregation(props) {
        var _this = _super.call(this, props) || this;
        _this.onAggregatorChanged = function (aggregator) {
            HistoryManager.setParam(URLParam.AGGREGATOR, aggregator);
            _this.aggregator = aggregator;
            _this.props.onChanged(_this.aggregator);
        };
        _this.aggregator = MetricsRawAggregation.initialAggregator();
        return _this;
    }
    MetricsRawAggregation.prototype.render = function () {
        return (React.createElement(ToolbarDropdown, { id: 'metrics_filter_aggregator', disabled: false, handleSelect: this.onAggregatorChanged, nameDropdown: 'Pods aggregation', value: this.aggregator, initialLabel: MetricsRawAggregation.Aggregators[this.aggregator], options: MetricsRawAggregation.Aggregators }));
    };
    MetricsRawAggregation.Aggregators = {
        sum: 'Sum',
        avg: 'Average',
        min: 'Min',
        max: 'Max',
        stddev: 'Standard deviation',
        stdvar: 'Standard variance'
    };
    MetricsRawAggregation.initialAggregator = function () {
        var opParam = HistoryManager.getParam(URLParam.AGGREGATOR);
        if (opParam !== undefined) {
            return opParam;
        }
        return 'sum';
    };
    return MetricsRawAggregation;
}(React.Component));
export default MetricsRawAggregation;
//# sourceMappingURL=MetricsRawAggregation.js.map