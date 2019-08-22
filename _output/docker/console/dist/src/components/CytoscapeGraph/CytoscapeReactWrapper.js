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
import { GraphStyles } from './graphs/GraphStyles';
import canvas from 'cytoscape-canvas';
import cytoscape from 'cytoscape';
import cycola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import coseBilkent from 'cytoscape-cose-bilkent';
import GroupCompoundLayout from './Layout/GroupCompoundLayout';
import popper from 'cytoscape-popper';
// import {MyTable} from '../SummaryPanel/MyTable';
cytoscape.use(canvas);
cytoscape.use(cycola);
cytoscape.use(dagre);
cytoscape.use(coseBilkent);
cytoscape.use(popper);
cytoscape('layout', 'group-compound-layout', GroupCompoundLayout);
// benjykim
var styleContainer = {
    height: '75%'
};
/**
* The purpose of this wrapper is very simple and minimal - to provide a long-lived <div> element that can be used
* as the parent container for the cy graph (cy.container). Because cy does not provide the ability to re-parent an
* existing graph (e.g. there is no API such as "cy.setContainer(div)"), the only way to be able to re-use a
* graph (without re-creating and re-rendering it all the time) is to have it inside a wrapper like this one
* that does not update/re-render itself, thus keeping the original <div> intact.
*
* Other than creating and initializing the cy graph, this component should do nothing else. Parent components
* should get a ref to this component can call getCy() in order to perform additional processing on the graph.
* It is the job of the parent component to manipulate and update the cy graph during runtime.
*
* NOTE: The context menu stuff is defined in the CytoscapeReactWrapper because that is
* where the cytoscape plugins are defined. And the context menu functions are defined in
* here because they are not normal Cytoscape defined functions like those found in CytoscapeGraph.
*/
var CytoscapeReactWrapper = /** @class */ (function (_super) {
    __extends(CytoscapeReactWrapper, _super);
    function CytoscapeReactWrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.cy = null;
        _this.divParentRef = React.createRef();
        return _this;
    }
    // For other components to be able to manipulate the cy graph.
    CytoscapeReactWrapper.prototype.getCy = function () {
        return this.cy;
    };
    // This is VERY important - this must always return false to ensure the div is never destroyed.
    // If the div is destroyed, the cached cy becomes useless.
    CytoscapeReactWrapper.prototype.shouldComponentUpdate = function (_nextProps, _nextState) {
        return false;
    };
    CytoscapeReactWrapper.prototype.componentDidMount = function () {
        this.build();
    };
    CytoscapeReactWrapper.prototype.componentWillUnmount = function () {
        this.destroy();
    };
    // benjykim
    CytoscapeReactWrapper.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { id: "cy", className: "graph", style: styleContainer, ref: this.divParentRef })));
    };
    CytoscapeReactWrapper.prototype.build = function () {
        if (this.cy) {
            this.destroy();
        }
        var opts = __assign({ container: this.divParentRef.current, boxSelectionEnabled: false, autounselectify: true, style: GraphStyles.styles() }, GraphStyles.options());
        this.cy = cytoscape(opts);
    };
    CytoscapeReactWrapper.prototype.destroy = function () {
        if (this.cy) {
            this.cy.destroy();
            this.cy = null;
        }
    };
    return CytoscapeReactWrapper;
}(React.Component));
export { CytoscapeReactWrapper };
//# sourceMappingURL=CytoscapeReactWrapper.js.map