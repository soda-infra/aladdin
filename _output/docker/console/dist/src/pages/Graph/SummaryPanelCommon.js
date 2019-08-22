import * as React from 'react';
import { Icon } from 'patternfly-react';
import { NodeType } from '../../types/Graph';
import { healthNotAvailable } from '../../types/Health';
import * as API from '../../services/Api';
import graphUtils from '../../utils/Graphing';
import Label from '../../components/Label/Label';
import { serverConfig } from '../../config/ServerConfig';
import { CyNode } from '../../components/CytoscapeGraph/CytoscapeGraphUtils';
export var NodeMetricType;
(function (NodeMetricType) {
    NodeMetricType[NodeMetricType["APP"] = 1] = "APP";
    NodeMetricType[NodeMetricType["WORKLOAD"] = 2] = "WORKLOAD";
    NodeMetricType[NodeMetricType["SERVICE"] = 3] = "SERVICE";
})(NodeMetricType || (NodeMetricType = {}));
export var shouldRefreshData = function (prevProps, nextProps) {
    return (
    // Verify the time of the last request
    prevProps.queryTime !== nextProps.queryTime ||
        // Check if going from no data to data
        (!prevProps.data.summaryTarget && nextProps.data.summaryTarget) ||
        // Check if the target changed
        prevProps.data.summaryTarget !== nextProps.data.summaryTarget);
};
export var updateHealth = function (summaryTarget, stateSetter) {
    var healthPromise = summaryTarget.data('healthPromise');
    if (healthPromise) {
        stateSetter({ health: undefined, healthLoading: true });
        healthPromise
            .then(function (h) { return stateSetter({ health: h, healthLoading: false }); })
            .catch(function (_err) { return stateSetter({ health: healthNotAvailable(), healthLoading: false }); });
    }
    else {
        stateSetter({ health: undefined, healthLoading: false });
    }
};
export var nodeData = function (node) {
    return {
        app: node.data(CyNode.app),
        hasParent: !!node.data('parent'),
        isInaccessible: node.data(CyNode.isInaccessible),
        isOutsider: node.data(CyNode.isOutside),
        isRoot: node.data(CyNode.isRoot),
        isServiceEntry: node.data(CyNode.isServiceEntry),
        namespace: node.data(CyNode.namespace),
        nodeType: node.data(CyNode.nodeType),
        service: node.data(CyNode.service),
        version: node.data(CyNode.version),
        workload: node.data(CyNode.workload)
    };
};
export var getNodeMetricType = function (data) {
    switch (data.nodeType) {
        case NodeType.APP:
            // treat versioned app like a workload to narrow to the specific version
            return data.workload ? NodeMetricType.WORKLOAD : NodeMetricType.APP;
        case NodeType.SERVICE:
            return NodeMetricType.SERVICE;
        default:
            // treat UNKNOWN as a workload with name="unknown"
            return NodeMetricType.WORKLOAD;
    }
};
export var getNodeMetrics = function (nodeMetricType, node, props, filters, direction, reporter, requestProtocol, quantiles, byLabels) {
    var data = nodeData(node);
    var options = {
        queryTime: props.queryTime,
        duration: props.duration,
        step: props.step,
        rateInterval: props.rateInterval,
        filters: filters,
        quantiles: quantiles,
        byLabels: byLabels,
        direction: direction,
        reporter: reporter,
        requestProtocol: requestProtocol
    };
    switch (nodeMetricType) {
        case NodeMetricType.APP:
            return API.getAppMetrics(data.namespace, data.app, options);
        case NodeMetricType.SERVICE:
            return API.getServiceMetrics(data.namespace, data.service, options);
        case NodeMetricType.WORKLOAD:
            return API.getWorkloadMetrics(data.namespace, data.workload, options);
        default:
            return Promise.reject(new Error("Unknown NodeMetricType: " + nodeMetricType));
    }
};
export var mergeMetricsResponses = function (promises) {
    return Promise.all(promises).then(function (responses) {
        var metrics = {
            metrics: {},
            histograms: {}
        };
        responses.forEach(function (r) {
            Object.keys(r.data.metrics).forEach(function (k) {
                metrics.metrics[k] = r.data.metrics[k];
            });
            Object.keys(r.data.histograms).forEach(function (k) {
                metrics.histograms[k] = r.data.histograms[k];
            });
        });
        return {
            data: metrics
        };
    });
};
export var getDatapoints = function (mg, title, comparator, protocol) {
    var series = [];
    if (mg && mg.matrix) {
        var tsa = mg.matrix;
        if (comparator) {
            for (var i = 0; i < tsa.length; ++i) {
                var ts = tsa[i];
                if (comparator(ts.metric, protocol)) {
                    series.push(ts);
                }
            }
        }
        else {
            series = mg.matrix;
        }
    }
    return graphUtils.toC3Columns(series, title);
};
export var renderLabels = function (data) {
    var hasNamespace = data.nodeType !== NodeType.UNKNOWN && !(data.nodeType === NodeType.SERVICE && data.isServiceEntry);
    var hasVersion = hasNamespace && data.version;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "label-collection", style: { paddingTop: '3px' } },
            hasNamespace && React.createElement(Label, { name: "namespace", value: data.namespace }),
            hasVersion && React.createElement(Label, { name: serverConfig.istioLabels.versionLabelName, value: data.version }))));
};
export var renderNoTraffic = function (protocol) {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement(Icon, { type: "pf", name: "info" }),
            " No ",
            protocol ? protocol : '',
            " traffic logged.")));
};
//# sourceMappingURL=SummaryPanelCommon.js.map