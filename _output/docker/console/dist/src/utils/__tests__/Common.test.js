import { removeDuplicatesArray } from '../Common';
var arrayDuplicates = ['bookinfo', 'default', 'bookinfo'];
var arrayNoDuplicates = ['bookinfo', 'default'];
describe('Unique elements in Array', function () {
    it('should clean duplicates', function () {
        expect(removeDuplicatesArray(arrayDuplicates)).toEqual(['bookinfo', 'default']);
        expect(removeDuplicatesArray(arrayDuplicates).length).toEqual(2);
    });
    it('should return the same array', function () {
        expect(removeDuplicatesArray(arrayNoDuplicates)).toEqual(arrayNoDuplicates);
        expect(removeDuplicatesArray(arrayNoDuplicates).length).toEqual(arrayNoDuplicates.length);
    });
});
//# sourceMappingURL=Common.test.js.map