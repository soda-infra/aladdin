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
import { FormSelect, FormSelectOption, FormSelectOptionGroup } from '@patternfly/react-core';
import * as Api from '../../services/Api';
import { PromisesRegistry } from '../../utils/CancelablePromises';
import { style } from 'typestyle';
var serviceDropdown = style({ marginLeft: '-100px' });
var ServiceDropdown = /** @class */ (function (_super) {
    __extends(ServiceDropdown, _super);
    function ServiceDropdown(props) {
        var _this = _super.call(this, props) || this;
        _this.refreshServices = function (namespaces) {
            if (namespaces.length === 0) {
                _this.setState({ servicesGroups: [] });
            }
            else {
                var servicesPromises = namespaces.map(function (ns) { return Api.getServices(ns); });
                var promises = new PromisesRegistry();
                promises
                    .registerAll('services', servicesPromises)
                    .then(function (responses) {
                    var serviceList = [];
                    responses.forEach(function (response) {
                        var ns = response.data.namespace.name;
                        var serviceGroup = { groupLabel: ns, disabled: false, options: [] };
                        response.data.services.forEach(function (service) {
                            serviceGroup.options.push({ value: service.name + "." + ns, label: service.name, disabled: false });
                        });
                        serviceList.push(serviceGroup);
                    });
                    _this.setState({ servicesGroups: serviceList });
                })
                    .catch(function () { return console.log('Error'); });
            }
        };
        _this.handleFocus = function () { return _this.refreshServices(_this.props.activeNamespaces); };
        _this.labelServiceDropdown = function (items) {
            if (_this.props.activeNamespaces.length > 0) {
                if (items === 0) {
                    return 'Select another namespace with services';
                }
                return 'Select a service';
            }
            return 'Select a namespace';
        };
        _this.state = { servicesGroups: [] };
        if (_this.props.activeNamespaces.length > 0) {
            _this.refreshServices(_this.props.activeNamespaces);
        }
        return _this;
    }
    ServiceDropdown.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.activeNamespaces.sort().join(',') !== this.props.activeNamespaces.sort().join(',')) {
            this.refreshServices(this.props.activeNamespaces);
        }
    };
    ServiceDropdown.prototype.render = function () {
        var _this = this;
        var disabled = this.props.disabled;
        var servicesGroups = this.state.servicesGroups;
        return (React.createElement(FormSelect, { value: this.props.service, isDisabled: disabled || this.props.activeNamespaces.length === 0 || Object.keys(servicesGroups).length === 0, onFocus: function () { return _this.handleFocus; }, onChange: this.props.setService, "aria-label": "FormSelect Input", className: serviceDropdown },
            React.createElement(FormSelectOption, { isDisabled: false, key: 'help_test', value: '', label: this.labelServiceDropdown(Object.keys(servicesGroups).length) }),
            servicesGroups.map(function (group, index) { return (React.createElement(FormSelectOptionGroup, { isDisabled: group.disabled, key: index, label: group.groupLabel }, group.options.map(function (option, i) { return (React.createElement(FormSelectOption, { isDisabled: option.disabled, key: i, value: option.value, label: option.label })); }))); })));
    };
    return ServiceDropdown;
}(React.PureComponent));
export { ServiceDropdown };
var mapStateToProps = function (state) {
    return {
        activeNamespaces: state.namespaces.activeNamespaces.map(function (ns) { return ns.name; })
    };
};
var ServiceDropdownContainer = connect(mapStateToProps)(ServiceDropdown);
export default ServiceDropdownContainer;
//# sourceMappingURL=ServiceDropdown.js.map