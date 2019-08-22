import * as MathUtils from '../MathUtils';
describe('MathUtils.clamp', function () {
    it('should clamp to lower value', function () {
        expect(MathUtils.clamp(0, 5, 8)).toEqual(5);
    });
    it('should clamp to higher value', function () {
        expect(MathUtils.clamp(10, 5, 8)).toEqual(8);
    });
    it('should return value if in range', function () {
        expect(MathUtils.clamp(6, 5, 8)).toEqual(6);
    });
    it('should return be inclusive on the lower bound', function () {
        expect(MathUtils.clamp(5, 5, 8)).toEqual(5);
    });
    it('should return be inclusive on the upper bound', function () {
        expect(MathUtils.clamp(8, 5, 8)).toEqual(8);
    });
});
describe('MathUtils.quadraticBezier', function () {
    it('should yield the p0 on t=0', function () {
        expect(MathUtils.quadraticBezier({ x: 1, y: 1 }, { x: 5, y: 5 }, { x: 8, y: 1 }, 0)).toMatchObject({ x: 1, y: 1 });
    });
    it('should yield the p2 on t=1', function () {
        expect(MathUtils.quadraticBezier({ x: 1, y: 1 }, { x: 5, y: 5 }, { x: 8, y: 1 }, 1)).toMatchObject({ x: 8, y: 1 });
    });
    it('should yield correct value for t=0.7', function () {
        var result = MathUtils.quadraticBezier({ x: 1, y: 1 }, { x: 5, y: 5 }, { x: 8, y: 1 }, 0.7);
        expect(result.x).toBeCloseTo(6.11);
        expect(result.y).toBeCloseTo(2.68);
    });
    it('should yield correct value for t=0.25', function () {
        var result = MathUtils.quadraticBezier({ x: 1, y: 1 }, { x: 5, y: 5 }, { x: 8, y: 1 }, 0.25);
        expect(result.x).toBeCloseTo(2.9375);
        expect(result.y).toBeCloseTo(2.5);
    });
});
describe('MathUtils.linearInterpolation', function () {
    it('should yield the p0 on t=0', function () {
        expect(MathUtils.linearInterpolation({ x: 1, y: 1 }, { x: 5, y: 5 }, 0)).toMatchObject({ x: 1, y: 1 });
    });
    it('should yield the p1 on t=1', function () {
        expect(MathUtils.linearInterpolation({ x: 1, y: 1 }, { x: 5, y: 5 }, 1)).toMatchObject({ x: 5, y: 5 });
    });
    it('should yield correct value for t=0.7', function () {
        var result = MathUtils.linearInterpolation({ x: 1, y: 1 }, { x: 5, y: 5 }, 0.7);
        expect(result.x).toBeCloseTo(3.8);
        expect(result.y).toBeCloseTo(3.8);
    });
    it('should yield correct value for t=0.25', function () {
        var result = MathUtils.linearInterpolation({ x: 1, y: 1 }, { x: 8, y: 1 }, 0.25);
        expect(result.x).toBeCloseTo(2.75);
        expect(result.y).toBeCloseTo(1);
    });
});
//# sourceMappingURL=MathUtils.test.js.map