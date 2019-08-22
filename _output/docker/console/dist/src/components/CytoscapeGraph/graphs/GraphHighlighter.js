import { DimClass } from './GraphStyles';
var DIM_CLASS = DimClass;
var HIGHLIGHT_CLASS = 'mousehighlight';
var HOVERED_CLASS = 'mousehover';
// When a node or edge is selected we highlight the end-to-end paths (nodes and edges) for which the
// element participates.  Other nodes and edges are dimmed.
//
// When no node or edge is selected, hovering on a node or edge will highlight it and its neighborhood. Other
// nodes and edges are dimmed.
//
// When an app box element is selected, we will highlight the contained nodes and their related nodes
// (including edges).
var GraphHighlighter = /** @class */ (function () {
    function GraphHighlighter(cy) {
        var _this = this;
        // Need to define these methods using the "public class fields syntax", to be able to keep
        // *this* binded when passing it to events handlers (or use the annoying syntax)
        // https://reactjs.org/docs/handling-events.html
        this.onClick = function (event) {
            // ignore clicks on the currently selected element
            if (_this.selected.summaryTarget === event.summaryTarget) {
                return;
            }
            _this.selected = event;
            _this.clearHover();
            _this.unhighlight();
            // only highlight when selecting something other than the graph background
            if (_this.selected.summaryType !== 'graph') {
                _this.refresh();
            }
        };
        this.clearHover = function () {
            if (_this.hovered) {
                _this.hovered.summaryTarget.removeClass(HOVERED_CLASS);
                _this.hovered = undefined;
            }
        };
        this.onMouseIn = function (event) {
            // only highlight on hover when the graph is currently selected, otherwise leave the
            // selected element highlighted
            if (_this.selected.summaryType === 'graph' && ['node', 'edge', 'group'].indexOf(event.summaryType) !== -1) {
                _this.hovered = event;
                _this.hovered.summaryTarget.addClass(HOVERED_CLASS);
                _this.refresh();
            }
        };
        this.onMouseOut = function (event) {
            if (_this.hovered && _this.hovered.summaryTarget === event.summaryTarget) {
                _this.clearHover();
                _this.unhighlight();
            }
        };
        this.unhighlight = function () {
            _this.cy.elements('.' + DIM_CLASS).removeClass(DIM_CLASS);
            _this.cy.elements('.' + HIGHLIGHT_CLASS).removeClass(HIGHLIGHT_CLASS);
        };
        this.refresh = function () {
            var toHighlight = _this.getHighlighted();
            if (!toHighlight) {
                return;
            }
            toHighlight.addClass(HIGHLIGHT_CLASS);
            _this.cy
                .elements()
                .difference(toHighlight)
                .addClass(DIM_CLASS);
        };
        this.cy = cy;
        this.selected = {
            summaryType: 'graph',
            summaryTarget: this.cy
        };
    }
    // Returns the nodes to highlight. Highlighting for a hovered element
    // is limited to its neighborhood.  Highlighting for a selected element
    // is extended to full incoming and outgoing paths.
    GraphHighlighter.prototype.getHighlighted = function () {
        var isHover = this.selected.summaryType === 'graph';
        var event = isHover ? this.hovered : this.selected;
        if (event) {
            switch (event.summaryType) {
                case 'node':
                    return this.getNodeHighlight(event.summaryTarget, isHover);
                case 'edge':
                    return this.getEdgeHighlight(event.summaryTarget, isHover);
                case 'group':
                    return this.getAppBoxHighlight(event.summaryTarget, isHover);
                default:
                // fall through
            }
        }
        return undefined;
    };
    GraphHighlighter.prototype.includeParentNodes = function (nodes) {
        return nodes.reduce(function (all, current) {
            all = all.add(current);
            if (current.isChild()) {
                all = all.add(current.parent());
            }
            return all;
        }, this.cy.collection());
    };
    GraphHighlighter.prototype.getNodeHighlight = function (node, isHover) {
        var elems = isHover ? node.closedNeighborhood() : node.predecessors().add(node.successors());
        return this.includeParentNodes(elems.add(node));
    };
    GraphHighlighter.prototype.getEdgeHighlight = function (edge, isHover) {
        var elems;
        if (isHover) {
            elems = edge.connectedNodes();
        }
        else {
            var source = edge.source();
            var target = edge.target();
            elems = source
                .add(target)
                .add(source.predecessors())
                .add(target.successors());
        }
        return this.includeParentNodes(elems.add(edge));
    };
    GraphHighlighter.prototype.getAppBoxHighlight = function (appBox, isHover) {
        var elems;
        if (isHover) {
            elems = appBox.children().reduce(function (prev, child) {
                return prev.add(child.closedNeighborhood());
            }, this.cy.collection());
        }
        else {
            var children = appBox.children();
            elems = children.add(children.predecessors()).add(children.successors());
        }
        return this.includeParentNodes(elems);
    };
    return GraphHighlighter;
}());
export { GraphHighlighter };
//# sourceMappingURL=GraphHighlighter.js.map