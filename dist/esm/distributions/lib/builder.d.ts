export type UniformRandom = (range: {
    min: number;
    max: number;
}) => number;
type EProviderType<Storage = any, EProviderParams = any> = (context: {
    storage?: Storage;
    eProviderParams?: EProviderParams;
}, range: {
    min: number;
    max: number;
}) => number;
type FnRandomType<FnRandomParamsType = any> = (params: FnRandomParamsType, entropyProvider: (range: {
    min: number;
    max: number;
}) => number) => number;
type ExtractEPContext<T> = T extends EProviderType<infer Storage, infer EProviderParams> ? {
    storage: Storage;
} & ('eProviderParams' extends keyof Parameters<T>[0] ? {} extends Pick<Parameters<T>[0], 'eProviderParams'> ? {
    eProviderParams?: EProviderParams;
} : {
    eProviderParams: EProviderParams;
} : {}) : never;
type ExtractStorageType<EntropyProvider extends EProviderType> = unknown extends Parameters<EntropyProvider>[0]['storage'] ? unknown : Parameters<EntropyProvider>[0]['storage'];
export interface BuilderI<EntropyProvider extends EProviderType<any, any>, FnRandom extends FnRandomType<any>> {
    new (): BuilderI<EntropyProvider, FnRandom>;
    random: (params: Parameters<FnRandom>[0] & Omit<ExtractEPContext<EntropyProvider>, 'storage'>) => number;
    getStorage: () => ExtractStorageType<EntropyProvider>;
    setStorage: (storage: ExtractStorageType<EntropyProvider>) => void;
    with: (newFn: EProviderType<any, any>) => BuilderI<EntropyProvider, FnRandom>;
}
declare function Builder<EntropyProvider extends EProviderType<any, any>, FnRandom extends FnRandomType<any>>(entropyProvider: EntropyProvider, fnRandom: FnRandom): BuilderI<EntropyProvider, FnRandom>;
export default Builder;
//# sourceMappingURL=builder.d.ts.map