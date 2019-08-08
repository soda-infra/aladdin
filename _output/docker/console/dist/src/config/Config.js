import deepFreeze from 'deep-freeze';
import { UNIT_TIME, MILLISECONDS } from '../types/Common';
var conf = {
    version: '0.1',
    /** Configuration related with session */
    session: {
        /** TimeOut Session remain for warning user default 1 minute */
        timeOutforWarningUser: 1 * UNIT_TIME.MINUTE * MILLISECONDS
    },
    /** Toolbar Configuration */
    toolbar: {
        /** Duration default in 1 minute */
        defaultDuration: 1 * UNIT_TIME.MINUTE,
        /** By default refresh is 15 seconds */
        defaultPollInterval: 15 * MILLISECONDS,
        /** Options in refresh */
        pollInterval: {
            0: 'Pause',
            10000: 'Every 10s',
            15000: 'Every 15s',
            30000: 'Every 30s',
            60000: 'Every 1m',
            300000: 'Every 5m',
            900000: 'Every 15m'
        },
        /** Graphs layouts types */
        graphLayouts: {
            cola: 'Cola',
            'cose-bilkent': 'Cose',
            dagre: 'Dagre'
        }
    },
    /** About dialog configuration */
    about: {
        project: {
            url: 'https://github.com/kiali',
            icon: 'RepositoryIcon',
            linkText: 'Find us on GitHub'
        },
        website: {
            url: 'http://kiali.io',
            icon: 'HomeIcon',
            linkText: 'Visit our web page'
        }
    },
    /**  Login configuration */
    login: {
        headers: {
            'X-Auth-Type-Kiali-UI': '1'
        }
    },
    /** API configuration */
    api: {
        urls: {
            authenticate: 'api/authenticate',
            authInfo: 'api/auth/info',
            apps: function (namespace) { return "api/namespaces/" + namespace + "/apps"; },
            app: function (namespace, app) { return "api/namespaces/" + namespace + "/apps/" + app; },
            appGraphElements: function (namespace, app, version) {
                var baseUrl = "api/namespaces/" + namespace + "/applications/" + app;
                var hasVersion = version && version !== 'unknown';
                var versionSuffixed = hasVersion ? baseUrl + "/versions/" + version : baseUrl;
                return versionSuffixed + "/graph";
            },
            appHealth: function (namespace, app) { return "api/namespaces/" + namespace + "/apps/" + app + "/health"; },
            appMetrics: function (namespace, app) { return "api/namespaces/" + namespace + "/apps/" + app + "/metrics"; },
            appDashboard: function (namespace, app) { return "api/namespaces/" + namespace + "/apps/" + app + "/dashboard"; },
            customDashboard: function (namespace, template) {
                return "api/namespaces/" + namespace + "/customdashboard/" + template;
            },
            grafana: 'api/grafana',
            istioConfig: function (namespace) { return "api/namespaces/" + namespace + "/istio"; },
            istioConfigCreate: function (namespace, objectType) { return "api/namespaces/" + namespace + "/istio/" + objectType; },
            istioConfigCreateSubtype: function (namespace, objectType, objectSubtype) {
                return "api/namespaces/" + namespace + "/istio/" + objectType + "/" + objectSubtype;
            },
            istioConfigDetail: function (namespace, objectType, object) {
                return "api/namespaces/" + namespace + "/istio/" + objectType + "/" + object;
            },
            istioConfigDetailSubtype: function (namespace, objectType, objectSubtype, object) {
                return "api/namespaces/" + namespace + "/istio/" + objectType + "/" + objectSubtype + "/" + object;
            },
            jaeger: 'api/jaeger',
            logout: 'api/logout',
            namespaces: 'api/namespaces',
            namespacesGraphElements: "api/namespaces/graph",
            namespaceHealth: function (namespace) { return "api/namespaces/" + namespace + "/health"; },
            namespaceMetrics: function (namespace) { return "api/namespaces/" + namespace + "/metrics"; },
            namespaceTls: function (namespace) { return "api/namespaces/" + namespace + "/tls"; },
            meshTls: function () { return 'api/mesh/tls'; },
            pod: function (namespace, pod) { return "api/namespaces/" + namespace + "/pods/" + pod; },
            podLogs: function (namespace, pod) { return "api/namespaces/" + namespace + "/pods/" + pod + "/logs"; },
            serverConfig: "api/config",
            services: function (namespace) { return "api/namespaces/" + namespace + "/services"; },
            service: function (namespace, service) { return "api/namespaces/" + namespace + "/services/" + service; },
            serviceGraphElements: function (namespace, service) {
                return "api/namespaces/" + namespace + "/services/" + service + "/graph";
            },
            serviceHealth: function (namespace, service) { return "api/namespaces/" + namespace + "/services/" + service + "/health"; },
            serviceMetrics: function (namespace, service) { return "api/namespaces/" + namespace + "/services/" + service + "/metrics"; },
            serviceDashboard: function (namespace, service) {
                return "api/namespaces/" + namespace + "/services/" + service + "/dashboard";
            },
            status: 'api/status',
            threeScale: 'api/threescale',
            threeScaleHandler: function (handlerName) { return "api/threescale/handlers/" + handlerName; },
            threeScaleHandlers: 'api/threescale/handlers',
            threeScaleServiceRule: function (namespace, service) {
                return "api/threescale/namespaces/" + namespace + "/services/" + service;
            },
            threeScaleServiceRules: function (namespace) { return "api/threescale/namespaces/" + namespace + "/services"; },
            workloads: function (namespace) { return "api/namespaces/" + namespace + "/workloads"; },
            workload: function (namespace, workload) { return "api/namespaces/" + namespace + "/workloads/" + workload; },
            workloadGraphElements: function (namespace, workload) {
                return "api/namespaces/" + namespace + "/workloads/" + workload + "/graph";
            },
            workloadHealth: function (namespace, workload) {
                return "api/namespaces/" + namespace + "/workloads/" + workload + "/health";
            },
            workloadMetrics: function (namespace, workload) {
                return "api/namespaces/" + namespace + "/workloads/" + workload + "/metrics";
            },
            workloadDashboard: function (namespace, workload) {
                return "api/namespaces/" + namespace + "/workloads/" + workload + "/dashboard";
            }
        }
    }
};
export var config = deepFreeze(conf);
//# sourceMappingURL=Config.js.map