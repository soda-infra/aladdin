import _ from 'lodash';
export var mergeJsonPatch = function (objectModified, object) {
    if (!object) {
        return objectModified;
    }
    var customizer = function (objValue, srcValue) {
        if (!objValue) {
            return null;
        }
        if (_.isObject(objValue) && _.isObject(srcValue)) {
            _.mergeWith(objValue, srcValue, customizer);
        }
        return objValue;
    };
    _.mergeWith(objectModified, object, customizer);
    return objectModified;
};
export var getIstioObject = function (istioObjectDetails) {
    var istioObject;
    if (istioObjectDetails) {
        if (istioObjectDetails.gateway) {
            istioObject = istioObjectDetails.gateway;
        }
        else if (istioObjectDetails.virtualService) {
            istioObject = istioObjectDetails.virtualService;
        }
        else if (istioObjectDetails.destinationRule) {
            istioObject = istioObjectDetails.destinationRule;
        }
        else if (istioObjectDetails.serviceEntry) {
            istioObject = istioObjectDetails.serviceEntry;
        }
        else if (istioObjectDetails.rule) {
            istioObject = istioObjectDetails.rule;
        }
        else if (istioObjectDetails.adapter) {
            istioObject = istioObjectDetails.adapter;
        }
        else if (istioObjectDetails.template) {
            istioObject = istioObjectDetails.template;
        }
        else if (istioObjectDetails.quotaSpec) {
            istioObject = istioObjectDetails.quotaSpec;
        }
        else if (istioObjectDetails.quotaSpecBinding) {
            istioObject = istioObjectDetails.quotaSpecBinding;
        }
        else if (istioObjectDetails.policy) {
            istioObject = istioObjectDetails.policy;
        }
        else if (istioObjectDetails.meshPolicy) {
            istioObject = istioObjectDetails.meshPolicy;
        }
        else if (istioObjectDetails.clusterRbacConfig) {
            istioObject = istioObjectDetails.clusterRbacConfig;
        }
        else if (istioObjectDetails.rbacConfig) {
            istioObject = istioObjectDetails.rbacConfig;
        }
        else if (istioObjectDetails.serviceRole) {
            istioObject = istioObjectDetails.serviceRole;
        }
        else if (istioObjectDetails.serviceRoleBinding) {
            istioObject = istioObjectDetails.serviceRoleBinding;
        }
        else if (istioObjectDetails.sidecar) {
            istioObject = istioObjectDetails.sidecar;
        }
    }
    return istioObject;
};
//# sourceMappingURL=IstioConfigUtils.js.map