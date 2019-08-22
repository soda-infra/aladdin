import * as React from 'react';
import { Icon } from 'patternfly-react';
export var canRender = function (value) {
    return typeof value !== 'object';
};
export var renderErrorMessage = function (message) {
    return (React.createElement(Icon, { type: "pf", name: "error" },
        ' ',
        message + ' '));
};
export var safeRender = function (value, message) {
    if (message === void 0) { message = 'Invalid value'; }
    return canRender(value) ? value : renderErrorMessage(message);
};
//# sourceMappingURL=SafeRender.js.map