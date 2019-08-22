export var removeDuplicatesArray = function (a) { return Array.from(new Set(a)).slice(); };
export var arrayEquals = function (a1, a2, comparator) {
    if (a1.length !== a2.length) {
        return false;
    }
    for (var i = 0; i < a1.length; ++i) {
        if (!comparator(a1[i], a2[i])) {
            return false;
        }
    }
    return true;
};
//# sourceMappingURL=Common.js.map