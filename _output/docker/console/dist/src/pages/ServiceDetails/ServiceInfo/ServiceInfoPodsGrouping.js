var groupKey = function (pod) {
    return JSON.stringify({
        cb: pod.createdBy.map(function (ref) { return ref.name; }).join(','),
        ic: pod.istioContainers ? pod.istioContainers.map(function (ctnr) { return ctnr.name + ctnr.image; }).join(',') : '',
        iic: pod.istioInitContainers ? pod.istioInitContainers.map(function (ctnr) { return ctnr.name + ctnr.image; }).join(',') : ''
    });
};
var commonPrefix = function (s1, s2) {
    var i = 0;
    while (i < s1.length && i < s2.length && s1.charAt(i) === s2.charAt(i)) {
        i++;
    }
    return s1.substring(0, i);
};
var mergeInGroup = function (group, pod) {
    group.names.push(pod.name);
    // Update common prefix
    group.commonPrefix = commonPrefix(group.commonPrefix, pod.name);
    // Remove any group.commonLabels that is not found in pod
    Object.keys(group.commonLabels).map(function (key) {
        var val = group.commonLabels[key];
        if (!pod.labels || val !== pod.labels[key]) {
            delete group.commonLabels[key];
        }
    });
    // Update start/end timestamps
    var podTimestamp = new Date(pod.createdAt).getTime();
    if (podTimestamp < group.createdAtStart) {
        group.createdAtStart = podTimestamp;
    }
    else if (podTimestamp > group.createdAtEnd) {
        group.createdAtEnd = podTimestamp;
    }
    group.numberOfPods++;
};
export var groupPods = function (pods) {
    var allGroups = new Map();
    pods.forEach(function (pod) {
        var key = groupKey(pod);
        if (allGroups.has(key)) {
            var group = allGroups.get(key);
            mergeInGroup(group, pod);
        }
        else {
            // Make a copy of the labels. This object might be modified later, so do not use the original reference.
            var labels_1 = {};
            if (pod.labels) {
                Object.keys(pod.labels).map(function (k) {
                    labels_1[k] = pod.labels[k];
                });
            }
            var timestamp = new Date(pod.createdAt).getTime();
            allGroups.set(key, {
                commonPrefix: pod.name,
                names: [pod.name],
                commonLabels: labels_1,
                createdAtStart: timestamp,
                createdAtEnd: timestamp,
                createdBy: pod.createdBy,
                istioContainers: pod.istioContainers,
                istioInitContainers: pod.istioInitContainers,
                numberOfPods: 1
            });
        }
    });
    return Array.from(allGroups.values()).sort(function (a, b) { return a.commonPrefix.localeCompare(b.commonPrefix); });
};
//# sourceMappingURL=ServiceInfoPodsGrouping.js.map