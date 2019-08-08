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
import { AggregateStatusNotification, OverlayTrigger, Popover } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { healthFilter } from '../../components/Filters/CommonFilters';
import { FilterSelected } from '../../components/Filters/StatefulFilters';
import { createIcon } from '../../components/Health/Helper';
import '../../components/Health/Health.css';
var OverviewStatus = /** @class */ (function (_super) {
    __extends(OverviewStatus, _super);
    function OverviewStatus() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setFilters = function () {
            var filters = [
                {
                    id: healthFilter.id,
                    category: healthFilter.title,
                    value: _this.props.status.name
                }
            ];
            FilterSelected.setSelected(filters);
        };
        return _this;
    }
    OverviewStatus.prototype.render = function () {
        var _this = this;
        var length = this.props.items.length;
        var items = this.props.items;
        if (items.length > 6) {
            items = items.slice(0, 5);
            items.push('and ' + (length - items.length) + ' more...');
        }
        return (React.createElement(OverlayTrigger
        // Prettier makes irrelevant line-breaking clashing withtslint
        // prettier-ignore
        , { 
            // Prettier makes irrelevant line-breaking clashing withtslint
            // prettier-ignore
            overlay: React.createElement(Popover, { id: this.props.id, title: this.props.status.name }, items.map(function (app, idx) {
                return (React.createElement("div", { key: _this.props.id + '-' + idx }, app));
            })), placement: "top", trigger: ['focus', 'hover'], rootClose: true },
            React.createElement(AggregateStatusNotification, null,
                React.createElement(Link, { to: "/" + this.props.targetPage + "?namespaces=" + this.props.namespace, onClick: function () { return _this.setFilters(); } },
                    createIcon(this.props.status),
                    ' ' + length))));
    };
    return OverviewStatus;
}(React.Component));
export default OverviewStatus;
//# sourceMappingURL=OverviewStatus.js.map