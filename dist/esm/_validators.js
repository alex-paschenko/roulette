import { entropyProviderError, eProviderReturnedValueError, eProvidersResultsError, invalidDataError, invalidDatasetError, negativeOrInfiniteWidthError, widthTypeError } from "./_errors";
export const validateDataNonEmpty = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        invalidDataError();
    }
};
export const validateDatasetNonEmpty = (fromEProvider, dataset) => {
    if (!Array.isArray(dataset) || dataset.length === 0) {
        invalidDatasetError(fromEProvider);
    }
};
export const validateWidth = (fromEProvider, item, index) => {
    const type = typeof item.w;
    if (type !== 'number') {
        widthTypeError(fromEProvider, type, item, index);
    }
    ;
    if (item.w < 0 || !isFinite(item.w)) {
        negativeOrInfiniteWidthError(fromEProvider, item, index);
    }
};
export const validateEntropyProvider = (entropyProvider) => {
    if (!['undefined', 'function', 'null'].includes(typeof entropyProvider)) {
        entropyProviderError();
    }
};
export const validateEProviderReturnedValue = (value) => {
    const type = typeof value;
    if (!(type === 'number' && value >= 0 && value < 1)) {
        eProviderReturnedValueError(type, value);
    }
};
export const validateEProviderResults = (eProviderResults) => {
    const type = typeof eProviderResults;
    if (!(type === 'object' &&
        'value' in eProviderResults &&
        typeof eProviderResults.value === 'number' &&
        eProviderResults.value >= 0 &&
        eProviderResults.value < 1)) {
        eProvidersResultsError(type, eProviderResults);
    }
};
//# sourceMappingURL=_validators.js.map