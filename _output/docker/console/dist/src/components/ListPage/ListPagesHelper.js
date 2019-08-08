import history, { URLParam, HistoryManager } from '../../app/History';
import { config } from '../../config';
import * as MessageCenter from '../../utils/MessageCenter';
export var perPageOptions = [5, 10, 15];
var defaultDuration = 600;
var defaultPollInterval = config.toolbar.defaultPollInterval;
export var handleError = function (error) {
    MessageCenter.add(error);
};
export var getFiltersFromURL = function (filterTypes) {
    var urlParams = new URLSearchParams(history.location.search);
    var activeFilters = [];
    filterTypes.forEach(function (filter) {
        urlParams.getAll(filter.id).forEach(function (value) {
            activeFilters.push({
                category: filter.title,
                value: value
            });
        });
    });
    return activeFilters;
};
export var setFiltersToURL = function (filterTypes, filters) {
    var urlParams = new URLSearchParams(history.location.search);
    filterTypes.forEach(function (type) {
        urlParams.delete(type.id);
    });
    var cleanFilters = [];
    filters.forEach(function (activeFilter) {
        var filterType = filterTypes.find(function (filter) { return filter.title === activeFilter.category; });
        if (!filterType) {
            return;
        }
        cleanFilters.push(activeFilter);
        urlParams.append(filterType.id, activeFilter.value);
    });
    // Resetting pagination when filters change
    urlParams.delete(URLParam.PAGE);
    history.push(history.location.pathname + '?' + urlParams.toString());
    return cleanFilters;
};
export var filtersMatchURL = function (filterTypes, filters) {
    // This can probably be improved and/or simplified?
    var fromFilters = new Map();
    filters.forEach(function (activeFilter) {
        var existingValue = fromFilters.get(activeFilter.category) || [];
        fromFilters.set(activeFilter.category, existingValue.concat(activeFilter.value));
    });
    var fromURL = new Map();
    var urlParams = new URLSearchParams(history.location.search);
    filterTypes.forEach(function (filter) {
        var values = urlParams.getAll(filter.id);
        if (values.length > 0) {
            var existing = fromURL.get(filter.title) || [];
            fromURL.set(filter.title, existing.concat(values));
        }
    });
    if (fromFilters.size !== fromURL.size) {
        return false;
    }
    var equalFilters = true;
    fromFilters.forEach(function (filterValues, filterName) {
        var aux = fromURL.get(filterName) || [];
        equalFilters =
            equalFilters && filterValues.every(function (value) { return aux.includes(value); }) && filterValues.length === aux.length;
    });
    return equalFilters;
};
export var currentPagination = function () {
    var urlParams = new URLSearchParams(history.location.search);
    return {
        page: HistoryManager.getNumericParam(URLParam.PAGE, urlParams) || 1,
        perPage: HistoryManager.getNumericParam(URLParam.PER_PAGE, urlParams) || perPageOptions[1],
        perPageOptions: perPageOptions
    };
};
export var isCurrentSortAscending = function () {
    return (HistoryManager.getParam(URLParam.DIRECTION) || 'asc') === 'asc';
};
export var currentDuration = function () {
    return HistoryManager.getDuration() || defaultDuration;
};
export var currentPollInterval = function () {
    var pi = HistoryManager.getNumericParam(URLParam.POLL_INTERVAL);
    if (pi === undefined) {
        return defaultPollInterval;
    }
    return pi;
};
export var currentSortField = function (sortFields) {
    var queriedSortedField = HistoryManager.getParam(URLParam.SORT) || sortFields[0].param;
    return (sortFields.find(function (sortField) {
        return sortField.param === queriedSortedField;
    }) || sortFields[0]);
};
//# sourceMappingURL=ListPagesHelper.js.map