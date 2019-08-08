import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import ToolbarDropdown from '../ToolbarDropdown';
import { config } from '../../../config';
import { serverConfig } from '../../../config/ServerConfig';
var optionsChanged = jest.fn();
var data = [
    {
        id: 'graph_filter_interval_duration',
        default: config.toolbar.defaultDuration,
        options: serverConfig.durations
    },
    {
        id: 'metrics_filter_poll_interval',
        default: config.toolbar.defaultPollInterval,
        options: config.toolbar.pollInterval
    },
    { id: 'graph_filter_layouts', default: 'cola', options: config.toolbar.graphLayouts }
];
describe('ToolbarDropdown', function () {
    it('Render correctly all dropdowns', function () {
        data.forEach(function (dropdownType) {
            var wrapper = shallow(React.createElement(ToolbarDropdown, { id: dropdownType.id, disabled: false, handleSelect: jest.fn(), nameDropdown: dropdownType.id, initialValue: dropdownType.default, initialLabel: dropdownType.options[dropdownType.default], options: dropdownType.options }));
            expect(shallowToJson(wrapper)).toMatchSnapshot();
        });
    });
    it('Render dropdowns correctly with controlled values and labels', function () {
        data.forEach(function (dropdownType) {
            var wrapper = shallow(React.createElement(ToolbarDropdown, { id: dropdownType.id, disabled: false, handleSelect: jest.fn(), nameDropdown: dropdownType.id, value: dropdownType.default, label: dropdownType.options[dropdownType.default], options: dropdownType.options }));
            expect(shallowToJson(wrapper)).toMatchSnapshot();
        });
    });
    it('changes trigger parent callback', function () {
        var wrapper = mount(React.createElement(ToolbarDropdown, { id: 'graph_filter_interval_duration', disabled: false, handleSelect: optionsChanged, nameDropdown: 'Duration', initialValue: config.toolbar.defaultDuration, initialLabel: serverConfig.durations[config.toolbar.defaultDuration], options: serverConfig.durations }));
        var elt = wrapper
            .find('#graph_filter_interval_duration')
            .find('SafeAnchor')
            .first();
        elt.simulate('click');
        expect(optionsChanged).toHaveBeenCalledTimes(1);
    });
    it('Check properties', function () {
        var idElement = 'MyToolbarDropdown';
        var nameDropdownElt = 'NameDropdownElt';
        var initialValue = 'InitialValue';
        var initialLabel = 'InitialLabel';
        var options = {
            60: 'Last minute',
            300: 'Last 5 minutes',
            600: 'Last 10 minutes',
            1800: 'Last 30 minutes',
            3600: 'Last hour',
            10800: 'Last 3 hours',
            21600: 'Last 6 hours',
            43200: 'Last 12 hours',
            86400: 'Last day',
            604800: 'Last 7 days',
            2592000: 'last 30 days'
        };
        var wrapper = shallow(React.createElement(ToolbarDropdown, { id: 'MyToolbarDropdown', disabled: false, handleSelect: optionsChanged, nameDropdown: nameDropdownElt, initialValue: initialValue, initialLabel: initialLabel, options: options }));
        var elt = wrapper.find('#' + idElement);
        expect(elt.prop('title')).toEqual(initialLabel);
        expect(elt.prop('id')).toEqual(idElement);
        expect(elt.children().length).toEqual(Object.keys(options).length);
    });
});
//# sourceMappingURL=ToolbarDropdown.test.js.map