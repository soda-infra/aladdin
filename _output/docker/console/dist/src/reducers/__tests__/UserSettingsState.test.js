import UserSettingsState from '../UserSettingsState';
import { UserSettingsActions } from '../../actions/UserSettingsActions';
import { GlobalActions } from '../../actions/GlobalActions';
describe('UserSettingsState reducer', function () {
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
        expect(UserSettingsState(undefined, GlobalActions.unknown())).toEqual({
            interface: { navCollapse: false },
            duration: 60,
            refreshInterval: 15000
        });
    });
    it('should collapse the nav', function () {
        expect(UserSettingsState({
            interface: { navCollapse: false },
            duration: 60,
            refreshInterval: 60
        }, UserSettingsActions.navCollapse(true))).toEqual({
            interface: { navCollapse: true },
            duration: 60,
            refreshInterval: 60
        });
    });
    it('should set duration', function () {
        expect(UserSettingsState({
            interface: { navCollapse: false },
            duration: 60,
            refreshInterval: 60
        }, UserSettingsActions.setDuration(120))).toEqual({
            interface: { navCollapse: false },
            duration: 120,
            refreshInterval: 60
        });
    });
    it('should set refresh interval', function () {
        expect(UserSettingsState({
            interface: { navCollapse: false },
            duration: 60,
            refreshInterval: 60
        }, UserSettingsActions.setRefreshInterval(120))).toEqual({
            interface: { navCollapse: false },
            duration: 60,
            refreshInterval: 120
        });
    });
});
//# sourceMappingURL=UserSettingsState.test.js.map