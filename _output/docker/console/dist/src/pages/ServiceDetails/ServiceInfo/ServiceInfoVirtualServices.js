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
import { Link } from 'react-router-dom';
import './ServiceInfoVirtualServices.css';
import LocalTime from '../../../components/Time/LocalTime';
import { ConfigIndicator } from '../../../components/ConfigValidation/ConfigIndicator';
var ServiceInfoVirtualServices = /** @class */ (function (_super) {
    __extends(ServiceInfoVirtualServices, _super);
    function ServiceInfoVirtualServices() {
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
    ServiceInfoVirtualServices.prototype.columns = function () {
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
    ServiceInfoVirtualServices.prototype.hasValidations = function (virtualService) {
        // This is insane, but doing return to the clause inside the if will cause compiler failure
        return !!this.props.validations && !!this.props.validations[virtualService.metadata.name];
    };
    ServiceInfoVirtualServices.prototype.validation = function (virtualService) {
        return this.props.validations[virtualService.metadata.name];
    };
    ServiceInfoVirtualServices.prototype.overviewLink = function (virtualService) {
        return (React.createElement(Link, { to: '/namespaces/' +
                virtualService.metadata.namespace +
                '/istio/virtualservices/' +
                virtualService.metadata.name +
                '?list=overview' }, virtualService.metadata.name));
    };
    ServiceInfoVirtualServices.prototype.yamlLink = function (virtualService) {
        return (React.createElement(Link, { to: '/namespaces/' +
                virtualService.metadata.namespace +
                '/istio/virtualservices/' +
                virtualService.metadata.name +
                '?list=yaml' }, "View YAML"));
    };
    ServiceInfoVirtualServices.prototype.rows = function () {
        var _this = this;
        return (this.props.virtualServices || []).map(function (virtualService, vsIdx) { return ({
            id: vsIdx,
            status: (React.createElement(ConfigIndicator, { id: vsIdx + '-config-validation', validations: _this.hasValidations(virtualService) ? [_this.validation(virtualService)] : [] })),
            name: _this.overviewLink(virtualService),
            createdAt: React.createElement(LocalTime, { time: virtualService.metadata.creationTimestamp || '' }),
            resourceVersion: virtualService.metadata.resourceVersion,
            actions: _this.yamlLink(virtualService)
        }); });
    };
    ServiceInfoVirtualServices.prototype.renderTable = function () {
        return (React.createElement(Table.PfProvider, { columns: this.columns().columns, striped: true, bordered: true, hover: true, dataTable: true },
            React.createElement(Table.Header, { headerRows: resolve.headerRows(this.columns()) }),
            React.createElement(Table.Body, { rows: this.rows(), rowKey: "id" })));
    };
    ServiceInfoVirtualServices.prototype.render = function () {
        return (React.createElement(Row, { className: "card-pf-body" },
            React.createElement(Col, { xs: 12 }, this.renderTable())));
    };
    return ServiceInfoVirtualServices;
}(React.Component));
export default ServiceInfoVirtualServices;
//# sourceMappingURL=ServiceInfoVirtualServices.js.map