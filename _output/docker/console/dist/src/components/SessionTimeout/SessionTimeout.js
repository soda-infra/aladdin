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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as React from 'react';
import { Modal, Button, Icon, Row, Col } from 'patternfly-react';
import { AuthStrategy } from '../../types/Auth';
import * as API from '../../services/Api';
import authenticationConfig from '../../config/AuthenticationConfig';
var SessionTimeout = /** @class */ (function (_super) {
    __extends(SessionTimeout, _super);
    function SessionTimeout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.extendSessionHandler = function () { return __awaiter(_this, void 0, void 0, function () {
            var session, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, API.extendSession()];
                    case 1:
                        session = _a.sent();
                        this.props.onExtendSession(session.data);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.textForAuthStrategy = function (strategy) {
            var line1 = _this.props.timeOutCountDown <= 0
                ? 'Your session has expired.'
                : "Your session will expire in " + _this.props.timeOutCountDown.toFixed() + " seconds.";
            var line2 = strategy === AuthStrategy.openshift
                ? 'You will need to re-login with your cluster credentials. Please save your changes, if any.'
                : 'Would you like to extend your session?';
            return (React.createElement("p", { className: 'lead' },
                line1,
                React.createElement("br", null),
                line2));
        };
        return _this;
    }
    SessionTimeout.prototype.render = function () {
        return (React.createElement(Modal, { backdrop: "static", className: 'message-dialog-pf', show: this.props.show, enforceFocus: true, "aria-modal": true },
            React.createElement(Modal.Body, null,
                React.createElement(Row, { style: { paddingTop: '25px' } },
                    React.createElement(Col, { xs: 12, sm: 1, md: 1, lg: 1 }),
                    React.createElement(Col, { xs: 12, sm: 1, md: 1, lg: 1, style: { paddingLeft: '10px' } },
                        React.createElement(Icon, { name: "warning-triangle-o", type: "pf", style: { fontSize: '48px' } })),
                    React.createElement(Col, { xs: 12, sm: 10, md: 10, lg: 10 }, this.textForAuthStrategy(authenticationConfig.strategy)))),
            React.createElement(Modal.Footer, null,
                React.createElement(React.Fragment, null,
                    React.createElement(Button, { bsStyle: 'default', onClick: this.props.onLogout }, "Log Out"),
                    authenticationConfig.strategy === AuthStrategy.login ? (React.createElement(Button, { autoFocus: true, bsStyle: 'primary', onClick: this.extendSessionHandler }, "Continue Session")) : (React.createElement(Button, { autoFocus: true, bsStyle: 'primary', onClick: this.props.onDismiss }, "OK"))))));
    };
    return SessionTimeout;
}(React.Component));
export { SessionTimeout };
//# sourceMappingURL=SessionTimeout.js.map