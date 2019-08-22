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
import { DisplayMode, HealthIndicator } from '../../components/Health/HealthIndicator';
import { PromisesRegistry } from '../../utils/CancelablePromises';
import MissingSidecar from '../../components/MissingSidecar/MissingSidecar';
var ItemDescription = /** @class */ (function (_super) {
    __extends(ItemDescription, _super);
    function ItemDescription(props) {
        var _this = _super.call(this, props) || this;
        _this.promises = new PromisesRegistry();
        _this.state = { health: undefined };
        return _this;
    }
    ItemDescription.prototype.componentDidMount = function () {
        this.onItemChanged(this.props.item);
    };
    ItemDescription.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.item.healthPromise !== prevProps.item.healthPromise) {
            this.onItemChanged(this.props.item);
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
        return this.state.health ? (React.createElement(Row, null,
            React.createElement(Col, { xs: 12, sm: 12, md: 4, lg: 4 },
                React.createElement("strong", null, "Health: "),
                React.createElement(HealthIndicator, { id: this.props.item.name, health: this.state.health, mode: DisplayMode.SMALL })),
            React.createElement(Col, { xs: 12, sm: 12, md: 4, lg: 4 }, !this.props.item.istioSidecar && React.createElement(MissingSidecar, null)),
            React.createElement(Col, { xs: 12, sm: 12, md: 4, lg: 4 }))) : (React.createElement("span", null));
    };
    return ItemDescription;
}(React.PureComponent));
export default ItemDescription;
//# sourceMappingURL=ItemDescription.js.map