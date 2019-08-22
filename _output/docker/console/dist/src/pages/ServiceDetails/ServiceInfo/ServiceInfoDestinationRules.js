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
import { Col, Row, Table } from 'patternfly-react';
import * as resolve from 'table-resolver';
import LocalTime from '../../../components/Time/LocalTime';
import DetailObject from '../../../components/Details/DetailObject';
import { Link } from 'react-router-dom';
import { ConfigIndicator } from '../../../components/ConfigValidation/ConfigIndicator';
import Labels from '../../../components/Label/Labels';
import { safeRender } from '../../../utils/SafeRender';
var ServiceInfoDestinationRules = /** @class */ (function (_super) {
    __extends(ServiceInfoDestinationRules, _super);
    function ServiceInfoDestinationRules() {
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
        return _this;
    }
    ServiceInfoDestinationRules.prototype.columns = function () {
        return {
            columns: [
                {
                    property: 'status',
                    header: {
                        label: 'Status',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat],
                        props: {
                            align: 'text-center'
                        }
                    }
                },
                {
                    property: 'name',
                    header: {
                        label: 'Name',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'trafficPolicy',
                    header: {
                        label: 'Traffic Policy',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'subsets',
                    header: {
                        label: 'Subsets',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'host',
                    header: {
                        label: 'Host',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'createdAt',
                    header: {
                        label: 'Created at',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'resourceVersion',
                    header: {
                        label: 'Resource version',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'actions',
                    header: {
                        label: 'Actions',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                }
            ]
        };
    };
    ServiceInfoDestinationRules.prototype.yamlLink = function (destinationRule) {
        return (React.createElement(Link, { to: '/namespaces/' +
                destinationRule.metadata.namespace +
                '/istio/destinationrules/' +
                destinationRule.metadata.name +
                '?list=yaml' }, "View YAML"));
    };
    ServiceInfoDestinationRules.prototype.hasValidations = function (destinationRule) {
        return !!this.props.validations && !!this.props.validations[destinationRule.metadata.name];
    };
    ServiceInfoDestinationRules.prototype.validation = function (destinationRule) {
        return this.props.validations[destinationRule.metadata.name];
    };
    ServiceInfoDestinationRules.prototype.overviewLink = function (destinationRule) {
        return (React.createElement(Link, { to: '/namespaces/' +
                destinationRule.metadata.namespace +
                '/istio/destinationrules/' +
                destinationRule.metadata.name +
                '?list=overview' }, destinationRule.metadata.name));
    };
    ServiceInfoDestinationRules.prototype.rows = function () {
        var _this = this;
        return (this.props.destinationRules || []).map(function (destinationRule, vsIdx) {
            return {
                id: vsIdx,
                name: _this.overviewLink(destinationRule),
                status: (React.createElement(ConfigIndicator, { id: vsIdx + '-config-validation', validations: _this.hasValidations(destinationRule) ? [_this.validation(destinationRule)] : [] })),
                trafficPolicy: destinationRule.spec.trafficPolicy ? (React.createElement(DetailObject, { name: "", detail: destinationRule.spec.trafficPolicy })) : ('None'),
                subsets: destinationRule.spec.subsets && destinationRule.spec.subsets.length > 0
                    ? _this.generateSubsets(destinationRule.spec.subsets)
                    : 'None',
                host: destinationRule.spec.host ? React.createElement(DetailObject, { name: "", detail: destinationRule.spec.host }) : undefined,
                createdAt: React.createElement(LocalTime, { time: destinationRule.metadata.creationTimestamp || '' }),
                resourceVersion: destinationRule.metadata.resourceVersion,
                actions: _this.yamlLink(destinationRule)
            };
        });
    };
    ServiceInfoDestinationRules.prototype.generateKey = function () {
        return ('key_' +
            Math.random()
                .toString(36)
                .substr(2, 9));
    };
    ServiceInfoDestinationRules.prototype.generateSubsets = function (subsets) {
        var _this = this;
        var childrenList = subsets.map(function (subset) { return (React.createElement("li", { key: _this.generateKey() + '_k' + subset.name, style: { marginBottom: '13px' } },
            React.createElement(Row, null,
                React.createElement(Col, { xs: 3, style: { marginTop: '3px' } },
                    React.createElement("span", null, safeRender(subset.name)),
                    ' '),
                React.createElement(Col, { xs: 4 },
                    React.createElement(Labels, { labels: subset.labels })),
                React.createElement(Col, { xs: 4 },
                    React.createElement(DetailObject, { name: subset.trafficPolicy ? 'trafficPolicy' : '', detail: subset.trafficPolicy }))))); });
        return React.createElement("ul", { style: { listStyleType: 'none', paddingLeft: '0px', marginTop: '11.5px' } }, childrenList);
    };
    ServiceInfoDestinationRules.prototype.renderTable = function () {
        return (React.createElement(Table.PfProvider, { columns: this.columns().columns, striped: true, bordered: true, hover: true, dataTable: true },
            React.createElement(Table.Header, { headerRows: resolve.headerRows(this.columns()) }),
            React.createElement(Table.Body, { rows: this.rows(), rowKey: "id" })));
    };
    ServiceInfoDestinationRules.prototype.render = function () {
        return (React.createElement(Row, { className: "card-pf-body" },
            React.createElement(Col, { xs: 12 }, this.renderTable())));
    };
    return ServiceInfoDestinationRules;
}(React.Component));
export default ServiceInfoDestinationRules;
//# sourceMappingURL=ServiceInfoDestinationRules.js.map