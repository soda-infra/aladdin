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
import { Button, Col, ControlLabel, DropdownKebab, ExpandCollapse, Form, FormControl, FormGroup, HelpBlock, ListView, ListViewIcon, ListViewItem, MenuItem, OverlayTrigger, Tooltip, Row } from 'patternfly-react';
import { style } from 'typestyle';
import * as API from '../../services/Api';
import * as MessageCenter from '../../utils/MessageCenter';
var expandStyle = style({
    marginTop: 20,
    $nest: {
        '.btn': {
            fontSize: '14px'
        }
    }
});
var createHandlerStyle = style({
    marginTop: 20
});
var headingStyle = style({
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});
var k8sRegExpName = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[-a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
var ThreeScaleIntegration = /** @class */ (function (_super) {
    __extends(ThreeScaleIntegration, _super);
    function ThreeScaleIntegration(props) {
        var _this = _super.call(this, props) || this;
        _this.fetchHandlers = function () {
            API.getThreeScaleHandlers()
                .then(function (results) {
                _this.setState(function (prevState) {
                    var handlerName = prevState.threeScaleServiceRule.threeScaleHandlerName;
                    if (handlerName === '' && results.data.length > 0) {
                        handlerName = results.data[0].name;
                    }
                    return {
                        threeScaleHandlers: results.data.map(function (h) {
                            return {
                                name: h.name,
                                serviceId: h.serviceId,
                                accessToken: h.accessToken,
                                systemUrl: h.systemUrl,
                                modified: false
                            };
                        }),
                        threeScaleServiceRule: {
                            serviceName: prevState.threeScaleServiceRule.serviceName,
                            serviceNamespace: prevState.threeScaleServiceRule.serviceNamespace,
                            threeScaleHandlerName: handlerName
                        }
                    };
                }, function () { return _this.props.onChange(_this.state.threeScaleHandlers.length > 0, _this.state.threeScaleServiceRule); });
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not fetch ThreeScaleHandlers', error));
            });
        };
        _this.onUpdateHandler = function (id) {
            var handler = _this.state.threeScaleHandlers[id];
            var patch = {
                name: handler.name,
                serviceId: handler.serviceId,
                accessToken: handler.accessToken,
                systemUrl: handler.systemUrl
            };
            API.updateThreeScaleHandler(_this.state.threeScaleHandlers[id].name, JSON.stringify(patch))
                .then(function (results) {
                _this.setState(function (prevState) {
                    return {
                        threeScaleHandlers: results.data.map(function (h) {
                            return {
                                name: h.name,
                                serviceId: h.serviceId,
                                accessToken: h.accessToken,
                                systemUrl: h.systemUrl,
                                modified: false
                            };
                        }),
                        threeScaleServiceRule: prevState.threeScaleServiceRule
                    };
                }, function () { return _this.props.onChange(true, _this.state.threeScaleServiceRule); });
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not update ThreeScaleHandlers', error));
            });
        };
        _this.onDeleteHandler = function (handlerName) {
            API.deleteThreeScaleHandler(handlerName)
                .then(function (results) {
                _this.setState(function (prevState) {
                    return {
                        threeScaleHandlers: results.data.map(function (h) {
                            return {
                                name: h.name,
                                serviceId: h.serviceId,
                                accessToken: h.accessToken,
                                systemUrl: h.systemUrl,
                                modified: false
                            };
                        }),
                        threeScaleServiceRule: {
                            serviceName: prevState.threeScaleServiceRule.serviceName,
                            serviceNamespace: prevState.threeScaleServiceRule.serviceNamespace,
                            threeScaleHandlerName: prevState.threeScaleServiceRule.threeScaleHandlerName === handlerName
                                ? ''
                                : prevState.threeScaleServiceRule.threeScaleHandlerName
                        }
                    };
                }, function () { return _this.props.onChange(_this.state.threeScaleHandlers.length > 0, _this.state.threeScaleServiceRule); });
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not delete ThreeScaleHandlers', error));
            });
        };
        _this.isValid = function () {
            var isModified = true;
            _this.state.threeScaleHandlers.forEach(function (handlers) {
                isModified = isModified && handlers.modified;
            });
            var isNewModified = _this.state.newThreeScaleHandler.name !== '' ||
                _this.state.newThreeScaleHandler.serviceId !== '' ||
                _this.state.newThreeScaleHandler.systemUrl !== '' ||
                _this.state.newThreeScaleHandler.accessToken !== '';
            return !(isModified || isNewModified);
        };
        _this.onChangeHandler = function (selectedId, field, value) {
            _this.setState(function (prevState) {
                var newThreeScaleHandler = prevState.newThreeScaleHandler;
                if (selectedId === -1) {
                    switch (field) {
                        case 'name':
                            newThreeScaleHandler.name = value.trim();
                            break;
                        case 'serviceId':
                            newThreeScaleHandler.serviceId = value.trim();
                            break;
                        case 'accessToken':
                            newThreeScaleHandler.accessToken = value.trim();
                            break;
                        case 'systemUrl':
                            newThreeScaleHandler.systemUrl = value.trim();
                            break;
                        default:
                    }
                }
                return {
                    threeScaleServiceRule: prevState.threeScaleServiceRule,
                    threeScaleHandlers: prevState.threeScaleHandlers.map(function (handler, id) {
                        if (selectedId === id) {
                            handler.modified = true;
                            switch (field) {
                                case 'serviceId':
                                    handler.serviceId = value.trim();
                                    break;
                                case 'accessToken':
                                    handler.accessToken = value.trim();
                                    break;
                                case 'systemUrl':
                                    handler.systemUrl = value.trim();
                                    break;
                                default:
                            }
                        }
                        return handler;
                    }),
                    newThreeScaleHandler: newThreeScaleHandler
                };
            });
        };
        _this.onCreateHandler = function () {
            API.createThreeScaleHandler(JSON.stringify(_this.state.newThreeScaleHandler))
                .then(function (results) {
                _this.setState(function (prevState) {
                    return {
                        threeScaleHandlers: results.data.map(function (h) {
                            return {
                                name: h.name,
                                serviceId: h.serviceId,
                                accessToken: h.accessToken,
                                systemUrl: h.systemUrl,
                                modified: false
                            };
                        }),
                        threeScaleServiceRule: {
                            serviceName: prevState.threeScaleServiceRule.serviceName,
                            serviceNamespace: prevState.threeScaleServiceRule.serviceNamespace,
                            threeScaleHandlerName: _this.state.newThreeScaleHandler.name
                        },
                        newThreeScaleHandler: {
                            name: '',
                            serviceId: '',
                            systemUrl: '',
                            accessToken: ''
                        }
                    };
                }, function () { return _this.props.onChange(true, _this.state.threeScaleServiceRule); });
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not create ThreeScaleHandlers', error));
            });
        };
        _this.onSelectHandler = function (handlerName) {
            _this.setState(function (prevState) {
                return {
                    threeScaleHandlers: prevState.threeScaleHandlers,
                    threeScaleServiceRule: {
                        serviceName: prevState.threeScaleServiceRule.serviceName,
                        serviceNamespace: prevState.threeScaleServiceRule.serviceNamespace,
                        threeScaleHandlerName: handlerName
                    }
                };
            }, function () { return _this.props.onChange(true, _this.state.threeScaleServiceRule); });
        };
        _this.renderHandlers = function () {
            return (React.createElement(ListView, null, _this.state.threeScaleHandlers.map(function (handler, id) {
                var isLinked = handler.name === _this.state.threeScaleServiceRule.threeScaleHandlerName ||
                    (_this.state.threeScaleServiceRule.threeScaleHandlerName === '' && id === 0);
                var handlerActions = (React.createElement(React.Fragment, null,
                    !isLinked && React.createElement(Button, { onClick: function () { return _this.onSelectHandler(handler.name); } }, "Select"),
                    React.createElement(DropdownKebab, { key: 'delete-handler-actions-' + id, id: 'delete-handler-actions-' + id, pullRight: true },
                        React.createElement(MenuItem, { onClick: function () { return _this.onDeleteHandler(handler.name); } }, "Delete Handler"))));
                var leftContent = isLinked ? React.createElement(ListViewIcon, { type: "pf", name: "connected" }) : undefined;
                return (React.createElement(ListViewItem, { key: id, leftContent: leftContent, heading: React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            handler.name,
                            " ",
                            handler.modified && '*'),
                        React.createElement("div", { className: headingStyle }, "3scale Handler")), description: React.createElement(React.Fragment, null,
                        isLinked && (React.createElement(React.Fragment, null,
                            "Service ",
                            React.createElement("b", null, _this.props.serviceName),
                            " will be linked with 3scale API")),
                        React.createElement("br", null),
                        "Service Id: ",
                        React.createElement("i", null, handler.serviceId),
                        React.createElement("br", null),
                        "System Url: ",
                        React.createElement("i", null, handler.systemUrl)), actions: handlerActions },
                    React.createElement(Form, { horizontal: true },
                        React.createElement(FormGroup, { controlId: "serviceId", disabled: false, validationState: handler.serviceId !== '' ? 'success' : 'error' },
                            React.createElement(Col, { componentClass: ControlLabel, sm: 2 }, "Service Id:"),
                            React.createElement(Col, { sm: 8 },
                                React.createElement(OverlayTrigger, { placement: 'right', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, "3scale ID for API calls"), trigger: ['hover', 'focus'], rootClose: false },
                                    React.createElement(FormControl, { type: "text", disabled: false, value: handler.serviceId, onChange: function (e) { return _this.onChangeHandler(id, 'serviceId', e.target.value); } })))),
                        React.createElement(FormGroup, { controlId: "systemUrl", disabled: false, validationState: handler.systemUrl !== '' ? 'success' : 'error' },
                            React.createElement(Col, { componentClass: ControlLabel, sm: 2 }, "System Url:"),
                            React.createElement(Col, { sm: 8 },
                                React.createElement(OverlayTrigger, { placement: 'right', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, "3scale System Url for API"), trigger: ['hover', 'focus'], rootClose: false },
                                    React.createElement(FormControl, { type: "text", disabled: false, value: handler.systemUrl, onChange: function (e) { return _this.onChangeHandler(id, 'systemUrl', e.target.value); } })))),
                        React.createElement(FormGroup, { controlId: "accessToken", disabled: false, validationState: handler.accessToken !== '' ? 'success' : 'error' },
                            React.createElement(Col, { componentClass: ControlLabel, sm: 2 }, "Access Token:"),
                            React.createElement(Col, { sm: 8 },
                                React.createElement(OverlayTrigger, { placement: 'right', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, "3scale access token"), trigger: ['hover', 'focus'], rootClose: false },
                                    React.createElement(FormControl, { type: "text", disabled: false, value: handler.accessToken, onChange: function (e) { return _this.onChangeHandler(id, 'accessToken', e.target.value); } })))),
                        React.createElement(Row, { style: { paddingTop: '10px', paddingBottom: '10px' } },
                            React.createElement(Col, { smOffset: 10, sm: 2 },
                                React.createElement(Button, { bsStyle: "primary", style: { marginLeft: '-10px' }, onClick: function () { return _this.onUpdateHandler(id); }, disabled: handler.serviceId === '' || handler.systemUrl === '' || handler.accessToken === '' }, "Update Handler"))))));
            })));
        };
        _this.isValidCreateHandler = function () {
            return (_this.isValidK8SName(_this.state.newThreeScaleHandler.name) &&
                _this.state.newThreeScaleHandler.serviceId !== '' &&
                _this.state.newThreeScaleHandler.systemUrl !== '' &&
                _this.state.newThreeScaleHandler.accessToken !== '');
        };
        _this.isValidK8SName = function (name) {
            return name === '' ? false : name.search(k8sRegExpName) === 0;
        };
        _this.renderCreateHandler = function () {
            var isValidName = _this.isValidK8SName(_this.state.newThreeScaleHandler.name);
            return (React.createElement(Form, { className: createHandlerStyle, horizontal: true },
                React.createElement(FormGroup, { controlId: "handlerName", disabled: false, value: _this.state.newThreeScaleHandler.name, onChange: function (e) { return _this.onChangeHandler(-1, 'name', e.target.value); }, validationState: isValidName ? 'success' : 'error' },
                    React.createElement(Col, { componentClass: ControlLabel, sm: 2 }, "Handler Name:"),
                    React.createElement(Col, { sm: 8 },
                        React.createElement(FormControl, { type: "text", disabled: false }),
                        !isValidName && (React.createElement(HelpBlock, null, "Name must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character.")))),
                React.createElement(FormGroup, { controlId: "serviceId", disabled: false, value: _this.state.newThreeScaleHandler.serviceId, onChange: function (e) { return _this.onChangeHandler(-1, 'serviceId', e.target.value); }, validationState: _this.state.newThreeScaleHandler.serviceId !== '' ? 'success' : 'error' },
                    React.createElement(Col, { componentClass: ControlLabel, sm: 2 }, "Service Id:"),
                    React.createElement(Col, { sm: 8 },
                        React.createElement(OverlayTrigger, { placement: 'right', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, "3scale ID for API calls"), trigger: ['hover', 'focus'], rootClose: false },
                            React.createElement(FormControl, { type: "text", disabled: false })))),
                React.createElement(FormGroup, { controlId: "systemUrl", disabled: false, value: _this.state.newThreeScaleHandler.systemUrl, onChange: function (e) { return _this.onChangeHandler(-1, 'systemUrl', e.target.value); }, validationState: _this.state.newThreeScaleHandler.systemUrl !== '' ? 'success' : 'error' },
                    React.createElement(Col, { componentClass: ControlLabel, sm: 2 }, "System Url:"),
                    React.createElement(Col, { sm: 8 },
                        React.createElement(OverlayTrigger, { placement: 'right', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, "3scale System Url for API"), trigger: ['hover', 'focus'], rootClose: false },
                            React.createElement(FormControl, { type: "text", disabled: false })))),
                React.createElement(FormGroup, { controlId: "accessToken", disabled: false, value: _this.state.newThreeScaleHandler.accessToken, onChange: function (e) { return _this.onChangeHandler(-1, 'accessToken', e.target.value); }, validationState: _this.state.newThreeScaleHandler.accessToken !== '' ? 'success' : 'error' },
                    React.createElement(Col, { componentClass: ControlLabel, sm: 2 }, "Access Token:"),
                    React.createElement(Col, { sm: 8 },
                        React.createElement(OverlayTrigger, { placement: 'right', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, "3scale access token"), trigger: ['hover', 'focus'], rootClose: false },
                            React.createElement(FormControl, { type: "text", disabled: false })))),
                React.createElement(Row, { style: { paddingTop: '10px', paddingBottom: '10px' } },
                    React.createElement(Col, { smOffset: 10, sm: 2 },
                        React.createElement(Button, { bsStyle: "primary", onClick: _this.onCreateHandler, disabled: !_this.isValidCreateHandler() }, "Create Handler")))));
        };
        _this.state = {
            threeScaleHandlers: [],
            threeScaleServiceRule: props.threeScaleServiceRule,
            newThreeScaleHandler: {
                name: '',
                serviceId: '',
                accessToken: '',
                systemUrl: ''
            }
        };
        return _this;
    }
    ThreeScaleIntegration.prototype.componentDidMount = function () {
        this.fetchHandlers();
    };
    ThreeScaleIntegration.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            this.renderHandlers(),
            React.createElement(ExpandCollapse, { className: expandStyle, textCollapsed: "Show Advanced Options", textExpanded: "Hide Advanced Options", expanded: this.state.threeScaleHandlers.length === 0 || this.state.newThreeScaleHandler.name !== '' }, this.renderCreateHandler())));
    };
    return ThreeScaleIntegration;
}(React.Component));
export default ThreeScaleIntegration;
//# sourceMappingURL=ThreeScaleIntegration.js.map