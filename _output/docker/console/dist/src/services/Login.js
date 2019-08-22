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
import * as API from './Api';
import moment from 'moment';
import { AuthStrategy, AuthResult } from '../types/Auth';
import authenticationConfig from '../config/AuthenticationConfig';
var AnonymousLogin = /** @class */ (function () {
    function AnonymousLogin() {
    }
    AnonymousLogin.prototype.prepare = function (_info) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, AuthResult.CONTINUE];
            });
        });
    };
    AnonymousLogin.prototype.perform = function (_request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        status: AuthResult.FAILURE,
                        session: {
                            username: API.ANONYMOUS_USER,
                            expiresOn: moment()
                                .add(1, 'd')
                                .toISOString()
                        }
                    }];
            });
        });
    };
    return AnonymousLogin;
}());
var WebLogin = /** @class */ (function () {
    function WebLogin() {
    }
    WebLogin.prototype.prepare = function (_info) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, AuthResult.CONTINUE];
            });
        });
    };
    WebLogin.prototype.perform = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, API.login(request.data)];
                    case 1:
                        session = (_a.sent()).data;
                        return [2 /*return*/, {
                                status: AuthResult.SUCCESS,
                                session: session
                            }];
                }
            });
        });
    };
    return WebLogin;
}());
var OpenshiftLogin = /** @class */ (function () {
    function OpenshiftLogin() {
    }
    OpenshiftLogin.prototype.prepare = function (info) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!info.authorizationEndpoint) {
                    return [2 /*return*/, AuthResult.FAILURE];
                }
                if (window.location.hash.startsWith('#access_token')) {
                    return [2 /*return*/, AuthResult.CONTINUE];
                }
                else {
                    window.location.href = info.authorizationEndpoint;
                    return [2 /*return*/, AuthResult.HOLD];
                }
                return [2 /*return*/];
            });
        });
    };
    OpenshiftLogin.prototype.perform = function (_request) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, API.checkOpenshiftAuth(window.location.hash.substring(1))];
                    case 1:
                        session = (_a.sent()).data;
                        // remove the data that was passed by the OAuth login. In certain error situations this can cause the
                        // page to enter a refresh loop since it tries to reload the page which then tries to reuse the bad token again.
                        history.replaceState('', document.title, window.location.pathname + window.location.search);
                        return [2 /*return*/, {
                                status: AuthResult.SUCCESS,
                                session: session
                            }];
                }
            });
        });
    };
    return OpenshiftLogin;
}());
var LoginDispatcher = /** @class */ (function () {
    function LoginDispatcher() {
        this.strategyMapping = new Map();
        this.strategyMapping.set(AuthStrategy.anonymous, new AnonymousLogin());
        this.strategyMapping.set(AuthStrategy.login, new WebLogin());
        this.strategyMapping.set(AuthStrategy.openshift, new OpenshiftLogin());
    }
    LoginDispatcher.prototype.prepare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, strategy, delay, result, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        info = authenticationConfig;
                        strategy = this.strategyMapping.get(info.strategy);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        delay = function (ms) {
                            if (ms === void 0) { ms = 3000; }
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
                                });
                            });
                        };
                        return [4 /*yield*/, strategy.prepare(info)];
                    case 2:
                        result = _a.sent();
                        if (!(result === AuthResult.HOLD)) return [3 /*break*/, 4];
                        return [4 /*yield*/, delay()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, Promise.reject({
                                status: AuthResult.FAILURE,
                                error: 'Failed to redirect user to authentication page.'
                            })];
                    case 4: return [2 /*return*/, result];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject({ status: AuthResult.FAILURE, error: error_1 })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    LoginDispatcher.prototype.perform = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var strategy, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        strategy = this.strategyMapping.get(authenticationConfig.strategy);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, strategy.perform(request)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, Promise.reject({ status: AuthResult.FAILURE, error: error_2 })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LoginDispatcher;
}());
export { LoginDispatcher };
//# sourceMappingURL=Login.js.map