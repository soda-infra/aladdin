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
import { Col, Icon, Row, Table } from 'patternfly-react';
import { globalChecks, severityToColor, severityToIconName, validationToSeverity } from '../../../types/ServiceInfo';
import LocalTime from '../../../components/Time/LocalTime';
import DetailObject from '../../../components/Details/DetailObject';
import * as resolve from 'table-resolver';
import Label from '../../../components/Label/Label';
import { Link } from 'react-router-dom';
var DestinationRuleDetail = /** @class */ (function (_super) {
    __extends(DestinationRuleDetail, _super);
    function DestinationRuleDetail() {
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
    DestinationRuleDetail.prototype.validation = function (_destinationRule) {
        return this.props.validation;
    };
    DestinationRuleDetail.prototype.globalStatus = function (rule) {
        var validation = this.validation(rule);
        if (!validation) {
            return '';
        }
        var checks = globalChecks(validation);
        var severity = validationToSeverity(validation);
        var iconName = severityToIconName(severity);
        var color = severityToColor(severity);
        var message = checks.map(function (check) { return check.message; }).join(',');
        if (!message.length) {
            if (!validation.valid) {
                message = 'Not all checks passed!';
            }
        }
        if (message.length) {
            return (React.createElement("div", null,
                React.createElement("p", { style: { color: color } },
                    React.createElement(Icon, { type: "pf", name: iconName }),
                    " ",
                    message)));
        }
        else {
            return '';
        }
    };
    DestinationRuleDetail.prototype.columnsSubsets = function () {
        return {
            columns: [
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
                    property: 'labelSubset',
                    header: {
                        label: 'Labels',
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
                }
            ]
        };
    };
    DestinationRuleDetail.prototype.rowsSubset = function (subsets) {
        return subsets.map(function (subset, vsIdx) { return ({
            id: vsIdx,
            name: subset.name,
            labelSubset: subset.labels
                ? Object.keys(subset.labels).map(function (key, _) { return React.createElement(Label, { key: key, name: key, value: subset.labels[key] }); })
                : [],
            trafficPolicy: React.createElement(DetailObject, { name: subset.trafficPolicy ? 'trafficPolicy' : '', detail: subset.trafficPolicy })
        }); });
    };
    DestinationRuleDetail.prototype.generateSubsets = function (subsets) {
        return (React.createElement(Table.PfProvider, { columns: this.columnsSubsets().columns, striped: true, bordered: true, hover: true, dataTable: true },
            React.createElement(Table.Header, { headerRows: resolve.headerRows(this.columnsSubsets()) }),
            React.createElement(Table.Body, { rows: this.rowsSubset(subsets), rowKey: "id" })));
    };
    DestinationRuleDetail.prototype.serviceLink = function (namespace, host, isValid) {
        if (!host) {
            return '-';
        }
        // TODO Full FQDN are not linked yet, it needs more checks in crossnamespace scenarios + validation of target
        if (host.indexOf('.') > -1 || !isValid) {
            return host;
        }
        else {
            return (React.createElement(Link, { to: '/namespaces/' + namespace + '/services/' + host },
                host + ' ',
                React.createElement(Icon, { type: "pf", name: "service" })));
        }
    };
    DestinationRuleDetail.prototype.rawConfig = function (destinationRule) {
        var globalStatus = this.globalStatus(destinationRule);
        var isValid = globalStatus === '' ? true : false;
        return (React.createElement("div", { className: "card-pf-body", key: 'virtualServiceConfig' },
            React.createElement("h4", null,
                "DestinationRule: ",
                destinationRule.metadata.name),
            React.createElement("div", null, globalStatus),
            React.createElement("div", null,
                React.createElement("strong", null, "Created at"),
                ": ",
                React.createElement(LocalTime, { time: destinationRule.metadata.creationTimestamp || '' })),
            React.createElement("div", null,
                React.createElement("strong", null, "Resource Version"),
                ": ",
                destinationRule.metadata.resourceVersion),
            destinationRule.spec.host && (React.createElement("div", null,
                React.createElement("strong", null, "Host"),
                ":",
                ' ',
                this.serviceLink(destinationRule.metadata.namespace || '', destinationRule.spec.host, isValid))),
            destinationRule.spec.trafficPolicy && (React.createElement("div", null,
                React.createElement("strong", null, "Traffic Policy"),
                React.createElement(DetailObject, { name: "", detail: destinationRule.spec.trafficPolicy })))));
    };
    DestinationRuleDetail.prototype.render = function () {
        return (React.createElement(Row, { className: "row-cards-pf" },
            React.createElement(Col, { xs: 12, sm: 12, md: 3, lg: 3 }, this.rawConfig(this.props.destinationRule)),
            this.props.destinationRule.spec.subsets && (React.createElement(Col, { xs: 12, sm: 12, md: 3, lg: 3 },
                React.createElement(Row, { className: "card-pf-body", key: 'destinationRulesSubsets' },
                    React.createElement(Col, null,
                        React.createElement("strong", null, " Subsets : "),
                        this.generateSubsets(this.props.destinationRule.spec.subsets)))))));
    };
    return DestinationRuleDetail;
}(React.Component));
export default DestinationRuleDetail;
//# sourceMappingURL=DestinationRuleDetail.js.map