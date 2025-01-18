export interface EProviderFnParams {
    min: number;
    max: number;
    storage?: any;
    addParams?: any;
}
export type TypeWithAddParams<T, AddParams> = T & (AddParams extends undefined ? {} : {
    addParams: AddParams;
});
export type RangeWithStorageAndOptAddParams<Storage, AddParams> = EProviderFnParams & (AddParams extends undefined ? {} : {
    addParams: AddParams;
}) & {
    storage: Storage;
};
export type FnSignature<Storage, AddParams> = (params: RangeWithStorageAndOptAddParams<Storage, AddParams>) => number;
export type AP<AddParams> = {
    addParams: AddParams;
};
export interface RNGReturnType<DataType = unknown, StorageType = unknown> {
    value: number;
    dataset?: RouletteSector<DataType>[];
    storage?: StorageType;
}
export type SyncRNG<DataType = unknown, SpinParamsType = undefined, StorageType = unknown> = (dataset?: RouletteSector<DataType>[], storage?: StorageType, spinParams?: SpinParamsType) => number | RNGReturnType<DataType>;
export type AsyncRNG<DataType = unknown, SpinParamsType = undefined, StorageType = unknown> = (dataset?: RouletteSector<DataType>[], storage?: StorageType, spinParams?: SpinParamsType) => Promise<number | RNGReturnType<DataType>>;
export type RNG<DataType = unknown, SpinParamsType = undefined, StorageType = unknown> = SyncRNG<DataType, SpinParamsType, StorageType> | AsyncRNG<DataType, SpinParamsType, StorageType>;
export interface VerboseRouletteSector<T = unknown> {
    value: T;
    width: number;
}
export interface BreafRouletteSector<T = unknown> {
    v: T;
    w: number;
}
export type ArrayRouletteSector<T = unknown> = [T, number];
export type RouletteSector<T = unknown> = VerboseRouletteSector<T> | BreafRouletteSector<T> | ArrayRouletteSector<T>;
//# sourceMappingURL=_interfaces.d.ts.map