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
import { DropdownButton, MenuItem, OverlayTrigger, Tooltip } from 'patternfly-react';
var ToolbarDropdown = /** @class */ (function (_super) {
    __extends(ToolbarDropdown, _super);
    function ToolbarDropdown(props) {
        var _this = _super.call(this, props) || this;
        _this.onKeyChanged = function (key) {
            _this.setState({ currentValue: key, currentName: _this.props.options[key] });
            var nameOrKey = _this.props.useName ? _this.props.options[key] : key;
            _this.props.handleSelect(nameOrKey);
        };
        _this.state = {
            currentValue: props.value || props.initialValue,
            currentName: props.label || props.initialLabel
        };
        return _this;
    }
    ToolbarDropdown.prototype.render = function () {
        var _this = this;
        var dropdownButton = (React.createElement(DropdownButton, { disabled: this.props.disabled, title: this.props.label || this.state.currentName, onSelect: this.onKeyChanged, id: this.props.id, onToggle: function (isOpen) { return _this.props.onToggle && _this.props.onToggle(isOpen); } }, Object.keys(this.props.options).map(function (key) { return (React.createElement(MenuItem, { key: key, active: key === (_this.props.value || _this.state.currentValue), eventKey: key }, _this.props.options[key])); })));
        return (React.createElement(React.Fragment, null,
            this.props.nameDropdown && React.createElement("label", { style: { paddingRight: '0.5em' } }, this.props.nameDropdown),
            this.props.tooltip ? (React.createElement(OverlayTrigger, { key: 'ot-' + this.props.id, placement: "top", trigger: ['hover', 'focus'], delayShow: 1000, overlay: React.createElement(Tooltip, { id: 'tt-' + this.props.id }, this.props.tooltip) }, dropdownButton)) : (dropdownButton)));
    };
    return ToolbarDropdown;
}(React.Component));
export { ToolbarDropdown };
export default ToolbarDropdown;
//# sourceMappingURL=ToolbarDropdown.js.map