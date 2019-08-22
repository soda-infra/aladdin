import MessageCenter from '../MessageCenter';
import { MessageType } from '../../types/MessageCenter';
import { GlobalActions } from '../../actions/GlobalActions';
import { MessageCenterActions } from '../../actions/MessageCenterActions';
describe('MessageCenter reducer', function () {
    var RealDate = Date;
    var mockDate = function (date) {
        global.Date = jest.fn(function () { return date; });
        return date;
    };
    afterEach(function () {
        global.Date = RealDate;
    });
    it('should return the initial state', function () {
        expect(MessageCenter(undefined, GlobalActions.unknown())).toEqual({
            expanded: false,
            expandedGroupId: 'default',
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
                    messages: [],
                    title: 'Notifications',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 0
        });
    });
    it('should handle ADD_MESSAGE', function () {
        var date = mockDate(new Date());
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 0
        }, MessageCenterActions.addMessage('my new message', 'default', MessageType.WARNING))).toEqual({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [
                        {
                            id: 0,
                            seen: false,
                            show_notification: true,
                            content: 'my new message',
                            type: MessageType.WARNING,
                            count: 1,
                            firstTriggered: undefined,
                            created: date
                        }
                    ],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 1
        });
    });
    it('should handle Duplicate Messages', function () {
        var date = mockDate(new Date());
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [
                        {
                            id: 0,
                            seen: false,
                            show_notification: true,
                            content: 'my new message',
                            type: MessageType.WARNING,
                            count: 1,
                            firstTriggered: undefined,
                            created: date
                        }
                    ],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 0
        }, MessageCenterActions.addMessage('my new message', 'default', MessageType.WARNING))).toEqual({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [
                        {
                            id: 0,
                            seen: false,
                            show_notification: true,
                            content: 'my new message',
                            type: MessageType.WARNING,
                            count: 2,
                            firstTriggered: date,
                            created: date
                        }
                    ],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 1
        });
    });
    it('should handle REMOVE_MESSAGE', function () {
        var date = mockDate(new Date());
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    showActions: true,
                    hideIfEmpty: false,
                    messages: [
                        {
                            id: 0,
                            seen: false,
                            show_notification: true,
                            content: 'my new message',
                            type: MessageType.WARNING,
                            count: 1,
                            created: date
                        },
                        {
                            id: 1,
                            seen: true,
                            show_notification: false,
                            content: 'other message',
                            type: MessageType.ERROR,
                            count: 1,
                            created: date
                        },
                        {
                            id: 2,
                            seen: true,
                            show_notification: false,
                            content: 'other',
                            type: MessageType.INFO,
                            count: 1,
                            created: date
                        }
                    ],
                    title: 'Default'
                }
            ],
            hidden: true,
            nextId: 1
        }, MessageCenterActions.removeMessage([0, 2]))).toEqual({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [
                        {
                            id: 1,
                            seen: true,
                            show_notification: false,
                            content: 'other message',
                            type: MessageType.ERROR,
                            count: 1,
                            created: date
                        }
                    ],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 1
        });
    });
    it('should handle MARK_MESSAGE_AS_READ', function () {
        var date = mockDate(new Date());
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    showActions: true,
                    hideIfEmpty: false,
                    messages: [
                        {
                            id: 0,
                            seen: false,
                            show_notification: true,
                            content: 'my new message',
                            type: MessageType.WARNING,
                            count: 1,
                            created: date
                        },
                        {
                            id: 1,
                            seen: true,
                            show_notification: false,
                            content: 'other message',
                            type: MessageType.ERROR,
                            count: 1,
                            created: date
                        },
                        {
                            id: 2,
                            seen: false,
                            show_notification: false,
                            content: 'other',
                            type: MessageType.INFO,
                            count: 1,
                            created: date
                        }
                    ],
                    title: 'Default'
                }
            ],
            hidden: true,
            nextId: 1
        }, MessageCenterActions.markAsRead([0, 1]))).toEqual({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [
                        {
                            id: 0,
                            seen: true,
                            show_notification: false,
                            content: 'my new message',
                            type: MessageType.WARNING,
                            count: 1,
                            created: date
                        },
                        {
                            id: 1,
                            seen: true,
                            show_notification: false,
                            content: 'other message',
                            type: MessageType.ERROR,
                            count: 1,
                            created: date
                        },
                        {
                            id: 2,
                            seen: false,
                            show_notification: false,
                            content: 'other',
                            type: MessageType.INFO,
                            count: 1,
                            created: date
                        }
                    ],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 1
        });
    });
    it('should handle HIDE_NOTIFICATION', function () {
        var date = mockDate(new Date());
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    showActions: true,
                    hideIfEmpty: false,
                    messages: [
                        {
                            id: 0,
                            seen: false,
                            show_notification: true,
                            content: 'my new message',
                            type: MessageType.WARNING,
                            count: 1,
                            created: date
                        },
                        {
                            id: 1,
                            seen: false,
                            show_notification: true,
                            content: 'other message',
                            type: MessageType.ERROR,
                            count: 1,
                            created: date
                        }
                    ],
                    title: 'Default'
                }
            ],
            hidden: true,
            nextId: 1
        }, MessageCenterActions.hideNotification(0))).toEqual({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [
                        {
                            id: 0,
                            seen: false,
                            show_notification: false,
                            content: 'my new message',
                            type: MessageType.WARNING,
                            count: 1,
                            created: date
                        },
                        {
                            id: 1,
                            seen: false,
                            show_notification: true,
                            content: 'other message',
                            type: MessageType.ERROR,
                            count: 1,
                            created: date
                        }
                    ],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 1
        });
    });
    it('should handle SHOW', function () {
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 0
        }, MessageCenterActions.showMessageCenter())).toEqual({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: false,
            nextId: 0
        });
    });
    it('should handle HIDE', function () {
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: false,
            nextId: 0
        }, MessageCenterActions.hideMessageCenter())).toEqual({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: true,
            nextId: 0
        });
    });
    it('should handle TOGGLE_EXPAND', function () {
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: false,
            nextId: 0
        }, MessageCenterActions.toggleExpandedMessageCenter())).toEqual({
            expanded: true,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: false,
            nextId: 0
        });
    });
    it('should handle TOGGLE_GROUP to hide a group', function () {
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: false,
            nextId: 0
        }, MessageCenterActions.toggleGroup('default'))).toEqual({
            expanded: false,
            expandedGroupId: undefined,
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: false,
            nextId: 0
        });
    });
    it('should handle TOGGLE_GROUP to show a group', function () {
        expect(MessageCenter({
            expanded: false,
            expandedGroupId: undefined,
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: false,
            nextId: 0
        }, MessageCenterActions.toggleGroup('default'))).toEqual({
            expanded: false,
            expandedGroupId: 'default',
            groups: [
                {
                    id: 'default',
                    messages: [],
                    title: 'Default',
                    showActions: true,
                    hideIfEmpty: false
                }
            ],
            hidden: false,
            nextId: 0
        });
    });
});
//# sourceMappingURL=MessageCenterReducer.test.js.map