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
import { Col, Row } from 'patternfly-react';
import * as React from 'react';
import { NodeType } from '../../types/Graph';
import DetailedTrafficList from '../Details/DetailedTrafficList';
import { MetricsObjectTypes } from '../../types/Metrics';
import MetricsDurationContainer from '../MetricsOptions/MetricsDuration';
import RefreshButtonContainer from '../Refresh/RefreshButton';
var TrafficDetails = /** @class */ (function (_super) {
    __extends(TrafficDetails, _super);
    function TrafficDetails(props) {
        var _this = _super.call(this, props) || this;
        _this.buildTrafficNode = function (prefix, node) {
            switch (node.nodeType) {
                case NodeType.WORKLOAD:
                    return {
                        id: prefix + "-" + node.id,
                        type: node.nodeType,
                        namespace: node.namespace,
                        name: node.workload || 'unknown',
                        isInaccessible: node.isInaccessible || false
                    };
                case NodeType.APP:
                    return {
                        id: prefix + "-" + node.id,
                        type: node.nodeType,
                        namespace: node.namespace,
                        name: node.app || 'unknown',
                        version: node.version || '',
                        isInaccessible: node.isInaccessible || false
                    };
                case NodeType.SERVICE:
                    return {
                        id: prefix + "-" + node.id,
                        type: node.nodeType,
                        namespace: node.namespace,
                        name: node.service || 'unknown',
                        isServiceEntry: node.isServiceEntry,
                        isInaccessible: node.isInaccessible || false
                    };
                default:
                    return {
                        id: prefix + "-" + node.id,
                        type: NodeType.UNKNOWN,
                        namespace: node.namespace,
                        name: 'unknown'
                    };
            }
        };
        _this.processSecondLevelTraffic = function (edges, serviceTraffic, nodes, myNode) {
            var inboundTraffic = [];
            var outboundTraffic = [];
            edges.forEach(function (edge) {
                var sourceNode = nodes['id-' + edge.data.source];
                var targetNode = nodes['id-' + edge.data.target];
                if (myNode.id === edge.data.source || myNode.id === edge.data.target) {
                    return;
                }
                if (targetNode.nodeType === NodeType.SERVICE) {
                    var svcId = "in-" + targetNode.namespace + "-" + targetNode.service;
                    if (serviceTraffic[svcId]) {
                        inboundTraffic.push({
                            traffic: edge.data.traffic,
                            proxy: serviceTraffic[svcId],
                            node: _this.buildTrafficNode('in', sourceNode)
                        });
                    }
                }
                else if (sourceNode.nodeType === NodeType.SERVICE) {
                    var svcId = "out-" + sourceNode.namespace + "-" + sourceNode.service;
                    if (serviceTraffic[svcId]) {
                        outboundTraffic.push({
                            traffic: edge.data.traffic,
                            proxy: serviceTraffic[svcId],
                            node: _this.buildTrafficNode('out', targetNode)
                        });
                    }
                }
            });
            return { inboundTraffic: inboundTraffic, outboundTraffic: outboundTraffic };
        };
        _this.processFirstLevelTraffic = function (edges, nodes, myNode) {
            var serviceTraffic = {};
            var inboundTraffic = [];
            var outboundTraffic = [];
            edges.forEach(function (edge) {
                var sourceNode = nodes['id-' + edge.data.source];
                var targetNode = nodes['id-' + edge.data.target];
                if (myNode.id === edge.data.source) {
                    var trafficItem = {
                        traffic: edge.data.traffic,
                        node: _this.buildTrafficNode('out', targetNode)
                    };
                    outboundTraffic.push(trafficItem);
                    if (trafficItem.node.type === NodeType.SERVICE) {
                        var svcId = "out-" + trafficItem.node.namespace + "-" + trafficItem.node.name;
                        if (!serviceTraffic[svcId]) {
                            serviceTraffic[svcId] = trafficItem;
                        }
                    }
                }
                else if (myNode.id === edge.data.target) {
                    var trafficItem = {
                        traffic: edge.data.traffic,
                        node: _this.buildTrafficNode('in', sourceNode)
                    };
                    inboundTraffic.push(trafficItem);
                    if (trafficItem.node.type === NodeType.SERVICE) {
                        var svcId = "in-" + trafficItem.node.namespace + "-" + trafficItem.node.name;
                        if (!serviceTraffic[svcId]) {
                            serviceTraffic[svcId] = trafficItem;
                        }
                    }
                }
            });
            return { serviceTraffic: serviceTraffic, inboundTraffic: inboundTraffic, outboundTraffic: outboundTraffic };
        };
        _this.processTrafficData = function (traffic) {
            if (!traffic ||
                !traffic.elements.nodes ||
                !traffic.elements.edges ||
                traffic.elements.nodes.length === 0 ||
                traffic.elements.edges.length === 0) {
                _this.setState({ inboundTraffic: [], outboundTraffic: [] });
                return;
            }
            // Index nodes by id and find the node of the queried item
            var nodes = {};
            var myNode = { id: '', nodeType: NodeType.UNKNOWN, namespace: '' };
            traffic.elements.nodes.forEach(function (element) {
                nodes['id-' + element.data.id] = element.data;
                if (element.data.namespace === _this.props.namespace) {
                    var isMyWorkload = _this.props.itemType === MetricsObjectTypes.WORKLOAD && _this.props.workloadName === element.data.workload;
                    var isMyApp = _this.props.itemType === MetricsObjectTypes.APP && _this.props.appName === element.data.app;
                    var isMyService = _this.props.itemType === MetricsObjectTypes.SERVICE && _this.props.serviceName === element.data.service;
                    if (isMyWorkload || isMyApp || isMyService) {
                        myNode = element.data;
                    }
                }
            });
            if (myNode.id === '') {
                // Graph endpoint didn't return a graph for the current node.
                _this.setState({ inboundTraffic: [], outboundTraffic: [] });
                return;
            }
            // Process direct traffic to/from the item of interest.
            // This finds services and direct traffic (like workload-to-workload traffic)
            var _a = _this.processFirstLevelTraffic(traffic.elements.edges, nodes, myNode), serviceTraffic = _a.serviceTraffic, firstLevelInbound = _a.inboundTraffic, firstLevelOutbound = _a.outboundTraffic;
            // Then, process second level traffic.
            // Second level are nodes whose traffic go through services and reaches
            // the entity of interest.
            var _b = _this.processSecondLevelTraffic(traffic.elements.edges, serviceTraffic, nodes, myNode), secondLevelInbound = _b.inboundTraffic, secondLevelOutbound = _b.outboundTraffic;
            // Merge and set resolved traffic
            var inboundTraffic = firstLevelInbound.concat(secondLevelInbound);
            var outboundTraffic = firstLevelOutbound.concat(secondLevelOutbound);
            _this.setState({ inboundTraffic: inboundTraffic, outboundTraffic: outboundTraffic });
        };
        _this.state = {
            inboundTraffic: [],
            outboundTraffic: []
        };
        return _this;
    }
    TrafficDetails.prototype.componentDidMount = function () {
        this.processTrafficData(this.props.trafficData);
    };
    TrafficDetails.prototype.componentDidUpdate = function (prevProps) {
        var isWorkloadSet = prevProps.itemType === MetricsObjectTypes.WORKLOAD &&
            this.props.itemType === prevProps.itemType &&
            (prevProps.namespace !== this.props.namespace || prevProps.workloadName !== this.props.workloadName);
        var isAppSet = prevProps.itemType === MetricsObjectTypes.APP &&
            this.props.itemType === prevProps.itemType &&
            (prevProps.namespace !== this.props.namespace || prevProps.appName !== this.props.appName);
        var isServiceSet = prevProps.itemType === MetricsObjectTypes.SERVICE &&
            this.props.itemType === prevProps.itemType &&
            (prevProps.namespace !== this.props.namespace || prevProps.serviceName !== this.props.serviceName);
        if (isWorkloadSet || isAppSet || isServiceSet || prevProps.trafficData !== this.props.trafficData) {
            this.processTrafficData(this.props.trafficData);
        }
    };
    TrafficDetails.prototype.render = function () {
        if (this.props.trafficData === null) {
            return null;
        }
        return (React.createElement(Row, { className: "card-pf-body" },
            React.createElement(Col, { xs: 12 },
                React.createElement("div", null,
                    React.createElement("div", { style: { float: 'right', paddingRight: '2em' } },
                        React.createElement(MetricsDurationContainer, { onChanged: this.props.onDurationChanged }),
                        ' ',
                        React.createElement(RefreshButtonContainer, { handleRefresh: this.props.onRefresh })),
                    React.createElement("strong", null, "Inbound")),
                React.createElement(DetailedTrafficList, { direction: "inbound", traffic: this.state.inboundTraffic }),
                React.createElement("div", { style: { marginTop: '2em' } },
                    React.createElement("strong", null, "Outbound")),
                React.createElement(DetailedTrafficList, { direction: "outbound", traffic: this.state.outboundTraffic }))));
    };
    return TrafficDetails;
}(React.Component));
export default TrafficDetails;
//# sourceMappingURL=TrafficDetails.js.map