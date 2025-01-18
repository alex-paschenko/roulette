import { FnSignature } from './_interfaces';
export declare class Dice<AddParams = undefined, Storage = any> {
    private entropyProvider;
    protected constructor(entropyProvider: EntropyProvider<FnSignature<Storage, AddParams>>);
    static with<AddParams = undefined, Storage = any>(fn: FnSignature<Storage, AddParams>, storage: Storage): Dice<AddParams, Storage>;
}
//# sourceMappingURL=_dice.d.ts.map