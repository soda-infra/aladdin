import * as React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'patternfly-react';
import { NodeType } from '../../types/Graph';
import { nodeData } from './SummaryPanelCommon';
import { CyNode } from '../../components/CytoscapeGraph/CytoscapeGraphUtils';
var getTitle = function (data) {
    if (data.nodeType === NodeType.UNKNOWN) {
        return 'Traffic Source';
    }
    if (data.nodeType === NodeType.SERVICE && data.isServiceEntry !== undefined) {
        return data.isServiceEntry === 'MESH_EXTERNAL' ? 'External Service Entry' : 'Internal Service Entry';
    }
    return data.nodeType.charAt(0).toUpperCase() + data.nodeType.slice(1);
};
var isInaccessible = function (data) {
    return data.isInaccessible;
};
var getLink = function (data, nodeType) {
    var namespace = data.namespace;
    if (!nodeType || data.nodeType === NodeType.UNKNOWN) {
        nodeType = data.nodeType;
    }
    var app = data.app, service = data.service, workload = data.workload;
    var displayName = 'unknown';
    var link;
    var key;
    switch (nodeType) {
        case NodeType.APP:
            link = "/namespaces/" + encodeURIComponent(namespace) + "/applications/" + encodeURIComponent(app);
            key = namespace + ".app." + app;
            displayName = app;
            break;
        case NodeType.SERVICE:
            if (data.isServiceEntry) {
                link = "/namespaces/" + encodeURIComponent(namespace) + "/istio/serviceentries/" + encodeURIComponent(service);
            }
            else {
                link = "/namespaces/" + encodeURIComponent(namespace) + "/services/" + encodeURIComponent(service);
            }
            key = namespace + ".svc." + service;
            displayName = service;
            break;
        case NodeType.WORKLOAD:
            link = "/namespaces/" + encodeURIComponent(namespace) + "/workloads/" + encodeURIComponent(workload);
            key = namespace + ".wl." + workload;
            displayName = workload;
            break;
        default:
            // NOOP
            break;
    }
    if (link && !isInaccessible(data)) {
        return (React.createElement(Link, { key: key, to: link }, displayName));
    }
    return React.createElement("span", { key: key }, displayName);
};
export var RenderLink = function (props) {
    var link = getLink(props.data, props.nodeType);
    return (React.createElement(React.Fragment, null,
        link,
        isInaccessible(props.data) && (React.createElement(Icon, { key: "link-icon", name: "private", type: "pf", style: { paddingLeft: '2px', width: '10px' } }))));
};
export var renderTitle = function (data) {
    var link = getLink(data);
    return (React.createElement(React.Fragment, null,
        React.createElement("strong", null,
            getTitle(data),
            ":"),
        " ",
        link,
        ' ',
        isInaccessible(data) && React.createElement(Icon, { name: "private", type: "pf", style: { paddingLeft: '2px', width: '10px' } })));
};
export var renderDestServicesLinks = function (node) {
    var data = nodeData(node);
    var destServices = node.data(CyNode.destServices);
    var links = [];
    if (!destServices) {
        return links;
    }
    destServices.forEach(function (ds, index) {
        var serviceNodeData = {
            app: '',
            hasParent: false,
            isInaccessible: data.isInaccessible,
            isOutsider: data.isOutsider,
            isRoot: data.isRoot,
            isServiceEntry: data.isServiceEntry,
            namespace: ds.namespace,
            nodeType: NodeType.SERVICE,
            service: ds.name,
            version: '',
            workload: ''
        };
        links.push(React.createElement(RenderLink, { key: "service-" + index, data: serviceNodeData, nodeType: NodeType.SERVICE }));
        links.push(React.createElement("span", { key: "comma-after-" + ds.name }, ", "));
    });
    if (links.length > 0) {
        links.pop();
    }
    return links;
};
//# sourceMappingURL=SummaryLink.js.map