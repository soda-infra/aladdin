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
import { Link } from 'react-router-dom';
import LocalTime from '../../../components/Time/LocalTime';
import * as resolve from 'table-resolver';
import Labels from '../../../components/Label/Labels';
var WorkloadServices = /** @class */ (function (_super) {
    __extends(WorkloadServices, _super);
    function WorkloadServices(props) {
        var _this = _super.call(this, props) || this;
        _this.headerFormat = function (label, _a) {
            var column = _a.column;
            return React.createElement(Table.Heading, { className: column.property }, label);
        };
        _this.cellFormat = function (value) {
            return React.createElement(Table.Cell, null, value);
        };
        _this.state = {};
        return _this;
    }
    WorkloadServices.prototype.columns = function () {
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
                    property: 'type',
                    header: {
                        label: 'Type',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'labels',
                    header: {
                        label: 'Labels',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'resourceVersion',
                    header: {
                        label: 'Resource Version',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'ip',
                    header: {
                        label: 'Ip',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'ports',
                    header: {
                        label: 'Ports',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                }
            ]
        };
    };
    WorkloadServices.prototype.overviewLink = function (service) {
        return (React.createElement(Link, { to: "/namespaces/" + this.props.namespace + "/services/" + service.name, key: 'WorkloadServiceItem_' + this.props.namespace + '_' + service.name }, service.name));
    };
    WorkloadServices.prototype.renderPorts = function (ports) {
        return (React.createElement("ul", { style: { listStyleType: 'none' } }, (ports || []).map(function (port, i) { return (React.createElement("li", { key: 'port_' + i },
            port.protocol,
            " ",
            port.name,
            " (",
            port.port,
            ")")); })));
    };
    WorkloadServices.prototype.rows = function () {
        var _this = this;
        return (this.props.services || []).map(function (service, vsIdx) {
            var generateRows = {
                id: vsIdx,
                name: _this.overviewLink(service),
                createdAt: React.createElement(LocalTime, { time: service.createdAt }),
                type: service.type,
                labels: React.createElement(Labels, { key: 'pod_' + vsIdx, labels: service.labels }),
                resourceVersion: service.resourceVersion,
                ip: service.ip,
                ports: _this.renderPorts(service.ports || [])
            };
            return generateRows;
        });
    };
    WorkloadServices.prototype.render = function () {
        return (React.createElement(Row, { className: "card-pf-body" },
            React.createElement(Col, { xs: 12 },
                React.createElement(Table.PfProvider, { columns: this.columns().columns, striped: true, bordered: true, hover: true, dataTable: true },
                    React.createElement(Table.Header, { headerRows: resolve.headerRows(this.columns()) }),
                    React.createElement(Table.Body, { rows: this.rows(), rowKey: "id" })))));
    };
    return WorkloadServices;
}(React.Component));
export default WorkloadServices;
//# sourceMappingURL=WorkloadServices.js.map