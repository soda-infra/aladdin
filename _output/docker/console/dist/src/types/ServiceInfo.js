import { PfColors } from '../components/Pf/PfColors';
// Istio Sidecar
export var hasIstioSidecar = function (pods) {
    if (pods) {
        return pods.find(function (pod) { return pod.istioContainers != null; }) !== undefined;
    }
    return false;
};
var higherThan = [
    'error-warning',
    'error-improvement',
    'error-correct',
    'warning-improvement',
    'warning-correct',
    'improvement-correct'
];
var IconSeverityMap = new Map([
    ['error', 'error-circle-o'],
    ['warning', 'warning-triangle-o'],
    ['improvement', 'info'],
    ['correct', 'ok']
]);
var ColorSeverityMap = new Map([
    ['error', PfColors.Red100],
    ['warning', PfColors.Orange400],
    ['improvement', PfColors.Blue400],
    ['correct', PfColors.Green400]
]);
export var severityToIconName = function (severity) {
    var iconName = IconSeverityMap.get(severity);
    if (!iconName) {
        iconName = 'ok';
    }
    return iconName;
};
export var severityToColor = function (severity) {
    var color = ColorSeverityMap.get(severity);
    if (!color) {
        color = 'black';
    }
    return color;
};
export var higherSeverity = function (a, b) {
    return higherThan.includes(a + '-' + b);
};
export var highestSeverity = function (checks) {
    var severity = 'correct';
    checks.forEach(function (check) {
        if (higherSeverity(check.severity, severity)) {
            severity = check.severity;
        }
    });
    return severity;
};
var numberOfChecks = function (type, object) {
    return (object && object.checks ? object.checks : []).filter(function (i) { return i.severity === type; }).length;
};
export var validationToSeverity = function (object) {
    var warnChecks = numberOfChecks('warning', object);
    var errChecks = numberOfChecks('error', object);
    return object && object.valid
        ? 'correct'
        : object && !object.valid && errChecks > 0
            ? 'error'
            : object && !object.valid && warnChecks > 0
                ? 'warning'
                : 'correct';
};
export var checkForPath = function (object, path) {
    if (!object || !object.checks) {
        return [];
    }
    var check = object.checks.filter(function (item) {
        return item.path === path;
    });
    return check;
};
export var globalChecks = function (object) {
    return checkForPath(object, '');
};
//# sourceMappingURL=ServiceInfo.js.map