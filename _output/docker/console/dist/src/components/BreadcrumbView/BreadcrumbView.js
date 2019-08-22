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
import { Paths } from '../../config';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'patternfly-react';
import { FilterSelected } from '../Filters/StatefulFilters';
import { dicIstioType } from '../../types/IstioConfigList';
var ItemNames = {
    applications: 'App',
    services: 'Service',
    workloads: 'Workload',
    istio: 'Istio Object'
};
var IstioName = 'Istio Config';
var ISTIO_TYPES = ['templates', 'adapters'];
var BreadcrumbView = /** @class */ (function (_super) {
    __extends(BreadcrumbView, _super);
    function BreadcrumbView(props) {
        var _this = _super.call(this, props) || this;
        _this.updateItem = function () {
            var namespaceRegex = /namespaces\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)(\/([a-z0-9-]+))?(\/([a-z0-9-]+))?/;
            var match = _this.props.location.pathname.match(namespaceRegex) || [];
            var ns = match[1];
            var page = Paths[match[2].toUpperCase()];
            var istioType = match[3];
            var itemName = match[3];
            if (page === 'istio') {
                ISTIO_TYPES.includes(istioType) ? (itemName = match[7]) : (itemName = match[5]);
            }
            return {
                namespace: ns,
                pathItem: page,
                item: itemName,
                itemName: ItemNames[page],
                istioType: istioType
            };
        };
        _this.cleanFilters = function () {
            FilterSelected.setSelected([]);
        };
        _this.updateTypeFilter = function () {
            _this.cleanFilters();
            // When updateTypeFilter is called, selected filters are already updated with namespace. Just push additional type obj
            var activeFilters = FilterSelected.getSelected();
            activeFilters.push({
                category: 'Istio Type',
                value: dicIstioType[_this.state.istioType || '']
            });
            FilterSelected.setSelected(activeFilters);
        };
        _this.isIstio = function () {
            return _this.state.pathItem === 'istio';
        };
        _this.getItemPage = function () {
            return "/namespaces/" + _this.state.namespace + "/" + _this.state.pathItem + "/" + _this.state.item;
        };
        _this.state = _this.updateItem();
        return _this;
    }
    BreadcrumbView.prototype.componentDidUpdate = function (prevProps, _prevState, _snapshot) {
        if (prevProps.location !== this.props.location) {
            this.setState(this.updateItem());
        }
    };
    BreadcrumbView.prototype.render = function () {
        var _a = this.state, namespace = _a.namespace, itemName = _a.itemName, item = _a.item, istioType = _a.istioType, pathItem = _a.pathItem;
        var isIstio = this.isIstio();
        var linkItem = isIstio ? (React.createElement(Breadcrumb.Item, { componentClass: "span", active: true },
            itemName,
            ": ",
            item)) : (React.createElement(Breadcrumb.Item, { componentClass: "span" },
            React.createElement(Link, { to: this.getItemPage(), onClick: this.cleanFilters },
                itemName,
                ": ",
                item)));
        return (React.createElement(Breadcrumb, { title: true },
            React.createElement(Breadcrumb.Item, { componentClass: "span" },
                React.createElement(Link, { to: "/" + pathItem, onClick: this.cleanFilters }, isIstio ? IstioName : BreadcrumbView.capitalize(pathItem))),
            React.createElement(Breadcrumb.Item, { componentClass: "span" },
                React.createElement(Link, { to: "/" + pathItem + "?namespaces=" + namespace, onClick: this.cleanFilters },
                    "Namespace: ",
                    namespace)),
            isIstio && (React.createElement(Breadcrumb.Item, { componentClass: "span" },
                React.createElement(Link, { to: "/" + pathItem + "?namespaces=" + namespace, onClick: this.updateTypeFilter },
                    itemName,
                    " Type: ",
                    istioType))),
            linkItem));
    };
    BreadcrumbView.capitalize = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return BreadcrumbView;
}(React.Component));
export { BreadcrumbView };
export default BreadcrumbView;
//# sourceMappingURL=BreadcrumbView.js.map