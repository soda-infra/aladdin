export var isKioskMode = function () {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('kiosk') === 'true';
};
export var getFocusSelector = function () {
    return new URLSearchParams(window.location.search).get('focusSelector') || undefined;
};
//# sourceMappingURL=SearchParamUtils.js.map