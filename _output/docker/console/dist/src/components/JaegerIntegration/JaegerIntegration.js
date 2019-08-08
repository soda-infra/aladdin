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
import { JaegerToolbar } from './JaegerToolbar';
import { connect } from 'react-redux';
import { JaegerURLSearch } from './RouteHelper';
import JaegerTracesIframe from './JaegerTracesIframe';
var JaegerIntegration = /** @class */ (function (_super) {
    __extends(JaegerIntegration, _super);
    function JaegerIntegration(props) {
        var _this = _super.call(this, props) || this;
        _this.updateURL = function (options) {
            var url = new JaegerURLSearch(_this.props.urlJaeger);
            _this.setState({ url: url.createRoute(options) });
        };
        _this.state = { url: '' };
        return _this;
    }
    JaegerIntegration.prototype.render = function () {
        var _a = this.props, serviceSelected = _a.serviceSelected, tagsValue = _a.tagsValue, disableSelectorNs = _a.disableSelectorNs;
        return (React.createElement("div", { style: { marginTop: '10px' } },
            React.createElement(JaegerToolbar, { updateURL: this.updateURL, serviceSelected: serviceSelected, tagsValue: tagsValue, disableSelectorNs: disableSelectorNs }),
            React.createElement(JaegerTracesIframe, { url: this.state.url })));
    };
    return JaegerIntegration;
}(React.Component));
export { JaegerIntegration };
var mapStateToProps = function (state) {
    return {
        urlJaeger: state.jaegerState ? state.jaegerState.jaegerURL : ''
    };
};
export var JaegerIntegrationContainer = connect(mapStateToProps)(JaegerIntegration);
//# sourceMappingURL=JaegerIntegration.js.map