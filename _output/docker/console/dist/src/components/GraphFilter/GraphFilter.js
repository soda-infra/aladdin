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
import { Button, FormGroup, Toolbar } from 'patternfly-react';
import { style } from 'typestyle';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { activeNamespacesSelector, edgeLabelModeSelector, graphTypeSelector, showUnusedNodesSelector } from '../../store/Selectors';
import { GraphFilterActions } from '../../actions/GraphFilterActions';
import { GraphType } from '../../types/Graph';
import { EdgeLabelMode } from '../../types/GraphFilter';
import GraphFindContainer from './GraphFind';
import GraphRefreshContainer from './GraphRefresh';
import GraphSettingsContainer from './GraphSettings';
import history, { HistoryManager, URLParam } from '../../app/History';
import { ToolbarDropdown } from '../ToolbarDropdown/ToolbarDropdown';
import { namespacesFromString, namespacesToString } from '../../types/Namespace';
import { NamespaceActions } from '../../actions/NamespaceAction';
import { GraphActions } from '../../actions/GraphActions';
import { AlignRightStyle, ThinStyle } from '../../components/Filters/FilterStyles';
// align with separator start / Graph breadcrumb
var alignLeftStyle = style({
    marginLeft: '-30px'
});
var GraphFilter = /** @class */ (function (_super) {
    __extends(GraphFilter, _super);
    function GraphFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.handleRefresh = function () {
            _this.props.onRefresh();
        };
        _this.handleNamespaceReturn = function () {
            _this.props.setNode(undefined);
            history.push('/graph/namespaces');
        };
        _this.setGraphType = function (type) {
            var graphType = GraphType[type];
            if (_this.props.graphType !== graphType) {
                _this.props.setGraphType(graphType);
            }
        };
        _this.setEdgeLabelMode = function (edgeMode) {
            var mode = EdgeLabelMode[edgeMode];
            if (_this.props.edgeLabelMode !== mode) {
                _this.props.setEdgeLabelMode(mode);
            }
        };
        // Let URL override current redux state at construction time. Update URL with unset params.
        var urlParams = new URLSearchParams(history.location.search);
        var urlEdgeLabelMode = HistoryManager.getParam(URLParam.GRAPH_EDGES, urlParams);
        if (urlEdgeLabelMode) {
            if (urlEdgeLabelMode !== props.edgeLabelMode) {
                props.setEdgeLabelMode(urlEdgeLabelMode);
            }
        }
        else {
            HistoryManager.setParam(URLParam.GRAPH_EDGES, String(_this.props.edgeLabelMode));
        }
        var urlGraphType = HistoryManager.getParam(URLParam.GRAPH_TYPE, urlParams);
        if (urlGraphType) {
            if (urlGraphType !== props.graphType) {
                props.setGraphType(urlGraphType);
            }
        }
        else {
            HistoryManager.setParam(URLParam.GRAPH_TYPE, String(_this.props.graphType));
        }
        var urlNamespaces = HistoryManager.getParam(URLParam.NAMESPACES, urlParams);
        if (urlNamespaces) {
            if (urlNamespaces !== namespacesToString(props.activeNamespaces)) {
                props.setActiveNamespaces(namespacesFromString(urlNamespaces));
            }
        }
        else {
            var activeNamespacesString = namespacesToString(props.activeNamespaces);
            HistoryManager.setParam(URLParam.NAMESPACES, activeNamespacesString);
        }
        var unusedNodes = HistoryManager.getBooleanParam(URLParam.UNUSED_NODES);
        if (unusedNodes !== undefined) {
            if (props.showUnusedNodes !== unusedNodes) {
                props.setShowUnusedNodes(unusedNodes);
            }
        }
        else {
            HistoryManager.setParam(URLParam.UNUSED_NODES, String(_this.props.showUnusedNodes));
        }
        return _this;
    }
    GraphFilter.prototype.componentDidUpdate = function () {
        // ensure redux state and URL are aligned
        var activeNamespacesString = namespacesToString(this.props.activeNamespaces);
        if (this.props.activeNamespaces.length === 0) {
            HistoryManager.deleteParam(URLParam.NAMESPACES, true);
        }
        else {
            HistoryManager.setParam(URLParam.NAMESPACES, activeNamespacesString);
        }
        HistoryManager.setParam(URLParam.GRAPH_EDGES, String(this.props.edgeLabelMode));
        HistoryManager.setParam(URLParam.GRAPH_TYPE, String(this.props.graphType));
        HistoryManager.setParam(URLParam.UNUSED_NODES, String(this.props.showUnusedNodes));
    };
    // TODO [jshaughn] Is there a better typescript way than the style attribute with the spread syntax (here and other places)
    GraphFilter.prototype.render = function () {
        var _this = this;
        var graphTypeKey = _.findKey(GraphType, function (val) { return val === _this.props.graphType; });
        var edgeLabelModeKey = _.findKey(EdgeLabelMode, function (val) { return val === _this.props.edgeLabelMode; });
        return (React.createElement(React.Fragment, null,
            React.createElement(Toolbar, null,
                React.createElement(FormGroup, { className: alignLeftStyle, style: __assign({}, ThinStyle) },
                    this.props.node ? (React.createElement(Button, { onClick: this.handleNamespaceReturn },
                        "Back to full ",
                        GraphFilter.GRAPH_TYPES[graphTypeKey])) : (React.createElement(ToolbarDropdown, { id: 'graph_filter_view_type', disabled: this.props.disabled, handleSelect: this.setGraphType, value: graphTypeKey, label: GraphFilter.GRAPH_TYPES[graphTypeKey], options: GraphFilter.GRAPH_TYPES })),
                    React.createElement(ToolbarDropdown, { id: 'graph_filter_edge_labels', disabled: false, handleSelect: this.setEdgeLabelMode, value: edgeLabelModeKey, label: GraphFilter.EDGE_LABEL_MODES[edgeLabelModeKey], options: GraphFilter.EDGE_LABEL_MODES }),
                    React.createElement(GraphSettingsContainer, { edgeLabelMode: this.props.edgeLabelMode, graphType: this.props.graphType })),
                React.createElement(GraphFindContainer, null),
                React.createElement(Toolbar.RightContent, { style: __assign({}, AlignRightStyle) },
                    React.createElement(GraphRefreshContainer, { id: "graph_refresh_container", disabled: this.props.disabled, handleRefresh: this.handleRefresh })))));
    };
    /**
     *  Key-value pair object representation of GraphType enum.  Values are human-readable versions of enum keys.
     *
     *  Example:  GraphType => {'APP': 'App', 'VERSIONED_APP': 'VersionedApp'}
     */
    GraphFilter.GRAPH_TYPES = _.mapValues(GraphType, function (val) { return _.capitalize(_.startCase(val)) + " graph"; });
    /**
     *  Key-value pair object representation of EdgeLabelMode
     *
     *  Example:  EdgeLabelMode =>{'TRAFFIC_RATE_PER_SECOND': 'TrafficRatePerSecond'}
     */
    GraphFilter.EDGE_LABEL_MODES = _.mapValues(_.omitBy(EdgeLabelMode, _.isFunction), function (val) {
        return _.capitalize(_.startCase(val));
    });
    GraphFilter.contextTypes = {
        router: function () { return null; }
    };
    return GraphFilter;
}(React.PureComponent));
export { GraphFilter };
var mapStateToProps = function (state) { return ({
    activeNamespaces: activeNamespacesSelector(state),
    edgeLabelMode: edgeLabelModeSelector(state),
    graphType: graphTypeSelector(state),
    node: state.graph.node,
    showUnusedNodes: showUnusedNodesSelector(state)
}); };
var mapDispatchToProps = function (dispatch) {
    return {
        setActiveNamespaces: bindActionCreators(NamespaceActions.setActiveNamespaces, dispatch),
        setEdgeLabelMode: bindActionCreators(GraphFilterActions.setEdgelLabelMode, dispatch),
        setGraphType: bindActionCreators(GraphFilterActions.setGraphType, dispatch),
        setNode: bindActionCreators(GraphActions.setNode, dispatch),
        setShowUnusedNodes: bindActionCreators(GraphFilterActions.setShowUnusedNodes, dispatch)
    };
};
var GraphFilterContainer = connect(mapStateToProps, mapDispatchToProps)(GraphFilter);
export default GraphFilterContainer;
//# sourceMappingURL=GraphFilter.js.map