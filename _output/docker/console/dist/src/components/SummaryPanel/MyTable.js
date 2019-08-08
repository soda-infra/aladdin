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
var MyTable = /** @class */ (function (_super) {
    __extends(MyTable, _super);
    function MyTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyTable.prototype.render = function () {
        return (React.createElement("tr", null,
            React.createElement("td", null, this.props.service),
            React.createElement("td", null, this.props.workload),
            React.createElement("td", null,
                this.props.requests.toFixed(2),
                " ops"),
            React.createElement("td", null,
                this.props.p50Latency.toFixed(2),
                " ms"),
            React.createElement("td", null,
                this.props.p90Latency.toFixed(2),
                " ms"),
            React.createElement("td", null,
                this.props.p99Latency.toFixed(2),
                " ms"),
            React.createElement("td", null,
                this.props.successRate,
                "%")));
    };
    return MyTable;
}(React.Component));
export { MyTable };
//# sourceMappingURL=MyTable.js.map