import {
  SyncRNG,
  RouletteSector,
  BreafRouletteSector,
  VerboseRouletteSector,
  RNGReturnType
} from './_interfaces';
import {
  validateWidth,
  validateEntropyProvider,
  validateEProviderReturnedValue,
  validateEProviderResults,
  validateDatasetNonEmpty,
  validateDataNonEmpty
} from './_validators';
import {
  allSectorsZeroWidthError,
  didNotBuildedError,
  eProvidersResultsError,
  sectorArrTypeError,
  sectorObjTypesError
} from './_errors';

const CHUNK_SIZE = 32;

export class Roulette<
  DataType = unknown,
  SpinParamsType = undefined,
  StorageType = unknown> {
  constructor(
    entropyProvider?:
      SyncRNG<DataType, SpinParamsType, StorageType>
  ) {
    validateEntropyProvider(entropyProvider);
    this.entropyProvider = entropyProvider || this.defaultEntropyProvider;

    this.spin = this.spin.bind(this);
    this.setStorage = this.setStorage.bind(this);
    this.simpleBuildFrom = this.simpleBuildFrom.bind(this);
    this.buildFrom = this.buildFrom.bind(this);
  }

  public simpleBuildFrom(data: DataType[]): void {
    validateDataNonEmpty(data);
    this.buildFromInternal(false, data.map((item) => ({ v: item, w: 1})));
  }

  public buildFrom(dataset: RouletteSector<DataType>[]): this {
    return this.buildFromInternal(false, dataset);
  }

  public setStorage(eProviderStorage: StorageType): this {
    this.eProviderStorage = eProviderStorage;
    Object.freeze(this.eProviderStorage);
    return this;
  }

  public spin(spinParams?: SpinParamsType): DataType {
    const resultValue = this.getNextValue(spinParams) * this.sum;

    if (!this.dataset) {
      didNotBuildedError();
    }

    const anchorIndex = this.binarySearchInAnchors(resultValue);
    let currentSum = this.searchAnchors[anchorIndex];
    let datasetIndex = anchorIndex * CHUNK_SIZE;

    do {
      currentSum += this.dataset[datasetIndex++].w;
    } while (currentSum < resultValue);

    return this.dataset[datasetIndex - 1].v;
  }

  private buildFromInternal(
    fromEProvider: boolean,
    dataset: RouletteSector<DataType>[]
  ): this {
    validateDatasetNonEmpty(fromEProvider, dataset);

    this.dataset = [];
    this.searchAnchors = [];
    this.sum = 0;

    for (const [index, item] of Array.from(dataset.entries())) {
      let breafItem: BreafRouletteSector<DataType>;

      if (Array.isArray(item)) {
        if (item.length !== 2) {
          sectorArrTypeError(fromEProvider);
        }
        const [v, w] = item;
        breafItem = {v, w};
      } else if ('value' in item) {
        if (!('width' in item)) {
          sectorObjTypesError(fromEProvider, item, index);
        }
        const {value: v, width: w} = item as VerboseRouletteSector<DataType>;
        breafItem = {v, w};
      } else {
        if (!('v' in item && 'w' in item)) {
          sectorObjTypesError(fromEProvider, item, index);
        }
        breafItem = {...item as BreafRouletteSector<DataType>};
      }

      validateWidth(fromEProvider, breafItem, index);
      Object.freeze(breafItem);
      this.dataset.push(breafItem);

      this.sum += breafItem.w;

      if (index % CHUNK_SIZE === 0) {
        this.searchAnchors.push(this.sum);
      }
    }

    if (this.sum === 0) {
      allSectorsZeroWidthError(fromEProvider);
    }

    Object.freeze(this.dataset);

    return this;
  }

  private getNextValue(spinParams?: SpinParamsType): number {
    const eProviderResult =
      this.entropyProvider(this.dataset, this.eProviderStorage, spinParams);
    const resultType = typeof eProviderResult;

    switch(resultType) {
      case 'number':
        validateEProviderReturnedValue(eProviderResult as number);
        return eProviderResult as number;

      case 'object':
        const eProviderResultObj =
          eProviderResult as RNGReturnType<DataType, StorageType>;
        validateEProviderResults(eProviderResultObj);
        const {value, dataset, storage} = eProviderResultObj;
        if (dataset) {
          this.buildFromInternal(true, dataset);
        }
        if ('storage' in (eProviderResultObj)) {
          this.eProviderStorage = storage;
          Object.freeze(this.eProviderStorage);
        }
        return value;

      default:
        eProvidersResultsError(resultType, eProviderResult as RNGReturnType);
        return 0;
    }
  }

  private binarySearchInAnchors(
    value: number,
    first: number = 0,
    last: number = this.searchAnchors.length - 1,
  ): number {
    if (first === last) {
      return first;
    }

    const center = Math.ceil((first + last) / 2);

    return this.searchAnchors[center] < value
      ? this.binarySearchInAnchors(value, center, last)
      : this.binarySearchInAnchors(value, first, center);
  };

  private defaultEntropyProvider() {
    return {value: Math.random()};
  }

  private entropyProvider: SyncRNG<DataType, SpinParamsType, StorageType>;

  private dataset: BreafRouletteSector<DataType>[];

  private sum: number;

  private searchAnchors: number[];

  private eProviderStorage: StorageType;
}
