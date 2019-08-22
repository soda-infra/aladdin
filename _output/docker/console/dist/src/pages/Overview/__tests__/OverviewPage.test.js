import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { shallowToJson } from 'enzyme-to-json';
import { mount, shallow } from 'enzyme';
import { OverviewPage } from '../OverviewPage';
import OverviewPageContainer from '../OverviewPage';
import { FilterSelected } from '../../../components/Filters/StatefulFilters';
import * as API from '../../../services/Api';
import { HEALTHY, FAILURE, DEGRADED } from '../../../types/Health';
import { store } from '../../../store/ConfigStore';
import { MTLSStatuses } from '../../../types/TLSStatus';
window.SVGPathElement = function (a) { return a; };
var mockAPIToPromise = function (func, obj, encapsData) {
    return new Promise(function (resolve, reject) {
        jest.spyOn(API, func).mockImplementation(function () {
            return new Promise(function (r) {
                if (encapsData) {
                    r({ data: obj });
                }
                else {
                    r(obj);
                }
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
var mockNamespaces = function (names) {
    return mockAPIToPromise('getNamespaces', names.map(function (n) { return ({ name: n }); }), true);
};
var mockNamespaceHealth = function (obj) {
    return mockAPIToPromise('getNamespaceAppHealth', obj, false);
};
var mounted;
var mountPage = function () {
    mounted = mount(React.createElement(Provider, { store: store },
        React.createElement(Router, null,
            React.createElement(OverviewPageContainer, null))));
};
describe('Overview page', function () {
    beforeEach(function () {
        mounted = null;
    });
    afterEach(function () {
        if (mounted) {
            mounted.unmount();
        }
    });
    it('renders initial layout', function () {
        var wrapper = shallow(React.createElement(OverviewPage, { meshStatus: MTLSStatuses.NOT_ENABLED }));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
    it('renders all without filters', function (done) {
        FilterSelected.setSelected([]);
        Promise.all([
            mockNamespaces(['a', 'b', 'c']),
            mockNamespaceHealth({
                app1: {
                    getGlobalStatus: function () { return HEALTHY; }
                },
                app2: {
                    getGlobalStatus: function () { return FAILURE; }
                }
            })
        ]).then(function () {
            mounted.update();
            // All 3 namespaces rendered
            expect(mounted.find('Card')).toHaveLength(3);
            done();
        });
        mountPage();
    });
    it('filters failures match', function (done) {
        FilterSelected.setSelected([
            {
                category: 'Health',
                value: 'Failure'
            }
        ]);
        Promise.all([
            mockNamespaces(['a']),
            mockNamespaceHealth({
                app1: {
                    getGlobalStatus: function () { return DEGRADED; }
                },
                app2: {
                    getGlobalStatus: function () { return FAILURE; }
                },
                app3: {
                    getGlobalStatus: function () { return HEALTHY; }
                }
            })
        ]).then(function () {
            mounted.update();
            expect(mounted.find('Card')).toHaveLength(1);
            done();
        });
        mountPage();
    });
    it('filters failures no match', function (done) {
        FilterSelected.setSelected([
            {
                category: 'Health',
                value: 'Failure'
            }
        ]);
        Promise.all([
            mockNamespaces(['a']),
            mockNamespaceHealth({
                app1: {
                    getGlobalStatus: function () { return DEGRADED; }
                },
                app2: {
                    getGlobalStatus: function () { return HEALTHY; }
                },
                app3: {
                    getGlobalStatus: function () { return HEALTHY; }
                }
            })
        ]).then(function () {
            mounted.update();
            expect(mounted.find('Card')).toHaveLength(0);
            done();
        });
        mountPage();
    });
    it('multi-filters health match', function (done) {
        FilterSelected.setSelected([
            {
                category: 'Health',
                value: 'Failure'
            },
            {
                category: 'Health',
                value: 'Degraded'
            }
        ]);
        Promise.all([
            mockNamespaces(['a']),
            mockNamespaceHealth({
                app1: {
                    getGlobalStatus: function () { return DEGRADED; }
                },
                app2: {
                    getGlobalStatus: function () { return HEALTHY; }
                }
            })
        ]).then(function () {
            mounted.update();
            expect(mounted.find('Card')).toHaveLength(1);
            done();
        });
        mountPage();
    });
    it('multi-filters health no match', function (done) {
        FilterSelected.setSelected([
            {
                category: 'Health',
                value: 'Failure'
            },
            {
                category: 'Health',
                value: 'Degraded'
            }
        ]);
        Promise.all([
            mockNamespaces(['a']),
            mockNamespaceHealth({
                app1: {
                    getGlobalStatus: function () { return HEALTHY; }
                },
                app2: {
                    getGlobalStatus: function () { return HEALTHY; }
                }
            })
        ]).then(function () {
            mounted.update();
            expect(mounted.find('Card')).toHaveLength(0);
            done();
        });
        mountPage();
    });
    it('filters namespaces info name match', function (done) {
        FilterSelected.setSelected([
            {
                category: 'Name',
                value: 'bc'
            }
        ]);
        Promise.all([
            mockNamespaces(['abc', 'bce', 'ced']),
            mockNamespaceHealth({
                app1: {
                    getGlobalStatus: function () { return HEALTHY; }
                }
            })
        ]).then(function () {
            mounted.update();
            expect(mounted.find('Card')).toHaveLength(2);
            done();
        });
        mountPage();
    });
    it('filters namespaces info name no match', function (done) {
        FilterSelected.setSelected([
            {
                category: 'Name',
                value: 'yz'
            }
        ]);
        mockNamespaces(['abc', 'bce', 'ced']).then(function () {
            mounted.update();
            expect(mounted.find('Card')).toHaveLength(0);
            done();
        });
        mountPage();
    });
    it('filters namespaces info name and health match', function (done) {
        FilterSelected.setSelected([
            {
                category: 'Name',
                value: 'bc'
            },
            {
                category: 'Health',
                value: 'Healthy'
            }
        ]);
        Promise.all([
            mockNamespaces(['abc', 'bce', 'ced']),
            mockNamespaceHealth({
                app1: {
                    getGlobalStatus: function () { return HEALTHY; }
                }
            })
        ]).then(function () {
            mounted.update();
            expect(mounted.find('Card')).toHaveLength(2);
            done();
        });
        mountPage();
    });
    it('filters namespaces info name and health no match', function (done) {
        FilterSelected.setSelected([
            {
                category: 'Name',
                value: 'bc'
            },
            {
                category: 'Health',
                value: 'Healthy'
            }
        ]);
        Promise.all([
            mockNamespaces(['abc', 'bce', 'ced']),
            mockNamespaceHealth({
                app1: {
                    getGlobalStatus: function () { return DEGRADED; }
                }
            })
        ]).then(function () {
            mounted.update();
            expect(mounted.find('Card')).toHaveLength(0);
            done();
        });
        mountPage();
    });
});
//# sourceMappingURL=OverviewPage.test.js.map