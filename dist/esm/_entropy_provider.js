const defaultEProviderFn = (params) => {
    return Math.random() * (params.max - params.min) + params.min;
};
export class EntropyProvider {
    constructor(newFn, storage) {
        this.fn = newFn;
        this.storage = storage;
    }
    execute(params) {
        return this.fn({ ...params, storage: this.storage });
    }
}
;
export const defaultEProvider = new EntropyProvider(defaultEProviderFn, undefined);
//# sourceMappingURL=_entropy_provider.js.map