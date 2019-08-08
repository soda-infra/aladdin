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
import { ListView, ListViewIcon, ListViewItem, Paginator, Sort, ToolbarRightContent } from 'patternfly-react';
import { FilterSelected, StatefulFilters } from '../../components/Filters/StatefulFilters';
import * as API from '../../services/Api';
import { dicIstioType, filterByConfigValidation, filterByName, toIstioItems } from '../../types/IstioConfigList';
import { Link } from 'react-router-dom';
import { PfColors } from '../../components/Pf/PfColors';
import { ConfigIndicator } from '../../components/ConfigValidation/ConfigIndicator';
import { PromisesRegistry } from '../../utils/CancelablePromises';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import * as IstioConfigListFilters from './FiltersAndSorts';
import * as ListComponent from '../../components/ListPage/ListComponent';
import { getFilterSelectedValues } from '../../components/Filters/CommonFilters';
import { AlignRightStyle, ThinStyle } from '../../components/Filters/FilterStyles';
import { arrayEquals } from '../../utils/Common';
import { activeNamespacesSelector } from '../../store/Selectors';
import RefreshButtonContainer from '../../components/Refresh/RefreshButton';
var IstioConfigListComponent = /** @class */ (function (_super) {
    __extends(IstioConfigListComponent, _super);
    function IstioConfigListComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.promises = new PromisesRegistry();
        _this.state = {
            listItems: [],
            pagination: _this.props.pagination,
            currentSortField: _this.props.currentSortField,
            isSortAscending: _this.props.isSortAscending
        };
        return _this;
    }
    IstioConfigListComponent.prototype.componentDidMount = function () {
        this.updateListItems();
    };
    IstioConfigListComponent.prototype.componentDidUpdate = function (prevProps, _prevState, _snapshot) {
        if (!this.paramsAreSynced(prevProps)) {
            this.setState({
                pagination: this.props.pagination,
                currentSortField: this.props.currentSortField,
                isSortAscending: this.props.isSortAscending
            });
            this.updateListItems();
        }
    };
    IstioConfigListComponent.prototype.componentWillUnmount = function () {
        this.promises.cancelAll();
    };
    IstioConfigListComponent.prototype.paramsAreSynced = function (prevProps) {
        var activeNamespacesCompare = arrayEquals(prevProps.activeNamespaces, this.props.activeNamespaces, function (n1, n2) { return n1.name === n2.name; });
        return (prevProps.pagination.page === this.props.pagination.page &&
            prevProps.pagination.perPage === this.props.pagination.perPage &&
            activeNamespacesCompare &&
            prevProps.isSortAscending === this.props.isSortAscending &&
            prevProps.currentSortField.title === this.props.currentSortField.title);
    };
    IstioConfigListComponent.prototype.sortItemList = function (apps, sortField, isAscending) {
        return IstioConfigListFilters.sortIstioItems(apps, sortField, isAscending);
    };
    IstioConfigListComponent.prototype.updateListItems = function (resetPagination) {
        var _this = this;
        this.promises.cancelAll();
        var activeFilters = FilterSelected.getSelected();
        var namespacesSelected = this.props.activeNamespaces.map(function (item) { return item.name; });
        var istioTypeFilters = getFilterSelectedValues(IstioConfigListFilters.istioTypeFilter, activeFilters).map(function (value) { return dicIstioType[value]; });
        var istioNameFilters = getFilterSelectedValues(IstioConfigListFilters.istioNameFilter, activeFilters);
        var configValidationFilters = getFilterSelectedValues(IstioConfigListFilters.configValidationFilter, activeFilters);
        if (namespacesSelected.length === 0) {
            this.promises
                .register('namespaces', API.getNamespaces())
                .then(function (namespacesResponse) {
                var namespaces = namespacesResponse.data;
                _this.fetchConfigs(namespaces.map(function (namespace) { return namespace.name; }), istioTypeFilters, istioNameFilters, configValidationFilters, resetPagination);
            })
                .catch(function (namespacesError) {
                if (!namespacesError.isCanceled) {
                    _this.handleAxiosError('Could not fetch namespace list', namespacesError);
                }
            });
        }
        else {
            this.fetchConfigs(namespacesSelected, istioTypeFilters, istioNameFilters, configValidationFilters, resetPagination);
        }
    };
    IstioConfigListComponent.prototype.fetchConfigs = function (namespaces, istioTypeFilters, istioNameFilters, configValidationFilters, resetPagination) {
        var _this = this;
        var configsPromises = this.fetchIstioConfigs(namespaces, istioTypeFilters, istioNameFilters);
        configsPromises
            .then(function (items) {
            return IstioConfigListFilters.sortIstioItems(items, _this.state.currentSortField, _this.state.isSortAscending);
        })
            .then(function (configItems) { return filterByConfigValidation(configItems, configValidationFilters); })
            .then(function (sorted) {
            // Update the view when data is fetched
            var currentPage = resetPagination ? 1 : _this.state.pagination.page;
            _this.setState(function (prevState) {
                return {
                    listItems: sorted,
                    pagination: {
                        page: currentPage,
                        perPage: prevState.pagination.perPage,
                        perPageOptions: ListPagesHelper.perPageOptions
                    }
                };
            });
        })
            .catch(function (istioError) {
            console.log(istioError);
            if (!istioError.isCanceled) {
                _this.handleAxiosError('Could not fetch Istio objects list', istioError);
            }
        });
    };
    // Fetch the Istio configs, apply filters and map them into flattened list items
    IstioConfigListComponent.prototype.fetchIstioConfigs = function (namespaces, typeFilters, istioNameFilters) {
        return this.promises
            .registerAll('configs', namespaces.map(function (ns) { return API.getIstioConfig(ns, typeFilters, true); }))
            .then(function (responses) {
            var istioItems = [];
            responses.forEach(function (response) {
                istioItems = istioItems.concat(toIstioItems(filterByName(response.data, istioNameFilters)));
            });
            return istioItems;
        });
    };
    IstioConfigListComponent.prototype.renderIstioItem = function (istioItem, index) {
        var to = '/namespaces/' + istioItem.namespace + '/istio';
        var name = istioItem.name;
        var iconName = '';
        var iconType = '';
        var type = 'No type found';
        if (istioItem.type === 'gateway') {
            iconName = 'route';
            iconType = 'pf';
            type = 'Gateway';
        }
        else if (istioItem.type === 'virtualservice') {
            iconName = 'code-fork';
            iconType = 'fa';
            type = 'VirtualService';
        }
        else if (istioItem.type === 'destinationrule') {
            iconName = 'network';
            iconType = 'pf';
            type = 'DestinationRule';
        }
        else if (istioItem.type === 'serviceentry') {
            iconName = 'services';
            iconType = 'pf';
            type = 'ServiceEntry';
        }
        else if (istioItem.type === 'rule') {
            iconName = 'migration';
            iconType = 'pf';
            type = 'Rule';
        }
        else if (istioItem.type === 'adapter') {
            iconName = 'migration';
            iconType = 'pf';
            type = 'Adapter: ' + istioItem.adapter.adapter;
        }
        else if (istioItem.type === 'template') {
            iconName = 'migration';
            iconType = 'pf';
            type = 'Template: ' + istioItem.template.template;
        }
        else if (istioItem.type === 'quotaspec') {
            iconName = 'process-automation';
            iconType = 'pf';
            type = 'QuotaSpec';
        }
        else if (istioItem.type === 'quotaspecbinding') {
            iconName = 'integration';
            iconType = 'pf';
            type = 'QuotaSpecBinding';
        }
        else if (istioItem.type === 'policy') {
            iconName = 'locked';
            iconType = 'pf';
            type = 'Policy';
        }
        else if (istioItem.type === 'meshpolicy') {
            iconName = 'locked';
            iconType = 'pf';
            type = 'MeshPolicy';
        }
        else if (istioItem.type === 'clusterrbacconfig') {
            iconName = 'locked';
            iconType = 'pf';
            type = 'ClusterRbacConfig';
        }
        else if (istioItem.type === 'rbacconfig') {
            iconName = 'locked';
            iconType = 'pf';
            type = 'RbacConfig';
        }
        else if (istioItem.type === 'sidecar') {
            iconName = 'integration';
            iconType = 'pf';
            type = 'Sidecar';
        }
        else if (istioItem.type === 'servicerole') {
            iconName = 'locked';
            iconType = 'pf';
            type = 'ServiceRole';
        }
        else if (istioItem.type === 'servicerolebinding') {
            iconName = 'locked';
            iconType = 'pf';
            type = 'ServiceRoleBinding';
        }
        else {
            console.warn('Istio Object ' + istioItem.type + ' not supported');
        }
        if (type === 'No type found') {
            return undefined;
        }
        // Adapters and Templates need to pass subtype
        if (istioItem.type === 'adapter' || istioItem.type === 'template') {
            // Build a /adapters/<adapter_type_plural>/<adapter_name> or
            //         /templates/<template_type_plural>/<template_name>
            var istioType = istioItem.type + 's';
            var subtype = istioItem.type === 'adapter' ? istioItem.adapter.adapters : istioItem.template.templates;
            to = to + '/' + istioType + '/' + subtype + '/' + name;
        }
        else {
            to = to + '/' + dicIstioType[type] + '/' + name;
        }
        var itemDescription = (React.createElement("table", { style: { width: '30em', tableLayout: 'fixed' } },
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", null, type),
                    istioItem.validation ? (React.createElement("td", null,
                        React.createElement("strong", null, "Config: "),
                        ' ',
                        React.createElement(ConfigIndicator, { id: index + '-config-validation', validations: [istioItem.validation], size: "medium" }))) : (undefined)))));
        return (React.createElement(Link, { key: 'istioItemItem_' + index + '_' + istioItem.namespace + '_' + name, to: to, style: { color: PfColors.Black } },
            React.createElement(ListViewItem, { leftContent: React.createElement(ListViewIcon, { type: iconType, name: iconName }), heading: React.createElement("span", null,
                    name,
                    React.createElement("small", null, istioItem.namespace)), description: itemDescription })));
    };
    IstioConfigListComponent.prototype.render = function () {
        var istioList = [];
        var pageStart = (this.state.pagination.page - 1) * this.state.pagination.perPage;
        var pageEnd = pageStart + this.state.pagination.perPage;
        pageEnd = pageEnd < this.state.listItems.length ? pageEnd : this.state.listItems.length;
        for (var i = pageStart; i < pageEnd; i++) {
            istioList.push(this.renderIstioItem(this.state.listItems[i], i));
        }
        var ruleListComponent;
        ruleListComponent = (React.createElement(React.Fragment, null,
            React.createElement(StatefulFilters, { initialFilters: IstioConfigListFilters.availableFilters, onFilterChange: this.onFilterChange },
                React.createElement(Sort, { style: __assign({}, ThinStyle) },
                    React.createElement(Sort.TypeSelector, { sortTypes: IstioConfigListFilters.sortFields, currentSortType: this.state.currentSortField, onSortTypeSelected: this.updateSortField }),
                    React.createElement(Sort.DirectionSelector, { isNumeric: false, isAscending: this.state.isSortAscending, onClick: this.updateSortDirection })),
                React.createElement(ToolbarRightContent, { style: __assign({}, AlignRightStyle) },
                    React.createElement(RefreshButtonContainer, { handleRefresh: this.updateListItems }))),
            React.createElement(ListView, null, istioList),
            React.createElement(Paginator, { viewType: "list", pagination: this.state.pagination, itemCount: this.state.listItems.length, onPageSet: this.pageSet, onPerPageSelect: this.perPageSelect })));
        return React.createElement("div", null, ruleListComponent);
    };
    return IstioConfigListComponent;
}(ListComponent.Component));
var mapStateToProps = function (state) { return ({
    activeNamespaces: activeNamespacesSelector(state)
}); };
var IstioConfigListContainer = connect(mapStateToProps, null)(IstioConfigListComponent);
export default IstioConfigListContainer;
//# sourceMappingURL=IstioConfigListComponent.js.map