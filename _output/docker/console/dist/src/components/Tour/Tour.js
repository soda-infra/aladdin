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
import { Button, Icon } from 'patternfly-react';
import { PfColors } from '../Pf/PfColors';
import ReactResizeDetector from 'react-resize-detector';
import { style } from 'typestyle';
// We have to import it like this, because current index.d.ts file is broken for this component.
var Floater = require('react-floater').default;
export var StepPlacement;
(function (StepPlacement) {
    StepPlacement["AUTO"] = "auto";
    StepPlacement["TOP"] = "top";
    StepPlacement["TOP_START"] = "top-start";
    StepPlacement["TOP_END"] = "top-end";
    StepPlacement["RIGHT"] = "right";
    StepPlacement["RIGHT_START"] = "right-start";
    StepPlacement["RIGHT_END"] = "right-end";
    StepPlacement["BOTTOM"] = "bottom";
    StepPlacement["BOTTOM_START"] = "bottom-start";
    StepPlacement["BOTTOM_END"] = "bottom-end";
    StepPlacement["LEFT"] = "left";
    StepPlacement["LEFT_START"] = "left-start";
    StepPlacement["LEFT_END"] = "left-end";
})(StepPlacement || (StepPlacement = {}));
var defaults = {
    placement: StepPlacement.AUTO,
    offset: 15
};
var buttonTextStyle = style({ fontSize: '0.9em' });
var stepNumberStyle = style({
    borderRadius: '20px',
    backgroundColor: PfColors.Blue300,
    padding: '2px 6px',
    marginRight: '10px',
    color: PfColors.White
});
var modalContent = style({ width: '25em' });
var modalHeader = style({ padding: '5px 10px' });
var modalBody = style({ fontSize: '0.95em', padding: '10px 15px' });
var modalFooter = style({ paddingTop: 0, marginTop: 0 });
var BackButton = function (props) {
    if (props.currentStep === 0) {
        return null;
    }
    return (React.createElement(Button, { className: buttonTextStyle, onClick: props.onBack },
        React.createElement(Icon, { type: "fa", name: "angle-left" }),
        " Back"));
};
var NextButton = function (props) {
    return (React.createElement(Button, { className: buttonTextStyle, bsStyle: "primary", onClick: props.onNext }, props.isLast ? ('Done') : (React.createElement(React.Fragment, null,
        "Next ",
        React.createElement(Icon, { type: "fa", name: "angle-right" })))));
};
var StepNumber = function (stepNumber) {
    return React.createElement("span", { className: stepNumberStyle }, stepNumber);
};
var TourModal = function (props, step) {
    return function () {
        return (React.createElement("div", { className: "modal-content " + modalContent },
            React.createElement("div", { className: "modal-header " + modalHeader },
                StepNumber(props.stepNumber),
                React.createElement("span", { className: "modal-title" }, step.name),
                React.createElement(Button, { className: "close", bsClass: "default", onClick: props.onClose },
                    React.createElement(Icon, { title: "Close", type: "pf", name: "close" }))),
            React.createElement("div", { className: "modal-body " + modalBody }, step.description),
            React.createElement("div", { className: "modal-footer " + modalFooter },
                BackButton(props),
                NextButton(props))));
    };
};
var Tour = /** @class */ (function (_super) {
    __extends(Tour, _super);
    function Tour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.popperRef = null;
        _this.onResize = function () {
            if (_this.popperRef) {
                _this.popperRef.instance.scheduleUpdate();
            }
        };
        return _this;
    }
    Tour.prototype.render = function () {
        var _this = this;
        if (!this.props.show) {
            return null;
        }
        var step = this.props.steps[this.props.currentStep];
        return (React.createElement(React.Fragment, null,
            React.createElement(ReactResizeDetector, { refreshMode: 'debounce', refreshRate: 100, skipOnMount: true, handleWidth: true, handleHeight: true, onResize: this.onResize }),
            React.createElement(Floater, { getPopper: function (popper) {
                    _this.popperRef = popper;
                }, key: this.props.currentStep, disableAnimation: true, target: step.target, component: TourModal(this.props, step), open: true, placement: step.placement ? step.placement : defaults.placement, offset: step.offset !== undefined ? step.offset : defaults.offset })));
    };
    return Tour;
}(React.PureComponent));
export default Tour;
//# sourceMappingURL=Tour.js.map