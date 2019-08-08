import SubsetValidator from './SubsetValidator';
var DestinationRuleValidator = /** @class */ (function () {
    function DestinationRuleValidator(destinationRule) {
        this.destinationRule = destinationRule;
        this.unformattedField = 'none';
    }
    DestinationRuleValidator.prototype.isValid = function () {
        return this.hasValidName() && this.hasSpecData() && this.hasValidSubsets() && this.hasValidHost();
    };
    DestinationRuleValidator.prototype.hasValidName = function () {
        if (typeof this.destinationRule.metadata.name !== 'string') {
            this.unformattedField = 'Name';
            return false;
        }
        return true;
    };
    DestinationRuleValidator.prototype.hasSpecData = function () {
        return this.destinationRule.spec !== null;
    };
    DestinationRuleValidator.prototype.hasValidSubsets = function () {
        if (!this.destinationRule.spec.subsets) {
            return true;
        }
        var valid = this.destinationRule.spec.subsets instanceof Array;
        valid =
            valid && this.destinationRule.spec.subsets.every(function (subset, _i, _ary) { return new SubsetValidator(subset).isValid(); });
        if (!valid) {
            this.unformattedField = 'Subsets';
        }
        return valid;
    };
    DestinationRuleValidator.prototype.hasValidHost = function () {
        if (typeof this.destinationRule.spec.host !== 'string') {
            this.unformattedField = 'Host';
            return false;
        }
        return true;
    };
    DestinationRuleValidator.prototype.formatValidation = function () {
        if (!this.isValid()) {
            return {
                message: 'This destination rule has format problems in field ' + this.unformattedField,
                severity: 'error',
                path: ''
            };
        }
        return null;
    };
    return DestinationRuleValidator;
}());
export default DestinationRuleValidator;
//# sourceMappingURL=DestinationRuleValidator.js.map