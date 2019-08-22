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
import { Badge, Col, ListViewItem, ListViewIcon, Row } from 'patternfly-react';
import { WorkloadIcon, worloadLink } from '../../types/Workload';
import { PfColors } from '../../components/Pf/PfColors';
import { Link } from 'react-router-dom';
import { DisplayMode, HealthIndicator } from '../../components/Health/HealthIndicator';
import { PromisesRegistry } from '../../utils/CancelablePromises';
import MissingSidecar from '../../components/MissingSidecar/MissingSidecar';
var ItemDescription = /** @class */ (function (_super) {
    __extends(ItemDescription, _super);
    function ItemDescription(props) {
        var _this = _super.call(this, props) || this;
        _this.promises = new PromisesRegistry();
        _this.state = {
            health: undefined
        };
        return _this;
    }
    ItemDescription.prototype.componentDidMount = function () {
        this.onItemChanged(this.props.workloadItem);
    };
    ItemDescription.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.workloadItem !== prevProps.workloadItem) {
            this.onItemChanged(this.props.workloadItem);
        }
    };
    ItemDescription.prototype.componentWillUnmount = function () {
        this.promises.cancelAll();
    };
    ItemDescription.prototype.onItemChanged = function (item) {
        var _this = this;
        this.promises
            .register('health', item.healthPromise)
            .then(function (h) { return _this.setState({ health: h }); })
            .catch(function (err) {
            if (!err.isCanceled) {
                _this.setState({ health: undefined });
                throw err;
            }
        });
    };
    ItemDescription.prototype.render = function () {
        var namespace = this.props.workloadItem.namespace;
        var object = this.props.workloadItem.workload;
        var iconName = WorkloadIcon;
        var iconType = 'pf';
        var heading = (React.createElement("div", { className: "ServiceList-Heading" },
            React.createElement("div", { className: "ServiceList-Title" },
                object.name,
                React.createElement("small", null, namespace),
                React.createElement("small", null, object.type))));
        var itemDescription = (React.createElement(Row, null,
            React.createElement(Col, { xs: 12, sm: 12, md: 4, lg: 4 }, this.state.health && (React.createElement(React.Fragment, null,
                React.createElement("strong", null, "Health: "),
                React.createElement(HealthIndicator, { id: object.name, health: this.state.health, mode: DisplayMode.SMALL })))),
            React.createElement(Col, { xs: 12, sm: 12, md: 4, lg: 4 }, !object.istioSidecar && React.createElement(MissingSidecar, null)),
            React.createElement(Col, { xs: 12, sm: 12, md: 4, lg: 4 }, object.appLabel || object.versionLabel ? (React.createElement("span", null,
                React.createElement("strong", null, "Label Validation :"),
                object.appLabel && React.createElement(Badge, null, "app"),
                object.versionLabel && React.createElement(Badge, null, "version"))) : (React.createElement("span", null)))));
        var content = (React.createElement(ListViewItem, { leftContent: React.createElement(ListViewIcon, { type: iconType, name: iconName }), key: 'worloadItemItemView_' + this.props.position + '_' + namespace + '_' + object.name, heading: heading, description: itemDescription }));
        return (React.createElement(Link, { key: 'worloadItemItem_' + this.props.position + '_' + namespace + '_' + object.name, to: worloadLink(namespace, object.name), style: { color: PfColors.Black } }, content));
    };
    return ItemDescription;
}(React.Component));
export default ItemDescription;
//# sourceMappingURL=ItemDescription.js.map