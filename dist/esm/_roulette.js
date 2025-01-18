import { validateWidth, validateEntropyProvider, validateEProviderReturnedValue, validateEProviderResults, validateDatasetNonEmpty, validateDataNonEmpty } from './_validators';
import { allSectorsZeroWidthError, didNotBuildedError, eProvidersResultsError, sectorArrTypeError, sectorObjTypesError } from './_errors';
const CHUNK_SIZE = 32;
export class Roulette {
    constructor(entropyProvider) {
        validateEntropyProvider(entropyProvider);
        this.entropyProvider = entropyProvider || this.defaultEntropyProvider;
        this.spin = this.spin.bind(this);
        this.setStorage = this.setStorage.bind(this);
        this.simpleBuildFrom = this.simpleBuildFrom.bind(this);
        this.buildFrom = this.buildFrom.bind(this);
    }
    simpleBuildFrom(data) {
        validateDataNonEmpty(data);
        this.buildFromInternal(false, data.map((item) => ({ v: item, w: 1 })));
    }
    buildFrom(dataset) {
        return this.buildFromInternal(false, dataset);
    }
    setStorage(eProviderStorage) {
        this.eProviderStorage = eProviderStorage;
        Object.freeze(this.eProviderStorage);
        return this;
    }
    spin(spinParams) {
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
    buildFromInternal(fromEProvider, dataset) {
        validateDatasetNonEmpty(fromEProvider, dataset);
        this.dataset = [];
        this.searchAnchors = [];
        this.sum = 0;
        for (const [index, item] of Array.from(dataset.entries())) {
            let breafItem;
            if (Array.isArray(item)) {
                if (item.length !== 2) {
                    sectorArrTypeError(fromEProvider);
                }
                const [v, w] = item;
                breafItem = { v, w };
            }
            else if ('value' in item) {
                if (!('width' in item)) {
                    sectorObjTypesError(fromEProvider, item, index);
                }
                const { value: v, width: w } = item;
                breafItem = { v, w };
            }
            else {
                if (!('v' in item && 'w' in item)) {
                    sectorObjTypesError(fromEProvider, item, index);
                }
                breafItem = { ...item };
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
    getNextValue(spinParams) {
        const eProviderResult = this.entropyProvider(this.dataset, this.eProviderStorage, spinParams);
        const resultType = typeof eProviderResult;
        switch (resultType) {
            case 'number':
                validateEProviderReturnedValue(eProviderResult);
                return eProviderResult;
            case 'object':
                const eProviderResultObj = eProviderResult;
                validateEProviderResults(eProviderResultObj);
                const { value, dataset, storage } = eProviderResultObj;
                if (dataset) {
                    this.buildFromInternal(true, dataset);
                }
                if ('storage' in (eProviderResultObj)) {
                    this.eProviderStorage = storage;
                    Object.freeze(this.eProviderStorage);
                }
                return value;
            default:
                eProvidersResultsError(resultType, eProviderResult);
                return 0;
        }
    }
    binarySearchInAnchors(value, first = 0, last = this.searchAnchors.length - 1) {
        if (first === last) {
            return first;
        }
        const center = Math.ceil((first + last) / 2);
        return this.searchAnchors[center] < value
            ? this.binarySearchInAnchors(value, center, last)
            : this.binarySearchInAnchors(value, first, center);
    }
    ;
    defaultEntropyProvider() {
        return { value: Math.random() };
    }
}
//# sourceMappingURL=_roulette.js.map