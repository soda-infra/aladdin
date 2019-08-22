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
import { OverlayTrigger, Popover } from 'patternfly-react';
import { HealthDetails } from './HealthDetails';
import * as H from '../../types/Health';
import { createIcon } from './Helper';
import './Health.css';
export var DisplayMode;
(function (DisplayMode) {
    DisplayMode[DisplayMode["LARGE"] = 0] = "LARGE";
    DisplayMode[DisplayMode["SMALL"] = 1] = "SMALL";
})(DisplayMode || (DisplayMode = {}));
var HealthIndicator = /** @class */ (function (_super) {
    __extends(HealthIndicator, _super);
    function HealthIndicator(props) {
        var _this = _super.call(this, props) || this;
        _this.state = HealthIndicator.getDerivedStateFromProps(props);
        return _this;
    }
    HealthIndicator.getDerivedStateFromProps = function (props) {
        return {
            globalStatus: props.health ? props.health.getGlobalStatus() : H.NA
        };
    };
    HealthIndicator.prototype.render = function () {
        if (this.props.health) {
            if (this.props.mode === DisplayMode.SMALL) {
                return this.renderSmall(this.props.health);
            }
            else {
                return this.renderLarge(this.props.health);
            }
        }
        return React.createElement("span", null);
    };
    HealthIndicator.prototype.renderSmall = function (health) {
        return this.renderPopover(health, createIcon(this.state.globalStatus, 'sm'));
    };
    HealthIndicator.prototype.renderLarge = function (health) {
        var spanStyle = {
            color: this.state.globalStatus.color,
            fontWeight: 'bold',
            position: 'relative',
            top: -9,
            left: 10
        };
        return (React.createElement(React.Fragment, null,
            createIcon(this.state.globalStatus, 'lg'),
            React.createElement("span", { style: spanStyle }, this.state.globalStatus.name),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(HealthDetails, { health: health })));
    };
    HealthIndicator.prototype.renderPopover = function (health, icon) {
        var popover = (React.createElement(Popover, { id: this.props.id + '-health-tooltip', title: this.state.globalStatus.name },
            React.createElement(HealthDetails, { health: health })));
        return (React.createElement(OverlayTrigger, { placement: this.props.tooltipPlacement || 'right', overlay: popover, trigger: ['hover', 'focus'], rootClose: false }, icon));
    };
    return HealthIndicator;
}(React.PureComponent));
export { HealthIndicator };
//# sourceMappingURL=HealthIndicator.js.map