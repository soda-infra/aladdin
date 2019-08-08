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
import { default as MTLSIcon } from './MTLSIcon';
export var emptyDescriptor = {
    message: '',
    icon: '',
    showStatus: false
};
var MTLSStatus = /** @class */ (function (_super) {
    __extends(MTLSStatus, _super);
    function MTLSStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MTLSStatus.prototype.statusDescriptor = function () {
        return this.props.statusDescriptors.get(this.props.status) || emptyDescriptor;
    };
    MTLSStatus.prototype.icon = function () {
        return this.statusDescriptor().icon;
    };
    MTLSStatus.prototype.message = function () {
        return this.statusDescriptor().message;
    };
    MTLSStatus.prototype.showStatus = function () {
        return this.statusDescriptor().showStatus;
    };
    MTLSStatus.prototype.overlayPosition = function () {
        return this.props.overlayPosition || 'left';
    };
    MTLSStatus.prototype.iconClassName = function () {
        return this.props.className || '';
    };
    MTLSStatus.prototype.render = function () {
        if (this.showStatus()) {
            return (React.createElement(MTLSIcon, { icon: this.icon(), iconClassName: this.iconClassName(), overlayText: this.message(), overlayPosition: this.overlayPosition() }));
        }
        return null;
    };
    return MTLSStatus;
}(React.Component));
export default MTLSStatus;
//# sourceMappingURL=MTLSStatus.js.map