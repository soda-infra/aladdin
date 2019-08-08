import { computePrometheusRateParams } from '../Prometheus';
describe('Prometheus service', function () {
    it('should compute prometheus rate interval default', function () {
        var res = computePrometheusRateParams(3600);
        expect(res.step).toBe(72);
        expect(res.rateInterval).toBe('72s');
    });
    it('should compute prometheus rate interval with expected datapoints', function () {
        var res = computePrometheusRateParams(3600, 10);
        expect(res.step).toBe(360);
        expect(res.rateInterval).toBe('360s');
    });
    it('should compute prometheus rate interval minimized', function () {
        var res = computePrometheusRateParams(60, 30);
        expect(res.step).toBe(30);
        expect(res.rateInterval).toBe('30s');
    });
    it('should compute prometheus rate interval minimized for custom scrape', function () {
        var res = computePrometheusRateParams(60, 30, 5);
        expect(res.step).toBe(10);
        expect(res.rateInterval).toBe('10s');
    });
});
//# sourceMappingURL=Prometheus.test.js.map