import { createAction } from 'typesafe-actions';
import { MessageType } from '../types/MessageCenter';
import { ActionKeys } from './ActionKeys';
var DEFAULT_GROUP_ID = 'default';
var DEFAULT_MESSAGE_TYPE = MessageType.ERROR;
var toNumberArray = function (n) { return (Array.isArray(n) ? n : [n]); };
export var MessageCenterActions = {
    addMessage: createAction(ActionKeys.MC_ADD_MESSAGE, function (resolve) { return function (content, groupId, messageType) {
        if (groupId === void 0) { groupId = DEFAULT_GROUP_ID; }
        if (messageType === void 0) { messageType = DEFAULT_MESSAGE_TYPE; }
        return resolve({ content: content, groupId: groupId, messageType: messageType });
    }; }),
    removeMessage: createAction(ActionKeys.MC_REMOVE_MESSAGE, function (resolve) { return function (messageId) {
        return resolve({ messageId: toNumberArray(messageId) });
    }; }),
    markAsRead: createAction(ActionKeys.MC_MARK_MESSAGE_AS_READ, function (resolve) { return function (messageId) {
        return resolve({ messageId: toNumberArray(messageId) });
    }; }),
    toggleGroup: createAction(ActionKeys.MC_TOGGLE_GROUP, function (resolve) { return function (groupId) { return resolve({ groupId: groupId }); }; }),
    expandGroup: createAction(ActionKeys.MC_EXPAND_GROUP, function (resolve) { return function (groupId) { return resolve({ groupId: groupId }); }; }),
    hideNotification: createAction(ActionKeys.MC_HIDE_NOTIFICATION, function (resolve) { return function (messageId) {
        return resolve({ messageId: toNumberArray(messageId) });
    }; }),
    showMessageCenter: createAction(ActionKeys.MC_SHOW),
    hideMessageCenter: createAction(ActionKeys.MC_HIDE),
    toggleExpandedMessageCenter: createAction(ActionKeys.MC_TOGGLE_EXPAND)
};
//# sourceMappingURL=MessageCenterActions.js.map