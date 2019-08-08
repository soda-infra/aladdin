import * as MessageCenter from '../utils/MessageCenter';
import * as API from '../services/Api';
export var fetchTrafficDetails = function (node, restParams) {
    return API.getNodeGraphElements(node, restParams).then(function (response) {
        // Check that response is formed as expected.
        if (!response.data || !response.data.elements || !response.data.elements.nodes || !response.data.elements.edges) {
            MessageCenter.add('Bad traffic data');
            return;
        }
        return response.data;
    }, function (error) {
        MessageCenter.add(API.getErrorMsg('Could not fetch traffic data', error));
        return undefined;
    });
};
//# sourceMappingURL=TrafficDetailsHelper.js.map