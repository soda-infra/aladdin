var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ErrorCircleOIcon, WarningTriangleIcon, OkIcon, UnknownIcon } from '@patternfly/react-icons';
import { PfColors } from '../components/Pf/PfColors';
import { getName } from '../utils/RateIntervals';
export var FAILURE = {
    name: 'Failure',
    color: PfColors.Red100,
    priority: 3,
    icon: ErrorCircleOIcon,
    class: 'icon-failure'
};
export var DEGRADED = {
    name: 'Degraded',
    color: PfColors.Orange400,
    priority: 2,
    icon: WarningTriangleIcon,
    class: 'icon-degraded'
};
export var HEALTHY = {
    name: 'Healthy',
    color: PfColors.Green400,
    priority: 1,
    icon: OkIcon,
    class: 'icon-healthy'
};
export var NA = {
    name: 'No health information',
    color: PfColors.Gray,
    priority: 0,
    icon: UnknownIcon,
    class: 'icon-na'
};
export var REQUESTS_THRESHOLDS = {
    degraded: 0.1,
    failure: 20,
    unit: '%'
};
// Use -1 rather than NaN to allow straigthforward comparison
var RATIO_NA = -1;
export var ratioCheck = function (availableReplicas, currentReplicas, desiredReplicas) {
    // No Pods returns No Health Info
    if (desiredReplicas === 0 && currentReplicas === 0) {
        return NA;
    }
    // No available Pods when there are desired and current means a Failure
    if (desiredReplicas > 0 && currentReplicas > 0 && availableReplicas === 0) {
        return FAILURE;
    }
    // Pending Pods means problems
    if (desiredReplicas === availableReplicas && availableReplicas !== currentReplicas) {
        return FAILURE;
    }
    // Health condition
    if (desiredReplicas === currentReplicas && currentReplicas === availableReplicas) {
        return HEALTHY;
    }
    // Other combination could mean a degraded situation
    return DEGRADED;
};
export var mergeStatus = function (s1, s2) {
    return s1.priority > s2.priority ? s1 : s2;
};
var ascendingThresholdCheck = function (value, thresholds) {
    if (value >= thresholds.failure) {
        return {
            value: value,
            status: FAILURE,
            violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.failure + thresholds.unit
        };
    }
    else if (value >= thresholds.degraded) {
        return {
            value: value,
            status: DEGRADED,
            violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.degraded + thresholds.unit
        };
    }
    return { value: value, status: HEALTHY };
};
export var getRequestErrorsStatus = function (ratio) {
    if (ratio < 0) {
        return {
            value: RATIO_NA,
            status: NA
        };
    }
    return ascendingThresholdCheck(100 * ratio, REQUESTS_THRESHOLDS);
};
export var getRequestErrorsSubItem = function (thresholdStatus, prefix) {
    return {
        status: thresholdStatus.status,
        text: prefix + ': ' + (thresholdStatus.status === NA ? 'No requests' : thresholdStatus.value.toFixed(2) + '%')
    };
};
export var getRequestErrorsViolations = function (reqIn, reqOut) {
    var violations = [];
    if (reqIn.violation) {
        violations.push("Inbound errors: " + reqIn.violation);
    }
    if (reqOut.violation) {
        violations.push("Outbound errors: " + reqOut.violation);
    }
    return violations.join(', ');
};
var Health = /** @class */ (function () {
    function Health(items) {
        this.items = items;
    }
    Health.prototype.getGlobalStatus = function () {
        return this.items.map(function (i) { return i.status; }).reduce(function (prev, cur) { return mergeStatus(prev, cur); }, NA);
    };
    return Health;
}());
export { Health };
var ServiceHealth = /** @class */ (function (_super) {
    __extends(ServiceHealth, _super);
    function ServiceHealth(requests, ctx) {
        var _this = _super.call(this, ServiceHealth.computeItems(requests, ctx)) || this;
        _this.requests = requests;
        return _this;
    }
    ServiceHealth.computeItems = function (requests, ctx) {
        var items = [];
        if (ctx.hasSidecar) {
            // Request errors
            var reqErrorsRatio = getRequestErrorsStatus(requests.errorRatio);
            var reqErrorsText = reqErrorsRatio.status === NA ? 'No requests' : reqErrorsRatio.value.toFixed(2) + '%';
            var item = {
                title: 'Error Rate over ' + getName(ctx.rateInterval).toLowerCase(),
                status: reqErrorsRatio.status,
                text: reqErrorsText
            };
            items.push(item);
        }
        else {
            items.push({
                title: 'Error Rate',
                status: NA,
                text: 'No Istio sidecar'
            });
        }
        return items;
    };
    ServiceHealth.fromJson = function (json, ctx) { return new ServiceHealth(json.requests, ctx); };
    return ServiceHealth;
}(Health));
export { ServiceHealth };
var AppHealth = /** @class */ (function (_super) {
    __extends(AppHealth, _super);
    function AppHealth(workloadStatuses, requests, ctx) {
        var _this = _super.call(this, AppHealth.computeItems(workloadStatuses, requests, ctx)) || this;
        _this.requests = requests;
        return _this;
    }
    AppHealth.computeItems = function (workloadStatuses, requests, ctx) {
        var items = [];
        {
            // Pods
            var countInactive_1 = 0;
            var children = workloadStatuses.map(function (d) {
                var status = ratioCheck(d.availableReplicas, d.currentReplicas, d.desiredReplicas);
                if (status === NA) {
                    countInactive_1++;
                }
                return {
                    text: d.name + ': ' + d.availableReplicas + ' / ' + d.desiredReplicas,
                    status: status
                };
            });
            var podsStatus = children.map(function (i) { return i.status; }).reduce(function (prev, cur) { return mergeStatus(prev, cur); }, NA);
            var item = {
                title: 'Pods Status',
                status: podsStatus,
                children: children
            };
            if (countInactive_1 > 0 && countInactive_1 === workloadStatuses.length) {
                // No active deployment => special case for failure
                item.status = FAILURE;
            }
            items.push(item);
        }
        // Request errors
        if (ctx.hasSidecar) {
            var reqIn = getRequestErrorsStatus(requests.inboundErrorRatio);
            var reqOut = getRequestErrorsStatus(requests.outboundErrorRatio);
            var both = mergeStatus(reqIn.status, reqOut.status);
            var item = {
                title: 'Error Rate over ' + getName(ctx.rateInterval).toLowerCase(),
                status: both,
                children: [getRequestErrorsSubItem(reqIn, 'Inbound'), getRequestErrorsSubItem(reqOut, 'Outbound')]
            };
            items.push(item);
        }
        return items;
    };
    AppHealth.fromJson = function (json, ctx) { return new AppHealth(json.workloadStatuses, json.requests, ctx); };
    return AppHealth;
}(Health));
export { AppHealth };
var WorkloadHealth = /** @class */ (function (_super) {
    __extends(WorkloadHealth, _super);
    function WorkloadHealth(workloadStatus, requests, ctx) {
        var _this = _super.call(this, WorkloadHealth.computeItems(workloadStatus, requests, ctx)) || this;
        _this.requests = requests;
        return _this;
    }
    WorkloadHealth.computeItems = function (workloadStatus, requests, ctx) {
        var items = [];
        {
            // Pods
            var podsStatus = ratioCheck(workloadStatus.availableReplicas, workloadStatus.currentReplicas, workloadStatus.desiredReplicas);
            var item = {
                title: 'Pods Status',
                status: podsStatus,
                text: String(workloadStatus.availableReplicas + ' / ' + workloadStatus.desiredReplicas)
            };
            if (podsStatus !== NA && podsStatus !== HEALTHY) {
                item.children = [
                    {
                        status: podsStatus,
                        text: String(workloadStatus.desiredReplicas + ' desired pod' + (workloadStatus.desiredReplicas !== 1 ? 's' : ''))
                    },
                    {
                        status: podsStatus,
                        text: String(workloadStatus.currentReplicas + ' current pod' + (workloadStatus.currentReplicas !== 1 ? 's' : ''))
                    },
                    {
                        status: podsStatus,
                        text: String(workloadStatus.availableReplicas + ' available pod' + (workloadStatus.availableReplicas !== 1 ? 's' : ''))
                    }
                ];
            }
            items.push(item);
        }
        // Request errors
        if (ctx.hasSidecar) {
            var reqIn = getRequestErrorsStatus(requests.inboundErrorRatio);
            var reqOut = getRequestErrorsStatus(requests.outboundErrorRatio);
            var both = mergeStatus(reqIn.status, reqOut.status);
            var item = {
                title: 'Error Rate over ' + getName(ctx.rateInterval).toLowerCase(),
                status: both,
                children: [getRequestErrorsSubItem(reqIn, 'Inbound'), getRequestErrorsSubItem(reqOut, 'Outbound')]
            };
            items.push(item);
        }
        return items;
    };
    WorkloadHealth.fromJson = function (json, ctx) {
        return new WorkloadHealth(json.workloadStatus, json.requests, ctx);
    };
    return WorkloadHealth;
}(Health));
export { WorkloadHealth };
export var healthNotAvailable = function () {
    return new AppHealth([], { errorRatio: -1, inboundErrorRatio: -1, outboundErrorRatio: -1 }, { rateInterval: 60, hasSidecar: true });
};
//# sourceMappingURL=Health.js.map