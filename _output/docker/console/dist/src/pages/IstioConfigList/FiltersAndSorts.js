import { FILTER_ACTION_APPEND, FILTER_ACTION_UPDATE } from '../../types/Filters';
export var getType = function (item) {
    return item.type === 'adapter'
        ? item.type + '_' + item.adapter.adapter
        : item.type === 'template'
            ? item.type + '_' + item.template.template
            : item.type;
};
export var sortFields = [
    {
        id: 'namespace',
        title: 'Namespace',
        isNumeric: false,
        param: 'ns',
        compare: function (a, b) {
            return a.namespace.localeCompare(b.namespace) || a.name.localeCompare(b.name);
        }
    },
    {
        id: 'istiotype',
        title: 'Istio Type',
        isNumeric: false,
        param: 'it',
        compare: function (a, b) {
            return getType(a).localeCompare(getType(b)) || a.name.localeCompare(b.name);
        }
    },
    {
        id: 'istioname',
        title: 'Istio Name',
        isNumeric: false,
        param: 'in',
        compare: function (a, b) {
            // On same name order is not well defined, we need some fallback methods
            // This happens specially on adapters/templates where Istio 1.0.x calls them "handler"
            // So, we have a lot of objects with same namespace+name
            return (a.name.localeCompare(b.name) || a.namespace.localeCompare(b.namespace) || getType(a).localeCompare(getType(b)));
        }
    },
    {
        id: 'configvalidation',
        title: 'Config',
        isNumeric: false,
        param: 'cv',
        compare: function (a, b) {
            var sortValue = -1;
            if (a.validation && !b.validation) {
                sortValue = -1;
            }
            else if (!a.validation && b.validation) {
                sortValue = 1;
            }
            else if (!a.validation && !b.validation) {
                sortValue = 0;
            }
            else if (a.validation && b.validation) {
                if (a.validation.valid && !b.validation.valid) {
                    sortValue = -1;
                }
                else if (!a.validation.valid && b.validation.valid) {
                    sortValue = 1;
                }
                else if (a.validation.valid && b.validation.valid) {
                    sortValue = a.validation.checks.length - b.validation.checks.length;
                }
                else if (!a.validation.valid && !b.validation.valid) {
                    sortValue = b.validation.checks.length - a.validation.checks.length;
                }
            }
            return sortValue || a.name.localeCompare(b.name);
        }
    }
];
export var istioNameFilter = {
    id: 'istioname',
    title: 'Istio Name',
    placeholder: 'Filter by Istio Name',
    filterType: 'text',
    action: FILTER_ACTION_UPDATE,
    filterValues: []
};
export var istioTypeFilter = {
    id: 'istiotype',
    title: 'Istio Type',
    placeholder: 'Filter by Istio Type',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: [
        {
            id: 'Gateway',
            title: 'Gateway'
        },
        {
            id: 'VirtualService',
            title: 'VirtualService'
        },
        {
            id: 'DestinationRule',
            title: 'DestinationRule'
        },
        {
            id: 'ServiceEntry',
            title: 'ServiceEntry'
        },
        {
            id: 'Rule',
            title: 'Rule'
        },
        {
            id: 'Adapter',
            title: 'Adapter'
        },
        {
            id: 'Template',
            title: 'Template'
        },
        {
            id: 'QuotaSpec',
            title: 'QuotaSpec'
        },
        {
            id: 'QuotaSpecBinding',
            title: 'QuotaSpecBinding'
        },
        {
            id: 'Policy',
            title: 'Policy'
        },
        {
            id: 'MeshPolicy',
            title: 'MeshPolicy'
        },
        {
            id: 'ClusterRbacConfig',
            title: 'ClusterRbacConfig'
        },
        {
            id: 'RbacConfig',
            title: 'RbacConfig'
        },
        {
            id: 'Sidecar',
            title: 'Sidecar'
        },
        {
            id: 'ServiceRole',
            title: 'ServiceRole'
        },
        {
            id: 'ServiceRoleBinding',
            title: 'ServiceRoleBinding'
        }
    ]
};
export var configValidationFilter = {
    id: 'configvalidation',
    title: 'Config',
    placeholder: 'Filter by Config Validation',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: [
        {
            id: 'valid',
            title: 'Valid'
        },
        {
            id: 'warning',
            title: 'Warning'
        },
        {
            id: 'notvalid',
            title: 'Not Valid'
        },
        {
            id: 'notvalidated',
            title: 'Not Validated'
        }
    ]
};
export var availableFilters = [istioTypeFilter, istioNameFilter, configValidationFilter];
export var sortIstioItems = function (unsorted, sortField, isAscending) {
    var sortPromise = new Promise(function (resolve) {
        resolve(unsorted.sort(isAscending ? sortField.compare : function (a, b) { return sortField.compare(b, a); }));
    });
    return sortPromise;
};
//# sourceMappingURL=FiltersAndSorts.js.map