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
import { AboutModal, TextContent, TextList, TextListItem, Title, Button } from '@patternfly/react-core';
import * as icons from '@patternfly/react-icons';
import { config, kialiLogo } from '../../config';
var KIALI_CORE_COMMIT_HASH = 'Kiali core commit hash';
var KIALI_CORE_VERSION = 'Kiali core version';
var AboutUIModal = /** @class */ (function (_super) {
    __extends(AboutUIModal, _super);
    function AboutUIModal(props) {
        var _this = _super.call(this, props) || this;
        _this.open = function () {
            _this.setState({ showModal: true });
        };
        _this.close = function () {
            _this.setState({ showModal: false });
        };
        _this.renderWebsiteLink = function () {
            if (config.about && config.about.website) {
                var Icon = icons[config.about.website.icon];
                return (
                // @ts-ignore
                React.createElement(Button, { component: "a", href: config.about.website.url, variant: "link", target: "_blank" },
                    React.createElement(Icon, { style: { marginRight: '10px' } }),
                    config.about.website.linkText));
            }
            return null;
        };
        _this.renderProjectLink = function () {
            if (config.about && config.about.project) {
                var Icon = icons[config.about.project.icon];
                return (
                // @ts-ignore
                React.createElement(Button, { component: "a", href: config.about.project.url, variant: "link", target: "_blank" },
                    React.createElement(Icon, { style: { marginRight: '10px' } }),
                    config.about.project.linkText));
            }
            return null;
        };
        _this.state = { showModal: false };
        return _this;
    }
    AboutUIModal.prototype.render = function () {
        var uiVersion = process.env.REACT_APP_GIT_HASH === '' || process.env.REACT_APP_GIT_HASH === 'unknown'
            ? process.env.REACT_APP_VERSION
            : process.env.REACT_APP_VERSION + " (" + process.env.REACT_APP_GIT_HASH + ")";
        var coreVersion = this.props.status[KIALI_CORE_COMMIT_HASH] === '' || this.props.status[KIALI_CORE_COMMIT_HASH] === 'unknown'
            ? this.props.status[KIALI_CORE_VERSION]
            : this.props.status[KIALI_CORE_VERSION] + " (" + this.props.status[KIALI_CORE_COMMIT_HASH] + ")";
        return (React.createElement(AboutModal, { isOpen: this.state.showModal, onClose: this.close, productName: "", brandImageSrc: kialiLogo, brandImageAlt: "Kiali Logo", logoImageSrc: kialiLogo, logoImageAlt: "Kiali Logo" },
            React.createElement(TextContent, null,
                React.createElement(TextList, { component: "dl" },
                    React.createElement(TextListItem, { key: 'kiali-ui-name', component: "dt" }, "Kiali-ui"),
                    React.createElement(TextListItem, { key: 'kiali-ui-version', component: "dd" }, uiVersion),
                    React.createElement(TextListItem, { key: 'kiali-name', component: "dt" }, "Kiali"),
                    React.createElement(TextListItem, { key: 'kiali-version', component: "dd" }, coreVersion)),
                React.createElement(Title, { size: "xl", style: { padding: '20px 0px 20px' } }, "Components"),
                React.createElement(TextList, { component: "dl" }, this.props.components &&
                    this.props.components.map(function (component) { return (React.createElement(React.Fragment, { key: component.name + "_" + component.version },
                        React.createElement(TextListItem, { key: component.name, component: "dt" }, component.version ? component.name : component.name + "URL"),
                        React.createElement(TextListItem, { key: component.version, component: "dd" }, (component.version ? component.version : '') + " " + (component.version ? (component.url ? "(" + component.url + ")" : '') : component.url)))); })),
                this.renderWebsiteLink(),
                this.renderProjectLink())));
    };
    return AboutUIModal;
}(React.Component));
export default AboutUIModal;
//# sourceMappingURL=AboutUIModal.js.map