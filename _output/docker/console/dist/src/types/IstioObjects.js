// Sidecar resource https://preliminary.istio.io/docs/reference/config/networking/v1alpha3/sidecar
export var CaptureMode;
(function (CaptureMode) {
    CaptureMode["DEFAULT"] = "DEFAULT";
    CaptureMode["IPTABLES"] = "IPTABLES";
    CaptureMode["NONE"] = "NONE";
})(CaptureMode || (CaptureMode = {}));
export var MutualTlsMode;
(function (MutualTlsMode) {
    MutualTlsMode["STRICT"] = "STRICT";
    MutualTlsMode["PERMISSIVE"] = "PERMISSIVE";
})(MutualTlsMode || (MutualTlsMode = {}));
export var PrincipalBinding;
(function (PrincipalBinding) {
    PrincipalBinding["USE_PEER"] = "USE_PEER";
    PrincipalBinding["USE_ORIGIN"] = "USE_ORIGIN";
})(PrincipalBinding || (PrincipalBinding = {}));
//# sourceMappingURL=IstioObjects.js.map