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
import * as ListPagesHelper from './ListPagesHelper';
import * as API from '../../services/Api';
import { HistoryManager, URLParam } from '../../app/History';
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(props) {
        var _this = _super.call(this, props) || this;
        _this.onFilterChange = function () {
            // Resetting pagination when filters change
            HistoryManager.deleteParam(URLParam.PAGE);
            _this.updateListItems(true);
        };
        _this.handleError = function (error) {
            ListPagesHelper.handleError(error);
        };
        _this.pageSet = function (page) {
            _this.setState(function (prevState) {
                return {
                    listItems: prevState.listItems,
                    pagination: {
                        page: page,
                        perPage: prevState.pagination.perPage,
                        perPageOptions: ListPagesHelper.perPageOptions
                    }
                };
            });
            HistoryManager.setParam(URLParam.PAGE, String(page));
        };
        _this.perPageSelect = function (perPage) {
            _this.setState(function (prevState) {
                return {
                    listItems: prevState.listItems,
                    pagination: {
                        page: 1,
                        perPage: perPage,
                        perPageOptions: ListPagesHelper.perPageOptions
                    }
                };
            });
            HistoryManager.setParams([
                { name: URLParam.PAGE, value: '1' },
                { name: URLParam.PER_PAGE, value: String(perPage) }
            ]);
        };
        _this.updateSortField = function (sortField) {
            _this.sortItemList(_this.state.listItems, sortField, _this.state.isSortAscending).then(function (sorted) {
                _this.setState({
                    currentSortField: sortField,
                    listItems: sorted
                });
                HistoryManager.setParam(URLParam.SORT, sortField.param);
            });
        };
        _this.updateSortDirection = function () {
            _this.sortItemList(_this.state.listItems, _this.state.currentSortField, !_this.state.isSortAscending).then(function (sorted) {
                _this.setState({
                    isSortAscending: !_this.state.isSortAscending,
                    listItems: sorted
                });
                HistoryManager.setParam(URLParam.DIRECTION, _this.state.isSortAscending ? 'asc' : 'desc');
            });
        };
        _this.updateListItems = _this.updateListItems.bind(_this);
        _this.sortItemList = _this.sortItemList.bind(_this);
        return _this;
    }
    Component.prototype.handleAxiosError = function (message, error) {
        var errMsg = API.getErrorMsg(message, error);
        console.error(errMsg);
        this.handleError(errMsg);
    };
    return Component;
}(React.Component));
export { Component };
//# sourceMappingURL=ListComponent.js.map