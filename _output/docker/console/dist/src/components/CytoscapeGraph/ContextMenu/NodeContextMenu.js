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
import { JaegerURLSearch } from '../../JaegerIntegration/RouteHelper';
import { Paths } from '../../../config';
import { style } from 'typestyle';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
var graphContextMenuContainerStyle = style({
    textAlign: 'left'
});
var graphContextMenuTitleStyle = style({
    textAlign: 'left',
    fontSize: '16px',
    borderBottom: '1px solid black'
});
var graphContextMenuItemStyle = style({
    textAlign: 'left',
    fontSize: '12px',
    textDecoration: 'none',
    $nest: {
        '&:hover': {
            backgroundColor: '#def3ff',
            color: '#4d5258'
        }
    }
});
var graphContextMenuItemLinkStyle = style({
    color: '#363636'
});
var NodeContextMenu = /** @class */ (function (_super) {
    __extends(NodeContextMenu, _super);
    function NodeContextMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onClick = function (_e) {
            _this.props.contextMenu.hide(0);
        };
        return _this;
    }
    NodeContextMenu.derivedValuesFromProps = function (props) {
        var name = '';
        var type = '';
        switch (props.nodeType) {
            case 'app':
                // Prefer workload type for nodes backed by a workload
                if (props.workload && props.parent) {
                    name = props.workload;
                    type = Paths.WORKLOADS;
                }
                else {
                    type = Paths.APPLICATIONS;
                    name = props.app;
                }
                break;
            case 'service':
                type = props.isServiceEntry ? Paths.SERVICEENTRIES : Paths.SERVICES;
                name = props.service;
                break;
            case 'workload':
                name = props.workload;
                type = Paths.WORKLOADS;
                break;
            default:
        }
        return { type: type, name: name };
    };
    // @todo: We need take care of this at global app level
    NodeContextMenu.prototype.makeDetailsPageUrl = function (type, name) {
        return "/namespaces/" + this.props.namespace + "/" + type + "/" + name;
    };
    NodeContextMenu.prototype.getJaegerURL = function (name) {
        var tracesUrl = "/jaeger?namespaces=" + this.props.namespace + "&service=" + name + "." + this.props.namespace;
        if (!this.props.jaegerIntegration) {
            var url = new JaegerURLSearch(this.props.jaegerURL, false);
            var options = {
                serviceSelected: name + "." + this.props.namespace,
                limit: 20,
                start: '',
                end: '',
                minDuration: '',
                maxDuration: '',
                lookback: '3600',
                tags: ''
            };
            tracesUrl = url.createRoute(options);
        }
        return tracesUrl;
    };
    NodeContextMenu.prototype.createMenuItem = function (href, title, target, external) {
        if (target === void 0) { target = '_self'; }
        if (external === void 0) { external = false; }
        var commonLinkProps = {
            className: graphContextMenuItemLinkStyle,
            children: title,
            onClick: this.onClick,
            target: target
        };
        return (React.createElement("div", { className: graphContextMenuItemStyle }, external ? React.createElement("a", __assign({ href: href }, commonLinkProps)) : React.createElement(Link, __assign({ to: href }, commonLinkProps))));
    };
    NodeContextMenu.prototype.render = function () {
        // Disable context menu if we are dealing with a unknown or an inaccessible node
        if (this.props.nodeType === 'unknown' || this.props.isInaccessible) {
            this.props.contextMenu.disable();
            return null;
        }
        var _a = NodeContextMenu.derivedValuesFromProps(this.props), type = _a.type, name = _a.name;
        var detailsPageUrl = this.makeDetailsPageUrl(type, name);
        return (React.createElement("div", { className: graphContextMenuContainerStyle },
            React.createElement("div", { className: graphContextMenuTitleStyle },
                React.createElement("strong", null, name)),
            this.createMenuItem(detailsPageUrl, 'Show Details'),
            type !== Paths.SERVICEENTRIES && (React.createElement(React.Fragment, null,
                this.createMenuItem(detailsPageUrl + "?tab=traffic", 'Show Traffic'),
                type === Paths.WORKLOADS && this.createMenuItem(detailsPageUrl + "?tab=logs", 'Show Logs'),
                this.createMenuItem(detailsPageUrl + "?tab=" + (type === Paths.SERVICES ? 'metrics' : 'in_metrics'), 'Show Inbound Metrics'),
                type !== Paths.SERVICES &&
                    this.createMenuItem(detailsPageUrl + "?tab=out_metrics", 'Show Outbound Metrics'),
                type === Paths.SERVICES &&
                    this.props.jaegerURL !== '' &&
                    this.createMenuItem(this.getJaegerURL(name), 'Show Traces', this.props.jaegerIntegration ? '_self' : '_blank', !this.props.jaegerIntegration)))));
    };
    return NodeContextMenu;
}(React.PureComponent));
export { NodeContextMenu };
var mapStateToProps = function (state) { return ({
    jaegerIntegration: state.jaegerState ? state.jaegerState.enableIntegration : false,
    jaegerURL: state.jaegerState ? state.jaegerState.jaegerURL : ''
}); };
export var NodeContextMenuContainer = connect(mapStateToProps)(NodeContextMenu);
//# sourceMappingURL=NodeContextMenu.js.map