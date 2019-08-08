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
import Draggable from 'react-draggable';
import { style } from 'typestyle';
import { Button, Icon } from 'patternfly-react';
// The content of the graph legend is taken from the image in src/assets/img/graph-legend.svg
// The size of content's dialog is the same as the image (it is fetched dynamically on this code)
// Any image format that can be displayed by a browser could be used.
var graphLegendImage = require('../../assets/img/graph-legend.svg');
var graphmTLSEnabledLegendImage = require('../../assets/img/graph-mtls-legend.svg');
var GraphLegend = /** @class */ (function (_super) {
    __extends(GraphLegend, _super);
    function GraphLegend(props) {
        var _this = _super.call(this, props) || this;
        _this.getLegendImage = function () {
            return _this.props.isMTLSEnabled ? graphmTLSEnabledLegendImage : graphLegendImage;
        };
        _this.state = {
            width: 0,
            height: 0
        };
        var image = new Image();
        image.onload = function () {
            _this.setState({
                width: image.width,
                height: image.height
            });
        };
        image.src = _this.getLegendImage();
        return _this;
    }
    GraphLegend.prototype.render = function () {
        if (this.state.height === 0 && this.state.width === 0) {
            return null;
        }
        var parentClassName = this.props.className ? this.props.className : '';
        var width = 'calc(100vw - 50px - var(--pf-c-page__sidebar--md--Width))'; // 50px prevents full coverage
        var maxWidth = this.state.width + 2; // +2 includes border and prevents scroll
        var legendImageStyle = style({
            backgroundImage: "url(" + this.getLegendImage() + ")",
            padding: 0
        });
        var contentStyle = style({
            width: width,
            maxWidth: maxWidth,
            overflowX: 'auto',
            overflowY: 'auto'
        });
        var headerStyle = style({
            width: this.state.width
        });
        var bodyStyle = style({
            width: this.state.width,
            height: this.state.height
        });
        return (React.createElement(Draggable, { bounds: "#root" },
            React.createElement("div", { className: "modal-content " + parentClassName + " " + contentStyle },
                React.createElement("div", { className: "modal-header " + headerStyle },
                    React.createElement(Button, { className: "close", bsClass: "", onClick: this.props.closeLegend },
                        React.createElement(Icon, { title: "Close", type: "pf", name: "close" })),
                    React.createElement("span", { className: "modal-title" }, "Graph Legend")),
                React.createElement("div", { className: "modal-body " + legendImageStyle + " " + bodyStyle }))));
    };
    return GraphLegend;
}(React.Component));
export default GraphLegend;
//# sourceMappingURL=GraphLegend.js.map