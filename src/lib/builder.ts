type EProviderType<Storage = any, EProviderParams = any> = (
  context: { storage?: Storage , eProviderParams?: EProviderParams },
  range: { min: number; max: number },
) => number;

type FnRandomType<FnRandomParamsType = any> = (
  params: FnRandomParamsType,
  entropyProvider: (range: { min: number; max: number }) => number,
) => number;

type ExtractEPContext<T> = T extends EProviderType<infer Storage, infer EProviderParams>
  ? { storage: Storage } & ('eProviderParams' extends keyof Parameters<T>[0]
      ? {} extends Pick<Parameters<T>[0], 'eProviderParams'>
        ? { eProviderParams?: EProviderParams }
        : { eProviderParams: EProviderParams }
      : {})
  : never;

type ExtractStorageType<EntropyProvider extends EProviderType> =
  unknown extends Parameters<EntropyProvider>[0]['storage']
    ? never
    : Parameters<EntropyProvider>[0]['storage'];

function Builder<
  EntropyProvider extends EProviderType<any, any>,
  FnRandom extends FnRandomType<any>,
> (entropyProvider: EntropyProvider, fnRandom: FnRandom) {
  abstract class Distribution {
    protected constructor() {
      throw new Error('You cannot create an instance of this class.');
    };

    protected static eProvider = entropyProvider;

    protected static fnRandom = fnRandom;

    public static random(
      params: Parameters<FnRandom>[0] &
        Omit<ExtractEPContext<typeof this.eProvider>, 'storage'>,
    ) {
      const { eProviderParams, ...fnRandomParams } = params;
      const storageHolder = this;
      const context = {
        get storage() { return storageHolder.storage; },
        set storage(value) { storageHolder.storage = value; },
        eProviderParams: params.eProviderParams,
      };

      return this.fnRandom(
        fnRandomParams,
        this.eProvider.bind(this, context),
      );
    }

    protected static storage: Parameters<EntropyProvider>[0]['storage'];

    public static getStorage() {
      return this.storage as ExtractStorageType<EntropyProvider>;
    }

    public static setStorage(
      storage: ExtractStorageType<EntropyProvider>,
    ) {
      this.storage = storage;
      return this;
    }

    public static with(newFn: EProviderType<any>) {
      return Builder<typeof newEp, typeof this.fnRandom>(newFn, this.fnRandom);
    }

    protected static withInternal<NewFn extends EProviderType<any>>(newFn: NewFn) {
      return Builder(newFn, this.fnRandom);
    }
  }

  return Distribution;
}

export default Builder;