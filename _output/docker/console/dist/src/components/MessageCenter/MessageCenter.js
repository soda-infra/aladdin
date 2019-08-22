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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { connect } from 'react-redux';
import NotificationDrawer from './NotificationDrawer';
import NotificationList from './NotificationList';
import { style } from 'typestyle';
import { MessageCenterActions } from '../../actions/MessageCenterActions';
import MessageCenterThunkActions from '../../actions/MessageCenterThunkActions';
var notificationStyle = style({
    zIndex: 100
});
var MessageCenter = /** @class */ (function (_super) {
    __extends(MessageCenter, _super);
    function MessageCenter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Get messages that are meant to be show as notifications (Toast), appending
        // the groupId to allow to recognize the group they belong. (see onDismissNotification)
        _this.getNotificationMessages = function (groups) {
            return groups.reduce(function (messages, group) {
                return messages.concat(group.messages
                    .filter(function (message) { return message.show_notification; })
                    .map(function (message) { return (__assign({}, message, { groupId: group.id })); }));
            }, []);
        };
        _this.onDismissNotification = function (message, userDismissed) {
            _this.props.onDismissNotification(message, _this.props.groups.find(function (group) { return group.id === message.groupId; }), userDismissed);
        };
        return _this;
    }
    MessageCenter.prototype.render = function () {
        return (React.createElement("div", { className: notificationStyle },
            React.createElement(NotificationDrawer, { title: this.props.drawerTitle, isHidden: this.props.drawerIsHidden, isExpanded: this.props.drawerIsExpanded, expandedGroupId: this.props.drawerExpandedGroupId, groups: this.props.groups, reverseMessageOrder: this.props.drawerReverseMessageOrder, onExpandDrawer: this.props.onExpandDrawer, onHideDrawer: this.props.onHideDrawer, onToggleGroup: this.props.onToggleGroup, onMarkGroupAsRead: this.props.onMarkGroupAsRead, onClearGroup: this.props.onClearGroup, onNotificationClick: this.props.onNotificationClick }),
            React.createElement(NotificationList, { messages: this.getNotificationMessages(this.props.groups), onDismiss: this.onDismissNotification })));
    };
    return MessageCenter;
}(React.Component));
export { MessageCenter };
var mapStateToPropsMessageCenter = function (state) {
    return {
        groups: state.messageCenter.groups,
        drawerIsHidden: state.messageCenter.hidden,
        drawerIsExpanded: state.messageCenter.expanded,
        drawerExpandedGroupId: state.messageCenter.expandedGroupId
    };
};
var mapDispatchToPropsMessageCenter = function (dispatch) {
    return {
        onExpandDrawer: function () { return dispatch(MessageCenterActions.toggleExpandedMessageCenter()); },
        onHideDrawer: function () { return dispatch(MessageCenterActions.hideMessageCenter()); },
        onToggleGroup: function (group) { return dispatch(MessageCenterActions.toggleGroup(group.id)); },
        onMarkGroupAsRead: function (group) { return dispatch(MessageCenterThunkActions.markGroupAsRead(group.id)); },
        onClearGroup: function (group) { return dispatch(MessageCenterThunkActions.clearGroup(group.id)); },
        onNotificationClick: function (message) { return dispatch(MessageCenterActions.markAsRead(message.id)); },
        onDismissNotification: function (message, _group, userDismissed) {
            if (userDismissed) {
                dispatch(MessageCenterActions.markAsRead(message.id));
            }
            else {
                dispatch(MessageCenterActions.hideNotification(message.id));
            }
        }
    };
};
var MessageCenterContainer = connect(mapStateToPropsMessageCenter, mapDispatchToPropsMessageCenter)(MessageCenter);
export default MessageCenterContainer;
//# sourceMappingURL=MessageCenter.js.map