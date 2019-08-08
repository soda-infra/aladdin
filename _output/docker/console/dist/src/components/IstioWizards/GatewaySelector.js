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
import { Checkbox, Col, ControlLabel, DropdownButton, Form, FormControl, FormGroup, HelpBlock, MenuItem, Radio, Switch } from 'patternfly-react';
import { style } from 'typestyle';
var GatewayForm;
(function (GatewayForm) {
    GatewayForm[GatewayForm["SWITCH"] = 0] = "SWITCH";
    GatewayForm[GatewayForm["MESH"] = 1] = "MESH";
    GatewayForm[GatewayForm["GW_HOSTS"] = 2] = "GW_HOSTS";
    GatewayForm[GatewayForm["SELECT"] = 3] = "SELECT";
    GatewayForm[GatewayForm["GATEWAY_SELECTED"] = 4] = "GATEWAY_SELECTED";
    GatewayForm[GatewayForm["PORT"] = 5] = "PORT";
})(GatewayForm || (GatewayForm = {}));
var labelStyle = style({
    marginTop: 20
});
var GatewaySelector = /** @class */ (function (_super) {
    __extends(GatewaySelector, _super);
    function GatewaySelector(props) {
        var _this = _super.call(this, props) || this;
        _this.checkGwHosts = function (gwHosts) {
            var hosts = gwHosts.split(',');
            for (var i = 0; i < hosts.length; i++) {
                if (hosts[i] === '*') {
                    continue;
                }
                if (!hosts[i].includes('.')) {
                    return false;
                }
            }
            return true;
        };
        _this.onFormChange = function (component, value) {
            switch (component) {
                case GatewayForm.SWITCH:
                    _this.setState(function (prevState) {
                        return {
                            addGateway: !prevState.addGateway
                        };
                    }, function () { return _this.props.onGatewayChange(true, _this.state); });
                    break;
                case GatewayForm.MESH:
                    _this.setState(function (prevState) {
                        return {
                            addMesh: !prevState.addMesh
                        };
                    }, function () { return _this.props.onGatewayChange(true, _this.state); });
                    break;
                case GatewayForm.GW_HOSTS:
                    _this.setState({
                        gwHosts: value,
                        gwHostsValid: _this.checkGwHosts(value)
                    }, function () { return _this.props.onGatewayChange(_this.state.gwHostsValid, _this.state); });
                    break;
                case GatewayForm.SELECT:
                    _this.setState({
                        newGateway: value === 'true'
                    }, function () { return _this.props.onGatewayChange(true, _this.state); });
                    break;
                case GatewayForm.GATEWAY_SELECTED:
                    _this.setState({
                        selectedGateway: value
                    }, function () { return _this.props.onGatewayChange(true, _this.state); });
                    break;
                case GatewayForm.PORT:
                    _this.setState({
                        port: +value
                    }, function () { return _this.props.onGatewayChange(true, _this.state); });
                    break;
                default:
                // No default action
            }
        };
        _this.state = {
            addGateway: props.hasGateway,
            gwHosts: '*',
            gwHostsValid: true,
            newGateway: props.gateways.length === 0,
            selectedGateway: props.gateways.length > 0 ? (props.gateway !== '' ? props.gateway : props.gateways[0]) : '',
            addMesh: props.isMesh,
            port: 80
        };
        return _this;
    }
    GatewaySelector.prototype.render = function () {
        var _this = this;
        var gatewayItems = this.props.gateways.map(function (gw) { return (React.createElement(MenuItem, { key: gw, eventKey: gw, active: gw === _this.state.selectedGateway }, gw)); });
        return (React.createElement(Form, { horizontal: true, onSubmit: function (e) { return e.preventDefault(); } },
            React.createElement(FormGroup, { controlId: "gatewaySwitch", disabled: false },
                React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "Add Gateway"),
                React.createElement(Col, { sm: 9 },
                    React.createElement(Switch, { bsSize: "normal", title: "normal", id: "gateway-form", animate: false, onChange: function () { return _this.onFormChange(GatewayForm.SWITCH, ''); }, defaultValue: this.props.hasGateway }))),
            this.state.addGateway && (React.createElement(React.Fragment, null,
                React.createElement(FormGroup, { controlId: "checkbox", disabled: false },
                    React.createElement(Col, { sm: 3 }),
                    React.createElement(Col, { sm: 9 },
                        React.createElement(Checkbox, { disabled: !this.state.addGateway, checked: this.state.addMesh, onChange: function () { return _this.onFormChange(GatewayForm.MESH, ''); } },
                            "Include ",
                            React.createElement("b", null, "mesh"),
                            " gateway"))),
                React.createElement(FormGroup, null,
                    React.createElement(Col, { sm: 3 }),
                    React.createElement(Col, { sm: 9 },
                        React.createElement(Radio, { name: "selectGateway", className: labelStyle, disabled: !this.state.addGateway || this.props.gateways.length === 0, checked: !this.state.newGateway, onChange: function () { return _this.onFormChange(GatewayForm.SELECT, 'false'); }, inline: true }, "Select Gateway"),
                        React.createElement(Radio, { name: "selectGateway", className: labelStyle, disabled: !this.state.addGateway, checked: this.state.newGateway, onChange: function () { return _this.onFormChange(GatewayForm.SELECT, 'true'); }, inline: true }, "Create Gateway"))),
                !this.state.newGateway && (React.createElement(FormGroup, null,
                    React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "Gateway"),
                    React.createElement(Col, { sm: 9 },
                        this.props.gateways.length > 0 && (React.createElement(DropdownButton, { id: "trafficPolicy-tls", bsStyle: "default", title: this.state.selectedGateway, disabled: !this.state.addGateway || this.state.newGateway || this.props.gateways.length === 0, onSelect: function (gw) { return _this.onFormChange(GatewayForm.GATEWAY_SELECTED, gw); } }, gatewayItems)),
                        this.props.gateways.length === 0 && React.createElement(HelpBlock, null, "There are no gateways to select.")))),
                this.state.newGateway && (React.createElement(React.Fragment, null,
                    React.createElement(FormGroup, null,
                        React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "Port"),
                        React.createElement(Col, { sm: 9 },
                            React.createElement(FormControl, { type: "number", disabled: !this.state.addGateway || !this.state.newGateway, value: this.state.port, onChange: function (e) { return _this.onFormChange(GatewayForm.PORT, e.target.value); } }))),
                    React.createElement(FormGroup, { controlId: "gwHosts", disabled: !this.state.addGateway, validationState: this.state.gwHostsValid ? null : 'error' },
                        React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "Gateway Hosts"),
                        React.createElement(Col, { sm: 9 },
                            React.createElement(FormControl, { type: "text", disabled: !this.state.addGateway || !this.state.newGateway, value: this.state.gwHosts, onChange: function (e) { return _this.onFormChange(GatewayForm.GW_HOSTS, e.target.value); } }),
                            React.createElement(HelpBlock, null,
                                "One or more hosts exposed by this gateway. Enter one or multiple hosts separated by comma.",
                                !this.state.gwHostsValid && (React.createElement("p", null, "Gateway hosts should be specified using FQDN format or '*' wildcard.")))))))))));
    };
    return GatewaySelector;
}(React.Component));
export default GatewaySelector;
//# sourceMappingURL=GatewaySelector.js.map