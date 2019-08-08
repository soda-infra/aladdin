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
import ToolbarDropdown from '../ToolbarDropdown/ToolbarDropdown';
import { serverConfig } from '../../config/ServerConfig';
import * as React from 'react';
import { durationSelector } from '../../store/Selectors';
import { bindActionCreators } from 'redux';
import { UserSettingsActions } from '../../actions/UserSettingsActions';
import { connect } from 'react-redux';
import { HistoryManager, URLParam } from '../../app/History';
import history from '../../app/History';
var DurationDropdown = /** @class */ (function (_super) {
    __extends(DurationDropdown, _super);
    function DurationDropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DurationDropdown.prototype.render = function () {
        var _this = this;
        return (React.createElement(ToolbarDropdown, { id: this.props.id, disabled: this.props.disabled, handleSelect: function (key) { return _this.props.setDuration(Number(key)); }, value: this.props.duration, label: this.props.durations[this.props.duration], options: this.props.durations, tooltip: this.props.tooltip }));
    };
    return DurationDropdown;
}(React.Component));
export { DurationDropdown };
export var withDurations = function (DurationDropdownComponent) {
    return function (props) {
        return React.createElement(DurationDropdownComponent, __assign({ durations: serverConfig.durations }, props));
    };
};
export var withURLAwareness = function (DurationDropdownComponent) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(props) {
            var _this = _super.call(this, props) || this;
            var urlParams = new URLSearchParams(history.location.search);
            var urlDuration = HistoryManager.getDuration(urlParams);
            if (urlDuration !== undefined && urlDuration !== props.duration) {
                props.setDuration(urlDuration);
            }
            HistoryManager.setParam(URLParam.DURATION, String(_this.props.duration));
            return _this;
        }
        class_1.prototype.componentDidUpdate = function () {
            HistoryManager.setParam(URLParam.DURATION, String(this.props.duration));
        };
        class_1.prototype.render = function () {
            return React.createElement(DurationDropdownComponent, __assign({}, this.props));
        };
        return class_1;
    }(React.Component));
};
var mapStateToProps = function (state) { return ({
    duration: durationSelector(state)
}); };
var mapDispatchToProps = function (dispatch) {
    return {
        setDuration: bindActionCreators(UserSettingsActions.setDuration, dispatch)
    };
};
export var DurationDropdownContainer = connect(mapStateToProps, mapDispatchToProps)(withURLAwareness(withDurations(DurationDropdown)));
//# sourceMappingURL=DurationDropdown.js.map