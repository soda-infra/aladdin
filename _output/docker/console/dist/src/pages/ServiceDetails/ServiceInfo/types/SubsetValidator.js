var SubsetValidator = /** @class */ (function () {
    function SubsetValidator(subset) {
        this.subset = subset;
    }
    SubsetValidator.prototype.isValid = function () {
        return this.hasValidName() && this.hasValidLabels();
    };
    SubsetValidator.prototype.hasValidName = function () {
        return this.hasStringType(this.subset.name);
    };
    SubsetValidator.prototype.hasValidLabels = function () {
        var _this = this;
        var valid = Object.keys(this.subset.labels).every(function (k, _i) { return _this.hasValidLabel(k, _this.subset.labels[k]); });
        return this.subset.labels instanceof Object && valid;
    };
    SubsetValidator.prototype.hasValidLabel = function (name, value) {
        return this.hasStringType(name) && this.hasStringType(value);
    };
    SubsetValidator.prototype.hasStringType = function (value) {
        return typeof value === 'string';
    };
    return SubsetValidator;
}());
export default SubsetValidator;
//# sourceMappingURL=SubsetValidator.js.map