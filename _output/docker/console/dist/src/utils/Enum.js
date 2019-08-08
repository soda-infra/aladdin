export var fromValue = function (enumType, value, defaultValue) {
    var enumKey = Object.keys(enumType).find(function (key) { return enumType[key] === value; });
    if (enumKey !== undefined) {
        return enumType[enumKey];
    }
    return defaultValue;
};
//# sourceMappingURL=Enum.js.map