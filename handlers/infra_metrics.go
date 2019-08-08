package handlers

import (
	"errors"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/kiali/kiali/prometheus"
)
// aladdin: InfraOptionMetricsQuery관련 파라미터 파싱
func extractInfraMetricsQueryParams(r *http.Request, q *prometheus.InfraOptionMetricsQuery) error {
	q.FillDefaults()	
	queryParams := r.URL.Query()
	if filters, ok := queryParams["filters[]"]; ok && len(filters) > 0 {
		q.Filters = filters
	}

	condition := queryParams.Get("condition")
	if condition != "" {
		q.Condition = condition
	}
	status := queryParams.Get("status")
	if status != "" {
		q.Status = status
	}
	phase := queryParams.Get("phase")
	if phase != "" {
		q.Phase = phase
	}
	mode := queryParams.Get("mode")
	if mode != "" {
		q.Mode = mode
	}
	id := queryParams.Get("id")
	if id != "" {
		q.Id = id
	}
	containerName := queryParams.Get("containerName")
	if containerName != "" {
		q.ContainerName = containerName
	}
	podName := queryParams.Get("podName")
	if podName != "" {
		q.PodName = podName
	}

	return extractBaseInfraMetricsQueryParams(queryParams, &q.InfraMetricsQuery)
}

// aladdin: InfraMetricsQuery관련 파라미터 파싱
func extractBaseInfraMetricsQueryParams(queryParams url.Values, q *prometheus.InfraMetricsQuery) error {
	if rateIntervals, ok := queryParams["rateInterval"]; ok && len(rateIntervals) > 0 {
		// Only first is taken into consideration
		q.RateInterval = rateIntervals[0]
	}
	if rateFuncs, ok := queryParams["rateFunc"]; ok && len(rateFuncs) > 0 {
		// Only first is taken into consideration
		if rateFuncs[0] != "rate" && rateFuncs[0] != "irate" {
			// Bad request
			return errors.New("bad request, query parameter 'rateFunc' must be either 'rate' or 'irate'")
		}
		q.RateFunc = rateFuncs[0]
	}
	if avgFlags, ok := queryParams["avg"]; ok && len(avgFlags) > 0 {
		if avgFlag, err := strconv.ParseBool(avgFlags[0]); err == nil {
			q.Avg = avgFlag
		} else {
			// Bad request
			return errors.New("bad request, cannot parse query parameter 'avg'")
		}
	}

	if lbls, ok := queryParams["byLabels[]"]; ok && len(lbls) > 0 {
		q.ByLabels = lbls
	}

	// Adjust start & end times to be a multiple of step
	stepInSecs := int64(q.Step.Seconds())
	q.Start = time.Unix((q.Start.Unix()/stepInSecs)*stepInSecs, 0)
	return nil
}