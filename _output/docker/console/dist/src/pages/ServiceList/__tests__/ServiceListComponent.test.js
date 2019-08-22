import { ServiceHealth } from '../../../types/Health';
import * as ServiceListFilters from '../FiltersAndSorts';
var makeService = function (name, errRatio) {
    var reqErrs = { errorRatio: errRatio, inboundErrorRatio: errRatio, outboundErrorRatio: -1 };
    var health = new ServiceHealth(reqErrs, { rateInterval: 60, hasSidecar: true });
    return {
        name: name,
        health: health
    };
};
describe('SortField#compare', function () {
    describe('sortField = health, is ascending', function () {
        var sortField = ServiceListFilters.sortFields.find(function (s) { return s.title === 'Health'; });
        it('should return >0 when A service health is better than B (priority)', function () {
            var serviceA = makeService('A', 0);
            var serviceB = makeService('B', 0.2);
            expect(sortField.compare(serviceA, serviceB)).toBeGreaterThan(0);
        });
        it('should return <0 when A service health is worst than B (priority)', function () {
            var serviceA = makeService('A', 0.5); // errorRate > Threshold for "error"
            var serviceB = makeService('B', 0.1); // Threshold for "error" > errorRate > Threshold for "warn"
            expect(sortField.compare(serviceA, serviceB)).toBeLessThan(0);
        });
        it('should return zero when A and B services has same health (priority)', function () {
            var serviceA = makeService('', 0.1);
            var serviceB = makeService('', 0.1);
            expect(sortField.compare(serviceA, serviceB)).toBe(0);
        });
        it('should return >0 when A and B have same health and B has more error', function () {
            var serviceA = makeService('A', 0.1); // Health resolves to "warn"
            var serviceB = makeService('B', 0.12); // Health also resolves to "warn"
            expect(sortField.compare(serviceA, serviceB)).toBeGreaterThan(0);
        });
        it('should return <0 when A and B have same health rating and A has more error', function () {
            var serviceA = makeService('A', 0.15); // Health resolves to "warn"
            var serviceB = makeService('B', 0.12); // Health also resolves to "warn"
            expect(sortField.compare(serviceA, serviceB)).toBeLessThan(0);
        });
        it('should return <0 when A and B have same health (order by name; correct ordering)', function () {
            var serviceA = makeService('A', 0.11);
            var serviceB = makeService('B', 0.11);
            expect(sortField.compare(serviceA, serviceB)).toBeLessThan(0);
        });
        it('should return >0 when A and B have same health (order by name; incorrect ordering)', function () {
            var serviceA = makeService('A', 0.11);
            var serviceB = makeService('B', 0.11);
            expect(sortField.compare(serviceB, serviceA)).toBeGreaterThan(0);
        });
    });
});
describe('ServiceListContainer#sortServices', function () {
    var sortField = ServiceListFilters.sortFields.find(function (s) { return s.title === 'Service Name'; });
    var services = [makeService('A', -1), makeService('B', -1)];
    it('should sort ascending', function (done) {
        ServiceListFilters.sortServices(services, sortField, true).then(function (sorted) {
            expect(sorted[0].name).toBe('A');
            expect(sorted[1].name).toBe('B');
            done();
        });
    });
    it('should sort descending', function (done) {
        ServiceListFilters.sortServices(services, sortField, false).then(function (sorted) {
            expect(sorted[0].name).toBe('B');
            expect(sorted[1].name).toBe('A');
            done();
        });
    });
});
//# sourceMappingURL=ServiceListComponent.test.js.map