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
import { DropdownButton, MenuItem, MessageDialog, OverlayTrigger, Tooltip } from 'patternfly-react';
import * as MessageCenter from '../../utils/MessageCenter';
import * as API from '../../services/Api';
import { serverConfig } from '../../config/ServerConfig';
import { KIALI_WIZARD_LABEL, WIZARD_ACTIONS, WIZARD_MATCHING_ROUTING, WIZARD_SUSPEND_TRAFFIC, WIZARD_THREESCALE_INTEGRATION, WIZARD_TITLES, WIZARD_UPDATE_TITLES, WIZARD_WEIGHTED_ROUTING } from './IstioWizardActions';
import IstioWizard from './IstioWizard';
import { style } from 'typestyle';
var DELETE_TRAFFIC_ROUTING = 'delete_traffic_routing';
var DELETE_THREESCALE_INTEGRATION = 'delete_threescale_integration';
var msgDialogStyle = style({
    $nest: {
        '.modal-content': {
            fontSize: '14px'
        }
    }
});
var IstioWizardDropdown = /** @class */ (function (_super) {
    __extends(IstioWizardDropdown, _super);
    function IstioWizardDropdown(props) {
        var _this = _super.call(this, props) || this;
        // Wizard can be opened when there are not existing VS & DR and there are update permissions
        _this.canCreate = function () {
            return _this.props.virtualServices.permissions.create && _this.props.destinationRules.permissions.create;
        };
        _this.canUpdate = function () {
            return _this.props.virtualServices.permissions.update && _this.props.destinationRules.permissions.update;
        };
        _this.canDelete = function () {
            return _this.props.virtualServices.permissions.delete && _this.props.destinationRules.permissions.delete;
        };
        _this.hasTrafficRouting = function () {
            return _this.props.virtualServices.items.length > 0 || _this.props.destinationRules.items.length > 0;
        };
        _this.getVSWizardLabel = function () {
            return _this.props.virtualServices.items.length === 1 &&
                _this.props.virtualServices.items[0].metadata.labels &&
                _this.props.virtualServices.items[0].metadata.labels[KIALI_WIZARD_LABEL]
                ? _this.props.virtualServices.items[0].metadata.labels[KIALI_WIZARD_LABEL]
                : '';
        };
        _this.onAction = function (key) {
            var updateLabel = _this.getVSWizardLabel();
            switch (key) {
                case WIZARD_WEIGHTED_ROUTING:
                case WIZARD_MATCHING_ROUTING:
                case WIZARD_SUSPEND_TRAFFIC: {
                    _this.setState({ showWizard: true, wizardType: key, updateWizard: key === updateLabel });
                    break;
                }
                case WIZARD_THREESCALE_INTEGRATION: {
                    _this.setState({
                        showWizard: true,
                        wizardType: key,
                        updateWizard: _this.props.threeScaleServiceRule !== undefined
                    });
                    break;
                }
                case DELETE_TRAFFIC_ROUTING: {
                    _this.setState({ showConfirmDelete: true, deleteAction: key });
                    break;
                }
                case DELETE_THREESCALE_INTEGRATION: {
                    _this.setState({ showConfirmDelete: true, deleteAction: key });
                    break;
                }
                default:
                    console.log('Unrecognized key');
            }
        };
        _this.onDelete = function () {
            _this.setState({
                isDeleting: true
            });
            var deletePromises = [];
            switch (_this.state.deleteAction) {
                case DELETE_TRAFFIC_ROUTING:
                    _this.props.virtualServices.items.forEach(function (vs) {
                        deletePromises.push(API.deleteIstioConfigDetail(vs.metadata.namespace || '', 'virtualservices', vs.metadata.name));
                    });
                    _this.props.destinationRules.items.forEach(function (dr) {
                        deletePromises.push(API.deleteIstioConfigDetail(dr.metadata.namespace || '', 'destinationrules', dr.metadata.name));
                    });
                    break;
                case DELETE_THREESCALE_INTEGRATION:
                    deletePromises.push(API.deleteThreeScaleServiceRule(_this.props.namespace, _this.props.serviceName));
                    break;
                default:
            }
            // For slow scenarios, dialog is hidden and Delete All action blocked until promises have finished
            _this.hideConfirmDelete();
            Promise.all(deletePromises)
                .then(function (_results) {
                _this.setState({
                    isDeleting: false
                });
                _this.props.onChange();
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not delete Istio config objects', error));
                _this.setState({
                    isDeleting: false
                });
            });
        };
        _this.hideConfirmDelete = function () {
            _this.setState({ showConfirmDelete: false });
        };
        _this.onClose = function (changed) {
            _this.setState({ showWizard: false });
            if (changed) {
                _this.props.onChange();
            }
        };
        _this.renderMenuItem = function (eventKey, updateLabel) {
            switch (eventKey) {
                case WIZARD_WEIGHTED_ROUTING:
                case WIZARD_MATCHING_ROUTING:
                case WIZARD_SUSPEND_TRAFFIC:
                    // An Item is rendered under two conditions:
                    // a) No traffic -> Wizard can create new one
                    // b) Existing traffic generated by the traffic -> Wizard can update that scenario
                    // Otherwise, the item should be disabled
                    var enabledItem = !_this.hasTrafficRouting() || (_this.hasTrafficRouting() && updateLabel === eventKey);
                    var menuItem = (React.createElement(MenuItem, { disabled: !enabledItem, key: eventKey, eventKey: eventKey }, updateLabel === eventKey ? WIZARD_UPDATE_TITLES[eventKey] : WIZARD_TITLES[eventKey]));
                    return !enabledItem ? (React.createElement(OverlayTrigger, { placement: 'left', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, "Traffic routing already exists for this service"), trigger: ['hover', 'focus'], rootClose: false, key: eventKey }, menuItem)) : (menuItem);
                case DELETE_TRAFFIC_ROUTING:
                    var deleteMenuItem = (React.createElement(MenuItem, { disabled: !_this.hasTrafficRouting() || _this.state.isDeleting, key: eventKey, eventKey: eventKey }, "Delete ALL Traffic Routing"));
                    return !_this.hasTrafficRouting() ? (React.createElement(OverlayTrigger, { placement: 'left', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, "Traffic routing doesn't exist for this service"), trigger: ['hover', 'focus'], rootClose: false, key: eventKey }, deleteMenuItem)) : (deleteMenuItem);
                case WIZARD_THREESCALE_INTEGRATION:
                    var threeScaleEnabledItem = !_this.props.threeScaleServiceRule || (_this.props.threeScaleServiceRule && updateLabel === eventKey);
                    var threeScaleMenuItem = (React.createElement(MenuItem, { disabled: !threeScaleEnabledItem, key: eventKey, eventKey: eventKey }, updateLabel === eventKey ? WIZARD_UPDATE_TITLES[eventKey] : WIZARD_TITLES[eventKey]));
                    var toolTipMsgExists = '3scale API Integration Rule already exists for this service';
                    return !threeScaleEnabledItem ? (React.createElement(OverlayTrigger, { placement: 'left', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, toolTipMsgExists), trigger: ['hover', 'focus'], rootClose: false, key: eventKey }, threeScaleMenuItem)) : (threeScaleMenuItem);
                case DELETE_THREESCALE_INTEGRATION:
                    var deleteThreeScaleMenuItem = (React.createElement(MenuItem, { disabled: !_this.props.threeScaleServiceRule || _this.state.isDeleting, key: eventKey, eventKey: eventKey }, "Delete 3Scale API Management Rule"));
                    var toolTipMsgDelete = 'There is not a 3scale API Integration Rule for this service';
                    return !_this.props.threeScaleServiceRule ? (React.createElement(OverlayTrigger, { placement: 'left', overlay: React.createElement(Tooltip, { id: 'mtls-status-masthead' }, toolTipMsgDelete), trigger: ['hover', 'focus'], rootClose: false, key: eventKey }, deleteThreeScaleMenuItem)) : (deleteThreeScaleMenuItem);
                default:
                    return React.createElement(React.Fragment, null, "Unsupported");
            }
        };
        _this.getDeleteMessage = function () {
            var deleteMessage = 'Are you sure you want to delete ';
            switch (_this.state.deleteAction) {
                case DELETE_TRAFFIC_ROUTING:
                    deleteMessage +=
                        _this.props.virtualServices.items.length > 0
                            ? "VirtualService" + (_this.props.virtualServices.items.length > 1 ? 's' : '') + ": '" + _this.props.virtualServices.items.map(function (vs) { return vs.metadata.name; }) + "'"
                            : '';
                    deleteMessage +=
                        _this.props.virtualServices.items.length > 0 && _this.props.destinationRules.items.length > 0 ? ' and ' : '';
                    deleteMessage +=
                        _this.props.destinationRules.items.length > 0
                            ? "DestinationRule" + (_this.props.destinationRules.items.length > 1 ? 's' : '') + ": '" + _this.props.destinationRules.items.map(function (dr) { return dr.metadata.name; }) + "'"
                            : '';
                    break;
                case DELETE_THREESCALE_INTEGRATION:
                    deleteMessage += ' 3scale API Management Integration Rule ';
                    break;
                default:
            }
            deleteMessage += ' ?.  ';
            return deleteMessage;
        };
        _this.state = {
            showWizard: props.show,
            wizardType: '',
            showConfirmDelete: false,
            deleteAction: '',
            isDeleting: false,
            updateWizard: false
        };
        return _this;
    }
    IstioWizardDropdown.prototype.render = function () {
        var _this = this;
        var updateLabel = this.getVSWizardLabel();
        return (React.createElement(React.Fragment, null,
            React.createElement(DropdownButton, { id: "service_actions", title: "Actions", onSelect: this.onAction, pullRight: true },
                (this.canCreate() || this.canUpdate()) &&
                    WIZARD_ACTIONS.map(function (action) { return _this.renderMenuItem(action, updateLabel); }),
                React.createElement(MenuItem, { divider: true }),
                this.canDelete() && this.renderMenuItem(DELETE_TRAFFIC_ROUTING, ''),
                this.props.threeScaleInfo.enabled && React.createElement(MenuItem, { divider: true }),
                this.props.threeScaleInfo.enabled &&
                    this.renderMenuItem(WIZARD_THREESCALE_INTEGRATION, this.props.threeScaleServiceRule ? WIZARD_THREESCALE_INTEGRATION : ''),
                this.props.threeScaleInfo.enabled && this.renderMenuItem(DELETE_THREESCALE_INTEGRATION, '')),
            React.createElement(IstioWizard, { show: this.state.showWizard, type: this.state.wizardType, update: this.state.updateWizard, namespace: this.props.namespace, serviceName: this.props.serviceName, workloads: this.props.workloads.filter(function (workload) {
                    var appLabelName = serverConfig.istioLabels.versionLabelName;
                    var versionLabelName = serverConfig.istioLabels.versionLabelName;
                    return workload.labels && workload.labels[appLabelName] && workload.labels[versionLabelName];
                }), virtualServices: this.props.virtualServices, destinationRules: this.props.destinationRules, gateways: this.props.gateways, threeScaleServiceRule: this.props.threeScaleServiceRule, tlsStatus: this.props.tlsStatus, onClose: this.onClose }),
            React.createElement(MessageDialog, { className: msgDialogStyle, show: this.state.showConfirmDelete, primaryAction: this.onDelete, secondaryAction: this.hideConfirmDelete, onHide: this.hideConfirmDelete, primaryActionButtonContent: "Delete", secondaryActionButtonContent: "Cancel", primaryActionButtonBsStyle: "danger", title: "Confirm Delete", primaryContent: this.getDeleteMessage(), secondaryContent: "It cannot be undone. Make sure this is something you really want to do!", accessibleName: "deleteConfirmationDialog", accessibleDescription: "deleteConfirmationDialogContent" })));
    };
    return IstioWizardDropdown;
}(React.Component));
export default IstioWizardDropdown;
//# sourceMappingURL=IstioWizardDropdown.js.map