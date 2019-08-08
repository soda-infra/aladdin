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
import { Button, Form, FormGroup, Popover, TextInput } from '@patternfly/react-core';
import { InfoAltIcon } from '@patternfly/react-icons';
import { style } from 'typestyle';
var tagsInput = style({ marginLeft: '-100px' });
var TagsControl = /** @class */ (function (_super) {
    __extends(TagsControl, _super);
    function TagsControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tagsHelp = function () {
            return (React.createElement(React.Fragment, null,
                React.createElement(Popover, { position: "right", className: tagsInput, bodyContent: React.createElement(React.Fragment, null,
                        "Values should be in the",
                        ' ',
                        React.createElement("a", { rel: "noopener noreferrer", href: "https://brandur.org/logfmt", target: "_blank" }, "logfmt"),
                        ' ',
                        "format.",
                        React.createElement("ul", null,
                            React.createElement("li", null, "Use space for conjunctions"),
                            React.createElement("li", null, "Values containing whitespace should be enclosed in quotes")),
                        React.createElement("code", null, "error=true db.statement=\"select * from User\"")) },
                    React.createElement(React.Fragment, null,
                        React.createElement(Button, { variant: "plain" },
                            React.createElement(InfoAltIcon, null)),
                        "e.g. http.status_code=200 error=true"))));
        };
        return _this;
    }
    TagsControl.prototype.render = function () {
        var tags = this.props.tags;
        return (React.createElement(Form, { isHorizontal: true },
            React.createElement(FormGroup, { label: "Tags", fieldId: "jaeger-tags", helperText: this.tagsHelp() },
                React.createElement(TextInput, { value: tags, type: "text", onChange: this.props.onChange, "aria-label": "tagsJaegerTraces", className: tagsInput }))));
    };
    return TagsControl;
}(React.PureComponent));
export { TagsControl };
export default TagsControl;
//# sourceMappingURL=TagsControl.js.map