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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import axios from 'axios';
import { AppHealth, ServiceHealth, WorkloadHealth } from '../types/Health';
import { HTTP_VERBS } from '../types/Common';
import { NodeType } from '../types/Graph';
import { config } from '../config';
export var ANONYMOUS_USER = 'anonymous';
/** API URLs */
var urls = config.api.urls;
/**  Headers Definitions */
var loginHeaders = config.login.headers;
/**  Helpers to Requests */
var getHeaders = function () {
    return __assign({}, loginHeaders);
};
var basicAuth = function (username, password) {
    return { username: username, password: password };
};
var newRequest = function (method, url, queryParams, data) {
    return axios.request({
        method: method,
        url: url,
        data: data,
        headers: getHeaders(),
        params: queryParams
    });
};
/** Requests */
export var extendSession = function () {
    return newRequest(HTTP_VERBS.GET, urls.authenticate, {}, {});
};
export var login = function (request) {
    if (request === void 0) { request = { username: ANONYMOUS_USER, password: 'anonymous' }; }
    return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, axios({
                    method: HTTP_VERBS.GET,
                    url: urls.authenticate,
                    headers: getHeaders(),
                    auth: basicAuth(request.username, request.password)
                })];
        });
    });
};
export var logout = function () {
    return newRequest(HTTP_VERBS.GET, urls.logout, {}, {});
};
export var getAuthInfo = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, newRequest(HTTP_VERBS.GET, urls.authInfo, {}, {})];
    });
}); };
export var checkOpenshiftAuth = function (data) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, newRequest(HTTP_VERBS.POST, urls.authenticate, {}, data)];
    });
}); };
export var getStatus = function () {
    return newRequest(HTTP_VERBS.GET, urls.status, {}, {});
};
export var getNamespaces = function () {
    return newRequest(HTTP_VERBS.GET, urls.namespaces, {}, {});
};
// jungeun: 이 api 사용
export var getNamespaceMetrics = function (namespace, params) {
    return newRequest(HTTP_VERBS.GET, urls.namespaceMetrics(namespace), params, {});
};
export var getMeshTls = function () {
    return newRequest(HTTP_VERBS.GET, urls.meshTls(), {}, {});
};
export var getNamespaceTls = function (namespace) {
    return newRequest(HTTP_VERBS.GET, urls.namespaceTls(namespace), {}, {});
};
export var getIstioConfig = function (namespace, objects, validate) {
    var params = objects && objects.length > 0 ? { objects: objects.join(',') } : {};
    if (validate) {
        params.validate = validate;
    }
    return newRequest(HTTP_VERBS.GET, urls.istioConfig(namespace), params, {});
};
export var getIstioConfigDetail = function (namespace, objectType, object, validate) {
    return newRequest(HTTP_VERBS.GET, urls.istioConfigDetail(namespace, objectType, object), validate ? { validate: true } : {}, {});
};
export var getIstioConfigDetailSubtype = function (namespace, objectType, objectSubtype, object) {
    return newRequest(HTTP_VERBS.GET, urls.istioConfigDetailSubtype(namespace, objectType, objectSubtype, object), {}, {});
};
export var deleteIstioConfigDetail = function (namespace, objectType, object) {
    return newRequest(HTTP_VERBS.DELETE, urls.istioConfigDetail(namespace, objectType, object), {}, {});
};
export var deleteIstioConfigDetailSubtype = function (namespace, objectType, objectSubtype, object) {
    return newRequest(HTTP_VERBS.DELETE, urls.istioConfigDetailSubtype(namespace, objectType, objectSubtype, object), {}, {});
};
export var updateIstioConfigDetail = function (namespace, objectType, object, jsonPatch) {
    return newRequest(HTTP_VERBS.PATCH, urls.istioConfigDetail(namespace, objectType, object), {}, jsonPatch);
};
export var updateIstioConfigDetailSubtype = function (namespace, objectType, objectSubtype, object, jsonPatch) {
    return newRequest(HTTP_VERBS.PATCH, urls.istioConfigDetailSubtype(namespace, objectType, objectSubtype, object), {}, jsonPatch);
};
export var createIstioConfigDetail = function (namespace, objectType, json) {
    return newRequest(HTTP_VERBS.POST, urls.istioConfigCreate(namespace, objectType), {}, json);
};
export var createIstioConfigDetailSubtype = function (namespace, objectType, objectSubtype, json) {
    return newRequest(HTTP_VERBS.POST, urls.istioConfigCreateSubtype(namespace, objectType, objectSubtype), {}, json);
};
export var getServices = function (namespace) {
    return newRequest(HTTP_VERBS.GET, urls.services(namespace), {}, {});
};
export var getServiceMetrics = function (namespace, service, params) {
    return newRequest(HTTP_VERBS.GET, urls.serviceMetrics(namespace, service), params, {});
};
export var getServiceDashboard = function (namespace, service, params) {
    return newRequest(HTTP_VERBS.GET, urls.serviceDashboard(namespace, service), params, {});
};
export var getApp = function (namespace, app) {
    return newRequest(HTTP_VERBS.GET, urls.app(namespace, app), {}, {});
};
export var getApps = function (namespace) {
    return newRequest(HTTP_VERBS.GET, urls.apps(namespace), {}, {});
};
export var getAppMetrics = function (namespace, app, params) {
    return newRequest(HTTP_VERBS.GET, urls.appMetrics(namespace, app), params, {});
};
export var getAppDashboard = function (namespace, app, params) {
    return newRequest(HTTP_VERBS.GET, urls.appDashboard(namespace, app), params, {});
};
export var getWorkloadMetrics = function (namespace, workload, params) {
    return newRequest(HTTP_VERBS.GET, urls.workloadMetrics(namespace, workload), params, {});
};
export var getWorkloadDashboard = function (namespace, workload, params) {
    return newRequest(HTTP_VERBS.GET, urls.workloadDashboard(namespace, workload), params, {});
};
export var getCustomDashboard = function (ns, tpl, params) {
    return newRequest(HTTP_VERBS.GET, urls.customDashboard(ns, tpl), params, {});
};
export var getServiceHealth = function (namespace, service, durationSec, hasSidecar) {
    var params = durationSec ? { rateInterval: String(durationSec) + 's' } : {};
    return newRequest(HTTP_VERBS.GET, urls.serviceHealth(namespace, service), params, {}).then(function (response) {
        return ServiceHealth.fromJson(response.data, { rateInterval: durationSec, hasSidecar: hasSidecar });
    });
};
export var getAppHealth = function (namespace, app, durationSec, hasSidecar) {
    var params = durationSec ? { rateInterval: String(durationSec) + 's' } : {};
    return newRequest(HTTP_VERBS.GET, urls.appHealth(namespace, app), params, {}).then(function (response) {
        return AppHealth.fromJson(response.data, { rateInterval: durationSec, hasSidecar: hasSidecar });
    });
};
export var getWorkloadHealth = function (namespace, workload, durationSec, hasSidecar) {
    var params = durationSec ? { rateInterval: String(durationSec) + 's' } : {};
    return newRequest(HTTP_VERBS.GET, urls.workloadHealth(namespace, workload), params, {}).then(function (response) {
        return WorkloadHealth.fromJson(response.data, { rateInterval: durationSec, hasSidecar: hasSidecar });
    });
};
export var getNamespaceAppHealth = function (namespace, durationSec) {
    var params = {
        type: 'app'
    };
    if (durationSec) {
        params.rateInterval = String(durationSec) + 's';
    }
    return newRequest(HTTP_VERBS.GET, urls.namespaceHealth(namespace), params, {}).then(function (response) {
        var ret = {};
        Object.keys(response.data).forEach(function (k) {
            ret[k] = AppHealth.fromJson(response.data[k], { rateInterval: durationSec, hasSidecar: true });
        });
        return ret;
    });
};
export var getNamespaceServiceHealth = function (namespace, durationSec) {
    var params = {
        type: 'service'
    };
    if (durationSec) {
        params.rateInterval = String(durationSec) + 's';
    }
    return newRequest(HTTP_VERBS.GET, urls.namespaceHealth(namespace), params, {}).then(function (response) {
        var ret = {};
        Object.keys(response.data).forEach(function (k) {
            ret[k] = ServiceHealth.fromJson(response.data[k], { rateInterval: durationSec, hasSidecar: true });
        });
        return ret;
    });
};
export var getNamespaceWorkloadHealth = function (namespace, durationSec) {
    var params = {
        type: 'workload'
    };
    if (durationSec) {
        params.rateInterval = String(durationSec) + 's';
    }
    return newRequest(HTTP_VERBS.GET, urls.namespaceHealth(namespace), params, {}).then(function (response) {
        var ret = {};
        Object.keys(response.data).forEach(function (k) {
            ret[k] = WorkloadHealth.fromJson(response.data[k], { rateInterval: durationSec, hasSidecar: true });
        });
        return ret;
    });
};
export var getGrafanaInfo = function () {
    return newRequest(HTTP_VERBS.GET, urls.grafana, {}, {});
};
export var getJaegerInfo = function () {
    return newRequest(HTTP_VERBS.GET, urls.jaeger, {}, {});
};
export var getGraphElements = function (params) {
    return newRequest(HTTP_VERBS.GET, urls.namespacesGraphElements, params, {});
};
export var getNodeGraphElements = function (node, params) {
    switch (node.nodeType) {
        case NodeType.APP:
            return newRequest(HTTP_VERBS.GET, urls.appGraphElements(node.namespace.name, node.app, node.version), params, {});
        case NodeType.SERVICE:
            return newRequest(HTTP_VERBS.GET, urls.serviceGraphElements(node.namespace.name, node.service), params, {});
        case NodeType.WORKLOAD:
            return newRequest(HTTP_VERBS.GET, urls.workloadGraphElements(node.namespace.name, node.workload), params, {});
        default:
            // default to namespace graph
            return getGraphElements(__assign({ namespaces: node.namespace.name }, params));
    }
};
export var getServerConfig = function () {
    return newRequest(HTTP_VERBS.GET, urls.serverConfig, {}, {});
};
export var getServiceDetail = function (namespace, service, validate, rateInterval) {
    var params = {};
    if (validate) {
        params.validate = true;
    }
    if (rateInterval) {
        params.rateInterval = rateInterval + "s";
    }
    return newRequest(HTTP_VERBS.GET, urls.service(namespace, service), params, {}).then(function (r) {
        var info = r.data;
        if (info.health) {
            // Default rate interval in backend = 600s
            info.health = ServiceHealth.fromJson(info.health, {
                rateInterval: rateInterval || 600,
                hasSidecar: info.istioSidecar
            });
        }
        return info;
    });
};
export var getWorkloads = function (namespace) {
    return newRequest(HTTP_VERBS.GET, urls.workloads(namespace), {}, {});
};
export var getWorkload = function (namespace, name) {
    return newRequest(HTTP_VERBS.GET, urls.workload(namespace, name), {}, {});
};
export var getPod = function (namespace, name) {
    return newRequest(HTTP_VERBS.GET, urls.pod(namespace, name), {}, {});
};
export var getPodLogs = function (namespace, name, container, tailLines, sinceTime) {
    var params = {};
    if (container) {
        params.container = container;
    }
    if (sinceTime) {
        params.sinceTime = sinceTime;
    }
    if (tailLines && tailLines > 0) {
        params.tailLines = tailLines;
    }
    return newRequest(HTTP_VERBS.GET, urls.podLogs(namespace, name), params, {});
};
export var getMessage = function (type, msg, error) {
    var errorMessage = msg;
    if (error && error.response) {
        if (error.response.data && error.response.data.error) {
            errorMessage = msg + ", " + type + ": [ " + error.response.data.error + " ]";
        }
        else if (error.response.statusText) {
            errorMessage = msg + ", " + type + ": [ " + error.response.statusText + " ]";
            if (error.response.status === 401) {
                errorMessage += ' Has your session expired? Try logging in again.';
            }
        }
    }
    return errorMessage;
};
export var getInfoMsg = function (msg, error) {
    return getMessage('Info', msg, error);
};
export var getErrorMsg = function (msg, error) {
    return getMessage('Error', msg, error);
};
export var getThreeScaleInfo = function () {
    return newRequest(HTTP_VERBS.GET, urls.threeScale, {}, {});
};
export var getThreeScaleHandlers = function () {
    return newRequest(HTTP_VERBS.GET, urls.threeScaleHandlers, {}, {});
};
export var createThreeScaleHandler = function (json) {
    return newRequest(HTTP_VERBS.POST, urls.threeScaleHandlers, {}, json);
};
export var updateThreeScaleHandler = function (handlerName, json) {
    return newRequest(HTTP_VERBS.PATCH, urls.threeScaleHandler(handlerName), {}, json);
};
export var deleteThreeScaleHandler = function (handlerName) {
    return newRequest(HTTP_VERBS.DELETE, urls.threeScaleHandler(handlerName), {}, {});
};
export var getThreeScaleServiceRule = function (namespace, service) {
    return newRequest(HTTP_VERBS.GET, urls.threeScaleServiceRule(namespace, service), {}, {});
};
export var createThreeScaleServiceRule = function (namespace, json) {
    return newRequest(HTTP_VERBS.POST, urls.threeScaleServiceRules(namespace), {}, json);
};
export var updateThreeScaleServiceRule = function (namespace, service, json) {
    return newRequest(HTTP_VERBS.PATCH, urls.threeScaleServiceRule(namespace, service), {}, json);
};
export var deleteThreeScaleServiceRule = function (namespace, service) {
    return newRequest(HTTP_VERBS.DELETE, urls.threeScaleServiceRule(namespace, service), {}, {});
};
//# sourceMappingURL=Api.js.map