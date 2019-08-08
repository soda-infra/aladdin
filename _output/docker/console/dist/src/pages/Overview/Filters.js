import { FILTER_ACTION_APPEND } from '../../types/Filters';
import { DEGRADED, FAILURE, HEALTHY } from '../../types/Health';
import { MTLSStatuses } from '../../types/TLSStatus';
export var nameFilter = {
    id: 'namespace_search',
    title: 'Name',
    placeholder: 'Filter by Name',
    filterType: 'text',
    action: FILTER_ACTION_APPEND,
    filterValues: [],
    filter: function (namespaces, filters) {
        return namespaces.filter(function (ns) { return filters.some(function (f) { return ns.name.includes(f.value); }); });
    }
};
export var mtlsValues = [
    { id: 'enabled', title: 'Enabled' },
    { id: 'partiallyEnabled', title: 'Partially Enabled' },
    { id: 'disabled', title: 'Disabled' }
];
var statusMap = new Map([
    [MTLSStatuses.ENABLED, 'Enabled'],
    [MTLSStatuses.PARTIALLY, 'Partially Enabled'],
    [MTLSStatuses.NOT_ENABLED, 'Disabled'],
    [MTLSStatuses.DISABLED, 'Disabled']
]);
export var mtlsFilter = {
    id: 'mtls',
    title: 'mTLS status',
    placeholder: 'Filter by mTLS status',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: mtlsValues,
    filter: function (namespaces, filters) {
        return namespaces.filter(function (ns) { return ns.tlsStatus && filters.some(function (f) { return statusMap.get(ns.tlsStatus.status) === f.value; }); });
    }
};
var healthValues = [
    { id: FAILURE.name, title: FAILURE.name },
    { id: DEGRADED.name, title: DEGRADED.name },
    { id: HEALTHY.name, title: HEALTHY.name }
];
var summarizeHealthFilters = function (healthFilters) {
    if (healthFilters.length === 0) {
        return {
            noFilter: true,
            showInError: true,
            showInWarning: true,
            showInSuccess: true
        };
    }
    var showInError = false, showInWarning = false, showInSuccess = false;
    healthFilters.forEach(function (f) {
        switch (f.value) {
            case FAILURE.name:
                showInError = true;
                break;
            case DEGRADED.name:
                showInWarning = true;
                break;
            case HEALTHY.name:
                showInSuccess = true;
                break;
            default:
        }
    });
    return {
        noFilter: false,
        showInError: showInError,
        showInWarning: showInWarning,
        showInSuccess: showInSuccess
    };
};
export var healthFilter = {
    id: 'health',
    title: 'Health',
    placeholder: 'Filter by Application Health',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: healthValues,
    filter: function (namespaces, filters) {
        var _a = summarizeHealthFilters(filters), showInError = _a.showInError, showInWarning = _a.showInWarning, showInSuccess = _a.showInSuccess, noFilter = _a.noFilter;
        return namespaces.filter(function (ns) {
            return (noFilter ||
                (ns.status &&
                    ((showInError && ns.status.inError.length > 0) ||
                        (showInWarning && ns.status.inWarning.length > 0) ||
                        (showInSuccess && ns.status.inSuccess.length > 0))));
        });
    }
};
export var availableFilters = [nameFilter, healthFilter, mtlsFilter];
export var filterBy = function (namespaces, filters) {
    var filteredNamespaces = namespaces;
    availableFilters.forEach(function (availableFilter) {
        var activeFilters = filters.filter(function (af) { return af.category === availableFilter.title; });
        if (activeFilters.length) {
            filteredNamespaces = availableFilter.filter(filteredNamespaces, activeFilters);
        }
    });
    return filteredNamespaces;
};
//# sourceMappingURL=Filters.js.map