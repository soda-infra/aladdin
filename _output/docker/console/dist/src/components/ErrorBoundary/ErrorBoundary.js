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
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.cleanError = function () {
            _this.setState(function (prevState) {
                if (prevState.hasError) {
                    return { hasError: false };
                }
                return null;
            });
        };
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.prototype.componentDidCatch = function (error, info) {
        if (this.props.onError) {
            this.props.onError(error, info);
        }
        this.setState({ hasError: true });
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            return this.props.fallBackComponent;
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map