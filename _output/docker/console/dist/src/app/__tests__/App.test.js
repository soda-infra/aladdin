import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../App';
import 'jest-canvas-mock';
// Mock getComputedStyle: Cytoscape relies on the result of this to have a valid paddingXXX
// Current implementation returns '' which is parsed to float as NAN, breaking cytoscape.
// Uses the default implementation and ensures we are returning a valid paddingXXX
var defaultGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = jest.fn().mockImplementation(function (element) {
    var computedStyle = defaultGetComputedStyle(element);
    for (var _i = 0, _a = ['paddingTop', 'paddingRight', 'paddingLeft', 'paddingBottom']; _i < _a.length; _i++) {
        var prop = _a[_i];
        if (computedStyle[prop] === '') {
            computedStyle[prop] = '0px';
        }
    }
    return computedStyle;
});
// jest.mock('../../services/Api');
process.env.REACT_APP_NAME = 'kiali-ui-test';
process.env.REACT_APP_VERSION = '1.0.1';
process.env.REACT_APP_GIT_HASH = '89323';
// TODO: properly handle SVG and D3 in the following 2 components
jest.mock('../../components/SummaryPanel/RpsChart');
it('renders full App without crashing', function () {
    var div = document.createElement('div');
    ReactDOM.render(React.createElement(App, null), div);
});
//# sourceMappingURL=App.test.js.map