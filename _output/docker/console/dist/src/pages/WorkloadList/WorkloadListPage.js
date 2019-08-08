import * as React from 'react';
import { Breadcrumb } from 'patternfly-react';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import WorkloadListContainer from './WorkloadListComponent';
import * as WorkloadListFilters from './FiltersAndSorts';
var WorkloadListPage = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement(Breadcrumb, { title: true },
            React.createElement(Breadcrumb.Item, { active: true }, "Workloads")),
        React.createElement(WorkloadListContainer, { pagination: ListPagesHelper.currentPagination(), currentSortField: ListPagesHelper.currentSortField(WorkloadListFilters.sortFields), isSortAscending: ListPagesHelper.isCurrentSortAscending() })));
};
export default WorkloadListPage;
//# sourceMappingURL=WorkloadListPage.js.map