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
import _ from 'lodash';
// The Envoy flags can be found here:
// https://github.com/envoyproxy/envoy/blob/master/source/common/stream_info/utility.cc
var Flags = {
    DC: { code: '500', help: 'Downstream Connection Termination' },
    DI: { help: 'Delayed via fault injection' },
    FI: { help: 'Aborted via fault injection' },
    LH: { code: '503', help: 'Local service failed health check request' },
    LR: { code: '503', help: 'Connection local reset' },
    NR: { code: '404', help: 'No route configured for a given request' },
    RL: { code: '429', help: 'Ratelimited locally by the HTTP rate limit filter' },
    RLSE: { help: 'Rate limited service error' },
    SI: { help: 'Stream idle timeout' },
    UAEX: { help: 'Unauthorized external service' },
    UC: { code: '503', help: 'Upstream connection termination' },
    UF: { code: '503', help: 'Upstream connection failure in addition' },
    UH: { code: '503', help: 'No healthy upstream hosts in upstream cluster' },
    UO: { code: '503', help: 'Upstream overflow (circuit breaker open)' },
    UR: { code: '503', help: 'Upstream remote reset' },
    URX: { code: '503', help: 'Upstream retry limit exceeded' },
    UT: { code: '504', help: 'Upstream request timeout' }
};
var ResponseTable = /** @class */ (function (_super) {
    __extends(ResponseTable, _super);
    function ResponseTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getRows = function (responses) {
            var rows = [];
            _.keys(responses).forEach(function (code) {
                _.keys(responses[code]).forEach(function (f) {
                    rows.push({ key: code + " " + f, code: code, flags: f, val: responses[code][f] });
                });
            });
            return rows;
        };
        _this.getTitle = function (flags) {
            return flags
                .split(',')
                .map(function (flagToken) {
                flagToken = flagToken.trim();
                var flag = Flags[flagToken];
                return flagToken === '-' ? '' : "[" + flagToken + "] " + (flag ? flag.help : 'Unknown Flag');
            })
                .join('\n');
        };
        return _this;
    }
    ResponseTable.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement("strong", null, this.props.title),
            React.createElement("table", { className: "table" },
                React.createElement("thead", null,
                    React.createElement("tr", { key: "table-header" },
                        React.createElement("th", null, "Code"),
                        React.createElement("th", null, "Flags"),
                        React.createElement("th", null, "% of Requests"))),
                React.createElement("tbody", null, this.getRows(this.props.responses).map(function (row) { return (React.createElement("tr", { key: row.key },
                    React.createElement("td", null, row.code),
                    React.createElement("td", { title: _this.getTitle(row.flags) }, row.flags),
                    React.createElement("td", null, row.val))); })))));
    };
    return ResponseTable;
}(React.PureComponent));
export { ResponseTable };
//# sourceMappingURL=ResponseTable.js.map