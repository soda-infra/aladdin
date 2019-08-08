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
import { MTLSIconTypes } from './MTLSIcon';
import { default as MTLSStatus, emptyDescriptor } from './MTLSStatus';
import { style } from 'typestyle';
import { MTLSStatuses } from '../../types/TLSStatus';
var statusDescriptors = new Map([
    [
        MTLSStatuses.ENABLED,
        {
            message: 'mTLS is enabled for this namespace',
            icon: MTLSIconTypes.LOCK_FULL_DARK,
            showStatus: true
        }
    ],
    [
        MTLSStatuses.PARTIALLY,
        {
            message: 'mTLS is partially enabled for this namespace',
            icon: MTLSIconTypes.LOCK_HOLLOW_DARK,
            showStatus: true
        }
    ],
    [MTLSStatuses.DISABLED, emptyDescriptor],
    [MTLSStatuses.NOT_ENABLED, emptyDescriptor]
]);
var NamespaceMTLSStatus = /** @class */ (function (_super) {
    __extends(NamespaceMTLSStatus, _super);
    function NamespaceMTLSStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NamespaceMTLSStatus.prototype.iconStyle = function () {
        return style({
            marginTop: -2,
            marginRight: 6,
            width: 10
        });
    };
    NamespaceMTLSStatus.prototype.render = function () {
        return (React.createElement(MTLSStatus, { status: this.props.status, className: this.iconStyle(), statusDescriptors: statusDescriptors, overlayPosition: 'left' }));
    };
    return NamespaceMTLSStatus;
}(React.Component));
export default NamespaceMTLSStatus;
//# sourceMappingURL=NamespaceMTLSStatus.js.map