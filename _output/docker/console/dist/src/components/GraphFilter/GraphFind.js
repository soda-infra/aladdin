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
import { Button, FormControl, FormGroup, Icon, InputGroup, OverlayTrigger, Tooltip } from 'patternfly-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findValueSelector, hideValueSelector } from '../../store/Selectors';
import { GraphFilterActions } from '../../actions/GraphFilterActions';
import GraphHelpFind from '../../pages/Graph/GraphHelpFind';
import { CyNode, CyEdge } from '../CytoscapeGraph/CytoscapeGraphUtils';
var inputWidth = {
    width: '10em'
};
// reduce toolbar padding from 20px to 10px to save space
var thinGroupStyle = {
    paddingLeft: '10px',
    paddingRight: '10px'
};
var GraphFind = /** @class */ (function (_super) {
    __extends(GraphFind, _super);
    function GraphFind(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleFindHelp = function () {
            _this.props.toggleFindHelp();
        };
        _this.updateFind = function (event) {
            if ('' === event.target.value) {
                _this.clearFind();
            }
            else {
                _this.setState({ findInputValue: event.target.value, errorMessage: '' });
            }
        };
        _this.updateHide = function (event) {
            if ('' === event.target.value) {
                _this.clearHide();
            }
            else {
                _this.setState({ hideInputValue: event.target.value, errorMessage: '' });
            }
        };
        _this.checkSubmitFind = function (event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            if (keyCode === 13) {
                event.preventDefault();
                _this.submitFind();
            }
        };
        _this.checkSubmitHide = function (event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            if (keyCode === 13) {
                event.preventDefault();
                _this.submitHide();
            }
        };
        _this.submitFind = function () {
            if (_this.props.findValue !== _this.state.findInputValue) {
                _this.props.setFindValue(_this.state.findInputValue);
            }
        };
        _this.submitHide = function () {
            if (_this.props.hideValue !== _this.state.hideInputValue) {
                _this.props.setHideValue(_this.state.hideInputValue);
            }
        };
        _this.clearFind = function () {
            // note, we don't use findInputRef.current because <FormControl> deals with refs differently than <input>
            _this.findInputRef.value = '';
            _this.setState({ findInputValue: '', errorMessage: '' });
            _this.props.setFindValue('');
        };
        _this.clearHide = function () {
            // note, we don't use hideInputRef.current because <FormControl> deals with refs differently than <input>
            _this.hideInputRef.value = '';
            _this.setState({ hideInputValue: '', errorMessage: '' });
            _this.props.setHideValue('');
        };
        _this.handleHide = function () {
            if (!_this.props.cyData) {
                console.debug('Skip Hide: cy not set.');
                return;
            }
            var cy = _this.props.cyData.cyRef;
            var selector = _this.parseValue(_this.props.hideValue);
            cy.startBatch();
            // this could also be done using cy remove/restore but we had better results
            // using visible/hidden.  The latter worked better when hiding animation, and
            // also prevents the need for running layout because visible/hidden maintains
            // the space of the hidden elements.
            if (_this.hiddenElements) {
                // make visible old hide-hits
                _this.hiddenElements.style({ visibility: 'visible' });
                _this.hiddenElements = undefined;
            }
            if (selector) {
                // select the new hide-hits
                _this.hiddenElements = cy.$(selector);
                // add the edges connected to hidden nodes
                _this.hiddenElements = _this.hiddenElements.add(_this.hiddenElements.connectedEdges());
                // add nodes with only hidden edges (keep unused nodes as that is an explicit option)
                var visibleElements = _this.hiddenElements.absoluteComplement();
                var nodesWithVisibleEdges = visibleElements.edges().connectedNodes();
                var nodesWithOnlyHiddenEdges = visibleElements.nodes("[^" + CyNode.isUnused + "]").subtract(nodesWithVisibleEdges);
                _this.hiddenElements = _this.hiddenElements.add(nodesWithOnlyHiddenEdges);
                // remove any appbox hits, we only hide empty appboxes
                _this.hiddenElements = _this.hiddenElements.subtract(_this.hiddenElements.filter('$node[isGroup]'));
                // set the remaining hide-hits hidden
                _this.hiddenElements.style({ visibility: 'hidden' });
                // now hide any appboxes that don't have any visible children
                var hiddenAppBoxes = cy.$('$node[isGroup]').subtract(cy.$('$node[isGroup] > :visible'));
                hiddenAppBoxes.style({ visibility: 'hidden' });
                _this.hiddenElements = _this.hiddenElements.add(hiddenAppBoxes);
            }
            cy.endBatch();
        };
        _this.handleFind = function () {
            if (!_this.props.cyData) {
                console.debug('Skip Find: cy not set.');
                return;
            }
            var cy = _this.props.cyData.cyRef;
            var selector = _this.parseValue(_this.props.findValue);
            cy.startBatch();
            // unhighlight old find-hits
            cy.elements('*.find').removeClass('find');
            if (selector) {
                // add new find-hits
                cy.elements(selector).addClass('find');
            }
            cy.endBatch();
        };
        _this.parseValue = function (val) {
            var preparedVal = _this.prepareValue(val);
            if (!preparedVal) {
                return undefined;
            }
            preparedVal = preparedVal.replace(/ and /gi, ' AND ');
            preparedVal = preparedVal.replace(/ or /gi, ' OR ');
            var conjunctive = preparedVal.includes(' AND ');
            var disjunctive = preparedVal.includes(' OR ');
            if (conjunctive && disjunctive) {
                return _this.setErrorMsg("Expression can not contain both 'AND' and 'OR'");
            }
            var separator = disjunctive ? ',' : '';
            var expressions = disjunctive ? preparedVal.split(' OR ') : preparedVal.split(' AND ');
            var selector;
            for (var _i = 0, expressions_1 = expressions; _i < expressions_1.length; _i++) {
                var expression = expressions_1[_i];
                var parsedExpression = _this.parseExpression(expression, conjunctive, disjunctive);
                if (!parsedExpression) {
                    return undefined;
                }
                selector = _this.appendSelector(selector, parsedExpression, separator);
                if (!selector) {
                    return undefined;
                }
            }
            // parsed successfully, clear any previous error message
            _this.setErrorMsg('');
            return selector;
        };
        _this.prepareValue = function (val) {
            // remove double spaces
            val = val.replace(/ +(?= )/g, '');
            // remove unnecessary mnemonic qualifiers on unary operators (e.g. 'has cb' -> 'cb').
            val = ' ' + val;
            val = val.replace(/ is /gi, ' ');
            val = val.replace(/ has /gi, ' ');
            val = val.replace(/ !\s*is /gi, ' ! ');
            val = val.replace(/ !\s*has /gi, ' ! ');
            // replace string operators
            val = val.replace(/ not /gi, ' !');
            val = val.replace(/ !\s*contains /gi, ' !*= ');
            val = val.replace(/ !\s*startswith /gi, ' !^= ');
            val = val.replace(/ !\s*endswith /gi, ' !$= ');
            val = val.replace(/ contains /gi, ' *= ');
            val = val.replace(/ startswith /gi, ' ^= ');
            val = val.replace(/ endswith /gi, ' $= ');
            return val.trim();
        };
        _this.parseExpression = function (expression, conjunctive, disjunctive) {
            var op;
            if (expression.includes('!=')) {
                op = '!=';
            }
            else if (expression.includes('!*=')) {
                op = '!*=';
            }
            else if (expression.includes('!$=')) {
                op = '!$=';
            }
            else if (expression.includes('!^=')) {
                op = '!^=';
            }
            else if (expression.includes('>=')) {
                op = '>=';
            }
            else if (expression.includes('<=')) {
                op = '<=';
            }
            else if (expression.includes('*=')) {
                op = '*='; // substring
            }
            else if (expression.includes('$=')) {
                op = '$='; // starts with
            }
            else if (expression.includes('^=')) {
                op = '^='; // ends with
            }
            else if (expression.includes('=')) {
                op = '=';
            }
            else if (expression.includes('>')) {
                op = '>';
            }
            else if (expression.includes('<')) {
                op = '<';
            }
            else if (expression.includes('!')) {
                op = '!';
            }
            if (!op) {
                if (expression.split(' ').length > 1) {
                    return _this.setErrorMsg("No valid operator found in expression");
                }
                var unaryExpression = _this.parseUnaryFindExpression(expression.trim(), false);
                return unaryExpression ? unaryExpression : _this.setErrorMsg("Invalid Node or Edge operand");
            }
            var tokens = expression.split(op);
            if (op === '!') {
                var unaryExpression = _this.parseUnaryFindExpression(tokens[1].trim(), true);
                return unaryExpression ? unaryExpression : _this.setErrorMsg("Invalid Node or Edge operand");
            }
            var field = tokens[0].trim();
            var val = tokens[1].trim();
            switch (field.toLowerCase()) {
                //
                // nodes...
                //
                case 'app':
                    return { target: 'node', selector: "[" + CyNode.app + " " + op + " \"" + val + "\"]" };
                case 'grpcin': {
                    var s = _this.getNumericSelector(CyNode.grpcIn, op, val, expression);
                    return s ? { target: 'node', selector: s } : undefined;
                }
                case 'grpcout': {
                    var s = _this.getNumericSelector(CyNode.grpcOut, op, val, expression);
                    return s ? { target: 'node', selector: s } : undefined;
                }
                case 'httpin': {
                    var s = _this.getNumericSelector(CyNode.httpIn, op, val, expression);
                    return s ? { target: 'node', selector: s } : undefined;
                }
                case 'httpout': {
                    var s = _this.getNumericSelector(CyNode.httpOut, op, val, expression);
                    return s ? { target: 'node', selector: s } : undefined;
                }
                case 'name': {
                    var isNegation = op.startsWith('!');
                    if (disjunctive && isNegation) {
                        return _this.setErrorMsg("Can not use 'OR' with negated 'name' operand");
                    }
                    else if (conjunctive) {
                        return _this.setErrorMsg("Can not use 'AND' with 'name' operand");
                    }
                    var wl = "[" + CyNode.workload + " " + op + " \"" + val + "\"]";
                    var app = "[" + CyNode.app + " " + op + " \"" + val + "\"]";
                    var svc = "[" + CyNode.service + " " + op + " \"" + val + "\"]";
                    return { target: 'node', selector: isNegation ? "" + wl + app + svc : wl + "," + app + "," + svc };
                }
                case 'node':
                    var nodeType = val.toLowerCase();
                    switch (nodeType) {
                        case 'svc':
                            nodeType = 'service';
                            break;
                        case 'wl':
                            nodeType = 'workload';
                            break;
                        default:
                            break; // no-op
                    }
                    switch (nodeType) {
                        case 'app':
                        case 'service':
                        case 'workload':
                        case 'unknown':
                            return { target: 'node', selector: "[" + CyNode.nodeType + " " + op + " \"" + nodeType + "\"]" };
                        default:
                            _this.setErrorMsg("Invalid node type [" + nodeType + "]. Expected app | service | unknown | workload");
                    }
                    return undefined;
                case 'ns':
                case 'namespace':
                    return { target: 'node', selector: "[" + CyNode.namespace + " " + op + " \"" + val + "\"]" };
                case 'svc':
                case 'service':
                    return { target: 'node', selector: "[" + CyNode.service + " " + op + " \"" + val + "\"]" };
                case 'tcpin': {
                    var s = _this.getNumericSelector(CyNode.tcpIn, op, val, expression);
                    return s ? { target: 'node', selector: s } : undefined;
                }
                case 'tcpout': {
                    var s = _this.getNumericSelector(CyNode.tcpOut, op, val, expression);
                    return s ? { target: 'node', selector: s } : undefined;
                }
                case 'version':
                    return { target: 'node', selector: "[" + CyNode.version + " " + op + " \"" + val + "\"]" };
                case 'wl':
                case 'workload':
                    return { target: 'node', selector: "[" + CyNode.workload + " " + op + " \"" + val + "\"]" };
                //
                // edges..
                //
                case 'grpc': {
                    var s = _this.getNumericSelector(CyEdge.grpc, op, val, expression);
                    return s ? { target: 'edge', selector: s } : undefined;
                }
                case '%grpcerror':
                case '%grpcerr': {
                    var s = _this.getNumericSelector(CyEdge.grpcPercentErr, op, val, expression);
                    return s ? { target: 'edge', selector: s } : undefined;
                }
                case '%grpctraffic': {
                    var s = _this.getNumericSelector(CyEdge.grpcPercentReq, op, val, expression);
                    return s ? { target: 'edge', selector: s } : undefined;
                }
                case 'http': {
                    var s = _this.getNumericSelector(CyEdge.http, op, val, expression);
                    return s ? { target: 'edge', selector: s } : undefined;
                }
                case '%httperror':
                case '%httperr': {
                    var s = _this.getNumericSelector(CyEdge.httpPercentErr, op, val, expression);
                    return s ? { target: 'edge', selector: s } : undefined;
                }
                case '%httptraffic': {
                    var s = _this.getNumericSelector(CyEdge.httpPercentReq, op, val, expression);
                    return s ? { target: 'edge', selector: s } : undefined;
                }
                case 'protocol': {
                    return { target: 'edge', selector: "[" + CyEdge.protocol + " " + op + " \"" + val + "\"]" };
                }
                case 'rt':
                case 'responsetime': {
                    var s = _this.getNumericSelector(CyEdge.responseTime, op, val, expression);
                    return s ? { target: 'edge', selector: s } : undefined;
                }
                case 'tcp': {
                    var s = _this.getNumericSelector(CyEdge.tcp, op, val, expression);
                    return s ? { target: 'edge', selector: s } : undefined;
                }
                default:
                    return _this.setErrorMsg("Invalid operand [" + field + "]");
            }
        };
        _this.parseUnaryFindExpression = function (field, isNegation) {
            switch (field.toLowerCase()) {
                //
                // nodes...
                //
                case 'cb':
                case 'circuitbreaker':
                    return { target: 'node', selector: isNegation ? "[^" + CyNode.hasCB + "]" : "[?" + CyNode.hasCB + "]" };
                case 'dead':
                    return { target: 'node', selector: isNegation ? "[^" + CyNode.isDead + "]" : "[?" + CyNode.isDead + "]" };
                case 'inaccessible':
                    return { target: 'node', selector: isNegation ? "[^" + CyNode.isInaccessible + "]" : "[?" + CyNode.isInaccessible + "]" };
                case 'outside':
                case 'outsider':
                    return { target: 'node', selector: isNegation ? "[^" + CyNode.isOutside + "]" : "[?" + CyNode.isOutside + "]" };
                case 'se':
                case 'serviceentry':
                    return { target: 'node', selector: isNegation ? "[^" + CyNode.isServiceEntry + "]" : "[?" + CyNode.isServiceEntry + "]" };
                case 'sc':
                case 'sidecar':
                    return { target: 'node', selector: isNegation ? "[?" + CyNode.hasMissingSC + "]" : "[^" + CyNode.hasMissingSC + "]" };
                case 'trafficsource':
                case 'root':
                    return { target: 'node', selector: isNegation ? "[^" + CyNode.isRoot + "]" : "[?" + CyNode.isRoot + "]" };
                case 'unused':
                    return { target: 'node', selector: isNegation ? "[^" + CyNode.isUnused + "]" : "[?" + CyNode.isUnused + "]" };
                case 'vs':
                case 'virtualservice':
                    return { target: 'node', selector: isNegation ? "[^" + CyNode.hasVS + "]" : "[?" + CyNode.hasVS + "]" };
                //
                // edges...
                //
                case 'mtls':
                    return { target: 'edge', selector: isNegation ? "[" + CyEdge.isMTLS + " <= 0]" : "[" + CyEdge.isMTLS + " > 0]" };
                case 'traffic': {
                    return { target: 'edge', selector: isNegation ? "[^" + CyEdge.protocol + "]" : "[?" + CyEdge.protocol + "]" };
                }
                default:
                    return undefined;
            }
        };
        _this.appendSelector = function (selector, parsedExpression, separator) {
            if (!selector) {
                return parsedExpression.target + parsedExpression.selector;
            }
            if (!selector.startsWith(parsedExpression.target)) {
                return _this.setErrorMsg('Invalid expression. Can not mix node and edge criteria.');
            }
            return selector + separator + parsedExpression.selector;
        };
        var findValue = props.findValue ? props.findValue : '';
        var hideValue = props.hideValue ? props.hideValue : '';
        _this.state = { errorMessage: '', findInputValue: findValue, hideInputValue: hideValue };
        if (props.showFindHelp) {
            props.toggleFindHelp();
        }
        return _this;
    }
    // Note that we may have redux hide/find values set at mount-time. But because the toolbar mounts prior to
    // the graph loading, we can't perform this graph "post-processing" until we have a valid cy graph.  We can assume
    // that applying the find/hide on update is sufficient because  we will be updated after the cy is loaded
    // due to a change notification for this.props.cyData.
    GraphFind.prototype.componentDidUpdate = function (prevProps) {
        var findChanged = this.props.findValue !== prevProps.findValue;
        var hideChanged = this.props.hideValue !== prevProps.hideValue;
        var graphChanged = this.props.cyData && prevProps.cyData && this.props.cyData.updateTimestamp !== prevProps.cyData.updateTimestamp;
        // make sure the value is updated if there was a change
        if (findChanged) {
            this.setState({ findInputValue: this.props.findValue });
        }
        if (hideChanged) {
            this.setState({ hideInputValue: this.props.hideValue });
        }
        if (findChanged || (graphChanged && this.props.findValue)) {
            this.handleFind();
        }
        if (hideChanged || (graphChanged && this.props.hideValue)) {
            this.handleHide();
        }
    };
    GraphFind.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement(FormGroup, { style: __assign({ flexDirection: 'row', alignItems: 'flex-start' }, thinGroupStyle) },
                React.createElement("span", { className: 'form-inline' },
                    React.createElement(InputGroup, null,
                        React.createElement(FormControl, { id: "graph_find", name: "graph_find", autoComplete: "on", type: "text", style: __assign({}, inputWidth), inputRef: function (ref) {
                                _this.findInputRef = ref;
                            }, onChange: this.updateFind, defaultValue: this.state.findInputValue, onKeyPress: this.checkSubmitFind, placeholder: "Find..." }),
                        this.props.findValue && (React.createElement(OverlayTrigger, { key: "ot_clear_find", placement: "top", trigger: ['hover', 'focus'], delayShow: 1000, overlay: React.createElement(Tooltip, { id: "tt_clear_find" }, "Clear Find...") },
                            React.createElement(InputGroup.Button, null,
                                React.createElement(Button, { onClick: this.clearFind },
                                    React.createElement(Icon, { name: "close", type: "fa" }))))),
                        React.createElement(FormControl, { id: "graph_hide", name: "graph_hide", autoComplete: "on", type: "text", style: __assign({}, inputWidth), inputRef: function (ref) {
                                _this.hideInputRef = ref;
                            }, onChange: this.updateHide, defaultValue: this.state.hideInputValue, onKeyPress: this.checkSubmitHide, placeholder: "Hide..." }),
                        this.props.hideValue && (React.createElement(OverlayTrigger, { key: "ot_clear_hide", placement: "top", trigger: ['hover', 'focus'], delayShow: 1000, overlay: React.createElement(Tooltip, { id: "tt_clear_hide" }, "Clear Hide...") },
                            React.createElement(InputGroup.Button, null,
                                React.createElement(Button, { onClick: this.clearHide },
                                    React.createElement(Icon, { name: "close", type: "fa" })))))),
                    React.createElement(OverlayTrigger, { key: 'ot_graph_find_help', placement: "top", overlay: React.createElement(Tooltip, { id: 'tt_graph_find_help' }, "Find/Hide Help...") },
                        React.createElement(Button, { bsStyle: "link", style: { paddingLeft: '6px' }, onClick: this.toggleFindHelp },
                            React.createElement(Icon, { name: "help", type: "pf" })))),
                this.state.errorMessage && (React.createElement("div", null,
                    React.createElement("span", { style: { color: 'red' } }, this.state.errorMessage)))),
            this.props.showFindHelp && React.createElement(GraphHelpFind, { onClose: this.toggleFindHelp }),
            ' '));
    };
    GraphFind.prototype.setErrorMsg = function (errorMessage) {
        if (errorMessage !== this.state.errorMessage) {
            this.setState({ errorMessage: errorMessage });
        }
        return undefined;
    };
    GraphFind.prototype.getNumericSelector = function (field, op, val, _expression) {
        switch (op) {
            case '>':
            case '<':
            case '>=':
            case '<=':
                if (isNaN(val)) {
                    return this.setErrorMsg("Invalid value [" + val + "]. Expected a numeric value (use . for decimals)");
                }
                return "[" + field + " " + op + " " + val + "]";
            case '=':
            case '!=':
                if (val !== 'NaN' && isNaN(val)) {
                    return this.setErrorMsg("Invalid value [" + val + "]. Expected NaN or a numeric value (use . for decimals)");
                }
                return Number(val) !== 0 ? "[" + field + " " + op + " \"" + val + "\"]" : "[" + field + " " + op + " \"0\"]";
            default:
                return this.setErrorMsg("Invalid operator [" + op + "] for numeric condition");
        }
    };
    GraphFind.contextTypes = {
        router: function () { return null; }
    };
    return GraphFind;
}(React.PureComponent));
export { GraphFind };
var mapStateToProps = function (state) { return ({
    cyData: state.graph.cyData,
    findValue: findValueSelector(state),
    hideValue: hideValueSelector(state),
    showFindHelp: state.graph.filterState.showFindHelp
}); };
var mapDispatchToProps = function (dispatch) {
    return {
        setFindValue: bindActionCreators(GraphFilterActions.setFindValue, dispatch),
        setHideValue: bindActionCreators(GraphFilterActions.setHideValue, dispatch),
        toggleFindHelp: bindActionCreators(GraphFilterActions.toggleFindHelp, dispatch)
    };
};
var GraphFindContainer = connect(mapStateToProps, mapDispatchToProps)(GraphFind);
export default GraphFindContainer;
//# sourceMappingURL=GraphFind.js.map