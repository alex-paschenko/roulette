;
function Builder(entropyProvider, fnRandom) {
    class Distribution {
        constructor() {
            throw new Error('You cannot create an instance of this class.');
        }
        ;
        static random(params) {
            const { eProviderParams, ...fnRandomParams } = params;
            const storageHolder = this;
            const context = {
                get storage() { return storageHolder.storage; },
                set storage(value) { storageHolder.storage = value; },
                eProviderParams: params.eProviderParams,
            };
            return this.fnRandom(fnRandomParams, this.eProvider.bind(this, context));
        }
        static getStorage() {
            return this.storage;
        }
        static setStorage(storage) {
            this.storage = storage;
            return this;
        }
        static with(newFn) {
            return Builder(newFn, this.fnRandom);
        }
    }
    Distribution.eProvider = entropyProvider;
    Distribution.fnRandom = fnRandom;
    return Distribution;
}
export default Builder;
//# sourceMappingURL=builder.js.map