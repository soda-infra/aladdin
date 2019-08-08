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
import { InOutRateChartGrpc, InOutRateChartHttp } from './InOutRateChart';
var InOutRateTableGrpc = /** @class */ (function (_super) {
    __extends(InOutRateTableGrpc, _super);
    function InOutRateTableGrpc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InOutRateTableGrpc.prototype.render = function () {
        // for the table and graph
        var percentErrIn = this.props.inRate === 0 ? 0 : (this.props.inRateErr / this.props.inRate) * 100;
        var percentErrOut = this.props.outRate === 0 ? 0 : (this.props.outRateErr / this.props.outRate) * 100;
        var percentOkIn = 100 - percentErrIn;
        var percentOkOut = 100 - percentErrOut;
        return (React.createElement("div", null,
            React.createElement("strong", null, this.props.title),
            React.createElement("table", { className: "table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null),
                        React.createElement("th", null, "Total"),
                        React.createElement("th", null, "%Success"),
                        React.createElement("th", null, "%Error"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "In"),
                        React.createElement("td", null, this.props.inRate.toFixed(2)),
                        React.createElement("td", null, percentOkIn.toFixed(2)),
                        React.createElement("td", null, percentErrIn.toFixed(2))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "Out"),
                        React.createElement("td", null, this.props.outRate.toFixed(2)),
                        React.createElement("td", null, percentOkOut.toFixed(2)),
                        React.createElement("td", null, percentErrOut.toFixed(2))))),
            React.createElement("table", { className: "table" },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(InOutRateChartGrpc, { percentOkIn: percentOkIn, percentErrIn: percentErrIn, percentOkOut: percentOkOut, percentErrOut: percentErrOut })))))));
    };
    return InOutRateTableGrpc;
}(React.Component));
export { InOutRateTableGrpc };
var InOutRateTableHttp = /** @class */ (function (_super) {
    __extends(InOutRateTableHttp, _super);
    function InOutRateTableHttp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InOutRateTableHttp.prototype.render = function () {
        // for the table
        var inErrRate = this.props.inRate4xx + this.props.inRate5xx;
        var outErrRate = this.props.outRate4xx + this.props.outRate5xx;
        var percentInErr = this.props.inRate === 0 ? 0 : (inErrRate / this.props.inRate) * 100;
        var percentOutErr = this.props.outRate === 0 ? 0 : (outErrRate / this.props.outRate) * 100;
        var percentInSuccess = 100 - percentInErr;
        var percentOutSuccess = 100 - percentOutErr;
        // for the graphs
        var rate2xxIn = this.props.inRate === 0
            ? 0
            : this.props.inRate - this.props.inRate3xx - this.props.inRate4xx - this.props.inRate5xx;
        var rate2xxOut = this.props.outRate === 0
            ? 0
            : this.props.outRate - this.props.outRate3xx - this.props.outRate4xx - this.props.outRate5xx;
        var percent2xxIn = this.props.inRate === 0 ? 0 : (rate2xxIn / this.props.inRate) * 100;
        var percent3xxIn = this.props.inRate === 0 ? 0 : (this.props.inRate3xx / this.props.inRate) * 100;
        var percent4xxIn = this.props.inRate === 0 ? 0 : (this.props.inRate4xx / this.props.inRate) * 100;
        var percent5xxIn = this.props.inRate === 0 ? 0 : (this.props.inRate5xx / this.props.inRate) * 100;
        var percent2xxOut = this.props.outRate === 0 ? 0 : (rate2xxOut / this.props.outRate) * 100;
        var percent3xxOut = this.props.outRate === 0 ? 0 : (this.props.outRate3xx / this.props.outRate) * 100;
        var percent4xxOut = this.props.outRate === 0 ? 0 : (this.props.outRate4xx / this.props.outRate) * 100;
        var percent5xxOut = this.props.outRate === 0 ? 0 : (this.props.outRate5xx / this.props.outRate) * 100;
        return (React.createElement("div", null,
            React.createElement("strong", null, this.props.title),
            React.createElement("table", { className: "table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null),
                        React.createElement("th", null, "Total"),
                        React.createElement("th", null, "%Success"),
                        React.createElement("th", null, "%Error"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "In"),
                        React.createElement("td", null, this.props.inRate.toFixed(2)),
                        React.createElement("td", null, percentInSuccess.toFixed(2)),
                        React.createElement("td", null, percentInErr.toFixed(2))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "Out"),
                        React.createElement("td", null, this.props.outRate.toFixed(2)),
                        React.createElement("td", null, percentOutSuccess.toFixed(2)),
                        React.createElement("td", null, percentOutErr.toFixed(2))))),
            React.createElement("table", { className: "table" },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(InOutRateChartHttp, { percent2xxIn: percent2xxIn, percent3xxIn: percent3xxIn, percent4xxIn: percent4xxIn, percent5xxIn: percent5xxIn, percent2xxOut: percent2xxOut, percent3xxOut: percent3xxOut, percent4xxOut: percent4xxOut, percent5xxOut: percent5xxOut })))))));
    };
    return InOutRateTableHttp;
}(React.Component));
export { InOutRateTableHttp };
//# sourceMappingURL=InOutRateTable.js.map