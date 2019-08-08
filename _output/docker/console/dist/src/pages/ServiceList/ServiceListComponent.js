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
import { Link } from 'react-router-dom';
import { FilterSelected, StatefulFilters } from '../../components/Filters/StatefulFilters';
import { PfColors } from '../../components/Pf/PfColors';
import * as API from '../../services/Api';
import { PromisesRegistry } from '../../utils/CancelablePromises';
import ItemDescription from './ItemDescription';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import * as ServiceListFilters from './FiltersAndSorts';
import './ServiceListComponent.css';
import * as ListComponent from '../../components/ListPage/ListComponent';
import { AlignRightStyle, ThinStyle } from '../../components/Filters/FilterStyles';
import { arrayEquals } from '../../utils/Common';
import { activeNamespacesSelector, durationSelector } from '../../store/Selectors';
import { DurationDropdownContainer } from '../../components/DurationDropdown/DurationDropdown';
import RefreshButtonContainer from '../../components/Refresh/RefreshButton';
var ServiceListComponent = /** @class */ (function (_super) {
    __extends(ServiceListComponent, _super);
    function ServiceListComponent(props) {
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
    ServiceListComponent.prototype.componentDidMount = function () {
        this.updateListItems();
    };
    ServiceListComponent.prototype.componentDidUpdate = function (prevProps, _prevState, _snapshot) {
        if (!this.paramsAreSynced(prevProps)) {
            this.setState({
                pagination: this.props.pagination,
                currentSortField: this.props.currentSortField,
                isSortAscending: this.props.isSortAscending
            });
            this.updateListItems();
        }
    };
    ServiceListComponent.prototype.componentWillUnmount = function () {
        this.promises.cancelAll();
    };
    ServiceListComponent.prototype.paramsAreSynced = function (prevProps) {
        var activeNamespacesCompare = arrayEquals(prevProps.activeNamespaces, this.props.activeNamespaces, function (n1, n2) { return n1.name === n2.name; });
        return (prevProps.pagination.page === this.props.pagination.page &&
            prevProps.pagination.perPage === this.props.pagination.perPage &&
            prevProps.duration === this.props.duration &&
            activeNamespacesCompare &&
            prevProps.isSortAscending === this.props.isSortAscending &&
            prevProps.currentSortField.title === this.props.currentSortField.title);
    };
    ServiceListComponent.prototype.sortItemList = function (services, sortField, isAscending) {
        // Chain promises, as there may be an ongoing fetch/refresh and sort can be called after UI interaction
        // This ensures that the list will display the new data with the right sorting
        return this.promises.registerChained('sort', services, function (unsorted) {
            return ServiceListFilters.sortServices(unsorted, sortField, isAscending);
        });
    };
    ServiceListComponent.prototype.updateListItems = function (resetPagination) {
        var _this = this;
        this.promises.cancelAll();
        var activeFilters = FilterSelected.getSelected();
        var namespacesSelected = this.props.activeNamespaces.map(function (item) { return item.name; });
        if (namespacesSelected.length === 0) {
            this.promises
                .register('namespaces', API.getNamespaces())
                .then(function (namespacesResponse) {
                var namespaces = namespacesResponse.data;
                _this.fetchServices(namespaces.map(function (namespace) { return namespace.name; }), activeFilters, _this.props.duration, resetPagination);
            })
                .catch(function (namespacesError) {
                if (!namespacesError.isCanceled) {
                    _this.handleAxiosError('Could not fetch namespace list', namespacesError);
                }
            });
        }
        else {
            this.fetchServices(namespacesSelected, activeFilters, this.props.duration, resetPagination);
        }
    };
    ServiceListComponent.prototype.getServiceItem = function (data, rateInterval) {
        var _this = this;
        if (data.services) {
            return data.services.map(function (service) { return ({
                name: service.name,
                istioSidecar: service.istioSidecar,
                namespace: data.namespace.name,
                healthPromise: API.getServiceHealth(data.namespace.name, service.name, rateInterval, service.istioSidecar),
                validation: _this.getServiceValidation(service.name, data.validations)
            }); });
        }
        return [];
    };
    ServiceListComponent.prototype.fetchServices = function (namespaces, filters, rateInterval, resetPagination) {
        var _this = this;
        var servicesPromises = namespaces.map(function (ns) { return API.getServices(ns); });
        this.promises
            .registerAll('services', servicesPromises)
            .then(function (responses) {
            var serviceListItems = [];
            responses.forEach(function (response) {
                serviceListItems = serviceListItems.concat(_this.getServiceItem(response.data, rateInterval));
            });
            return ServiceListFilters.filterBy(serviceListItems, filters);
        })
            .then(function (serviceListItems) {
            var currentPage = resetPagination ? 1 : _this.state.pagination.page;
            _this.promises.cancel('sort');
            _this.sortItemList(serviceListItems, _this.state.currentSortField, _this.state.isSortAscending)
                .then(function (sorted) {
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
                .catch(function (err) {
                if (!err.isCanceled) {
                    console.debug(err);
                }
            });
        })
            .catch(function (err) {
            if (!err.isCanceled) {
                _this.handleAxiosError('Could not fetch services list', err);
            }
        });
    };
    ServiceListComponent.prototype.getServiceValidation = function (name, validations) {
        var type = 'service'; // Using 'service' directly is disallowed
        return validations[type][name];
    };
    ServiceListComponent.prototype.render = function () {
        var serviceList = [];
        var pageStart = (this.state.pagination.page - 1) * this.state.pagination.perPage;
        var pageEnd = pageStart + this.state.pagination.perPage;
        pageEnd = pageEnd < this.state.listItems.length ? pageEnd : this.state.listItems.length;
        for (var i = pageStart; i < pageEnd; i++) {
            var serviceItem = this.state.listItems[i];
            var to = '/namespaces/' + serviceItem.namespace + '/services/' + serviceItem.name;
            serviceList.push(React.createElement(Link, { key: to, to: to, style: { color: PfColors.Black } },
                React.createElement(ListViewItem, { leftContent: React.createElement(ListViewIcon, { type: "pf", name: "service" }), heading: React.createElement("div", { className: "ServiceList-Heading" },
                        React.createElement("div", { className: "ServiceList-Title" },
                            serviceItem.name,
                            React.createElement("small", null, serviceItem.namespace))), 
                    // Prettier makes irrelevant line-breaking clashing with tslint
                    // prettier-ignore
                    description: React.createElement(ItemDescription, { item: serviceItem }) })));
        }
        return (React.createElement("div", null,
            React.createElement(StatefulFilters, { initialFilters: ServiceListFilters.availableFilters, onFilterChange: this.onFilterChange },
                React.createElement(Sort, { style: __assign({}, ThinStyle) },
                    React.createElement(Sort.TypeSelector, { sortTypes: ServiceListFilters.sortFields, currentSortType: this.state.currentSortField, onSortTypeSelected: this.updateSortField }),
                    React.createElement(Sort.DirectionSelector, { isNumeric: this.state.currentSortField.isNumeric, isAscending: this.state.isSortAscending, onClick: this.updateSortDirection })),
                React.createElement(ToolbarRightContent, { style: __assign({}, AlignRightStyle) },
                    React.createElement(DurationDropdownContainer, { id: "service-list-duration-dropdown" }),
                    React.createElement(RefreshButtonContainer, { handleRefresh: this.updateListItems }))),
            React.createElement(ListView, null, serviceList),
            React.createElement(Paginator, { viewType: "list", pagination: this.state.pagination, itemCount: this.state.listItems.length, onPageSet: this.pageSet, onPerPageSelect: this.perPageSelect })));
    };
    return ServiceListComponent;
}(ListComponent.Component));
var mapStateToProps = function (state) { return ({
    activeNamespaces: activeNamespacesSelector(state),
    duration: durationSelector(state)
}); };
var ServiceListComponentContainer = connect(mapStateToProps)(ServiceListComponent);
export default ServiceListComponentContainer;
//# sourceMappingURL=ServiceListComponent.js.map