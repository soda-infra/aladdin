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
import { connect } from 'react-redux';
import _ from 'lodash';
import { style } from 'typestyle';
import { Button, FormControl, Icon, InputGroup, OverlayTrigger, Popover } from 'patternfly-react';
import { activeNamespacesSelector, namespaceFilterSelector, namespaceItemsSelector } from '../store/Selectors';
import { NamespaceActions } from '../actions/NamespaceAction';
import NamespaceThunkActions from '../actions/NamespaceThunkActions';
import { PfColors } from './Pf/PfColors';
import { HistoryManager, URLParam } from '../app/History';
import { BoundingClientAwareComponent, PropertyType } from './BoundingClientAwareComponent/BoundingClientAwareComponent';
var namespaceButtonColors = {
    backgroundColor: PfColors.White,
    fontSize: '1rem',
    color: '#282d33',
    textDecoration: 'none'
};
var namespaceButtonStyle = style(__assign({}, namespaceButtonColors, { height: '32px', padding: '4px 6px 5px 6px', 
    // these properties are being overridden by btn:hover/focus and btn-link:hover/focus
    $nest: {
        '&:hover': namespaceButtonColors,
        '&:focus': namespaceButtonColors
    } }));
var namespaceLabelStyle = style({
    fontWeight: 400
});
var namespaceValueStyle = style({
    fontWeight: 400
});
var popoverMarginBottom = 20;
var namespaceContainerStyle = style({
    overflow: 'auto'
});
var NamespaceDropdown = /** @class */ (function (_super) {
    __extends(NamespaceDropdown, _super);
    function NamespaceDropdown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.syncNamespacesURLParam = function () {
            var namespaces = (HistoryManager.getParam(URLParam.NAMESPACES) || '').split(',').filter(Boolean);
            if (namespaces.length > 0 && _.difference(namespaces, _this.props.activeNamespaces.map(function (item) { return item.name; }))) {
                // We must change the props of namespaces
                var items = namespaces.map(function (ns) { return ({ name: ns }); });
                _this.props.setNamespaces(items);
            }
            else if (namespaces.length === 0 && _this.props.activeNamespaces.length !== 0) {
                HistoryManager.setParam(URLParam.NAMESPACES, _this.props.activeNamespaces.map(function (item) { return item.name; }).join(','));
            }
        };
        _this.onNamespaceToggled = function (a) {
            _this.props.toggleNamespace({ name: a.target.value });
        };
        _this.onFilterChange = function (event) {
            _this.props.setFilter(event.target.value);
        };
        _this.clearFilter = function () {
            _this.props.setFilter('');
        };
        return _this;
    }
    NamespaceDropdown.prototype.componentDidMount = function () {
        this.props.refresh();
        this.syncNamespacesURLParam();
    };
    NamespaceDropdown.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.activeNamespaces !== this.props.activeNamespaces) {
            if (this.props.activeNamespaces.length === 0) {
                HistoryManager.deleteParam(URLParam.NAMESPACES);
            }
            else {
                HistoryManager.setParam(URLParam.NAMESPACES, this.props.activeNamespaces.map(function (item) { return item.name; }).join(','));
            }
        }
    };
    NamespaceDropdown.prototype.namespaceButtonText = function () {
        if (this.props.activeNamespaces.length === 0) {
            return React.createElement("span", { className: namespaceValueStyle }, "Select a namespace");
        }
        else if (this.props.activeNamespaces.length === 1) {
            return (React.createElement(React.Fragment, null,
                React.createElement("span", { className: namespaceLabelStyle }, "Namespace:"),
                React.createElement("span", null, "\u00A0"),
                React.createElement("span", { className: namespaceValueStyle }, this.props.activeNamespaces[0].name)));
        }
        else {
            return (React.createElement(React.Fragment, null,
                React.createElement("span", { className: namespaceLabelStyle }, "Namespaces:"),
                React.createElement("span", null, "\u00A0"),
                React.createElement("span", { className: namespaceValueStyle }, this.props.activeNamespaces.length + " namespaces")));
        }
    };
    NamespaceDropdown.prototype.getPopoverContent = function () {
        var _this = this;
        if (this.props.items.length > 0) {
            var activeMap_1 = this.props.activeNamespaces.reduce(function (map, namespace) {
                map[namespace.name] = namespace.name;
                return map;
            }, {});
            var checkboxStyle_1 = style({ marginLeft: 5 });
            var namespaces = this.props.items
                .filter(function (namespace) { return namespace.name.includes(_this.props.filter); })
                .map(function (namespace) { return (React.createElement("div", { id: "namespace-list-item[" + namespace.name + "]", key: "namespace-list-item[" + namespace.name + "]" },
                React.createElement("label", null,
                    React.createElement("input", { type: "checkbox", value: namespace.name, checked: !!activeMap_1[namespace.name], onChange: _this.onNamespaceToggled }),
                    React.createElement("span", { className: checkboxStyle_1 }, namespace.name)))); });
            return (React.createElement(React.Fragment, null,
                React.createElement("div", null,
                    React.createElement(InputGroup, null,
                        React.createElement(FormControl, { type: "text", name: "namespace-filter", placeholder: "Filter by keyword...", value: this.props.filter, onChange: this.onFilterChange }),
                        this.props.filter !== '' && (React.createElement(InputGroup.Button, null,
                            React.createElement(Button, { onClick: this.clearFilter },
                                React.createElement(Icon, { name: "close" })))))),
                React.createElement("div", { className: "text-right" },
                    React.createElement(Button, { disabled: this.props.activeNamespaces.length === 0, bsStyle: "link", onClick: this.props.clearAll }, "Clear all")),
                React.createElement(BoundingClientAwareComponent, { className: namespaceContainerStyle, maxHeight: { type: PropertyType.VIEWPORT_HEIGHT_MINUS_TOP, margin: popoverMarginBottom } }, namespaces)));
        }
        return React.createElement("div", null, "No namespaces found or they haven't loaded yet");
    };
    NamespaceDropdown.prototype.render = function () {
        var popover = React.createElement(Popover, { id: "namespace-list-layers-popover" }, this.getPopoverContent());
        return (React.createElement(OverlayTrigger, { onEnter: this.props.refresh, overlay: popover, placement: "bottom", trigger: ['click'], rootClose: true },
            React.createElement(Button, { bsClass: "btn btn-link btn-lg  " + namespaceButtonStyle, id: "namespace-selector" },
                this.namespaceButtonText(),
                " ",
                React.createElement(Icon, { name: "angle-down" }))));
    };
    return NamespaceDropdown;
}(React.PureComponent));
export { NamespaceDropdown };
var mapStateToProps = function (state) {
    return {
        items: namespaceItemsSelector(state),
        activeNamespaces: activeNamespacesSelector(state),
        filter: namespaceFilterSelector(state)
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        refresh: function () {
            dispatch(NamespaceThunkActions.fetchNamespacesIfNeeded());
        },
        toggleNamespace: function (namespace) {
            dispatch(NamespaceActions.toggleActiveNamespace(namespace));
        },
        clearAll: function () {
            dispatch(NamespaceActions.setActiveNamespaces([]));
        },
        setNamespaces: function (namespaces) {
            dispatch(NamespaceActions.setActiveNamespaces(namespaces));
        },
        setFilter: function (filter) {
            dispatch(NamespaceActions.setFilter(filter));
        }
    };
};
var NamespaceDropdownContainer = connect(mapStateToProps, mapDispatchToProps)(NamespaceDropdown);
export default NamespaceDropdownContainer;
//# sourceMappingURL=NamespaceDropdown.js.map