package prometheus

import (
	"time"

	prom_v1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/prometheus/common/model"
)

// BaseMetricsQuery holds common parameters for all kinds of queries
type BaseMetricsQuery struct {
	prom_v1.Range
	RateInterval string
	RateFunc     string
	Quantiles    []string
	Avg          bool
	ByLabels     []string
}

// FillDefaults fills the struct with default parameters
func (q *BaseMetricsQuery) fillDefaults() {
	q.End = time.Now()
	q.Start = q.End.Add(-30 * time.Minute)
	q.Step = 15 * time.Second
	q.RateInterval = "1m"
	q.RateFunc = "rate"
	q.Avg = true
}

// IstioMetricsQuery holds query parameters for a typical metrics query
type IstioMetricsQuery struct {
	BaseMetricsQuery
	Filters         []string
	Namespace       string
	App             string
	Workload        string
	Service         string
	Direction       string // outbound | inbound
	RequestProtocol string // e.g. http | grpc
	Reporter        string // source | destination, defaults to source if not provided
}

// FillDefaults fills the struct with default parameters
func (q *IstioMetricsQuery) FillDefaults() {
	q.BaseMetricsQuery.fillDefaults()
	q.Reporter = "source"
	q.Direction = "outbound"
}

// aladdin: 인프라 쿼리를 위해(함수정보)
// InfraMetricsQuery holds common parameters for all kinds of queries
type InfraMetricsQuery struct {
	prom_v1.Range
	RateInterval string
	RateFunc     string
	Avg          bool
	ByLabels     []string
}

// aladdin: InfraMetricsQuery의 default
// FillDefaults fills the struct with default parameters
func (q *InfraMetricsQuery) fillDefaults() {
	q.End = time.Now()
	q.Start = q.End.Add(-30 * time.Minute)
	q.Step = 15 * time.Second
	q.RateInterval = "1m"
	q.Avg = false
}

// aladdin: 인프라 쿼리를 위해(필터링정보)
// InfraOptionMetricsQuery holds query parameters for a infra metrics query
type InfraOptionMetricsQuery struct {
	InfraMetricsQuery
	Filters         []string
	Condition		string
	Status			string
	Phase			string
	Mode 			string
	Id 				string
	ContainerName	string
	PodName			string
}

// aladdin: InfraOptionMetricsQuery default
// FillDefaults fills the struct with default parameters
func (q *InfraOptionMetricsQuery) FillDefaults() {
	q.InfraMetricsQuery.fillDefaults()
}

// aladdin
// Metrics contains all simple metrics
type InfraMetrics struct {
	Metrics    map[string]*Metric   `json:"metrics"`
}

// Metrics contains all simple metrics and histograms data
type Metrics struct {
	Metrics    map[string]*Metric   `json:"metrics"`
	Histograms map[string]Histogram `json:"histograms"`
}

// Metric holds the Prometheus Matrix model, which contains one or more time series (depending on grouping)
type Metric struct {
	Matrix model.Matrix `json:"matrix"`
	err    error
}

// Histogram contains Metric objects for several histogram-kind statistics
type Histogram = map[string]*Metric
