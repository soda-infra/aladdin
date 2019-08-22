import namespaceState from '../NamespaceState';
import { GlobalActions } from '../../actions/GlobalActions';
import { NamespaceActions } from '../../actions/NamespaceAction';
describe('Namespaces reducer', function () {
    it('should return the initial state', function () {
        expect(namespaceState(undefined, GlobalActions.unknown())).toEqual({
            isFetching: false,
            activeNamespaces: [],
            items: [],
            lastUpdated: undefined,
            filter: ''
        });
    });
    it('should handle ACTIVE_NAMESPACES', function () {
        var currentState = {
            activeNamespaces: [{ name: 'my-namespace' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        var requestStartedAction = NamespaceActions.setActiveNamespaces([{ name: 'istio' }]);
        var expectedState = {
            activeNamespaces: [{ name: 'istio' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        expect(namespaceState(currentState, requestStartedAction)).toEqual(expectedState);
    });
    it('should handle SET_FILTER', function () {
        var currentState = {
            activeNamespaces: [{ name: 'my-namespace' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        var requestStartedAction = NamespaceActions.setFilter('istio');
        var expectedState = {
            activeNamespaces: [{ name: 'my-namespace' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: 'istio'
        };
        expect(namespaceState(currentState, requestStartedAction)).toEqual(expectedState);
    });
    it('should handle TOGGLE_NAMESPACE to remove a namespace', function () {
        var currentState = {
            activeNamespaces: [{ name: 'my-namespace' }, { name: 'my-namespace-2' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        var requestStartedAction = NamespaceActions.toggleActiveNamespace({ name: 'my-namespace' });
        var expectedState = {
            activeNamespaces: [{ name: 'my-namespace-2' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        expect(namespaceState(currentState, requestStartedAction)).toEqual(expectedState);
    });
    it('should handle TOGGLE_NAMESPACE to add a namespace', function () {
        var currentState = {
            activeNamespaces: [{ name: 'my-namespace' }, { name: 'my-namespace-2' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        var requestStartedAction = NamespaceActions.toggleActiveNamespace({ name: 'my-namespace-3' });
        var expectedState = {
            activeNamespaces: [{ name: 'my-namespace' }, { name: 'my-namespace-2' }, { name: 'my-namespace-3' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        expect(namespaceState(currentState, requestStartedAction)).toEqual(expectedState);
    });
    it('should handle NAMESPACE_REQUEST_STARTED', function () {
        var currentState = {
            activeNamespaces: [{ name: 'my-namespace' }],
            isFetching: false,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        var requestStartedAction = NamespaceActions.requestStarted();
        var expectedState = {
            activeNamespaces: [{ name: 'my-namespace' }],
            isFetching: true,
            items: [],
            lastUpdated: undefined,
            filter: ''
        };
        expect(namespaceState(currentState, requestStartedAction)).toEqual(expectedState);
    });
    it('should handle NAMESPACE_FAILED', function () {
        var currentState = {
            activeNamespaces: [{ name: 'my-namespace' }],
            isFetching: true,
            items: [],
            filter: ''
        };
        var requestStartedAction = NamespaceActions.requestFailed();
        var expectedState = {
            activeNamespaces: [{ name: 'my-namespace' }],
            isFetching: false,
            items: [],
            filter: ''
        };
        expect(namespaceState(currentState, requestStartedAction)).toEqual(expectedState);
    });
    it('should handle NAMESPACE_SUCCESS', function () {
        var currentDate = new Date();
        var currentState = {
            activeNamespaces: [{ name: 'my-namespace' }],
            isFetching: true,
            items: [{ name: 'old' }, { name: 'my-namespace' }],
            lastUpdated: undefined,
            filter: ''
        };
        var requestStartedAction = NamespaceActions.receiveList([{ name: 'a' }, { name: 'b' }, { name: 'c' }], currentDate);
        var expectedState = {
            activeNamespaces: [],
            isFetching: false,
            items: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
            lastUpdated: currentDate,
            filter: ''
        };
        expect(namespaceState(currentState, requestStartedAction)).toEqual(expectedState);
    });
});
//# sourceMappingURL=NamespacesReducer.test.js.map