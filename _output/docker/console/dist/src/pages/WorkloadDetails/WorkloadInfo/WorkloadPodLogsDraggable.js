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
import { Button, Icon } from 'patternfly-react';
import Draggable from 'react-draggable';
import { style } from 'typestyle';
import WorkloadPodLogs from './WorkloadPodLogs';
var draggable = style({
    width: '75%',
    height: '600px',
    top: '-300px',
    right: '0',
    position: 'absolute',
    zIndex: 9999
});
var WorkloadPodLogsDraggable = /** @class */ (function (_super) {
    __extends(WorkloadPodLogsDraggable, _super);
    function WorkloadPodLogsDraggable(props) {
        return _super.call(this, props) || this;
    }
    WorkloadPodLogsDraggable.prototype.render = function () {
        return (React.createElement(Draggable, { handle: "#wpl_header" },
            React.createElement("div", { className: "modal-content " + draggable },
                React.createElement("div", { id: "wpl_header", className: "modal-header" },
                    React.createElement(Button, { className: "close", bsClass: "", onClick: this.props.onClose },
                        React.createElement(Icon, { title: "Close", type: "pf", name: "close" })),
                    React.createElement("span", { className: "modal-title" }, "Pod Logs")),
                React.createElement(WorkloadPodLogs, { namespace: this.props.namespace, pods: this.props.pods }))));
    };
    return WorkloadPodLogsDraggable;
}(React.Component));
export default WorkloadPodLogsDraggable;
//# sourceMappingURL=WorkloadPodLogsDraggable.js.map