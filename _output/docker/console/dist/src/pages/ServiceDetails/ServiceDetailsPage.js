var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, TabContainer, TabContent, TabPane, Icon } from 'patternfly-react';
import * as API from '../../services/Api';
import * as MessageCenter from '../../utils/MessageCenter';
import IstioMetricsContainer from '../../components/Metrics/IstioMetrics';
import ServiceTraces from './ServiceTraces';
import ServiceInfo from './ServiceInfo';
import { GraphType, NodeType } from '../../types/Graph';
import { MetricsObjectTypes } from '../../types/Metrics';
import { default as DestinationRuleValidator } from './ServiceInfo/types/DestinationRuleValidator';
import BreadcrumbView from '../../components/BreadcrumbView/BreadcrumbView';
import MetricsDuration from '../../components/MetricsOptions/MetricsDuration';
import { fetchTrafficDetails } from '../../helpers/TrafficDetailsHelper';
import TrafficDetails from '../../components/Metrics/TrafficDetails';
import PfTitle from '../../components/Pf/PfTitle';
import { durationSelector } from '../../store/Selectors';
import { PromisesRegistry } from '../../utils/CancelablePromises';
import { MessageType } from '../../types/MessageCenter';
var emptyService = {
    istioSidecar: true,
    service: {
        type: '',
        name: '',
        createdAt: '',
        resourceVersion: '',
        ip: '',
        externalName: ''
    },
    virtualServices: {
        items: [],
        permissions: {
            create: false,
            update: false,
            delete: false
        }
    },
    destinationRules: {
        items: [],
        permissions: {
            create: false,
            update: false,
            delete: false
        }
    },
    validations: {}
};
var ServiceDetails = /** @class */ (function (_super) {
    __extends(ServiceDetails, _super);
    function ServiceDetails(props) {
        var _this = _super.call(this, props) || this;
        _this.promises = new PromisesRegistry();
        _this.doRefresh = function () {
            var currentTab = _this.activeTab('tab', 'info');
            if (_this.state.serviceDetailsInfo === emptyService || currentTab === 'info') {
                _this.setState({ trafficData: null });
                _this.fetchBackend();
            }
            if (currentTab === 'traffic') {
                _this.fetchTrafficData();
            }
        };
        _this.fetchBackend = function () {
            _this.promises.cancelAll();
            _this.promises
                .register('namespaces', API.getNamespaces())
                .then(function (namespacesResponse) {
                var namespaces = namespacesResponse.data;
                _this.promises
                    .registerAll('gateways', namespaces.map(function (ns) { return API.getIstioConfig(ns.name, ['gateways'], false); }))
                    .then(function (responses) {
                    var gatewayList = [];
                    responses.forEach(function (response) {
                        var ns = response.data.namespace;
                        response.data.gateways.forEach(function (gw) {
                            gatewayList = gatewayList.concat(ns.name + '/' + gw.metadata.name);
                        });
                    });
                    _this.setState({
                        gateways: gatewayList
                    });
                })
                    .catch(function (gwError) {
                    MessageCenter.add(API.getErrorMsg('Could not fetch Namespaces list', gwError));
                });
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not fetch Namespaces list', error));
            });
            API.getServiceDetail(_this.props.match.params.namespace, _this.props.match.params.service, true, _this.props.duration)
                .then(function (results) {
                _this.setState({
                    serviceDetailsInfo: results,
                    validations: _this.addFormatValidation(results, results.validations)
                });
                if (results.errorTraces === -1 && _this.props.jaegerUrl !== '') {
                    MessageCenter.add('Could not fetch Traces in the service ' +
                        _this.props.match.params.service +
                        ' in namespace ' +
                        _this.props.match.params.namespace +
                        '. Check if ' +
                        _this.props.jaegerUrl +
                        ' is available.');
                }
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not fetch Service Details', error));
            });
            API.getThreeScaleInfo()
                .then(function (results) {
                _this.setState({
                    threeScaleInfo: results.data
                });
                if (results.data.enabled) {
                    API.getThreeScaleServiceRule(_this.props.match.params.namespace, _this.props.match.params.service)
                        .then(function (result) {
                        _this.setState({
                            threeScaleServiceRule: result.data
                        });
                    })
                        .catch(function (error) {
                        _this.setState({
                            threeScaleServiceRule: undefined
                        });
                        // Only log 500 errors. 404 response is a valid response on this composition case
                        if (error.response && error.response.status >= 500) {
                            MessageCenter.add(API.getErrorMsg('Could not fetch ThreeScaleServiceRule', error));
                        }
                    });
                }
            })
                .catch(function (error) {
                MessageCenter.add(API.getInfoMsg('Could not fetch 3scale info. Turning off 3scale integration.', error), 'default', MessageType.INFO);
            });
        };
        _this.fetchTrafficData = function () {
            var node = {
                service: _this.props.match.params.service,
                namespace: { name: _this.props.match.params.namespace },
                nodeType: NodeType.SERVICE,
                // unneeded
                workload: '',
                app: '',
                version: ''
            };
            var restParams = {
                duration: MetricsDuration.initialDuration() + "s",
                graphType: GraphType.WORKLOAD,
                injectServiceNodes: true,
                appenders: 'deadNode'
            };
            fetchTrafficDetails(node, restParams).then(function (trafficData) {
                if (trafficData !== undefined) {
                    _this.setState({ trafficData: trafficData });
                }
            });
        };
        _this.navigateToJaeger = function () {
            window.open(_this.props.jaegerUrl + ("/search?service=" + _this.props.match.params.service + "." + _this.props.match.params.namespace), '_blank');
        };
        _this.activeTab = function (tabName, whenEmpty) {
            return new URLSearchParams(_this.props.location.search).get(tabName) || whenEmpty;
        };
        _this.handleTrafficDurationChange = function () {
            _this.fetchTrafficData();
        };
        _this.tabChangeHandler = function (tabName) {
            if (tabName === 'traffic' && _this.state.trafficData === null) {
                _this.fetchTrafficData();
            }
        };
        _this.tabSelectHandler = function (tabName, postHandler) {
            return function (tabKey) {
                if (!tabKey) {
                    return;
                }
                var urlParams = new URLSearchParams('');
                var parsedSearch = _this.parseSearch();
                if (parsedSearch.type && parsedSearch.name) {
                    urlParams.set(parsedSearch.type, parsedSearch.name);
                }
                urlParams.set(tabName, tabKey);
                _this.props.history.push(_this.props.location.pathname + '?' + urlParams.toString());
                if (postHandler) {
                    postHandler(tabKey);
                }
            };
        };
        _this.state = {
            serviceDetailsInfo: emptyService,
            gateways: [],
            trafficData: null,
            validations: {},
            threeScaleInfo: {
                enabled: false,
                permissions: {
                    create: false,
                    update: false,
                    delete: false
                }
            }
        };
        return _this;
    }
    ServiceDetails.prototype.componentWillUnmount = function () {
        this.promises.cancelAll();
    };
    ServiceDetails.prototype.servicePageURL = function (parsedSearch) {
        var url = '/namespaces/' + this.props.match.params.namespace + '/services/' + this.props.match.params.service;
        if (parsedSearch && parsedSearch.type) {
            url += "?list=" + parsedSearch.type + "s";
        }
        return url;
    };
    // Helper method to extract search urls with format
    // ?virtualservice=name or ?destinationrule=name
    ServiceDetails.prototype.parseSearch = function () {
        var parsed = {};
        if (this.props.location.search) {
            var firstParams = this.props.location.search
                .split('&')[0]
                .replace('?', '')
                .split('=');
            parsed.type = firstParams[0];
            parsed.name = firstParams[1];
        }
        return {};
    };
    ServiceDetails.prototype.searchValidation = function (parsedSearch) {
        var vals;
        if (this.state.serviceDetailsInfo.validations &&
            parsedSearch.type &&
            parsedSearch.name &&
            this.state.serviceDetailsInfo.validations[parsedSearch.type] &&
            this.state.serviceDetailsInfo.validations[parsedSearch.type][parsedSearch.name]) {
            vals = this.state.serviceDetailsInfo.validations[parsedSearch.type][parsedSearch.name];
        }
        else {
            vals = {};
        }
        return vals;
    };
    ServiceDetails.prototype.componentDidMount = function () {
        this.doRefresh();
    };
    ServiceDetails.prototype.componentDidUpdate = function (prevProps, _prevState) {
        var _this = this;
        if (prevProps.match.params.namespace !== this.props.match.params.namespace ||
            prevProps.match.params.service !== this.props.match.params.service ||
            prevProps.duration !== this.props.duration) {
            this.setState({
                serviceDetailsInfo: emptyService,
                trafficData: null,
                validations: {}
            }, function () { return _this.doRefresh(); });
        }
    };
    ServiceDetails.prototype.addFormatValidation = function (details, validations) {
        details.destinationRules.items.forEach(function (destinationRule, _index, _ary) {
            var dr = new DestinationRuleValidator(destinationRule);
            var formatValidation = dr.formatValidation();
            if (validations.destinationrule) {
                var objectValidations = validations.destinationrule[destinationRule.metadata.name];
                if (formatValidation !== null &&
                    objectValidations.checks &&
                    !objectValidations.checks.some(function (check) { return check.message === formatValidation.message; })) {
                    objectValidations.checks.push(formatValidation);
                    objectValidations.valid = false;
                }
            }
        });
        return validations ? validations : {};
    };
    ServiceDetails.prototype.render = function () {
        var errorTraces = this.state.serviceDetailsInfo.errorTraces;
        return (React.createElement(React.Fragment, null,
            React.createElement(BreadcrumbView, { location: this.props.location }),
            React.createElement(PfTitle, { location: this.props.location, istio: this.state.serviceDetailsInfo.istioSidecar }),
            React.createElement(TabContainer, { id: "basic-tabs", activeKey: this.activeTab('tab', 'info'), onSelect: this.tabSelectHandler('tab', this.tabChangeHandler) },
                React.createElement("div", null,
                    React.createElement(Nav, { bsClass: "nav nav-tabs nav-tabs-pf" },
                        React.createElement(NavItem, { eventKey: "info" }, "Overview"),
                        React.createElement(NavItem, { eventKey: "traffic" }, "Traffic"),
                        React.createElement(NavItem, { eventKey: "metrics" }, "Inbound Metrics"),
                        errorTraces !== undefined &&
                            this.props.jaegerUrl !== '' &&
                            (this.props.jaegerIntegration ? (React.createElement(NavItem, { eventKey: "traces" }, errorTraces > 0 ? (React.createElement(React.Fragment, null,
                                "Error Traces",
                                ' ',
                                React.createElement("span", null,
                                    "(",
                                    errorTraces,
                                    errorTraces > 0 && (React.createElement(Icon, { type: 'fa', name: 'exclamation-circle', style: { color: 'red', marginLeft: '2px' } })),
                                    ")"))) : ('Traces'))) : (React.createElement(NavItem, { onClick: this.navigateToJaeger },
                                React.createElement(React.Fragment, null,
                                    "Traces ",
                                    React.createElement(Icon, { type: 'fa', name: 'external-link' })))))),
                    React.createElement(TabContent, null,
                        React.createElement(TabPane, { eventKey: "info", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(ServiceInfo, { namespace: this.props.match.params.namespace, service: this.props.match.params.service, serviceDetails: this.state.serviceDetailsInfo, gateways: this.state.gateways, validations: this.state.validations, onRefresh: this.doRefresh, activeTab: this.activeTab, onSelectTab: this.tabSelectHandler, threeScaleInfo: this.state.threeScaleInfo, threeScaleServiceRule: this.state.threeScaleServiceRule })),
                        React.createElement(TabPane, { eventKey: "traffic", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(TrafficDetails, { trafficData: this.state.trafficData, itemType: MetricsObjectTypes.SERVICE, namespace: this.props.match.params.namespace, serviceName: this.props.match.params.service, onDurationChanged: this.handleTrafficDurationChange, onRefresh: this.doRefresh })),
                        React.createElement(TabPane, { eventKey: "metrics", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(IstioMetricsContainer, { namespace: this.props.match.params.namespace, object: this.props.match.params.service, objectType: MetricsObjectTypes.SERVICE, direction: 'inbound' })),
                        this.props.jaegerIntegration && (React.createElement(TabPane, { eventKey: "traces", mountOnEnter: true, unmountOnExit: true },
                            React.createElement(ServiceTraces, { namespace: this.props.match.params.namespace, service: this.props.match.params.service, errorTags: errorTraces ? errorTraces > -1 : false }))))))));
    };
    return ServiceDetails;
}(React.Component));
var mapStateToProps = function (state) { return ({
    duration: durationSelector(state),
    jaegerUrl: state.jaegerState ? state.jaegerState.jaegerURL : '',
    jaegerIntegration: state.jaegerState ? state.jaegerState.enableIntegration : false
}); };
var ServiceDetailsPageContainer = connect(mapStateToProps)(ServiceDetails);
export default ServiceDetailsPageContainer;
//# sourceMappingURL=ServiceDetailsPage.js.map