import * as React from 'react';
import { shallow } from 'enzyme';
import { ServiceDropdown } from '../ServiceDropdown';
import { shallowToJson } from 'enzyme-to-json';
describe('NamespaceDropdown', function () {
    var wrapper, setService;
    beforeEach(function () {
        setService = jest.fn();
        wrapper = shallow(React.createElement(ServiceDropdown, { setService: setService, service: '', activeNamespaces: [], disabled: false }));
    });
    it('renders ServiceDropdown correctly without custom', function () {
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
});
//# sourceMappingURL=ServiceDropdown.test.js.map