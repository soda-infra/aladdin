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
import { Label } from 'patternfly-react';
import { style } from 'typestyle';
var labelContainerStyle = style({
    marginTop: 5
});
var labelMatchStyle = style({});
var Matches = /** @class */ (function (_super) {
    __extends(Matches, _super);
    function Matches() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Matches.prototype.render = function () {
        var _this = this;
        var matches = this.props.matches.map(function (match, index) { return (React.createElement("span", { key: match + '-' + index },
            React.createElement(Label, { className: labelMatchStyle, type: "primary", onRemoveClick: function () { return _this.props.onRemoveMatch(match); } }, match),
            ' ')); });
        return (React.createElement("div", { className: labelContainerStyle },
            "Matching selected: ",
            matches.length > 0 ? matches : React.createElement("b", null, "Match any request")));
    };
    return Matches;
}(React.Component));
export default Matches;
//# sourceMappingURL=Matches.js.map