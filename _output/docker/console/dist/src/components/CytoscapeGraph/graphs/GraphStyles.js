import { PfColors } from '../../../components/Pf/PfColors';
import { EdgeLabelMode } from '../../../types/GraphFilter';
import { FAILURE, DEGRADED, REQUESTS_THRESHOLDS } from '../../../types/Health';
import { GraphType, NodeType, CytoscapeGlobalScratchNamespace } from '../../../types/Graph';
import { icons } from '../../../config';
import { CyEdge, CyNode } from '../CytoscapeGraphUtils';
export var DimClass = 'mousedim';
// UX-specified colors, widths, etc
var EdgeColor = PfColors.Green400;
var EdgeColorDead = PfColors.Black500;
var EdgeColorDegraded = PfColors.Orange;
var EdgeColorFailure = PfColors.Red;
var EdgeIconMTLS = icons.istio.mtls.ascii; // lock
var EdgeIconDisabledMTLS = icons.istio.disabledMtls.ascii; // broken lock
var EdgeTextOutlineColor = PfColors.White;
var EdgeTextOutlineWidth = '1px';
var EdgeTextFont = 'Verdana,Arial,Helvetica,sans-serif,FontAwesome,PatternFlyIcons-webfont';
var EdgeTextFontSize = '6px';
var EdgeTextFontSizeHover = '10px';
var EdgeWidth = 1;
var EdgeWidthSelected = 3;
var NodeBorderWidth = '1px';
var NodeBorderWidthSelected = '3px';
var NodeColorBorder = PfColors.Black400;
var NodeColorBorderDegraded = PfColors.Orange;
var NodeColorBorderFailure = PfColors.Red;
var NodeColorBorderHover = PfColors.Blue300;
var NodeColorBorderSelected = PfColors.Blue300;
var NodeColorFill = PfColors.White;
var NodeColorFillBox = PfColors.Black100;
var NodeColorFillHover = PfColors.Blue50;
var NodeColorFillHoverDegraded = '#fdf2e5';
var NodeColorFillHoverFailure = '#ffe6e6';
var NodeHeight = '10px';
var NodeIconCB = icons.istio.circuitBreaker.ascii; // bolt
var NodeIconMS = icons.istio.missingSidecar.ascii; // exclamation
var NodeIconVS = icons.istio.virtualService.ascii; // code-branch
var NodeImageTopology = require('../../../assets/img/node-background-topology.png');
var NodeImageKey = require('../../../assets/img/node-background-key.png');
var NodeTextOutlineColor = PfColors.White;
var NodeTextOutlineWidth = '1px';
var NodeTextColor = PfColors.Black;
var NodeTextColorBadged = PfColors.Purple600;
var NodeTextFont = EdgeTextFont;
var NodeTextFontWeight = 'normal';
var NodeTextFontWeightBadged = 'normal';
var NodeTextFontSize = '8px';
var NodeTextFontSizeHover = '11px';
var NodeWidth = NodeHeight;
var GraphStyles = /** @class */ (function () {
    function GraphStyles() {
    }
    GraphStyles.options = function () {
        return { wheelSensitivity: 0.1, autounselectify: false, autoungrabify: true };
    };
    GraphStyles.styles = function () {
        var getCyGlobalData = function (ele) {
            return ele.cy().scratch(CytoscapeGlobalScratchNamespace);
        };
        var getEdgeColor = function (ele) {
            var rate = 0;
            var pErr = 0;
            if (ele.data(CyEdge.http) > 0) {
                rate = Number(ele.data(CyEdge.http));
                pErr = ele.data(CyEdge.httpPercentErr) > 0 ? Number(ele.data(CyEdge.httpPercentErr)) : 0;
            }
            else if (ele.data(CyEdge.grpc) > 0) {
                rate = Number(ele.data(CyEdge.grpc));
                pErr = ele.data(CyEdge.grpcPercentErr) > 0 ? Number(ele.data(CyEdge.grpcPercentErr)) : 0;
            }
            if (rate === 0) {
                return EdgeColorDead;
            }
            if (pErr > REQUESTS_THRESHOLDS.failure) {
                return EdgeColorFailure;
            }
            if (pErr > REQUESTS_THRESHOLDS.degraded) {
                return EdgeColorDegraded;
            }
            return EdgeColor;
        };
        var getEdgeLabel = function (ele, includeProtocol) {
            var cyGlobal = getCyGlobalData(ele);
            var edgeLabelMode = cyGlobal.edgeLabelMode;
            var content = '';
            switch (edgeLabelMode) {
                case EdgeLabelMode.REQUESTS_PER_SECOND: {
                    var rate = 0;
                    var pErr = 0;
                    if (ele.data(CyEdge.http) > 0) {
                        rate = Number(ele.data(CyEdge.http));
                        pErr = ele.data(CyEdge.httpPercentErr) > 0 ? Number(ele.data(CyEdge.httpPercentErr)) : 0;
                    }
                    else if (ele.data(CyEdge.grpc) > 0) {
                        rate = Number(ele.data(CyEdge.grpc));
                        pErr = ele.data(CyEdge.grpcPercentErr) > 0 ? Number(ele.data(CyEdge.grpcPercentErr)) : 0;
                    }
                    else if (ele.data(CyEdge.tcp) > 0) {
                        rate = Number(ele.data(CyEdge.tcp));
                    }
                    if (rate > 0) {
                        if (pErr > 0) {
                            var sErr = pErr.toFixed(1);
                            sErr = "" + (sErr.endsWith('.0') ? pErr.toFixed(0) : sErr);
                            content = rate.toFixed(2) + "\n" + sErr + "%";
                        }
                        else {
                            content = rate.toFixed(2);
                        }
                    }
                    break;
                }
                case EdgeLabelMode.RESPONSE_TIME_95TH_PERCENTILE: {
                    var responseTime = ele.data(CyEdge.responseTime) > 0 ? Number(ele.data(CyEdge.responseTime)) : 0;
                    if (responseTime > 0) {
                        content = responseTime < 1000.0 ? responseTime.toFixed(0) + "ms" : (responseTime / 1000.0).toFixed(2) + "s";
                    }
                    break;
                }
                case EdgeLabelMode.REQUESTS_PERCENTAGE: {
                    var pReq = void 0;
                    if (ele.data(CyEdge.httpPercentReq) > 0) {
                        pReq = Number(ele.data(CyEdge.httpPercentReq));
                    }
                    else if (ele.data(CyEdge.grpcPercentReq) > 0) {
                        pReq = Number(ele.data(CyEdge.grpcPercentReq));
                    }
                    if (pReq > 0) {
                        var sReq = pReq.toFixed(1);
                        content = (sReq.endsWith('.0') ? pReq.toFixed(0) : sReq) + "%";
                    }
                    break;
                }
                default:
                    content = '';
            }
            if (includeProtocol) {
                var protocol = ele.data(CyEdge.protocol);
                content = protocol ? protocol + " " + content : content;
            }
            var mtlsPercentage = Number(ele.data(CyEdge.isMTLS));
            if (cyGlobal.showSecurity && mtlsPercentage >= 0) {
                if (mtlsPercentage > 0 && !cyGlobal.mtlsEnabled) {
                    content = EdgeIconMTLS + " " + content;
                }
                else if (mtlsPercentage < 100 && cyGlobal.mtlsEnabled) {
                    content = EdgeIconDisabledMTLS + " " + content;
                }
            }
            return content;
        };
        var getNodeBackgroundImage = function (ele) {
            var isInaccessible = ele.data(CyNode.isInaccessible);
            var isServiceEntry = ele.data(CyNode.isServiceEntry);
            var isGroup = ele.data(CyNode.isGroup);
            if (isInaccessible && !isServiceEntry && !isGroup) {
                return NodeImageKey;
            }
            var isOutside = ele.data(CyNode.isOutside);
            if (isOutside && !isGroup) {
                return NodeImageTopology;
            }
            return 'none';
        };
        var getNodeBorderColor = function (ele) {
            if (ele.hasClass(DEGRADED.name)) {
                return NodeColorBorderDegraded;
            }
            if (ele.hasClass(FAILURE.name)) {
                return NodeColorBorderFailure;
            }
            return NodeColorBorder;
        };
        var getNodeLabel = function (ele) {
            var content = '';
            var cyGlobal = getCyGlobalData(ele);
            if (getCyGlobalData(ele).showNodeLabels) {
                var app = ele.data(CyNode.app);
                var isGroup = ele.data(CyNode.isGroup);
                var isGroupMember = ele.data('parent');
                var isMultiNamespace = cyGlobal.activeNamespaces.length > 1;
                var isOutside = ele.data(CyNode.isOutside);
                var isServiceEntry = ele.data(CyNode.isServiceEntry) !== undefined;
                var namespace = ele.data(CyNode.namespace);
                var nodeType = ele.data(CyNode.nodeType);
                var service = ele.data(CyNode.service);
                var version = ele.data(CyNode.version);
                var workload = ele.data(CyNode.workload);
                if (isGroupMember) {
                    switch (nodeType) {
                        case NodeType.APP:
                            if (cyGlobal.graphType === GraphType.APP) {
                                content = app;
                            }
                            else if (version && version !== 'unknown') {
                                content = version;
                            }
                            else {
                                content = workload ? "" + workload : "" + app;
                            }
                            break;
                        case NodeType.SERVICE:
                            content = service;
                            break;
                        case NodeType.WORKLOAD:
                            content = workload;
                            break;
                        default:
                            content = '';
                    }
                }
                else {
                    var contentArray = [];
                    if ((isMultiNamespace || isOutside) && !(isServiceEntry || nodeType === NodeType.UNKNOWN)) {
                        contentArray.push('(' + namespace + ')');
                    }
                    switch (nodeType) {
                        case NodeType.APP:
                            if (cyGlobal.graphType === GraphType.APP || isGroup || version === 'unknown') {
                                contentArray.unshift(app);
                            }
                            else {
                                contentArray.unshift(version);
                                contentArray.unshift(app);
                            }
                            break;
                        case NodeType.SERVICE:
                            contentArray.unshift(service);
                            break;
                        case NodeType.UNKNOWN:
                            contentArray.unshift('unknown');
                            break;
                        case NodeType.WORKLOAD:
                            contentArray.unshift(workload);
                            break;
                        default:
                            contentArray.unshift('error');
                    }
                    content = contentArray.join('\n');
                }
            }
            var badges = '';
            if (cyGlobal.showMissingSidecars && ele.data(CyNode.hasMissingSC)) {
                badges = NodeIconMS + badges;
            }
            if (cyGlobal.showCircuitBreakers && ele.data(CyNode.hasCB)) {
                badges = NodeIconCB + badges;
            }
            if (cyGlobal.showVirtualServices && ele.data(CyNode.hasVS)) {
                badges = NodeIconVS + badges;
            }
            return badges + content;
        };
        var getNodeShape = function (ele) {
            var nodeType = ele.data(CyNode.nodeType);
            switch (nodeType) {
                case NodeType.APP:
                    return 'square';
                case NodeType.SERVICE:
                    return ele.data(CyNode.isServiceEntry) ? 'tag' : 'triangle';
                case NodeType.UNKNOWN:
                    return 'diamond';
                case NodeType.WORKLOAD:
                    return 'ellipse';
                default:
                    return 'ellipse';
            }
        };
        var isNodeBadged = function (ele) {
            var cyGlobal = getCyGlobalData(ele);
            if (cyGlobal.showMissingSidecars && ele.data(CyNode.hasMissingSC)) {
                return true;
            }
            if (cyGlobal.showCircuitBreakers && ele.data(CyNode.hasCB)) {
                return true;
            }
            return cyGlobal.showVirtualServices && ele.data(CyNode.hasVS);
        };
        var nodeSelectedStyle = {
            'border-color': function (ele) {
                if (ele.hasClass(DEGRADED.name)) {
                    return NodeColorBorderDegraded;
                }
                if (ele.hasClass(FAILURE.name)) {
                    return NodeColorBorderFailure;
                }
                return NodeColorBorderSelected;
            },
            'border-width': NodeBorderWidthSelected
        };
        return [
            // Node Defaults
            {
                selector: 'node',
                css: {
                    'background-color': NodeColorFill,
                    'background-image': function (ele) {
                        return getNodeBackgroundImage(ele);
                    },
                    'background-fit': 'contain',
                    'border-color': function (ele) {
                        return getNodeBorderColor(ele);
                    },
                    'border-style': function (ele) {
                        return ele.data(CyNode.isUnused) ? 'dotted' : 'solid';
                    },
                    'border-width': NodeBorderWidth,
                    color: function (ele) {
                        return isNodeBadged(ele) ? NodeTextColorBadged : NodeTextColor;
                    },
                    'font-family': NodeTextFont,
                    'font-size': NodeTextFontSize,
                    'font-weight': function (ele) {
                        return isNodeBadged(ele) ? NodeTextFontWeightBadged : NodeTextFontWeight;
                    },
                    height: NodeHeight,
                    label: function (ele) {
                        return getNodeLabel(ele);
                    },
                    shape: function (ele) {
                        return getNodeShape(ele);
                    },
                    'text-events': 'yes',
                    'text-outline-color': NodeTextOutlineColor,
                    'text-outline-width': NodeTextOutlineWidth,
                    'text-halign': 'center',
                    'text-margin-y': '-1px',
                    'text-valign': 'top',
                    'text-wrap': 'wrap',
                    width: NodeWidth,
                    'z-index': '10'
                }
            },
            // Node is an App Box
            {
                selector: "node[?isGroup]",
                css: {
                    'background-color': NodeColorFillBox,
                    'text-margin-y': '4px',
                    'text-valign': 'bottom'
                }
            },
            // Node is selected
            {
                selector: 'node:selected',
                style: nodeSelectedStyle
            },
            // Node is highlighted (see GraphHighlighter.ts)
            {
                selector: 'node.mousehighlight',
                style: {
                    'font-size': NodeTextFontSizeHover
                }
            },
            // Node other than App Box is highlighted (see GraphHighlighter.ts)
            {
                selector: 'node.mousehighlight[^isGroup]',
                style: {
                    'background-color': function (ele) {
                        if (ele.hasClass(DEGRADED.name)) {
                            return NodeColorFillHoverDegraded;
                        }
                        if (ele.hasClass(FAILURE.name)) {
                            return NodeColorFillHoverFailure;
                        }
                        return NodeColorFillHover;
                    },
                    'border-color': function (ele) {
                        if (ele.hasClass(DEGRADED.name)) {
                            return NodeColorBorderDegraded;
                        }
                        if (ele.hasClass(FAILURE.name)) {
                            return NodeColorBorderFailure;
                        }
                        return NodeColorBorderHover;
                    }
                }
            },
            // Node is dimmed (see GraphHighlighter.ts)
            {
                selector: "node." + DimClass,
                style: {
                    opacity: '0.6'
                }
            },
            {
                selector: 'edge',
                css: {
                    'curve-style': 'bezier',
                    'font-family': EdgeTextFont,
                    'font-size': EdgeTextFontSize,
                    label: function (ele) {
                        return getEdgeLabel(ele);
                    },
                    'line-color': function (ele) {
                        return getEdgeColor(ele);
                    },
                    'line-style': 'solid',
                    'target-arrow-shape': 'vee',
                    'target-arrow-color': function (ele) {
                        return getEdgeColor(ele);
                    },
                    'text-events': 'yes',
                    'text-outline-color': EdgeTextOutlineColor,
                    'text-outline-width': EdgeTextOutlineWidth,
                    'text-wrap': 'wrap',
                    width: EdgeWidth
                }
            },
            {
                selector: 'edge:selected',
                css: {
                    width: EdgeWidthSelected,
                    label: function (ele) { return getEdgeLabel(ele, true); }
                }
            },
            {
                selector: 'edge[tcp > 0]',
                css: {
                    'target-arrow-shape': 'triangle-cross',
                    'line-color': PfColors.Blue600,
                    'target-arrow-color': PfColors.Blue600
                }
            },
            {
                selector: 'edge.mousehighlight',
                style: {
                    'font-size': EdgeTextFontSizeHover
                }
            },
            {
                selector: 'edge.mousehover',
                style: {
                    label: function (ele) {
                        return getEdgeLabel(ele, true);
                    }
                }
            },
            {
                selector: "edge." + DimClass,
                style: {
                    opacity: '0.3'
                }
            },
            {
                selector: '*.find[^isGroup]',
                style: {
                    'overlay-color': PfColors.Gold400,
                    'overlay-padding': '8px',
                    'overlay-opacity': '0.5'
                }
            }
        ];
    };
    return GraphStyles;
}());
export { GraphStyles };
//# sourceMappingURL=GraphStyles.js.map