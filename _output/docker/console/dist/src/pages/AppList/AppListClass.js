import * as React from 'react';
import { Link } from 'react-router-dom';
import { ListViewIcon, ListViewItem } from 'patternfly-react';
import { PfColors } from '../../components/Pf/PfColors';
import * as API from '../../services/Api';
import ItemDescription from './ItemDescription';
export var getAppItems = function (data, rateInterval) {
    if (data.applications) {
        return data.applications.map(function (app) { return ({
            namespace: data.namespace.name,
            name: app.name,
            istioSidecar: app.istioSidecar,
            healthPromise: API.getAppHealth(data.namespace.name, app.name, rateInterval, app.istioSidecar)
        }); });
    }
    return [];
};
export var appLink = function (namespace, app) {
    return "/namespaces/" + namespace + "/applications/" + app;
};
export var renderAppListItem = function (appItem, index) {
    var object = appItem;
    var iconName = 'applications';
    var iconType = 'pf';
    var heading = (React.createElement("div", { className: "ServiceList-Heading" },
        React.createElement("div", { className: "ServiceList-Title" },
            object.name,
            React.createElement("small", null, object.namespace))));
    var content = (React.createElement(ListViewItem, { leftContent: React.createElement(ListViewIcon, { type: iconType, name: iconName }), key: 'appItemItemView_' + index + '_' + object.namespace + '_' + object.name, heading: heading, 
        // Prettier makes irrelevant line-breaking clashing with tslint
        // prettier-ignore
        description: React.createElement(ItemDescription, { item: appItem }) }));
    return (React.createElement(Link, { key: 'appItemItem_' + index + '_' + object.namespace + '_' + object.name, to: appLink(object.namespace, object.name), style: { color: PfColors.Black } }, content));
};
//# sourceMappingURL=AppListClass.js.map