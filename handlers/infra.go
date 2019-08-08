package handlers

import (
	"net/http"

	"github.com/kiali/kiali/log"
	"github.com/kiali/kiali/prometheus"
)

// aladdin
// InfraDashboard is the API handler to fetch Istio dashboard, related to a single service
func InfraDashboard(w http.ResponseWriter, r *http.Request) {
	// prometheus에 client 등록
	prom, err := defaultPromClientSupplier()
	if err != nil {
		log.Error(err)
		RespondWithError(w, http.StatusServiceUnavailable, "Prometheus client error: "+err.Error())
	}

	// params를 types.go 파일의 InfraOptionMetricsQuery형태로 초기화
	params := prometheus.InfraOptionMetricsQuery{}
	// 실제 query의 param 정보를 파싱해서 params에 넣음
	error := extractInfraMetricsQueryParams(r, &params)
	if error != nil {
		RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// params의 정보를 가지고 프로메테우스에 보낼 query를 만듬
	metrics := prom.GetInfraMetrics(&params)
	RespondWithJSON(w, http.StatusOK, metrics)
}
