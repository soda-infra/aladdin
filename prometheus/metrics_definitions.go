package prometheus

type istioMetric struct {
	kialiName      string
	istioName      string
	isHisto        bool
	useErrorLabels bool
	isLabel				 bool
}

var istioMetrics = []istioMetric{
	istioMetric{
		kialiName: "request_count",
		istioName: "istio_requests_total",
		isHisto:   false,
	},
	istioMetric{
		kialiName:      "request_error_count",
		istioName:      "istio_requests_total",
		isHisto:        false,
		useErrorLabels: true,
	},
	istioMetric{
		kialiName: "request_duration",
		istioName: "istio_request_duration_seconds",
		isHisto:   true,
	},
	istioMetric{
		kialiName: "request_size",
		istioName: "istio_request_bytes",
		isHisto:   true,
	},
	istioMetric{
		kialiName: "response_size",
		istioName: "istio_response_bytes",
		isHisto:   true,
	},
	istioMetric{
		kialiName: "tcp_received",
		istioName: "istio_tcp_received_bytes_total",
		isHisto:   false,
	},
	istioMetric{
		kialiName: "tcp_sent",
		istioName: "istio_tcp_sent_bytes_total",
		isHisto:   false,
	},
}

func (in *istioMetric) labelsToUse(labels, labelsError string) string {
	if in.useErrorLabels {
		return labelsError
	}
	return labels
}


type infraMetric struct {
	aladdinName      string
	istioName      string
	useErrorLabels bool
	isLabel				 bool
}


var infraMetrics = []infraMetric{
	infraMetric{
		aladdinName: "daemonset_labels",
		istioName: "kube_daemonset_labels",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "daemonset_created",
		istioName: "kube_daemonset_created",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "daemonset_unavailable",
		istioName: "kube_daemonset_status_number_unavailable",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "daemonset_status_current_number_scheduled",
		istioName: "kube_daemonset_status_current_number_scheduled",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "daemonset_status_desired_number_scheduled",
		istioName: "kube_daemonset_status_desired_number_scheduled",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "deployment_labels",
		istioName: "kube_deployment_labels",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "deployment_created",
		istioName: "kube_deployment_created",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "deployment_status_replicas",
		istioName: "kube_deployment_status_replicas",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "deployment_status_replicas_available",
		istioName: "kube_deployment_status_replicas_available",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "replicaset_labels",
		istioName: "kube_replicaset_labels",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "replicaset_created",
		istioName: "kube_replicaset_created",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "replicaset_status_replicas",
		istioName: "kube_replicaset_status_replicas",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "replicaset_status_ready_replicas",
		istioName: "kube_replicaset_status_ready_replicas",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "replicaset_status_replicas_available",
		istioName: "kube_deployment_status_replicas_available",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "pod_labels",
		istioName: "kube_pod_labels",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "pod_created",
		istioName: "kube_pod_created",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "pod_status_phase",
		istioName: "kube_pod_status_phase",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_labels",
		istioName: "kube_node_labels",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_created",
		istioName: "kube_node_created",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_status_condition",
		istioName: "kube_node_status_condition",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "namespace_labels",
		istioName: "kube_namespace_labels",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "namespace_created",
		istioName: "kube_namespace_created",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "namespace_status_phase",
		istioName: "kube_namespace_status_phase",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "pod_container_status_running",
		istioName: "kube_pod_container_status_running",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "machine_cpu_cores",
		istioName: "machine_cpu_cores",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "container_memory_usage_bytes",
		istioName: "container_memory_usage_bytes",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "machine_memory_bytes",
		istioName: "machine_memory_bytes",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_status_allocatable_pods",
		istioName: "kube_node_status_allocatable_pods",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "container_cpu_usage_seconds_total",
		istioName: "container_cpu_usage_seconds_total",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "pod_info",
		istioName: "kube_pod_info",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_cpu_seconds_total",
		istioName: "node_cpu_seconds_total",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_memory_MemFree_bytes",
		istioName: "node_memory_MemFree_bytes",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_memory_Cached_bytes",
		istioName: "node_memory_Cached_bytes",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_memory_Buffers_bytes",
		istioName: "node_memory_Buffers_bytes",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_memory_MemTotal_bytes",
		istioName: "node_memory_MemTotal_bytes",
		isLabel: true,
	},
	infraMetric{
		aladdinName: "node_annotations",
		istioName: "kube_node_annotations",
		isLabel: true,
	},
}


func (in *infraMetric) labelsToUse(labels, labelsError string) string {
	if in.useErrorLabels {
		return labelsError
	}
	return labels
}
