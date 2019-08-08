import { createAction } from 'typesafe-actions';
import { ActionKeys } from './ActionKeys';
export var HelpDropdownActions = {
    statusRefresh: createAction(ActionKeys.HELP_STATUS_REFRESH, function (resolve) { return function (status, components, warningMessages) {
        return resolve({
            status: status,
            components: components,
            warningMessages: warningMessages
        });
    }; })
};
//# sourceMappingURL=HelpDropdownActions.js.map