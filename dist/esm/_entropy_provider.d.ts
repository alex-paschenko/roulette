import { EProviderFnParams } from "./_interfaces";
export declare class EntropyProvider<Fn extends (params: EProviderFnParams) => number> {
    private fn;
    private storage?;
    constructor(newFn: Fn, storage: Parameters<Fn>[0]["storage"]);
    execute(params: EProviderFnParams): number;
}
export declare const defaultEProvider: EntropyProvider<(params: {
    min: number;
    max: number;
}) => number>;
//# sourceMappingURL=_entropy_provider.d.ts.map