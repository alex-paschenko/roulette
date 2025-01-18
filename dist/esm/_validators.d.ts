import { BreafRouletteSector, RNG, RNGReturnType, RouletteSector } from "./_interfaces";
export declare const validateDataNonEmpty: <DataType>(data: DataType[]) => void;
export declare const validateDatasetNonEmpty: <DataType>(fromEProvider: boolean, dataset: RouletteSector<DataType>[]) => void;
export declare const validateWidth: (fromEProvider: boolean, item: BreafRouletteSector, index: number) => void;
export declare const validateEntropyProvider: <DataType, SpinParamsType, EProviderStorageType>(entropyProvider?: RNG<DataType, SpinParamsType, EProviderStorageType>) => void;
export declare const validateEProviderReturnedValue: (value: number) => void;
export declare const validateEProviderResults: <DataType>(eProviderResults: RNGReturnType<DataType>) => void;
//# sourceMappingURL=_validators.d.ts.map