export var dicIstioType = {
    Sidecar: 'sidecars',
    Gateway: 'gateways',
    VirtualService: 'virtualservices',
    DestinationRule: 'destinationrules',
    ServiceEntry: 'serviceentries',
    Rule: 'rules',
    Adapter: 'adapters',
    Template: 'templates',
    QuotaSpec: 'quotaspecs',
    QuotaSpecBinding: 'quotaspecbindings',
    Policy: 'policies',
    MeshPolicy: 'meshpolicies',
    ClusterRbacConfig: 'clusterrbacconfigs',
    RbacConfig: 'rbacconfigs',
    ServiceRole: 'serviceroles',
    ServiceRoleBinding: 'servicerolebindings',
    gateways: 'Gateway',
    virtualservices: 'VirtualService',
    destinationrules: 'DestinationRule',
    serviceentries: 'ServiceEntry',
    rules: 'Rule',
    adapters: 'Adapter',
    templates: 'Template',
    quotaspecs: 'QuotaSpec',
    quotaspecbindings: 'QuotaSpecBinding',
    instance: 'Instance',
    handler: 'Handler',
    policies: 'Policy',
    meshpolicies: 'MeshPolicy',
    clusterrbacconfigs: 'ClusterRbacConfig',
    rbacconfigs: 'RbacConfig',
    sidecars: 'Sidecar',
    serviceroles: 'ServiceRole',
    servicerolebindings: 'ServiceRoleBinding'
};
var includeName = function (name, names) {
    for (var i = 0; i < names.length; i++) {
        if (name.includes(names[i])) {
            return true;
        }
    }
    return false;
};
export var filterByName = function (unfiltered, names) {
    if (names && names.length === 0) {
        return unfiltered;
    }
    return {
        namespace: unfiltered.namespace,
        gateways: unfiltered.gateways.filter(function (gw) { return includeName(gw.metadata.name, names); }),
        virtualServices: {
            permissions: unfiltered.virtualServices.permissions,
            items: unfiltered.virtualServices.items.filter(function (vs) { return includeName(vs.metadata.name, names); })
        },
        destinationRules: {
            permissions: unfiltered.destinationRules.permissions,
            items: unfiltered.destinationRules.items.filter(function (dr) { return includeName(dr.metadata.name, names); })
        },
        serviceEntries: unfiltered.serviceEntries.filter(function (se) { return includeName(se.metadata.name, names); }),
        rules: unfiltered.rules.filter(function (r) { return includeName(r.metadata.name, names); }),
        adapters: unfiltered.adapters.filter(function (r) { return includeName(r.metadata.name, names); }),
        templates: unfiltered.templates.filter(function (r) { return includeName(r.metadata.name, names); }),
        quotaSpecs: unfiltered.quotaSpecs.filter(function (qs) { return includeName(qs.metadata.name, names); }),
        quotaSpecBindings: unfiltered.quotaSpecBindings.filter(function (qsb) { return includeName(qsb.metadata.name, names); }),
        policies: unfiltered.policies.filter(function (p) { return includeName(p.metadata.name, names); }),
        meshPolicies: unfiltered.meshPolicies.filter(function (p) { return includeName(p.metadata.name, names); }),
        clusterRbacConfigs: unfiltered.clusterRbacConfigs.filter(function (rc) { return includeName(rc.metadata.name, names); }),
        rbacConfigs: unfiltered.rbacConfigs.filter(function (rc) { return includeName(rc.metadata.name, names); }),
        sidecars: unfiltered.sidecars.filter(function (sc) { return includeName(sc.metadata.name, names); }),
        serviceRoles: unfiltered.serviceRoles.filter(function (sr) { return includeName(sr.metadata.name, names); }),
        serviceRoleBindings: unfiltered.serviceRoleBindings.filter(function (srb) { return includeName(srb.metadata.name, names); }),
        validations: unfiltered.validations,
        permissions: unfiltered.permissions
    };
};
export var filterByConfigValidation = function (unfiltered, configFilters) {
    if (configFilters && configFilters.length === 0) {
        return unfiltered;
    }
    var filtered = [];
    var filterByValid = configFilters.indexOf('Valid') > -1;
    var filterByNotValid = configFilters.indexOf('Not Valid') > -1;
    var filterByNotValidated = configFilters.indexOf('Not Validated') > -1;
    var filterByWarning = configFilters.indexOf('Warning') > -1;
    if (filterByValid && filterByNotValid && filterByNotValidated && filterByWarning) {
        return unfiltered;
    }
    unfiltered.forEach(function (item) {
        if (filterByValid && item.validation && item.validation.valid) {
            filtered.push(item);
        }
        if (filterByNotValid && item.validation && !item.validation.valid) {
            filtered.push(item);
        }
        if (filterByNotValidated && !item.validation) {
            filtered.push(item);
        }
        if (filterByWarning && item.validation && item.validation.checks.filter(function (i) { return i.severity === 'warning'; }).length > 0) {
            filtered.push(item);
        }
    });
    return filtered;
};
export var toIstioItems = function (istioConfigList) {
    var istioItems = [];
    var hasValidations = function (type, name) {
        return istioConfigList.validations[type] && istioConfigList.validations[type][name];
    };
    var nonItems = ['validations', 'permissions', 'namespace'];
    Object.keys(istioConfigList).forEach(function (field) {
        if (nonItems.indexOf(field) > -1) {
            // These items do not belong to the IstioConfigItem[]
            return;
        }
        var typeNameProto = dicIstioType[field.toLowerCase()]; // ex. serviceEntries -> ServiceEntry
        var typeName = typeNameProto.toLowerCase(); // ex. ServiceEntry -> serviceentry
        var entryName = typeNameProto.charAt(0).toLowerCase() + typeNameProto.slice(1);
        var itemField = istioConfigList[field];
        var entries = itemField;
        if (!(entries instanceof Array)) {
            // VirtualServices, DestinationRules
            entries = entries.items;
        }
        entries.forEach(function (entry) {
            var item = {
                namespace: istioConfigList.namespace.name,
                type: typeName,
                name: entry.metadata.name,
                validation: hasValidations(typeName, entry.metadata.name)
                    ? istioConfigList.validations[typeName][entry.metadata.name]
                    : undefined
            };
            item[entryName] = entry;
            istioItems.push(item);
        });
    });
    return istioItems;
};
//# sourceMappingURL=IstioConfigList.js.map