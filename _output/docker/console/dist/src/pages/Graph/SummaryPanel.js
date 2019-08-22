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
import { Icon } from 'patternfly-react';
import { style } from 'typestyle';
import SummaryPanelEdge from './SummaryPanelEdge';
import SummaryPanelGraph from './SummaryPanelGraph';
import SummaryPanelGroup from './SummaryPanelGroup';
import SummaryPanelNode from './SummaryPanelNode';
var expandedStyle = style({
    fontSize: '74%',
    paddingTop: '1em',
    position: 'relative',
    height: "73%"
});
var collapsedStyle = style({
    fontSize: '74%',
    paddingTop: '1em',
    position: 'relative',
    $nest: {
        '& > .panel': {
            display: 'none'
        }
    }
});
var toggleSidePanelStyle = style({
    backgroundColor: 'white',
    border: '1px #ddd solid',
    borderRadius: '3px',
    cursor: 'pointer',
    left: '-1.7em',
    minWidth: '5em',
    position: 'absolute',
    textAlign: 'center',
    top: '6.5em',
    transform: 'rotate(-90deg)',
    transformOrigin: 'left top 0'
});
var SummaryPanel = /** @class */ (function (_super) {
    __extends(SummaryPanel, _super);
    function SummaryPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.togglePanel = function () {
            _this.setState(function (state) { return ({
                isVisible: !state.isVisible
            }); });
        };
        _this.state = {
            isVisible: true
        };
        return _this;
    }
    SummaryPanel.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.data.summaryTarget !== this.props.data.summaryTarget) {
            this.setState({ isVisible: true });
        }
    };
    SummaryPanel.prototype.render = function () {
        if (!this.props.isPageVisible || !this.props.data.summaryTarget) {
            return null;
        }
        return (React.createElement("div", { className: this.state.isVisible ? expandedStyle : collapsedStyle },
            React.createElement("div", { className: toggleSidePanelStyle, onClick: this.togglePanel }, this.state.isVisible ? (React.createElement(React.Fragment, null,
                React.createElement(Icon, { name: "angle-double-down" }),
                " Hide")) : (React.createElement(React.Fragment, null,
                React.createElement(Icon, { name: "angle-double-up" }),
                " Show"))),
            this.props.data.summaryType === 'edge' ? React.createElement(SummaryPanelEdge, __assign({}, this.props)) : null,
            this.props.data.summaryType === 'graph' ? (React.createElement(SummaryPanelGraph, { data: this.props.data, namespaces: this.props.namespaces, graphType: this.props.graphType, injectServiceNodes: this.props.injectServiceNodes, queryTime: this.props.queryTime, duration: this.props.duration, step: this.props.step, rateInterval: this.props.rateInterval })) : null,
            this.props.data.summaryType === 'group' ? (React.createElement(SummaryPanelGroup, { data: this.props.data, namespaces: this.props.data.summaryTarget.namespaces, graphType: this.props.graphType, injectServiceNodes: this.props.injectServiceNodes, queryTime: this.props.queryTime, duration: this.props.duration, step: this.props.step, rateInterval: this.props.rateInterval })) : null,
            this.props.data.summaryType === 'node' ? (React.createElement(SummaryPanelNode, { data: this.props.data, queryTime: this.props.queryTime, namespaces: this.props.namespaces, graphType: this.props.graphType, injectServiceNodes: this.props.injectServiceNodes, duration: this.props.duration, step: this.props.step, rateInterval: this.props.rateInterval })) : null));
    };
    return SummaryPanel;
}(React.Component));
export default SummaryPanel;
//# sourceMappingURL=SummaryPanel.js.map