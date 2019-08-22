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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import BootstrapSlider from './BootstrapSlider';
import { Button, Icon, ControlLabel, FormControl } from 'patternfly-react';
import Boundaries from './Boundaries';
import DropdownMenu from './DropdownMenu';
import { style } from 'typestyle';
import { hollowPinIcon, solidPinIcon } from '../../../config/Icons';
export var noop = Function.prototype;
var lockStyle = style({
    display: 'block',
    maxHeight: 18,
    padding: 2,
    width: '18px',
    height: '18px'
});
var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    function Slider(props) {
        var _this = _super.call(this, props) || this;
        _this.onSlide = function (value) {
            _this.setState({ value: value }, function () { return _this.props.onSlide(value); });
        };
        _this.onPlus = function () {
            var newValue = Number(_this.state.value || 0);
            _this.updateNewValue(newValue + 1);
        };
        _this.onMinus = function () {
            var newValue = Number(_this.state.value || 0);
            _this.updateNewValue(newValue - 1);
        };
        _this.onInputChange = function (event) {
            var newValue = Number(event.target.value || 0);
            _this.updateNewValue(newValue);
        };
        _this.updateNewValue = function (newValue) {
            if (newValue > _this.props.max) {
                newValue = _this.props.max;
            }
            if (newValue < 0) {
                newValue = 0;
            }
            _this.setState({ value: newValue }, function () { return _this.props.onSlide(newValue); });
        };
        _this.onFormatChange = function (format) {
            _this.setState({ tooltipFormat: format });
        };
        _this.formatter = function (value) { return value + " " + _this.state.tooltipFormat; };
        _this.state = {
            value: _this.props.value,
            tooltipFormat: (_this.props.dropdownList && _this.props.dropdownList[0]) || _this.props.inputFormat
        };
        return _this;
    }
    Slider.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.value !== this.props.value || this.state.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    };
    Slider.prototype.render = function () {
        var _this = this;
        var label = null;
        var sliderClass = 'col-xs-12 col-sm-12 col-md-12';
        var labelClass = 'col-xs-2 col-sm-2 col-md-2';
        if (this.props.label || this.props.icon) {
            sliderClass = 'col-xs-10 col-sm-10 col-md-10';
            label = this.props.icon ? (React.createElement(Icon, __assign({ className: labelClass }, this.props.icon))) : (React.createElement(ControlLabel, { htmlFor: this.props.id, bsClass: labelClass }, this.props.label));
        }
        var formatElement;
        if (this.props.inputFormat) {
            formatElement = React.createElement("span", null, this.props.inputFormat);
        }
        if (this.props.dropdownList) {
            formatElement = (React.createElement(DropdownMenu, __assign({}, this.props, { onFormatChange: this.onFormatChange, title: this.state.tooltipFormat })));
        }
        var leftButtonStyle = { marginLeft: 5, marginRight: 0 };
        var leftButton = this.props.input && (React.createElement(Button, { bsSize: "xsmall", style: leftButtonStyle, onClick: function () { return _this.onMinus(); }, disabled: this.props.locked },
            React.createElement(Icon, { type: "fa", name: "minus" })));
        var inputStyle = {
            width: '3.5em',
            textAlign: 'center',
            marginLeft: 0,
            marginRight: 0
        };
        var inputElement = this.props.input && (React.createElement(FormControl, { bsClass: "slider-input-pf", type: "text", value: this.state.value, 
            // Trick to fix InputText when slider is locked and refreshed/resized
            style: inputStyle, onChange: this.onInputChange, disabled: this.props.locked }));
        var rightButtonStyle = { marginLeft: 0, marginRight: 5 };
        var rightButton = this.props.input && (React.createElement(Button, { bsSize: "xsmall", style: rightButtonStyle, onClick: function () { return _this.onPlus(); }, disabled: this.props.locked },
            React.createElement(Icon, { type: "fa", name: "plus" })));
        var pinButtonStyle = { height: '23px' };
        var lockElement = (React.createElement(Button, { bsSize: "xsmall", style: pinButtonStyle, onClick: function () { return _this.props.onLock(!_this.props.locked); } }, this.props.locked ? (React.createElement("img", { src: solidPinIcon, className: lockStyle })) : (React.createElement("img", { src: hollowPinIcon, className: lockStyle }))));
        var BSSlider = (React.createElement(BootstrapSlider, __assign({}, this.props, { locked: this.props.locked, formatter: this.formatter, value: this.state.value, onSlide: this.onSlide })));
        return (React.createElement("div", null,
            label,
            React.createElement("div", { className: sliderClass },
                React.createElement(Boundaries, __assign({ slider: BSSlider }, this.props),
                    leftButton,
                    inputElement,
                    rightButton,
                    formatElement,
                    this.props.showLock && lockElement))));
    };
    Slider.defaultProps = {
        id: null,
        orientation: 'horizontal',
        min: 0,
        max: 100,
        maxLimit: 100,
        value: 0,
        step: 1,
        toolTip: false,
        onSlide: noop,
        label: null,
        labelClass: null,
        input: false,
        sliderClass: null,
        icon: null,
        dropdownList: null,
        inputFormat: '',
        locked: false,
        showLock: true,
        onLock: noop
    };
    return Slider;
}(React.Component));
export default Slider;
//# sourceMappingURL=Slider.js.map