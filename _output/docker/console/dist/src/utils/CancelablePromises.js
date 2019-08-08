var CancelablePromise = /** @class */ (function () {
    function CancelablePromise(promise) {
        var _this = this;
        this.hasCanceled = false;
        this.promise = new Promise(function (resolve, reject) {
            promise.then(function (val) { return (_this.hasCanceled ? reject({ isCanceled: true }) : resolve(val)); }, function (error) { return (_this.hasCanceled ? reject({ isCanceled: true }) : reject(error)); });
        });
    }
    CancelablePromise.prototype.cancel = function () {
        this.hasCanceled = true;
        if (this.next) {
            this.next.cancel();
        }
    };
    CancelablePromise.prototype.chain = function (mapper) {
        var _this = this;
        var last = this;
        while (last.next) {
            last = last.next;
        }
        last.next = new CancelablePromise(this.promise.then(function (t) { return (_this.hasCanceled ? t : mapper(t)); }));
        this.promise = last.next.promise;
        return last.next;
    };
    return CancelablePromise;
}());
export { CancelablePromise };
export var makeCancelablePromise = function (promise) {
    return new CancelablePromise(promise);
};
var PromisesRegistry = /** @class */ (function () {
    function PromisesRegistry() {
        this.promises = new Map();
    }
    PromisesRegistry.prototype.register = function (key, promise) {
        var previous = this.promises.get(key);
        if (previous) {
            previous.cancel();
        }
        var cancelable = makeCancelablePromise(promise);
        this.promises.set(key, cancelable);
        return cancelable.promise;
    };
    PromisesRegistry.prototype.registerChained = function (key, initial, mapper) {
        var previous = this.promises.get(key);
        if (previous) {
            previous.chain(mapper);
            return previous.promise;
        }
        else {
            var cancelable = new CancelablePromise(mapper(initial));
            this.promises.set(key, cancelable);
            return cancelable.promise;
        }
    };
    PromisesRegistry.prototype.registerAll = function (key, promises) {
        return this.register(key, Promise.all(promises));
    };
    PromisesRegistry.prototype.cancelAll = function () {
        this.promises.forEach(function (promise) { return promise.cancel(); });
        this.promises.clear();
    };
    PromisesRegistry.prototype.cancel = function (key) {
        var previous = this.promises.get(key);
        if (previous) {
            previous.cancel();
            this.promises.delete(key);
        }
    };
    return PromisesRegistry;
}());
export { PromisesRegistry };
//# sourceMappingURL=CancelablePromises.js.map