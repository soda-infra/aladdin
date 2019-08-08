import * as React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import GraphLegend from '../GraphLegend';
describe('GraphLegend test', function () {
    it('should render correctly', function () {
        var wrapper = shallow(React.createElement(GraphLegend, { closeLegend: jest.fn(), isMTLSEnabled: false }));
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=GraphLegend.test.js.map