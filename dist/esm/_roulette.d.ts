import { SyncRNG, RouletteSector } from './_interfaces';
export declare class Roulette<DataType = unknown, SpinParamsType = undefined, StorageType = unknown> {
    constructor(entropyProvider?: SyncRNG<DataType, SpinParamsType, StorageType>);
    simpleBuildFrom(data: DataType[]): void;
    buildFrom(dataset: RouletteSector<DataType>[]): this;
    setStorage(eProviderStorage: StorageType): this;
    spin(spinParams?: SpinParamsType): DataType;
    private buildFromInternal;
    private getNextValue;
    private binarySearchInAnchors;
    private defaultEntropyProvider;
    private entropyProvider;
    private dataset;
    private sum;
    private searchAnchors;
    private eProviderStorage;
}
//# sourceMappingURL=_roulette.d.ts.map