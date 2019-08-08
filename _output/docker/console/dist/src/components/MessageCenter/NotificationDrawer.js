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
import { Collapse } from 'react-bootstrap';
import { NotificationDrawer as PfNotificationDrawer, Notification, Icon, Button, EmptyState, EmptyStateTitle, EmptyStateIcon } from 'patternfly-react';
import { MessageType } from '../../types/MessageCenter';
import moment from 'moment';
var typeForPfIcon = function (type) {
    switch (type) {
        case MessageType.ERROR:
            return 'error-circle-o';
        case MessageType.INFO:
            return 'info';
        case MessageType.SUCCESS:
            return 'ok';
        case MessageType.WARNING:
            return 'warning-triangle-o';
        default:
            throw Error('Unexpected type');
    }
};
var getUnreadCount = function (messages) {
    return messages.reduce(function (count, message) {
        return message.seen ? count : count + 1;
    }, 0);
};
var getUnreadMessageLabel = function (messages) {
    var unreadCount = getUnreadCount(messages);
    return unreadCount === 1 ? '1 Unread Message' : getUnreadCount(messages) + " Unread Messages";
};
var noNotificationsMessage = (React.createElement(EmptyState, null,
    React.createElement(EmptyStateIcon, { name: "info" }),
    React.createElement(EmptyStateTitle, null, " No Messages Available ")));
var NotificationWrapper = /** @class */ (function (_super) {
    __extends(NotificationWrapper, _super);
    function NotificationWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotificationWrapper.prototype.render = function () {
        var _this = this;
        return (React.createElement(Notification, { seen: this.props.message.seen, onClick: function () { return _this.props.onClick(_this.props.message); } },
            React.createElement(Icon, { className: "pull-left", type: "pf", name: typeForPfIcon(this.props.message.type) }),
            React.createElement(Notification.Content, null,
                React.createElement(Notification.Message, null,
                    this.props.message.content,
                    this.props.message.count > 1 && (React.createElement("div", null,
                        this.props.message.count,
                        " ",
                        moment().from(this.props.message.firstTriggered)))),
                React.createElement(Notification.Info, { leftText: this.props.message.created.toLocaleDateString(), rightText: this.props.message.created.toLocaleTimeString() }))));
    };
    return NotificationWrapper;
}(React.PureComponent));
var NotificationGroupWrapper = /** @class */ (function (_super) {
    __extends(NotificationGroupWrapper, _super);
    function NotificationGroupWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getMessages = function () {
            return _this.props.reverseMessageOrder ? _this.props.group.messages.slice().reverse() : _this.props.group.messages;
        };
        return _this;
    }
    NotificationGroupWrapper.prototype.render = function () {
        var _this = this;
        var group = this.props.group;
        var isExpanded = this.props.isExpanded;
        if (group.hideIfEmpty && group.messages.length === 0) {
            return null;
        }
        return (React.createElement(PfNotificationDrawer.Panel, { expanded: isExpanded },
            React.createElement(PfNotificationDrawer.PanelHeading, { onClick: function () { return _this.props.onToggle(group); } },
                React.createElement(PfNotificationDrawer.PanelTitle, null,
                    React.createElement("a", { className: isExpanded ? '' : 'collapsed', "aria-expanded": "true" }, group.title)),
                React.createElement(PfNotificationDrawer.PanelCounter, { text: getUnreadMessageLabel(group.messages) })),
            React.createElement(Collapse, { in: isExpanded },
                React.createElement(PfNotificationDrawer.PanelCollapse, null,
                    React.createElement(PfNotificationDrawer.PanelBody, null,
                        group.messages.length === 0 && noNotificationsMessage,
                        this.getMessages().map(function (message) { return (React.createElement(NotificationWrapper, { key: message.id, message: message, onClick: _this.props.onNotificationClick })); })),
                    group.showActions && group.messages.length > 0 && (React.createElement(PfNotificationDrawer.PanelAction, null,
                        React.createElement(PfNotificationDrawer.PanelActionLink, { className: "drawer-pf-action-link" },
                            React.createElement(Button, { bsStyle: "link", onClick: function () { return _this.props.onMarkGroupAsRead(group); } }, "Mark All Read")),
                        React.createElement(PfNotificationDrawer.PanelActionLink, { "data-toggle": "clear-all" },
                            React.createElement(Button, { bsStyle: "link", onClick: function () { return _this.props.onClearGroup(group); } },
                                React.createElement(Icon, { type: "pf", name: "close" }),
                                "Clear All"))))))));
    };
    return NotificationGroupWrapper;
}(React.PureComponent));
var NotificationDrawer = /** @class */ (function (_super) {
    __extends(NotificationDrawer, _super);
    function NotificationDrawer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotificationDrawer.prototype.render = function () {
        var _this = this;
        return (React.createElement(PfNotificationDrawer, { hide: this.props.isHidden, expanded: this.props.isExpanded },
            React.createElement(PfNotificationDrawer.Title, { title: this.props.title, onExpandClick: this.props.onExpandDrawer, onCloseClick: this.props.onHideDrawer }),
            React.createElement(PfNotificationDrawer.Accordion, null,
                this.props.groups.length === 0 && noNotificationsMessage,
                this.props.groups.map(function (group) {
                    return (React.createElement(NotificationGroupWrapper, { key: group.id, group: group, reverseMessageOrder: _this.props.reverseMessageOrder, isExpanded: group.id === _this.props.expandedGroupId, onToggle: _this.props.onToggleGroup, onNotificationClick: function (message) { return _this.props.onNotificationClick(message, group); }, onMarkGroupAsRead: _this.props.onMarkGroupAsRead, onClearGroup: _this.props.onClearGroup }));
                }))));
    };
    return NotificationDrawer;
}(React.PureComponent));
export default NotificationDrawer;
//# sourceMappingURL=NotificationDrawer.js.map