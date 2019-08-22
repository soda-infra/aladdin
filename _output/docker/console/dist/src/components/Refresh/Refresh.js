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
import { refreshIntervalSelector } from '../../store/Selectors';
import { config } from '../../config';
import { UserSettingsActions } from '../../actions/UserSettingsActions';
import { ToolbarDropdown } from '../ToolbarDropdown/ToolbarDropdown';
import RefreshButtonContainer from './RefreshButton';
import { GlobalActions } from '../../actions/GlobalActions';
var POLL_INTERVALS = config.toolbar.pollInterval;
var Refresh = /** @class */ (function (_super) {
    __extends(Refresh, _super);
    function Refresh(props) {
        var _this = _super.call(this, props) || this;
        _this.updatePollInterval = function (pollInterval) {
            var newRefInterval = undefined;
            if (_this.state.pollerRef) {
                clearInterval(_this.state.pollerRef);
            }
            if (pollInterval > 0) {
                newRefInterval = window.setInterval(_this.handleRefresh, pollInterval);
            }
            _this.setState({ pollerRef: newRefInterval });
            _this.props.setRefreshInterval(pollInterval); // notify redux of the change
        };
        _this.handleRefresh = function () {
            _this.props.setLastRefreshAt(Date.now());
            _this.props.handleRefresh();
        };
        var pollerRef = undefined;
        if (_this.props.refreshInterval) {
            pollerRef = window.setInterval(_this.handleRefresh, _this.props.refreshInterval);
        }
        _this.state = {
            pollerRef: pollerRef
        };
        return _this;
    }
    Refresh.prototype.componentWillUnmount = function () {
        if (this.state.pollerRef) {
            clearInterval(this.state.pollerRef);
        }
    };
    Refresh.prototype.render = function () {
        var _this = this;
        if (this.props.refreshInterval !== undefined) {
            var hideLabel = this.props.hideLabel;
            return (React.createElement(React.Fragment, null,
                !hideLabel && React.createElement("label", { style: { paddingRight: '0.5em', marginLeft: '1.5em' } }, "Refreshing"),
                React.createElement(ToolbarDropdown, { id: this.props.id, handleSelect: function (value) { return _this.updatePollInterval(Number(value)); }, value: this.props.refreshInterval, label: POLL_INTERVALS[this.props.refreshInterval], options: POLL_INTERVALS, tooltip: 'Refresh interval' }),
                React.createElement("span", { style: { paddingLeft: '0.5em' } },
                    React.createElement(RefreshButtonContainer, { id: this.props.id + '_btn', handleRefresh: this.props.handleRefresh }))));
        }
        else {
            return React.createElement(RefreshButtonContainer, { handleRefresh: this.props.handleRefresh });
        }
    };
    return Refresh;
}(React.Component));
var mapStateToProps = function (state) { return ({
    refreshInterval: refreshIntervalSelector(state)
}); };
var mapDispatchToProps = function (dispatch) {
    return {
        setRefreshInterval: function (refresh) {
            dispatch(UserSettingsActions.setRefreshInterval(refresh));
        },
        setLastRefreshAt: function (lastRefreshAt) {
            dispatch(GlobalActions.setLastRefreshAt(lastRefreshAt));
        }
    };
};
var RefreshContainer = connect(mapStateToProps, mapDispatchToProps)(Refresh);
export default RefreshContainer;
//# sourceMappingURL=Refresh.js.map