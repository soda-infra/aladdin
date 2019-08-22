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
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import CustomMetrics from '../CustomMetrics';
import * as API from '../../../services/Api';
import { store } from '../../../store/ConfigStore';
window.SVGPathElement = function (a) { return a; };
var mounted;
var mockAPIToPromise = function (func, obj) {
    return new Promise(function (resolve, reject) {
        jest.spyOn(API, func).mockImplementation(function () {
            return new Promise(function (r) {
                r({ data: obj });
                setTimeout(function () {
                    try {
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1);
            });
        });
    });
};
var mockCustomDashboard = function (dashboard) {
    return mockAPIToPromise('getCustomDashboard', dashboard);
};
describe('Custom metrics', function () {
    beforeEach(function () {
        mounted = null;
    });
    afterEach(function () {
        if (mounted) {
            mounted.unmount();
        }
    });
    it('mounts and loads empty metrics', function (done) {
        mockCustomDashboard({ title: 'foo', aggregations: [], charts: [] })
            .then(function () {
            mounted.update();
            expect(mounted.find('.card-pf')).toHaveLength(1);
            mounted.find('.card-pf').forEach(function (pfCard) { return expect(pfCard.children().length === 0); });
            done();
        })
            .catch(function (err) { return done.fail(err); });
        mounted = mount(React.createElement(Provider, { store: store },
            React.createElement(MemoryRouter, null,
                React.createElement(Route, { render: function (props) { return React.createElement(CustomMetrics, __assign({}, props, { namespace: "ns", app: "test", template: "vertx" })); } }))));
    });
});
//# sourceMappingURL=CustomMetrics.test.js.map