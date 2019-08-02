## Overview Tab Metrics

### 1. Nodes

* All Nodes: `sum(kube_node_labels)`

  ```
  /api/infra?filters[]=node_labels
  ```

* Current Nodes: `sum(kube_node_status_condition{condition="Ready", status="true"})`

  ```
  /api/infra?filters[]=node_status_condition&contion=Ready&status=true
  ```

  

### 2. Namespaces

* All Namespaces: `sum(kube_namespace_labels)`

  ```
  /api/infra?filters[]=namespace_labels
  ```

* Current Namespaces: `sum(kube_namespace_status_phase{phase="Active"})`

  ```
  /api/infra?filters[]=namespace_status_phase&phase=Active
  ```

  

---

### 3. Docker containers

* Current Docker containers: `sum(kube_pod_container_status_running)`

  ```
  /api/infra?filters[]=pod_container_status_running
  ```

  

---

### 4. Node Top CPU

* `sort_desc(100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[1m])) by (instance)  * 100))`

  ```avg(irate(node_cpu_seconds_total{mode="idle"}[1m])) by (instance) ```부분만 API로 처리함 (계산과 정렬작업은 UI에서 수행할 것)

  ```
  /api/infra?filters[]=node_cpu_seconds_total&rateFunc=irate&mode=idle&avg=true&byLabels[]=instance
  ```

  

### 5. Node Top Memory

* `sort_desc(100 - (node_memory_MemFree_bytes + node_memory_Cached_bytes + node_memory_Buffers_bytes) / node_memory_MemTotal_bytes * 100)`

  ```
  /api/infra?filters[]=node_memory_MemFree_bytes
  /api/infra?filters[]=node_memory_Cached_bytes
  /api/infra?filters[]=node_memory_Buffers_bytes
  /api/infra?filters[]=node_memory_MemTotal_bytes
  ```

  

---

## Dashboard Tab Metrics

### 1. Daemon Sets

* All Daemon Sets: `sum(kube_daemonset_labels)`

  ```
  /api/infra?filters[]=daemonset_labels
  ```

* Current Daemon Sets: `sum(kube_daemonset_status_number_unavailable) == 0`

  ```
  /api/infra?filters[]=daemonset_unavailable
  ```

*   kube_daemonset_labels 중 kube_daemonset_status_number_unavailable이 0인 daemonset의 개수를 current로 한다.

```
desired := kube_daemonset_labels
current := 0

for item in desired:
    if item.kube_daemonset_status_number_unavailable == 0:
        current++
```



### 2. Deployments

* All Deployments: `sum(kube_deployment_labels)`

  ```
  /api/infra?filters[]=deployment_labels
  ```

* Current Deployments: `sum(kube_deployment_status_replicas) == sum(kube_deployment_status_replicas_available)`

  ```
  /api/infra?filters[]=deployment_status_replicas_available
  ```

* kube_deployment_labels 중 kube_deployment_status_replicas와 kube_deployment_status_replicas_available가 같은 deployment의 개수를 current로 한다.

```
desired := kube_deployment_labels
current := 0

for item in desired:
  if item.kube_deployment_status_replicas == 		
                        		item.kube_deployment_status_replicas_available:
    current++
```



### 3. Replica Sets

* All Replica Sets: `sum(kube_replicaset_labels)`

  ```
  /api/infra?filters[]=replicaset_labels
  ```

* Current Replica Sets: `sum(kube_replicaset_status_replicas) == sum(kube_deployment_status_replicas_available) or 0`

  ```
  /api/infra?filters[]=replicaset_status_replicas
  /api/infra?filters[]=replicaset_status_replicas_available
  ```

* kube_replicaset_labels 중 kube_replicaset_status_replicas이 0이거나 kube_deployment_status_replicas_available인 replicaset의 개수를 current로 한다.

```
desired := kube_replicaset_labels
current := 0

for item in desired:
  if item.kube_replicaset_status_replicas == 0 || 		
            item.kube_replicaset_status_replicas == 
                        item.kube_deployment_status_replicas_available:
    current++
```



### 4. Pods

* All Pods: `sum(kube_pod_labels)`

  ```
  /api/infra?filters[]=pod_labels
  ```

* Current Pods: `sum(kube_pod_status_phase{phase="Running"})`

  ```
  /api/infra?filters[]=pod_status_phase&phase=Running
  ```

* kube_pod_labels 중 kube_pod_status_phase이 Running인 pod의 개수를 current로 한다.

```
desired := kube_pod_labels
current := 0

for item in desired:
  if kube_pod_status_phase == 'Running':
    current++
```



---
### 5. Cluster CPU Utilization

* CPU Usage(%): ```(Used / Total) * 100```
  
  * Reference : `https://stackoverflow.com/questions/40327062/how-to-calculate-containers-cpu-usage-in-kubernetes-with-prometheus-as-monitori`
  
* Used: `sum (rate (container_cpu_usage_seconds_total{id="/"}[1m]))`

  ```
  /api/infra?filters[]=container_cpu_usage_seconds_total&id=/&rateFunc=rate
  ```

* Total: `sum (machine_cpu_cores)` 

  ```
  /api/infra?filters[]=machine_cpu_cores
  ```

  

---

### 6. Cluster Memory Utilization

* Memory Usage(%): ```(Used / Total) * 100```

* Used: `sum(rate(container_memory_usage_bytes[1m]))` - 단위 byte

  ```
  /api/infra?filters[]=container_memory_usage_bytes&rateFunc=rate
  ```

* Total: `sum(machine_memory_bytes) ` - 단위 byte

  ```
  /api/infra?filters[]=machine_memory_bytes
  ```

  

---

### 7. Cluster Pod Utilization

* Pod Usage(%): ````(Used / Total) * 100```

* Used: `sum(kube_pod_status_phase{phase="Running"})`

  ```
  /api/infra?filters[]=pod_status_phase&phase=Running
  ```

* Total: `sum(kube_node_status_allocatable_pods)`

  ```
  /api/infra?filters[]=node_status_allocatable_pods
  ```

  

---

### 8. Pods Top CPU

* 클러스터 내의 파드별 사용량을 순위로 보여준다.

* `sort_desc(avg (rate(container_cpu_usage_seconds_total{container_name!="POD",pod_name!=""}[1m]))) by (pod_name) * 100)`

  ```avg (rate(container_cpu_usage_seconds_total{}[1m]))) by (pod_name)``` 부분만 API로 처리함(필터링과 정렬작업은 UI에서 수행할 것)

  ```
  /api/infra?filters[]=container_cpu_usage_seconds_total&rateFrunc=rate&avg=true&byLabels[]=pod_name
  ```

  

### 9. Pods Top Memory

* 클러스터 내의 파드별 사용량을 순위로 보여준다.

* `sort_desc((avg (container_memory_usage_bytes{id!='/',pod_name!=''}) / 24831234048) by (pod_name) *100)`

* `24831234048` is `sum(machine_memory_bytes)`

* `sum(machine_memory_bytes)`를 위의 쿼리 안에 넣으면 계산이 안돼서 일단 쿼리 2개 보내서 값을 구하기로 함
  
  * 1번째 쿼리 : `(avg (container_memory_usage_bytes{id!='/',pod_name!=''}) by (pod_name))`
  
    (필터링과 정렬작업은 UI에서 수행할 것)
  
  * 2번째 쿼리 : `sum(machine_memory_bytes)`
  
  ```
  /api/infra?filters[]=container_memory_usage_bytes&avg=true&byLabels[]=pod_name
  /api/infra?filters[]=machine_memory_bytes
  ```
  
  