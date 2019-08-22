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
import MissingSidecar from '../../components/MissingSidecar/MissingSidecar';
import { Link } from 'react-router-dom';
import { ServiceIcon, BundleIcon, ApplicationsIcon } from '@patternfly/react-icons';
import { CytoscapeGraphSelectorBuilder } from '../CytoscapeGraph/CytoscapeGraphSelector';
import { style } from 'typestyle';
import { NodeType } from '../../types/Graph';
var PfTitleStyle = style({
    fontSize: '19px',
    fontWeight: 400,
    margin: '20px 0',
    padding: '0'
});
var PfTitle = /** @class */ (function (_super) {
    __extends(PfTitle, _super);
    function PfTitle(props) {
        var _this = _super.call(this, props) || this;
        var namespaceRegex = /namespaces\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)(\/([a-z0-9-]+))?(\/([a-z0-9-]+))?/;
        var type, ns, graphType, name = '';
        var icon = React.createElement(React.Fragment, null);
        if (_this.props.location) {
            var match = _this.props.location.pathname.match(namespaceRegex) || [];
            ns = match[1];
            type = match[2];
            name = match[3];
        }
        var cytoscapeGraph = new CytoscapeGraphSelectorBuilder().namespace(ns);
        switch (type) {
            case 'services':
                graphType = 'service';
                cytoscapeGraph = cytoscapeGraph.service(name);
                icon = React.createElement(ServiceIcon, null);
                break;
            case 'workloads':
                graphType = 'workload';
                cytoscapeGraph = cytoscapeGraph.workload(name);
                icon = React.createElement(BundleIcon, null);
                break;
            case 'applications':
                graphType = 'app';
                cytoscapeGraph = cytoscapeGraph
                    .app(name)
                    .nodeType(NodeType.APP)
                    .isGroup(null);
                icon = React.createElement(ApplicationsIcon, null);
                break;
            default:
        }
        _this.state = {
            namespace: ns,
            type: type,
            name: name,
            graphType: graphType,
            icon: icon,
            cytoscapeGraph: cytoscapeGraph.build()
        };
        return _this;
    }
    PfTitle.prototype.showOnGraphLink = function () {
        return "/graph/namespaces?graphType=" + this.state.graphType + "&injectServiceNodes=true&namespaces=" + this.state.namespace + "&unusedNodes=true&focusSelector=" + encodeURI(this.state.cytoscapeGraph);
    };
    PfTitle.prototype.render = function () {
        return (React.createElement("h2", { className: PfTitleStyle },
            this.state.icon,
            " ",
            this.state.name,
            this.state.name && this.props.istio !== undefined && !this.props.istio && (React.createElement("span", { style: { marginLeft: '10px' } },
                React.createElement(MissingSidecar, null))),
            this.state.name && (React.createElement(React.Fragment, null,
                '  ',
                "(",
                React.createElement(Link, { to: this.showOnGraphLink() }, "Show on graph"),
                ")"))));
    };
    return PfTitle;
}(React.Component));
export default PfTitle;
//# sourceMappingURL=PfTitle.js.map