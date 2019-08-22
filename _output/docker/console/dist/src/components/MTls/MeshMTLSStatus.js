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
import { MTLSIconTypes } from './MTLSIcon';
import { default as MTLSStatus, emptyDescriptor } from './MTLSStatus';
import { style } from 'typestyle';
import { lastRefreshAtSelector, meshWideMTLSStatusSelector, namespaceItemsSelector } from '../../store/Selectors';
import { connect } from 'react-redux';
import { MTLSStatuses } from '../../types/TLSStatus';
import * as MessageCenter from '../../utils/MessageCenter';
import { MessageType } from '../../types/MessageCenter';
import * as API from '../../services/Api';
import { bindActionCreators } from 'redux';
import { MeshTlsActions } from '../../actions/MeshTlsActions';
var statusDescriptors = new Map([
    [
        MTLSStatuses.ENABLED,
        {
            message: 'Mesh-wide mTLS is enabled',
            icon: MTLSIconTypes.LOCK_FULL,
            showStatus: true
        }
    ],
    [
        MTLSStatuses.PARTIALLY,
        {
            message: 'Mesh-wide TLS is partially enabled',
            icon: MTLSIconTypes.LOCK_HOLLOW,
            showStatus: true
        }
    ],
    [MTLSStatuses.NOT_ENABLED, emptyDescriptor]
]);
var MeshMTLSStatus = /** @class */ (function (_super) {
    __extends(MeshMTLSStatus, _super);
    function MeshMTLSStatus() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fetchStatus = function () {
            API.getMeshTls()
                .then(function (response) {
                return _this.props.setMeshTlsStatus(response.data);
            })
                .catch(function (error) {
                // User without namespaces can't have access to mTLS information. Reduce severity to info.
                var informative = _this.props.namespaces && _this.props.namespaces.length < 1;
                if (informative) {
                    MessageCenter.add(API.getInfoMsg('Mesh-wide mTLS status feature disabled.', error), 'default', MessageType.INFO);
                }
                else {
                    MessageCenter.add(API.getErrorMsg('Error fetching Mesh-wide mTLS status.', error), 'default', MessageType.ERROR);
                }
            });
        };
        return _this;
    }
    MeshMTLSStatus.prototype.componentDidMount = function () {
        this.fetchStatus();
    };
    MeshMTLSStatus.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.lastRefreshAt !== prevProps.lastRefreshAt) {
            this.fetchStatus();
        }
    };
    MeshMTLSStatus.prototype.iconStyle = function () {
        return style({
            marginTop: -3,
            marginRight: 8,
            width: 13
        });
    };
    MeshMTLSStatus.prototype.render = function () {
        return (React.createElement("div", { className: this.iconStyle() },
            React.createElement(MTLSStatus, { status: this.props.status, statusDescriptors: statusDescriptors, overlayPosition: 'left' })));
    };
    return MeshMTLSStatus;
}(React.Component));
var mapStateToProps = function (state) { return ({
    status: meshWideMTLSStatusSelector(state),
    lastRefreshAt: lastRefreshAtSelector(state),
    namespaces: namespaceItemsSelector(state)
}); };
var mapDispatchToProps = function (dispatch) { return ({
    setMeshTlsStatus: bindActionCreators(MeshTlsActions.setinfo, dispatch)
}); };
var MeshMTLSSatutsConnected = connect(mapStateToProps, mapDispatchToProps)(MeshMTLSStatus);
export default MeshMTLSSatutsConnected;
//# sourceMappingURL=MeshMTLSStatus.js.map