import { createBrowserHistory, createMemoryHistory } from 'history';
import { toValidDuration } from '../config/ServerConfig';
var webRoot = window.WEB_ROOT ? window.WEB_ROOT : undefined;
var baseName = webRoot && webRoot !== '/' ? webRoot + '/console' : '/console';
var history = process.env.TEST_RUNNER ? createMemoryHistory() : createBrowserHistory({ basename: baseName });
export default history;
export var URLParam;
(function (URLParam) {
    URLParam["AGGREGATOR"] = "aggregator";
    URLParam["BY_LABELS"] = "bylbl";
    URLParam["DIRECTION"] = "direction";
    URLParam["DURATION"] = "duration";
    URLParam["GRAPH_EDGES"] = "edges";
    URLParam["GRAPH_LAYOUT"] = "layout";
    URLParam["GRAPH_SERVICE_NODES"] = "injectServiceNodes";
    URLParam["GRAPH_TYPE"] = "graphType";
    URLParam["NAMESPACES"] = "namespaces";
    URLParam["OVERVIEW_TYPE"] = "otype";
    URLParam["PAGE"] = "page";
    URLParam["PER_PAGE"] = "perPage";
    URLParam["POLL_INTERVAL"] = "pi";
    URLParam["QUANTILES"] = "quantiles";
    URLParam["REPORTER"] = "reporter";
    URLParam["SHOW_AVERAGE"] = "avg";
    URLParam["SORT"] = "sort";
    URLParam["UNUSED_NODES"] = "unusedNodes";
    URLParam["JAEGER_START_TIME"] = "start";
    URLParam["JAEGER_END_TIME"] = "end";
    URLParam["JAEGER_LIMIT_TRACES"] = "limit";
    URLParam["JAEGER_LOOKBACK"] = "lookback";
    URLParam["JAEGER_MAX_DURATION"] = "maxDuration";
    URLParam["JAEGER_MIN_DURATION"] = "minDuration";
    URLParam["JAEGER_SERVICE_SELECTOR"] = "service";
    URLParam["JAEGER_TAGS"] = "tags";
})(URLParam || (URLParam = {}));
export var ParamAction;
(function (ParamAction) {
    ParamAction[ParamAction["APPEND"] = 0] = "APPEND";
    ParamAction[ParamAction["SET"] = 1] = "SET";
})(ParamAction || (ParamAction = {}));
var HistoryManager = /** @class */ (function () {
    function HistoryManager() {
    }
    HistoryManager.setParam = function (name, value) {
        var urlParams = new URLSearchParams(history.location.search);
        urlParams.set(name, value);
        history.replace(history.location.pathname + '?' + urlParams.toString());
    };
    HistoryManager.getParam = function (name, urlParams) {
        if (!urlParams) {
            urlParams = new URLSearchParams(history.location.search);
        }
        var p = urlParams.get(name);
        return p !== null ? p : undefined;
    };
    HistoryManager.getNumericParam = function (name, urlParams) {
        var p = HistoryManager.getParam(name, urlParams);
        return p !== undefined ? Number(p) : undefined;
    };
    HistoryManager.getBooleanParam = function (name, urlParams) {
        var p = HistoryManager.getParam(name, urlParams);
        return p !== undefined ? p === 'true' : undefined;
    };
    HistoryManager.deleteParam = function (name, historyReplace) {
        var urlParams = new URLSearchParams(history.location.search);
        urlParams.delete(name);
        if (historyReplace) {
            history.replace(history.location.pathname + '?' + urlParams.toString());
        }
        else {
            history.push(history.location.pathname + '?' + urlParams.toString());
        }
    };
    HistoryManager.setParams = function (params, paramAction, historyReplace) {
        var urlParams = new URLSearchParams(history.location.search);
        if (params.length > 0 && paramAction === ParamAction.APPEND) {
            params.forEach(function (param) { return urlParams.delete(param.name); });
        }
        params.forEach(function (param) {
            if (param.value === '') {
                urlParams.delete(param.name);
            }
            else if (paramAction === ParamAction.APPEND) {
                urlParams.append(param.name, param.value);
            }
            else {
                urlParams.set(param.name, param.value);
            }
        });
        if (historyReplace) {
            history.replace(history.location.pathname + '?' + urlParams.toString());
        }
        else {
            history.push(history.location.pathname + '?' + urlParams.toString());
        }
    };
    HistoryManager.getDuration = function (urlParams) {
        var duration = HistoryManager.getParam(URLParam.DURATION, urlParams);
        if (duration) {
            return toValidDuration(Number(duration));
        }
        return undefined;
    };
    return HistoryManager;
}());
export { HistoryManager };
//# sourceMappingURL=History.js.map