import * as React from 'react';
import { shallow } from 'enzyme';
import { LookBack } from '../LookBack';
describe('LookBack', function () {
    var wrapper, setLookback;
    beforeEach(function () {
        setLookback = jest.fn();
        wrapper = shallow(React.createElement(LookBack, { setLookback: setLookback, disabled: false, lookback: 3600 }));
    });
    it('renders LookBack correctly without custom', function () {
        expect(wrapper).toBeDefined();
    });
});
//# sourceMappingURL=LookBack.test.js.map