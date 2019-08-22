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
import { Breadcrumb, Card, CardBody, CardGrid, CardTitle, Col, EmptyState, EmptyStateInfo, EmptyStateTitle, Row } from 'patternfly-react';
import { style } from 'typestyle';
import _ from 'lodash';
import { FilterSelected } from '../../components/Filters/StatefulFilters';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import * as API from '../../services/Api';
import { DEGRADED, FAILURE, HEALTHY } from '../../types/Health';
import { PromisesRegistry } from '../../utils/CancelablePromises';
import OverviewToolbarContainer, { OverviewToolbar, OverviewDisplayMode } from './OverviewToolbar';
import OverviewCardContent from './OverviewCardContent';
import NamespaceMTLSStatusContainer from '../../components/MTls/NamespaceMTLSStatus';
import OverviewCardContentExpanded from './OverviewCardContentExpanded';
import { computePrometheusRateParams } from '../../services/Prometheus';
import OverviewCardLinks from './OverviewCardLinks';
import { connect } from 'react-redux';
import { meshWideMTLSStatusSelector } from '../../store/Selectors';
import { nsWideMTLSStatus } from '../../types/TLSStatus';
import { switchType } from './OverviewHelper';
import * as Sorts from './Sorts';
import * as Filters from './Filters';
var cardGridStyle = style({ width: '100%' });
var emptyStateStyle = style({
    height: '98%',
    marginRight: 5,
    marginBottom: 10,
    marginTop: 10
});
var OverviewPage = /** @class */ (function (_super) {
    __extends(OverviewPage, _super);
    function OverviewPage(props) {
        var _this = _super.call(this, props) || this;
        _this.promises = new PromisesRegistry();
        _this.displayModeSet = false;
        _this.load = function () {
            _this.promises.cancelAll();
            _this.promises
                .register('namespaces', API.getNamespaces())
                .then(function (namespacesResponse) {
                var nameFilters = FilterSelected.getSelected().filter(function (f) { return f.category === Filters.nameFilter.title; });
                var allNamespaces = namespacesResponse.data
                    .filter(function (ns) {
                    return nameFilters.length === 0 || nameFilters.some(function (f) { return ns.name.includes(f.value); });
                })
                    .map(function (ns) {
                    var previous = _this.state.namespaces.find(function (prev) { return prev.name === ns.name; });
                    return {
                        name: ns.name,
                        status: previous ? previous.status : undefined,
                        tlsStatus: previous ? previous.tlsStatus : undefined,
                        metrics: previous ? previous.metrics : undefined
                    };
                });
                var isAscending = ListPagesHelper.isCurrentSortAscending();
                var sortField = ListPagesHelper.currentSortField(Sorts.sortFields);
                var type = OverviewToolbar.currentOverviewType();
                var displayMode = _this.displayModeSet
                    ? _this.state.displayMode
                    : allNamespaces.length > 16
                        ? OverviewDisplayMode.COMPACT
                        : OverviewDisplayMode.EXPAND;
                // Set state before actually fetching health
                _this.setState({
                    type: type,
                    namespaces: Sorts.sortFunc(allNamespaces, sortField, isAscending),
                    displayMode: displayMode
                }, function () {
                    _this.fetchHealth(isAscending, sortField, type);
                    _this.fetchTLS(isAscending, sortField);
                    if (displayMode === OverviewDisplayMode.EXPAND) {
                        _this.fetchMetrics();
                    }
                });
            })
                .catch(function (namespacesError) { return _this.handleAxiosError('Could not fetch namespace list', namespacesError); });
        };
        _this.sort = function (sortField, isAscending) {
            var sorted = Sorts.sortFunc(_this.state.namespaces, sortField, isAscending);
            _this.setState({ namespaces: sorted });
        };
        _this.setDisplayMode = function (mode) {
            _this.displayModeSet = true;
            _this.setState({ displayMode: mode });
            if (mode === OverviewDisplayMode.EXPAND) {
                // Load metrics
                _this.fetchMetrics();
            }
        };
        _this.state = {
            namespaces: [],
            type: OverviewToolbar.currentOverviewType(),
            displayMode: OverviewDisplayMode.EXPAND
        };
        return _this;
    }
    OverviewPage.prototype.componentDidMount = function () {
        this.load();
    };
    OverviewPage.prototype.componentWillUnmount = function () {
        this.promises.cancelAll();
    };
    OverviewPage.prototype.sortFields = function () {
        return Sorts.sortFields;
    };
    OverviewPage.prototype.fetchHealth = function (isAscending, sortField, type) {
        var _this = this;
        var duration = ListPagesHelper.currentDuration();
        // debounce async for back-pressure, ten by ten
        _.chunk(this.state.namespaces, 10).forEach(function (chunk) {
            _this.promises
                .registerChained('healthchunks', undefined, function () { return _this.fetchHealthChunk(chunk, duration, type); })
                .then(function () {
                _this.setState(function (prevState) {
                    var newNamespaces = prevState.namespaces.slice();
                    if (sortField.id === 'health') {
                        newNamespaces = Sorts.sortFunc(newNamespaces, sortField, isAscending);
                    }
                    return { namespaces: newNamespaces };
                });
            });
        });
    };
    OverviewPage.prototype.fetchHealthChunk = function (chunk, duration, type) {
        var _this = this;
        var apiFunc = switchType(type, API.getNamespaceAppHealth, API.getNamespaceServiceHealth, API.getNamespaceWorkloadHealth);
        return Promise.all(chunk.map(function (nsInfo) {
            var healthPromise = apiFunc(nsInfo.name, duration);
            return healthPromise.then(function (rs) { return ({ health: rs, nsInfo: nsInfo }); });
        }))
            .then(function (results) {
            results.forEach(function (result) {
                var nsStatus = {
                    inError: [],
                    inWarning: [],
                    inSuccess: [],
                    notAvailable: []
                };
                Object.keys(result.health).forEach(function (item) {
                    var health = result.health[item];
                    var status = health.getGlobalStatus();
                    if (status === FAILURE) {
                        nsStatus.inError.push(item);
                    }
                    else if (status === DEGRADED) {
                        nsStatus.inWarning.push(item);
                    }
                    else if (status === HEALTHY) {
                        nsStatus.inSuccess.push(item);
                    }
                    else {
                        nsStatus.notAvailable.push(item);
                    }
                });
                result.nsInfo.status = nsStatus;
            });
        })
            .catch(function (err) { return _this.handleAxiosError('Could not fetch health', err); });
    };
    OverviewPage.prototype.fetchMetrics = function () {
        var _this = this;
        var duration = ListPagesHelper.currentDuration();
        // debounce async for back-pressure, ten by ten
        _.chunk(this.state.namespaces, 10).forEach(function (chunk) {
            _this.promises
                .registerChained('metricschunks', undefined, function () { return _this.fetchMetricsChunk(chunk, duration); })
                .then(function () {
                _this.setState(function (prevState) {
                    return { namespaces: prevState.namespaces.slice() };
                });
            });
        });
    };
    OverviewPage.prototype.fetchMetricsChunk = function (chunk, duration) {
        var _this = this;
        var rateParams = computePrometheusRateParams(duration, 10);
        var optionsIn = {
            filters: ['request_count'],
            duration: duration,
            step: rateParams.step,
            rateInterval: rateParams.rateInterval,
            direction: 'inbound',
            reporter: 'destination'
        };
        return Promise.all(chunk.map(function (nsInfo) {
            return API.getNamespaceMetrics(nsInfo.name, optionsIn).then(function (rs) {
                nsInfo.metrics = undefined;
                if (rs.data.metrics.hasOwnProperty('request_count')) {
                    nsInfo.metrics = rs.data.metrics.request_count.matrix;
                }
                return nsInfo;
            });
        })).catch(function (err) { return _this.handleAxiosError('Could not fetch health', err); });
    };
    OverviewPage.prototype.fetchTLS = function (isAscending, sortField) {
        var _this = this;
        _.chunk(this.state.namespaces, 10).forEach(function (chunk) {
            _this.promises
                .registerChained('tlschunks', undefined, function () { return _this.fetchTLSChunk(chunk); })
                .then(function () {
                _this.setState(function (prevState) {
                    var newNamespaces = prevState.namespaces.slice();
                    if (sortField.id === 'mtls') {
                        newNamespaces = Sorts.sortFunc(newNamespaces, sortField, isAscending);
                    }
                    return { namespaces: newNamespaces };
                });
            });
        });
    };
    OverviewPage.prototype.fetchTLSChunk = function (chunk) {
        var _this = this;
        return Promise.all(chunk.map(function (nsInfo) {
            return API.getNamespaceTls(nsInfo.name).then(function (rs) { return ({ status: rs.data, nsInfo: nsInfo }); });
        }))
            .then(function (results) {
            results.forEach(function (result) {
                result.nsInfo.tlsStatus = {
                    status: nsWideMTLSStatus(result.status.status, _this.props.meshStatus)
                };
            });
        })
            .catch(function (err) { return _this.handleAxiosError('Could not fetch TLS status', err); });
    };
    OverviewPage.prototype.handleAxiosError = function (message, error) {
        ListPagesHelper.handleError(API.getErrorMsg(message, error));
    };
    OverviewPage.prototype.render = function () {
        var _this = this;
        var _a = this.state.displayMode === OverviewDisplayMode.COMPACT ? [6, 3, 3] : [12, 6, 4], xs = _a[0], sm = _a[1], md = _a[2];
        var filteredNamespaces = Filters.filterBy(this.state.namespaces, FilterSelected.getSelected());
        return (React.createElement(React.Fragment, null,
            React.createElement(Breadcrumb, { title: true },
                React.createElement(Breadcrumb.Item, { active: true }, "Namespaces")),
            React.createElement(OverviewToolbarContainer, { onRefresh: this.load, onError: ListPagesHelper.handleError, sort: this.sort, displayMode: this.state.displayMode, setDisplayMode: this.setDisplayMode }),
            filteredNamespaces.length > 0 ? (React.createElement("div", { className: "cards-pf" },
                React.createElement(CardGrid, { matchHeight: true, className: cardGridStyle },
                    React.createElement(Row, { style: { marginBottom: '20px', marginTop: '20px' } }, filteredNamespaces.map(function (ns) {
                        return (React.createElement(Col, { xs: xs, sm: sm, md: md, key: ns.name },
                            React.createElement(Card, { matchHeight: true, accented: true, aggregated: true },
                                React.createElement(CardTitle, null,
                                    ns.tlsStatus ? React.createElement(NamespaceMTLSStatusContainer, { status: ns.tlsStatus.status }) : undefined,
                                    ns.name),
                                React.createElement(CardBody, null,
                                    _this.renderStatuses(ns),
                                    React.createElement(OverviewCardLinks, { name: ns.name })))));
                    }))))) : (React.createElement(EmptyState, { className: emptyStateStyle },
                React.createElement(EmptyStateTitle, null, "No unfiltered namespaces"),
                React.createElement(EmptyStateInfo, null, "Either all namespaces are being filtered or the user has no permission to access namespaces.")))));
    };
    OverviewPage.prototype.renderStatuses = function (ns) {
        if (ns.status) {
            if (this.state.displayMode === OverviewDisplayMode.COMPACT) {
                return React.createElement(OverviewCardContent, { key: ns.name, name: ns.name, status: ns.status, type: this.state.type });
            }
            return (React.createElement(OverviewCardContentExpanded, { key: ns.name, name: ns.name, duration: ListPagesHelper.currentDuration(), status: ns.status, type: this.state.type, metrics: ns.metrics }));
        }
        return React.createElement("div", { style: { height: 70 } });
    };
    return OverviewPage;
}(React.Component));
export { OverviewPage };
var mapStateToProps = function (state) { return ({
    meshStatus: meshWideMTLSStatusSelector(state)
}); };
var OverviewPageContainer = connect(mapStateToProps)(OverviewPage);
export default OverviewPageContainer;
//# sourceMappingURL=OverviewPage.js.map