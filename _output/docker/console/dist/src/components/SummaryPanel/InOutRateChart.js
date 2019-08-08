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
var InOutRateChartGrpc = /** @class */ (function (_super) {
    __extends(InOutRateChartGrpc, _super);
    function InOutRateChartGrpc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InOutRateChartGrpc.prototype.render = function () {
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
                    categories: ['In', 'Out'],
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
                columns: [
                    ['OK', this.props.percentOkIn, this.props.percentOkOut],
                    ['Err', this.props.percentErrIn, this.props.percentErrOut]
                ],
                // order: 'asc',
                colors: {
                    OK: PfColors.Green400,
                    Err: PfColors.Red100
                }
            } }));
    };
    InOutRateChartGrpc.defaultProps = {
        height: 150,
        legendPos: 'bottom',
        percentOkIn: 0,
        percentErrIn: 0,
        percentOkOut: 0,
        percentErrOut: 0,
        showLegend: true,
        width: SUMMARY_PANEL_CHART_WIDTH
    };
    return InOutRateChartGrpc;
}(React.Component));
export { InOutRateChartGrpc };
var InOutRateChartHttp = /** @class */ (function (_super) {
    __extends(InOutRateChartHttp, _super);
    function InOutRateChartHttp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InOutRateChartHttp.prototype.render = function () {
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
                    categories: ['In', 'Out'],
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
                    ['OK', this.props.percent2xxIn, this.props.percent2xxOut],
                    ['3xx', this.props.percent3xxIn, this.props.percent3xxOut],
                    ['4xx', this.props.percent4xxIn, this.props.percent4xxOut],
                    ['5xx', this.props.percent5xxIn, this.props.percent5xxOut]
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
    InOutRateChartHttp.defaultProps = {
        height: 150,
        legendPos: 'bottom',
        percent2xxIn: 0,
        percent3xxIn: 0,
        percent4xxIn: 0,
        percent5xxIn: 0,
        percent2xxOut: 0,
        percent3xxOut: 0,
        percent4xxOut: 0,
        percent5xxOut: 0,
        showLegend: true,
        width: SUMMARY_PANEL_CHART_WIDTH
    };
    return InOutRateChartHttp;
}(React.Component));
export { InOutRateChartHttp };
//# sourceMappingURL=InOutRateChart.js.map