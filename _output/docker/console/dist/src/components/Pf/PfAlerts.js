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
import { Alert } from 'patternfly-react';
var PfAlerts = /** @class */ (function (_super) {
    __extends(PfAlerts, _super);
    function PfAlerts(props) {
        var _this = _super.call(this, props) || this;
        _this.dismissAlert = function () {
            if (_this.props.onDismiss) {
                _this.props.onDismiss();
            }
        };
        return _this;
    }
    PfAlerts.prototype.render = function () {
        if (!this.props.isVisible || this.props.alerts.length === 0) {
            return null;
        }
        var alertsUi;
        if (this.props.alerts.length === 1) {
            alertsUi = React.createElement(React.Fragment, null, this.props.alerts[0]);
        }
        else {
            alertsUi = (React.createElement("ul", null, this.props.alerts.map(function (alert) {
                return React.createElement("li", { key: alert }, alert);
            })));
        }
        return React.createElement(Alert, { onDismiss: this.dismissAlert }, alertsUi);
    };
    return PfAlerts;
}(React.Component));
export default PfAlerts;
//# sourceMappingURL=PfAlerts.js.map