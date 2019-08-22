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
import Tour from './Tour';
var Direction;
(function (Direction) {
    Direction[Direction["NEXT"] = 0] = "NEXT";
    Direction[Direction["BACK"] = 1] = "BACK";
})(Direction || (Direction = {}));
var StatefulTour = /** @class */ (function (_super) {
    __extends(StatefulTour, _super);
    function StatefulTour(props) {
        var _this = _super.call(this, props) || this;
        _this.onNext = function () {
            var isLast = false;
            _this.setState(function (prevState) {
                isLast = prevState.currentStep + 1 === _this.props.steps.length;
                if (isLast) {
                    _this.props.onClose();
                    return null;
                }
                else {
                    return { currentStep: prevState.currentStep + 1, direction: Direction.NEXT };
                }
            });
        };
        _this.onBack = function () {
            _this.setState(function (prevState) {
                return { currentStep: prevState.currentStep - 1, direction: Direction.BACK };
            });
        };
        _this.state = {
            currentStep: 0,
            direction: Direction.NEXT
        };
        return _this;
    }
    StatefulTour.prototype.componentDidUpdate = function (prevProps) {
        if (!this.props.isOpen) {
            return;
        }
        if (!prevProps.isOpen) {
            this.setState(function () {
                return {
                    currentStep: 0,
                    direction: Direction.NEXT
                };
            });
            return;
        }
        var step = this.props.steps[this.state.currentStep];
        if (!this.isStepVisible(step)) {
            if (this.state.direction === Direction.NEXT) {
                this.onNext();
            }
            else {
                this.onBack();
            }
        }
    };
    StatefulTour.prototype.isStepVisible = function (step) {
        var element = document.querySelector(step.target);
        if (element && step.isVisible) {
            return step.isVisible(element);
        }
        return !!element;
    };
    StatefulTour.prototype.isLast = function () {
        for (var i = this.state.currentStep + 1; i < this.props.steps.length; ++i) {
            if (this.isStepVisible(this.props.steps[i])) {
                return false;
            }
        }
        return true;
    };
    StatefulTour.prototype.render = function () {
        var _this = this;
        // Determine de step number depending if the elements are available or not.
        var stepNumber = this.props.steps.slice(0, this.state.currentStep).reduce(function (count, step) {
            if (_this.isStepVisible(step)) {
                return count + 1;
            }
            return count;
        }, 1);
        return (React.createElement(Tour, { onNext: this.onNext, onClose: this.props.onClose, onBack: this.onBack, currentStep: this.state.currentStep, stepNumber: stepNumber, show: this.props.isOpen, steps: this.props.steps, isLast: this.isLast() }, this.props.children));
    };
    return StatefulTour;
}(React.Component));
export default StatefulTour;
//# sourceMappingURL=StatefulTour.js.map