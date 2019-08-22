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
import { RateChartGrpc, RateChartHttp } from './RateChart';
var RateTableGrpc = /** @class */ (function (_super) {
    __extends(RateTableGrpc, _super);
    function RateTableGrpc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RateTableGrpc.prototype.render = function () {
        // for the table and graph
        var percentErr = this.props.rate === 0 ? 0 : (this.props.rateErr / this.props.rate) * 100;
        var percentOK = 100 - percentErr;
        return (React.createElement("div", null,
            React.createElement("strong", null, this.props.title),
            React.createElement("table", { className: "table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Total"),
                        React.createElement("th", null, "%Success"),
                        React.createElement("th", null, "%Error"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, this.props.rate.toFixed(2)),
                        React.createElement("td", null, percentOK.toFixed(2)),
                        React.createElement("td", null, percentErr.toFixed(2))))),
            React.createElement(RateChartGrpc, { percentOK: percentOK, percentErr: percentErr })));
    };
    return RateTableGrpc;
}(React.Component));
export { RateTableGrpc };
var RateTableHttp = /** @class */ (function (_super) {
    __extends(RateTableHttp, _super);
    function RateTableHttp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RateTableHttp.prototype.render = function () {
        // for the table
        var errRate = this.props.rate4xx + this.props.rate5xx;
        var percentErr = this.props.rate === 0 ? 0 : (errRate / this.props.rate) * 100;
        var successErr = 100 - percentErr;
        // for the graph
        var rate2xx = this.props.rate === 0 ? 0 : this.props.rate - this.props.rate3xx - this.props.rate4xx - this.props.rate5xx;
        var percent2xx = this.props.rate === 0 ? 0 : (rate2xx / this.props.rate) * 100;
        var percent3xx = this.props.rate === 0 ? 0 : (this.props.rate3xx / this.props.rate) * 100;
        var percent4xx = this.props.rate === 0 ? 0 : (this.props.rate4xx / this.props.rate) * 100;
        var percent5xx = this.props.rate === 0 ? 0 : (this.props.rate5xx / this.props.rate) * 100;
        return (React.createElement("div", null,
            React.createElement("strong", null, this.props.title),
            React.createElement("table", { className: "table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Total"),
                        React.createElement("th", null, "%Success"),
                        React.createElement("th", null, "%Error"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, this.props.rate.toFixed(2)),
                        React.createElement("td", null, successErr.toFixed(2)),
                        React.createElement("td", null, percentErr.toFixed(2))))),
            React.createElement(RateChartHttp, { percent2xx: percent2xx, percent3xx: percent3xx, percent4xx: percent4xx, percent5xx: percent5xx })));
    };
    return RateTableHttp;
}(React.Component));
export { RateTableHttp };
//# sourceMappingURL=RateTable.js.map