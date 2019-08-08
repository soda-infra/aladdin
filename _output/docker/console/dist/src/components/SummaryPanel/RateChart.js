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
import { StackedBarChart } from 'patternfly-react';
import { PfColors } from '../../components/Pf/PfColors';
import { SUMMARY_PANEL_CHART_WIDTH } from '../../types/Graph';
var RateChartGrpc = /** @class */ (function (_super) {
    __extends(RateChartGrpc, _super);
    function RateChartGrpc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RateChartGrpc.prototype.render = function () {
        return (React.createElement(StackedBarChart, { size: { height: this.props.height, width: this.props.width }, legend: { show: this.props.showLegend, position: this.props.legendPos }, grid: {
                x: {
                    show: false
                },
                y: {
                    show: true
                }
            }, axis: {
                rotated: true,
                x: {
                    categories: [''],
                    type: 'category'
                },
                y: {
                    show: true,
                    inner: false,
                    label: {
                        text: '%',
                        position: 'inner-right'
                    },
                    min: 0,
                    max: 100,
                    tick: {
                        values: [0, 25, 50, 75, 100]
                    },
                    padding: {
                        top: 20,
                        bottom: 0
                    }
                }
            }, data: {
                groups: [['OK', 'Err']],
                columns: [['OK', this.props.percentOK], ['Err', this.props.percentErr]],
                // order: 'asc',
                colors: {
                    OK: PfColors.Green400,
                    Err: PfColors.Red100
                }
            } }));
    };
    RateChartGrpc.defaultProps = {
        height: 100,
        legendPos: 'bottom',
        percentErr: 0,
        percentOK: 0,
        showLegend: true,
        width: SUMMARY_PANEL_CHART_WIDTH
    };
    return RateChartGrpc;
}(React.Component));
export { RateChartGrpc };
var RateChartHttp = /** @class */ (function (_super) {
    __extends(RateChartHttp, _super);
    function RateChartHttp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RateChartHttp.prototype.render = function () {
        return (React.createElement(StackedBarChart, { size: { height: this.props.height, width: this.props.width }, legend: { show: this.props.showLegend, position: this.props.legendPos }, grid: {
                x: {
                    show: false
                },
                y: {
                    show: true
                }
            }, axis: {
                rotated: true,
                x: {
                    categories: [''],
                    type: 'category'
                },
                y: {
                    show: true,
                    inner: false,
                    label: {
                        text: '%',
                        position: 'inner-right'
                    },
                    min: 0,
                    max: 100,
                    tick: {
                        values: [0, 25, 50, 75, 100]
                    },
                    padding: {
                        top: 20,
                        bottom: 0
                    }
                }
            }, data: {
                groups: [['OK', '3xx', '4xx', '5xx']],
                columns: [
                    ['OK', this.props.percent2xx],
                    ['3xx', this.props.percent3xx],
                    ['4xx', this.props.percent4xx],
                    ['5xx', this.props.percent5xx]
                ],
                // order: 'asc',
                colors: {
                    OK: PfColors.Green400,
                    '3xx': PfColors.Blue,
                    '4xx': PfColors.Orange400,
                    '5xx': PfColors.Red100
                }
            } }));
    };
    RateChartHttp.defaultProps = {
        height: 100,
        legendPos: 'bottom',
        percent2xx: 0,
        percent3xx: 0,
        percent4xx: 0,
        percent5xx: 0,
        showLegend: true,
        width: SUMMARY_PANEL_CHART_WIDTH
    };
    return RateChartHttp;
}(React.Component));
export { RateChartHttp };
//# sourceMappingURL=RateChart.js.map