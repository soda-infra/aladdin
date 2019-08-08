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
import { DropdownButton, MenuItem, MessageDialog } from 'patternfly-react';
import { style } from 'typestyle';
var msgDialogStyle = style({
    $nest: {
        '.modal-content': {
            fontSize: '14px'
        }
    }
});
var IstioActionDropdown = /** @class */ (function (_super) {
    __extends(IstioActionDropdown, _super);
    function IstioActionDropdown(props) {
        var _this = _super.call(this, props) || this;
        _this.onAction = function (key) {
            if (key === 'delete') {
                _this.setState({ showConfirmModal: true });
            }
        };
        _this.hideConfirmModal = function () {
            _this.setState({ showConfirmModal: false });
        };
        _this.onDelete = function () {
            _this.hideConfirmModal();
            _this.props.onDelete();
        };
        _this.state = { showConfirmModal: false };
        return _this;
    }
    IstioActionDropdown.prototype.render = function () {
        var objectName = this.props.objectKind ? this.props.objectKind : 'Istio object';
        return (React.createElement(React.Fragment, null,
            React.createElement(DropdownButton, { id: "actions", title: "Actions", onSelect: this.onAction, pullRight: true },
                React.createElement(MenuItem, { key: "delete", eventKey: "delete", disabled: !this.props.canDelete }, "Delete")),
            React.createElement(MessageDialog, { className: msgDialogStyle, show: this.state.showConfirmModal, primaryAction: this.onDelete, secondaryAction: this.hideConfirmModal, onHide: this.hideConfirmModal, primaryActionButtonContent: "Delete", secondaryActionButtonContent: "Cancel", primaryActionButtonBsStyle: "danger", title: "Confirm Delete", primaryContent: "Are you sure you want to delete the " + objectName + " '" + this.props.objectName + "'? ", secondaryContent: "It cannot be undone. Make sure this is something you really want to do!", accessibleName: "deleteConfirmationDialog", accessibleDescription: "deleteConfirmationDialogContent" })));
    };
    return IstioActionDropdown;
}(React.Component));
export default IstioActionDropdown;
//# sourceMappingURL=IstioActionsDropdown.js.map