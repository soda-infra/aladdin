import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
var RightToolbar = function (props) { return (React.createElement(Button, { variant: "primary", "aria-label": "SearchTraces", onClick: function () { return props.onSubmit(); }, isDisabled: props.disabled },
    React.createElement(SearchIcon, null),
    " Search Traces")); };
export default RightToolbar;
//# sourceMappingURL=RightToolbar.js.map