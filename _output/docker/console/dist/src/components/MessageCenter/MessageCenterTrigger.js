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
import { connect } from 'react-redux';
import { Badge, Button, ButtonVariant } from '@patternfly/react-core';
import { BellIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import { MessageType } from '../../types/MessageCenter';
import MessageCenterThunkActions from '../../actions/MessageCenterThunkActions';
var MessageCenterTrigger = /** @class */ (function (_super) {
    __extends(MessageCenterTrigger, _super);
    function MessageCenterTrigger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderSystemErrorBadge = function () {
            if (_this.props.systemErrorsCount === 0) {
                return null;
            }
            return (React.createElement(Button, { id: 'icon_warning', "aria-label": 'SystemError', onClick: _this.props.toggleSystemErrorsCenter, variant: ButtonVariant.plain },
                React.createElement(WarningTriangleIcon, null),
                _this.props.systemErrorsCount,
                _this.props.systemErrorsCount === 1 ? ' Open Issue' : ' Open Issues'));
        };
        _this.renderMessageCenterBadge = function () {
            return (React.createElement(Button, { id: 'bell_icon_warning', "aria-label": 'Notifications', onClick: _this.props.toggleMessageCenter, variant: ButtonVariant.plain },
                React.createElement(BellIcon, null),
                _this.props.newMessagesCount > 0 && (React.createElement(Badge, { className: 'pf-badge-bodered' + (_this.props.badgeDanger ? ' badge-danger' : '') }, _this.props.newMessagesCount > 0 ? _this.props.newMessagesCount : ' '))));
        };
        return _this;
    }
    MessageCenterTrigger.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            this.renderSystemErrorBadge(),
            this.renderMessageCenterBadge()));
    };
    return MessageCenterTrigger;
}(React.PureComponent));
export { MessageCenterTrigger };
var mapStateToPropsMessageCenterTrigger = function (state) {
    var dangerousMessageTypes = [MessageType.ERROR, MessageType.WARNING];
    var systemErrorsCount = 0;
    var systemErrorsGroup = state.messageCenter.groups.find(function (item) { return item.id === 'systemErrors'; });
    if (systemErrorsGroup) {
        systemErrorsCount = systemErrorsGroup.messages.length;
    }
    return state.messageCenter.groups
        .reduce(function (unreadMessages, group) {
        return unreadMessages.concat(group.messages.reduce(function (unreadMessagesInGroup, message) {
            if (!message.seen) {
                unreadMessagesInGroup.push(message);
            }
            return unreadMessagesInGroup;
        }, []));
    }, [])
        .reduce(function (propsToMap, message) {
        propsToMap.newMessagesCount++;
        propsToMap.badgeDanger = propsToMap.badgeDanger || dangerousMessageTypes.includes(message.type);
        return propsToMap;
    }, { newMessagesCount: 0, systemErrorsCount: systemErrorsCount, badgeDanger: false });
};
var mapDispatchToPropsMessageCenterTrigger = function (dispatch) {
    return {
        toggleMessageCenter: function () { return dispatch(MessageCenterThunkActions.toggleMessageCenter()); },
        toggleSystemErrorsCenter: function () { return dispatch(MessageCenterThunkActions.toggleSystemErrorsCenter()); }
    };
};
var MessageCenterTriggerContainer = connect(mapStateToPropsMessageCenterTrigger, mapDispatchToPropsMessageCenterTrigger)(MessageCenterTrigger);
export default MessageCenterTriggerContainer;
//# sourceMappingURL=MessageCenterTrigger.js.map