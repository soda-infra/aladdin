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
var LocalTime = /** @class */ (function (_super) {
    __extends(LocalTime, _super);
    function LocalTime() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocalTime.prototype.render = function () {
        var renderedTime;
        if (this.props.time) {
            renderedTime = new Date(this.props.time).toLocaleString();
        }
        else {
            renderedTime = '-';
        }
        return renderedTime;
    };
    return LocalTime;
}(React.Component));
export default LocalTime;
//# sourceMappingURL=LocalTime.js.map