import * as React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { HealthIndicator, DisplayMode } from '../HealthIndicator';
import { AppHealth } from '../../../types/Health';
describe('HealthIndicator', function () {
    it('renders when empty', function () {
        // SMALL
        var wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", mode: DisplayMode.SMALL }));
        expect(wrapper.html()).not.toContain('pficon');
        // LARGE
        wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", mode: DisplayMode.LARGE }));
        expect(wrapper.html()).not.toContain('pficon');
    });
    it('renders healthy', function () {
        var health = new AppHealth([
            { name: 'A', availableReplicas: 1, currentReplicas: 1, desiredReplicas: 1 },
            { name: 'B', availableReplicas: 2, currentReplicas: 2, desiredReplicas: 2 }
        ], { errorRatio: -1, inboundErrorRatio: -1, outboundErrorRatio: -1 }, { rateInterval: 600, hasSidecar: true });
        // SMALL
        var wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.SMALL }));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
        var html = wrapper.html();
        expect(html).toContain('#3f9c35');
        // LARGE
        wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.LARGE }));
        html = wrapper.html();
        expect(html).toContain('#3f9c35');
    });
    it('renders workloads degraded', function () {
        var health = new AppHealth([
            { name: 'A', availableReplicas: 1, currentReplicas: 1, desiredReplicas: 10 },
            { name: 'B', availableReplicas: 2, currentReplicas: 2, desiredReplicas: 2 }
        ], { errorRatio: -1, inboundErrorRatio: -1, outboundErrorRatio: -1 }, { rateInterval: 600, hasSidecar: true });
        // SMALL
        var wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.SMALL }));
        var html = wrapper.html();
        expect(html).toContain('#ec7a08');
        // LARGE
        wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.LARGE }));
        html = wrapper.html();
        expect(html).toContain('#ec7a08');
        expect(html).toContain('1 / 10');
    });
    it('renders some scaled down workload', function () {
        var health = new AppHealth([
            { name: 'A', availableReplicas: 0, currentReplicas: 0, desiredReplicas: 0 },
            { name: 'B', availableReplicas: 2, currentReplicas: 2, desiredReplicas: 2 }
        ], { errorRatio: -1, inboundErrorRatio: -1, outboundErrorRatio: -1 }, { rateInterval: 600, hasSidecar: true });
        // SMALL
        var wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.SMALL }));
        var html = wrapper.html();
        expect(html).toContain('#3f9c35');
        // LARGE
        wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.LARGE }));
        html = wrapper.html();
        expect(html).toContain('#3f9c35');
        expect(html).toContain('0 / 0');
    });
    it('renders all workloads down', function () {
        var health = new AppHealth([
            { name: 'A', availableReplicas: 0, currentReplicas: 0, desiredReplicas: 0 },
            { name: 'B', availableReplicas: 0, currentReplicas: 0, desiredReplicas: 0 }
        ], { errorRatio: -1, inboundErrorRatio: -1, outboundErrorRatio: -1 }, { rateInterval: 600, hasSidecar: true });
        // SMALL
        var wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.SMALL }));
        var html = wrapper.html();
        expect(html).toContain('#cc0000');
        // LARGE
        wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.LARGE }));
        html = wrapper.html();
        expect(html).toContain('#cc0000');
    });
    it('renders error rate failure', function () {
        var health = new AppHealth([{ name: 'A', availableReplicas: 1, currentReplicas: 1, desiredReplicas: 1 }], { errorRatio: 0.3, inboundErrorRatio: 0.1, outboundErrorRatio: 0.2 }, { rateInterval: 600, hasSidecar: true });
        // SMALL
        var wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.SMALL }));
        var html = wrapper.html();
        expect(html).toContain('#cc0000');
        // LARGE
        wrapper = shallow(React.createElement(HealthIndicator, { id: "svc", health: health, mode: DisplayMode.LARGE }));
        html = wrapper.html();
        expect(html).toContain('#cc0000');
        expect(html).toContain('Outbound: 20.00%');
        expect(html).toContain('Inbound: 10.00%');
    });
});
//# sourceMappingURL=HealthIndicator.test.js.map