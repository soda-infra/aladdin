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
import { FILTER_ACTION_APPEND } from '../../types/Filters';
import { getRequestErrorsStatus } from '../../types/Health';
import { istioSidecarFilter, healthFilter, getPresenceFilterValue, getFilterSelectedValues, filterByHealth } from '../../components/Filters/CommonFilters';
export var sortFields = [
    {
        id: 'namespace',
        title: 'Namespace',
        isNumeric: false,
        param: 'ns',
        compare: function (a, b) {
            var sortValue = a.namespace.localeCompare(b.namespace);
            if (sortValue === 0) {
                sortValue = a.name.localeCompare(b.name);
            }
            return sortValue;
        }
    },
    {
        id: 'servicename',
        title: 'Service Name',
        isNumeric: false,
        param: 'sn',
        compare: function (a, b) { return a.name.localeCompare(b.name); }
    },
    {
        id: 'istiosidecar',
        title: 'Istio Sidecar',
        isNumeric: false,
        param: 'is',
        compare: function (a, b) {
            if (a.istioSidecar && !b.istioSidecar) {
                return -1;
            }
            else if (!a.istioSidecar && b.istioSidecar) {
                return 1;
            }
            else {
                return a.name.localeCompare(b.name);
            }
        }
    },
    {
        id: 'health',
        title: 'Health',
        isNumeric: false,
        param: 'he',
        compare: function (a, b) {
            var statusForA = a.health.getGlobalStatus();
            var statusForB = b.health.getGlobalStatus();
            if (statusForA.priority === statusForB.priority) {
                // If both services have same health status, use error rate to determine order.
                var ratioA = getRequestErrorsStatus(a.health.requests.errorRatio).value;
                var ratioB = getRequestErrorsStatus(b.health.requests.errorRatio).value;
                return ratioA === ratioB ? a.name.localeCompare(b.name) : ratioB - ratioA;
            }
            return statusForB.priority - statusForA.priority;
        }
    }
];
var serviceNameFilter = {
    id: 'servicename',
    title: 'Service Name',
    placeholder: 'Filter by Service Name',
    filterType: 'text',
    action: FILTER_ACTION_APPEND,
    filterValues: []
};
export var availableFilters = [serviceNameFilter, istioSidecarFilter, healthFilter];
var filterByIstioSidecar = function (items, istioSidecar) {
    return items.filter(function (item) { return item.istioSidecar === istioSidecar; });
};
var filterByName = function (items, names) {
    return items.filter(function (item) {
        var serviceNameFiltered = true;
        if (names.length > 0) {
            serviceNameFiltered = false;
            for (var i = 0; i < names.length; i++) {
                if (item.name.includes(names[i])) {
                    serviceNameFiltered = true;
                    break;
                }
            }
        }
        return serviceNameFiltered;
    });
};
export var filterBy = function (items, filters) {
    var ret = items;
    var istioSidecar = getPresenceFilterValue(istioSidecarFilter, filters);
    if (istioSidecar !== undefined) {
        ret = filterByIstioSidecar(ret, istioSidecar);
    }
    var serviceNamesSelected = getFilterSelectedValues(serviceNameFilter, filters);
    if (serviceNamesSelected.length > 0) {
        ret = filterByName(ret, serviceNamesSelected);
    }
    // We may have to perform a second round of filtering, using data fetched asynchronously (health)
    // If not, exit fast
    var healthSelected = getFilterSelectedValues(healthFilter, filters);
    if (healthSelected.length > 0) {
        return filterByHealth(ret, healthSelected);
    }
    return ret;
};
// Exported for test
export var sortServices = function (services, sortField, isAscending) {
    if (sortField.title === 'Health') {
        // In the case of health sorting, we may not have all health promises ready yet
        // So we need to get them all before actually sorting
        var allHealthPromises = services.map(function (item) {
            return item.healthPromise.then(function (health) { return (__assign({}, item, { health: health })); });
        });
        return Promise.all(allHealthPromises).then(function (arr) {
            return arr.sort(isAscending ? sortField.compare : function (a, b) { return sortField.compare(b, a); });
        });
    }
    // Default case: sorting is done synchronously
    var sorted = services.sort(isAscending ? sortField.compare : function (a, b) { return sortField.compare(b, a); });
    return Promise.resolve(sorted);
};
//# sourceMappingURL=FiltersAndSorts.js.map