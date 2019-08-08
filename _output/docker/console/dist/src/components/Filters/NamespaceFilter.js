import * as API from '../../services/Api';
import { FILTER_ACTION_APPEND } from '../../types/Filters';
var NamespaceFilter = /** @class */ (function () {
    function NamespaceFilter() {
    }
    NamespaceFilter.id = 'namespaces';
    NamespaceFilter.category = 'Namespace';
    NamespaceFilter.create = function () {
        return {
            id: NamespaceFilter.id,
            title: NamespaceFilter.category,
            placeholder: 'Filter by Namespace',
            filterType: 'select',
            action: FILTER_ACTION_APPEND,
            filterValues: [],
            loader: function () {
                return API.getNamespaces().then(function (response) {
                    return response.data.map(function (ns) { return ({ title: ns.name, id: ns.name }); });
                });
            }
        };
    };
    return NamespaceFilter;
}());
export { NamespaceFilter };
export default NamespaceFilter;
//# sourceMappingURL=NamespaceFilter.js.map