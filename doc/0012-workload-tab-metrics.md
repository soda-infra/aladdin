## Workload Card Metrics

### 1. Daemon Sets

* Namespace: `kube_daemonset_labels`
* Name: `kube_daemonset_labels`
* Label: `kube_daemonset_labels`
* Available: `kube_daemonset_status_current_number_scheduled`, `kube_daemonset_status_desired_number_scheduled`
* Create Timestamp: `kube_daemonset_created` 

### 2. Pod

* Namespace: `kube_pod_labels`
* Name: `kube_pod_labels`
* Label: `kube_pod_labels`
* Available: `kube_pod_labels`, `kube_pod_status_phase{phase=Running}`
* Creation Timestamp: `kube_pod_created`

### 3. Replica Sets

* Namespace: `kube_replicaset_labels`
* Name: `kube_replicaset_labels`
* Label: `kube_replicaset_labels`
* Available: `replicaset_status_replicas`, `replicaset_status_replicas_available`
* Creation Timestamp: `kube_replicaset_created`

### 4. Deployments

* Namespace: `kube_deployment_labels`
* Name: `kube_deployment_labels`
* Label: `kube_deployment_labels`
* Available: `kube_deployment_status_replicas`, `kube_deployment_status_replicas_available`
* Creation Timestamp: `kube_deployment_created`
