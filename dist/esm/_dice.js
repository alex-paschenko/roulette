export class Dice {
    constructor(entropyProvider) {
        this.entropyProvider = entropyProvider;
        [...Object.keys(Object.getPrototypeOf(this)),
            ...Object.keys(this.constructor)
        ].forEach((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), key) ||
                Object.getOwnPropertyDescriptor(this.constructor, key);
            if (descriptor &&
                typeof descriptor.value === 'function' &&
                !['with', 'constructor'].includes(key)) {
                this[key] = descriptor.value.bind(this);
            }
        });
    }
    static with(fn, storage) {
        const entropyProvider = new EntropyProvider(fn, storage);
        return new Dice(entropyProvider);
    }
}
//# sourceMappingURL=_dice.js.map