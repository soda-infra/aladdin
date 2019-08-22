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
import { Button, Form, FormGroup, ListView, ListViewItem, TypeAheadSelect } from 'patternfly-react';
import MatchBuilder from './MatchBuilder';
import Matches from './Matches';
import { style } from 'typestyle';
import { PfColors } from '../../Pf/PfColors';
var routeStyle = style({
    marginTop: 15,
    // Yes, you are right, this is a CSS trick to adjust style on combined components
    $nest: {
        '.rbt-token .rbt-token-remove-button': {
            right: 5
        }
    }
});
var validationStyle = style({
    marginTop: 15,
    color: PfColors.Red100
});
var createStyle = style({
    marginTop: 105,
    marginLeft: 20
});
var RuleBuilder = /** @class */ (function (_super) {
    __extends(RuleBuilder, _super);
    function RuleBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RuleBuilder.prototype.render = function () {
        var _this = this;
        return (React.createElement(ListView, { className: 'match-routing-wizard' },
            React.createElement(ListViewItem, { key: 'match-builder', description: React.createElement(React.Fragment, null,
                    React.createElement(React.Fragment, null,
                        "Matches:",
                        React.createElement(MatchBuilder, __assign({}, this.props)),
                        React.createElement(Matches, __assign({}, this.props))),
                    React.createElement("div", { className: routeStyle },
                        "Routes:",
                        React.createElement(Form, null,
                            React.createElement(FormGroup, { validationState: this.props.isValid ? 'success' : 'error' },
                                React.createElement(TypeAheadSelect, { id: "workloads-selector", multiple: true, clearButton: true, placeholder: "Select workloads", labelKey: "workloadName", defaultSelected: this.props.routes, options: this.props.workloads.map(function (wk) { return wk.name; }), onChange: function (r) { return _this.props.onSelectRoutes(r); } })))),
                    !this.props.isValid && React.createElement("div", { className: validationStyle }, this.props.validationMsg)), 
                // tslint:disable
                actions: React.createElement(Button, { bsStyle: "primary", className: createStyle, disabled: !this.props.isValid, onClick: this.props.onAddRule }, "Add Rule") })));
    };
    return RuleBuilder;
}(React.Component));
export default RuleBuilder;
//# sourceMappingURL=RuleBuilder.js.map