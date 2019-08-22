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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { Button, ButtonGroup, FormGroup, Sort, ToolbarRightContent } from 'patternfly-react';
import { connect } from 'react-redux';
import { UserSettingsActions } from '../../actions/UserSettingsActions';
import history, { HistoryManager, URLParam } from '../../app/History';
import { StatefulFilters } from '../../components/Filters/StatefulFilters';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import RefreshContainer from '../../components/Refresh/Refresh';
import { ToolbarDropdown } from '../../components/ToolbarDropdown/ToolbarDropdown';
import { durationSelector, refreshIntervalSelector } from '../../store/Selectors';
import { AlignRightStyle, ThinStyle } from '../../components/Filters/FilterStyles';
import * as Sorts from './Sorts';
import * as Filters from './Filters';
import { DurationDropdownContainer } from '../../components/DurationDropdown/DurationDropdown';
export var OverviewDisplayMode;
(function (OverviewDisplayMode) {
    OverviewDisplayMode[OverviewDisplayMode["COMPACT"] = 0] = "COMPACT";
    OverviewDisplayMode[OverviewDisplayMode["EXPAND"] = 1] = "EXPAND";
})(OverviewDisplayMode || (OverviewDisplayMode = {}));
var overviewTypes = {
    app: 'Apps',
    workload: 'Workloads',
    service: 'Services'
};
var OverviewToolbar = /** @class */ (function (_super) {
    __extends(OverviewToolbar, _super);
    function OverviewToolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.updateSortField = function (sortField) {
            _this.props.sort(sortField, _this.state.isSortAscending);
            HistoryManager.setParam(URLParam.SORT, sortField.param);
            _this.setState({ sortField: sortField });
        };
        _this.updateSortDirection = function () {
            var newDir = !_this.state.isSortAscending;
            _this.props.sort(_this.state.sortField, newDir);
            HistoryManager.setParam(URLParam.DIRECTION, newDir ? 'asc' : 'desc');
            _this.setState({ isSortAscending: newDir });
        };
        _this.updateOverviewType = function (otype) {
            HistoryManager.setParam(URLParam.OVERVIEW_TYPE, otype);
            _this.setState({ overviewType: otype });
            _this.props.onRefresh();
        };
        // Let URL override current redux state at construction time
        var urlParams = new URLSearchParams(history.location.search);
        var urlPollInterval = HistoryManager.getNumericParam(URLParam.POLL_INTERVAL, urlParams);
        if (urlPollInterval !== undefined && urlPollInterval !== props.refreshInterval) {
            props.setRefreshInterval(urlPollInterval);
        }
        HistoryManager.setParam(URLParam.DURATION, String(_this.props.duration));
        HistoryManager.setParam(URLParam.POLL_INTERVAL, String(_this.props.refreshInterval));
        _this.state = {
            isSortAscending: ListPagesHelper.isCurrentSortAscending(),
            overviewType: OverviewToolbar.currentOverviewType(),
            sortField: ListPagesHelper.currentSortField(Sorts.sortFields)
        };
        return _this;
    }
    OverviewToolbar.currentOverviewType = function () {
        var otype = HistoryManager.getParam(URLParam.OVERVIEW_TYPE);
        return otype || 'app';
    };
    OverviewToolbar.prototype.componentDidUpdate = function (prevProps) {
        // ensure redux state and URL are aligned
        HistoryManager.setParam(URLParam.DURATION, String(this.props.duration));
        HistoryManager.setParam(URLParam.POLL_INTERVAL, String(this.props.refreshInterval));
        var urlSortField = ListPagesHelper.currentSortField(Sorts.sortFields);
        var urlIsSortAscending = ListPagesHelper.isCurrentSortAscending();
        if (!this.paramsAreSynced(urlSortField, urlIsSortAscending) || this.props.duration !== prevProps.duration) {
            this.setState({
                sortField: urlSortField,
                isSortAscending: urlIsSortAscending
            });
            this.props.onRefresh();
        }
    };
    OverviewToolbar.prototype.paramsAreSynced = function (urlSortField, urlIsSortAscending) {
        return urlIsSortAscending === this.state.isSortAscending && urlSortField.title === this.state.sortField.title;
    };
    OverviewToolbar.prototype.render = function () {
        var _this = this;
        return (React.createElement(StatefulFilters, { initialFilters: Filters.availableFilters, onFilterChange: this.props.onRefresh },
            React.createElement(Sort, { style: __assign({}, ThinStyle) },
                React.createElement(Sort.TypeSelector
                // style={{ ...thinGroupStyle }}
                , { 
                    // style={{ ...thinGroupStyle }}
                    sortTypes: Sorts.sortFields, currentSortType: this.state.sortField, onSortTypeSelected: this.updateSortField }),
                React.createElement(Sort.DirectionSelector
                // style={{ ...thinGroupStyle }}
                , { 
                    // style={{ ...thinGroupStyle }}
                    isNumeric: false, isAscending: this.state.isSortAscending, onClick: this.updateSortDirection })),
            React.createElement(FormGroup, { style: __assign({}, ThinStyle) },
                React.createElement(ToolbarDropdown, { id: "overview-type", disabled: false, handleSelect: this.updateOverviewType, nameDropdown: "Show health for", value: this.state.overviewType, label: overviewTypes[this.state.overviewType], options: overviewTypes })),
            React.createElement(FormGroup, null,
                React.createElement(ButtonGroup, { id: "toolbar_layout_group" },
                    React.createElement(Button, { onClick: function () { return _this.props.setDisplayMode(OverviewDisplayMode.COMPACT); }, title: "Compact mode", active: this.props.displayMode === OverviewDisplayMode.COMPACT }, "Compact"),
                    React.createElement(Button, { onClick: function () { return _this.props.setDisplayMode(OverviewDisplayMode.EXPAND); }, title: "Expanded mode", active: this.props.displayMode === OverviewDisplayMode.EXPAND }, "Expand"))),
            React.createElement(ToolbarRightContent, { style: __assign({}, AlignRightStyle) },
                React.createElement(DurationDropdownContainer, { id: "overview-duration", disabled: false, tooltip: 'Time range for overview data' }),
                React.createElement(RefreshContainer, { id: "overview-refresh", handleRefresh: this.props.onRefresh, hideLabel: true }))));
    };
    return OverviewToolbar;
}(React.Component));
export { OverviewToolbar };
var mapStateToProps = function (state) { return ({
    duration: durationSelector(state),
    refreshInterval: refreshIntervalSelector(state)
}); };
var mapDispatchToProps = function (dispatch) {
    return {
        setRefreshInterval: function (refreshInterval) {
            dispatch(UserSettingsActions.setRefreshInterval(refreshInterval));
        }
    };
};
var OverviewToolbarContainer = connect(mapStateToProps, mapDispatchToProps)(OverviewToolbar);
export default OverviewToolbarContainer;
//# sourceMappingURL=OverviewToolbar.js.map