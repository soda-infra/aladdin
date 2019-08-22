import { MessageCenterActions } from './MessageCenterActions';
var MessageCenterThunkActions = {
    toggleMessageCenter: function () {
        return function (dispatch, getState) {
            var state = getState();
            if (state.messageCenter.hidden) {
                dispatch(MessageCenterActions.showMessageCenter());
                dispatch(MessageCenterActions.expandGroup('default'));
            }
            else {
                dispatch(MessageCenterActions.hideMessageCenter());
            }
            return Promise.resolve();
        };
    },
    toggleSystemErrorsCenter: function () {
        return function (dispatch, getState) {
            var state = getState();
            if (state.messageCenter.hidden) {
                dispatch(MessageCenterActions.showMessageCenter());
                dispatch(MessageCenterActions.expandGroup('systemErrors'));
            }
            else {
                dispatch(MessageCenterActions.hideMessageCenter());
            }
            return Promise.resolve();
        };
    },
    markGroupAsRead: function (groupId) {
        return function (dispatch, getState) {
            var state = getState();
            var foundGroup = state.messageCenter.groups.find(function (group) { return group.id === groupId; });
            if (foundGroup) {
                dispatch(MessageCenterActions.markAsRead(foundGroup.messages.map(function (message) { return message.id; })));
            }
            return Promise.resolve();
        };
    },
    clearGroup: function (groupId) {
        return function (dispatch, getState) {
            var state = getState();
            var foundGroup = state.messageCenter.groups.find(function (group) { return group.id === groupId; });
            if (foundGroup) {
                dispatch(MessageCenterActions.removeMessage(foundGroup.messages.map(function (message) { return message.id; })));
            }
            return Promise.resolve();
        };
    }
};
export default MessageCenterThunkActions;
//# sourceMappingURL=MessageCenterThunkActions.js.map