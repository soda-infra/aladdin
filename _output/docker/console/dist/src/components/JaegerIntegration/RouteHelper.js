import { jaegerQuery } from '../../config';
import logfmtParser from 'logfmt/lib/logfmt_parser';
import moment from 'moment';
import { HistoryManager, URLParam } from '../../app/History';
var converToTimestamp = function (lookback) {
    var multiplier = 1000 * 1000;
    return Number(lookback) * multiplier;
};
var convTagsLogfmt = function (tags) {
    if (!tags) {
        return null;
    }
    var data = logfmtParser.parse(tags);
    Object.keys(data).forEach(function (key) {
        var value = data[key];
        // make sure all values are strings
        // https://github.com/jaegertracing/jaeger/issues/550#issuecomment-352850811
        if (typeof value !== 'string') {
            data[key] = String(value);
        }
    });
    return JSON.stringify(data);
};
export var logfmtTagsConv = function (tags) {
    if (!tags) {
        return null;
    }
    var resultTags = '';
    var jsonTags = JSON.parse(tags);
    Object.keys(jsonTags).forEach(function (key) {
        resultTags += key + "=" + String(jsonTags[key]) + " ";
    });
    return resultTags;
};
export var getUnixTimeStampInMSFromForm = function (startDate, startDateTime, endDate, endDateTime) {
    var start = startDate + " " + startDateTime;
    var end = endDate + " " + endDateTime;
    return {
        start: moment(start, 'YYYY-MM-DD HH:mm')
            .utc()
            .valueOf() + "000",
        end: moment(end, 'YYYY-MM-DD HH:mm')
            .utc()
            .valueOf() + "000"
    };
};
export var getFormFromUnixTimeStamp = function (value, extra) {
    var time = value + (extra ? extra : 0);
    if (value === 0) {
        time = moment.utc().valueOf() + (extra ? extra : 0);
    }
    var dateTime = moment(time)
        .format('YYYY-MM-DD HH:mm')
        .split(' ');
    return {
        date: dateTime[0],
        time: dateTime[1]
    };
};
var JaegerURLSearch = /** @class */ (function () {
    function JaegerURLSearch(url, embed) {
        if (embed === void 0) { embed = true; }
        if (embed) {
            this.url = "" + url + jaegerQuery().path + "?" + jaegerQuery().embed.uiEmbed + "=" + jaegerQuery().embed.version;
        }
        else {
            this.url = "" + url + jaegerQuery().path + "/search?";
        }
    }
    JaegerURLSearch.prototype.addQueryParam = function (param, value) {
        this.url += "&" + param + "=" + value;
    };
    JaegerURLSearch.prototype.addParam = function (param) {
        this.url += "&" + param;
    };
    JaegerURLSearch.prototype.createRoute = function (searchOptions) {
        var nowTime = Date.now() * 1000;
        var lookback = searchOptions.lookback === 'custom' || searchOptions.lookback === '0' ? 'custom' : searchOptions.lookback;
        var endTime = lookback !== 'custom' ? "" + nowTime : searchOptions.end;
        var startTime = lookback !== 'custom' ? "" + (nowTime - converToTimestamp(lookback)) : searchOptions.start;
        // Add query and set data
        this.setParam(URLParam.JAEGER_START_TIME, startTime);
        this.setParam(URLParam.JAEGER_END_TIME, endTime);
        this.setParam(URLParam.JAEGER_LIMIT_TRACES, String(searchOptions.limit));
        this.setParam(URLParam.JAEGER_LOOKBACK, lookback);
        this.setParam(URLParam.JAEGER_MAX_DURATION, searchOptions.maxDuration);
        this.setParam(URLParam.JAEGER_MIN_DURATION, searchOptions.minDuration);
        this.setParam(URLParam.JAEGER_SERVICE_SELECTOR, searchOptions.serviceSelected);
        var logfmtTags = convTagsLogfmt(searchOptions.tags);
        if (logfmtTags) {
            this.setParam(URLParam.JAEGER_TAGS, logfmtTags);
        }
        return this.url;
    };
    JaegerURLSearch.prototype.setParam = function (param, value) {
        this.addQueryParam(param, value);
        HistoryManager.setParam(param, value);
    };
    return JaegerURLSearch;
}());
export { JaegerURLSearch };
//# sourceMappingURL=RouteHelper.js.map