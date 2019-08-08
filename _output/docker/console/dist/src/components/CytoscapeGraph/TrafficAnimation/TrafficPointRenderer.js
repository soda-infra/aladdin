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
var TrafficPointRenderer = /** @class */ (function () {
    function TrafficPointRenderer() {
    }
    return TrafficPointRenderer;
}());
export { TrafficPointRenderer };
var TrafficPointCircleRenderer = /** @class */ (function (_super) {
    __extends(TrafficPointCircleRenderer, _super);
    function TrafficPointCircleRenderer(radio, backgroundColor, borderColor, lineWidth) {
        var _this = _super.call(this) || this;
        _this.radio = radio;
        _this.backgroundColor = backgroundColor;
        _this.borderColor = borderColor;
        _this.lineWidth = lineWidth;
        return _this;
    }
    TrafficPointCircleRenderer.prototype.render = function (context, point) {
        context.fillStyle = this.backgroundColor;
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.lineWidth;
        context.beginPath();
        context.arc(point.x, point.y, this.radio, 0, 2 * Math.PI, true);
        context.stroke();
        context.fill();
    };
    return TrafficPointCircleRenderer;
}(TrafficPointRenderer));
export { TrafficPointCircleRenderer };
var TrafficPointConcentricDiamondRenderer = /** @class */ (function (_super) {
    __extends(TrafficPointConcentricDiamondRenderer, _super);
    function TrafficPointConcentricDiamondRenderer(outerDiamond, innerDiamond) {
        var _this = _super.call(this) || this;
        _this.outerDiamond = outerDiamond;
        _this.innerDiamond = innerDiamond;
        return _this;
    }
    TrafficPointConcentricDiamondRenderer.diamondPath = function (context, point, diamond) {
        context.fillStyle = diamond.backgroundColor;
        context.strokeStyle = diamond.borderColor;
        context.lineWidth = diamond.lineWidth;
        context.beginPath();
        context.moveTo(point.x, point.y - diamond.radio);
        context.lineTo(point.x + diamond.radio, point.y);
        context.lineTo(point.x, point.y + diamond.radio);
        context.lineTo(point.x - diamond.radio, point.y);
        context.lineTo(point.x, point.y - diamond.radio);
        context.stroke();
        context.fill();
    };
    TrafficPointConcentricDiamondRenderer.prototype.render = function (context, point) {
        TrafficPointConcentricDiamondRenderer.diamondPath(context, point, this.outerDiamond);
        TrafficPointConcentricDiamondRenderer.diamondPath(context, point, this.innerDiamond);
    };
    return TrafficPointConcentricDiamondRenderer;
}(TrafficPointRenderer));
export { TrafficPointConcentricDiamondRenderer };
var Diamond = /** @class */ (function () {
    function Diamond(radio, backgroundColor, borderColor, lineWidth) {
        this.radio = radio;
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor;
        this.lineWidth = lineWidth;
    }
    return Diamond;
}());
export { Diamond };
//# sourceMappingURL=TrafficPointRenderer.js.map