import { MessageCenterActions } from '../MessageCenterActions';
import MessageCenterThunkActions from '../MessageCenterThunkActions';
import { MessageType } from '../../types/MessageCenter';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
var middlewares = [thunk];
var mockStore = configureMockStore(middlewares);
describe('MessageCenterActions', function () {
    it('should add a message', function () {
        var expectedPayload = {
            content: 'my message',
            groupId: 'great-messages',
            messageType: MessageType.WARNING
        };
        var action = MessageCenterActions.addMessage('my message', 'great-messages', MessageType.WARNING);
        expect(action.payload).toEqual(expectedPayload);
    });
    it('should remove a single message', function () {
        var action = MessageCenterActions.removeMessage(5);
        expect(action.payload.messageId).toEqual([5]);
    });
    it('should remove multiple messages', function () {
        var action = MessageCenterActions.removeMessage([5, 6, 8]);
        expect(action.payload.messageId).toEqual([5, 6, 8]);
    });
    it('should mark as read a single message', function () {
        var action = MessageCenterActions.markAsRead(3);
        expect(action.payload.messageId).toEqual([3]);
    });
    it('should mark as read multiple messages', function () {
        var action = MessageCenterActions.markAsRead([1, 2, 3, 4]);
        expect(action.payload.messageId).toEqual([1, 2, 3, 4]);
    });
    it('should toggle group', function () {
        var action = MessageCenterActions.toggleGroup('my-awesome-group');
        expect(action.payload.groupId).toEqual('my-awesome-group');
    });
    it('should hide a single notification', function () {
        var action = MessageCenterActions.hideNotification(2);
        expect(action.payload.messageId).toEqual([2]);
    });
    it('should hide a multiple notifications', function () {
        var action = MessageCenterActions.hideNotification([8, 9, 7]);
        expect(action.payload.messageId).toEqual([8, 9, 7]);
    });
    it('should open a closed message center', function () {
        var expectedActions = [MessageCenterActions.showMessageCenter(), MessageCenterActions.expandGroup('default')];
        var store = mockStore({ messageCenter: { hidden: true } });
        return store.dispatch(MessageCenterThunkActions.toggleMessageCenter()).then(function () {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    it('should close an opened message center', function () {
        var expectedActions = [MessageCenterActions.hideMessageCenter()];
        var store = mockStore({ messageCenter: { hidden: false } });
        return store.dispatch(MessageCenterThunkActions.toggleMessageCenter()).then(function () {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    it('should only mark selected group as read', function () {
        var expectedActions = [MessageCenterActions.markAsRead([1, 2, 3])];
        var store = mockStore({
            messageCenter: {
                groups: [
                    {
                        id: 'my-group',
                        messages: [{ id: 1 }, { id: 2 }, { id: 3 }]
                    },
                    {
                        id: 'other',
                        messages: [{ id: 5 }, { id: 6 }, { id: 7 }]
                    }
                ]
            }
        });
        return store.dispatch(MessageCenterThunkActions.markGroupAsRead('my-group')).then(function () {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    it('should only clear messages of selected group', function () {
        var expectedActions = [MessageCenterActions.removeMessage([5, 6, 7])];
        var store = mockStore({
            messageCenter: {
                groups: [
                    {
                        id: 'my-group',
                        messages: [{ id: 1 }, { id: 2 }, { id: 3 }]
                    },
                    {
                        id: 'other',
                        messages: [{ id: 5 }, { id: 6 }, { id: 7 }]
                    }
                ]
            }
        });
        return store.dispatch(MessageCenterThunkActions.clearGroup('other')).then(function () {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
//# sourceMappingURL=MessageCenterAction.test.js.map