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
import { Button, ExpandCollapse, Wizard } from 'patternfly-react';
import * as API from '../../services/Api';
import * as MessageCenter from '../../utils/MessageCenter';
import MatchingRouting from './MatchingRouting';
import WeightedRouting from './WeightedRouting';
import TrafficPolicyContainer, { ConsistentHashType } from '../../components/IstioWizards/TrafficPolicy';
import { DISABLE, ROUND_ROBIN } from './TrafficPolicy';
import SuspendTraffic from './SuspendTraffic';
import { buildIstioConfig, getInitGateway, getInitHosts, getInitLoadBalancer, getInitRules, getInitSuspendedRoutes, getInitTlsMode, getInitWeights, hasGateway, WIZARD_MATCHING_ROUTING, WIZARD_SUSPEND_TRAFFIC, WIZARD_THREESCALE_INTEGRATION, WIZARD_TITLES, WIZARD_UPDATE_TITLES, WIZARD_WEIGHTED_ROUTING } from './IstioWizardActions';
import { MessageType } from '../../types/MessageCenter';
import ThreeScaleIntegration from './ThreeScaleIntegration';
import { style } from 'typestyle';
import GatewaySelector from './GatewaySelector';
import VirtualServiceHosts from './VirtualServiceHosts';
var expandStyle = style({
    $nest: {
        '.btn': {
            fontSize: '14px'
        }
    }
});
var IstioWizard = /** @class */ (function (_super) {
    __extends(IstioWizard, _super);
    function IstioWizard(props) {
        var _this = _super.call(this, props) || this;
        _this.compareWorkloads = function (prev, current) {
            if (prev.length !== current.length) {
                return false;
            }
            for (var i = 0; i < prev.length; i++) {
                if (!current.includes(prev[i])) {
                    return false;
                }
            }
            return true;
        };
        _this.onClose = function () {
            _this.setState({
                showWizard: false
            });
            _this.props.onClose(false);
        };
        _this.onCreateUpdate = function () {
            var promises = [];
            switch (_this.props.type) {
                case WIZARD_WEIGHTED_ROUTING:
                case WIZARD_MATCHING_ROUTING:
                case WIZARD_SUSPEND_TRAFFIC:
                    var _a = buildIstioConfig(_this.props, _this.state), dr = _a[0], vs = _a[1], gw = _a[2];
                    // Gateway is only created when user has explicit selected this option
                    if (gw) {
                        promises.push(API.createIstioConfigDetail(_this.props.namespace, 'gateways', JSON.stringify(gw)));
                    }
                    if (_this.props.update) {
                        promises.push(API.updateIstioConfigDetail(_this.props.namespace, 'destinationrules', dr.metadata.name, JSON.stringify(dr)));
                        promises.push(API.updateIstioConfigDetail(_this.props.namespace, 'virtualservices', vs.metadata.name, JSON.stringify(vs)));
                        // Note that Gateways are not updated from the Wizard, only the VS hosts/gateways sections are updated
                    }
                    else {
                        promises.push(API.createIstioConfigDetail(_this.props.namespace, 'destinationrules', JSON.stringify(dr)));
                        promises.push(API.createIstioConfigDetail(_this.props.namespace, 'virtualservices', JSON.stringify(vs)));
                    }
                    break;
                case WIZARD_THREESCALE_INTEGRATION:
                    if (_this.state.threeScaleServiceRule) {
                        if (_this.props.update) {
                            promises.push(API.updateThreeScaleServiceRule(_this.props.namespace, _this.props.serviceName, JSON.stringify(_this.state.threeScaleServiceRule)));
                        }
                        else {
                            promises.push(API.createThreeScaleServiceRule(_this.props.namespace, JSON.stringify(_this.state.threeScaleServiceRule)));
                        }
                    }
                    break;
                default:
            }
            // Disable button before promise is completed. Then Wizard is closed.
            _this.setState(function (prevState) {
                prevState.valid.mainWizard = false;
                return {
                    valid: prevState.valid
                };
            });
            Promise.all(promises)
                .then(function (results) {
                if (results.length > 0) {
                    MessageCenter.add('Istio Config ' +
                        (_this.props.update ? 'updated' : 'created') +
                        ' for ' +
                        _this.props.serviceName +
                        ' service.', 'default', MessageType.SUCCESS);
                }
                _this.props.onClose(true);
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not ' + (_this.props.update ? 'update' : 'create') + ' Istio config objects.', error));
                _this.props.onClose(true);
            });
        };
        _this.onVsHosts = function (valid, vsHosts) {
            _this.setState(function (prevState) {
                prevState.valid.vsHosts = valid;
                return {
                    valid: prevState.valid,
                    vsHosts: vsHosts
                };
            });
        };
        _this.onTrafficPolicy = function (valid, trafficPolicy) {
            _this.setState(function (prevState) {
                // At the moment this callback only updates the valid of the loadbalancer
                // tls is always true, but I maintain it on the structure for consistency
                prevState.valid.lb = valid;
                return {
                    valid: prevState.valid,
                    trafficPolicy: trafficPolicy
                };
            });
        };
        _this.onGateway = function (valid, gateway) {
            _this.setState(function (prevState) {
                prevState.valid.gateway = valid;
                return {
                    valid: prevState.valid,
                    gateway: gateway
                };
            });
        };
        _this.onWeightsChange = function (valid, workloads) {
            _this.setState(function (prevState) {
                prevState.valid.mainWizard = valid;
                return {
                    valid: prevState.valid,
                    workloads: workloads
                };
            });
        };
        _this.onRulesChange = function (valid, rules) {
            _this.setState(function (prevState) {
                prevState.valid.mainWizard = valid;
                return {
                    valid: prevState.valid,
                    rules: rules
                };
            });
        };
        _this.onSuspendedChange = function (valid, suspendedRoutes) {
            _this.setState(function (prevState) {
                prevState.valid.mainWizard = valid;
                return {
                    valid: prevState.valid,
                    suspendedRoutes: suspendedRoutes
                };
            });
        };
        _this.onThreeScaleChange = function (valid, threeScaleServiceRule) {
            _this.setState(function (prevState) {
                prevState.valid.mainWizard = valid;
                return {
                    valid: prevState.valid,
                    threeScaleServiceRule: threeScaleServiceRule
                };
            });
        };
        _this.isValid = function (state) {
            return state.valid.mainWizard && state.valid.vsHosts && state.valid.tls && state.valid.lb && state.valid.gateway;
        };
        _this.state = {
            showWizard: false,
            workloads: [],
            rules: [],
            suspendedRoutes: [],
            valid: {
                mainWizard: true,
                vsHosts: true,
                tls: true,
                lb: true,
                gateway: true
            },
            advancedOptionsValid: true,
            vsHosts: [props.serviceName],
            trafficPolicy: {
                tlsModified: false,
                mtlsMode: DISABLE,
                addLoadBalancer: false,
                simpleLB: false,
                consistentHashType: ConsistentHashType.HTTP_HEADER_NAME,
                loadBalancer: {
                    simple: ROUND_ROBIN
                }
            }
        };
        return _this;
    }
    IstioWizard.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.show !== this.props.show || !this.compareWorkloads(prevProps.workloads, this.props.workloads)) {
            var isMainWizardValid = void 0;
            switch (this.props.type) {
                // By default the rule of Weighted routing should be valid
                case WIZARD_WEIGHTED_ROUTING:
                    isMainWizardValid = true;
                    break;
                // By default no rules is a no valid scenario
                case WIZARD_MATCHING_ROUTING:
                    isMainWizardValid = false;
                    break;
                case WIZARD_SUSPEND_TRAFFIC:
                default:
                    isMainWizardValid = true;
                    break;
            }
            var initVsHosts = getInitHosts(this.props.virtualServices);
            var initMtlsMode = getInitTlsMode(this.props.destinationRules);
            var initLoadBalancer = getInitLoadBalancer(this.props.destinationRules);
            var initConsistentHashType = ConsistentHashType.HTTP_HEADER_NAME;
            if (initLoadBalancer && initLoadBalancer.consistentHash) {
                if (initLoadBalancer.consistentHash.httpHeaderName) {
                    initConsistentHashType = ConsistentHashType.HTTP_HEADER_NAME;
                }
                else if (initLoadBalancer.consistentHash.httpCookie) {
                    initConsistentHashType = ConsistentHashType.HTTP_COOKIE;
                }
                else if (initLoadBalancer.consistentHash.useSourceIp) {
                    initConsistentHashType = ConsistentHashType.USE_SOURCE_IP;
                }
            }
            var trafficPolicy = {
                tlsModified: initMtlsMode !== '',
                mtlsMode: initMtlsMode !== '' ? initMtlsMode : DISABLE,
                addLoadBalancer: initLoadBalancer !== undefined,
                simpleLB: initLoadBalancer !== undefined && initLoadBalancer.simple !== undefined,
                consistentHashType: initConsistentHashType,
                loadBalancer: initLoadBalancer
                    ? initLoadBalancer
                    : {
                        simple: ROUND_ROBIN
                    }
            };
            this.setState({
                showWizard: this.props.show,
                workloads: [],
                rules: [],
                valid: {
                    mainWizard: isMainWizardValid,
                    vsHosts: true,
                    tls: true,
                    lb: true,
                    gateway: true
                },
                vsHosts: initVsHosts.length > 1 || (initVsHosts.length === 1 && initVsHosts[0].length > 0)
                    ? initVsHosts
                    : [this.props.serviceName],
                trafficPolicy: trafficPolicy
            });
        }
    };
    IstioWizard.prototype.render = function () {
        var _this = this;
        var _a = getInitGateway(this.props.virtualServices), gatewaySelected = _a[0], isMesh = _a[1];
        return (React.createElement(Wizard, { show: this.state.showWizard, onHide: this.onClose, onKeyPress: function (e) {
                if (e.key === 'Enter' && _this.isValid(_this.state)) {
                    _this.onCreateUpdate();
                }
            } },
            React.createElement(Wizard.Header, { onClose: this.onClose, title: this.props.update ? WIZARD_UPDATE_TITLES[this.props.type] : WIZARD_TITLES[this.props.type] }),
            React.createElement(Wizard.Body, null,
                React.createElement(Wizard.Row, null,
                    React.createElement(Wizard.Main, null,
                        React.createElement(Wizard.Contents, { stepIndex: 0, activeStepIndex: 0 },
                            this.props.type === WIZARD_WEIGHTED_ROUTING && (React.createElement(WeightedRouting, { serviceName: this.props.serviceName, workloads: this.props.workloads, initWeights: getInitWeights(this.props.workloads, this.props.virtualServices), onChange: this.onWeightsChange })),
                            this.props.type === WIZARD_MATCHING_ROUTING && (React.createElement(MatchingRouting, { serviceName: this.props.serviceName, workloads: this.props.workloads, initRules: getInitRules(this.props.workloads, this.props.virtualServices), onChange: this.onRulesChange })),
                            this.props.type === WIZARD_SUSPEND_TRAFFIC && (React.createElement(SuspendTraffic, { serviceName: this.props.serviceName, workloads: this.props.workloads, initSuspendedRoutes: getInitSuspendedRoutes(this.props.workloads, this.props.virtualServices), onChange: this.onSuspendedChange })),
                            this.props.type === WIZARD_THREESCALE_INTEGRATION && (React.createElement(ThreeScaleIntegration, { serviceName: this.props.serviceName, serviceNamespace: this.props.namespace, threeScaleServiceRule: this.props.threeScaleServiceRule || {
                                    serviceName: this.props.serviceName,
                                    serviceNamespace: this.props.namespace,
                                    threeScaleHandlerName: ''
                                }, onChange: this.onThreeScaleChange })),
                            (this.props.type === WIZARD_WEIGHTED_ROUTING ||
                                this.props.type === WIZARD_MATCHING_ROUTING ||
                                this.props.type === WIZARD_SUSPEND_TRAFFIC) && (React.createElement(ExpandCollapse, { className: expandStyle, textCollapsed: "Show Advanced Options", textExpanded: "Hide Advanced Options", expanded: false },
                                React.createElement(VirtualServiceHosts, { vsHosts: this.state.vsHosts, onVsHostsChange: this.onVsHosts }),
                                React.createElement(TrafficPolicyContainer, { mtlsMode: this.state.trafficPolicy.mtlsMode, hasLoadBalancer: this.state.trafficPolicy.addLoadBalancer, loadBalancer: this.state.trafficPolicy.loadBalancer, nsWideStatus: this.props.tlsStatus, onTrafficPolicyChange: this.onTrafficPolicy }),
                                React.createElement(GatewaySelector, { serviceName: this.props.serviceName, hasGateway: hasGateway(this.props.virtualServices), gateway: gatewaySelected, isMesh: isMesh, gateways: this.props.gateways, onGatewayChange: this.onGateway }))))))),
            React.createElement(Wizard.Footer, null,
                React.createElement(Button, { bsStyle: "default", className: "btn-cancel", onClick: this.onClose }, "Cancel"),
                React.createElement(Button, { disabled: !this.isValid(this.state), bsStyle: "primary", onClick: this.onCreateUpdate }, this.props.update ? 'Update' : 'Create'))));
    };
    return IstioWizard;
}(React.Component));
export default IstioWizard;
//# sourceMappingURL=IstioWizard.js.map