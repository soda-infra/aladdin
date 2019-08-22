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
import { Button, Icon } from 'patternfly-react';
import { style } from 'typestyle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { durationSelector, refreshIntervalSelector } from '../../store/Selectors';
import { UserSettingsActions } from '../../actions/UserSettingsActions';
import { config } from '../../config/Config';
import { HistoryManager, URLParam } from '../../app/History';
import ToolbarDropdown from '../ToolbarDropdown/ToolbarDropdown';
import { DurationDropdownContainer } from '../DurationDropdown/DurationDropdown';
var GraphRefresh = /** @class */ (function (_super) {
    __extends(GraphRefresh, _super);
    function GraphRefresh(props) {
        var _this = _super.call(this, props) || this;
        // Let URL override current redux state at construction time
        var urlPollInterval = HistoryManager.getNumericParam(URLParam.POLL_INTERVAL);
        if (urlPollInterval !== undefined && urlPollInterval !== props.refreshInterval) {
            props.setRefreshInterval(urlPollInterval);
        }
        HistoryManager.setParam(URLParam.DURATION, String(_this.props.duration));
        HistoryManager.setParam(URLParam.POLL_INTERVAL, String(_this.props.refreshInterval));
        return _this;
    }
    GraphRefresh.prototype.componentDidUpdate = function () {
        // ensure redux state and URL are aligned
        HistoryManager.setParam(URLParam.DURATION, String(this.props.duration));
        HistoryManager.setParam(URLParam.POLL_INTERVAL, String(this.props.refreshInterval));
    };
    GraphRefresh.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement(DurationDropdownContainer, { id: 'graph_filter_duration', disabled: this.props.disabled, tooltip: 'Time range for graph data' }),
            React.createElement(ToolbarDropdown, { id: "graph_refresh_dropdown", disabled: this.props.disabled, handleSelect: function (value) { return _this.props.setRefreshInterval(Number(value)); }, value: this.props.refreshInterval, label: GraphRefresh.POLL_INTERVAL_LIST[this.props.refreshInterval], options: GraphRefresh.POLL_INTERVAL_LIST, tooltip: 'Refresh interval for graph' }),
            React.createElement("span", { className: GraphRefresh.refreshButtonStyle },
                React.createElement(Button, { id: "refresh_button", onClick: this.props.handleRefresh, disabled: this.props.disabled },
                    React.createElement(Icon, { name: "refresh" })))));
    };
    GraphRefresh.POLL_INTERVAL_LIST = config.toolbar.pollInterval;
    GraphRefresh.refreshButtonStyle = style({
        paddingLeft: '0.5em'
    });
    return GraphRefresh;
}(React.PureComponent));
export { GraphRefresh };
var mapStateToProps = function (state) { return ({
    duration: durationSelector(state),
    refreshInterval: refreshIntervalSelector(state)
}); };
var mapDispatchToProps = function (dispatch) {
    return {
        setRefreshInterval: bindActionCreators(UserSettingsActions.setRefreshInterval, dispatch)
    };
};
var GraphRefreshContainer = connect(mapStateToProps, mapDispatchToProps)(GraphRefresh);
export default GraphRefreshContainer;
//# sourceMappingURL=GraphRefresh.js.map