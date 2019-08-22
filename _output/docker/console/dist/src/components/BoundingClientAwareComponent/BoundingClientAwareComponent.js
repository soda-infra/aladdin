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
export var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["VIEWPORT_HEIGHT_MINUS_TOP"] = 0] = "VIEWPORT_HEIGHT_MINUS_TOP";
})(PropertyType || (PropertyType = {}));
export var vhMinusTop = function (rect, offset) { return "calc(100vh - " + (rect.top + offset) + "px)"; };
// Computes the BoundingClientRect of the container, this helps to calculate the remaining height without
// going further off the screen and without having to fix the value in the code.
// Note: This does re-compute when there is a change in this component, but external changes are not yet
// managed, that might require to observe the offsets, for our current use case this seems OK, as the top
// headers doesn't change in height.
var BoundingClientAwareComponent = /** @class */ (function (_super) {
    __extends(BoundingClientAwareComponent, _super);
    function BoundingClientAwareComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.containerRef = React.createRef();
        _this.state = {};
        return _this;
    }
    BoundingClientAwareComponent.prototype.componentDidMount = function () {
        this.handleComponentUpdated();
    };
    BoundingClientAwareComponent.prototype.componentDidUpdate = function () {
        this.handleComponentUpdated();
    };
    BoundingClientAwareComponent.prototype.handleComponentUpdated = function () {
        var rect = this.containerRef.current.getBoundingClientRect();
        var stateUpdate = {};
        if (this.props.maxHeight) {
            var updatedValue = this.processProperty(this.props.maxHeight, rect);
            if (updatedValue !== this.state.maxHeight) {
                stateUpdate.maxHeight = updatedValue;
            }
        }
        if (Object.values(stateUpdate).length > 0) {
            this.setState(stateUpdate);
        }
        if (this.props.handleBoundingClientRect) {
            this.props.handleBoundingClientRect(rect);
        }
    };
    BoundingClientAwareComponent.prototype.render = function () {
        var style = {
            maxHeight: this.state.maxHeight
        };
        return (React.createElement("div", { className: this.props.className, style: style, ref: this.containerRef }, this.props.children));
    };
    BoundingClientAwareComponent.prototype.processProperty = function (property, rect) {
        var margin = property.margin ? property.margin : 0;
        switch (property.type) {
            case PropertyType.VIEWPORT_HEIGHT_MINUS_TOP:
                return vhMinusTop(rect, margin);
            default:
                throw Error('Undefined property type:' + property.type);
        }
    };
    return BoundingClientAwareComponent;
}(React.Component));
export { BoundingClientAwareComponent };
//# sourceMappingURL=BoundingClientAwareComponent.js.map