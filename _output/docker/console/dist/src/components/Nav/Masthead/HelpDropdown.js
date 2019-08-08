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
import AboutUIModal from '../../About/AboutUIModal';
import DebugInformationContainer from '../../../components/DebugInformation/DebugInformation';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons/';
import { connect } from 'react-redux';
var HelpDropdownContainer = /** @class */ (function (_super) {
    __extends(HelpDropdownContainer, _super);
    function HelpDropdownContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.openAbout = function (e) {
            e.preventDefault();
            _this.about.current.open();
        };
        _this.openDebugInformation = function (e) {
            e.preventDefault();
            // Using wrapped component, so we have to get the wrappedInstance
            _this.debugInformation.current.getWrappedInstance().open();
        };
        _this.onDropdownToggle = function (isDropdownOpen) {
            _this.setState({
                isDropdownOpen: isDropdownOpen
            });
        };
        _this.onDropdownSelect = function () {
            _this.setState({
                isDropdownOpen: !_this.state.isDropdownOpen
            });
        };
        _this.state = { isDropdownOpen: false };
        _this.about = React.createRef();
        _this.debugInformation = React.createRef();
        return _this;
    }
    HelpDropdownContainer.prototype.render = function () {
        var isDropdownOpen = this.state.isDropdownOpen;
        var Toggle = (React.createElement(DropdownToggle, { onToggle: this.onDropdownToggle, iconComponent: null },
            React.createElement(QuestionCircleIcon, null)));
        return (React.createElement(React.Fragment, null,
            React.createElement(AboutUIModal, { ref: this.about, status: this.props.status, components: this.props.components }),
            React.createElement(DebugInformationContainer, { ref: this.debugInformation }),
            React.createElement(Dropdown, { isPlain: true, position: "right", onSelect: this.onDropdownSelect, isOpen: isDropdownOpen, toggle: Toggle, dropdownItems: [
                    React.createElement(DropdownItem, { component: 'span', key: 'view_debug_info', onClick: this.openDebugInformation }, "View Debug Info"),
                    React.createElement(DropdownItem, { component: 'span', key: 'view_about_info', onClick: this.openAbout }, "About")
                ] })));
    };
    return HelpDropdownContainer;
}(React.Component));
var mapStateToProps = function (state) { return ({
    status: state.statusState.status,
    components: state.statusState.components,
    warningMessages: state.statusState.warningMessages
}); };
var HelpDropdown = connect(mapStateToProps)(HelpDropdownContainer);
export default HelpDropdown;
//# sourceMappingURL=HelpDropdown.js.map