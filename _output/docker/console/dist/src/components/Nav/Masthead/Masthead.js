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
import PfSpinner from '../../PfSpinner';
import { Toolbar as ToolbarNext, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import UserDropdown from './UserDropdown';
import { default as MeshMTLSStatus } from '../../../components/MTls/MeshMTLSStatus';
import HelpDropdown from './HelpDropdown';
import MessageCenterTriggerContainer from '../../../components/MessageCenter/MessageCenterTrigger';
var Masthead = /** @class */ (function (_super) {
    __extends(Masthead, _super);
    function Masthead() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Masthead.prototype.render = function () {
        return (React.createElement(ToolbarNext, null,
            React.createElement(ToolbarGroup, null,
                React.createElement(PfSpinner, null)),
            React.createElement(ToolbarGroup, null,
                React.createElement(ToolbarItem, null,
                    React.createElement(MeshMTLSStatus, null)),
                React.createElement(ToolbarItem, null,
                    React.createElement(MessageCenterTriggerContainer, null)),
                React.createElement(ToolbarItem, null,
                    React.createElement(HelpDropdown, null)),
                React.createElement(ToolbarItem, null,
                    React.createElement(UserDropdown, null)))));
    };
    return Masthead;
}(React.Component));
export default Masthead;
//# sourceMappingURL=Masthead.js.map