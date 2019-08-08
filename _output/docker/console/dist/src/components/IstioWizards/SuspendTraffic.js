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
import { Button, Col, Icon, ListView, ListViewIcon, ListViewItem, Row } from 'patternfly-react';
import { style } from 'typestyle';
var wkIconType = 'pf';
var wkIconName = 'bundle';
var SERVICE_UNAVAILABLE = 503;
var listStyle = style({
    marginTop: 10
});
var listHeaderStyle = style({
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: 300,
    color: '#72767b',
    borderTop: '0px !important',
    $nest: {
        '.list-view-pf-main-info': {
            padding: 5
        },
        '.list-group-item-heading': {
            fontWeight: 300,
            textAlign: 'center'
        },
        '.list-group-item-text': {
            textAlign: 'center'
        }
    }
});
var evenlyButtonStyle = style({
    width: '100%',
    textAlign: 'right'
});
var allButtonStyle = style({
    marginBottom: 20,
    marginLeft: 5
});
var SuspendTraffic = /** @class */ (function (_super) {
    __extends(SuspendTraffic, _super);
    function SuspendTraffic(props) {
        var _this = _super.call(this, props) || this;
        _this.resetState = function () {
            var defaultSuspendedRoutes = _this.props.workloads.map(function (workload) {
                return {
                    workload: workload.name,
                    suspended: false,
                    httpStatus: SERVICE_UNAVAILABLE
                };
            });
            _this.setState(function (prevState) {
                return {
                    suspendedRoutes: prevState.suspendedRoutes.length === 0 && _this.props.initSuspendedRoutes.length > 0
                        ? _this.props.initSuspendedRoutes
                        : defaultSuspendedRoutes
                };
            }, function () { return _this.props.onChange(true, _this.state.suspendedRoutes); });
        };
        _this.suspendAll = function () {
            _this.setState({
                suspendedRoutes: _this.props.workloads.map(function (workload) {
                    return {
                        workload: workload.name,
                        suspended: true,
                        httpStatus: SERVICE_UNAVAILABLE
                    };
                })
            }, function () { return _this.props.onChange(true, _this.state.suspendedRoutes); });
        };
        _this.updateRoute = function (workload, suspended) {
            _this.setState(function (prevState) {
                return {
                    suspendedRoutes: prevState.suspendedRoutes.map(function (route) {
                        if (route.workload === workload) {
                            return {
                                workload: route.workload,
                                suspended: suspended,
                                // Note that in a future version we might want to let user to choose the httpStatus
                                httpStatus: SERVICE_UNAVAILABLE
                            };
                        }
                        return route;
                    })
                };
            }, function () { return _this.props.onChange(true, _this.state.suspendedRoutes); });
        };
        _this.state = {
            suspendedRoutes: []
        };
        return _this;
    }
    SuspendTraffic.prototype.componentDidMount = function () {
        this.resetState();
    };
    SuspendTraffic.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement(ListView, { className: listStyle },
                React.createElement(ListViewItem, { className: listHeaderStyle, heading: 'Workload', description: 'Suspended Status' }),
                this.state.suspendedRoutes.map(function (route, id) {
                    return (React.createElement(ListViewItem, { key: 'workload-' + id, leftContent: React.createElement(ListViewIcon, { type: wkIconType, name: wkIconName }), heading: route.workload, description: React.createElement(Row, null,
                            React.createElement(Col, { xs: 12, sm: 12, md: 4, lg: 4 }),
                            React.createElement(Col, { xs: 12, sm: 12, md: 2, lg: 2 }, route.suspended ? 'Suspended' : 'Connected'),
                            React.createElement(Col, { xs: 12, sm: 12, md: 2, lg: 2 },
                                React.createElement(Button, { bsSize: "xsmall", onClick: function () { return _this.updateRoute(route.workload, !route.suspended); } },
                                    React.createElement(Icon, { type: "pf", name: route.suspended ? 'unplugged' : 'plugged' }))),
                            React.createElement(Col, { xs: 12, sm: 12, md: 4, lg: 4 })) }));
                })),
            this.props.workloads.length > 1 && (React.createElement("div", { className: evenlyButtonStyle },
                React.createElement(Button, { className: allButtonStyle, onClick: function () { return _this.resetState(); } }, "Connect All"),
                React.createElement(Button, { className: allButtonStyle, onClick: function () { return _this.suspendAll(); } }, "Suspend All")))));
    };
    return SuspendTraffic;
}(React.Component));
export default SuspendTraffic;
//# sourceMappingURL=SuspendTraffic.js.map