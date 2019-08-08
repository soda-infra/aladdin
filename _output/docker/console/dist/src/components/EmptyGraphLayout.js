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
import { connect } from 'react-redux';
import { Button, EmptyState, EmptyStateTitle, EmptyStateIcon, EmptyStateInfo, EmptyStateAction } from 'patternfly-react';
import { style } from 'typestyle';
import * as _ from 'lodash';
import { GraphFilterActions } from '../actions/GraphFilterActions';
import { bindActionCreators } from 'redux';
var mapStateToProps = function (state) {
    return {
        error: state.graph.error,
        isDisplayingUnusedNodes: state.graph.filterState.showUnusedNodes
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        displayUnusedNodes: bindActionCreators(GraphFilterActions.toggleUnusedNodes, dispatch)
    };
};
var emptyStateStyle = style({
    height: '98%',
    marginRight: 5,
    marginBottom: 10,
    marginTop: 10
});
var EmptyGraphLayout = /** @class */ (function (_super) {
    __extends(EmptyGraphLayout, _super);
    function EmptyGraphLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmptyGraphLayout.prototype.shouldComponentUpdate = function (nextProps) {
        var currentIsEmpty = _.isEmpty(this.props.elements.nodes);
        var nextIsEmpty = _.isEmpty(nextProps.elements.nodes);
        // Update if we have elements and we are not loading
        if (!nextProps.isLoading && !nextIsEmpty) {
            return true;
        }
        // Update if we are going from having no elements to having elements or vice versa
        if (currentIsEmpty !== nextIsEmpty) {
            return true;
        }
        // Do not update if we have elements and the namespace didn't change, as this means we are refreshing
        return !(!nextIsEmpty && this.props.namespaces === nextProps.namespaces);
    };
    EmptyGraphLayout.prototype.namespacesText = function () {
        if (this.props.namespaces && this.props.namespaces.length > 0) {
            if (this.props.namespaces.length === 1) {
                return (React.createElement(React.Fragment, null,
                    "namespace ",
                    React.createElement("b", null, this.props.namespaces[0].name)));
            }
            else {
                var namespacesString = this.props.namespaces
                    .slice(0, -1)
                    .map(function (namespace) { return namespace.name; })
                    .join(',') +
                    ' and ' +
                    this.props.namespaces[this.props.namespaces.length - 1].name;
                return (React.createElement(React.Fragment, null,
                    "namespaces ",
                    React.createElement("b", null, namespacesString)));
            }
        }
        return null;
    };
    EmptyGraphLayout.prototype.render = function () {
        if (this.props.isError) {
            return (React.createElement(EmptyState, { className: emptyStateStyle },
                React.createElement(EmptyStateIcon, { name: "error-circle-o" }),
                React.createElement(EmptyStateTitle, null, "Error loading Graph"),
                React.createElement(EmptyStateInfo, null, this.props.error)));
        }
        if (this.props.isLoading) {
            return (React.createElement(EmptyState, { className: emptyStateStyle },
                React.createElement(EmptyStateTitle, null, "Loading Graph")));
        }
        if (this.props.namespaces.length === 0) {
            return (React.createElement(EmptyState, { className: emptyStateStyle },
                React.createElement(EmptyStateTitle, null, "No namespace is selected"),
                React.createElement(EmptyStateInfo, null, "There is currently no namespace selected, please select one using the Namespace selector.")));
        }
        var isGraphEmpty = !this.props.elements || !this.props.elements.nodes || this.props.elements.nodes.length < 1;
        if (isGraphEmpty) {
            return (React.createElement(EmptyState, { className: emptyStateStyle },
                React.createElement(EmptyStateTitle, null, "Empty Graph"),
                React.createElement(EmptyStateInfo, null,
                    "There is currently no graph available for ",
                    this.namespacesText(),
                    ". This could either mean there is no service mesh available for ",
                    this.props.namespaces.length === 1 ? 'this namespace' : 'these namespaces',
                    " or the service mesh has yet to see request traffic.",
                    this.props.isDisplayingUnusedNodes && (React.createElement(React.Fragment, null, " You are currently displaying 'Unused nodes', send requests to the service mesh and click 'Refresh'.")),
                    !this.props.isDisplayingUnusedNodes && (React.createElement(React.Fragment, null,
                        ' ',
                        "You can enable 'Unused nodes' to display service mesh nodes that have yet to see any request traffic."))),
                React.createElement(EmptyStateAction, null,
                    React.createElement(Button, { bsStyle: "primary", bsSize: "large", onClick: this.props.isDisplayingUnusedNodes ? this.props.action : this.props.displayUnusedNodes }, (this.props.isDisplayingUnusedNodes && React.createElement(React.Fragment, null, "Refresh")) || React.createElement(React.Fragment, null, "Display unused nodes")))));
        }
        else {
            return this.props.children;
        }
    };
    return EmptyGraphLayout;
}(React.Component));
export { EmptyGraphLayout };
var EmptyGraphLayoutContainer = connect(mapStateToProps, mapDispatchToProps)(EmptyGraphLayout);
export default EmptyGraphLayoutContainer;
//# sourceMappingURL=EmptyGraphLayout.js.map