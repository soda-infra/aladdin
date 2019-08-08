import { FILTER_ACTION_APPEND, FILTER_ACTION_UPDATE } from '../../types/Filters';
import { HEALTHY, DEGRADED, FAILURE, NA } from '../../types/Health';
import { removeDuplicatesArray } from '../../utils/Common';
export var presenceValues = [
    {
        id: 'present',
        title: 'Present'
    },
    {
        id: 'notpresent',
        title: 'Not Present'
    }
];
export var istioSidecarFilter = {
    id: 'istiosidecar',
    title: 'Istio Sidecar',
    placeholder: 'Filter by IstioSidecar Validation',
    filterType: 'select',
    action: FILTER_ACTION_UPDATE,
    filterValues: presenceValues
};
export var healthFilter = {
    id: 'health',
    title: 'Health',
    placeholder: 'Filter by Health',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: [
        {
            id: HEALTHY.name,
            title: HEALTHY.name
        },
        {
            id: DEGRADED.name,
            title: DEGRADED.name
        },
        {
            id: FAILURE.name,
            title: FAILURE.name
        },
        {
            id: 'na',
            title: NA.name
        }
    ]
};
export var getFilterSelectedValues = function (filter, activeFilters) {
    var selected = activeFilters
        .filter(function (activeFilter) { return activeFilter.category === filter.title; })
        .map(function (activeFilter) { return activeFilter.value; });
    return removeDuplicatesArray(selected);
};
export var getPresenceFilterValue = function (filter, activeFilters) {
    var presenceFilters = activeFilters.filter(function (activeFilter) { return activeFilter.category === filter.title; });
    if (presenceFilters.length > 0) {
        return presenceFilters[0].value === 'Present';
    }
    return undefined;
};
export var filterByHealth = function (items, filterValues) {
    var itemsWithHealthPromises = items.map(function (item) { return item.healthPromise.then(function (h) { return ({ health: h, item: item }); }); });
    return Promise.all(itemsWithHealthPromises).then(function (itemsWithHealth) {
        return itemsWithHealth
            .filter(function (itemWithHealth) { return filterValues.includes(itemWithHealth.health.getGlobalStatus().name); })
            .map(function (itemWithHealth) { return itemWithHealth.item; });
    });
};
//# sourceMappingURL=CommonFilters.js.map