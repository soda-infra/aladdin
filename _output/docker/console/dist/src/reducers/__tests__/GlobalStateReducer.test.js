import globalState from '../GlobalState';
import { GlobalActions } from '../../actions/GlobalActions';
describe('GlobalState reducer', function () {
    var RealDate = Date.now;
    var currentDate = Date.now();
    var mockDate = function (date) {
        global.Date.now = jest.fn(function () { return date; });
        return date;
    };
    beforeEach(function () {
        mockDate(currentDate);
    });
    afterEach(function () {
        global.Date.now = RealDate;
    });
    it('should return the initial state', function () {
        expect(globalState(undefined, GlobalActions.unknown())).toEqual({
            loadingCounter: 0,
            isPageVisible: true,
            lastRefreshAt: 0
        });
    });
    it('should turn Loading spinner On', function () {
        expect(globalState({
            loadingCounter: 0,
            isPageVisible: true,
            lastRefreshAt: currentDate
        }, GlobalActions.incrementLoadingCounter())).toEqual({
            loadingCounter: 1,
            isPageVisible: true,
            lastRefreshAt: currentDate
        });
    });
    it('should turn Loading spinner off', function () {
        expect(globalState({
            loadingCounter: 1,
            isPageVisible: true,
            lastRefreshAt: currentDate
        }, GlobalActions.decrementLoadingCounter())).toEqual({
            loadingCounter: 0,
            isPageVisible: true,
            lastRefreshAt: currentDate
        });
    });
    it('should increment counter', function () {
        expect(globalState({
            loadingCounter: 1,
            isPageVisible: true,
            lastRefreshAt: currentDate
        }, GlobalActions.incrementLoadingCounter())).toEqual({
            loadingCounter: 2,
            isPageVisible: true,
            lastRefreshAt: currentDate
        });
    });
    it('should decrement counter', function () {
        expect(globalState({
            loadingCounter: 2,
            isPageVisible: true,
            lastRefreshAt: currentDate
        }, GlobalActions.decrementLoadingCounter())).toEqual({
            loadingCounter: 1,
            isPageVisible: true,
            lastRefreshAt: currentDate
        });
    });
    it('should turn on page visibility status', function () {
        expect(globalState({
            loadingCounter: 0,
            isPageVisible: false,
            lastRefreshAt: currentDate
        }, GlobalActions.setPageVisibilityVisible())).toEqual({
            loadingCounter: 0,
            isPageVisible: true,
            lastRefreshAt: currentDate
        });
    });
    it('should turn off page visibility status', function () {
        expect(globalState({
            loadingCounter: 0,
            isPageVisible: true,
            lastRefreshAt: currentDate
        }, GlobalActions.setPageVisibilityHidden())).toEqual({
            loadingCounter: 0,
            isPageVisible: false,
            lastRefreshAt: currentDate
        });
    });
});
//# sourceMappingURL=GlobalStateReducer.test.js.map