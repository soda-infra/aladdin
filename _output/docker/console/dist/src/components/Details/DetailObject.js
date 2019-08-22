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
import Label from '../Label/Label';
import { Icon } from 'patternfly-react';
import './DetailObject.css';
var DetailObject = /** @class */ (function (_super) {
    __extends(DetailObject, _super);
    function DetailObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Pseudo unique ID generator used for keys
    // The recursive nature of buildList() requires uniques list keys.
    // Modified from https://gist.github.com/gordonbrander/2230317
    DetailObject.prototype.generateKey = function () {
        return ('key_' +
            Math.random()
                .toString(36)
                .substr(2, 9));
    };
    DetailObject.prototype.label = function (key, value) {
        return React.createElement(Label, { name: key, value: value });
    };
    DetailObject.prototype.checkLabel = function (name) {
        if (!this.props.labels) {
            return false;
        }
        return this.props.labels.indexOf(name) > -1;
    };
    DetailObject.prototype.canDisplay = function (name) {
        return this.props.exclude == null || !this.props.exclude.includes(name);
    };
    // buildList returns a recursive list of all items within value. It shows a validation
    // only for the first iteration (when depth is 0)
    DetailObject.prototype.buildList = function (name, value, isLabel, depth) {
        var _this = this;
        if (!this.canDisplay(name)) {
            return '';
        }
        var valueType = typeof value;
        if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
            return (React.createElement("div", { className: "label-collection" }, isLabel ? (this.label(name, value)) : (React.createElement("span", null,
                React.createElement("span", { className: "text-capitalize" }, name ? "[" + name + "]" : name),
                " ",
                value.toString()))));
        }
        var childrenList = [];
        var listKey = this.generateKey();
        var checkLabel = this.checkLabel(name);
        if (Array.isArray(value)) {
            value.forEach(function (v, i) {
                var vType = typeof v;
                if (vType === 'string' || vType === 'number' || vType === 'boolean') {
                    childrenList.push(React.createElement("li", { key: listKey + '_i' + i }, v));
                }
                else {
                    Object.keys(v).forEach(function (key, j) {
                        var childList = _this.buildList(key, v[key], checkLabel, depth + 1);
                        childrenList.push(React.createElement("li", { key: listKey + '_i' + i + '_j' + j }, childList));
                    });
                }
            });
        }
        else {
            Object.keys(value || {}).forEach(function (key, k) {
                var childList = _this.buildList(key, value[key], checkLabel, depth + 1);
                childrenList.push(React.createElement("li", { key: listKey + '_k' + k }, childList));
            });
        }
        return childrenList.length > 0 ? (React.createElement("div", null,
            React.createElement("strong", { className: "text-capitalize" }, name),
            depth === 0 && !!this.props.validation && this.props.validation.message ? (React.createElement("div", null,
                React.createElement("p", { style: { color: this.props.validation.color } },
                    React.createElement(Icon, { type: "pf", name: this.props.validation.icon }),
                    " ",
                    this.props.validation.message))) : (undefined),
            React.createElement("ul", { className: 'details' }, childrenList))) : ('');
    };
    DetailObject.prototype.render = function () {
        var findLabels = typeof this.props.labels !== 'undefined' && this.props.labels.length > 0;
        var objectList = this.buildList(this.props.name, this.props.detail, findLabels, 0);
        return React.createElement("div", null, objectList);
    };
    return DetailObject;
}(React.Component));
export default DetailObject;
//# sourceMappingURL=DetailObject.js.map