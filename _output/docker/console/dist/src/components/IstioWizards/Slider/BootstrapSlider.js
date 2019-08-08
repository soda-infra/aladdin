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
import Slider from 'bootstrap-slider-without-jquery';
var orientation = {
    horizontal: 'horizontal',
    vertical: 'vertical'
};
var BootstrapSlider = /** @class */ (function (_super) {
    __extends(BootstrapSlider, _super);
    function BootstrapSlider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootstrapSlider.prototype.componentDidMount = function () {
        var _this = this;
        this.slider = new Slider(this.sliderDiv, __assign({}, this.props));
        var onSlide = function (value) {
            value = value >= _this.props.max ? _this.props.max : value;
            _this.props.onSlide(value);
            _this.slider.setValue(value);
        };
        this.slider.on('slide', onSlide);
        this.slider.on('slideStop', onSlide);
        this.slider.setAttribute('min', this.props.min);
        this.slider.setAttribute('max', this.props.maxLimit);
        if (this.props.locked) {
            this.slider.disable();
        }
        else {
            this.slider.enable();
        }
    };
    // Instead of rendering the slider element again and again,
    // we took advantage of the bootstrap-slider library
    // and only update the new value or format when new props arrive.
    BootstrapSlider.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        if (nextProps.locked) {
            this.slider.disable();
        }
        else {
            this.slider.enable();
        }
        if (this.props.min !== nextProps.min ||
            this.props.max !== nextProps.max ||
            this.props.maxLimit !== nextProps.maxLimit) {
            this.slider.setAttribute('min', nextProps.min);
            this.slider.setAttribute('max', nextProps.maxLimit);
            this.slider.refresh();
            var onSlide = function (value) {
                value = value >= _this.props.max ? _this.props.max : value;
                _this.props.onSlide(value);
                _this.slider.setValue(value);
            };
            this.slider.on('slide', onSlide);
            this.slider.on('slideStop', onSlide);
        }
        this.slider.setValue(nextProps.value);
        this.slider.setAttribute('formatter', nextProps.formatter);
        // Adjust the tooltip to "sit" ontop of the slider's handle. #LibraryBug
        // check
        if (this.props && this.props.orientation === orientation.horizontal) {
            this.slider.tooltip.style.marginLeft = "-" + this.slider.tooltip.offsetWidth / 2 + "px";
            if (this.props.ticks_labels && this.slider.tickLabelContainer) {
                this.slider.tickLabelContainer.style.marginTop = '0px';
            }
        }
        else {
            this.slider.tooltip.style.marginTop = "-" + this.slider.tooltip.offsetHeight / 2 + "px";
        }
    };
    BootstrapSlider.prototype.render = function () {
        var _this = this;
        return (React.createElement("input", { className: "slider-pf", type: "range", ref: function (input) {
                _this.sliderDiv = input;
            } }));
    };
    BootstrapSlider.defaultProps = {
        formatter: function (value) { return value; },
        onSlide: function (event) { return event; },
        orientation: 'horizontal',
        ticks_labels: [],
        locked: false
    };
    return BootstrapSlider;
}(React.Component));
export default BootstrapSlider;
//# sourceMappingURL=BootstrapSlider.js.map