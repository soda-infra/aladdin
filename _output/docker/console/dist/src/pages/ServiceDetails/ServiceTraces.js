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
import { JaegerIntegration } from '../../components/JaegerIntegration';
var ServiceTraces = /** @class */ (function (_super) {
    __extends(ServiceTraces, _super);
    function ServiceTraces() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServiceTraces.prototype.render = function () {
        var serviceSelected = this.props.service + "." + this.props.namespace;
        var tags = this.props.errorTags ? 'error=true' : '';
        return React.createElement(JaegerIntegration, { serviceSelected: serviceSelected, tagsValue: tags, disableSelectorNs: true });
    };
    return ServiceTraces;
}(React.Component));
export default ServiceTraces;
//# sourceMappingURL=ServiceTraces.js.map