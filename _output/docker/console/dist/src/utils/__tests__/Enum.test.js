import * as Enum from '../Enum';
var StringEnum;
(function (StringEnum) {
    StringEnum["A"] = "A";
    StringEnum["B"] = "B";
    StringEnum["C"] = "C";
    StringEnum["F"] = "F";
})(StringEnum || (StringEnum = {}));
var IntegerEnum;
(function (IntegerEnum) {
    IntegerEnum[IntegerEnum["A"] = 1] = "A";
    IntegerEnum[IntegerEnum["B"] = 2] = "B";
    IntegerEnum[IntegerEnum["C"] = 3] = "C";
    IntegerEnum[IntegerEnum["F"] = 6] = "F";
})(IntegerEnum || (IntegerEnum = {}));
var MixedEnum;
(function (MixedEnum) {
    MixedEnum["A"] = "A";
    MixedEnum[MixedEnum["B"] = 2] = "B";
    MixedEnum["C"] = "C";
    MixedEnum[MixedEnum["F"] = 6] = "F";
})(MixedEnum || (MixedEnum = {}));
describe('Enum.fromValue', function () {
    it('works for string enums', function () {
        expect(Enum.fromValue(StringEnum, 'A', StringEnum.B)).toEqual(StringEnum.A);
    });
    it('works for integer enums', function () {
        expect(Enum.fromValue(IntegerEnum, 1, IntegerEnum.B)).toEqual(IntegerEnum.A);
    });
    it('works for mixed enums', function () {
        expect(Enum.fromValue(MixedEnum, 'A', MixedEnum.F)).toEqual(MixedEnum.A);
        expect(Enum.fromValue(MixedEnum, 2, MixedEnum.F)).toEqual(MixedEnum.B);
    });
    it('get default if not found', function () {
        expect(Enum.fromValue(StringEnum, 'X', StringEnum.B)).toEqual(StringEnum.B);
    });
});
//# sourceMappingURL=Enum.test.js.map