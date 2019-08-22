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
import * as React from 'react';
import { shallow } from 'enzyme';
import TrafficDetails from '../TrafficDetails';
import { MetricsObjectTypes } from '../../../types/Metrics';
import { GraphType, NodeType } from '../../../types/Graph';
describe('TrafficDetails', function () {
    var INBOUND_IDX = 0;
    var OUTBOUND_IDX = 1;
    var trafficDetailProps = {
        duration: 60,
        itemType: MetricsObjectTypes.WORKLOAD.valueOf(),
        namespace: 'ns',
        onDurationChanged: jest.fn(),
        onRefresh: jest.fn(),
        workloadName: 'wk'
    };
    var buildGraph = function (nodes) {
        var _a;
        var uniqSet = new Set((_a = []).concat.apply(_a, nodes));
        var uniqNodes = Array.from(uniqSet);
        return {
            duration: 60,
            elements: {
                edges: nodes.map(function (tuple) { return ({
                    data: {
                        id: tuple[0].id + tuple[1].id,
                        source: tuple[0].id,
                        target: tuple[1].id,
                        traffic: {
                            protocol: ''
                        }
                    }
                }); }),
                nodes: uniqNodes.map(function (value) { return ({
                    data: value
                }); })
            },
            graphType: GraphType.WORKLOAD,
            timestamp: 0
        };
    };
    var buildWorkloadNode = function (name) { return ({
        id: name,
        nodeType: NodeType.WORKLOAD,
        namespace: 'ns',
        workload: name,
        traffic: [
            {
                protocol: ''
            }
        ]
    }); };
    var buildServiceNode = function (name) { return ({
        id: name,
        nodeType: NodeType.SERVICE,
        namespace: 'ns',
        service: name,
        traffic: [
            {
                protocol: ''
            }
        ]
    }); };
    var resolveTrafficLists = function (wrapper) {
        var lists = wrapper.find('DetailedTrafficList');
        if (lists.length !== 2) {
            return {
                inboundList: [],
                outboundList: []
            };
        }
        var inboundRows = lists
            .at(INBOUND_IDX)
            .dive()
            .find('TableGridRow');
        var outboundRows = lists
            .at(OUTBOUND_IDX)
            .dive()
            .find('TableGridRow');
        var toText = function (item) {
            var icon = item.find('Icon');
            if (icon.length > 1 && icon.at(1).prop('style').paddingLeft) {
                return ('->' +
                    item
                        .find('Link')
                        .first()
                        .children()
                        .text());
            }
            if (item.find('Link').length === 0) {
                return '';
            }
            return item
                .find('Link')
                .first()
                .children()
                .text();
        };
        var inboundList = inboundRows.map(toText);
        var outboundList = outboundRows.map(toText);
        return {
            inboundList: inboundList,
            outboundList: outboundList
        };
    };
    it('renders nothing if traffic data is null', function () {
        var wrapper = shallow(React.createElement(TrafficDetails, __assign({}, trafficDetailProps, { trafficData: null })));
        expect(wrapper.type()).toBeNull();
    });
    it('pass down empty traffic if graph is empty', function () {
        var traffic = {
            duration: 60,
            elements: {},
            graphType: GraphType.WORKLOAD,
            timestamp: 0
        };
        var wrapper = shallow(React.createElement(TrafficDetails, __assign({}, trafficDetailProps, { trafficData: traffic })));
        var lists = wrapper.find('DetailedTrafficList');
        var inboundList = lists.at(INBOUND_IDX);
        var outboundList = lists.at(OUTBOUND_IDX);
        expect(inboundList.prop('traffic')).toHaveLength(0);
        expect(outboundList.prop('traffic')).toHaveLength(0);
    });
    it('pass down empty traffic if graph does not have target node', function () {
        var wk1 = buildWorkloadNode('wk1');
        var wk2 = buildWorkloadNode('wk2');
        var traffic = buildGraph([
            [wk1, wk2] // traffic from wk1 to wk2 (no wk involved)
        ]);
        var wrapper = shallow(React.createElement(TrafficDetails, __assign({}, trafficDetailProps, { trafficData: traffic })));
        var lists = wrapper.find('DetailedTrafficList');
        var inboundList = lists.at(INBOUND_IDX);
        var outboundList = lists.at(OUTBOUND_IDX);
        expect(inboundList.prop('traffic')).toHaveLength(0);
        expect(outboundList.prop('traffic')).toHaveLength(0);
    });
    it('pass down traffic - simple in-out graph one level', function () {
        var wk1 = buildWorkloadNode('wk1');
        var wk2 = buildWorkloadNode('wk2');
        var wk = buildWorkloadNode('wk');
        var traffic = buildGraph([
            [wk1, wk],
            [wk, wk2] // traffic from wk to wk2 (outbound)
        ]);
        var wrapper = shallow(React.createElement(TrafficDetails, __assign({}, trafficDetailProps, { trafficData: traffic })));
        var _a = resolveTrafficLists(wrapper), inboundList = _a.inboundList, outboundList = _a.outboundList;
        expect(inboundList).toHaveLength(1);
        expect(inboundList.join()).toEqual('wk1');
        expect(outboundList).toHaveLength(1);
        expect(outboundList.join()).toEqual('wk2');
    });
    it('pass down traffic - simple in-out graph two levels', function () {
        var wk1 = buildWorkloadNode('wk1');
        var svc1 = buildServiceNode('svc1');
        var wk2 = buildWorkloadNode('wk2');
        var svc2 = buildServiceNode('svc2');
        var wk = buildWorkloadNode('wk');
        var traffic = buildGraph([
            [wk1, svc1],
            [svc1, wk],
            [wk, svc2],
            [svc2, wk2] // traffic from svc2 to wk2 (outbound)
        ]);
        var wrapper = shallow(React.createElement(TrafficDetails, __assign({}, trafficDetailProps, { trafficData: traffic })));
        var _a = resolveTrafficLists(wrapper), inboundList = _a.inboundList, outboundList = _a.outboundList;
        expect(inboundList).toHaveLength(2);
        expect(inboundList.join()).toEqual('svc1,->wk1');
        expect(outboundList).toHaveLength(2);
        expect(outboundList.join()).toEqual('svc2,->wk2');
    });
    it('pass down traffic - slightly more complex inbound', function () {
        var wk1 = buildWorkloadNode('wk1');
        var wk2 = buildWorkloadNode('wk2');
        var wk3 = buildWorkloadNode('wk3');
        var svc1 = buildServiceNode('svc1');
        var svc2 = buildServiceNode('svc2');
        var wk = buildWorkloadNode('wk');
        var traffic = buildGraph([
            [wk1, svc1],
            [wk2, svc1],
            [wk2, svc2],
            [svc2, wk],
            [svc1, wk],
            [wk3, wk] // traffic from wk3 to wk (direct workload to workload traffic)
        ]);
        var wrapper = shallow(React.createElement(TrafficDetails, __assign({}, trafficDetailProps, { trafficData: traffic })));
        var inboundList = resolveTrafficLists(wrapper).inboundList;
        expect(inboundList).toHaveLength(6);
        expect(inboundList.join()).toEqual('svc1,->wk1,->wk2,svc2,->wk2,wk3');
    });
});
//# sourceMappingURL=TrafficDetails.test.js.map