import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { NamespaceActions } from '../NamespaceAction';
import NamespaceThunkActions from '../NamespaceThunkActions';
var middlewares = [thunk];
var mockStore = configureMockStore(middlewares);
describe('NamespaceActions', function () {
    var RealDate = Date;
    var mockDate = function (date) {
        global.Date = jest.fn(function () { return date; });
        return date;
    };
    afterEach(function () {
        global.Date = RealDate;
    });
    it('should set active namespaces', function () {
        expect(NamespaceActions.setActiveNamespaces([{ name: 'istio' }]).payload).toEqual([{ name: 'istio' }]);
    });
    it('should toggle active namespace', function () {
        expect(NamespaceActions.toggleActiveNamespace({ name: 'istio' }).payload).toEqual({ name: 'istio' });
    });
    it('should set filter', function () {
        expect(NamespaceActions.setFilter('istio').payload).toEqual('istio');
    });
    it('request is success', function () {
        var currentDate = new Date();
        var expectedAction = {
            list: [{ name: 'a' }, { name: 'b' }],
            receivedAt: currentDate
        };
        expect(NamespaceActions.receiveList([{ name: 'a' }, { name: 'b' }], currentDate).payload).toEqual(expectedAction);
    });
    it('should success if api request success', function () {
        var currentDate = new Date();
        mockDate(currentDate);
        var expectedActions = [
            NamespaceActions.requestStarted(),
            NamespaceActions.receiveList([{ name: 'a' }, { name: 'b' }, { name: 'c' }], currentDate)
        ];
        var axiosMock = new axiosMockAdapter(axios);
        axiosMock.onGet('/api/namespaces').reply(200, [{ name: 'a' }, { name: 'b' }, { name: 'c' }]);
        var store = mockStore({});
        return store.dispatch(NamespaceThunkActions.asyncFetchNamespaces()).then(function () {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    it('should fail if api request fails', function () {
        var expectedActions = [NamespaceActions.requestStarted(), NamespaceActions.requestFailed()];
        var axiosMock = new axiosMockAdapter(axios);
        axiosMock.onGet('/api/namespaces').reply(404);
        var store = mockStore({});
        return store.dispatch(NamespaceThunkActions.asyncFetchNamespaces()).then(function () {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    it("it won't fetch a namespace if one is loading", function () {
        var expectedActions = [];
        var store = mockStore({
            namespaces: {
                isFetching: true
            }
        });
        return store.dispatch(NamespaceThunkActions.fetchNamespacesIfNeeded()).then(function () {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
//# sourceMappingURL=NamespaceAction.test.js.map