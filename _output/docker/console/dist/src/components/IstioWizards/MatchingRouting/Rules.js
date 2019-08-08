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
import { Button, DropdownKebab, ListView, ListViewIcon, ListViewItem, MenuItem } from 'patternfly-react';
import { style } from 'typestyle';
import { PfColors } from '../../Pf/PfColors';
export var MOVE_TYPE;
(function (MOVE_TYPE) {
    MOVE_TYPE[MOVE_TYPE["UP"] = 0] = "UP";
    MOVE_TYPE[MOVE_TYPE["DOWN"] = 1] = "DOWN";
})(MOVE_TYPE || (MOVE_TYPE = {}));
var matchValueStyle = style({
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});
var ruleItemStyle = style({
    $nest: {
        '.list-group-item-heading': {
            flexBasis: 'calc(50% - 20px)',
            width: 'calc(50% - 20px)'
        },
        '.list-view-pf-actions': {
            zIndex: 10
        }
    }
});
var routeToStyle = style({
    marginLeft: 10
});
var validationStyle = style({
    marginTop: 15,
    color: PfColors.Red100
});
var vsIconType = 'fa';
var vsIconName = 'code-fork';
var wkIconType = 'pf';
var wkIconName = 'bundle';
var Rules = /** @class */ (function (_super) {
    __extends(Rules, _super);
    function Rules(props) {
        var _this = _super.call(this, props) || this;
        _this.matchAllIndex = function (rules) {
            var matchAll = -1;
            for (var index = 0; index < rules.length; index++) {
                var rule = rules[index];
                if (rule.matches.length === 0) {
                    matchAll = index;
                    break;
                }
            }
            return matchAll;
        };
        return _this;
    }
    Rules.prototype.render = function () {
        var _this = this;
        var ruleItems = [];
        var isValid = true;
        var matchAll = this.matchAllIndex(this.props.rules);
        var _loop_1 = function (index) {
            var rule = this_1.props.rules[index];
            isValid = matchAll === -1 || index <= matchAll;
            var matches = rule.matches.map(function (map, i) {
                return (React.createElement("div", { key: 'match-' + map + '-' + i, className: matchValueStyle }, map));
            });
            var ruleActions = (React.createElement(React.Fragment, null,
                React.createElement(Button, { onClick: function () { return _this.props.onRemoveRule(index); } }, "Remove"),
                this_1.props.rules.length > 1 && (React.createElement(DropdownKebab, { key: 'move-rule-actions-' + index, id: 'move-rule-actions-' + index, pullRight: true },
                    index > 0 && React.createElement(MenuItem, { onClick: function () { return _this.props.onMoveRule(index, MOVE_TYPE.UP); } }, "Move Up"),
                    index + 1 < this_1.props.rules.length && (React.createElement(MenuItem, { onClick: function () { return _this.props.onMoveRule(index, MOVE_TYPE.DOWN); } }, "Move Down"))))));
            ruleItems.push(React.createElement(ListViewItem, { key: 'match-rule-' + index, className: ruleItemStyle, leftContent: React.createElement(ListViewIcon, { type: vsIconType, name: vsIconName }), heading: React.createElement(React.Fragment, null,
                    "Matches:",
                    rule.matches.length === 0 && React.createElement("div", { className: matchValueStyle }, "Any request"),
                    rule.matches.length !== 0 && matches), description: React.createElement(React.Fragment, null,
                    React.createElement("b", null, "Route to:"),
                    rule.routes.map(function (route) { return (React.createElement("div", { key: 'route-to-' + route },
                        React.createElement("span", null,
                            React.createElement(ListViewIcon, { type: wkIconType, name: wkIconName }),
                            React.createElement("span", { className: routeToStyle }, route)))); }),
                    !isValid && (React.createElement("div", { className: validationStyle },
                        "Match 'Any request' is defined in a previous rule.",
                        React.createElement("br", null),
                        "This rule is not accessible."))), actions: ruleActions }));
        };
        var this_1 = this;
        for (var index = 0; index < this.props.rules.length; index++) {
            _loop_1(index);
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(ListView, null, ruleItems)));
    };
    return Rules;
}(React.Component));
export default Rules;
//# sourceMappingURL=Rules.js.map