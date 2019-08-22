import { serverConfig } from '../config/ServerConfig';
export var tuples = Object.keys(serverConfig.durations).map(function (key) {
    var tuple = [+key, serverConfig.durations[key]];
    return tuple;
});
export var getName = function (durationSeconds) {
    var name = serverConfig.durations[durationSeconds];
    if (name) {
        return name;
    }
    return 'Last ' + durationSeconds + ' seconds';
};
//# sourceMappingURL=RateIntervals.js.map