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
import ReactResizeDetector from 'react-resize-detector';
import history from '../../app/History';
import { GraphHighlighter } from './graphs/GraphHighlighter';
import TrafficRender from './TrafficAnimation/TrafficRenderer';
import EmptyGraphLayoutContainer from '../EmptyGraphLayout';
import { CytoscapeReactWrapper } from './CytoscapeReactWrapper';
import * as CytoscapeGraphUtils from './CytoscapeGraphUtils';
import { CyNode } from './CytoscapeGraphUtils';
import { GraphActions } from '../../actions/GraphActions';
import * as API from '../../services/Api';
import { activeNamespacesSelector, durationSelector, edgeLabelModeSelector, graphDataSelector, graphTypeSelector, refreshIntervalSelector } from '../../store/Selectors';
import { CytoscapeGlobalScratchNamespace, NodeType } from '../../types/Graph';
import * as H from '../../types/Health';
import { MessageType } from '../../types/MessageCenter';
import { makeNodeGraphUrlFromParams } from '../Nav/NavUtils';
import { NamespaceActions } from '../../actions/NamespaceAction';
import GraphThunkActions from '../../actions/GraphThunkActions';
import * as MessageCenterUtils from '../../utils/MessageCenter';
import FocusAnimation from './FocusAnimation';
import { CytoscapeContextMenuWrapper } from './CytoscapeContextMenu';
// exporting this class for testing
var CytoscapeGraph = /** @class */ (function (_super) {
    __extends(CytoscapeGraph, _super);
    function CytoscapeGraph(props) {
        var _this = _super.call(this, props) || this;
        _this.resetSelection = false;
        _this.onResize = function () {
            if (_this.cy) {
                _this.cy.resize();
                var currentPosition = _this.cy.pan();
                var currentZoom = _this.cy.zoom();
                if (_this.initialValues.position &&
                    _this.initialValues.position.x === currentPosition.x &&
                    _this.initialValues.position.y === currentPosition.y &&
                    _this.initialValues.zoom === currentZoom) {
                    // There was a resize, but we are in the initial pan/zoom state, we can fit again.
                    _this.safeFit(_this.cy);
                }
            }
        };
        _this.turnNodeLabelsTo = function (cy, value) {
            cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels = value;
        };
        _this.selectTarget = function (target) {
            if (!target) {
                target = _this.cy;
            }
            _this.cy
                .$(':selected')
                .selectify()
                .unselect()
                .unselectify();
            if (target !== _this.cy) {
                target
                    .selectify()
                    .select()
                    .unselectify();
            }
        };
        _this.selectTargetAndUpdateSummary = function (target) {
            _this.selectTarget(target);
            var event = {
                summaryType: target.data(CyNode.isGroup) ? 'group' : 'node',
                summaryTarget: target
            };
            _this.props.updateSummary(event);
            _this.graphHighlighter.onClick(event);
        };
        _this.handleDoubleTap = function (event) {
            var target = event.summaryTarget;
            var targetType = event.summaryType;
            if (targetType !== 'node' && targetType !== 'group') {
                return;
            }
            var targetOrGroupChildren = targetType === 'group' ? target.descendants() : target;
            if (target.data(CyNode.isInaccessible) || target.data(CyNode.isServiceEntry)) {
                return;
            }
            if (targetOrGroupChildren.every(function (t) { return t.data(CyNode.hasMissingSC); })) {
                MessageCenterUtils.add("A node with a missing sidecar provides no node-specific telemetry and can not provide a node detail graph.", undefined, MessageType.WARNING);
                return;
            }
            if (targetOrGroupChildren.every(function (t) { return t.data(CyNode.isUnused); })) {
                MessageCenterUtils.add("An unused node has no node-specific traffic and can not provide a node detail graph.", undefined, MessageType.WARNING);
                return;
            }
            if (target.data(CyNode.isOutside)) {
                _this.props.setActiveNamespaces([{ name: target.data(CyNode.namespace) }]);
                return;
            }
            var namespace = target.data(CyNode.namespace);
            var nodeType = target.data(CyNode.nodeType);
            var workload = target.data(CyNode.workload);
            var app = target.data(CyNode.app);
            var version = targetType === 'group' ? undefined : event.summaryTarget.data(CyNode.version);
            var service = target.data(CyNode.service);
            var targetNode = {
                namespace: { name: namespace },
                nodeType: nodeType,
                workload: workload,
                app: app,
                version: version,
                service: service
            };
            var sameNode = false;
            if (_this.props.node) {
                sameNode = _this.props.node && _this.props.node.nodeType === nodeType;
                switch (nodeType) {
                    case NodeType.APP:
                        sameNode = sameNode && _this.props.node.app === app;
                        sameNode = sameNode && _this.props.node.version === version;
                        break;
                    case NodeType.SERVICE:
                        sameNode = sameNode && _this.props.node.service === service;
                        break;
                    case NodeType.WORKLOAD:
                        sameNode = sameNode && _this.props.node.workload === workload;
                        break;
                    default:
                        sameNode = true; // don't navigate to unsupported node type
                }
            }
            if (sameNode) {
                return;
            }
            var urlParams = {
                activeNamespaces: _this.props.activeNamespaces,
                duration: _this.props.duration,
                edgeLabelMode: _this.props.edgeLabelMode,
                graphLayout: _this.props.layout,
                graphType: _this.props.graphType,
                node: targetNode,
                refreshInterval: _this.props.refreshInterval,
                showServiceNodes: _this.props.showServiceNodes,
                showUnusedNodes: _this.props.showUnusedNodes
            };
            // To ensure updated components get the updated URL, update the URL first and then the state
            history.push(makeNodeGraphUrlFromParams(urlParams));
            _this.props.setNode(targetNode);
        };
        _this.handleTap = function (event) {
            _this.props.updateSummary(event);
            _this.graphHighlighter.onClick(event);
        };
        _this.handleMouseIn = function (event) {
            _this.graphHighlighter.onMouseIn(event);
        };
        _this.handleMouseOut = function (event) {
            _this.graphHighlighter.onMouseOut(event);
        };
        _this.focusFinished = false;
        _this.namespaceChanged = false;
        _this.nodeChanged = false;
        _this.initialValues = {
            position: undefined,
            zoom: undefined
        };
        _this.cytoscapeReactWrapperRef = React.createRef();
        _this.contextMenuRef = React.createRef();
        return _this;
    }
    CytoscapeGraph.prototype.shouldComponentUpdate = function (nextProps, _nextState) {
        this.nodeChanged = this.nodeChanged || this.props.node !== nextProps.node;
        var result = this.props.edgeLabelMode !== nextProps.edgeLabelMode ||
            this.props.elements !== nextProps.elements ||
            this.props.isError !== nextProps.isError ||
            this.props.layout !== nextProps.layout ||
            this.props.node !== nextProps.node ||
            this.props.showCircuitBreakers !== nextProps.showCircuitBreakers ||
            this.props.showMissingSidecars !== nextProps.showMissingSidecars ||
            this.props.showNodeLabels !== nextProps.showNodeLabels ||
            this.props.showSecurity !== nextProps.showSecurity ||
            this.props.showServiceNodes !== nextProps.showServiceNodes ||
            this.props.showTrafficAnimation !== nextProps.showTrafficAnimation ||
            this.props.showUnusedNodes !== nextProps.showUnusedNodes ||
            this.props.showVirtualServices !== nextProps.showVirtualServices;
        if (!nextProps.elements || !nextProps.elements.nodes || nextProps.elements.nodes.length < 1) {
            result = true;
        }
        return result;
    };
    CytoscapeGraph.prototype.componentDidMount = function () {
        this.cyInitialization(this.getCy());
    };
    CytoscapeGraph.prototype.componentDidUpdate = function (prevProps, _prevState) {
        var cy = this.getCy();
        if (!cy) {
            return;
        }
        var updateLayout = false;
        if (this.nodeNeedsRelayout() ||
            this.namespaceNeedsRelayout(prevProps.elements, this.props.elements) ||
            this.elementsNeedRelayout(prevProps.elements, this.props.elements) ||
            this.props.layout.name !== prevProps.layout.name) {
            updateLayout = true;
        }
        this.processGraphUpdate(cy, updateLayout);
        // pre-select node if provided
        var node = this.props.node;
        if (node && cy && cy.$(':selected').length === 0) {
            var selector = "[nodeType = '" + node.nodeType + "']";
            switch (node.nodeType) {
                case NodeType.APP:
                    selector = selector + "[app = '" + node.app + "']";
                    if (node.version && node.version !== 'unknown') {
                        selector = selector + "[version = '" + node.version + "']";
                    }
                    break;
                case NodeType.SERVICE:
                    selector = selector + "[service = '" + node.service + "']";
                    break;
                default:
                    selector = selector + "[workload = '" + node.workload + "']";
            }
            var eles = cy.nodes(selector);
            if (eles.length > 0) {
                this.selectTargetAndUpdateSummary(eles[0]);
            }
        }
        if (this.props.elements !== prevProps.elements) {
            this.updateHealth(cy);
        }
        this.props.updateGraph({ updateTimestamp: Date.now(), cyRef: cy });
    };
    CytoscapeGraph.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { id: "cytoscape-container", className: this.props.containerClassName },
            React.createElement(ReactResizeDetector, { handleWidth: true, handleHeight: true, skipOnMount: false, onResize: this.onResize }),
            React.createElement(EmptyGraphLayoutContainer, { elements: this.props.elements, namespaces: this.props.activeNamespaces, action: this.props.refresh, isLoading: this.props.isLoading, isError: this.props.isError },
                React.createElement(CytoscapeContextMenuWrapper, { ref: this.contextMenuRef, edgeContextMenuContent: this.props.contextMenuEdgeComponent, nodeContextMenuContent: this.props.contextMenuNodeComponent, groupContextMenuContent: this.props.contextMenuGroupComponent }),
                React.createElement(CytoscapeReactWrapper, { ref: function (e) { return _this.setCytoscapeReactWrapperRef(e); } }))));
    };
    CytoscapeGraph.prototype.getCy = function () {
        return this.cytoscapeReactWrapperRef.current ? this.cytoscapeReactWrapperRef.current.getCy() : null;
    };
    CytoscapeGraph.prototype.setCytoscapeReactWrapperRef = function (cyRef) {
        this.cytoscapeReactWrapperRef.current = cyRef;
        this.cyInitialization(this.getCy());
    };
    CytoscapeGraph.prototype.cyInitialization = function (cy) {
        var _this = this;
        if (!cy) {
            return;
        }
        // Caches the cy instance that is currently in use.
        // If that cy instance is the same one we are being asked to initialize, do NOT initialize it again;
        // this would add duplicate callbacks and would screw up the graph highlighter. If, however,
        // we are being asked to initialize a different cy instance, we assume the current one is now obsolete
        // so we do want to initialize the new cy instance.
        if (this.cy === cy) {
            return;
        }
        this.cy = cy;
        this.contextMenuRef.current.connectCy(this.cy);
        this.graphHighlighter = new GraphHighlighter(cy);
        this.trafficRenderer = new TrafficRender(cy, cy.edges());
        var getCytoscapeBaseEvent = function (event) {
            var target = event.target;
            if (target === cy) {
                return { summaryType: 'graph', summaryTarget: cy };
            }
            else if (target.isNode()) {
                if (target.data(CyNode.isGroup)) {
                    return { summaryType: 'group', summaryTarget: target };
                }
                else {
                    return { summaryType: 'node', summaryTarget: target };
                }
            }
            else if (target.isEdge()) {
                return { summaryType: 'edge', summaryTarget: target };
            }
            else {
                console.log(event.type + " UNHANDLED");
                return null;
            }
        };
        cy.on('tap', function (event) {
            var tapped = event.target;
            if (CytoscapeGraph.tapTimeout) {
                // cancel any single-tap timer in progress
                clearTimeout(CytoscapeGraph.tapTimeout);
                CytoscapeGraph.tapTimeout = null;
                if (tapped === CytoscapeGraph.tapTarget) {
                    // if we click the same target again, perform double-tap
                    tapped = null;
                    CytoscapeGraph.tapTarget = null;
                    var cytoscapeEvent = getCytoscapeBaseEvent(event);
                    if (cytoscapeEvent) {
                        _this.handleDoubleTap(cytoscapeEvent);
                    }
                }
            }
            if (tapped) {
                // start single-tap timer
                CytoscapeGraph.tapTarget = tapped;
                CytoscapeGraph.tapTimeout = setTimeout(function () {
                    // timer expired without a follow-up click, so perform single-tap
                    CytoscapeGraph.tapTarget = null;
                    var cytoscapeEvent = getCytoscapeBaseEvent(event);
                    if (cytoscapeEvent) {
                        _this.handleTap(cytoscapeEvent);
                        _this.selectTarget(event.target);
                    }
                }, CytoscapeGraph.doubleTapMs);
            }
        });
        cy.on('mouseover', 'node,edge', function (evt) {
            var cytoscapeEvent = getCytoscapeBaseEvent(evt);
            if (cytoscapeEvent) {
                _this.handleMouseIn(cytoscapeEvent);
            }
        });
        cy.on('mouseout', 'node,edge', function (evt) {
            var cytoscapeEvent = getCytoscapeBaseEvent(evt);
            if (cytoscapeEvent) {
                _this.handleMouseOut(cytoscapeEvent);
            }
        });
        cy.on('layoutstop', function (_evt) {
            // Don't allow a large zoom if the graph has a few nodes (nodes would look too big).
            _this.safeFit(cy);
        });
        cy.ready(function (evt) {
            _this.props.onReady(evt.cy);
            _this.processGraphUpdate(cy, true);
        });
        cy.on('destroy', function (_evt) {
            _this.trafficRenderer.stop();
            _this.cy = undefined;
            _this.props.updateSummary({ summaryType: 'graph', summaryTarget: undefined });
        });
    };
    CytoscapeGraph.prototype.focus = function (cy, elements) {
        var _this = this;
        // We only want to focus once, but allow the url to be shared.
        if (this.focusFinished) {
            return;
        }
        var focusElements = elements;
        if (!focusElements) {
            if (this.props.focusSelector) {
                var selectorResult = cy.$(this.props.focusSelector);
                if (!selectorResult.empty()) {
                    focusElements = selectorResult;
                }
            }
        }
        if (focusElements) {
            // If there is only one, select it
            if (focusElements.length === 1) {
                this.selectTargetAndUpdateSummary(focusElements[0]);
            }
            else {
                // If we have many elements, try to check if a compound in this query contains everything, if so, select it.
                var compound = focusElements.filter('$node > node');
                if (compound && compound.length === 1 && focusElements.subtract(compound).same(compound.children())) {
                    this.selectTargetAndUpdateSummary(compound[0]);
                    focusElements = compound;
                }
            }
            // Start animation
            if (this.focusAnimation) {
                this.focusAnimation.stop();
            }
            this.focusAnimation = new FocusAnimation(cy);
            this.focusAnimation.onFinished(function () {
                _this.focusFinished = true;
            });
            this.focusAnimation.start(focusElements);
        }
        return focusElements;
    };
    CytoscapeGraph.prototype.safeFit = function (cy) {
        this.focus(cy);
        CytoscapeGraphUtils.safeFit(cy);
        this.initialValues.position = __assign({}, cy.pan());
        this.initialValues.zoom = cy.zoom();
    };
    CytoscapeGraph.prototype.processGraphUpdate = function (cy, updateLayout) {
        if (!cy) {
            return;
        }
        this.trafficRenderer.stop();
        var isTheGraphSelected = cy.$(':selected').length === 0;
        if (this.resetSelection) {
            if (!isTheGraphSelected) {
                this.selectTarget(null);
                this.handleTap({ summaryType: 'graph', summaryTarget: cy });
            }
            this.resetSelection = false;
        }
        var globalScratchData = {
            activeNamespaces: this.props.activeNamespaces,
            edgeLabelMode: this.props.edgeLabelMode,
            graphType: this.props.graphType,
            mtlsEnabled: this.props.isMTLSEnabled,
            showCircuitBreakers: this.props.showCircuitBreakers,
            showMissingSidecars: this.props.showMissingSidecars,
            showSecurity: this.props.showSecurity,
            showNodeLabels: this.props.showNodeLabels,
            showVirtualServices: this.props.showVirtualServices
        };
        cy.scratch(CytoscapeGlobalScratchNamespace, globalScratchData);
        cy.startBatch();
        // KIALI-1291 issue was caused because some layouts (can't tell if all) do reuse the existing positions.
        // We got some issues when changing from/to cola/cose, as the nodes started to get far away from each other.
        // Previously we deleted the nodes prior to a layout update, this was too much and it seems that only reseting the
        // positions to 0,0 makes the layout more predictable.
        if (updateLayout) {
            cy.nodes().positions({ x: 0, y: 0 });
        }
        // update the entire set of nodes and edges to keep the graph up-to-date
        cy.json({ elements: this.props.elements });
        cy.endBatch();
        if (updateLayout) {
            CytoscapeGraphUtils.runLayout(cy, this.props.layout);
        }
        cy.startBatch();
        // Create and destroy labels
        this.turnNodeLabelsTo(cy, this.props.showNodeLabels);
        cy.endBatch();
        // We need to fit outside of the batch operation for it to take effect on the new nodes
        if (updateLayout) {
            this.safeFit(cy);
        }
        // We opt-in for manual selection to be able to control when to select a node/edge
        // https://github.com/cytoscape/cytoscape.js/issues/1145#issuecomment-153083828
        cy.nodes().unselectify();
        cy.edges().unselectify();
        // Verify our current selection is still valid, if not, select the graph
        if (!isTheGraphSelected && cy.$(':selected').length === 0) {
            this.handleTap({ summaryType: 'graph', summaryTarget: cy });
        }
        // Update TrafficRenderer
        this.trafficRenderer.setEdges(cy.edges());
        if (this.props.showTrafficAnimation) {
            this.trafficRenderer.start();
        }
    };
    CytoscapeGraph.prototype.namespaceNeedsRelayout = function (prevElements, nextElements) {
        var needsRelayout = this.namespaceChanged && prevElements !== nextElements;
        if (needsRelayout) {
            this.namespaceChanged = false;
        }
        return needsRelayout;
    };
    CytoscapeGraph.prototype.nodeNeedsRelayout = function () {
        var needsRelayout = this.nodeChanged;
        if (needsRelayout) {
            this.nodeChanged = false;
        }
        return needsRelayout;
    };
    // Tests if the element is still in the current graph
    CytoscapeGraph.prototype.isElementValid = function (ele) {
        return ele.cy() === this.cy;
    };
    // To know if we should re-layout, we need to know if any element changed
    // Do a quick round by comparing the number of nodes and edges, if different
    // a change is expected.
    // If we have the same number of elements, compare the ids, if we find one that isn't
    // in the other, we can be sure that there are changes.
    // Worst case is when they are the same, avoid that.
    CytoscapeGraph.prototype.elementsNeedRelayout = function (prevElements, nextElements) {
        if (prevElements === nextElements) {
            return false;
        }
        if (!prevElements ||
            !nextElements ||
            !prevElements.nodes ||
            !prevElements.edges ||
            !nextElements.nodes ||
            !nextElements.edges ||
            prevElements.nodes.length !== nextElements.nodes.length ||
            prevElements.edges.length !== nextElements.edges.length) {
            return true;
        }
        // If both have the same ids, we don't need to relayout
        return !(this.nodeOrEdgeArrayHasSameIds(nextElements.nodes, prevElements.nodes) &&
            this.nodeOrEdgeArrayHasSameIds(nextElements.edges, prevElements.edges));
    };
    CytoscapeGraph.prototype.nodeOrEdgeArrayHasSameIds = function (a, b) {
        var aIds = a.map(function (e) { return e.id; }).sort();
        return b
            .map(function (e) { return e.id; })
            .sort()
            .every(function (eId, index) { return eId === aIds[index]; });
    };
    CytoscapeGraph.prototype.updateHealth = function (cy) {
        var _this = this;
        if (!cy) {
            return;
        }
        var duration = this.props.duration;
        // Keep a map of namespace x promises in order not to fetch several times the same data per namespace
        var appHealthPerNamespace = new Map();
        var serviceHealthPerNamespace = new Map();
        var workloadHealthPerNamespace = new Map();
        // Asynchronously fetch health
        cy.nodes().forEach(function (ele) {
            var inaccessible = ele.data(CyNode.isInaccessible);
            if (inaccessible) {
                return;
            }
            var namespace = ele.data(CyNode.namespace);
            var namespaceOk = namespace && namespace !== '' && namespace !== 'unknown';
            // incomplete telemetry can result in an unknown namespace, if so set nodeType UNKNOWN
            var nodeType = namespaceOk ? ele.data(CyNode.nodeType) : NodeType.UNKNOWN;
            var workload = ele.data(CyNode.workload);
            var workloadOk = workload && workload !== '' && workload !== 'unknown';
            // use workload health when workload is set and valid (workload nodes or versionApp nodes)
            var useWorkloadHealth = nodeType === NodeType.WORKLOAD || (nodeType === NodeType.APP && workloadOk);
            if (useWorkloadHealth) {
                var promise = workloadHealthPerNamespace.get(namespace);
                if (!promise) {
                    promise = API.getNamespaceWorkloadHealth(namespace, duration);
                    workloadHealthPerNamespace.set(namespace, promise);
                }
                _this.updateNodeHealth(ele, promise, workload);
            }
            else if (nodeType === NodeType.APP) {
                var app = ele.data(CyNode.app);
                var promise = appHealthPerNamespace.get(namespace);
                if (!promise) {
                    promise = API.getNamespaceAppHealth(namespace, duration);
                    appHealthPerNamespace.set(namespace, promise);
                }
                _this.updateNodeHealth(ele, promise, app);
                // TODO: If we want to block health checks for service entries, uncomment this (see kiali-2029)
                // } else if (nodeType === NodeType.SERVICE && !ele.data(CyNode.isServiceEntry)) {
            }
            else if (nodeType === NodeType.SERVICE) {
                var service = ele.data(CyNode.service);
                var promise = serviceHealthPerNamespace.get(namespace);
                if (!promise) {
                    promise = API.getNamespaceServiceHealth(namespace, duration);
                    serviceHealthPerNamespace.set(namespace, promise);
                }
                _this.updateNodeHealth(ele, promise, service);
            }
        });
    };
    CytoscapeGraph.prototype.updateNodeHealth = function (ele, promise, key) {
        var _this = this;
        ele.data('healthPromise', promise.then(function (nsHealth) { return nsHealth[key]; }));
        promise
            .then(function (nsHealth) {
            // Discard if the element is no longer valid
            if (_this.isElementValid(ele)) {
                var health = nsHealth[key];
                if (health) {
                    var status_1 = health.getGlobalStatus();
                    ele.removeClass(H.DEGRADED.name + ' ' + H.FAILURE.name);
                    if (status_1 === H.DEGRADED || status_1 === H.FAILURE) {
                        ele.addClass(status_1.name);
                    }
                }
                else {
                    ele.removeClass(H.DEGRADED.name + "  " + H.FAILURE.name + " " + H.HEALTHY.name);
                    console.debug("No health found for [" + ele.data(CyNode.nodeType) + "] [" + key + "]");
                }
            }
        })
            .catch(function (err) {
            // Discard if the element is no longer valid
            if (_this.isElementValid(ele)) {
                ele.removeClass(H.DEGRADED.name + "  " + H.FAILURE.name + " " + H.HEALTHY.name);
            }
            console.error(API.getErrorMsg("Could not fetch health for [" + ele.data(CyNode.nodeType) + "] [" + key + "]", err));
        });
    };
    CytoscapeGraph.contextTypes = {
        router: function () { return null; }
    };
    // for dbl-click support
    CytoscapeGraph.doubleTapMs = 350;
    return CytoscapeGraph;
}(React.Component));
export { CytoscapeGraph };
var mapStateToProps = function (state) { return ({
    activeNamespaces: activeNamespacesSelector(state),
    duration: durationSelector(state),
    edgeLabelMode: edgeLabelModeSelector(state),
    elements: graphDataSelector(state),
    graphType: graphTypeSelector(state),
    isError: state.graph.isError,
    isLoading: state.graph.isLoading,
    layout: state.graph.layout,
    node: state.graph.node,
    refreshInterval: refreshIntervalSelector(state),
    showCircuitBreakers: state.graph.filterState.showCircuitBreakers,
    showMissingSidecars: state.graph.filterState.showMissingSidecars,
    showNodeLabels: state.graph.filterState.showNodeLabels,
    showSecurity: state.graph.filterState.showSecurity,
    showServiceNodes: state.graph.filterState.showServiceNodes,
    showTrafficAnimation: state.graph.filterState.showTrafficAnimation,
    showUnusedNodes: state.graph.filterState.showUnusedNodes,
    showVirtualServices: state.graph.filterState.showVirtualServices
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onReady: function (cy) { return dispatch(GraphThunkActions.graphReady(cy)); },
    setActiveNamespaces: function (namespaces) { return dispatch(NamespaceActions.setActiveNamespaces(namespaces)); },
    setNode: bindActionCreators(GraphActions.setNode, dispatch),
    updateGraph: function (cyData) { return dispatch(GraphActions.updateGraph(cyData)); },
    updateSummary: function (event) { return dispatch(GraphActions.updateSummary(event)); }
}); };
var CytoscapeGraphContainer = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true } // Allows to use getWrappedInstance to get the ref
)(CytoscapeGraph);
export default CytoscapeGraphContainer;
//# sourceMappingURL=CytoscapeGraph.js.map