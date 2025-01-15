import {
  BreafRouletteSector,
  RNG,
  RNGReturnType,
  RouletteSector
} from "./_interfaces";
import {
  entropyProviderError,
  eProviderReturnedValueError,
  eProvidersResultsError,
  invalidDataError,
  invalidDatasetError,
  negativeOrInfiniteWidthError,
  widthTypeError
} from "./_errors";

export const validateDataNonEmpty =
  <DataType>(data: DataType[]): void => {
    if (!Array.isArray(data) || data.length === 0) {
      invalidDataError();
    }
  };

export const validateDatasetNonEmpty =
  <DataType>(
    fromEProvider: boolean,
    dataset: RouletteSector<DataType>[]
  ): void => {
    if (!Array.isArray(dataset) || dataset.length === 0) {
      invalidDatasetError(fromEProvider);
    }
  };

export const validateWidth = (
  fromEProvider: boolean,
  item: BreafRouletteSector,
  index: number
): void => {
  const type = typeof item.w;
  if (type !== 'number') {
    widthTypeError(fromEProvider, type, item, index);
  };

  if (item.w < 0 || !isFinite(item.w)) {
    negativeOrInfiniteWidthError(fromEProvider, item, index);
  }
};

export const validateEntropyProvider =
  <DataType, SpinParamsType, EProviderStorageType>(
    entropyProvider?: RNG<DataType, SpinParamsType, EProviderStorageType>
  ): void => {
    if (!['undefined', 'function', 'null'].includes(typeof entropyProvider)) {
      entropyProviderError();
    }
  };

export const validateEProviderReturnedValue =
  (value: number): void => {
    const type = typeof value;
    if (!(type === 'number' && value >= 0 && value < 1)) {
      eProviderReturnedValueError(type, value);
    }
  };

export const validateEProviderResults =
  <DataType>(eProviderResults: RNGReturnType<DataType>): void => {
    const type = typeof eProviderResults;
    if (!(
      type === 'object' &&
      'value' in eProviderResults &&
      typeof eProviderResults.value === 'number' &&
      eProviderResults.value >= 0 &&
      eProviderResults.value < 1
    )) {
      eProvidersResultsError(type, eProviderResults);
    }
  };
