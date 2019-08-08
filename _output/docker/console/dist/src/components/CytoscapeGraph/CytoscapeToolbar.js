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
import { ButtonGroup, Button, Icon, OverlayTrigger, Tooltip } from 'patternfly-react';
import { style } from 'typestyle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PfColors } from '../Pf/PfColors';
import * as CytoscapeGraphUtils from './CytoscapeGraphUtils';
import { ColaGraph } from './graphs/ColaGraph';
import { CoseGraph } from './graphs/CoseGraph';
import { DagreGraph } from './graphs/DagreGraph';
import { GraphActions } from '../../actions/GraphActions';
import { HistoryManager, URLParam } from '../../app/History';
import * as LayoutDictionary from './graphs/LayoutDictionary';
import { GraphFilterActions } from '../../actions/GraphFilterActions';
var cytoscapeToolbarStyle = style({
    padding: '7px 10px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: PfColors.Black500,
    backgroundColor: PfColors.White
});
var cytoscapeToolbarPadStyle = style({ marginLeft: '10px' });
var ZOOM_STEP = 0.2;
var CytoscapeToolbar = /** @class */ (function (_super) {
    __extends(CytoscapeToolbar, _super);
    function CytoscapeToolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.zoomIn = function () {
            _this.zoom(ZOOM_STEP);
        };
        _this.zoomOut = function () {
            _this.zoom(-ZOOM_STEP);
        };
        _this.fit = function () {
            var cy = _this.getCy();
            if (cy) {
                CytoscapeGraphUtils.safeFit(cy);
            }
        };
        // Let URL override current redux state at construction time. Update URL with unset params.
        var urlLayout = HistoryManager.getParam(URLParam.GRAPH_LAYOUT);
        if (urlLayout) {
            if (urlLayout !== props.layout.name) {
                props.setLayout(LayoutDictionary.getLayoutByName(urlLayout));
            }
        }
        else {
            HistoryManager.setParam(URLParam.GRAPH_LAYOUT, props.layout.name);
        }
        return _this;
    }
    CytoscapeToolbar.prototype.componentDidUpdate = function () {
        // ensure redux state and URL are aligned
        HistoryManager.setParam(URLParam.GRAPH_LAYOUT, this.props.layout.name);
    };
    CytoscapeToolbar.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: cytoscapeToolbarStyle },
            React.createElement(ButtonGroup, null,
                React.createElement(OverlayTrigger, { key: 'ot_ct_zi', placement: "top", overlay: React.createElement(Tooltip, { id: 'tt_ct_zi' }, "Zoom in") },
                    React.createElement(Button, { onClick: this.zoomIn },
                        React.createElement(Icon, { type: "fa", name: "plus" }))),
                React.createElement(OverlayTrigger, { key: 'ot_ct_zo', placement: "top", overlay: React.createElement(Tooltip, { id: 'tt_ct_zo' }, "Zoom out") },
                    React.createElement(Button, { onClick: this.zoomOut },
                        React.createElement(Icon, { type: "fa", name: "minus" })))),
            React.createElement(OverlayTrigger, { key: 'ot_ct_ztf', placement: "top", overlay: React.createElement(Tooltip, { id: 'tt_ct_ztf' }, "Zoom to fit") },
                React.createElement(Button, { onClick: this.fit, className: cytoscapeToolbarPadStyle },
                    React.createElement("div", { className: "glyphicon glyphicon-fullscreen" }))),
            React.createElement(ButtonGroup, { id: "toolbar_layout_group", className: cytoscapeToolbarPadStyle },
                React.createElement(OverlayTrigger, { key: 'ot_ct_l0', placement: "top", overlay: React.createElement(Tooltip, { id: 'tt_ct_l0' },
                        "Layout default (",
                        DagreGraph.getLayout().name,
                        ")") },
                    React.createElement(Button, { onClick: function () {
                            _this.props.setLayout(DagreGraph.getLayout());
                        }, active: this.props.layout.name === DagreGraph.getLayout().name },
                        React.createElement("div", { className: "fa pficon-infrastructure fa-rotate-270" }))),
                React.createElement(OverlayTrigger, { key: 'ot_ct_l1', placement: "top", overlay: React.createElement(Tooltip, { id: 'tt_ct_l1' },
                        "Layout 1 (",
                        CoseGraph.getLayout().name,
                        ")") },
                    React.createElement(Button, { onClick: function () {
                            _this.props.setLayout(CoseGraph.getLayout());
                        }, active: this.props.layout.name === CoseGraph.getLayout().name },
                        React.createElement("div", { className: "fa pficon-topology" }),
                        " 1")),
                React.createElement(OverlayTrigger, { key: 'ot_ct_l2', placement: "top", overlay: React.createElement(Tooltip, { id: 'tt_ct_l2' },
                        "Layout 2 (",
                        ColaGraph.getLayout().name,
                        ")") },
                    React.createElement(Button, { onClick: function () {
                            _this.props.setLayout(ColaGraph.getLayout());
                        }, active: this.props.layout.name === ColaGraph.getLayout().name },
                        React.createElement("div", { className: "fa pficon-topology" }),
                        " 2"))),
            React.createElement(Button, { id: "toolbar_toggle_legend", onClick: this.props.toggleLegend, active: this.props.showLegend, className: cytoscapeToolbarPadStyle }, "Legend")));
    };
    CytoscapeToolbar.prototype.getCy = function () {
        if (this.props.cytoscapeGraphRef.current) {
            return this.props.cytoscapeGraphRef.current.getCy();
        }
        return null;
    };
    CytoscapeToolbar.prototype.zoom = function (step) {
        var cy = this.getCy();
        if (cy) {
            cy.zoom({
                level: cy.zoom() * (1 + step),
                renderedPosition: {
                    x: cy.container().offsetWidth / 2,
                    y: cy.container().offsetHeight / 2
                }
            });
        }
    };
    return CytoscapeToolbar;
}(React.PureComponent));
export { CytoscapeToolbar };
var mapStateToProps = function (state) { return ({
    layout: state.graph.layout,
    showLegend: state.graph.filterState.showLegend
}); };
var mapDispatchToProps = function (dispatch) { return ({
    setLayout: bindActionCreators(GraphActions.setLayout, dispatch),
    toggleLegend: bindActionCreators(GraphFilterActions.toggleLegend, dispatch)
}); };
var CytoscapeToolbarContainer = connect(mapStateToProps, mapDispatchToProps)(CytoscapeToolbar);
export default CytoscapeToolbarContainer;
//# sourceMappingURL=CytoscapeToolbar.js.map