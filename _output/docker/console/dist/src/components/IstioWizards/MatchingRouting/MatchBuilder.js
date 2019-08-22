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
var _a;
import * as React from 'react';
import { Button, DropdownButton, Form, FormControl, FormGroup, MenuItem } from 'patternfly-react';
import { style } from 'typestyle';
export var HEADERS = 'headers';
export var URI = 'uri';
export var SCHEME = 'scheme';
export var METHOD = 'method';
export var AUTHORITY = 'authority';
var matchOptions = [HEADERS, URI, SCHEME, METHOD, AUTHORITY];
export var EXACT = 'exact';
export var PREFIX = 'prefix';
export var REGEX = 'regex';
var opOptions = [EXACT, PREFIX, REGEX];
var placeholderText = (_a = {},
    _a[HEADERS] = 'Header value...',
    _a[URI] = 'Uri value...',
    _a[SCHEME] = 'Scheme value...',
    _a[METHOD] = 'Method value...',
    _a[AUTHORITY] = 'Authority value...',
    _a);
var matchStyle = style({
    marginLeft: 20
});
var MatchBuilder = /** @class */ (function (_super) {
    __extends(MatchBuilder, _super);
    function MatchBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatchBuilder.prototype.render = function () {
        var _this = this;
        var matchItems = matchOptions.map(function (mode, index) { return (React.createElement(MenuItem, { key: mode + '-' + index, eventKey: mode, active: mode === _this.props.category }, mode)); });
        var opItems = opOptions.map(function (op, index) { return (React.createElement(MenuItem, { key: op + '-' + index, eventKey: op, active: op === _this.props.operator }, op)); });
        return (React.createElement(Form, { inline: true },
            React.createElement(FormGroup, { validationState: this.props.isValid ? 'success' : 'error' },
                React.createElement(DropdownButton, { bsStyle: "default", title: this.props.category, id: "match-dropdown", onSelect: this.props.onSelectCategory }, matchItems),
                this.props.category === HEADERS && (React.createElement(FormControl, { type: "text", id: "header-name-text", placeholder: 'Header name...', value: this.props.headerName, onChange: this.props.onHeaderNameChange })),
                React.createElement(DropdownButton, { bsStyle: "default", title: this.props.operator, id: "operator-dropdown", onSelect: this.props.onSelectOperator }, opItems),
                React.createElement(FormControl, { type: "text", id: "header-value-text", placeholder: placeholderText[this.props.category], value: this.props.matchValue, onChange: this.props.onMatchValueChange }),
                React.createElement(Button, { bsStyle: "default", className: matchStyle, disabled: !this.props.isValid, onClick: this.props.onAddMatch }, "Add Match"))));
    };
    return MatchBuilder;
}(React.Component));
export default MatchBuilder;
//# sourceMappingURL=MatchBuilder.js.map