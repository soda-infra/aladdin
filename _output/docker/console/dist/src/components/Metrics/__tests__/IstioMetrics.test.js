var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import { shallowToJson } from 'enzyme-to-json';
import IstioMetrics from '../IstioMetrics';
import * as API from '../../../services/Api';
import { store } from '../../../store/ConfigStore';
import { MetricsObjectTypes } from '../../../types/Metrics';
window.SVGPathElement = function (a) { return a; };
var mounted;
var mockAPIToPromise = function (func, obj) {
    return new Promise(function (resolve, reject) {
        jest.spyOn(API, func).mockImplementation(function () {
            return new Promise(function (r) {
                r({ data: obj });
                setTimeout(function () {
                    try {
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1);
            });
        });
    });
};
var mockServiceDashboard = function (dashboard) {
    return mockAPIToPromise('getServiceDashboard', dashboard);
};
var mockWorkloadDashboard = function (dashboard) {
    return mockAPIToPromise('getWorkloadDashboard', dashboard);
};
var mockGrafanaInfo = function (info) {
    return mockAPIToPromise('getGrafanaInfo', info);
};
var createMetricChart = function (name) {
    return {
        name: name,
        unit: 'B',
        spans: 12,
        metric: [
            {
                labelSet: { __name__: name },
                values: [[1111, 5], [2222, 10]],
                name: ''
            }
        ]
    };
};
var createHistogramChart = function (name) {
    return {
        name: name,
        unit: 'B',
        spans: 12,
        histogram: {
            average: [
                {
                    labelSet: { __name__: name },
                    values: [[1111, 10], [2222, 11]],
                    name: name
                }
            ],
            median: [
                {
                    labelSet: { __name__: name },
                    values: [[1111, 20], [2222, 21]],
                    name: name
                }
            ],
            percentile95: [
                {
                    labelSet: { __name__: name },
                    values: [[1111, 30], [2222, 31]],
                    name: name
                }
            ],
            percentile99: [
                {
                    labelSet: { __name__: name },
                    values: [[1111, 40], [2222, 41]],
                    name: name
                }
            ]
        }
    };
};
describe('Metrics for a service', function () {
    beforeEach(function () {
        mounted = null;
    });
    afterEach(function () {
        if (mounted) {
            mounted.unmount();
        }
    });
    it('renders initial layout', function () {
        mockGrafanaInfo({});
        var wrapper = shallow(React.createElement(Provider, { store: store },
            React.createElement(MemoryRouter, null,
                React.createElement(Route, { render: function (props) { return (React.createElement(IstioMetrics, __assign({}, props, { namespace: "ns", object: "svc", objectType: MetricsObjectTypes.SERVICE, direction: 'inbound', grafanaInfo: {
                            url: 'http://172.30.139.113:3000',
                            serviceDashboardPath: '/dashboard/db/istio-dashboard',
                            workloadDashboardPath: '/dashboard/db/istio-dashboard'
                        } }))); } }))));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    it('mounts and loads empty metrics', function (done) {
        var allMocksDone = [
            mockServiceDashboard({ title: 'foo', aggregations: [], charts: [] })
                .then(function () {
                mounted.update();
                expect(mounted.find('.card-pf')).toHaveLength(1);
                mounted.find('.card-pf').forEach(function (pfCard) { return expect(pfCard.children().length === 0); });
            })
                .catch(function (err) { return done.fail(err); })
        ];
        Promise.all(allMocksDone).then(function () { return done(); });
        mounted = mount(React.createElement(Provider, { store: store },
            React.createElement(MemoryRouter, null,
                React.createElement(Route, { render: function (props) { return (React.createElement(IstioMetrics, __assign({}, props, { namespace: "ns", object: "svc", objectType: MetricsObjectTypes.SERVICE, direction: 'inbound', grafanaInfo: {
                            url: 'http://172.30.139.113:3000',
                            serviceDashboardPath: '/dashboard/db/istio-dashboard',
                            workloadDashboardPath: '/dashboard/db/istio-dashboard'
                        } }))); } }))));
    });
    it('mounts and loads full metrics', function (done) {
        var allMocksDone = [
            mockServiceDashboard({
                title: 'foo',
                aggregations: [],
                charts: [
                    createMetricChart('m1'),
                    createHistogramChart('m3'),
                    createHistogramChart('m5'),
                    createHistogramChart('m7')
                ]
            })
                .then(function () {
                mounted.update();
                expect(mounted.find('LineChart')).toHaveLength(4);
            })
                .catch(function (err) { return done.fail(err); })
        ];
        Promise.all(allMocksDone).then(function () { return done(); });
        mounted = mount(React.createElement(Provider, { store: store },
            React.createElement(MemoryRouter, null,
                React.createElement(Route, { render: function (props) { return (React.createElement(IstioMetrics, __assign({}, props, { namespace: "ns", object: "svc", objectType: MetricsObjectTypes.SERVICE, direction: 'inbound', grafanaInfo: {
                            url: 'http://172.30.139.113:3000',
                            serviceDashboardPath: '/dashboard/db/istio-dashboard',
                            workloadDashboardPath: '/dashboard/db/istio-dashboard'
                        } }))); } }))));
    }, 10000); // Increase timeout for this test
});
describe('Inbound Metrics for a workload', function () {
    beforeEach(function () {
        mounted = null;
    });
    afterEach(function () {
        if (mounted) {
            mounted.unmount();
        }
    });
    it('renders initial layout', function () {
        var wrapper = shallow(React.createElement(Provider, { store: store },
            React.createElement(Route, { render: function (props) { return (React.createElement(IstioMetrics, __assign({}, props, { namespace: "ns", object: "svc", objectType: MetricsObjectTypes.WORKLOAD, direction: 'inbound', grafanaInfo: {
                        url: 'http://172.30.139.113:3000',
                        serviceDashboardPath: '/dashboard/db/istio-dashboard',
                        workloadDashboardPath: '/dashboard/db/istio-dashboard'
                    } }))); } })));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    it('mounts and loads empty metrics', function (done) {
        var allMocksDone = [
            mockWorkloadDashboard({ title: 'foo', aggregations: [], charts: [] })
                .then(function () {
                mounted.update();
                expect(mounted.find('.card-pf')).toHaveLength(1);
                mounted.find('.card-pf').forEach(function (pfCard) { return expect(pfCard.children().length === 0); });
            })
                .catch(function (err) { return done.fail(err); })
        ];
        Promise.all(allMocksDone).then(function () { return done(); });
        mounted = mount(React.createElement(Provider, { store: store },
            React.createElement(MemoryRouter, null,
                React.createElement(Route, { render: function (props) { return (React.createElement(IstioMetrics, __assign({}, props, { namespace: "ns", object: "svc", objectType: MetricsObjectTypes.WORKLOAD, direction: 'inbound', grafanaInfo: {
                            url: 'http://172.30.139.113:3000',
                            serviceDashboardPath: '/dashboard/db/istio-dashboard',
                            workloadDashboardPath: '/dashboard/db/istio-dashboard'
                        } }))); } }))));
    });
    it('mounts and loads full metrics', function (done) {
        var allMocksDone = [
            mockWorkloadDashboard({
                title: 'foo',
                aggregations: [],
                charts: [
                    createMetricChart('m1'),
                    createHistogramChart('m3'),
                    createHistogramChart('m5'),
                    createHistogramChart('m7')
                ]
            })
                .then(function () {
                mounted.update();
                expect(mounted.find('LineChart')).toHaveLength(4);
            })
                .catch(function (err) { return done.fail(err); })
        ];
        Promise.all(allMocksDone).then(function () { return done(); });
        mounted = mount(React.createElement(Provider, { store: store },
            React.createElement(MemoryRouter, null,
                React.createElement(Route, { render: function (props) { return (React.createElement(IstioMetrics, __assign({}, props, { namespace: "ns", object: "svc", objectType: MetricsObjectTypes.WORKLOAD, direction: 'inbound', grafanaInfo: {
                            url: 'http://172.30.139.113:3000',
                            serviceDashboardPath: '/dashboard/db/istio-dashboard',
                            workloadDashboardPath: '/dashboard/db/istio-dashboard'
                        } }))); } }))));
    }, 10000); // Increase timeout for this test
});
//# sourceMappingURL=IstioMetrics.test.js.map