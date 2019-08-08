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
import { Button, Icon } from 'patternfly-react';
import { GlobalActions } from '../../actions/GlobalActions';
import { style } from 'typestyle';
var refreshButtonStyle = style({
    marginLeft: '0.5em'
});
var RefreshButton = /** @class */ (function (_super) {
    __extends(RefreshButton, _super);
    function RefreshButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleRefresh = function () {
            _this.props.setLastRefreshAt(Date.now());
            _this.props.handleRefresh();
        };
        return _this;
    }
    RefreshButton.prototype.getElementId = function () {
        return this.props.id || 'refresh_button';
    };
    RefreshButton.prototype.getDisabled = function () {
        return this.props.disabled || false;
    };
    RefreshButton.prototype.render = function () {
        return (React.createElement(Button, { id: this.getElementId(), onClick: this.handleRefresh, disabled: this.getDisabled(), className: refreshButtonStyle },
            React.createElement(Icon, { name: "refresh" })));
    };
    return RefreshButton;
}(React.Component));
var mapDispatchToProps = function (dispatch) {
    return {
        setLastRefreshAt: function (lastRefreshAt) {
            dispatch(GlobalActions.setLastRefreshAt(lastRefreshAt));
        }
    };
};
var RefreshButtonContainer = connect(null, mapDispatchToProps)(RefreshButton);
export default RefreshButtonContainer;
//# sourceMappingURL=RefreshButton.js.map