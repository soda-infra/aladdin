import * as H from '../Health';
describe('Health', function () {
    it('should check ratio with 0 valid', function () {
        expect(H.ratioCheck(0, 3, 3)).toEqual(H.FAILURE);
    });
    it('should check ratio with some valid', function () {
        expect(H.ratioCheck(1, 3, 3)).toEqual(H.DEGRADED);
    });
    it('should check ratio with all valid', function () {
        expect(H.ratioCheck(3, 3, 3)).toEqual(H.HEALTHY);
    });
    it('should check ratio with no item', function () {
        expect(H.ratioCheck(0, 0, 0)).toEqual(H.NA);
    });
    it('should check ratio pending Pods', function () {
        // 3 Pods with problems
        expect(H.ratioCheck(3, 6, 3)).toEqual(H.FAILURE);
    });
    it('should merge status with correct priority', function () {
        var status = H.mergeStatus(H.NA, H.HEALTHY);
        expect(status).toEqual(H.HEALTHY);
        status = H.mergeStatus(status, H.DEGRADED);
        expect(status).toEqual(H.DEGRADED);
        status = H.mergeStatus(status, H.FAILURE);
        expect(status).toEqual(H.FAILURE);
        status = H.mergeStatus(status, H.DEGRADED); // commutativity
        expect(status).toEqual(H.FAILURE);
        status = H.mergeStatus(status, H.HEALTHY);
        expect(status).toEqual(H.FAILURE);
        status = H.mergeStatus(status, H.NA);
        expect(status).toEqual(H.FAILURE);
    });
    it('should not get requests error ratio', function () {
        var result = H.getRequestErrorsStatus(-1);
        expect(result.status).toEqual(H.NA);
        expect(result.violation).toBeUndefined();
    });
    it('should get healthy requests error ratio', function () {
        var result = H.getRequestErrorsStatus(0);
        expect(result.status).toEqual(H.HEALTHY);
        expect(result.value).toEqual(0);
        expect(result.violation).toBeUndefined();
    });
    it('should get degraded requests error ratio', function () {
        var result = H.getRequestErrorsStatus(0.1);
        expect(result.status).toEqual(H.DEGRADED);
        expect(result.value).toEqual(10);
        expect(result.violation).toEqual('10.00%>=0.1%');
    });
    it('should get failing requests error ratio', function () {
        var result = H.getRequestErrorsStatus(0.5);
        expect(result.status).toEqual(H.FAILURE);
        expect(result.value).toEqual(50);
        expect(result.violation).toEqual('50.00%>=20%');
    });
    it('should get comparable error ratio with NA', function () {
        var r1 = H.getRequestErrorsStatus(-1);
        var r2 = H.getRequestErrorsStatus(0);
        expect(r2.value).toBeGreaterThan(r1.value);
        expect(r1.value).toBeLessThan(r2.value);
    });
    it('should aggregate without reporter', function () {
        var health = new H.AppHealth([{ availableReplicas: 0, currentReplicas: 1, desiredReplicas: 1, name: 'a' }], { errorRatio: 1, inboundErrorRatio: 1, outboundErrorRatio: 1 }, { rateInterval: 60, hasSidecar: true });
        expect(health.getGlobalStatus()).toEqual(H.FAILURE);
    });
    it('should aggregate healthy', function () {
        var health = new H.AppHealth([
            { availableReplicas: 1, currentReplicas: 1, desiredReplicas: 1, name: 'a' },
            { availableReplicas: 2, currentReplicas: 2, desiredReplicas: 2, name: 'b' }
        ], { errorRatio: 0, inboundErrorRatio: 0, outboundErrorRatio: 0 }, { rateInterval: 60, hasSidecar: true });
        expect(health.getGlobalStatus()).toEqual(H.HEALTHY);
    });
    it('should aggregate degraded workload', function () {
        var health = new H.AppHealth([
            { availableReplicas: 1, currentReplicas: 1, desiredReplicas: 1, name: 'a' },
            { availableReplicas: 1, currentReplicas: 1, desiredReplicas: 2, name: 'b' }
        ], { errorRatio: 0, inboundErrorRatio: 0, outboundErrorRatio: 0 }, { rateInterval: 60, hasSidecar: true });
        expect(health.getGlobalStatus()).toEqual(H.DEGRADED);
    });
    it('should aggregate failing requests', function () {
        var health = new H.AppHealth([
            { availableReplicas: 1, currentReplicas: 1, desiredReplicas: 1, name: 'a' },
            { availableReplicas: 2, currentReplicas: 2, desiredReplicas: 2, name: 'b' }
        ], { errorRatio: 0.2, inboundErrorRatio: 0.3, outboundErrorRatio: 0.1 }, { rateInterval: 60, hasSidecar: true });
        expect(health.getGlobalStatus()).toEqual(H.FAILURE);
    });
    it('should aggregate multiple issues', function () {
        var health = new H.AppHealth([
            { availableReplicas: 0, currentReplicas: 0, desiredReplicas: 0, name: 'a' },
            { availableReplicas: 0, currentReplicas: 0, desiredReplicas: 0, name: 'b' }
        ], { errorRatio: 0.2, inboundErrorRatio: 0.3, outboundErrorRatio: 0.1 }, { rateInterval: 60, hasSidecar: true });
        expect(health.getGlobalStatus()).toEqual(H.FAILURE);
    });
    it('should not ignore error rates when has sidecar', function () {
        var health = new H.AppHealth([{ availableReplicas: 1, currentReplicas: 1, desiredReplicas: 1, name: 'a' }], { errorRatio: 0, inboundErrorRatio: 0, outboundErrorRatio: 0 }, { rateInterval: 60, hasSidecar: true });
        expect(health.items).toHaveLength(2);
    });
    it('should ignore error rates when no sidecar', function () {
        var health = new H.AppHealth([{ availableReplicas: 1, currentReplicas: 1, desiredReplicas: 1, name: 'a' }], { errorRatio: 0, inboundErrorRatio: 0, outboundErrorRatio: 0 }, { rateInterval: 60, hasSidecar: false });
        expect(health.items).toHaveLength(1);
    });
});
//# sourceMappingURL=Health.test.js.map