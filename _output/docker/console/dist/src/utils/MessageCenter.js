import { store } from '../store/ConfigStore';
import { MessageCenterActions } from '../actions/MessageCenterActions';
export var add = function (content, group, type) {
    store.dispatch(MessageCenterActions.addMessage(content, group, type));
};
//# sourceMappingURL=MessageCenter.js.map