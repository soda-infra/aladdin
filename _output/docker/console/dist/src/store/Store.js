export var LoginStatus;
(function (LoginStatus) {
    LoginStatus[LoginStatus["logging"] = 0] = "logging";
    LoginStatus[LoginStatus["loggedIn"] = 1] = "loggedIn";
    LoginStatus[LoginStatus["loggedOut"] = 2] = "loggedOut";
    LoginStatus[LoginStatus["error"] = 3] = "error";
    LoginStatus[LoginStatus["expired"] = 4] = "expired";
})(LoginStatus || (LoginStatus = {}));
//# sourceMappingURL=Store.js.map