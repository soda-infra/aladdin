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
import { Alert, TabPane } from 'patternfly-react';
import ErrorBoundary from './ErrorBoundary';
var withErrorBoundary = function (WrappedComponent) {
    return /** @class */ (function (_super) {
        __extends(WithErrorBoundary, _super);
        function WithErrorBoundary() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WithErrorBoundary.prototype.alert = function () {
            return (React.createElement("div", { className: "card-pf-body" },
                React.createElement(Alert, { type: "warning" }, this.props.message || 'Something went wrong rending this component')));
        };
        WithErrorBoundary.prototype.render = function () {
            return (React.createElement(WrappedComponent, __assign({}, this.props),
                React.createElement(ErrorBoundary, { fallBackComponent: this.alert() }, this.props.children)));
        };
        return WithErrorBoundary;
    }(React.Component));
};
export var TabPaneWithErrorBoundary = withErrorBoundary(TabPane);
//# sourceMappingURL=WithErrorBoundary.js.map