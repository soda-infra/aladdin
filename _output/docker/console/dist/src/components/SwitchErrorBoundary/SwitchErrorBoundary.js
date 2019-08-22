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
import { Route, Switch } from 'react-router-dom';
var SwitchErrorBoundary = /** @class */ (function (_super) {
    __extends(SwitchErrorBoundary, _super);
    function SwitchErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        _this.show = false;
        return _this;
    }
    SwitchErrorBoundary.prototype.componentDidCatch = function (error, info) {
        if (this.props.onError) {
            this.props.onError(error, info);
        }
        this.setState({ hasError: true });
    };
    SwitchErrorBoundary.prototype.componentDidUpdate = function () {
        if (this.state.hasError) {
            if (this.show) {
                this.setState({ hasError: false });
            }
            this.show = !this.show;
        }
    };
    SwitchErrorBoundary.prototype.render = function () {
        return (React.createElement(Switch, null,
            this.state.hasError && React.createElement(Route, { component: this.props.fallBackComponent }),
            this.props.children));
    };
    return SwitchErrorBoundary;
}(React.Component));
export default SwitchErrorBoundary;
//# sourceMappingURL=SwitchErrorBoundary.js.map