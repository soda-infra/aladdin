import { getType } from 'typesafe-actions';
import { LoginActions } from '../LoginActions';
import { LoginStatus } from '../../store/Store';
var session = {
    expiresOn: '018-05-29 21:51:40.186179601 +0200 CEST m=+36039.431579761',
    username: 'admin'
};
describe('LoginActions', function () {
    it('Login action success', function () {
        var result = LoginActions.loginSuccess(session);
        expect(result.type).toEqual(getType(LoginActions.loginSuccess));
        expect(result.payload.session).toEqual(session);
        expect(result.payload.status).toEqual(LoginStatus.loggedIn);
    });
    it('Login action failure', function () {
        var error = 'Error with username or password';
        var expectedAction = { error: error, status: LoginStatus.error, session: undefined };
        expect(LoginActions.loginFailure(error).payload).toEqual(expectedAction);
    });
    it('Login action logout', function () {
        var expectedAction = {
            status: LoginStatus.loggedOut,
            session: undefined
        };
        expect(LoginActions.logoutSuccess().payload).toEqual(expectedAction);
    });
});
//# sourceMappingURL=LoginAction.test.js.map