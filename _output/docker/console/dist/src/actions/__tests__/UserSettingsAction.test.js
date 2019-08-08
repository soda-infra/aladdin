import { UserSettingsActions } from '../UserSettingsActions';
import { getType } from 'typesafe-actions';
describe('UserSettingsActions', function () {
    it('should set the duration', function () {
        var setDurationAction = UserSettingsActions.setDuration(60);
        expect(setDurationAction.type).toEqual(getType(UserSettingsActions.setDuration));
        expect(setDurationAction.payload).toEqual(60);
    });
    it('should set the refresh interval', function () {
        var setRefreshAction = UserSettingsActions.setRefreshInterval(60);
        expect(setRefreshAction.type).toEqual(getType(UserSettingsActions.setRefreshInterval));
        expect(setRefreshAction.payload).toEqual(60);
    });
    it('should set Nav Collapsed', function () {
        expect(UserSettingsActions.navCollapse(true).payload).toEqual({
            collapse: true
        });
    });
});
//# sourceMappingURL=UserSettingsAction.test.js.map