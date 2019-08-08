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
import { createIcon } from './Helper';
import './Health.css';
var HealthDetails = /** @class */ (function (_super) {
    __extends(HealthDetails, _super);
    function HealthDetails() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HealthDetails.prototype.render = function () {
        var health = this.props.health;
        return health.items.map(function (item, idx) {
            return (React.createElement("div", { key: idx },
                React.createElement("strong", null,
                    createIcon(item.status),
                    ' ' + item.title + ': '),
                item.text,
                item.children && (React.createElement("ul", { style: { listStyleType: 'none', paddingLeft: 12 } }, item.children.map(function (sub, subIdx) {
                    return (React.createElement("li", { key: subIdx },
                        createIcon(sub.status),
                        " ",
                        sub.text));
                })))));
        });
    };
    return HealthDetails;
}(React.PureComponent));
export { HealthDetails };
//# sourceMappingURL=HealthDetails.js.map