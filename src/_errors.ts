import { RNGReturnType, RouletteSector } from "./_interfaces";

const describeItem = (item?: RouletteSector, index?: number): string =>
  item
    ? ` - dataset[${index}]: ${JSON.stringify(item)})`
    : '';

const errorSource = (
  fromEProvider: boolean,
  item?: RouletteSector,
  index?: number
): string =>
  fromEProvider
    ? `(error in input dataset${describeItem(item, index)})`
    : `(error in dataset returned by entropy provider${describeItem(item, index)})`;

export const invalidDataError = (): void => {
  throw new Error('Data must be a non-empty array.');
};

export const invalidDatasetError = (fromEProvider: boolean): void => {
  throw new Error(
    `Dataset must be a non-empty array ${errorSource(fromEProvider)}.`
  );
};

export const allSectorsZeroWidthError = (fromEProvider: boolean): void => {
  throw new Error(
    'Calculating probabilities is impossible because all relative probability' +
    ' values (in other words, the "width of the roulette sectors") ​​are zero.' +
    ' At least one element in the data set must have a relative probability' +
    ` value greater than zero ${errorSource(fromEProvider)}.`
  );
};

export const sectorArrTypeError = (fromEProvider: boolean): void => {
  throw new Error(
    'If the elements of a data set are specified as an array, that' +
    ' array must contain exactly two elements: a value and the' +
    ' relative probability of that value occurring' +
    ' (that is, the "width of the roulette sector").' +
    ` ${errorSource(fromEProvider)}.`
  );
};

export const sectorObjTypesError = (
  fromEProvider: boolean,
  item: RouletteSector,
  index: number
): void => {
  throw new Error(
    'If the elements of a data set are specified as an object, that object must' +
    ' have the form {value: any, width: number} or {v: any, w: number}' +
    ` ${errorSource(fromEProvider, item, index)}.`
  );
};

export const widthTypeError = (
  fromEProvider: boolean,
  type: string,
  item: RouletteSector,
  index: number
): void => {
  throw new Error(
    'The relative probability (in other words, the width of the roulette' +
    ` sector) must be a non-negative number, not a ${type} ' +
    ' ${errorSource(fromEProvider, item, index)}.`
  );
};

export const negativeOrInfiniteWidthError = (
  fromEProvider: boolean,
  item: RouletteSector,
  index: number
): void => {
  throw new Error(
    'The relative probability (in other words, the width of the roulette sector)' +
    ` must be a non-negative number ${errorSource(fromEProvider, item, index)}.`
  );
};

export const entropyProviderError = (): void => {
  throw new Error(
    'When a constructor parameter is present, it must be a synchronous' +
    ' or asynchronous function that returns an object with mandatory "value"' +
    ' key and value of the key should be anumber in the range 0 (inclusive)' +
    ' to 1 (exclusive).'
  );
};

export const eProviderReturnedValueError = (type: string, value: number): void => {
  throw new Error(
    'Entropy provider must returns a number in the range 0 (inclusize) to 1' +
    ` (exclusive) as value, but it returned ${type} "${JSON.stringify(value)}".`
  )
};

export const eProvidersResultsError = (type: string, value: RNGReturnType): void => {
  throw new Error(
    'The entropy provider must return either a number  in the range 0 (inclusive)' +
    ' ... 1 (exclusive) or an object with a mandatory field "value" that contains' +
    ' a number in the range 0 (inclusive) ... 1 (exclusive) and two optional ' +
    ' fields ("dataset" and "storage"), but it returned' +
    ` ${type} "${JSON.stringify(value)}"`
  )
};

export const didNotBuildedError = () => {
  throw new Error(
    'The dataset is not set: none of the builders (simpleBuildFrom or buildFrom)' +
    ' have been called even once, and the entropy provider didn\'t build' +
    ' the dataset either.'
  );
};
