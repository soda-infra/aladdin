import * as React from 'react';
import { Label as PfLabel } from 'patternfly-react';
import './Label.css';
import { canRender } from '../../utils/SafeRender';
var Label = function (props) {
    var name = props.name, value = props.value;
    if (canRender(name) && canRender(value)) {
        return (React.createElement("span", { className: "label-pair" },
            React.createElement(PfLabel, { bsStyle: "primary", className: "label-key" }, name),
            React.createElement(PfLabel, { bsStyle: "primary", className: "label-value" }, value || '')));
    }
    else {
        return React.createElement("span", null, "This label has an unexpected format");
    }
};
export default Label;
//# sourceMappingURL=Label.js.map