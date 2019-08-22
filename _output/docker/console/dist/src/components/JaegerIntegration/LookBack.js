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
import * as React from 'react';
import { FormSelect, FormSelectOption } from '@patternfly/react-core';
import { config, serverConfig } from '../../config';
import { style } from 'typestyle';
var lookbackDropdown = style({ marginLeft: '-80px' });
var LookBack = /** @class */ (function (_super) {
    __extends(LookBack, _super);
    function LookBack() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lookBackOptions = __assign({}, serverConfig.durations, { 0: 'Custom Time Range' });
        _this.lookbackDefault = config.toolbar.defaultDuration;
        return _this;
    }
    LookBack.prototype.componentDidMount = function () {
        this.props.setLookback(String(this.props.lookback), null);
    };
    LookBack.prototype.render = function () {
        var _a = this.props, lookback = _a.lookback, setLookback = _a.setLookback;
        var options = [];
        for (var _i = 0, _b = Object.entries(this.lookBackOptions); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            options.push({ value: key, label: value, disabled: false });
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(FormSelect, { value: lookback !== undefined ? lookback : this.lookbackDefault, onChange: setLookback, "aria-label": "FormSelect lookback", className: lookbackDropdown }, options.map(function (option, index) { return (React.createElement(FormSelectOption, { isDisabled: option.disabled, key: index, value: option.value, label: option.label })); }))));
    };
    return LookBack;
}(React.PureComponent));
export { LookBack };
export default LookBack;
//# sourceMappingURL=LookBack.js.map