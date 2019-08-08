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
import { AggregateStatusNotification, AggregateStatusNotifications } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { DEGRADED, FAILURE, HEALTHY } from '../../types/Health';
import OverviewStatus from './OverviewStatus';
import { switchType } from './OverviewHelper';
import { Paths } from '../../config';
var OverviewCardContent = /** @class */ (function (_super) {
    __extends(OverviewCardContent, _super);
    function OverviewCardContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OverviewCardContent.prototype.render = function () {
        var targetPage = switchType(this.props.type, Paths.APPLICATIONS, Paths.SERVICES, Paths.WORKLOADS);
        var name = this.props.name;
        var status = this.props.status;
        var nbItems = status.inError.length + status.inWarning.length + status.inSuccess.length + status.notAvailable.length;
        var text;
        if (nbItems === 1) {
            text = switchType(this.props.type, '1 Application', '1 Service', '1 Workload');
        }
        else {
            text = nbItems + switchType(this.props.type, ' Applications', ' Services', ' Workloads');
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(Link, { to: "/" + targetPage + "?namespaces=" + name }, text),
            React.createElement(AggregateStatusNotifications, null,
                status.inError.length > 0 && (React.createElement(OverviewStatus, { id: name + '-failure', namespace: name, status: FAILURE, items: status.inError, targetPage: targetPage })),
                status.inWarning.length > 0 && (React.createElement(OverviewStatus, { id: name + '-degraded', namespace: name, status: DEGRADED, items: status.inWarning, targetPage: targetPage })),
                status.inSuccess.length > 0 && (React.createElement(OverviewStatus, { id: name + '-healthy', namespace: name, status: HEALTHY, items: status.inSuccess, targetPage: targetPage })),
                nbItems === status.notAvailable.length && React.createElement(AggregateStatusNotification, null, "N/A"))));
    };
    return OverviewCardContent;
}(React.Component));
export default OverviewCardContent;
//# sourceMappingURL=OverviewCardContent.js.map