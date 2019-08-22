import * as React from 'react';
import { Breadcrumb } from 'patternfly-react';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import * as IstioConfigListFilters from './FiltersAndSorts';
import IstioConfigListContainer from './IstioConfigListComponent';
var IstioConfigListPage = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement(Breadcrumb, { title: true },
            React.createElement(Breadcrumb.Item, { active: true }, "Istio Config")),
        React.createElement(IstioConfigListContainer, { pagination: ListPagesHelper.currentPagination(), currentSortField: ListPagesHelper.currentSortField(IstioConfigListFilters.sortFields), isSortAscending: ListPagesHelper.isCurrentSortAscending() })));
};
export default IstioConfigListPage;
//# sourceMappingURL=IstioConfigListPage.js.map