import * as React from 'react';
export var createIcon = function (status, size) {
    return React.createElement(status.icon, { color: status.color, size: size, className: status.class });
};
//# sourceMappingURL=Helper.js.map