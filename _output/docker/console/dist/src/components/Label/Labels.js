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
import Label from './Label';
import { style } from 'typestyle';
var SHOW_MORE_TRESHOLD = 3;
var linkStyle = style({
    float: 'left',
    margin: '7px 2px 2px 3px',
    fontSize: '0.8rem'
});
var Labels = /** @class */ (function (_super) {
    __extends(Labels, _super);
    function Labels(props, state) {
        var _this = _super.call(this, props, state) || this;
        _this.expandLabels = function () {
            _this.setState({ expanded: true });
        };
        _this.state = {
            expanded: false
        };
        return _this;
    }
    Labels.prototype.labelKeys = function () {
        return Object.keys(this.props.labels || {});
    };
    Labels.prototype.hasLabels = function () {
        return this.labelKeys().length > 0;
    };
    Labels.prototype.hasManyLabels = function () {
        return this.labelKeys().length > SHOW_MORE_TRESHOLD;
    };
    Labels.prototype.showItem = function (i) {
        return this.state.expanded || !this.hasManyLabels() || i < SHOW_MORE_TRESHOLD;
    };
    Labels.prototype.renderMoreLabelsLink = function () {
        if (this.hasManyLabels() && !this.state.expanded) {
            return (React.createElement("a", { className: linkStyle, onClick: this.expandLabels },
                ' ',
                "More labels..."));
        }
        return null;
    };
    Labels.prototype.renderLabels = function () {
        var _this = this;
        return this.labelKeys().map(function (key, i) {
            var hideClass = _this.showItem(i) ? '' : 'hide';
            return (React.createElement("div", { key: 'label_' + i, className: hideClass },
                React.createElement(Label, { key: 'label_' + i, name: key, value: _this.props.labels ? _this.props.labels[key] : '' })));
        });
    };
    Labels.prototype.renderEmptyLabels = function () {
        return React.createElement("span", null, " No labels ");
    };
    Labels.prototype.render = function () {
        if (this.hasLabels()) {
            return [this.renderLabels(), this.renderMoreLabelsLink()];
        }
        else {
            return this.renderEmptyLabels();
        }
    };
    return Labels;
}(React.Component));
export default Labels;
//# sourceMappingURL=Labels.js.map