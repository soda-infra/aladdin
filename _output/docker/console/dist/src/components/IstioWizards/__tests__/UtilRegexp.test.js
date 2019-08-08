describe('Should check a complex regexp name', function () {
    var nsRegexp = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[-a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    it('should check valid name', function () {
        var result = 'valid-name.namespace'.search(nsRegexp);
        expect(result).toBe(0);
    });
    it('should check an invalid name', function () {
        var result = 'Invalid-name.namespace'.search(nsRegexp);
        expect(result).toBe(-1);
        result = '-invalid-name.namespace'.search(nsRegexp);
        expect(result).toBe(-1);
        result = 'invalid-name.namespace-'.search(nsRegexp);
        expect(result).toBe(-1);
        result = 'invalid-name.namespace.'.search(nsRegexp);
        expect(result).toBe(-1);
    });
    var durationRegex = /^[0-9]*(\.[0-9]+)?s?$/;
    it('should check a valid duration', function () {
        var result = '012'.search(durationRegex);
        expect(result).toBe(0);
        result = '012.123'.search(durationRegex);
        expect(result).toBe(0);
        result = '012.123s'.search(durationRegex);
        expect(result).toBe(0);
        result = 'abc'.search(durationRegex);
        expect(result).toBe(-1);
        result = '012.123abc'.search(durationRegex);
        expect(result).toBe(-1);
        result = '012.123n'.search(durationRegex);
        expect(result).toBe(-1);
    });
});
//# sourceMappingURL=UtilRegexp.test.js.map