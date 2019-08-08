// Clone of Slider component to workaround issue https://github.com/patternfly/patternfly-react/issues/1221
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
import { Dropdown, MenuItem } from 'patternfly-react';
var DropdownMenu = /** @class */ (function (_super) {
    __extends(DropdownMenu, _super);
    function DropdownMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropdownMenu.prototype.render = function () {
        var _a = this.props, dropup = _a.dropup, dropdownList = _a.dropdownList, onFormatChange = _a.onFormatChange, title = _a.title;
        var menuItems = dropdownList.map(function (item, index) { return (React.createElement(MenuItem, { bsClass: "slider_menuitem", onClick: function (event) { return onFormatChange(event.target.text); }, key: index, value: item }, item)); });
        return (React.createElement(Dropdown, { id: "slider_dropdown", dropup: dropup, pullRight: true },
            React.createElement(Dropdown.Toggle, null,
                React.createElement("span", null, title || dropdownList[0])),
            React.createElement(Dropdown.Menu, null, menuItems)));
    };
    DropdownMenu.defaultProps = {
        dropup: false,
        dropdownList: null,
        onFormatChange: null,
        title: null
    };
    return DropdownMenu;
}(React.Component));
export default DropdownMenu;
//# sourceMappingURL=DropdownMenu.js.map