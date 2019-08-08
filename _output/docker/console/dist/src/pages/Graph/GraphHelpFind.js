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
import Draggable from 'react-draggable';
import { Button, Icon, Nav, NavItem, TabContainer, TabContent, TabPane, Table, TablePfProvider } from 'patternfly-react';
import { style } from 'typestyle';
import * as resolve from 'table-resolver';
var GraphHelpFind = /** @class */ (function (_super) {
    __extends(GraphHelpFind, _super);
    function GraphHelpFind() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.headerFormat = function (label, _a) {
            var column = _a.column;
            return React.createElement(Table.Heading, { className: column.property }, label);
        };
        _this.cellFormat = function (value, _a) {
            var column = _a.column;
            var props = column.cell.props;
            var className = props ? props.align : '';
            return React.createElement(Table.Cell, { className: className }, value);
        };
        _this.edgeColumns = function () {
            return {
                columns: [
                    {
                        property: 'c',
                        header: {
                            label: 'Expression',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'text-left'
                            }
                        }
                    },
                    {
                        property: 'n',
                        header: {
                            label: 'Notes',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'text-left'
                            }
                        }
                    }
                ]
            };
        };
        _this.exampleColumns = function () {
            return {
                columns: [
                    {
                        property: 'e',
                        header: {
                            label: 'Expression',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'text-left'
                            }
                        }
                    },
                    {
                        property: 'd',
                        header: {
                            label: 'Description',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'text-left'
                            }
                        }
                    }
                ]
            };
        };
        _this.nodeColumns = function () {
            return {
                columns: [
                    {
                        property: 'c',
                        header: {
                            label: 'Expression',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'text-left'
                            }
                        }
                    },
                    {
                        property: 'n',
                        header: {
                            label: 'Notes',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'text-left'
                            }
                        }
                    }
                ]
            };
        };
        _this.noteColumns = function () {
            return {
                columns: [
                    {
                        property: 't',
                        header: {
                            label: 'Usage Note',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'textleft'
                            }
                        }
                    }
                ]
            };
        };
        _this.operatorColumns = function () {
            return {
                columns: [
                    {
                        property: 'o',
                        header: {
                            label: 'Operator',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'text-center'
                            }
                        }
                    },
                    {
                        property: 'd',
                        header: {
                            label: 'Description',
                            formatters: [_this.headerFormat]
                        },
                        cell: {
                            formatters: [_this.cellFormat],
                            props: {
                                align: 'text-left'
                            }
                        }
                    }
                ]
            };
        };
        return _this;
    }
    GraphHelpFind.prototype.render = function () {
        var className = this.props.className ? this.props.className : '';
        var width = '600px';
        var maxWidth = '602px';
        var contentWidth = 'calc(100vw - 50px - var(--pf-c-page__sidebar--md--Width))'; // 50px prevents full coverage
        var contentStyle = style({
            width: contentWidth,
            maxWidth: maxWidth,
            height: '550px',
            right: '0',
            top: '10px',
            zIndex: 9999,
            position: 'absolute',
            overflow: 'hidden',
            overflowX: 'auto',
            overflowY: 'auto'
        });
        var headerStyle = style({
            width: width
        });
        var bodyStyle = style({
            width: width
        });
        var prefaceStyle = style({
            width: '100%',
            height: '75px',
            padding: '10px',
            resize: 'none',
            color: '#fff',
            backgroundColor: '#003145'
        });
        var preface = 'You can use the Find and Hide fields to highlight or hide edges and nodes from the graph. Each field ' +
            'accepts text expressions using the language described below. Hide takes precedence when using Find and ' +
            'Hide together. Hide maintains the layout, it does not reposition the remaining graph elements.';
        return (React.createElement(Draggable, { handle: "#helpheader", bounds: "#root" },
            React.createElement("div", { className: "modal-content " + className + " " + contentStyle },
                React.createElement("div", { id: "helpheader", className: "modal-header " + headerStyle },
                    React.createElement(Button, { className: "close", bsClass: "", onClick: this.props.onClose },
                        React.createElement(Icon, { title: "Close", type: "pf", name: "close" })),
                    React.createElement("span", { className: "modal-title" }, "Help: Graph Find/Hide")),
                React.createElement("div", { className: "modal-body " + bodyStyle },
                    React.createElement("textarea", { className: "" + prefaceStyle, readOnly: true, value: preface }),
                    React.createElement(TabContainer, { id: "basic-tabs", defaultActiveKey: "notes" },
                        React.createElement(React.Fragment, null,
                            React.createElement(Nav, { bsClass: "nav nav-tabs nav-tabs-pf", style: { paddingLeft: '10px' } },
                                React.createElement(NavItem, { eventKey: "notes" },
                                    React.createElement("div", null, "Usage Notes")),
                                React.createElement(NavItem, { eventKey: "operators" },
                                    React.createElement("div", null, "Operators")),
                                React.createElement(NavItem, { eventKey: "nodes" },
                                    React.createElement("div", null, "Nodes")),
                                React.createElement(NavItem, { eventKey: "edges" },
                                    React.createElement("div", null, "Edges")),
                                React.createElement(NavItem, { eventKey: "examples" },
                                    React.createElement("div", null, "Examples"))),
                            React.createElement(TabContent, null,
                                React.createElement(TabPane, { eventKey: "notes", mountOnEnter: true, unmountOnExit: true },
                                    React.createElement(TablePfProvider, { striped: true, bordered: true, hover: true, dataTable: true, columns: this.noteColumns().columns },
                                        React.createElement(Table.Header, { headerRows: resolve.headerRows(this.noteColumns()) }),
                                        React.createElement(Table.Body, { rowKey: "id", rows: [
                                                { id: 't00', t: 'Expressions can not combine "AND" with "OR".' },
                                                { id: 't05', t: 'Parentheses are not supported (or needed).' },
                                                {
                                                    id: 't10',
                                                    t: 'The "name" operand expands internally to an "OR" expression (an "AND" when negated).'
                                                },
                                                { id: 't30', t: 'Expressions can not combine node and edge criteria.' },
                                                {
                                                    id: 't40',
                                                    t: 'Numeric equality (=,!=) is exact match. Include leading 0 and digits of precision.'
                                                },
                                                {
                                                    id: 't45',
                                                    t: 'Use "<operand> = NaN" to test for no activity. Use "!= NaN" for any activity. (e.g. httpout = NaN)'
                                                },
                                                { id: 't50', t: 'Numerics use "." decimal notation.' },
                                                { id: 't60', t: 'Percentages use 1 digit of precision, Rates use 2 digits of precision.' },
                                                {
                                                    id: 't70',
                                                    t: "Unary operands may optionally be prefixed with \"is\" or \"has\". (i.e. \"has mtls\")"
                                                },
                                                {
                                                    id: 't80',
                                                    t: 'Abbrevations: namespace|ns, service|svc, workload|wl (e.g. is wlnode)'
                                                },
                                                {
                                                    id: 't90',
                                                    t: 'Abbrevations: circuitbreaker|cb, responsetime|rt, serviceentry->se, sidecar|sc, virtualservice|vs'
                                                },
                                                {
                                                    id: 't100',
                                                    t: 'Hiding nodes will automatically hide connected edges.'
                                                },
                                                {
                                                    id: 't110',
                                                    t: 'Hiding edges will automatically hide nodes left with no visible edges.'
                                                }
                                            ] }))),
                                React.createElement(TabPane, { eventKey: "operators", mountOnEnter: true, unmountOnExit: true },
                                    React.createElement(TablePfProvider, { striped: true, bordered: true, hover: true, dataTable: true, columns: this.operatorColumns().columns },
                                        React.createElement(Table.Header, { headerRows: resolve.headerRows(this.operatorColumns()) }),
                                        React.createElement(Table.Body, { rowKey: "id", rows: [
                                                { id: 'o0', o: '! | not <unary expression>', d: "negation" },
                                                { id: 'o1', o: '=', d: "equals" },
                                                { id: 'o2', o: '!=', d: "not equals" },
                                                { id: 'o3', o: 'endswith | $=', d: "ends with, strings only" },
                                                { id: 'o4', o: '!endswith | !$=', d: "not ends with, strings only" },
                                                { id: 'o5', o: 'startswith | ^=', d: "starts with, strings only" },
                                                { id: 'o6', o: '!startswith | !^=', d: "not starts with, strings only" },
                                                { id: 'o7', o: 'contains | *=', d: 'contains, strings only' },
                                                { id: 'o8', o: '!contains | !*=', d: 'not contains, strings only' },
                                                { id: 'o9', o: '>', d: "greater than" },
                                                { id: 'o10', o: '>=', d: "greater than or equals" },
                                                { id: 'o11', o: '<', d: "less than" },
                                                { id: 'o12', o: '<=', d: "less than or equals" }
                                            ] }))),
                                React.createElement(TabPane, { eventKey: "nodes", mountOnEnter: true, unmountOnExit: true },
                                    React.createElement(TablePfProvider, { striped: true, bordered: true, hover: true, dataTable: true, columns: this.nodeColumns().columns },
                                        React.createElement(Table.Header, { headerRows: resolve.headerRows(this.nodeColumns()) }),
                                        React.createElement(Table.Body, { rowKey: "id", rows: [
                                                { id: 'nc00', c: 'grpcin <op> <number>', n: 'unit: requests per second' },
                                                { id: 'nc10', c: 'grpcout <op> <number>', n: 'unit: requests per second' },
                                                { id: 'nc12', c: 'httpin <op> <number>', n: 'unit: requests per second' },
                                                { id: 'nc13', c: 'httpout <op> <number>', n: 'unit: requests per second' },
                                                {
                                                    id: 'nc15',
                                                    c: 'name <op> <string>',
                                                    n: 'tests against app label, service name and workload name'
                                                },
                                                { id: 'nc20', c: 'namespace <op> <namespaceName>' },
                                                { id: 'nc25', c: 'node <op> <nodeType>', n: 'nodeType: app | service | workload | unknown' },
                                                { id: 'nc30', c: 'service <op> <serviceName>' },
                                                { id: 'nc40', c: 'version <op> <string>' },
                                                { id: 'nc50', c: 'tcpin <op> <number>', n: 'unit: bytes per second' },
                                                { id: 'nc60', c: 'tcpout <op> <number>', n: 'unit: bytes per second' },
                                                { id: 'nc70', c: 'workload <op> <workloadName>' },
                                                { id: 'nc90', c: 'circuitbreaker' },
                                                { id: 'nc100', c: 'outside', n: 'is outside of requested namespaces' },
                                                { id: 'nc110', c: 'sidecar' },
                                                { id: 'nc130', c: 'serviceentry' },
                                                { id: 'nc135', c: 'trafficsource', n: "has only outgoing edges" },
                                                { id: 'nc150', c: 'unused', n: "'Show Unused' option must be enabled" },
                                                { id: 'nc160', c: 'virtualservice' }
                                            ] }))),
                                React.createElement(TabPane, { eventKey: "edges", mountOnEnter: true, unmountOnExit: true },
                                    React.createElement(TablePfProvider, { striped: true, bordered: true, hover: true, dataTable: true, columns: this.edgeColumns().columns },
                                        React.createElement(Table.Header, { headerRows: resolve.headerRows(this.edgeColumns()) }),
                                        React.createElement(Table.Body, { rowKey: "id", rows: [
                                                { id: 'ec00', c: 'grpc <op> <number>', n: 'unit: requests per second' },
                                                { id: 'ec10', c: '%grpcerr <op> <number>', n: 'range: [0..100]' },
                                                { id: 'ec20', c: '%grpctraffic <op> <number>', n: 'range: [0..100]' },
                                                { id: 'ec23', c: 'http <op> <number>', n: 'unit: requests per second' },
                                                { id: 'ec24', c: '%httperr <op> <number>', n: 'range: [0..100]' },
                                                { id: 'ec25', c: '%httptraffic <op> <number>', n: 'range: [0..100]' },
                                                { id: 'ec30', c: 'protocol <op> <protocol>', n: 'grpc, http, tcp, etc..' },
                                                {
                                                    id: 'ec40',
                                                    c: 'responsetime <op> <number>',
                                                    n: "unit: millis, 'Response Time' edge labels required"
                                                },
                                                { id: 'ec50', c: 'tcp <op> <number>', n: 'unit: requests per second' },
                                                { id: 'ec60', c: 'mtls' },
                                                { id: 'ec70', c: 'traffic', n: 'any traffic for any protocol' }
                                            ] }))),
                                React.createElement(TabPane, { eventKey: "examples" },
                                    React.createElement(TablePfProvider, { striped: true, bordered: true, hover: true, dataTable: true, columns: this.exampleColumns().columns },
                                        React.createElement(Table.Header, { headerRows: resolve.headerRows(this.exampleColumns()) }),
                                        React.createElement(Table.Body, { rowKey: "id", rows: [
                                                {
                                                    id: 'e00',
                                                    e: 'name = reviews',
                                                    d: "\"by name\": nodes with app label, service name or workload name equal to 'reviews'"
                                                },
                                                {
                                                    id: 'e10',
                                                    e: 'name not contains rev',
                                                    d: "\"by name\": nodes with app label, service name and workload name not containing 'rev'"
                                                },
                                                {
                                                    id: 'e20',
                                                    e: 'app startswith product',
                                                    d: "nodes with app label starting with 'product'"
                                                },
                                                {
                                                    id: 'e30',
                                                    e: 'app != details and version=v1',
                                                    d: "nodes with app label not equal to 'details' and with version equal to 'v1'"
                                                },
                                                { id: 'e40', e: '!sc', d: "nodes without a sidecar" },
                                                { id: 'e50', e: 'httpin > 0.5', d: "nodes with incoming http rate > 0.5 rps" },
                                                { id: 'e60', e: 'tcpout >= 1000', d: "nodes with outgoing tcp rates >= 1000 bps" },
                                                { id: 'e65', e: '!traffic', d: 'edges with no traffic' },
                                                { id: 'e70', e: 'http > 0.5', d: "edges with http rate > 0.5 rps" },
                                                {
                                                    id: 'e80',
                                                    e: 'rt > 500',
                                                    d: "edges with response time > 500ms. (requires response time edge labels)"
                                                },
                                                {
                                                    id: 'e90',
                                                    e: '%httptraffic >= 50.0',
                                                    d: "edges with >= 50% of the outgoing http request traffic of the parent"
                                                }
                                            ] }))))))))));
    };
    return GraphHelpFind;
}(React.Component));
export default GraphHelpFind;
//# sourceMappingURL=GraphHelpFind.js.map