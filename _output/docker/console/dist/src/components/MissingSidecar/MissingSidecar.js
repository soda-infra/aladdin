var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon, OverlayTrigger, Tooltip } from 'patternfly-react';
import { icons } from '../../config';
var MissingSidecar = function (props) {
    var style = props.style, text = props.text, textTooltip = props.textTooltip, type = props.type, name = props.name, color = props.color, tooltip = props.tooltip, otherProps = __rest(props, ["style", "text", "textTooltip", "type", "name", "color", "tooltip"]);
    var iconComponent = (React.createElement("span", __assign({ style: style }, otherProps),
        React.createElement(Icon, { type: type, name: name, style: { color: color } }),
        !tooltip && React.createElement("span", { style: { marginLeft: '5px' } }, text)));
    return tooltip ? (React.createElement(OverlayTrigger, { overlay: React.createElement(Tooltip, null,
            React.createElement("strong", null, textTooltip)), placement: "right", trigger: ['hover', 'focus'], rootClose: false }, iconComponent)) : (iconComponent);
};
MissingSidecar.propTypes = {
    text: PropTypes.string,
    textTooltip: PropTypes.string,
    tooltip: PropTypes.bool,
    type: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string
};
MissingSidecar.defaultProps = {
    text: 'Missing Sidecar',
    textTooltip: 'Missing Sidecar',
    tooltip: false,
    type: icons.istio.missingSidecar.type,
    name: icons.istio.missingSidecar.name,
    color: icons.istio.missingSidecar.color
};
export default MissingSidecar;
//# sourceMappingURL=MissingSidecar.js.map