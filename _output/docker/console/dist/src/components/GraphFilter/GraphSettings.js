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
import { Button, Icon, OverlayTrigger, Popover } from 'patternfly-react';
import { style } from 'typestyle';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HistoryManager, URLParam } from '../../app/History';
import { GraphFilterActions } from '../../actions/GraphFilterActions';
import { GraphType } from '../../types/Graph';
import { PfColors } from '../Pf/PfColors';
var GraphSettings = /** @class */ (function (_super) {
    __extends(GraphSettings, _super);
    function GraphSettings(props) {
        var _this = _super.call(this, props) || this;
        // Let URL override current redux state at construction time. Update URL with unset params.
        var urlInjectServiceNodes = HistoryManager.getBooleanParam(URLParam.GRAPH_SERVICE_NODES);
        if (urlInjectServiceNodes !== undefined) {
            if (urlInjectServiceNodes !== props.showServiceNodes) {
                props.toggleServiceNodes();
            }
        }
        else {
            HistoryManager.setParam(URLParam.GRAPH_SERVICE_NODES, String(_this.props.showServiceNodes));
        }
        return _this;
    }
    GraphSettings.prototype.componentDidUpdate = function (_prevProps) {
        // ensure redux state and URL are aligned
        HistoryManager.setParam(URLParam.GRAPH_SERVICE_NODES, String(this.props.showServiceNodes));
    };
    GraphSettings.prototype.render = function () {
        // map our attributes from redux
        var _a = this.props, showCircuitBreakers = _a.showCircuitBreakers, showMissingSidecars = _a.showMissingSidecars, showNodeLabels = _a.showNodeLabels, showSecurity = _a.showSecurity, showServiceNodes = _a.showServiceNodes, showTrafficAnimation = _a.showTrafficAnimation, showUnusedNodes = _a.showUnusedNodes, showVirtualServices = _a.showVirtualServices;
        // map our dispatchers for redux
        var _b = this.props, toggleGraphCircuitBreakers = _b.toggleGraphCircuitBreakers, toggleGraphMissingSidecars = _b.toggleGraphMissingSidecars, toggleGraphNodeLabels = _b.toggleGraphNodeLabels, toggleGraphSecurity = _b.toggleGraphSecurity, toggleGraphVirtualServices = _b.toggleGraphVirtualServices, toggleServiceNodes = _b.toggleServiceNodes, toggleTrafficAnimation = _b.toggleTrafficAnimation, toggleUnusedNodes = _b.toggleUnusedNodes;
        var visibilityLayers = [
            {
                id: 'filterNodes',
                labelText: 'Node Names',
                value: showNodeLabels,
                onChange: toggleGraphNodeLabels
            },
            {
                id: 'filterServiceNodes',
                disabled: this.props.graphType === GraphType.SERVICE,
                labelText: 'Service Nodes',
                value: showServiceNodes,
                onChange: toggleServiceNodes
            },
            {
                id: 'filterTrafficAnimation',
                labelText: 'Traffic Animation',
                value: showTrafficAnimation,
                onChange: toggleTrafficAnimation
            },
            {
                id: 'filterUnusedNodes',
                labelText: 'Unused Nodes',
                value: showUnusedNodes,
                onChange: toggleUnusedNodes
            }
        ];
        var badges = [
            {
                id: 'filterCB',
                labelText: 'Circuit Breakers',
                value: showCircuitBreakers,
                onChange: toggleGraphCircuitBreakers
            },
            {
                id: 'filterVS',
                labelText: 'Virtual Services',
                value: showVirtualServices,
                onChange: toggleGraphVirtualServices
            },
            {
                id: 'filterSidecars',
                labelText: 'Missing Sidecars',
                value: showMissingSidecars,
                onChange: toggleGraphMissingSidecars
            },
            {
                id: 'filterSecurity',
                labelText: 'Security',
                value: showSecurity,
                onChange: toggleGraphSecurity
            }
        ];
        var checkboxStyle = style({ marginLeft: 5 });
        var disabledCheckboxStyle = style({ marginLeft: 5, color: PfColors.Gray });
        var displaySettingItems = visibilityLayers.map(function (item) { return (React.createElement("div", { id: item.id, key: item.id },
            React.createElement("label", null,
                React.createElement("input", { type: "checkbox", checked: item.value, onChange: function () { return item.onChange(); }, disabled: item.disabled }),
                React.createElement("span", { className: item.disabled ? disabledCheckboxStyle : checkboxStyle }, item.labelText)))); });
        var badgeItems = badges.map(function (item) { return (
        // @todo: consolidate into single function
        React.createElement("div", { id: item.id, key: item.id },
            React.createElement("label", null,
                React.createElement("input", { type: "checkbox", checked: item.value, onChange: function () { return item.onChange(); } }),
                React.createElement("span", { className: checkboxStyle }, item.labelText)))); });
        var spacerStyle = style({
            height: '1em'
        });
        var graphSettingsPopover = (React.createElement(Popover, { id: "layers-popover" },
            displaySettingItems,
            React.createElement("div", { className: spacerStyle }),
            React.createElement("label", null, "Badges:"),
            badgeItems,
            React.createElement("div", { className: spacerStyle })));
        return (React.createElement(OverlayTrigger, { overlay: graphSettingsPopover, placement: "bottom", trigger: ['click'], rootClose: true },
            React.createElement(Button, { className: "dropdown button-group", id: "graph_settings" },
                "Display ",
                React.createElement(Icon, { name: "angle-down" }))));
    };
    GraphSettings.contextTypes = {
        router: function () { return null; }
    };
    return GraphSettings;
}(React.PureComponent));
// Allow Redux to map sections of our global app state to our props
var mapStateToProps = function (state) { return ({
    showCircuitBreakers: state.graph.filterState.showCircuitBreakers,
    showMissingSidecars: state.graph.filterState.showMissingSidecars,
    showNodeLabels: state.graph.filterState.showNodeLabels,
    showSecurity: state.graph.filterState.showSecurity,
    showServiceNodes: state.graph.filterState.showServiceNodes,
    showTrafficAnimation: state.graph.filterState.showTrafficAnimation,
    showUnusedNodes: state.graph.filterState.showUnusedNodes,
    showVirtualServices: state.graph.filterState.showVirtualServices
}); };
// Map our actions to Redux
var mapDispatchToProps = function (dispatch) {
    return {
        toggleGraphCircuitBreakers: bindActionCreators(GraphFilterActions.toggleGraphCircuitBreakers, dispatch),
        toggleGraphMissingSidecars: bindActionCreators(GraphFilterActions.toggleGraphMissingSidecars, dispatch),
        toggleGraphNodeLabels: bindActionCreators(GraphFilterActions.toggleGraphNodeLabel, dispatch),
        toggleGraphSecurity: bindActionCreators(GraphFilterActions.toggleGraphSecurity, dispatch),
        toggleGraphVirtualServices: bindActionCreators(GraphFilterActions.toggleGraphVirtualServices, dispatch),
        toggleServiceNodes: bindActionCreators(GraphFilterActions.toggleServiceNodes, dispatch),
        toggleTrafficAnimation: bindActionCreators(GraphFilterActions.toggleTrafficAnimation, dispatch),
        toggleUnusedNodes: bindActionCreators(GraphFilterActions.toggleUnusedNodes, dispatch)
    };
};
// hook up to Redux for our State to be mapped to props
var GraphSettingsContainer = connect(mapStateToProps, mapDispatchToProps)(GraphSettings);
export default GraphSettingsContainer;
//# sourceMappingURL=GraphSettings.js.map