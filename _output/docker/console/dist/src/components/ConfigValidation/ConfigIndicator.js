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
import { PfColors } from '../Pf/PfColors';
import { Icon, OverlayTrigger, Popover } from 'patternfly-react';
import { style } from 'typestyle';
export var NOT_VALID = {
    name: 'Not Valid',
    color: PfColors.Red100,
    icon: 'error-circle-o'
};
export var WARNING = {
    name: 'Warning',
    color: PfColors.Gold100,
    icon: 'warning-triangle-o'
};
export var VALID = {
    name: 'Valid',
    color: PfColors.Green400,
    icon: 'ok'
};
export var SMALL_SIZE = '12px';
export var MEDIUM_SIZE = '18px';
export var BIG_SIZE = '35px';
export var INHERITED_SIZE = 'inherited';
var sizeMapper = new Map([
    ['small', SMALL_SIZE],
    ['medium', MEDIUM_SIZE],
    ['big', BIG_SIZE],
    ['inherited', INHERITED_SIZE]
]);
var tooltipListStyle = style({
    border: 0,
    padding: '0 0 0 0',
    margin: '0 0 0 0'
});
var ConfigIndicator = /** @class */ (function (_super) {
    __extends(ConfigIndicator, _super);
    function ConfigIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.numberOfChecks = function (type) {
            var numCheck = 0;
            _this.props.validations.forEach(function (validation) {
                if (validation.checks) {
                    numCheck += validation.checks.filter(function (i) { return i.severity === type; }).length;
                }
            });
            return numCheck;
        };
        _this.getTypeMessage = function (type) {
            var numberType = _this.numberOfChecks(type);
            return numberType > 0
                ? numberType > 1
                    ? numberType + " " + type + "s found"
                    : numberType + " " + type + " found"
                : undefined;
        };
        return _this;
    }
    ConfigIndicator.prototype.getValid = function () {
        if (this.props.validations.length === 0) {
            return WARNING;
        }
        var warnIssues = this.numberOfChecks('warning');
        var errIssues = this.numberOfChecks('error');
        return warnIssues === 0 && errIssues === 0 ? VALID : errIssues > 0 ? NOT_VALID : WARNING;
    };
    ConfigIndicator.prototype.size = function () {
        return sizeMapper.get(this.props.size || 'inherited') || INHERITED_SIZE;
    };
    ConfigIndicator.prototype.tooltipContent = function () {
        var numChecks = 0;
        this.props.validations.forEach(function (validation) {
            if (validation.checks) {
                numChecks += validation.checks.length;
            }
        });
        var issuesMessages = [];
        if (this.props.validations.length > 0) {
            if (numChecks === 0) {
                issuesMessages.push('No issues found');
            }
            else {
                var errMessage = this.getTypeMessage('error');
                if (errMessage) {
                    issuesMessages.push(errMessage);
                }
                var warnMessage = this.getTypeMessage('warning');
                if (warnMessage) {
                    issuesMessages.push(warnMessage);
                }
            }
        }
        else {
            issuesMessages.push('Expected validation results are missing');
        }
        var validationsInfo = [];
        var showDefinitions = this.props.definition && numChecks !== 0;
        if (showDefinitions) {
            this.props.validations.map(function (validation) {
                validationsInfo.push(React.createElement("div", { style: { paddingLeft: '10px' }, key: validation.name },
                    validation.name,
                    " : ",
                    validation.checks.map(function (check) { return check.message; }).join(',')));
            });
        }
        return (React.createElement(Popover, { id: this.props.id + '-config-validation', title: this.getValid().name, style: showDefinitions && { maxWidth: '80%', minWidth: '200px' } },
            React.createElement("div", { className: tooltipListStyle },
                issuesMessages.map(function (cat) { return (React.createElement("div", { className: tooltipListStyle, key: cat }, cat)); }),
                validationsInfo)));
    };
    ConfigIndicator.prototype.render = function () {
        return (React.createElement("span", null,
            React.createElement(OverlayTrigger, { placement: 'right', overlay: this.tooltipContent(), trigger: ['hover', 'focus'], rootClose: false },
                React.createElement("span", { style: { color: this.getValid().color } },
                    React.createElement(Icon, { type: "pf", name: this.getValid().icon, style: { fontSize: this.size() }, className: "health-icon", tabIndex: "0" })))));
    };
    return ConfigIndicator;
}(React.PureComponent));
export { ConfigIndicator };
//# sourceMappingURL=ConfigIndicator.js.map