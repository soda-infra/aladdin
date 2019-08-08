var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import SecondaryMasthead from '../Nav/SecondaryMasthead';
import NamespaceDropdownContainer from '../NamespaceDropdown';
var DefaultSecondaryMasthead = /** @class */ (function (_super) {
    __extends(DefaultSecondaryMasthead, _super);
    function DefaultSecondaryMasthead() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultSecondaryMasthead.prototype.render = function () {
        return (React.createElement(SecondaryMasthead, null,
            React.createElement(NamespaceDropdownContainer, { disabled: false })));
    };
    return DefaultSecondaryMasthead;
}(React.PureComponent));
export default DefaultSecondaryMasthead;
//# sourceMappingURL=DefaultSecondaryMasthead.js.map