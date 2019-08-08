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
import { Col, ControlLabel, Form, FormControl, FormGroup, HelpBlock } from 'patternfly-react';
var VirtualServiceHosts = /** @class */ (function (_super) {
    __extends(VirtualServiceHosts, _super);
    function VirtualServiceHosts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VirtualServiceHosts.prototype.render = function () {
        var _this = this;
        var vsHosts = this.props.vsHosts.length > 0 ? this.props.vsHosts.join(',') : '';
        return (React.createElement(Form, { horizontal: true, onSubmit: function (e) { return e.preventDefault(); } },
            React.createElement(FormGroup, { controlId: "vsHosts" },
                React.createElement(Col, { componentClass: ControlLabel, sm: 3 }, "VirtualService Hosts"),
                React.createElement(Col, { sm: 9 },
                    React.createElement(FormControl, { type: "text", value: vsHosts, onChange: function (e) { return _this.props.onVsHostsChange(true, e.target.value.split(',')); } }),
                    React.createElement(HelpBlock, null, "The destination hosts to which traffic is being sent. Enter one or multiple hosts separated by comma.")))));
    };
    return VirtualServiceHosts;
}(React.Component));
export default VirtualServiceHosts;
//# sourceMappingURL=VirtualServiceHosts.js.map