export var AuthStrategy;
(function (AuthStrategy) {
    AuthStrategy["login"] = "login";
    AuthStrategy["anonymous"] = "anonymous";
    AuthStrategy["openshift"] = "openshift";
})(AuthStrategy || (AuthStrategy = {}));
// Stores the result of a computation:
// hold = stop all computation and wait for a side-effect, such as a redirect
// continue = continue...
// success = authentication was a success, session is available
// failure = authentication failed, session is undefined but error is available
export var AuthResult;
(function (AuthResult) {
    AuthResult["HOLD"] = "hold";
    AuthResult["CONTINUE"] = "continue";
    AuthResult["SUCCESS"] = "success";
    AuthResult["FAILURE"] = "failure";
})(AuthResult || (AuthResult = {}));
//# sourceMappingURL=Auth.js.map