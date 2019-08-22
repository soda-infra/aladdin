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
import { ToastNotificationList, TimedToastNotification } from 'patternfly-react';
var DEFAULT_TIMER_DELAY = 5000;
var NotificationList = /** @class */ (function (_super) {
    __extends(NotificationList, _super);
    function NotificationList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotificationList.prototype.render = function () {
        var _this = this;
        return (React.createElement(ToastNotificationList, null, this.props.messages.map(function (message) { return (React.createElement(TimedToastNotification, { key: message.id, persistent: false, paused: false, timerdelay: DEFAULT_TIMER_DELAY, onDismiss: function (event) { return _this.props.onDismiss(message, event !== undefined); }, type: message.type },
            React.createElement("span", null, message.content))); })));
    };
    return NotificationList;
}(React.PureComponent));
export default NotificationList;
//# sourceMappingURL=NotificationList.js.map