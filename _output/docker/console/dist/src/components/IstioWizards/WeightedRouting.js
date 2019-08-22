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
import { Button, ListView, ListViewIcon, ListViewItem } from 'patternfly-react';
import Slider from './Slider/Slider';
import { style } from 'typestyle';
import { PfColors } from '../Pf/PfColors';
var wkIconType = 'pf';
var wkIconName = 'bundle';
var validationStyle = style({
    marginBottom: 10,
    color: PfColors.Red100,
    textAlign: 'right'
});
var resetStyle = style({
    marginBottom: 20
});
var listStyle = style({
    marginTop: 10
});
var evenlyButtonStyle = style({
    width: '100%',
    textAlign: 'right'
});
var listHeaderStyle = style({
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: 300,
    color: '#72767b',
    borderTop: '0px !important',
    $nest: {
        '.list-view-pf-main-info': {
            padding: 5
        },
        '.list-group-item-heading': {
            fontWeight: 300,
            textAlign: 'center'
        },
        '.list-group-item-text': {
            textAlign: 'center'
        }
    }
});
var WeightedRouting = /** @class */ (function (_super) {
    __extends(WeightedRouting, _super);
    function WeightedRouting(props) {
        var _this = _super.call(this, props) || this;
        _this.getDefaultWeights = function (workloads) {
            var wkTraffic = workloads.length < 100 ? Math.round(100 / workloads.length) : 0;
            var remainTraffic = workloads.length < 100 ? 100 % workloads.length : 0;
            var wkWeights = workloads.map(function (workload) { return ({
                name: workload.name,
                weight: wkTraffic,
                locked: false,
                maxWeight: 100
            }); });
            if (remainTraffic > 0) {
                wkWeights[wkWeights.length - 1].weight = wkWeights[wkWeights.length - 1].weight + remainTraffic;
            }
            return wkWeights;
        };
        _this.resetState = function () {
            if (_this.props.workloads.length === 0) {
                return;
            }
            _this.setState(function (prevState) {
                return {
                    workloads: prevState.workloads.length === 0 && _this.props.initWeights.length > 0
                        ? _this.props.initWeights
                        : _this.getDefaultWeights(_this.props.workloads)
                };
            }, function () { return _this.props.onChange(_this.checkTotalWeight(), _this.state.workloads, true); });
        };
        _this.onWeight = function (workloadName, newWeight) {
            _this.setState(function (prevState) {
                var nodeId = [];
                var maxWeight = 100;
                // Calculate maxWeight from locked nodes
                for (var i = 0; i < prevState.workloads.length; i++) {
                    if (prevState.workloads[i].locked) {
                        maxWeight -= prevState.workloads[i].weight;
                    }
                }
                // Set new weight; remember rest of the nodes
                for (var i = 0; i < prevState.workloads.length; i++) {
                    if (prevState.workloads[i].name === workloadName) {
                        prevState.workloads[i].weight = newWeight;
                        maxWeight -= newWeight;
                    }
                    else if (!prevState.workloads[i].locked) {
                        // Only adjust those nodes that are not locked
                        nodeId.push(i);
                    }
                }
                // Distribute pending weights
                var sumWeights = 0;
                for (var j = 0; j < nodeId.length; j++) {
                    if (sumWeights + prevState.workloads[nodeId[j]].weight > maxWeight) {
                        prevState.workloads[nodeId[j]].weight = maxWeight - sumWeights;
                    }
                    sumWeights += prevState.workloads[nodeId[j]].weight;
                }
                // Adjust last element
                if (nodeId.length > 0 && sumWeights < maxWeight) {
                    prevState.workloads[nodeId[nodeId.length - 1]].weight += maxWeight - sumWeights;
                }
                return {
                    workloads: prevState.workloads
                };
            }, function () { return _this.props.onChange(_this.checkTotalWeight(), _this.state.workloads, false); });
        };
        _this.onLock = function (workloadName, locked) {
            _this.setState(function (prevState) {
                var maxWeights = 100;
                for (var i = 0; i < prevState.workloads.length; i++) {
                    if (prevState.workloads[i].name === workloadName) {
                        prevState.workloads[i].locked = locked;
                    }
                    // Calculate maxWeights from locked nodes
                    if (prevState.workloads[i].locked) {
                        maxWeights -= prevState.workloads[i].weight;
                    }
                }
                // Update non locked nodes maxWeight
                for (var i = 0; i < prevState.workloads.length; i++) {
                    if (!prevState.workloads[i].locked) {
                        prevState.workloads[i].maxWeight = maxWeights;
                    }
                }
                return {
                    workloads: prevState.workloads
                };
            });
        };
        _this.checkTotalWeight = function () {
            // Check all weights are equal to 100
            return _this.state.workloads.map(function (w) { return w.weight; }).reduce(function (a, b) { return a + b; }, 0) === 100;
        };
        _this.state = {
            workloads: []
        };
        return _this;
    }
    WeightedRouting.prototype.componentDidMount = function () {
        this.resetState();
    };
    WeightedRouting.prototype.render = function () {
        var _this = this;
        var isValid = this.checkTotalWeight();
        return (React.createElement(React.Fragment, null,
            React.createElement(ListView, { className: listStyle },
                React.createElement(ListViewItem, { className: listHeaderStyle, heading: 'Workload', description: 'Traffic Weight' }),
                this.state.workloads.map(function (workload, id) {
                    return (React.createElement(ListViewItem, { key: 'workload-' + id, leftContent: React.createElement(ListViewIcon, { type: wkIconType, name: wkIconName }), heading: workload.name, description: React.createElement(Slider, { id: 'slider-' + workload.name, key: 'slider-' + workload.name, tooltip: true, input: true, inputFormat: "%", value: workload.weight, min: 0, max: workload.maxWeight, maxLimit: 100, onSlide: function (value) {
                                _this.onWeight(workload.name, value);
                            }, locked: _this.state.workloads.length > 1 ? workload.locked : true, showLock: _this.state.workloads.length > 2, onLock: function (locked) { return _this.onLock(workload.name, locked); } }) }));
                })),
            this.props.workloads.length > 1 && (React.createElement("div", { className: evenlyButtonStyle },
                React.createElement(Button, { className: resetStyle, onClick: function () { return _this.resetState(); } }, "Evenly distribute traffic"))),
            !isValid && React.createElement("div", { className: validationStyle }, "The sum of all weights must be 100 %")));
    };
    return WeightedRouting;
}(React.Component));
export default WeightedRouting;
//# sourceMappingURL=WeightedRouting.js.map