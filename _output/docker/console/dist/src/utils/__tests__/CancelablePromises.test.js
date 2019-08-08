import { PromisesRegistry } from '../CancelablePromises';
describe('Cancelable promises', function () {
    it('should resolve as standard promise', function () {
        var promises = new PromisesRegistry();
        var initialPromise = new Promise(function (resolve) { return setTimeout(function () { return resolve(true); }, 1); });
        return promises.register('test', initialPromise).then(function (result) { return expect(result).toBe(true); });
    });
    it('should be canceled before resolving', function (done) {
        var promises = new PromisesRegistry();
        var initialPromise = new Promise(function (resolve) { return setTimeout(function () { return resolve(true); }, 1); });
        promises
            .register('test', initialPromise)
            .then(function () {
            throw new Error('Not expected to come here');
        })
            .catch(function (err) {
            expect(err.isCanceled).toBe(true);
            done();
        });
        promises.cancelAll();
    });
    it('should cancel the previous one', function () {
        var promises = new PromisesRegistry();
        var firstPromise = new Promise(function (resolve) { return setTimeout(function () { return resolve(1); }, 1); });
        var secondPromise = new Promise(function (resolve) { return setTimeout(function () { return resolve(2); }, 1); });
        promises
            .register('test', firstPromise)
            .then(function () {
            throw new Error('Not expected to come here');
        })
            .catch(function (err) {
            expect(err.isCanceled).toBe(true);
        });
        return promises.register('test', secondPromise).then(function (result) { return expect(result).toBe(2); });
    });
    it('should not cancel the previous one with different keys', function () {
        var promises = new PromisesRegistry();
        var firstPromise = new Promise(function (resolve) { return setTimeout(function () { return resolve(1); }, 1); });
        var secondPromise = new Promise(function (resolve) { return setTimeout(function () { return resolve(2); }, 1); });
        var r1 = promises.register('first', firstPromise);
        var r2 = promises.register('second', secondPromise);
        return Promise.all([r1, r2]).then(function (result) { return expect(result).toEqual([1, 2]); });
    });
    it('should resolve promises with registerAll', function () {
        var promises = new PromisesRegistry();
        var p1 = new Promise(function (resolve) { return setTimeout(function () { return resolve(true); }, 1); });
        var p2 = new Promise(function (resolve) { return setTimeout(function () { return resolve(false); }, 1); });
        return promises.registerAll('test', [p1, p2]).then(function (result) { return expect(result).toEqual([true, false]); });
    });
    it('should be canceled before resolving with registerAll', function (done) {
        var promises = new PromisesRegistry();
        var p1 = new Promise(function (resolve) { return setTimeout(function () { return resolve(true); }, 1); });
        var p2 = new Promise(function (resolve) { return setTimeout(function () { return resolve(false); }, 1); });
        promises
            .registerAll('test', [p1, p2])
            .then(function () {
            throw new Error('Not expected to come here');
        })
            .catch(function (err) {
            expect(err.isCanceled).toBe(true);
            done();
        });
        promises.cancelAll();
    });
    it('should resolve chained promises alone', function () {
        var promises = new PromisesRegistry();
        var promiseGen = function (x) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(x + 1); }, 1); }); };
        return promises.registerChained('test', 0, promiseGen).then(function (result) { return expect(result).toBe(1); });
    });
    it('should resolve several chained promises', function () {
        var promises = new PromisesRegistry();
        var promiseGen = function (x) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(x + 1); }, 1); }); };
        promises.registerChained('test', 0, promiseGen);
        promises.registerChained('test', 0, promiseGen);
        promises.registerChained('test', 0, promiseGen);
        return promises.registerChained('test', 0, promiseGen).then(function (result) { return expect(result).toBe(4); });
    });
    it('should cancel several chained promises', function (done) {
        var promises = new PromisesRegistry();
        var promiseGen = function (x) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(x + 1); }, 1); }); };
        promises
            .registerChained('test', 0, promiseGen)
            .then(function () {
            throw new Error('Not expected to come here');
        })
            .catch(function (err) {
            expect(err.isCanceled).toBe(true);
        });
        promises
            .registerChained('test', 0, promiseGen)
            .then(function () {
            throw new Error('Not expected to come here');
        })
            .catch(function (err) {
            expect(err.isCanceled).toBe(true);
            done();
        });
        promises.cancelAll();
    });
    it('should cancel after first chained promises', function (done) {
        var promises = new PromisesRegistry();
        var promiseGen = function (time) { return function (x) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(x + 1); }, time); }); }; };
        promises.registerChained('a', 0, promiseGen(5)).then(function () { return promises.cancelAll(); });
        promises
            .registerChained('a', 0, promiseGen(10))
            .then(function () {
            throw new Error('Not expected to come here');
        })
            .catch(function (err) {
            expect(err.isCanceled).toBe(true);
            done();
        });
    });
});
//# sourceMappingURL=CancelablePromises.test.js.map