import * as React from 'react';
import { Breadcrumb } from 'patternfly-react';
import * as ListPagesHelper from '../../components/ListPage/ListPagesHelper';
import AppListContainer from './AppListComponent';
import * as AppListFilters from './FiltersAndSorts';
var AppListPage = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement(Breadcrumb, { title: true },
            React.createElement(Breadcrumb.Item, { active: true }, "Applications")),
        React.createElement(AppListContainer, { pagination: ListPagesHelper.currentPagination(), currentSortField: ListPagesHelper.currentSortField(AppListFilters.sortFields), isSortAscending: ListPagesHelper.isCurrentSortAscending() })));
};
export default AppListPage;
//# sourceMappingURL=AppListPage.js.map