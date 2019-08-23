package prometheus

import (
	"fmt"
	"strings"
	"sync"

	prom_v1 "github.com/prometheus/client_golang/api/prometheus/v1"
)

// aladdin
func getInfraMetrics(api prom_v1.API, q *InfraOptionMetricsQuery) InfraMetrics {
	// label정보 파싱
	labels, labelsError := buildInfraLabelStrings(q)
	// byLabel정보 파싱
	grouping := strings.Join(q.ByLabels, ",")
	// 실제 쿼리 완성하는 부분
	metrics := fetchAllInfraMetrics(api, q, labels, labelsError, grouping)
	return metrics
}

// aladdin
func buildInfraLabelStrings(q *InfraOptionMetricsQuery) (string, string) {
	labels := []string{}
	if q.Condition != "" {
		labels = append(labels, fmt.Sprintf(`condition="%s"`, q.Condition))
	}
	if q.Status != "" {
		labels = append(labels, fmt.Sprintf(`status="%s"`, q.Status))
	}
	if q.Phase != "" {
		labels = append(labels, fmt.Sprintf(`phase="%s"`, q.Phase))
	}
	if q.Mode != "" {
		labels = append(labels, fmt.Sprintf(`mode="%s"`, q.Mode))
	}
	if q.Id != "" {
		labels = append(labels, fmt.Sprintf(`id="%s"`, q.Id))
	}
	if q.ContainerName != "" {
		labels = append(labels, fmt.Sprintf(`container_name="%s"`, q.ContainerName))
	}
	if q.PodName != "" {
		labels = append(labels, fmt.Sprintf(`pod_name="%s"`, q.PodName))
	}
	full := "{" + strings.Join(labels, ",") + "}"

	labels = append(labels, `response_code=~"[5|4].*"`)
	errors := "{" + strings.Join(labels, ",") + "}"

	return full, errors
}

// aladdin
func fetchAllInfraMetrics(api prom_v1.API, q *InfraOptionMetricsQuery, labels, labelsError, grouping string) InfraMetrics {
	var wg sync.WaitGroup
	fetchLabels := func(p8sFamilyName string, metric **Metric, lbl string) {
		defer wg.Done()
		m := fetchInfraSetRange(api, p8sFamilyName, labels, grouping, &q.InfraMetricsQuery)
		*metric = m
	}

	type resultHolder struct {
		metric     *Metric
		definition infraMetric
	}

	maxResults := len(infraMetrics)
	if len(q.Filters) != 0 {
		maxResults = len(q.Filters)
	}
	results := make([]*resultHolder, maxResults)

	for _, infraMetric := range infraMetrics {
		// if filters is empty, fetch all anyway
		doFetch := len(q.Filters) == 0
		if !doFetch {
			for _, filter := range q.Filters {
				if filter == infraMetric.aladdinName {
					doFetch = true
					break
				}
			}
		}

		if doFetch {
			wg.Add(1)
			result := resultHolder{definition: infraMetric}
			results = append(results, &result)
			if infraMetric.isLabel {
				labelsToUse := infraMetric.labelsToUse(labels, labelsError)
				go fetchLabels(infraMetric.istioName, &result.metric, labelsToUse)
			}
		}
	}
	wg.Wait()

	metrics := make(map[string]*Metric)
	for _, result := range results {
		if result != nil {
			metrics[result.definition.aladdinName] = result.metric
		}
	}
	return InfraMetrics{
		Metrics:    metrics,
	}
}

// aladdin
func fetchInfraSetRange(api prom_v1.API, metricName, labels, grouping string, q *InfraMetricsQuery) *Metric {
	var query string

	if q.RateFunc != "" {
		query = fmt.Sprintf("%s(%s%s[%s])", q.RateFunc, metricName, labels, q.RateInterval)
	} else {
		query = fmt.Sprintf("%s%s", metricName, labels)
	}

	if q.Avg == true {
		if grouping != "" {
			query = fmt.Sprintf("avg (%s) by (%s)", query, grouping)
		}
	} 

	// query = roundSignificant(query, 0.00001)
	return fetchRange(api, query, q.Range)
}