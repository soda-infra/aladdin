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
import * as API from '../../services/Api';
import * as WorkloadListFilters from './FiltersAndSorts';
import { FilterSelected, StatefulFilters } from '../../components/Filters/StatefulFilters';
import { ListView, Paginator, Sort, ToolbarRightContent } from 'patternfly-react';
import { PromisesRegistry } from '../../utils/CancelablePromises';
import ItemDescription from './ItemDescription';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import * as ListComponent from '../../components/ListPage/ListComponent';
import { AlignRightStyle, ThinStyle } from '../../components/Filters/FilterStyles';
import { arrayEquals } from '../../utils/Common';
import { activeNamespacesSelector, durationSelector } from '../../store/Selectors';
import { DurationDropdownContainer } from '../../components/DurationDropdown/DurationDropdown';
import RefreshButtonContainer from '../../components/Refresh/RefreshButton';
var WorkloadListComponent = /** @class */ (function (_super) {
    __extends(WorkloadListComponent, _super);
    function WorkloadListComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.promises = new PromisesRegistry();
        _this.getDeploymentItems = function (data) {
            if (data.workloads) {
                return data.workloads.map(function (deployment) { return ({
                    namespace: data.namespace.name,
                    workload: deployment,
                    healthPromise: API.getWorkloadHealth(data.namespace.name, deployment.name, _this.props.duration, deployment.istioSidecar)
                }); });
            }
            return [];
        };
        _this.state = {
            listItems: [],
            pagination: _this.props.pagination,
            currentSortField: _this.props.currentSortField,
            isSortAscending: _this.props.isSortAscending
        };
        return _this;
    }
    WorkloadListComponent.prototype.componentDidMount = function () {
        this.updateListItems();
    };
    WorkloadListComponent.prototype.componentDidUpdate = function (prevProps, _prevState, _snapshot) {
        if (!this.paramsAreSynced(prevProps)) {
            this.setState({
                pagination: this.props.pagination,
                currentSortField: this.props.currentSortField,
                isSortAscending: this.props.isSortAscending
            });
            this.updateListItems();
        }
    };
    WorkloadListComponent.prototype.componentWillUnmount = function () {
        this.promises.cancelAll();
    };
    WorkloadListComponent.prototype.paramsAreSynced = function (prevProps) {
        var activeNamespacesCompare = arrayEquals(prevProps.activeNamespaces, this.props.activeNamespaces, function (n1, n2) { return n1.name === n2.name; });
        return (prevProps.pagination.page === this.props.pagination.page &&
            prevProps.pagination.perPage === this.props.pagination.perPage &&
            prevProps.duration === this.props.duration &&
            activeNamespacesCompare &&
            prevProps.isSortAscending === this.props.isSortAscending &&
            prevProps.currentSortField.title === this.props.currentSortField.title);
    };
    WorkloadListComponent.prototype.sortItemList = function (workloads, sortField, isAscending) {
        // Chain promises, as there may be an ongoing fetch/refresh and sort can be called after UI interaction
        // This ensures that the list will display the new data with the right sorting
        return this.promises.registerChained('sort', workloads, function (unsorted) {
            return WorkloadListFilters.sortWorkloadsItems(unsorted, sortField, isAscending);
        });
    };
    WorkloadListComponent.prototype.updateListItems = function (resetPagination) {
        var _this = this;
        this.promises.cancelAll();
        var activeFilters = FilterSelected.getSelected();
        var namespacesSelected = this.props.activeNamespaces.map(function (item) { return item.name; });
        if (namespacesSelected.length === 0) {
            this.promises
                .register('namespaces', API.getNamespaces())
                .then(function (namespacesResponse) {
                var namespaces = namespacesResponse.data;
                _this.fetchWorkloads(namespaces.map(function (namespace) { return namespace.name; }), activeFilters, resetPagination);
            })
                .catch(function (namespacesError) {
                if (!namespacesError.isCanceled) {
                    _this.handleAxiosError('Could not fetch namespace list', namespacesError);
                }
            });
        }
        else {
            this.fetchWorkloads(namespacesSelected, activeFilters, resetPagination);
        }
    };
    WorkloadListComponent.prototype.fetchWorkloads = function (namespaces, filters, resetPagination) {
        var _this = this;
        var workloadsConfigPromises = namespaces.map(function (namespace) { return API.getWorkloads(namespace); });
        this.promises
            .registerAll('workloads', workloadsConfigPromises)
            .then(function (responses) {
            var workloadsItems = [];
            responses.forEach(function (response) {
                workloadsItems = workloadsItems.concat(_this.getDeploymentItems(response.data));
            });
            return WorkloadListFilters.filterBy(workloadsItems, filters);
        })
            .then(function (workloadsItems) {
            var currentPage = resetPagination ? 1 : _this.state.pagination.page;
            _this.promises.cancel('sort');
            _this.sortItemList(workloadsItems, _this.state.currentSortField, _this.state.isSortAscending)
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
                _this.handleAxiosError('Could not fetch workloads list', err);
            }
        });
    };
    WorkloadListComponent.prototype.render = function () {
        var workloadList = [];
        var pageStart = (this.state.pagination.page - 1) * this.state.pagination.perPage;
        var pageEnd = pageStart + this.state.pagination.perPage;
        pageEnd = pageEnd < this.state.listItems.length ? pageEnd : this.state.listItems.length;
        for (var i = pageStart; i < pageEnd; i++) {
            workloadList.push(React.createElement(ItemDescription, { workloadItem: this.state.listItems[i], key: "ItemDescription_" + this.state.listItems[i].workload.name + "_" + i, position: i }));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(StatefulFilters, { initialFilters: WorkloadListFilters.availableFilters, onFilterChange: this.onFilterChange },
                React.createElement(Sort, { style: __assign({}, ThinStyle) },
                    React.createElement(Sort.TypeSelector, { sortTypes: WorkloadListFilters.sortFields, currentSortType: this.state.currentSortField, onSortTypeSelected: this.updateSortField }),
                    React.createElement(Sort.DirectionSelector, { isNumeric: this.state.currentSortField.isNumeric, isAscending: this.state.isSortAscending, onClick: this.updateSortDirection })),
                React.createElement(ToolbarRightContent, { style: __assign({}, AlignRightStyle) },
                    React.createElement(DurationDropdownContainer, { id: "workload-list-duration-dropdown" }),
                    React.createElement(RefreshButtonContainer, { handleRefresh: this.updateListItems }))),
            React.createElement(ListView, null, workloadList),
            React.createElement(Paginator, { viewType: "list", pagination: this.state.pagination, itemCount: this.state.listItems.length, onPageSet: this.pageSet, onPerPageSelect: this.perPageSelect })));
    };
    return WorkloadListComponent;
}(ListComponent.Component));
var mapStateToProps = function (state) { return ({
    activeNamespaces: activeNamespacesSelector(state),
    duration: durationSelector(state)
}); };
var WorkloadListContainer = connect(mapStateToProps)(WorkloadListComponent);
export default WorkloadListContainer;
//# sourceMappingURL=WorkloadListComponent.js.map