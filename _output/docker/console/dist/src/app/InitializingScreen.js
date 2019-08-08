import * as React from 'react';
import { BasicLoginCardLayout, BasicLoginPageLayout, Icon, LoginCard, LoginCardHeader, LoginPageContainer, LoginPageFooter, LoginPageHeader, Spinner } from 'patternfly-react';
import { style } from 'typestyle';
import { isKioskMode } from '../utils/SearchParamUtils';
var kialiTitle = require('../assets/img/logo-login.svg');
var defaultErrorStyle = style({
    $nest: {
        '& p:last-of-type': {
            textAlign: 'right'
        },
        '& textarea, & hr': {
            display: 'none'
        },
        '& p:first-of-type': {
            textAlign: 'left'
        }
    }
});
var expandedErrorStyle = style({
    $nest: {
        '& p:last-of-type': {
            display: 'none'
        },
        '& textarea': {
            width: '100%',
            whiteSpace: 'pre'
        }
    }
});
var InitializingScreen = function (props) {
    var errorDiv = React.createRef();
    var onClickHandler = function (e) {
        e.preventDefault();
        if (errorDiv.current) {
            errorDiv.current.setAttribute('class', expandedErrorStyle);
        }
    };
    if (document.documentElement) {
        document.documentElement.className = isKioskMode() ? 'kiosk' : '';
    }
    return (React.createElement(LoginPageContainer, { style: { backgroundImage: 'none' } },
        React.createElement(BasicLoginPageLayout, null,
            React.createElement(LoginPageHeader, { logoSrc: kialiTitle }),
            React.createElement(BasicLoginCardLayout, null,
                React.createElement(LoginCard, null,
                    React.createElement(LoginCardHeader, null, props.errorMsg ? (React.createElement("div", { ref: errorDiv, className: defaultErrorStyle },
                        React.createElement("p", null,
                            React.createElement(Icon, { type: "pf", name: "error-circle-o" }),
                            " ",
                            props.errorMsg),
                        props.errorDetails ? (React.createElement(React.Fragment, null,
                            React.createElement("p", null,
                                React.createElement("a", { href: "#", onClick: onClickHandler }, "Show details")),
                            React.createElement("hr", null),
                            React.createElement("textarea", { readOnly: true, rows: 10 }, props.errorDetails))) : null)) : (React.createElement(React.Fragment, null,
                        React.createElement(Spinner, { loading: true }),
                        React.createElement("h1", null, "Initializing..."))))),
                React.createElement(LoginPageFooter, null)))));
};
export default InitializingScreen;
//# sourceMappingURL=InitializingScreen.js.map