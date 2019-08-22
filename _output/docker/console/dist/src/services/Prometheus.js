import { serverConfig } from '../config/ServerConfig';
// The step needs to minimally cover 2 datapoints to get any sort of average. So 2*scrape is the bare
// minimum.  We set rateInterval=step which basically gives us the rate() of each disjoint set.
// (note, another approach could be to set rateInterval=step+scrape, the overlap could produce some
// smoothing). The rateInterval should typically not be < step or you're just omitting datapoints.
var defaultDataPoints = 50;
var defaultScrapeInterval = 15; // seconds
var minDataPoints = 2;
export var computePrometheusRateParams = function (duration, dataPoints, scrapeInterval) {
    var actualDataPoints = dataPoints || defaultDataPoints;
    if (actualDataPoints < minDataPoints) {
        actualDataPoints = defaultDataPoints;
    }
    var configuredScrapeInterval = serverConfig && serverConfig.prometheus.globalScrapeInterval;
    var actualScrapeInterval = scrapeInterval || configuredScrapeInterval || defaultScrapeInterval;
    var minStep = 2 * actualScrapeInterval;
    var step = Math.floor(duration / actualDataPoints);
    step = step < minStep ? minStep : step;
    return {
        step: step,
        rateInterval: step + 's'
    };
};
//# sourceMappingURL=Prometheus.js.map