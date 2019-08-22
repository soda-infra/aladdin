import * as React from 'react';
import Iframe from 'react-iframe';
var JaegerTracesIframe = function (props) { return (React.createElement("div", { className: "container-fluid container-cards-pf", style: { height: 'calc(100vh - 100px)' } },
    React.createElement(Iframe, { id: 'jaeger-iframe', url: props.url, position: "inherit", allowFullScreen: true }))); };
export default JaegerTracesIframe;
//# sourceMappingURL=JaegerTracesIframe.js.map