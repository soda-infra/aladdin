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
import { style } from 'typestyle';
import { SUMMARY_PANEL_CHART_WIDTH } from '../../types/Graph';
var sparklineAxisProps = function () {
    return {
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
};
var blockStyle = style({
    marginTop: '0.5em',
    marginBottom: '0.5em'
});
var renderNoTrafficLegend = function () {
    return (React.createElement("div", null,
        React.createElement(Icon, { type: "pf", name: "info" }),
        " Not enough traffic to generate chart."));
};
var thereIsTrafficData = function (seriesData) {
    return (seriesData &&
        seriesData.length > 1 &&
        seriesData[0].length > 1 &&
        seriesData[1].slice(1).reduce(function (accum, val) { return accum + Number(val); }, 0) > 0);
};
var renderSparkline = function (series, colors, yTickFormat) {
    var chartData = {
        x: 'x',
        columns: series,
        type: 'area-spline'
    };
    var axisProps = sparklineAxisProps();
    if (yTickFormat) {
        axisProps.y.tick = {
            format: yTickFormat
        };
    }
    return (React.createElement(AreaChart, { size: { height: 45, width: SUMMARY_PANEL_CHART_WIDTH }, color: { pattern: colors }, legend: { show: false }, grid: { y: { show: false } }, axis: axisProps, data: chartData }));
};
var RpsChart = /** @class */ (function (_super) {
    __extends(RpsChart, _super);
    function RpsChart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderMinMaxStats = function () {
            var dataRps = [], dataErrors = [];
            if (_this.props.dataRps.length > 0) {
                dataRps = _this.props.dataRps[1];
                dataErrors = _this.props.dataErrors[1];
            }
            // NOTE: dataRps and dataErrors are arrays of data value points EXCEPT for the first array item.
            // At index 0 of the array is the data label (dataRps[0] == "RPS" and dataErrors[0] == "Error").
            // This is why we skip the first element in each array.
            var minRps = dataRps.length > 1 ? +dataRps[1] : 0;
            var maxRps = minRps;
            var errSample = dataErrors.length > 1 ? +dataErrors[1] : 0;
            var minPctErr = (100 * errSample) / minRps;
            var maxPctErr = minPctErr;
            for (var i = 2; i < dataRps.length; ++i) {
                var sample = +dataRps[i];
                minRps = sample < minRps ? sample : minRps;
                maxRps = sample > maxRps ? sample : maxRps;
                if (sample !== 0) {
                    errSample = dataErrors.length > i ? +dataErrors[i] : 0;
                    var errPct = (100 * errSample) / sample;
                    if (isNaN(minPctErr) || errPct < minPctErr) {
                        minPctErr = errPct;
                    }
                    if (isNaN(maxPctErr) || errPct > maxPctErr) {
                        maxPctErr = errPct;
                    }
                }
            }
            return (React.createElement("div", null,
                "RPS: ",
                minRps.toFixed(2),
                " / ",
                maxRps.toFixed(2),
                " , %Error ",
                minPctErr.toFixed(2),
                " / ",
                maxPctErr.toFixed(2)));
        };
        _this.renderSparkline = function () {
            if (!thereIsTrafficData(_this.props.dataRps)) {
                return null;
            }
            return renderSparkline(_this.props.dataRps.concat(_this.props.dataErrors), [PfColors.Blue, PfColors.Red]);
        };
        return _this;
    }
    RpsChart.prototype.render = function () {
        return (React.createElement(React.Fragment, null, !this.props.hide && (React.createElement("div", { className: blockStyle },
            React.createElement("div", null,
                React.createElement("strong", null,
                    this.props.label,
                    " min / max:")),
            thereIsTrafficData(this.props.dataRps) ? this.renderMinMaxStats() : renderNoTrafficLegend(),
            this.renderSparkline()))));
    };
    return RpsChart;
}(React.Component));
export { RpsChart };
var TcpChart = /** @class */ (function (_super) {
    __extends(TcpChart, _super);
    function TcpChart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderMinMaxStats = function () {
            var dataSent = [], dataReceived = [];
            if (_this.props.sentRates.length > 0) {
                // NOTE: props.sentRates and props.receivedRates are arrays of data value points EXCEPT for the first array item.
                // At index 0 of the array is the data label (sentRates[0] == "TCP Sent" and receivedRates[0] == "TCP Received").
                // This is why we skip the first element in each array.
                dataSent = _this.props.sentRates[1].slice(1);
                dataReceived = _this.props.receivedRates[1].slice(1);
            }
            var minSent = 0, maxSent = 0, minReceived = 0, maxReceived = 0;
            if (dataSent.length > 0) {
                minSent = Math.min.apply(Math, dataSent);
                maxSent = Math.max.apply(Math, dataSent);
            }
            if (dataReceived.length > 0) {
                minReceived = Math.min.apply(Math, dataReceived);
                maxReceived = Math.max.apply(Math, dataReceived);
            }
            return (React.createElement("div", null,
                React.createElement(Icon, { name: "square", style: { color: PfColors.Blue } }),
                " Sent: ",
                _this.formatMinMaxStats(minSent, maxSent),
                React.createElement("br", null),
                React.createElement(Icon, { name: "square", style: { color: PfColors.Green } }),
                " Received:",
                ' ',
                _this.formatMinMaxStats(minReceived, maxReceived)));
        };
        _this.thereIsTrafficData = function () {
            return thereIsTrafficData(_this.props.receivedRates) || thereIsTrafficData(_this.props.sentRates);
        };
        _this.renderSparkline = function () {
            if (!_this.thereIsTrafficData()) {
                return null;
            }
            return renderSparkline(_this.props.sentRates.concat(_this.props.receivedRates), [PfColors.Blue, PfColors.Green], function (val) {
                return _this.abbreviateBytes(val).format(true) + '/s';
            });
        };
        _this.abbreviateBytes = function (bytes) {
            var abbreviation = {
                originalValue: bytes,
                multiplier: 1,
                unit: 'B',
                abbreviatedValue: function () {
                    return abbreviation.originalValue / abbreviation.multiplier;
                },
                format: function (includeUnit) {
                    var rVal = abbreviation.abbreviatedValue().toFixed(2);
                    if (includeUnit) {
                        rVal += ' ' + abbreviation.unit;
                    }
                    return rVal;
                }
            };
            if (bytes >= 1e9) {
                abbreviation.multiplier = 1e9;
                abbreviation.unit = 'G';
            }
            else if (bytes >= 1e6) {
                abbreviation.multiplier = 1e6;
                abbreviation.unit = 'M';
            }
            else if (bytes >= 1e3) {
                abbreviation.multiplier = 1e3;
                abbreviation.unit = 'K';
            }
            return abbreviation;
        };
        _this.formatMinMaxStats = function (min, max) {
            var minAbbr = _this.abbreviateBytes(min);
            var maxAbbr = _this.abbreviateBytes(max);
            if (minAbbr.multiplier > maxAbbr.multiplier) {
                maxAbbr.unit = minAbbr.unit;
                maxAbbr.multiplier = minAbbr.multiplier;
            }
            else {
                minAbbr.unit = maxAbbr.unit;
                minAbbr.multiplier = maxAbbr.multiplier;
            }
            return minAbbr.format(false) + ' / ' + maxAbbr.format(true) + '/s';
        };
        return _this;
    }
    TcpChart.prototype.render = function () {
        return (React.createElement(React.Fragment, null, !this.props.hide && (React.createElement("div", { className: blockStyle },
            React.createElement("div", null,
                React.createElement("strong", null,
                    this.props.label,
                    " - min / max:")),
            this.thereIsTrafficData() ? this.renderMinMaxStats() : renderNoTrafficLegend(),
            this.renderSparkline()))));
    };
    return TcpChart;
}(React.Component));
export { TcpChart };
//# sourceMappingURL=RpsChart.js.map