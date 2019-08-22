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
import { ConfigIndicator } from '../../../components/ConfigValidation/ConfigIndicator';
import Labels from '../../../components/Label/Labels';
var WorkloadPods = /** @class */ (function (_super) {
    __extends(WorkloadPods, _super);
    function WorkloadPods() {
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
    WorkloadPods.prototype.columns = function () {
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
                    property: 'createdBy',
                    header: {
                        label: 'Created by',
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
                    property: 'istioInitContainers',
                    header: {
                        label: 'Istio Init Containers',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'istioContainers',
                    header: {
                        label: 'Istio Containers',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                },
                {
                    property: 'podStatus',
                    header: {
                        label: 'Phase',
                        formatters: [this.headerFormat]
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    }
                }
            ]
        };
    };
    WorkloadPods.prototype.rows = function () {
        var _this = this;
        return (this.props.pods || []).map(function (pod, podIdx) {
            var validations = [];
            if (_this.props.validations[pod.name]) {
                validations.push(_this.props.validations[pod.name]);
            }
            return {
                id: podIdx,
                status: React.createElement(ConfigIndicator, { id: podIdx + '-config-validation', validations: validations, definition: true }),
                name: pod.name,
                createdAt: new Date(pod.createdAt).toLocaleString(),
                createdBy: pod.createdBy && pod.createdBy.length > 0
                    ? pod.createdBy.map(function (ref) { return ref.name + ' (' + ref.kind + ')'; }).join(', ')
                    : '',
                labels: React.createElement(Labels, { key: 'labels' + podIdx, labels: pod.labels }),
                istioInitContainers: pod.istioInitContainers ? pod.istioInitContainers.map(function (c) { return "" + c.image; }).join(', ') : '',
                istioContainers: pod.istioContainers ? pod.istioContainers.map(function (c) { return "" + c.image; }).join(', ') : '',
                podStatus: pod.status
            };
        });
    };
    WorkloadPods.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(Row, { className: "card-pf-body" },
                React.createElement(Col, { xs: 12 },
                    React.createElement(Table.PfProvider, { columns: this.columns().columns, striped: true, bordered: true, hover: true, dataTable: true },
                        React.createElement(Table.Header, { headerRows: resolve.headerRows(this.columns()) }),
                        React.createElement(Table.Body, { rows: this.rows(), rowKey: "id" }))))));
    };
    return WorkloadPods;
}(React.Component));
export default WorkloadPods;
//# sourceMappingURL=WorkloadPods.js.map