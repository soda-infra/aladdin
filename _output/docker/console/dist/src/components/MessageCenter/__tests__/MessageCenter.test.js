import * as React from 'react';
import { shallow } from 'enzyme';
import NotificationList from '../NotificationList';
import { MessageCenter } from '../MessageCenter';
import { MessageType } from '../../../types/MessageCenter';
describe('MessageCenter', function () {
    var groupMessages = [
        {
            id: 'first',
            title: 'im first',
            showActions: true,
            hideIfEmpty: false,
            messages: [
                {
                    id: 1,
                    seen: false,
                    content: 'show me',
                    type: MessageType.ERROR,
                    count: 0,
                    show_notification: true,
                    created: new Date()
                },
                {
                    id: 2,
                    seen: false,
                    content: 'hide me',
                    type: MessageType.ERROR,
                    count: 0,
                    created: new Date()
                }
            ]
        },
        {
            id: 'second',
            title: 'im second',
            showActions: true,
            hideIfEmpty: false,
            messages: [
                {
                    id: 2,
                    seen: true,
                    content: 'show me too',
                    type: MessageType.SUCCESS,
                    count: 0,
                    show_notification: true,
                    created: new Date()
                }
            ]
        }
    ];
    it('.getNotificationMessages only gets notifications', function () {
        var wrapper = shallow(React.createElement(MessageCenter, { drawerTitle: "Title", onExpandDrawer: function () { return console.log('onExpand'); }, onHideDrawer: function () { return console.log('onHideDrawer'); }, onToggleGroup: function () { return console.log('onToggleGroup'); }, onMarkGroupAsRead: function () { return console.log('onMarkGroupAsRead'); }, onClearGroup: function () { return console.log('onClearGroup'); }, onNotificationClick: function () { return console.log('onNotificationClick'); }, onDismissNotification: function () { return console.log('onDismissNotification'); }, groups: groupMessages }));
        var notificationList = wrapper.find(NotificationList);
        expect(notificationList.prop('messages').length).toEqual(2);
    });
});
//# sourceMappingURL=MessageCenter.test.js.map