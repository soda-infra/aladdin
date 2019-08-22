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
import { connect } from 'react-redux';
import { Modal, Icon, Button, Alert } from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { style } from 'typestyle';
import _ from 'lodash';
import beautify from 'json-beautify';
import authenticationConfig from '../../config/AuthenticationConfig';
import { serverConfig } from '../../config';
var CopyStatus;
(function (CopyStatus) {
    CopyStatus[CopyStatus["NOT_COPIED"] = 0] = "NOT_COPIED";
    CopyStatus[CopyStatus["COPIED"] = 1] = "COPIED";
    CopyStatus[CopyStatus["OLD_COPY"] = 2] = "OLD_COPY"; // We copied the prev output, but there are changes in the KialiAppState
})(CopyStatus || (CopyStatus = {}));
var textAreaStyle = style({
    width: '100%',
    height: '200px',
    minHeight: '200px',
    resize: 'vertical'
});
var copyToClipboardOptions = {
    message: 'We failed to automatically copy the text, please use: #{key}, Enter\t'
};
var DebugInformation = /** @class */ (function (_super) {
    __extends(DebugInformation, _super);
    function DebugInformation(props) {
        var _this = _super.call(this, props) || this;
        _this.open = function () {
            _this.setState({ show: true, copyStatus: CopyStatus.NOT_COPIED });
        };
        _this.close = function () {
            _this.setState({ show: false });
        };
        _this.copyCallback = function (_text, result) {
            _this.textareaRef.current.select();
            _this.setState({ copyStatus: result ? CopyStatus.COPIED : CopyStatus.NOT_COPIED });
        };
        _this.hideAlert = function () {
            _this.setState({ copyStatus: CopyStatus.NOT_COPIED });
        };
        _this.textareaRef = React.createRef();
        _this.state = { show: false, copyStatus: CopyStatus.NOT_COPIED };
        return _this;
    }
    DebugInformation.prototype.componentDidUpdate = function (prevProps, _prevState) {
        if (this.props.appState !== prevProps.appState && this.state.copyStatus === CopyStatus.COPIED) {
            this.setState({ copyStatus: CopyStatus.OLD_COPY });
        }
    };
    DebugInformation.prototype.render = function () {
        var _this = this;
        var renderDebugInformation = _.memoize(function () {
            var debugInformation = {
                backendConfigs: {
                    authenticationConfig: authenticationConfig,
                    computedServerConfig: serverConfig
                },
                currentURL: window.location.href,
                reduxState: _this.props.appState
            };
            return beautify(debugInformation, function (key, value) {
                // We have to patch some runtime properties  we don't want to serialize
                if (['cyRef', 'summaryTarget', 'token', 'username'].includes(key)) {
                    return null;
                }
                return value;
            }, 2);
        });
        if (!this.state.show) {
            return null;
        }
        return (React.createElement(Modal, { show: this.state.show, onHide: this.close },
            React.createElement(Modal.Header, null,
                React.createElement("button", { className: "close", onClick: this.close, "aria-hidden": "true", "aria-label": "Close" },
                    React.createElement(Icon, { type: "pf", name: "close" })),
                React.createElement(Modal.Title, null, "Debug information")),
            React.createElement(Modal.Body, null,
                this.state.copyStatus === CopyStatus.COPIED && (React.createElement(Alert, { type: "success", onDismiss: this.hideAlert }, "Debug information has been copied to your clipboard.")),
                this.state.copyStatus === CopyStatus.OLD_COPY && (React.createElement(Alert, { type: "warning", onDismiss: this.hideAlert }, "Debug information was copied to your clipboard, but is outdated now. It could be caused by new data received by auto refresh timers.")),
                React.createElement("span", null, "Please include this information when opening a bug."),
                React.createElement(CopyToClipboard, { onCopy: this.copyCallback, text: renderDebugInformation(), options: copyToClipboardOptions },
                    React.createElement("textarea", { ref: this.textareaRef, className: textAreaStyle, readOnly: true, value: renderDebugInformation() }))),
            React.createElement(Modal.Footer, null,
                React.createElement(Button, { onClick: this.close }, "Close"),
                React.createElement(CopyToClipboard, { onCopy: this.copyCallback, text: renderDebugInformation(), options: copyToClipboardOptions },
                    React.createElement(Button, { bsStyle: "primary" }, "Copy")))));
    };
    return DebugInformation;
}(React.PureComponent));
export { DebugInformation };
var mapStateToProps = function (state) { return ({
    appState: state
}); };
var DebugInformationContainer = connect(mapStateToProps, null, null, { withRef: true })(DebugInformation);
export default DebugInformationContainer;
//# sourceMappingURL=DebugInformation.js.map