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
import * as resolve from 'table-resolver';
import { checkForPath, highestSeverity, severityToColor, severityToIconName } from '../../../types/ServiceInfo';
import { BulletChart, Col, Icon, OverlayTrigger, Popover, Row, Table, Tooltip } from 'patternfly-react';
import DetailObject from '../../../components/Details/DetailObject';
import { PfColors } from '../../../components/Pf/PfColors';
import { Link } from 'react-router-dom';
var PFBlueColors = [
    PfColors.Blue,
    PfColors.Blue500,
    PfColors.Blue600,
    PfColors.Blue300,
    PfColors.Blue200,
    PfColors.Blue100
];
var VirtualServiceRoute = /** @class */ (function (_super) {
    __extends(VirtualServiceRoute, _super);
    function VirtualServiceRoute() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cellFormat = function (value) { return React.createElement(Table.Cell, null, value); };
        _this.headerFormat = function (label, _a) {
            var column = _a.column;
            var className = column.property || column.header.label.toLowerCase();
            var colSpan = column.header && column.header.props ? column.header.props.colSpan || '' : '';
            return (React.createElement(Table.Heading, { colSpan: colSpan, className: className }, label));
        };
        return _this;
    }
    VirtualServiceRoute.prototype.columns = function () {
        return {
            columns: [
                {
                    header: {
                        label: 'Status',
                        formatters: [this.headerFormat],
                        props: {
                            colSpan: 1
                        }
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    },
                    children: [
                        {
                            property: 'status.value',
                            header: {
                                label: '',
                                formatters: [this.headerFormat]
                            },
                            cell: {
                                formatters: [this.cellFormat]
                            }
                        }
                    ]
                },
                {
                    header: {
                        label: 'Destination',
                        formatters: [this.headerFormat],
                        props: {
                            colSpan: 3
                        }
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    },
                    children: [
                        {
                            property: 'destination.host',
                            header: {
                                label: 'Host',
                                formatters: [this.headerFormat]
                            },
                            cell: {
                                formatters: [this.cellFormat]
                            }
                        },
                        {
                            property: 'destination.subset',
                            header: {
                                label: 'Subset',
                                formatters: [this.headerFormat]
                            },
                            cell: {
                                formatters: [this.cellFormat]
                            }
                        },
                        {
                            property: 'destination.port',
                            header: {
                                label: 'Port',
                                formatters: [this.headerFormat]
                            },
                            cell: {
                                formatters: [this.cellFormat]
                            }
                        }
                    ]
                },
                {
                    header: {
                        label: 'Weights',
                        formatters: [this.headerFormat],
                        props: {
                            colSpan: 1
                        }
                    },
                    cell: {
                        formatters: [this.cellFormat]
                    },
                    children: [
                        {
                            property: 'weight.value',
                            header: {
                                label: '',
                                formatters: [this.headerFormat]
                            },
                            cell: {
                                formatters: [this.cellFormat]
                            }
                        }
                    ]
                }
            ]
        };
    };
    VirtualServiceRoute.prototype.rows = function (route, routeIndex) {
        var _this = this;
        return (route.route || []).map(function (routeItem, destinationIndex) {
            var statusFrom = _this.statusFrom(_this.validation(), routeItem, routeIndex, destinationIndex);
            var isValid = statusFrom === '' ? true : false;
            return {
                id: destinationIndex,
                status: { value: statusFrom },
                weight: { value: routeItem.weight ? routeItem.weight : '-' },
                destination: _this.destinationFrom(routeItem, destinationIndex, isValid)
            };
        });
    };
    VirtualServiceRoute.prototype.validation = function () {
        return this.props.validation ? this.props.validation : {};
    };
    VirtualServiceRoute.prototype.statusFrom = function (validation, routeItem, routeIndex, destinationIndex) {
        var checks = checkForPath(validation, 'spec/' +
            this.props.kind.toLowerCase() +
            '[' +
            routeIndex +
            ']/route[' +
            destinationIndex +
            ']/weight/' +
            routeItem.weight);
        checks.push.apply(checks, checkForPath(validation, 'spec/' + this.props.kind.toLowerCase() + '[' + routeIndex + ']/route[' + destinationIndex + ']/destination'));
        var severity = highestSeverity(checks);
        var iconName = severity ? severityToIconName(severity) : 'ok';
        if (iconName !== 'ok') {
            return (React.createElement(OverlayTrigger, { placement: 'left', overlay: this.infotipContent(checks), trigger: ['hover', 'focus'], rootClose: false },
                React.createElement(Icon, { type: "pf", name: iconName })));
        }
        else {
            return '';
        }
    };
    VirtualServiceRoute.prototype.serviceLink = function (namespace, host, isValid) {
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
    VirtualServiceRoute.prototype.destinationFrom = function (destinationWeight, _i, isValid) {
        var destination = destinationWeight.destination;
        if (destination) {
            return {
                host: this.serviceLink(this.props.namespace, destination.host, isValid),
                subset: destination.subset || '-',
                port: destination.port ? destination.port.number || '-' : '-'
            };
        }
        else {
            return { host: '-', subset: '-', port: '-' };
        }
    };
    VirtualServiceRoute.prototype.infotipContent = function (checks) {
        var _this = this;
        return (React.createElement(Popover, { id: this.props.name + '-weight-tooltip' }, checks.map(function (check, index) {
            return _this.objectCheckToHtml(check, index);
        })));
    };
    VirtualServiceRoute.prototype.objectCheckToHtml = function (object, i) {
        return (React.createElement(Row, { key: 'objectCheck-' + i },
            React.createElement(Col, { xs: 1 },
                React.createElement(Icon, { type: "pf", name: severityToIconName(object.severity) })),
            React.createElement(Col, { xs: 10, style: { marginLeft: '-20px' } }, object.message)));
    };
    VirtualServiceRoute.prototype.bulletChartValues = function (routes) {
        var _this = this;
        return (routes.route || []).map(function (destinationWeight, u) { return ({
            value: routes.route && routes.route.length === 1 ? 100 : destinationWeight.weight,
            title: u + "_" + destinationWeight.weight,
            color: PFBlueColors[u % PFBlueColors.length],
            tooltipFunction: function () {
                var badges = _this.renderDestination(destinationWeight.destination);
                return (React.createElement(Tooltip, { id: u + "_" + destinationWeight.weight, key: u + "_" + destinationWeight.weight },
                    React.createElement("div", { className: "label-collection" }, badges)));
            }
        }); });
    };
    VirtualServiceRoute.prototype.renderDestination = function (destination) {
        if (destination) {
            return (React.createElement("ul", { style: { listStyleType: 'none', paddingLeft: '15px' } },
                React.createElement("li", null,
                    "Host: ",
                    destination.host || '-',
                    " "),
                React.createElement("li", null,
                    "Subset: ",
                    destination.subset || '-',
                    " "),
                React.createElement("li", null,
                    "Port: ",
                    destination.port ? destination.port.number : '-',
                    " ")));
        }
        else {
            return undefined;
        }
    };
    VirtualServiceRoute.prototype.renderTable = function (route, i) {
        var resolvedColumns = resolve.columnChildren(this.columns());
        var resolvedRows = resolve.resolve({
            columns: resolvedColumns,
            method: resolve.nested
        })(this.rows(route, i));
        return (React.createElement("div", { key: 'bulletchart-wrapper-' + i, style: { marginTop: '30px' } },
            (route.route || []).length > 1 && (React.createElement("div", null,
                React.createElement(BulletChart, { key: 'bullet-chart-' + i, label: "Weight sum", stacked: true, thresholdWarning: -1, thresholdError: -1, values: this.bulletChartValues(route), ranges: [{ value: 100 }] }))),
            React.createElement(Table.PfProvider, { columns: resolvedColumns, striped: true, bordered: true, hover: true, dataTable: true },
                React.createElement(Table.Header, { headerRows: resolve.headerRows(this.columns()) }),
                React.createElement(Table.Body, { rows: resolvedRows, rowKey: "id" }))));
    };
    VirtualServiceRoute.prototype.routeStatusMessage = function (_route, routeIndex) {
        var checks = checkForPath(this.validation(), 'spec/' + this.props.kind.toLowerCase() + '[' + routeIndex + ']/route');
        var severity = highestSeverity(checks);
        return {
            message: checks.map(function (check) { return check.message; }).join(','),
            icon: severityToIconName(severity),
            color: severityToColor(severity)
        };
    };
    VirtualServiceRoute.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null, (this.props.routes || []).map(function (route, i) { return (React.createElement("div", { key: 'virtualservice-rule' + i, className: "row-cards-pf" },
            React.createElement(Row, null,
                React.createElement(Col, { xs: 12, sm: 12, md: 3, lg: 3 },
                    React.createElement(DetailObject, { name: _this.props.kind + ' Route', detail: route, exclude: ['route'], validation: _this.routeStatusMessage(route, i) })),
                React.createElement(Col, { xs: 12, sm: 12, md: 5, lg: 5 }, _this.renderTable(route, i))),
            React.createElement("hr", null))); })));
    };
    return VirtualServiceRoute;
}(React.Component));
export default VirtualServiceRoute;
//# sourceMappingURL=VirtualServiceRoute.js.map