import * as GraphData from '../__mockData__/getGraphElements';
import * as ServiceData from '../__mockData__/getServiceDetail';
export var getGraphElements = function (params) {
    if (GraphData.hasOwnProperty(params.namespaces)) {
        return Promise.resolve({ data: GraphData[params.namespaces] });
    }
    else {
        return Promise.resolve({ data: {} });
    }
};
export var getServiceDetail = function (_namespace, _service) {
    return Promise.resolve(ServiceData.SERVICE_DETAILS);
};
//# sourceMappingURL=Api.js.map