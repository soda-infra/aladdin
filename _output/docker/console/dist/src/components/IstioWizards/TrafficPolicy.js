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
import { Col, ControlLabel, DropdownButton, Form, FormControl, FormGroup, HelpBlock, Icon, MenuItem, Radio, Switch } from 'patternfly-react';
import { MTLSStatuses, nsWideMTLSStatus } from '../../types/TLSStatus';
import { meshWideMTLSStatusSelector } from '../../store/Selectors';
import { style } from 'typestyle';
export var DISABLE = 'DISABLE';
export var ISTIO_MUTUAL = 'ISTIO_MUTUAL';
export var ROUND_ROBIN = 'ROUND_ROBIN';
export var loadBalancerSimple = [ROUND_ROBIN, 'LEAST_CONN', 'RANDOM', 'PASSTHROUGH'];
export var mTLSMode = [DISABLE, ISTIO_MUTUAL, 'SIMPLE'];
export var ConsistentHashType;
(function (ConsistentHashType) {
    ConsistentHashType["HTTP_HEADER_NAME"] = "HTTP_HEADER_NAME";
    ConsistentHashType["HTTP_COOKIE"] = "HTTP_COOKIE";
    ConsistentHashType["USE_SOURCE_IP"] = "USE_SOURCE_IP";
})(ConsistentHashType || (ConsistentHashType = {}));
var tlsIconType = 'pf';
var tlsIconName = 'locked';
var durationRegex = /^[0-9]*(\.[0-9]+)?s?$/;
var TrafficPolicyForm;
(function (TrafficPolicyForm) {
    TrafficPolicyForm[TrafficPolicyForm["TLS"] = 0] = "TLS";
    TrafficPolicyForm[TrafficPolicyForm["LB_SWITCH"] = 1] = "LB_SWITCH";
    TrafficPolicyForm[TrafficPolicyForm["LB_SIMPLE"] = 2] = "LB_SIMPLE";
    TrafficPolicyForm[TrafficPolicyForm["LB_SELECT"] = 3] = "LB_SELECT";
    TrafficPolicyForm[TrafficPolicyForm["LB_CONSISTENT_HASH"] = 4] = "LB_CONSISTENT_HASH";
    TrafficPolicyForm[TrafficPolicyForm["LB_HTTP_HEADER_NAME"] = 5] = "LB_HTTP_HEADER_NAME";
    TrafficPolicyForm[TrafficPolicyForm["LB_HTTP_COOKIE_NAME"] = 6] = "LB_HTTP_COOKIE_NAME";
    TrafficPolicyForm[TrafficPolicyForm["LB_HTTP_COOKIE_TTL"] = 7] = "LB_HTTP_COOKIE_TTL";
})(TrafficPolicyForm || (TrafficPolicyForm = {}));
var labelStyle = style({
    marginTop: 20
});
var TrafficPolicy = /** @class */ (function (_super) {
    __extends(TrafficPolicy, _super);
    function TrafficPolicy(props) {
        var _this = _super.call(this, props) || this;
        _this.isValidDuration = function (ttl) {
            if (ttl.length === 0) {
                return false;
            }
            return ttl.search(durationRegex) === 0;
        };
        _this.isValidCookie = function (cookie) {
            if (!cookie.name ||
                cookie.name.length === 0 ||
                !cookie.ttl ||
                cookie.ttl.length === 0 ||
                !_this.isValidDuration(cookie.ttl)) {
                return false;
            }
            return true;
        };
        _this.isValidLB = function (state) {
            if (!state.addLoadBalancer) {
                return true;
            }
            if (state.simpleLB) {
                // No need to check more as user select the simple LB from a list
                return true;
            }
            // No need to enter to check inside consistentHash
            if (state.consistentHashType === ConsistentHashType.USE_SOURCE_IP) {
                return true;
            }
            if (!state.loadBalancer.consistentHash) {
                return false;
            }
            switch (state.consistentHashType) {
                case ConsistentHashType.HTTP_HEADER_NAME:
                    return state.loadBalancer.consistentHash && state.loadBalancer.consistentHash.httpHeaderName
                        ? state.loadBalancer.consistentHash.httpHeaderName.length > 0
                        : false;
                case ConsistentHashType.HTTP_COOKIE:
                    return state.loadBalancer.consistentHash && state.loadBalancer.consistentHash.httpCookie
                        ? _this.isValidCookie(state.loadBalancer.consistentHash.httpCookie)
                        : false;
                default:
                    return true;
            }
        };
        _this.onFormChange = function (component, value) {
            switch (component) {
                case TrafficPolicyForm.TLS:
                    _this.setState({
                        tlsModified: true,
                        mtlsMode: value
                    }, function () { return _this.props.onTrafficPolicyChange(true, _this.state); });
                    break;
                case TrafficPolicyForm.LB_SWITCH:
                    _this.setState(function (prevState) {
                        return {
                            addLoadBalancer: !prevState.addLoadBalancer
                        };
                    }, function () { return _this.props.onTrafficPolicyChange(_this.isValidLB(_this.state), _this.state); });
                    break;
                case TrafficPolicyForm.LB_SIMPLE:
                    _this.setState(function (prevState) {
                        var loadBalancer = prevState.loadBalancer;
                        loadBalancer.simple = value;
                        return {
                            loadBalancer: loadBalancer
                        };
                    }, function () { return _this.props.onTrafficPolicyChange(_this.isValidLB(_this.state), _this.state); });
                    break;
                case TrafficPolicyForm.LB_SELECT:
                    _this.setState(function (prevState) {
                        // Set a LB simple default value if not present
                        if (!prevState.loadBalancer || !prevState.loadBalancer.simple) {
                            prevState.loadBalancer.simple = ROUND_ROBIN;
                        }
                        return {
                            simpleLB: value === 'true'
                        };
                    }, function () { return _this.props.onTrafficPolicyChange(_this.isValidLB(_this.state), _this.state); });
                    break;
                case TrafficPolicyForm.LB_CONSISTENT_HASH:
                    _this.setState(function (prevState) {
                        var loadBalancer = prevState.loadBalancer;
                        if (!loadBalancer.consistentHash) {
                            loadBalancer.consistentHash = {};
                        }
                        if (ConsistentHashType[value] === ConsistentHashType.USE_SOURCE_IP) {
                            loadBalancer.consistentHash.useSourceIp = true;
                        }
                        return {
                            consistentHashType: ConsistentHashType[value]
                        };
                    }, function () { return _this.props.onTrafficPolicyChange(_this.isValidLB(_this.state), _this.state); });
                    break;
                case TrafficPolicyForm.LB_HTTP_HEADER_NAME:
                    _this.setState(function (prevState) {
                        var loadBalancer = prevState.loadBalancer;
                        if (!loadBalancer.consistentHash) {
                            loadBalancer.consistentHash = {};
                        }
                        loadBalancer.consistentHash.httpHeaderName = value;
                        return {
                            loadBalancer: loadBalancer
                        };
                    }, function () { return _this.props.onTrafficPolicyChange(_this.isValidLB(_this.state), _this.state); });
                    break;
                case TrafficPolicyForm.LB_HTTP_COOKIE_NAME:
                    _this.setState(function (prevState) {
                        var loadBalancer = prevState.loadBalancer;
                        if (!loadBalancer.consistentHash) {
                            loadBalancer.consistentHash = {};
                        }
                        else {
                            if (!loadBalancer.consistentHash.httpCookie) {
                                loadBalancer.consistentHash.httpCookie = {
                                    name: '',
                                    ttl: ''
                                };
                            }
                            else {
                                loadBalancer.consistentHash.httpCookie.name = value;
                            }
                        }
                        return {
                            loadBalancer: loadBalancer
                        };
                    }, function () { return _this.props.onTrafficPolicyChange(_this.isValidLB(_this.state), _this.state); });
                    break;
                case TrafficPolicyForm.LB_HTTP_COOKIE_TTL:
                    _this.setState(function (prevState) {
                        var consistentHash = prevState.loadBalancer ? prevState.loadBalancer.consistentHash : {};
                        if (consistentHash) {
                            if (!consistentHash.httpCookie) {
                                consistentHash.httpCookie = {
                                    name: '',
                                    ttl: ''
                                };
                            }
                            else {
                                consistentHash.httpCookie.ttl = value;
                            }
                        }
                        return {
                            loadBalancer: {
                                consistentHash: consistentHash
                            }
                        };
                    }, function () { return _this.props.onTrafficPolicyChange(_this.isValidLB(_this.state), _this.state); });
                    break;
                default:
                // No default action
            }
        };
        var consistentHashType = ConsistentHashType.HTTP_HEADER_NAME;
        if (props.loadBalancer.consistentHash) {
            if (props.loadBalancer.consistentHash.httpHeaderName) {
                consistentHashType = ConsistentHashType.HTTP_HEADER_NAME;
            }
            else if (props.loadBalancer.consistentHash.httpCookie) {
                consistentHashType = ConsistentHashType.HTTP_COOKIE;
            }
            else if (props.loadBalancer.consistentHash.useSourceIp) {
                consistentHashType = ConsistentHashType.USE_SOURCE_IP;
            }
        }
        _this.state = {
            tlsModified: false,
            mtlsMode: props.mtlsMode,
            addLoadBalancer: props.hasLoadBalancer,
            simpleLB: props.loadBalancer && props.loadBalancer.simple !== undefined && props.loadBalancer.simple !== null,
            consistentHashType: consistentHashType,
            loadBalancer: props.loadBalancer
        };
        return _this;
    }
    TrafficPolicy.prototype.componentDidMount = function () {
        var _this = this;
        var meshWideStatus = this.props.meshWideStatus || MTLSStatuses.NOT_ENABLED;
        var nsWideStatus = this.props.nsWideStatus ? this.props.nsWideStatus.status : MTLSStatuses.NOT_ENABLED;
        var isMtlsEnabled = nsWideMTLSStatus(nsWideStatus, meshWideStatus);
        if (isMtlsEnabled === MTLSStatuses.ENABLED) {
            this.setState({
                tlsModified: true,
                mtlsMode: ISTIO_MUTUAL
            }, function () { return _this.props.onTrafficPolicyChange(true, _this.state); });
        }
        else if (this.props.mtlsMode !== '' && this.props.mtlsMode !== DISABLE) {
            // Don't forget to update the mtlsMode
            this.setState({
                tlsModified: true,
                mtlsMode: this.props.mtlsMode
            }, function () { return _this.props.onTrafficPolicyChange(true, _this.state); });
        }
    };
    TrafficPolicy.prototype.render = function () {
        var _this = this;
        var tlsMenuItems = mTLSMode.map(function (mode) { return (React.createElement(MenuItem, { key: mode, eventKey: mode, active: mode === _this.props.mtlsMode }, mode)); });
        var lbMenuItems = loadBalancerSimple.map(function (simple) {
            var simpleLoadBalancer = _this.state.loadBalancer && _this.state.loadBalancer.simple ? _this.state.loadBalancer.simple : '';
            return (React.createElement(MenuItem, { key: simple, eventKey: simple, active: simple === simpleLoadBalancer }, simple));
        });
        var isValidLB = this.isValidLB(this.state);
        return (React.createElement(Form, { horizontal: true, onSubmit: function (e) { return e.preventDefault(); } },
            React.createElement(FormGroup, { controlId: "tls", disabled: false },
                React.createElement(Col, { componentClass: ControlLabel, sm: 3 },
                    React.createElement(Icon, { type: tlsIconType, name: tlsIconName }),
                    " TLS"),
                React.createElement(Col, { sm: 9 },
                    React.createElement(DropdownButton, { bsStyle: "default", title: this.state.mtlsMode, id: "trafficPolicy-tls", onSelect: function (mtlsMode) { return _this.onFormChange(TrafficPolicyForm.TLS, mtlsMode); } }, tlsMenuItems))),
            React.createElement(FormGroup, { controlId: "loadBalancerSwitch", disabled: false },
                React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "Add LoadBalancer"),
                React.createElement(Col, { sm: 9 },
                    React.createElement(Switch, { bsSize: "normal", title: "normal", id: "loadbalanacer-form", animate: false, onChange: function () { return _this.onFormChange(TrafficPolicyForm.LB_SWITCH, ''); }, defaultValue: this.state.addLoadBalancer }))),
            this.state.addLoadBalancer && (React.createElement(React.Fragment, null,
                React.createElement(FormGroup, null,
                    React.createElement(Col, { sm: 3 }),
                    React.createElement(Col, { sm: 9 },
                        React.createElement(Radio, { name: "selectLBType", className: labelStyle, disabled: !this.state.addLoadBalancer, checked: this.state.simpleLB, onChange: function () { return _this.onFormChange(TrafficPolicyForm.LB_SELECT, 'true'); }, inline: true }, "Simple"),
                        React.createElement(Radio, { name: "selectLBType", className: labelStyle, disabled: !this.state.addLoadBalancer, checked: !this.state.simpleLB, onChange: function () { return _this.onFormChange(TrafficPolicyForm.LB_SELECT, 'false'); }, inline: true }, "Consistent Hash"))),
                this.state.simpleLB && (React.createElement(FormGroup, { controlId: "loadBalancer", disabled: false },
                    React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "LoadBalancer"),
                    React.createElement(Col, { sm: 9 },
                        React.createElement(DropdownButton, { bsStyle: "default", title: this.state.loadBalancer.simple, id: "trafficPolicy-lb", onSelect: function (simple) { return _this.onFormChange(TrafficPolicyForm.LB_SIMPLE, simple); } }, lbMenuItems)))),
                !this.state.simpleLB && (React.createElement(React.Fragment, null,
                    React.createElement(FormGroup, null,
                        React.createElement(Col, { sm: 3 }),
                        React.createElement(Col, { sm: 9 },
                            React.createElement(Radio, { name: "selectConsistentHashType", className: labelStyle, disabled: !this.state.addLoadBalancer, checked: this.state.consistentHashType === ConsistentHashType.HTTP_HEADER_NAME, onChange: function () {
                                    return _this.onFormChange(TrafficPolicyForm.LB_CONSISTENT_HASH, ConsistentHashType.HTTP_HEADER_NAME);
                                }, inline: true }, "HTTP Header Name"),
                            React.createElement(Radio, { name: "selectConsistentHashType", className: labelStyle, disabled: !this.state.addLoadBalancer, checked: this.state.consistentHashType === ConsistentHashType.HTTP_COOKIE, onChange: function () {
                                    return _this.onFormChange(TrafficPolicyForm.LB_CONSISTENT_HASH, ConsistentHashType.HTTP_COOKIE);
                                }, inline: true }, "HTTP Cookie"),
                            React.createElement(Radio, { name: "selectConsistentHashType", className: labelStyle, disabled: !this.state.addLoadBalancer, checked: this.state.consistentHashType === ConsistentHashType.USE_SOURCE_IP, onChange: function () {
                                    return _this.onFormChange(TrafficPolicyForm.LB_CONSISTENT_HASH, ConsistentHashType.USE_SOURCE_IP);
                                }, inline: true }, "Source IP"))),
                    this.state.consistentHashType === ConsistentHashType.HTTP_HEADER_NAME && (React.createElement(FormGroup, { controlId: "httpHeaderName", disabled: !this.state.addLoadBalancer, validationState: isValidLB ? null : 'error' },
                        React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "HTTP Header Name"),
                        React.createElement(Col, { sm: 9 },
                            React.createElement(FormControl, { type: "text", disabled: !this.state.addLoadBalancer, value: this.state.loadBalancer.consistentHash
                                    ? this.state.loadBalancer.consistentHash.httpHeaderName
                                    : '', onChange: function (e) { return _this.onFormChange(TrafficPolicyForm.LB_HTTP_HEADER_NAME, e.target.value); } })))),
                    this.state.consistentHashType === ConsistentHashType.HTTP_COOKIE && (React.createElement(React.Fragment, null,
                        React.createElement(FormGroup, { controlId: "httpCookieName", disabled: !this.state.addLoadBalancer, validationState: isValidLB ? null : 'error' },
                            React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "HTTP Cookie Name"),
                            React.createElement(Col, { sm: 9 },
                                React.createElement(FormControl, { type: "text", disabled: !this.state.addLoadBalancer, value: this.state.loadBalancer.consistentHash && this.state.loadBalancer.consistentHash.httpCookie
                                        ? this.state.loadBalancer.consistentHash.httpCookie.name
                                        : '', onChange: function (e) { return _this.onFormChange(TrafficPolicyForm.LB_HTTP_COOKIE_NAME, e.target.value); } }))),
                        React.createElement(FormGroup, { controlId: "httpCookieTtl", disabled: !this.state.addLoadBalancer, validationState: isValidLB ? null : 'error' },
                            React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "HTTP Cookie TTL"),
                            React.createElement(Col, { sm: 9 },
                                React.createElement(FormControl, { type: "text", disabled: !this.state.addLoadBalancer, value: this.state.loadBalancer.consistentHash && this.state.loadBalancer.consistentHash.httpCookie
                                        ? this.state.loadBalancer.consistentHash.httpCookie.ttl
                                        : '', onChange: function (e) { return _this.onFormChange(TrafficPolicyForm.LB_HTTP_COOKIE_TTL, e.target.value); } }),
                                React.createElement(HelpBlock, null, "TTL is expressed in nanoseconds (i.e. 1000, 2000, etc) or seconds (i.e. 10s, 1.5s, etc).")))))))))));
    };
    return TrafficPolicy;
}(React.Component));
var mapStateToProps = function (state) { return ({
    meshWideStatus: meshWideMTLSStatusSelector(state)
}); };
var TraffiPolicyContainer = connect(mapStateToProps)(TrafficPolicy);
export default TraffiPolicyContainer;
//# sourceMappingURL=TrafficPolicy.js.map