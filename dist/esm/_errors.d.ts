import { RNGReturnType, RouletteSector } from "./_interfaces";
export declare const invalidDataError: () => void;
export declare const invalidDatasetError: (fromEProvider: boolean) => void;
export declare const allSectorsZeroWidthError: (fromEProvider: boolean) => void;
export declare const sectorArrTypeError: (fromEProvider: boolean) => void;
export declare const sectorObjTypesError: (fromEProvider: boolean, item: RouletteSector, index: number) => void;
export declare const widthTypeError: (fromEProvider: boolean, type: string, item: RouletteSector, index: number) => void;
export declare const negativeOrInfiniteWidthError: (fromEProvider: boolean, item: RouletteSector, index: number) => void;
export declare const entropyProviderError: () => void;
export declare const eProviderReturnedValueError: (type: string, value: number) => void;
export declare const eProvidersResultsError: (type: string, value: RNGReturnType) => void;
export declare const didNotBuildedError: () => never;
//# sourceMappingURL=_errors.d.ts.map