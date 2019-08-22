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
import { AreaChart, Icon } from 'patternfly-react';
import { PfColors } from '../../components/Pf/PfColors';
import { SUMMARY_PANEL_CHART_WIDTH } from '../../types/Graph';
var ResponseTimeChart = /** @class */ (function (_super) {
    __extends(ResponseTimeChart, _super);
    function ResponseTimeChart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.thereIsTrafficData = function () {
            return _this.props.rtAvg && _this.props.rtAvg.length > 1 && _this.props.rtAvg[0].length > 1;
        };
        // The prom data is in seconds but we want to report response times in millis when the user hovers
        // Convert the data points to millis.  The 'datums' is a bit complicated, it is a 2-dimensional array
        // that has 'x' arrays that hold timestamps of the datapoints for the x-axis.  And datapoint arrays that
        // hold the data for the quantiles.  We need only convert the data poiints.  A datums array can look like:
        // [['x', 123, 456, 789],
        //  ['avg', 0.10, 0.20, 0.30]
        //  ...
        // ]
        _this.toMillis = function (datums) {
            var millis = datums.map(function (datum) {
                if (datum[0] === 'x') {
                    return datum; // timestamps
                }
                return datum.map(function (dp, i) {
                    return i === 0 ? dp : dp * 1000.0;
                });
            });
            return millis;
        };
        return _this;
    }
    ResponseTimeChart.prototype.render = function () {
        var axis = {
            x: {
                show: false,
                type: 'timeseries',
                tick: {
                    fit: true,
                    count: 15,
                    multiline: false,
                    format: '%H:%M:%S'
                }
            },
            y: { show: false }
        };
        var chartData = {
            x: 'x',
            columns: this.toMillis(this.props.rtAvg)
                .concat(this.toMillis(this.props.rtMed))
                .concat(this.toMillis(this.props.rt95))
                .concat(this.toMillis(this.props.rt99)),
            type: 'area-spline',
            hide: ['Average', 'Median', '99th']
        };
        return (React.createElement(React.Fragment, null, !this.props.hide && (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("strong", null,
                    this.props.label,
                    ":")),
            this.thereIsTrafficData() ? (React.createElement(AreaChart, { size: { height: 80, width: SUMMARY_PANEL_CHART_WIDTH }, color: { pattern: [PfColors.Black, PfColors.Green400, PfColors.Blue, PfColors.Orange400] }, legend: { show: true }, grid: { y: { show: false } }, axis: axis, data: chartData })) : (React.createElement("div", null,
                React.createElement(Icon, { type: "pf", name: "info" }),
                " Not enough traffic to generate chart."))))));
    };
    return ResponseTimeChart;
}(React.Component));
export default ResponseTimeChart;
//# sourceMappingURL=ResponseTimeChart.js.map