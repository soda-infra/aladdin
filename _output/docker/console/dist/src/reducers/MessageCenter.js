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
import { MessageType } from '../types/MessageCenter';
import { getType } from 'typesafe-actions';
import { MessageCenterActions } from '../actions/MessageCenterActions';
import { updateState } from '../utils/Reducer';
import { LoginActions } from '../actions/LoginActions';
import _ from 'lodash';
export var INITIAL_MESSAGE_CENTER_STATE = {
    nextId: 0,
    groups: [
        {
            id: 'systemErrors',
            title: 'Open issues',
            messages: [],
            showActions: false,
            hideIfEmpty: true
        },
        {
            id: 'default',
            title: 'Notifications',
            messages: [],
            showActions: true,
            hideIfEmpty: false
        }
    ],
    hidden: true,
    expanded: false,
    expandedGroupId: 'default'
};
var createMessage = function (id, content, type, count, created, firstTriggered) {
    return {
        id: id,
        content: content,
        type: type,
        count: count,
        show_notification: type === MessageType.ERROR || type === MessageType.WARNING || type === MessageType.SUCCESS,
        seen: false,
        created: created,
        firstTriggered: firstTriggered
    };
};
// Updates several messages with the same payload, useful for marking messages
// returns the updated state
var updateMessage = function (state, messageIds, updater) {
    var groups = state.groups.map(function (group) {
        group = __assign({}, group, { messages: group.messages.map(function (message) {
                if (messageIds.includes(message.id)) {
                    message = updater(message);
                }
                return message;
            }) });
        return group;
    });
    return updateState(state, { groups: groups });
};
var Messages = function (state, action) {
    if (state === void 0) { state = INITIAL_MESSAGE_CENTER_STATE; }
    switch (action.type) {
        case getType(MessageCenterActions.addMessage): {
            var _a = action.payload, groupId_1 = _a.groupId, content_1 = _a.content, messageType_1 = _a.messageType;
            var groups = state.groups.map(function (group) {
                if (group.id === groupId_1) {
                    var existingMessage = group.messages.find(function (message) {
                        return message.content === content_1;
                    });
                    var newMessage = void 0;
                    if (existingMessage) {
                        // it is in the list already
                        var firstTriggered = existingMessage.firstTriggered
                            ? existingMessage.firstTriggered
                            : existingMessage.created;
                        newMessage = createMessage(state.nextId, content_1, messageType_1, existingMessage.count + 1, new Date(), firstTriggered);
                        // remove the old message from the list
                        var filteredArray = _.remove(group.messages, function (message) {
                            return message.content !== content_1;
                        });
                        group = __assign({}, group, { messages: filteredArray.concat(newMessage) });
                    }
                    else {
                        newMessage = createMessage(state.nextId, content_1, messageType_1, 1, new Date(), undefined);
                        group = __assign({}, group, { messages: group.messages.concat(newMessage) });
                    }
                    return group;
                }
                return group;
            });
            return updateState(state, { groups: groups, nextId: state.nextId + 1 });
        }
        case getType(MessageCenterActions.removeMessage): {
            var messageId_1 = action.payload.messageId;
            var groups = state.groups.map(function (group) {
                group = __assign({}, group, { messages: group.messages.filter(function (message) {
                        return !messageId_1.includes(message.id);
                    }) });
                return group;
            });
            return updateState(state, { groups: groups });
        }
        case getType(MessageCenterActions.markAsRead): {
            return updateMessage(state, action.payload.messageId, function (message) { return (__assign({}, message, { seen: true, show_notification: false })); });
        }
        case getType(MessageCenterActions.hideNotification): {
            return updateMessage(state, action.payload.messageId, function (message) { return (__assign({}, message, { show_notification: false })); });
        }
        case getType(MessageCenterActions.showMessageCenter):
            if (state.hidden) {
                return updateState(state, { hidden: false });
            }
            return state;
        case getType(MessageCenterActions.hideMessageCenter):
            if (!state.hidden) {
                return updateState(state, { hidden: true });
            }
            return state;
        case getType(MessageCenterActions.toggleExpandedMessageCenter):
            return updateState(state, { expanded: !state.expanded });
        case getType(MessageCenterActions.toggleGroup): {
            var groupId = action.payload.groupId;
            if (state.expandedGroupId === groupId) {
                return updateState(state, { expandedGroupId: undefined });
            }
            return updateState(state, { expandedGroupId: groupId });
        }
        case getType(MessageCenterActions.expandGroup): {
            var groupId = action.payload.groupId;
            return updateState(state, { expandedGroupId: groupId });
        }
        case getType(LoginActions.loginRequest): {
            // Let's clear the message center quen user is loggin-in. This ensures
            // that messages from a past session won't persist because may be obsolete.
            return INITIAL_MESSAGE_CENTER_STATE;
        }
        default:
            return state;
    }
};
export default Messages;
//# sourceMappingURL=MessageCenter.js.map