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
import * as resolve from 'table-resolver';
import LocalTime from '../../../components/Time/LocalTime';
import MissingSidecar from '../../../components/MissingSidecar/MissingSidecar';
import Labels from '../../../components/Label/Labels';
var ServiceInfoWorkload = /** @class */ (function (_super) {
    __extends(ServiceInfoWorkload, _super);
    function ServiceInfoWorkload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.headerFormat = function (label, _a) {
            var column = _a.column;
            return React.createElement(Table.Heading, { className: column.property }, label);
        };
        _this.cellFormat = function (value) {
            return React.createElement(Table.Cell, null, value);
        };
        return _this;
    }
    ServiceInfoWorkload.prototype.columns = function () {
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
                    property: 'type',
                    header: {
                        label: 'Type',
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
                }
            ]
        };
    };
    ServiceInfoWorkload.prototype.overviewLink = function (workload) {
        return (React.createElement("span", null,
            React.createElement(Link, { to: "/namespaces/" + this.props.namespace + "/workloads/" + workload.name, key: 'ServiceWorkloadItem_' + this.props.namespace + '_' + workload.name }, workload.name),
            !workload.istioSidecar && React.createElement(MissingSidecar, { tooltip: true, style: { marginLeft: '10px' } })));
    };
    ServiceInfoWorkload.prototype.rows = function () {
        var _this = this;
        return (this.props.workloads || []).map(function (workload, vsIdx) { return ({
            id: vsIdx,
            type: workload.type,
            name: _this.overviewLink(workload),
            createdAt: React.createElement(LocalTime, { time: workload.createdAt }),
            resourceVersion: workload.resourceVersion,
            labels: React.createElement(Labels, { labels: workload.labels })
        }); });
    };
    ServiceInfoWorkload.prototype.renderTable = function () {
        return (React.createElement(Table.PfProvider, { columns: this.columns().columns, striped: true, bordered: true, hover: true, dataTable: true },
            React.createElement(Table.Header, { headerRows: resolve.headerRows(this.columns()) }),
            React.createElement(Table.Body, { rows: this.rows(), rowKey: "id" })));
    };
    ServiceInfoWorkload.prototype.render = function () {
        return (React.createElement(Row, { className: "card-pf-body" },
            React.createElement(Col, { xs: 12 }, this.renderTable())));
    };
    return ServiceInfoWorkload;
}(React.Component));
export default ServiceInfoWorkload;
//# sourceMappingURL=ServiceInfoWorkload.js.map