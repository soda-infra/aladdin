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
import { Col, Row } from 'patternfly-react';
import AppDescription from './AppInfo/AppDescription';
import './AppInfo.css';
import { DurationDropdownContainer } from '../../components/DurationDropdown/DurationDropdown';
import RefreshButtonContainer from '../../components/Refresh/RefreshButton';
var AppInfo = /** @class */ (function (_super) {
    __extends(AppInfo, _super);
    function AppInfo(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    AppInfo.prototype.render = function () {
        var app = this.props.app;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "container-fluid container-cards-pf" },
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                        React.createElement("span", { style: { float: 'right' } },
                            React.createElement(DurationDropdownContainer, { id: "app-info-duration-dropdown" }),
                            ' ',
                            React.createElement(RefreshButtonContainer, { handleRefresh: this.props.onRefresh })))),
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, { xs: 12, sm: 12, md: 12, lg: 12 },
                        React.createElement(AppDescription, { app: app, health: this.props.health }))))));
    };
    return AppInfo;
}(React.Component));
export default AppInfo;
//# sourceMappingURL=AppInfo.js.map