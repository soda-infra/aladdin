export var emptyWorkload = {
    name: '',
    type: '',
    createdAt: '',
    resourceVersion: '',
    istioSidecar: true,
    labels: {},
    appLabel: false,
    versionLabel: false,
    replicas: 0,
    availableReplicas: 0,
    pods: [],
    services: [],
    runtimes: []
};
export var worloadLink = function (ns, name) {
    return "/namespaces/" + ns + "/workloads/" + name;
};
export var WorkloadIcon = 'bundle';
export var WorkloadType = {
    CronJob: 'CronJob',
    DaemonSet: 'DaemonSet',
    Deployment: 'Deployment',
    DeploymentConfig: 'DeploymentConfig',
    Job: 'Job',
    Pod: 'Pod',
    ReplicaSet: 'ReplicaSet',
    ReplicationController: 'ReplicationController',
    StatefulSet: 'StatefulSet'
};
//# sourceMappingURL=Workload.js.map