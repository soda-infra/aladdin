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
import { style } from 'typestyle';
var secondaryMastheadStyle = style({
    padding: '5px 5px',
    borderBottom: '1px solid #ccc;',
    height: '42px',
    position: 'sticky',
    zIndex: 10,
    marginLeft: 0,
    marginRight: 0
});
var SecondaryMasthead = /** @class */ (function (_super) {
    __extends(SecondaryMasthead, _super);
    function SecondaryMasthead() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecondaryMasthead.prototype.render = function () {
        return (React.createElement("div", { id: "global-namespace-selector", className: "container-fluid " + secondaryMastheadStyle }, this.props.children));
    };
    return SecondaryMasthead;
}(React.PureComponent));
export default SecondaryMasthead;
//# sourceMappingURL=SecondaryMasthead.js.map