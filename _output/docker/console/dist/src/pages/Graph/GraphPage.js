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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FlexView from 'react-flexview';
import { Breadcrumb, Button, Icon, OverlayTrigger, Tooltip } from 'patternfly-react';
import { style } from 'typestyle';
import { store } from '../../store/ConfigStore';
import { NodeType } from '../../types/Graph';
import { EdgeLabelMode } from '../../types/GraphFilter';
import { computePrometheusRateParams } from '../../services/Prometheus';
import { makeCancelablePromise } from '../../utils/CancelablePromises';
import * as MessageCenterUtils from '../../utils/MessageCenter';
import CytoscapeGraphContainer from '../../components/CytoscapeGraph/CytoscapeGraph';
import CytoscapeToolbarContainer from '../../components/CytoscapeGraph/CytoscapeToolbar';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import GraphFilterContainer from '../../components/GraphFilter/GraphFilter';
import GraphLegend from '../../components/GraphFilter/GraphLegend';
import StatefulTour from '../../components/Tour/StatefulTour';
import EmptyGraphLayoutContainer from '../../components/EmptyGraphLayout';
import SummaryPanel from './SummaryPanel';
import { MyTablePage } from './ MyTablePage';
import graphHelp from './GraphHelpTour';
import { arrayEquals } from '../../utils/Common';
import { getFocusSelector, isKioskMode } from '../../utils/SearchParamUtils';
import { activeNamespacesSelector, durationSelector, edgeLabelModeSelector, graphDataSelector, graphTypeSelector, meshWideMTLSEnabledSelector, refreshIntervalSelector } from '../../store/Selectors';
import GraphDataThunkActions from '../../actions/GraphDataThunkActions';
import { GraphActions } from '../../actions/GraphActions';
import { GraphFilterActions } from '../../actions/GraphFilterActions';
import { NodeContextMenuContainer } from '../../components/CytoscapeGraph/ContextMenu/NodeContextMenu';
import { GlobalActions } from '../../actions/GlobalActions';
var NUMBER_OF_DATAPOINTS = 30;
var containerStyle = style({
    minHeight: '350px',
    // TODO: try flexbox to remove this calc
    height: 'calc(100vh - 113px)' // View height minus top bar height minus secondary masthead
});
var kioskContainerStyle = style({
    minHeight: '350px',
    height: 'calc(100vh - 10px)' // View height minus top bar height
});
var cytoscapeGraphContainerStyle = style({ flex: '1', minWidth: '350px', zIndex: 0, paddingRight: '5px' });
var cytoscapeGraphWrapperDivStyle = style({ position: 'relative' });
var cytoscapeToolbarWrapperDivStyle = style({
    position: 'absolute',
    bottom: '26%',
    left: '-13px',
    zIndex: 2,
    boxShadow: '2px 2px 6px 0 grey',
});
// benjykim
var cytoscapeTableWrapperDivStyle = style({
    position: 'absolute',
    width: '101%',
    height: '25%',
    bottom: '10px',
    left: '-13px',
    fontSize: '12px',
    overflow: 'scroll',
    display: 'block',
    zIndex: 1,
});
var graphToolbarStyle = style({
    right: '0',
    bottom: '10px',
    zIndex: 9999,
    position: 'absolute',
    overflow: 'hidden'
});
var GraphErrorBoundaryFallback = function () {
    return (React.createElement("div", { className: cytoscapeGraphContainerStyle },
        React.createElement(EmptyGraphLayoutContainer, { namespaces: [], isError: true })));
};
var timeDisplayOptions = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};
var GraphPage = /** @class */ (function (_super) {
    __extends(GraphPage, _super);
    function GraphPage(props) {
        var _this = _super.call(this, props) || this;
        _this.handleRefreshClick = function () {
            _this.scheduleNextPollingInterval(0);
        };
        _this.toggleHelp = function () {
            if (_this.props.showLegend) {
                _this.props.toggleLegend();
            }
            _this.setState({
                showHelp: !_this.state.showHelp
            });
        };
        _this.loadGraphDataFromBackend = function () {
            var promise = _this.props.fetchGraphData(_this.props.node ? [_this.props.node.namespace] : _this.props.activeNamespaces, _this.props.duration, _this.props.graphType, _this.props.showServiceNodes, _this.props.edgeLabelMode, _this.props.showSecurity, _this.props.showUnusedNodes, _this.props.node);
            _this.pollPromise = makeCancelablePromise(promise);
            _this.pollPromise.promise
                .then(function () {
                _this.props.setLastRefreshAt(Date.now());
                _this.scheduleNextPollingIntervalFromProps();
            })
                .catch(function (error) {
                if (!error.isCanceled) {
                    _this.scheduleNextPollingIntervalFromProps();
                }
            });
        };
        _this.notifyError = function (error, _componentStack) {
            MessageCenterUtils.add("There was an error when rendering the graph: " + error.message + ", please try a different layout");
        };
        _this.errorBoundaryRef = React.createRef();
        _this.cytoscapeGraphRef = React.createRef();
        _this.state = {
            showHelp: false
        };
        // Let URL override current redux state at construction time
        // Note that state updates will not be posted until until after the first render
        var urlNode = GraphPage.getNodeParamsFromProps(props);
        if (GraphPage.isNodeChanged(urlNode, props.node)) {
            props.setNode(urlNode);
        }
        return _this;
    }
    GraphPage.getNodeParamsFromProps = function (props) {
        var app = props.match.params.app;
        var appOk = app && app !== 'unknown' && app !== 'undefined';
        var namespace = props.match.params.namespace;
        var namespaceOk = namespace && namespace !== 'unknown' && namespace !== 'undefined';
        var service = props.match.params.service;
        var serviceOk = service && service !== 'unknown' && service !== 'undefined';
        var workload = props.match.params.workload;
        var workloadOk = workload && workload !== 'unknown' && workload !== 'undefined';
        if (!appOk && !namespaceOk && !serviceOk && !workloadOk) {
            return;
        }
        var nodeType;
        var version;
        if (appOk || workloadOk) {
            nodeType = appOk ? NodeType.APP : NodeType.WORKLOAD;
            version = props.match.params.version;
        }
        else {
            nodeType = NodeType.SERVICE;
            version = '';
        }
        var node = {
            app: app,
            namespace: { name: namespace },
            nodeType: nodeType,
            service: service,
            version: version,
            workload: workload
        };
        return node;
    };
    GraphPage.isNodeChanged = function (prevNode, node) {
        if (prevNode === node) {
            return false;
        }
        if ((prevNode && !node) || (!prevNode && node)) {
            return true;
        }
        if (prevNode && node) {
            var nodeAppHasChanged = prevNode.app !== node.app;
            var nodeServiceHasChanged = prevNode.service !== node.service;
            var nodeVersionHasChanged = prevNode.version !== node.version;
            var nodeTypeHasChanged = prevNode.nodeType !== node.nodeType;
            var nodeWorkloadHasChanged = prevNode.workload !== node.workload;
            return (nodeAppHasChanged ||
                nodeServiceHasChanged ||
                nodeVersionHasChanged ||
                nodeWorkloadHasChanged ||
                nodeTypeHasChanged);
        }
        return false;
    };
    GraphPage.prototype.componentDidMount = function () {
        // This is a special bookmarking case. If the initial URL is for a node graph then
        // defer the graph fetch until the first component update, when the node is set.
        // (note: to avoid direct store access we could parse the URL again, perhaps that
        // is preferable?  We could also move the logic from the constructor, but that
        // would break our pattern of redux/url handling in the components).
        if (!store.getState().graph.node) {
            this.scheduleNextPollingInterval(0);
        }
    };
    GraphPage.prototype.componentWillUnmount = function () {
        this.removePollingIntervalTimer();
    };
    GraphPage.prototype.componentDidUpdate = function (prev) {
        // schedule an immediate graph fetch if needed
        var curr = this.props;
        var activeNamespacesChanged = !arrayEquals(prev.activeNamespaces, curr.activeNamespaces, function (n1, n2) { return n1.name === n2.name; });
        // Ensure we initialize the graph when there is a change to activeNamespaces.
        if (activeNamespacesChanged) {
            this.props.graphChanged();
        }
        if (activeNamespacesChanged ||
            prev.duration !== curr.duration ||
            (prev.edgeLabelMode !== curr.edgeLabelMode &&
                curr.edgeLabelMode === EdgeLabelMode.RESPONSE_TIME_95TH_PERCENTILE) ||
            prev.graphType !== curr.graphType ||
            prev.showServiceNodes !== curr.showServiceNodes ||
            prev.showSecurity !== curr.showSecurity ||
            prev.showUnusedNodes !== curr.showUnusedNodes ||
            GraphPage.isNodeChanged(prev.node, curr.node)) {
            this.scheduleNextPollingInterval(0);
        }
        else if (prev.pollInterval !== curr.pollInterval) {
            this.scheduleNextPollingIntervalFromProps();
        }
        if (prev.layout.name !== curr.layout.name || prev.graphData !== curr.graphData || activeNamespacesChanged) {
            this.errorBoundaryRef.current.cleanError();
        }
        if (curr.showLegend && this.state.showHelp) {
            this.setState({ showHelp: false });
        }
    };
    GraphPage.prototype.render = function () {
        var _this = this;
        var graphEnd = this.props.graphTimestamp * 1000;
        var graphStart = graphEnd - this.props.graphDuration * 1000;
        var conStyle = containerStyle;
        if (isKioskMode()) {
            conStyle = kioskContainerStyle;
        }
        var focusSelector = getFocusSelector();
        return (React.createElement(React.Fragment, null,
            React.createElement(StatefulTour, { steps: graphHelp, isOpen: this.state.showHelp, onClose: this.toggleHelp }),
            React.createElement(FlexView, { className: conStyle, column: true },
                React.createElement("div", null,
                    React.createElement(Breadcrumb, { title: true },
                        React.createElement(Breadcrumb.Item, { active: true },
                            this.props.node && this.props.node.nodeType !== NodeType.UNKNOWN
                                ? "Graph for " + this.props.node.nodeType + ": " + this.getTitle(this.props.node)
                                : 'Graph',
                            React.createElement(OverlayTrigger, { key: 'graph-tour-help-ot', placement: "right", overlay: React.createElement(Tooltip, { id: 'graph-tour-help-tt' }, "Graph help tour...") },
                                React.createElement(Button, { bsStyle: "link", style: { paddingLeft: '6px' }, onClick: this.toggleHelp },
                                    React.createElement(Icon, { type: "pf", name: "help" })))),
                        this.props.graphTimestamp > 0 && (React.createElement("span", { className: 'pull-right' },
                            new Date(graphStart).toLocaleDateString(undefined, timeDisplayOptions),
                            ' ... ',
                            new Date(graphEnd).toLocaleDateString(undefined, timeDisplayOptions))))),
                React.createElement("div", null,
                    React.createElement(GraphFilterContainer, { disabled: this.props.isLoading, onRefresh: this.handleRefreshClick })),
                React.createElement(FlexView, { grow: true, className: cytoscapeGraphWrapperDivStyle },
                    React.createElement(ErrorBoundary, { ref: this.errorBoundaryRef, onError: this.notifyError, fallBackComponent: React.createElement(GraphErrorBoundaryFallback, null) },
                        React.createElement(CytoscapeGraphContainer, { refresh: this.handleRefreshClick, containerClassName: cytoscapeGraphContainerStyle, ref: function (refInstance) { return _this.setCytoscapeGraph(refInstance); }, isMTLSEnabled: this.props.mtlsEnabled, focusSelector: focusSelector, contextMenuNodeComponent: NodeContextMenuContainer, contextMenuGroupComponent: NodeContextMenuContainer }),
                        this.props.summaryData && this.props.graphData.nodes && Object.keys(this.props.graphData.nodes).length > 0 && !this.props.isError && (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: cytoscapeToolbarWrapperDivStyle },
                                React.createElement(CytoscapeToolbarContainer, { cytoscapeGraphRef: this.cytoscapeGraphRef })),
                            React.createElement("div", { className: cytoscapeTableWrapperDivStyle },
                                React.createElement(MyTablePage, __assign({ data: this.props.summaryData, namespaces: this.props.activeNamespaces, graphType: this.props.graphType, injectServiceNodes: this.props.showServiceNodes, queryTime: this.props.graphTimestamp, duration: this.props.graphDuration }, computePrometheusRateParams(this.props.duration, NUMBER_OF_DATAPOINTS))))))),
                    this.props.summaryData && (React.createElement(SummaryPanel, __assign({ data: this.props.summaryData, namespaces: this.props.activeNamespaces, graphType: this.props.graphType, injectServiceNodes: this.props.showServiceNodes, queryTime: this.props.graphTimestamp, duration: this.props.graphDuration, isPageVisible: this.props.isPageVisible }, computePrometheusRateParams(this.props.duration, NUMBER_OF_DATAPOINTS)))),
                    this.props.showLegend && (React.createElement(GraphLegend, { className: graphToolbarStyle, isMTLSEnabled: this.props.mtlsEnabled, closeLegend: this.props.toggleLegend }))))));
    };
    GraphPage.prototype.getTitle = function (node) {
        if (node.nodeType === NodeType.APP) {
            var title = node.app;
            if (node.version) {
                title += ' - ' + node.version;
            }
            return title;
        }
        else if (node.nodeType === NodeType.SERVICE) {
            return node.service;
        }
        else if (node.nodeType === NodeType.WORKLOAD) {
            return node.workload;
        }
        return 'unknown';
    };
    GraphPage.prototype.setCytoscapeGraph = function (cytoscapeGraph) {
        this.cytoscapeGraphRef.current = cytoscapeGraph ? cytoscapeGraph.getWrappedInstance() : null;
    };
    GraphPage.prototype.scheduleNextPollingIntervalFromProps = function () {
        if (this.props.pollInterval > 0) {
            this.scheduleNextPollingInterval(this.props.pollInterval);
        }
        else {
            this.removePollingIntervalTimer();
        }
    };
    GraphPage.prototype.scheduleNextPollingInterval = function (pollInterval) {
        // Remove any pending timeout to avoid having multiple requests at once
        this.removePollingIntervalTimer();
        if (pollInterval === 0) {
            this.loadGraphDataFromBackend();
        }
        else {
            // We are using setTimeout instead of setInterval because we have more control over it
            // e.g. If a request takes much time, the next interval will fire up anyway and is
            // possible that it will take much time as well. Instead wait for it to timeout/error to
            // try again.
            this.pollTimeoutRef = window.setTimeout(this.loadGraphDataFromBackend, pollInterval);
        }
    };
    GraphPage.prototype.removePollingIntervalTimer = function () {
        if (this.pollTimeoutRef) {
            clearTimeout(this.pollTimeoutRef);
            this.pollTimeoutRef = undefined;
        }
        if (this.pollPromise) {
            this.pollPromise.cancel();
            this.pollPromise = undefined;
        }
    };
    return GraphPage;
}(React.Component));
export { GraphPage };
var mapStateToProps = function (state) { return ({
    activeNamespaces: activeNamespacesSelector(state),
    duration: durationSelector(state),
    edgeLabelMode: edgeLabelModeSelector(state),
    graphData: graphDataSelector(state),
    graphDuration: state.graph.graphDataDuration,
    graphTimestamp: state.graph.graphDataTimestamp,
    graphType: graphTypeSelector(state),
    isError: state.graph.isError,
    isLoading: state.graph.isLoading,
    isPageVisible: state.globalState.isPageVisible,
    layout: state.graph.layout,
    node: state.graph.node,
    pollInterval: refreshIntervalSelector(state),
    showLegend: state.graph.filterState.showLegend,
    showSecurity: state.graph.filterState.showSecurity,
    showServiceNodes: state.graph.filterState.showServiceNodes,
    showUnusedNodes: state.graph.filterState.showUnusedNodes,
    summaryData: state.graph.summaryData,
    mtlsEnabled: meshWideMTLSEnabledSelector(state)
}); };
var mapDispatchToProps = function (dispatch) { return ({
    fetchGraphData: function (namespaces, duration, graphType, injectServiceNodes, edgeLabelMode, showSecurity, showUnusedNodes, node) {
        return dispatch(GraphDataThunkActions.fetchGraphData(namespaces, duration, graphType, injectServiceNodes, edgeLabelMode, showSecurity, showUnusedNodes, node));
    },
    graphChanged: bindActionCreators(GraphActions.changed, dispatch),
    setNode: bindActionCreators(GraphActions.setNode, dispatch),
    toggleLegend: bindActionCreators(GraphFilterActions.toggleLegend, dispatch),
    setLastRefreshAt: bindActionCreators(GlobalActions.setLastRefreshAt, dispatch)
}); };
var GraphPageContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(GraphPage));
export default GraphPageContainer;
//# sourceMappingURL=GraphPage.js.map