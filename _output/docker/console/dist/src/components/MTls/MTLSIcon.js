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
import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'patternfly-react';
var fullIcon = require('../../assets/img/mtls-status-full.svg');
var hollowIcon = require('../../assets/img/mtls-status-partial.svg');
var fullIconDark = require('../../assets/img/mtls-status-full-dark.svg');
var hollowIconDark = require('../../assets/img/mtls-status-partial-dark.svg');
export var MTLSIconTypes;
(function (MTLSIconTypes) {
    MTLSIconTypes["LOCK_FULL"] = "LOCK_FULL";
    MTLSIconTypes["LOCK_HOLLOW"] = "LOCK_HOLLOW";
    MTLSIconTypes["LOCK_FULL_DARK"] = "LOCK_FULL_DARK";
    MTLSIconTypes["LOCK_HOLLOW_DARK"] = "LOCK_HOLLOW_DARK";
})(MTLSIconTypes || (MTLSIconTypes = {}));
var nameToSource = new Map([
    [MTLSIconTypes.LOCK_FULL, fullIcon],
    [MTLSIconTypes.LOCK_FULL_DARK, fullIconDark],
    [MTLSIconTypes.LOCK_HOLLOW, hollowIcon],
    [MTLSIconTypes.LOCK_HOLLOW_DARK, hollowIconDark]
]);
var MTLSIcon = /** @class */ (function (_super) {
    __extends(MTLSIcon, _super);
    function MTLSIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MTLSIcon.prototype.infotipContent = function () {
        return React.createElement(Tooltip, { id: 'mtls-status-masthead' }, this.props.overlayText);
    };
    MTLSIcon.prototype.render = function () {
        return (React.createElement(OverlayTrigger, { placement: this.props.overlayPosition, overlay: this.infotipContent(), trigger: ['hover', 'focus'], rootClose: false },
            React.createElement("img", { className: this.props.iconClassName, src: nameToSource.get(this.props.icon), alt: this.props.overlayPosition })));
    };
    return MTLSIcon;
}(React.Component));
export default MTLSIcon;
//# sourceMappingURL=MTLSIcon.js.map