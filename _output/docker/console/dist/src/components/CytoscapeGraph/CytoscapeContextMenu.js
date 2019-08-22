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
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';
import tippy from 'tippy.js';
import { Provider } from 'react-redux';
import { store } from '../../store/ConfigStore';
import history from '../../app/History';
var CytoscapeContextMenuWrapper = /** @class */ (function (_super) {
    __extends(CytoscapeContextMenuWrapper, _super);
    function CytoscapeContextMenuWrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.handleDocumentMouseUp = function (event) {
            if (event.button === 2) {
                // Ignore mouseup of right button
                return;
            }
            var currentContextMenu = _this.getCurrentContextMenu();
            if (currentContextMenu) {
                // Allow interaction in our popper component (Selecting and copying) without it disappearing
                if (event.target && currentContextMenu.popper.contains(event.target)) {
                    return;
                }
                currentContextMenu.hide();
            }
        };
        _this.handleContextMenu = function (event) {
            // Disable the context menu in popper
            var currentContextMenu = _this.getCurrentContextMenu();
            if (currentContextMenu) {
                if (event.target && currentContextMenu.popper.contains(event.target)) {
                    event.preventDefault();
                }
            }
            return true;
        };
        _this.contextMenuRef = React.createRef();
        return _this;
    }
    CytoscapeContextMenuWrapper.prototype.componentDidMount = function () {
        document.addEventListener('mouseup', this.handleDocumentMouseUp);
    };
    CytoscapeContextMenuWrapper.prototype.componentWillUnmount = function () {
        document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    };
    // Connects cy to this component
    CytoscapeContextMenuWrapper.prototype.connectCy = function (cy) {
        var _this = this;
        cy.on('cxttapstart taphold', function (event) {
            event.preventDefault();
            if (event.target) {
                var currentContextMenu = _this.getCurrentContextMenu();
                if (currentContextMenu) {
                    currentContextMenu.hide(0); // hide it in 0ms
                }
                var contextMenuComponentType = void 0;
                if (event.target === cy) {
                    contextMenuComponentType = undefined;
                }
                else if (event.target.isNode() && event.target.isParent()) {
                    contextMenuComponentType = _this.props.groupContextMenuContent;
                }
                else if (event.target.isNode()) {
                    contextMenuComponentType = _this.props.nodeContextMenuContent;
                }
                else if (event.target.isEdge()) {
                    contextMenuComponentType = _this.props.edgeContextMenuContent;
                }
                if (contextMenuComponentType) {
                    _this.makeContextMenu(contextMenuComponentType, event.target);
                }
            }
            return false;
        });
    };
    CytoscapeContextMenuWrapper.prototype.render = function () {
        return (React.createElement("div", { className: "hidden" },
            React.createElement("div", { ref: this.contextMenuRef })));
    };
    CytoscapeContextMenuWrapper.prototype.getCurrentContextMenu = function () {
        return this.contextMenuRef.current._contextMenu;
    };
    CytoscapeContextMenuWrapper.prototype.setCurrentContextMenu = function (current) {
        this.contextMenuRef.current._contextMenu = current;
    };
    CytoscapeContextMenuWrapper.prototype.tippyDistance = function (target) {
        if (target.isNode === undefined || target.isNode()) {
            return 10;
        }
        return -30;
    };
    CytoscapeContextMenuWrapper.prototype.addContextMenuEventListener = function () {
        document.addEventListener('contextmenu', this.handleContextMenu);
    };
    CytoscapeContextMenuWrapper.prototype.removeContextMenuEventListener = function () {
        document.removeEventListener('contextmenu', this.handleContextMenu);
    };
    CytoscapeContextMenuWrapper.prototype.makeContextMenu = function (ContextMenuComponentClass, target) {
        var _this = this;
        // Prevent the tippy content from picking up the right-click when we are moving it over to the edge/node
        this.addContextMenuEventListener();
        var content = this.contextMenuRef.current;
        var tippyInstance = tippy(target.popperRef(), {
            content: content,
            trigger: 'manual',
            arrow: true,
            placement: 'bottom',
            hideOnClick: false,
            multiple: false,
            sticky: true,
            interactive: true,
            theme: 'light-border',
            size: 'large',
            distance: this.tippyDistance(target)
        }).instances[0];
        var result = (React.createElement(Provider, { store: store },
            React.createElement(Router, { history: history },
                React.createElement(ContextMenuComponentClass, __assign({ element: target, contextMenu: tippyInstance }, target.data())))));
        ReactDOM.render(result, content, function () {
            _this.setCurrentContextMenu(tippyInstance);
            tippyInstance.show();
            // Schedule the removal of the contextmenu listener after finishing with the show procedure, so we can
            // interact with the popper content e.g. select and copy (with right click) values from it.
            setTimeout(function () {
                _this.removeContextMenuEventListener();
            }, 0);
        });
    };
    return CytoscapeContextMenuWrapper;
}(React.PureComponent));
export { CytoscapeContextMenuWrapper };
//# sourceMappingURL=CytoscapeContextMenu.js.map