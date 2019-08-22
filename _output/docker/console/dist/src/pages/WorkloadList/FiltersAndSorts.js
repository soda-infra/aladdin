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
import { FILTER_ACTION_APPEND, FILTER_ACTION_UPDATE } from '../../types/Filters';
import { WorkloadType } from '../../types/Workload';
import { getRequestErrorsStatus } from '../../types/Health';
import { presenceValues, istioSidecarFilter, healthFilter, getFilterSelectedValues, getPresenceFilterValue, filterByHealth } from '../../components/Filters/CommonFilters';
export var sortFields = [
    {
        id: 'namespace',
        title: 'Namespace',
        isNumeric: false,
        param: 'ns',
        compare: function (a, b) {
            var sortValue = a.namespace.localeCompare(b.namespace);
            if (sortValue === 0) {
                sortValue = a.workload.name.localeCompare(b.workload.name);
            }
            return sortValue;
        }
    },
    {
        id: 'workloadname',
        title: 'Workload Name',
        isNumeric: false,
        param: 'wn',
        compare: function (a, b) { return a.workload.name.localeCompare(b.workload.name); }
    },
    {
        id: 'workloadtype',
        title: 'Workload Type',
        isNumeric: false,
        param: 'wt',
        compare: function (a, b) { return a.workload.type.localeCompare(b.workload.type); }
    },
    {
        id: 'istiosidecar',
        title: 'IstioSidecar',
        isNumeric: false,
        param: 'is',
        compare: function (a, b) {
            if (a.workload.istioSidecar && !b.workload.istioSidecar) {
                return -1;
            }
            else if (!a.workload.istioSidecar && b.workload.istioSidecar) {
                return 1;
            }
            else {
                return a.workload.name.localeCompare(b.workload.name);
            }
        }
    },
    {
        id: 'applabel',
        title: 'App Label',
        isNumeric: false,
        param: 'al',
        compare: function (a, b) {
            if (a.workload.appLabel && !b.workload.appLabel) {
                return -1;
            }
            else if (!a.workload.appLabel && b.workload.appLabel) {
                return 1;
            }
            else {
                return a.workload.name.localeCompare(b.workload.name);
            }
        }
    },
    {
        id: 'versionlabel',
        title: 'Version Label',
        isNumeric: false,
        param: 'vl',
        compare: function (a, b) {
            if (a.workload.versionLabel && !b.workload.versionLabel) {
                return -1;
            }
            else if (!a.workload.versionLabel && b.workload.versionLabel) {
                return 1;
            }
            else {
                return a.workload.name.localeCompare(b.workload.name);
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
                // If both workloads have same health status, use error rate to determine order.
                var ratioA = getRequestErrorsStatus(a.health.requests.errorRatio).value;
                var ratioB = getRequestErrorsStatus(b.health.requests.errorRatio).value;
                return ratioA === ratioB ? a.workload.name.localeCompare(b.workload.name) : ratioB - ratioA;
            }
            return statusForB.priority - statusForA.priority;
        }
    }
];
var workloadNameFilter = {
    id: 'workloadname',
    title: 'Workload Name',
    placeholder: 'Filter by Workload Name',
    filterType: 'text',
    action: FILTER_ACTION_APPEND,
    filterValues: []
};
var appLabelFilter = {
    id: 'applabel',
    title: 'App Label',
    placeholder: 'Filter by App Label Validation',
    filterType: 'select',
    action: FILTER_ACTION_UPDATE,
    filterValues: presenceValues
};
var versionLabelFilter = {
    id: 'versionlabel',
    title: 'Version Label',
    placeholder: 'Filter by Version Label Validation',
    filterType: 'select',
    action: FILTER_ACTION_UPDATE,
    filterValues: presenceValues
};
var workloadTypeFilter = {
    id: 'workloadtype',
    title: 'Workload Type',
    placeholder: 'Filter by Workload Type',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: [
        {
            id: WorkloadType.CronJob,
            title: WorkloadType.CronJob
        },
        {
            id: WorkloadType.DaemonSet,
            title: WorkloadType.DaemonSet
        },
        {
            id: WorkloadType.Deployment,
            title: WorkloadType.Deployment
        },
        {
            id: WorkloadType.DeploymentConfig,
            title: WorkloadType.DeploymentConfig
        },
        {
            id: WorkloadType.Job,
            title: WorkloadType.Job
        },
        {
            id: WorkloadType.Pod,
            title: WorkloadType.Pod
        },
        {
            id: WorkloadType.ReplicaSet,
            title: WorkloadType.ReplicaSet
        },
        {
            id: WorkloadType.ReplicationController,
            title: WorkloadType.ReplicationController
        },
        {
            id: WorkloadType.StatefulSet,
            title: WorkloadType.StatefulSet
        }
    ]
};
export var availableFilters = [
    workloadNameFilter,
    workloadTypeFilter,
    istioSidecarFilter,
    healthFilter,
    appLabelFilter,
    versionLabelFilter
];
/** Filter Method */
var includeName = function (name, names) {
    for (var i = 0; i < names.length; i++) {
        if (name.includes(names[i])) {
            return true;
        }
    }
    return false;
};
var filterByType = function (items, filter) {
    if (filter && filter.length === 0) {
        return items;
    }
    return items.filter(function (item) { return includeName(item.workload.type, filter); });
};
var filterByLabel = function (items, istioSidecar, app, version) {
    var result = items;
    if (istioSidecar !== undefined) {
        result = result.filter(function (item) { return item.workload.istioSidecar === istioSidecar; });
    }
    if (app !== undefined) {
        result = result.filter(function (item) { return item.workload.appLabel === app; });
    }
    if (version !== undefined) {
        result = result.filter(function (item) { return item.workload.versionLabel === version; });
    }
    return result;
};
var filterByName = function (items, names) {
    if (names.length === 0) {
        return items;
    }
    return items.filter(function (item) { return names.some(function (name) { return item.workload.name.includes(name); }); });
};
export var filterBy = function (items, filters) {
    var workloadTypeFilters = getFilterSelectedValues(workloadTypeFilter, filters);
    var workloadNamesSelected = getFilterSelectedValues(workloadNameFilter, filters);
    var istioSidecar = getPresenceFilterValue(istioSidecarFilter, filters);
    var appLabel = getPresenceFilterValue(appLabelFilter, filters);
    var versionLabel = getPresenceFilterValue(versionLabelFilter, filters);
    var ret = items;
    ret = filterByType(ret, workloadTypeFilters);
    ret = filterByName(ret, workloadNamesSelected);
    ret = filterByLabel(ret, istioSidecar, appLabel, versionLabel);
    // We may have to perform a second round of filtering, using data fetched asynchronously (health)
    // If not, exit fast
    var healthSelected = getFilterSelectedValues(healthFilter, filters);
    if (healthSelected.length > 0) {
        return filterByHealth(ret, healthSelected);
    }
    return ret;
};
/** Sort Method */
export var sortWorkloadsItems = function (unsorted, sortField, isAscending) {
    if (sortField.title === 'Health') {
        // In the case of health sorting, we may not have all health promises ready yet
        // So we need to get them all before actually sorting
        var allHealthPromises = unsorted.map(function (item) {
            return item.healthPromise.then(function (health) { return (__assign({}, item, { health: health })); });
        });
        return Promise.all(allHealthPromises).then(function (arr) {
            return arr.sort(isAscending ? sortField.compare : function (a, b) { return sortField.compare(b, a); });
        });
    }
    var sorted = unsorted.sort(isAscending ? sortField.compare : function (a, b) { return sortField.compare(b, a); });
    return Promise.resolve(sorted);
};
//# sourceMappingURL=FiltersAndSorts.js.map