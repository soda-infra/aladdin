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
import { Filter, FormControl, Toolbar } from 'patternfly-react';
import { FILTER_ACTION_UPDATE } from '../../types/Filters';
import * as ListPagesHelper from '../ListPage/ListPagesHelper';
import { PromisesRegistry } from '../../utils/CancelablePromises';
var FilterSelected = /** @class */ (function () {
    function FilterSelected() {
    }
    FilterSelected.selectedFilters = undefined;
    FilterSelected.setSelected = function (activeFilters) {
        FilterSelected.selectedFilters = activeFilters;
    };
    FilterSelected.getSelected = function () {
        return FilterSelected.selectedFilters || [];
    };
    FilterSelected.isInitialized = function () {
        return FilterSelected.selectedFilters !== undefined;
    };
    return FilterSelected;
}());
export { FilterSelected };
// align with separator start
var alignLeftStyle = {
    marginLeft: '-20px'
};
// reduce toolbar padding from 20px to 10px. save horiz space at border lines and match OS console
var thinBorderStyle = {
    paddingRight: '10px'
};
var StatefulFilters = /** @class */ (function (_super) {
    __extends(StatefulFilters, _super);
    function StatefulFilters(props) {
        var _this = _super.call(this, props) || this;
        _this.promises = new PromisesRegistry();
        _this.filterAdded = function (field, value) {
            var activeFilters = _this.state.activeFilters;
            var activeFilter = {
                category: field.title,
                value: value
            };
            var typeFilterPresent = activeFilters.filter(function (filter) { return filter.category === field.title; }).length > 0;
            if (field.action === FILTER_ACTION_UPDATE && typeFilterPresent) {
                activeFilters.forEach(function (filter) {
                    if (filter.category === field.title) {
                        filter.value = value;
                    }
                });
            }
            else {
                activeFilters.push(activeFilter);
            }
            _this.updateActiveFilters(activeFilters);
        };
        _this.selectFilterType = function (filterType) {
            var currentFilterType = _this.state.currentFilterType;
            if (currentFilterType !== filterType) {
                _this.setState({
                    currentValue: '',
                    currentFilterType: filterType
                });
            }
        };
        _this.filterValueSelected = function (filterValue) {
            var _a = _this.state, currentFilterType = _a.currentFilterType, currentValue = _a.currentValue;
            if (filterValue &&
                filterValue.id !== currentValue &&
                !_this.duplicatesFilter(currentFilterType, filterValue.title)) {
                _this.filterAdded(currentFilterType, filterValue.title);
            }
        };
        _this.updateCurrentValue = function (event) {
            _this.setState({ currentValue: event.target.value });
        };
        _this.onValueKeyPress = function (keyEvent) {
            var _a = _this.state, currentValue = _a.currentValue, currentFilterType = _a.currentFilterType;
            if (keyEvent.key === 'Enter') {
                if (currentValue && currentValue.length > 0 && !_this.duplicatesFilter(currentFilterType, currentValue)) {
                    _this.filterAdded(currentFilterType, currentValue);
                }
                _this.setState({ currentValue: '' });
                keyEvent.stopPropagation();
                keyEvent.preventDefault();
            }
        };
        _this.duplicatesFilter = function (filterType, filterValue) {
            var filter = _this.state.activeFilters.find(function (activeFilter) {
                return filterValue === activeFilter.value && filterType.title === activeFilter.category;
            });
            return !!filter;
        };
        _this.removeFilter = function (filter) {
            var activeFilters = _this.state.activeFilters;
            var index = activeFilters.indexOf(filter);
            if (index > -1) {
                var updated = activeFilters.slice(0, index).concat(activeFilters.slice(index + 1));
                _this.updateActiveFilters(updated);
            }
        };
        _this.clearFilters = function () {
            _this.updateActiveFilters([]);
        };
        var active = FilterSelected.getSelected();
        if (!FilterSelected.isInitialized()) {
            active = ListPagesHelper.getFiltersFromURL(_this.props.initialFilters);
            FilterSelected.setSelected(active);
        }
        else if (!ListPagesHelper.filtersMatchURL(_this.props.initialFilters, active)) {
            active = ListPagesHelper.setFiltersToURL(_this.props.initialFilters, active);
            FilterSelected.setSelected(active);
        }
        _this.state = {
            currentFilterType: _this.props.initialFilters[0],
            filterTypes: _this.props.initialFilters,
            activeFilters: active,
            currentValue: ''
        };
        return _this;
    }
    StatefulFilters.prototype.componentDidMount = function () {
        var _this = this;
        // Call all loaders from FilterTypes and set results in state
        var filterTypePromises = this.props.initialFilters.map(function (ft) {
            if (ft.loader) {
                return ft.loader().then(function (values) {
                    ft.filterValues = values;
                    return {
                        id: ft.id,
                        title: ft.title,
                        placeholder: ft.placeholder,
                        filterType: ft.filterType,
                        action: ft.action,
                        filterValues: ft.filterValues
                    };
                });
            }
            else {
                return Promise.resolve(ft);
            }
        });
        this.promises.registerAll('filterType', filterTypePromises).then(function (types) { return _this.setState({ filterTypes: types }); });
    };
    StatefulFilters.prototype.componentDidUpdate = function (_prevProps, _prevState, _snapshot) {
        if (!ListPagesHelper.filtersMatchURL(this.state.filterTypes, this.state.activeFilters)) {
            ListPagesHelper.setFiltersToURL(this.state.filterTypes, this.state.activeFilters);
        }
    };
    StatefulFilters.prototype.componentWillUnmount = function () {
        this.promises.cancelAll();
    };
    StatefulFilters.prototype.updateActiveFilters = function (activeFilters) {
        var cleanFilters = ListPagesHelper.setFiltersToURL(this.state.filterTypes, activeFilters);
        FilterSelected.setSelected(cleanFilters);
        this.setState({ activeFilters: cleanFilters });
        this.props.onFilterChange();
    };
    StatefulFilters.prototype.renderInput = function () {
        var _this = this;
        var _a = this.state, currentFilterType = _a.currentFilterType, currentValue = _a.currentValue;
        if (!currentFilterType) {
            return null;
        }
        if (currentFilterType.filterType === 'select') {
            return (React.createElement(Filter.ValueSelector, { filterValues: currentFilterType.filterValues, placeholder: currentFilterType.placeholder, currentValue: currentValue, onFilterValueSelected: this.filterValueSelected }));
        }
        else {
            return (React.createElement(FormControl, { type: currentFilterType.filterType, value: currentValue, placeholder: currentFilterType.placeholder, onChange: function (e) { return _this.updateCurrentValue(e); }, onKeyPress: function (e) { return _this.onValueKeyPress(e); } }));
        }
    };
    StatefulFilters.prototype.render = function () {
        var _this = this;
        var _a = this.state, currentFilterType = _a.currentFilterType, activeFilters = _a.activeFilters;
        return (React.createElement("div", null,
            React.createElement(Toolbar, null,
                React.createElement(Filter, { style: __assign({}, alignLeftStyle, thinBorderStyle) },
                    React.createElement(Filter.TypeSelector, { filterTypes: this.state.filterTypes, currentFilterType: currentFilterType, onFilterTypeSelected: this.selectFilterType }),
                    this.renderInput()),
                this.props.children,
                activeFilters && activeFilters.length > 0 && (React.createElement(Toolbar.Results, null,
                    React.createElement(Filter.ActiveLabel, null, 'Active Filters:'),
                    React.createElement(Filter.List, null, activeFilters.map(function (item, index) {
                        return (React.createElement(Filter.Item, { key: index, onRemove: _this.removeFilter, filterData: item }, item.category + ': ' + item.value));
                    })),
                    React.createElement("a", { href: "#", onClick: function (e) {
                            e.preventDefault();
                            _this.clearFilters();
                        } }, "Clear All Filters"))))));
    };
    return StatefulFilters;
}(React.Component));
export { StatefulFilters };
export default StatefulFilters;
//# sourceMappingURL=StatefulFilters.js.map