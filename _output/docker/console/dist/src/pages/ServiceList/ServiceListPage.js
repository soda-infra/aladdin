import * as React from 'react';
import ServiceListContainer from '../../pages/ServiceList/ServiceListComponent';
import { Breadcrumb } from 'patternfly-react';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import * as ServiceListFilters from './FiltersAndSorts';
var ServiceListPage = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement(Breadcrumb, { title: true },
            React.createElement(Breadcrumb.Item, { active: true }, "Services")),
        React.createElement(ServiceListContainer, { pagination: ListPagesHelper.currentPagination(), currentSortField: ListPagesHelper.currentSortField(ServiceListFilters.sortFields), isSortAscending: ListPagesHelper.isCurrentSortAscending() })));
};
export default ServiceListPage;
//# sourceMappingURL=ServiceListPage.js.map