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
import Rules, { MOVE_TYPE } from './MatchingRouting/Rules';
import RuleBuilder from './MatchingRouting/RuleBuilder';
import { EXACT, HEADERS } from './MatchingRouting/MatchBuilder';
var MSG_SAME_MATCHING = 'A Rule with same matching criteria is already added.';
var MSG_HEADER_NAME_NON_EMPTY = 'Header name must be non empty';
var MSG_HEADER_VALUE_NON_EMPTY = 'Header value must be non empty';
var MSG_ROUTES_NON_EMPTY = 'Routes must be non empty';
var MatchingRouting = /** @class */ (function (_super) {
    __extends(MatchingRouting, _super);
    function MatchingRouting(props) {
        var _this = _super.call(this, props) || this;
        _this.isMatchesIncluded = function (rules, rule) {
            var found = false;
            for (var i = 0; i < rules.length; i++) {
                var item = rules[i];
                if (item.matches.length !== rule.matches.length) {
                    continue;
                }
                found = item.matches.every(function (value) { return rule.matches.includes(value); });
            }
            return found;
        };
        _this.isValid = function (rules) {
            // Corner case, an empty rules shouldn't be a valid scenario to create a VS/DR
            if (rules.length === 0) {
                return false;
            }
            var matchAll = _this.matchAllIndex(rules);
            var isValid = true;
            for (var index = 0; index < _this.state.rules.length; index++) {
                isValid = matchAll === -1 || index <= matchAll;
                if (!isValid) {
                    return isValid;
                }
            }
            return isValid;
        };
        _this.onAddMatch = function () {
            // Change only state when there is a match
            if (_this.state.matchValue !== '') {
                _this.setState(function (prevState) {
                    var newMatch = prevState.category +
                        (prevState.category === HEADERS ? ' [' + prevState.headerName + '] ' : ' ') +
                        prevState.operator +
                        ' ' +
                        prevState.matchValue;
                    prevState.matches.push(newMatch);
                    return {
                        matches: prevState.matches,
                        headerName: '',
                        matchValue: ''
                    };
                });
            }
        };
        _this.onAddRule = function () {
            _this.setState(function (prevState) {
                // Just if there is a missing match
                if (_this.state.matchValue !== '') {
                    var newMatch = prevState.category +
                        (prevState.category === HEADERS ? ' [' + prevState.headerName + '] ' : ' ') +
                        prevState.operator +
                        ' ' +
                        prevState.matchValue;
                    if (!prevState.matches.includes(newMatch)) {
                        prevState.matches.push(newMatch);
                    }
                }
                var newRule = {
                    matches: prevState.matches,
                    routes: prevState.routes
                };
                if (!_this.isMatchesIncluded(prevState.rules, newRule)) {
                    prevState.rules.push(newRule);
                    return {
                        matches: [],
                        headerName: '',
                        matchValue: '',
                        rules: prevState.rules,
                        validationMsg: ''
                    };
                }
                else {
                    return {
                        matches: prevState.matches,
                        headerName: prevState.headerName,
                        matchValue: prevState.matchValue,
                        rules: prevState.rules,
                        validationMsg: MSG_SAME_MATCHING
                    };
                }
            }, function () { return _this.props.onChange(_this.isValid(_this.state.rules), _this.state.rules); });
        };
        _this.onRemoveMatch = function (matchToRemove) {
            _this.setState(function (prevState) {
                return {
                    matches: prevState.matches.filter(function (m) { return matchToRemove !== m; })
                };
            });
        };
        _this.onRemoveRule = function (index) {
            _this.setState(function (prevState) {
                prevState.rules.splice(index, 1);
                return {
                    rules: prevState.rules
                };
            }, function () { return _this.props.onChange(_this.isValid(_this.state.rules), _this.state.rules); });
        };
        _this.onHeaderNameChange = function (event) {
            var validationMsg = '';
            if (_this.state.matchValue !== '' && event.target.value === '') {
                validationMsg = MSG_HEADER_NAME_NON_EMPTY;
            }
            if (_this.state.matchValue === '' && event.target.value !== '') {
                validationMsg = MSG_HEADER_VALUE_NON_EMPTY;
            }
            _this.setState({
                headerName: event.target.value,
                validationMsg: validationMsg
            });
        };
        _this.onMatchValueChange = function (event) {
            var validationMsg = '';
            if (_this.state.category === HEADERS) {
                if (_this.state.headerName === '' && event.target.value !== '') {
                    validationMsg = MSG_HEADER_NAME_NON_EMPTY;
                }
                if (_this.state.headerName !== '' && event.target.value === '') {
                    validationMsg = MSG_HEADER_VALUE_NON_EMPTY;
                }
            }
            if (event.target.value === '') {
                validationMsg = '';
            }
            _this.setState({
                matchValue: event.target.value,
                validationMsg: validationMsg
            });
        };
        _this.onSelectRoutes = function (routes) {
            var validationMsg = '';
            if (routes.length === 0) {
                validationMsg = MSG_ROUTES_NON_EMPTY;
            }
            _this.setState({
                routes: routes,
                validationMsg: validationMsg
            });
        };
        _this.onMoveRule = function (index, move) {
            _this.setState(function (prevState) {
                var sourceRule = prevState.rules[index];
                var targetIndex = move === MOVE_TYPE.UP ? index - 1 : index + 1;
                var targetRule = prevState.rules[targetIndex];
                prevState.rules[targetIndex] = sourceRule;
                prevState.rules[index] = targetRule;
                return {
                    rules: prevState.rules
                };
            }, function () { return _this.props.onChange(_this.isValid(_this.state.rules), _this.state.rules); });
        };
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
        _this.state = {
            category: HEADERS,
            operator: EXACT,
            routes: _this.props.workloads.map(function (w) { return w.name; }),
            matches: [],
            headerName: '',
            matchValue: '',
            rules: _this.props.initRules,
            validationMsg: ''
        };
        return _this;
    }
    MatchingRouting.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.initRules.length > 0) {
            this.setState({
                rules: this.props.initRules
            }, function () { return _this.props.onChange(_this.isValid(_this.state.rules), _this.state.rules); });
        }
    };
    MatchingRouting.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement(RuleBuilder, { category: this.state.category, operator: this.state.operator, headerName: this.state.headerName, matchValue: this.state.matchValue, isValid: this.state.validationMsg === '', onSelectCategory: function (category) { return _this.setState({ category: category }); }, onHeaderNameChange: this.onHeaderNameChange, onSelectOperator: function (operator) { return _this.setState({ operator: operator }); }, onMatchValueChange: this.onMatchValueChange, onAddMatch: this.onAddMatch, matches: this.state.matches, onRemoveMatch: this.onRemoveMatch, workloads: this.props.workloads, routes: this.state.routes, onSelectRoutes: this.onSelectRoutes, validationMsg: this.state.validationMsg, onAddRule: this.onAddRule }),
            React.createElement(Rules, { rules: this.state.rules, onRemoveRule: this.onRemoveRule, onMoveRule: this.onMoveRule })));
    };
    return MatchingRouting;
}(React.Component));
export default MatchingRouting;
//# sourceMappingURL=MatchingRouting.js.map