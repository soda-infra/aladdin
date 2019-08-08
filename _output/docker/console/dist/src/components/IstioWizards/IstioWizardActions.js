var _a, _b;
import { serverConfig } from '../../config';
import { ConsistentHashType } from './TrafficPolicy';
export var WIZARD_WEIGHTED_ROUTING = 'weighted_routing';
export var WIZARD_MATCHING_ROUTING = 'matching_routing';
export var WIZARD_SUSPEND_TRAFFIC = 'suspend_traffic';
export var WIZARD_THREESCALE_INTEGRATION = 'threescale';
export var WIZARD_ACTIONS = [WIZARD_WEIGHTED_ROUTING, WIZARD_MATCHING_ROUTING, WIZARD_SUSPEND_TRAFFIC];
export var WIZARD_TITLES = (_a = {},
    _a[WIZARD_WEIGHTED_ROUTING] = 'Create Weighted Routing',
    _a[WIZARD_MATCHING_ROUTING] = 'Create Matching Routing',
    _a[WIZARD_SUSPEND_TRAFFIC] = 'Suspend Traffic',
    _a[WIZARD_THREESCALE_INTEGRATION] = 'Add 3scale API Management Rule',
    _a);
export var WIZARD_UPDATE_TITLES = (_b = {},
    _b[WIZARD_WEIGHTED_ROUTING] = 'Update Weighted Routing',
    _b[WIZARD_MATCHING_ROUTING] = 'Update Matching Routing',
    _b[WIZARD_SUSPEND_TRAFFIC] = 'Update Suspended Traffic',
    _b[WIZARD_THREESCALE_INTEGRATION] = 'Update 3scale API Management Rule',
    _b);
var SERVICE_UNAVAILABLE = 503;
export var KIALI_WIZARD_LABEL = 'kiali_wizard';
var buildHTTPMatchRequest = function (matches) {
    var matchRequests = [];
    var matchHeaders = { headers: {} };
    // Headers are grouped
    matches
        .filter(function (match) { return match.startsWith('headers'); })
        .forEach(function (match) {
        var _a;
        // match follows format:  headers [<header-name>] <op> <value>
        var i0 = match.indexOf('[');
        var j0 = match.indexOf(']');
        var headerName = match.substring(i0 + 1, j0).trim();
        var i1 = match.indexOf(' ', j0 + 1);
        var j1 = match.indexOf(' ', i1 + 1);
        var op = match.substring(i1 + 1, j1).trim();
        var value = match.substring(j1 + 1).trim();
        matchHeaders.headers[headerName] = (_a = {}, _a[op] = value, _a);
    });
    if (Object.keys(matchHeaders.headers || {}).length > 0) {
        matchRequests.push(matchHeaders);
    }
    // Rest of matches
    matches
        .filter(function (match) { return !match.startsWith('headers'); })
        .forEach(function (match) {
        var _a, _b;
        // match follows format: <name> <op> <value>
        var i = match.indexOf(' ');
        var j = match.indexOf(' ', i + 1);
        var name = match.substring(0, i).trim();
        var op = match.substring(i + 1, j).trim();
        var value = match.substring(j + 1).trim();
        matchRequests.push((_a = {},
            _a[name] = (_b = {},
                _b[op] = value,
                _b),
            _a));
    });
    return matchRequests;
};
var parseStringMatch = function (value) {
    if (value.exact) {
        return 'exact ' + value.exact;
    }
    if (value.prefix) {
        return 'prefix ' + value.prefix;
    }
    if (value.regex) {
        return 'regex ' + value.regex;
    }
    return '';
};
var parseHttpMatchRequest = function (httpMatchRequest) {
    var matches = [];
    // Headers
    if (httpMatchRequest.headers) {
        Object.keys(httpMatchRequest.headers).forEach(function (headerName) {
            var value = httpMatchRequest.headers[headerName];
            matches.push('headers [' + headerName + '] ' + parseStringMatch(value));
        });
    }
    if (httpMatchRequest.uri) {
        matches.push('uri ' + parseStringMatch(httpMatchRequest.uri));
    }
    if (httpMatchRequest.scheme) {
        matches.push('scheme ' + parseStringMatch(httpMatchRequest.scheme));
    }
    if (httpMatchRequest.method) {
        matches.push('method ' + parseStringMatch(httpMatchRequest.method));
    }
    if (httpMatchRequest.authority) {
        matches.push('authority ' + parseStringMatch(httpMatchRequest.authority));
    }
    return matches;
};
export var getGatewayName = function (namespace, serviceName, gatewayNames) {
    var gatewayName = namespace + '/' + serviceName + '-gateway';
    if (gatewayNames.length === 0) {
        return gatewayName;
    }
    var goodName = false;
    while (!goodName) {
        if (!gatewayNames.includes(gatewayName)) {
            goodName = true;
        }
        else {
            // Iterate until we find a good gatewayName
            if (gatewayName.charAt(gatewayName.length - 2) === '-') {
                var version = +gatewayName.charAt(gatewayName.length - 1);
                version = version + 1;
                gatewayName = gatewayName.substr(0, gatewayName.length - 1) + version;
            }
            else {
                gatewayName = gatewayName + '-1';
            }
        }
    }
    return gatewayName;
};
export var buildIstioConfig = function (wProps, wState) {
    var _a, _b, _c;
    var wkdNameVersion = {};
    // DestinationRule from the labels
    var wizardDR = {
        metadata: {
            namespace: wProps.namespace,
            name: wProps.serviceName,
            labels: (_a = {},
                _a[KIALI_WIZARD_LABEL] = wProps.type,
                _a)
        },
        spec: {
            host: wProps.serviceName,
            subsets: wProps.workloads.map(function (workload) {
                // Using version
                var versionLabelName = serverConfig.istioLabels.versionLabelName;
                var versionValue = workload.labels[versionLabelName];
                var labels = {};
                labels[versionLabelName] = versionValue;
                // Populate helper table workloadName -> version
                wkdNameVersion[workload.name] = versionValue;
                return {
                    name: versionValue,
                    labels: labels
                };
            })
        }
    };
    var wizardVS = {
        metadata: {
            namespace: wProps.namespace,
            name: wProps.serviceName,
            labels: (_b = {},
                _b[KIALI_WIZARD_LABEL] = wProps.type,
                _b)
        },
        spec: {}
    };
    // Wizard is optional, only when user has explicitly selected "Create a Gateway"
    var fullNewGatewayName = getGatewayName(wProps.namespace, wProps.serviceName, wProps.gateways);
    var wizardGW = wState.gateway && wState.gateway.addGateway && wState.gateway.newGateway
        ? {
            metadata: {
                namespace: wProps.namespace,
                name: fullNewGatewayName.substr(wProps.namespace.length + 1),
                labels: (_c = {},
                    _c[KIALI_WIZARD_LABEL] = wProps.type,
                    _c)
            },
            spec: {
                selector: {
                    istio: 'ingressgateway'
                },
                servers: [
                    {
                        port: {
                            number: wState.gateway.port,
                            name: 'http',
                            protocol: 'HTTP'
                        },
                        hosts: wState.gateway.gwHosts.split(',')
                    }
                ]
            }
        }
        : undefined;
    switch (wProps.type) {
        case WIZARD_WEIGHTED_ROUTING: {
            // VirtualService from the weights
            wizardVS.spec = {
                http: [
                    {
                        route: wState.workloads.map(function (workload) {
                            return {
                                destination: {
                                    host: wProps.serviceName,
                                    subset: wkdNameVersion[workload.name]
                                },
                                weight: workload.weight
                            };
                        })
                    }
                ]
            };
            break;
        }
        case WIZARD_MATCHING_ROUTING: {
            // VirtualService from the routes
            wizardVS.spec = {
                http: wState.rules.map(function (rule) {
                    var httpRoute = {};
                    httpRoute.route = [];
                    for (var iRoute = 0; iRoute < rule.routes.length; iRoute++) {
                        var destW = {
                            destination: {
                                host: wProps.serviceName,
                                subset: wkdNameVersion[rule.routes[iRoute]]
                            }
                        };
                        destW.weight = Math.floor(100 / rule.routes.length);
                        if (iRoute === 0) {
                            destW.weight = destW.weight + (100 % rule.routes.length);
                        }
                        httpRoute.route.push(destW);
                    }
                    if (rule.matches.length > 0) {
                        httpRoute.match = buildHTTPMatchRequest(rule.matches);
                    }
                    return httpRoute;
                })
            };
            break;
        }
        case WIZARD_SUSPEND_TRAFFIC: {
            // VirtualService from the suspendedRoutes
            var httpRoute = {
                route: []
            };
            // Let's use the # os suspended notes to create weights
            var totalRoutes = wState.suspendedRoutes.length;
            var closeRoutes = wState.suspendedRoutes.filter(function (s) { return s.suspended; }).length;
            var openRoutes = totalRoutes - closeRoutes;
            var firstValue = true;
            // If we have some suspended routes, we need to use weights
            if (closeRoutes < totalRoutes) {
                for (var i = 0; i < wState.suspendedRoutes.length; i++) {
                    var suspendedRoute = wState.suspendedRoutes[i];
                    var destW = {
                        destination: {
                            host: wProps.serviceName,
                            subset: wkdNameVersion[suspendedRoute.workload]
                        }
                    };
                    if (suspendedRoute.suspended) {
                        // A suspended route has a 0 weight
                        destW.weight = 0;
                    }
                    else {
                        destW.weight = Math.floor(100 / openRoutes);
                        // We need to adjust the rest
                        if (firstValue) {
                            destW.weight += 100 % openRoutes;
                            firstValue = false;
                        }
                    }
                    httpRoute.route.push(destW);
                }
            }
            else {
                // All routes are suspended, so we use an fault/abort rule
                httpRoute.route = [
                    {
                        destination: {
                            host: wProps.serviceName
                        }
                    }
                ];
                httpRoute.fault = {
                    abort: {
                        httpStatus: SERVICE_UNAVAILABLE,
                        percentage: {
                            value: 100
                        }
                    }
                };
            }
            wizardVS.spec = {
                http: [httpRoute]
            };
            break;
        }
        default:
            console.log('Unrecognized type');
    }
    wizardVS.spec.hosts =
        wState.vsHosts.length > 1 || (wState.vsHosts.length === 1 && wState.vsHosts[0].length > 0)
            ? wState.vsHosts
            : [wProps.serviceName];
    if (wState.trafficPolicy.tlsModified || wState.trafficPolicy.addLoadBalancer) {
        wizardDR.spec.trafficPolicy = {
            tls: null,
            loadBalancer: null
        };
        if (wState.trafficPolicy.tlsModified) {
            wizardDR.spec.trafficPolicy.tls = {
                mode: wState.trafficPolicy.mtlsMode
            };
        }
        if (wState.trafficPolicy.addLoadBalancer) {
            if (wState.trafficPolicy.simpleLB) {
                // Remember to put a null fields that need to be deleted on a JSON merge patch
                wizardDR.spec.trafficPolicy.loadBalancer = {
                    simple: wState.trafficPolicy.loadBalancer.simple,
                    consistentHash: null
                };
            }
            else {
                wizardDR.spec.trafficPolicy.loadBalancer = {
                    simple: null,
                    consistentHash: {}
                };
                wizardDR.spec.trafficPolicy.loadBalancer.consistentHash = {
                    httpHeaderName: null,
                    httpCookie: null,
                    useSourceIp: null
                };
                if (wState.trafficPolicy.loadBalancer.consistentHash) {
                    var consistentHash = wState.trafficPolicy.loadBalancer.consistentHash;
                    switch (wState.trafficPolicy.consistentHashType) {
                        case ConsistentHashType.HTTP_HEADER_NAME:
                            wizardDR.spec.trafficPolicy.loadBalancer.consistentHash.httpHeaderName = consistentHash.httpHeaderName;
                            break;
                        case ConsistentHashType.HTTP_COOKIE:
                            wizardDR.spec.trafficPolicy.loadBalancer.consistentHash.httpCookie = consistentHash.httpCookie;
                            break;
                        case ConsistentHashType.USE_SOURCE_IP:
                            wizardDR.spec.trafficPolicy.loadBalancer.consistentHash.useSourceIp = true;
                            break;
                        default:
                        /// No default action
                    }
                }
            }
        }
    }
    else {
        wizardDR.spec.trafficPolicy = null;
    }
    if (wState.gateway && wState.gateway.addGateway) {
        wizardVS.spec.gateways = [wState.gateway.newGateway ? fullNewGatewayName : wState.gateway.selectedGateway];
        if (wState.gateway.addMesh) {
            wizardVS.spec.gateways.push('mesh');
        }
    }
    else {
        wizardVS.spec.gateways = null;
    }
    return [wizardDR, wizardVS, wizardGW];
};
var getWorkloadsByVersion = function (workloads) {
    var versionLabelName = serverConfig.istioLabels.versionLabelName;
    var wkdVersionName = {};
    workloads.forEach(function (workload) { return (wkdVersionName[workload.labels[versionLabelName]] = workload.name); });
    return wkdVersionName;
};
export var getInitWeights = function (workloads, virtualServices) {
    var wkdVersionName = getWorkloadsByVersion(workloads);
    var wkdWeights = [];
    if (virtualServices.items.length === 1 && virtualServices.items[0].spec.http.length === 1) {
        // Populate WorkloadWeights from a VirtualService
        virtualServices.items[0].spec.http[0].route.forEach(function (route) {
            if (route.destination.subset) {
                wkdWeights.push({
                    name: wkdVersionName[route.destination.subset],
                    weight: route.weight || 0,
                    locked: false,
                    maxWeight: 100
                });
            }
        });
    }
    return wkdWeights;
};
export var getInitRules = function (workloads, virtualServices) {
    var wkdVersionName = getWorkloadsByVersion(workloads);
    var rules = [];
    if (virtualServices.items.length === 1) {
        virtualServices.items[0].spec.http.forEach(function (httpRoute) {
            var rule = {
                matches: [],
                routes: []
            };
            if (httpRoute.match) {
                httpRoute.match.forEach(function (m) { return (rule.matches = rule.matches.concat(parseHttpMatchRequest(m))); });
            }
            if (httpRoute.route) {
                httpRoute.route.forEach(function (r) { return rule.routes.push(wkdVersionName[r.destination.subset || '']); });
            }
            rules.push(rule);
        });
    }
    return rules;
};
export var getInitSuspendedRoutes = function (workloads, virtualServices) {
    var wkdVersionName = getWorkloadsByVersion(workloads);
    var routes = workloads.map(function (wk) { return ({
        workload: wk.name,
        suspended: true,
        httpStatus: SERVICE_UNAVAILABLE
    }); });
    if (virtualServices.items.length === 1 && virtualServices.items[0].spec.http.length === 1) {
        // All routes are suspended default value is correct
        if (virtualServices.items[0].spec.http[0].fault) {
            return routes;
        }
        // Iterate on route weights to identify the suspended routes
        virtualServices.items[0].spec.http[0].route.forEach(function (route) {
            if (route.weight && route.weight > 0) {
                var workloadName_1 = wkdVersionName[route.destination.subset || ''];
                routes.filter(function (w) { return w.workload === workloadName_1; }).forEach(function (w) { return (w.suspended = false); });
            }
        });
    }
    return routes;
};
export var getInitTlsMode = function (destinationRules) {
    if (destinationRules.items.length === 1 &&
        destinationRules.items[0].spec.trafficPolicy &&
        destinationRules.items[0].spec.trafficPolicy.tls) {
        return destinationRules.items[0].spec.trafficPolicy.tls.mode || '';
    }
    return '';
};
export var getInitLoadBalancer = function (destinationRules) {
    if (destinationRules.items.length === 1 &&
        destinationRules.items[0].spec.trafficPolicy &&
        destinationRules.items[0].spec.trafficPolicy.loadBalancer) {
        return destinationRules.items[0].spec.trafficPolicy.loadBalancer;
    }
    return undefined;
};
export var hasGateway = function (virtualServices) {
    // We need to if sentence, otherwise a potential undefined is not well handled
    if (virtualServices.items.length === 1 &&
        virtualServices.items[0] &&
        virtualServices.items[0].spec.gateways &&
        virtualServices.items[0].spec.gateways.length > 0) {
        return true;
    }
    return false;
};
export var getInitHosts = function (virtualServices) {
    if (virtualServices.items.length === 1 && virtualServices.items[0] && virtualServices.items[0].spec.hosts) {
        return virtualServices.items[0].spec.hosts;
    }
    return [];
};
// VirtualServices added from the Kiali Wizard only support to add a single gateway
// and optionally a mesh gateway.
// This method returns a gateway selected by the user and if mesh is present
export var getInitGateway = function (virtualServices) {
    if (virtualServices.items.length === 1 &&
        virtualServices.items[0] &&
        virtualServices.items[0].spec.gateways &&
        virtualServices.items[0].spec.gateways.length > 0) {
        var selectedGateway = virtualServices.items[0].spec.gateways[0];
        if (selectedGateway === 'mesh') {
            // In Kiali Wizard, the first gateway is reserved for user gateway
            selectedGateway = '';
        }
        var meshPresent = false;
        if (virtualServices.items[0].spec.gateways.includes('mesh')) {
            meshPresent = true;
        }
        return [selectedGateway, meshPresent];
    }
    return ['', false];
};
//# sourceMappingURL=IstioWizardActions.js.map