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
import { Button } from 'patternfly-react';
import { connect } from 'react-redux';
import { GlobalActions } from '../../actions/GlobalActions';
var IstioActionButtons = /** @class */ (function (_super) {
    __extends(IstioActionButtons, _super);
    function IstioActionButtons(props) {
        var _this = _super.call(this, props) || this;
        _this.hideConfirmModal = function () {
            _this.setState({ showConfirmModal: false });
        };
        _this.handleRefresh = function () {
            _this.props.onRefresh();
            _this.props.setLastRefreshAt(Date.now());
        };
        _this.state = { showConfirmModal: false };
        return _this;
    }
    IstioActionButtons.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("span", { style: { float: 'left', paddingTop: '10px', paddingBottom: '10px' } },
                !this.props.readOnly && (React.createElement("span", { style: { paddingRight: '5px' } },
                    React.createElement(Button, { bsStyle: "primary", disabled: !this.props.canUpdate, onClick: this.props.onUpdate }, "Save"))),
                React.createElement("span", { style: { paddingRight: '5px' } },
                    React.createElement(Button, { onClick: this.handleRefresh }, "Reload")),
                React.createElement("span", { style: { paddingRight: '5px' } },
                    React.createElement(Button, { onClick: this.props.onCancel }, this.props.readOnly ? 'Close' : 'Cancel')))));
    };
    return IstioActionButtons;
}(React.Component));
var mapDispatchToProps = function (dispatch) {
    return {
        setLastRefreshAt: function (lastRefreshAt) {
            dispatch(GlobalActions.setLastRefreshAt(lastRefreshAt));
        }
    };
};
var IstioActionButtonsContainer = connect(null, mapDispatchToProps)(IstioActionButtons);
export default IstioActionButtonsContainer;
//# sourceMappingURL=IstioActionsButtons.js.map