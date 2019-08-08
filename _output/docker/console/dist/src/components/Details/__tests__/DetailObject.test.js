import * as React from 'react';
import { shallow } from 'enzyme';
import { Icon } from 'patternfly-react';
import { default as DetailObject } from '../DetailObject';
import { PfColors } from '../../Pf/PfColors';
import { shallowToJson } from 'enzyme-to-json';
describe('DetailObject test', function () {
    var detail = {
        destination: {
            host: 'reviews',
            subset: 'v1',
            port: {
                number: 22,
                name: 'ssh'
            }
        },
        weight: 85
    };
    var mockRandom = function () {
        var mockMath = Object.create(global.Math);
        mockMath.random = function () { return 0.8; };
        global.Math = mockMath;
    };
    it('prints a nested list with all attributes in the detail', function () {
        mockRandom();
        var wrapper = shallow(React.createElement(DetailObject, { name: name, detail: detail }));
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.html()).toContain('<span class="text-capitalize">[host]</span>');
        expect(wrapper.html()).toContain('<span class="text-capitalize">[subset]</span>');
        expect(wrapper.html()).toContain('<span class="text-capitalize">[weight]</span>');
        expect(wrapper.html()).toContain('<strong class="text-capitalize">port</strong>');
        expect(wrapper.html()).toContain('<span class="text-capitalize">[number]</span>');
        expect(wrapper.html()).toContain('<span class="text-capitalize">[name]</span>');
    });
    it("doesn't print excluded fields", function () {
        mockRandom();
        var wrapper = shallow(React.createElement(DetailObject, { name: name, detail: detail, exclude: ['port'] }));
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        expect(wrapper.html()).toContain('<span class="text-capitalize">[host]</span>');
        expect(wrapper.html()).toContain('<span class="text-capitalize">[subset]</span>');
        expect(wrapper.html()).toContain('<span class="text-capitalize">[weight]</span>');
        expect(wrapper.html()).not.toContain('<strong class="text-capitalize">port</strong>');
        expect(wrapper.html()).not.toContain('<span class="text-capitalize">[number]</span>');
        expect(wrapper.html()).not.toContain('<span class="text-capitalize">[name]</span>');
    });
    it('prints an alert message', function () {
        var validation = {
            message: 'Not all checks passed',
            icon: 'error-circle-o',
            color: PfColors.Red400
        };
        mockRandom();
        var wrapper = shallow(React.createElement(DetailObject, { name: name, detail: detail, validation: validation }));
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        var iconWrapper = wrapper.find(Icon);
        expect(iconWrapper.prop('type')).toEqual('pf');
        expect(iconWrapper.prop('name')).toEqual(validation.icon);
        expect(iconWrapper.parent().html()).toContain(validation.message);
    });
    it("doesn't print any alert message", function () {
        var validation = {
            message: '',
            icon: 'error-circle-o',
            color: PfColors.Red400
        };
        mockRandom();
        var wrapper = shallow(React.createElement(DetailObject, { name: name, detail: detail, validation: validation }));
        expect(shallowToJson(wrapper)).toBeDefined();
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        var iconWrapper = wrapper.find(Icon);
        expect(iconWrapper.length).toEqual(0);
    });
});
//# sourceMappingURL=DetailObject.test.js.map