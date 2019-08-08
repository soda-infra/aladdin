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
var toDurations = function (tupleArray) {
    var obj = {};
    tupleArray.forEach(function (tuple) {
        obj[tuple[0]] = tuple[1];
    });
    return obj;
};
var durationsTuples = [
    [60, 'Last 1m'],
    [300, 'Last 5m'],
    [600, 'Last 10m'],
    [1800, 'Last 30m'],
    [3600, 'Last 1h'],
    [10800, 'Last 3h'],
    [21600, 'Last 6h'],
    [43200, 'Last 12h'],
    [86400, 'Last 1d'],
    [604800, 'Last 7d'],
    [2592000, 'Last 30d']
];
var computeValidDurations = function (cfg) {
    if (cfg.prometheus.storageTsdbRetention) {
        // Make sure we'll keep at least one item
        if (cfg.prometheus.storageTsdbRetention <= durationsTuples[0][0]) {
            durationsTuples = [durationsTuples[0]];
        }
        else {
            durationsTuples = durationsTuples.filter(function (d) { return d[0] <= cfg.prometheus.storageTsdbRetention; });
        }
    }
    cfg.durations = toDurations(durationsTuples);
};
// Set some defaults. Mainly used in tests, because
// these will be overwritten on user login.
var serverConfig = {
    installationTag: 'Kiali Console',
    istioNamespace: 'istio-system',
    istioLabels: {
        appLabelName: 'app',
        versionLabelName: 'version'
    },
    prometheus: {
        globalScrapeInterval: 15,
        storageTsdbRetention: 21600
    },
    durations: {}
};
computeValidDurations(serverConfig);
export { serverConfig };
export var toValidDuration = function (duration) {
    // Check if valid
    if (serverConfig.durations[duration]) {
        return duration;
    }
    // Get closest duration
    for (var i = durationsTuples.length - 1; i >= 0; i--) {
        if (duration > durationsTuples[i][0]) {
            return durationsTuples[i][0];
        }
    }
    return durationsTuples[0][0];
};
export var setServerConfig = function (svcConfig) {
    serverConfig = __assign({}, svcConfig, { durations: {} });
    computeValidDurations(serverConfig);
};
//# sourceMappingURL=ServerConfig.js.map