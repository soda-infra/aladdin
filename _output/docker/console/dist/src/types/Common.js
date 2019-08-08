export var KEY_CODES = {
    TAB_KEY: 9,
    ENTER_KEY: 13,
    ESCAPE_KEY: 27
};
export var HTTP_CODES = {
    OK: 200,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    REQUEST_FAILED: 422,
    INTERNAL_SERVER: 500,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};
export var HTTP_VERBS;
(function (HTTP_VERBS) {
    HTTP_VERBS["DELETE"] = "DELETE";
    HTTP_VERBS["GET"] = "get";
    HTTP_VERBS["PATCH"] = "patch";
    HTTP_VERBS["POST"] = "post";
    HTTP_VERBS["PUT"] = "put";
})(HTTP_VERBS || (HTTP_VERBS = {}));
export var MILLISECONDS = 1000;
export var UNIT_TIME = {
    SECOND: 1,
    MINUTE: 60,
    HOUR: 3600,
    DAY: 24 * 3600
};
//# sourceMappingURL=Common.js.map