import { FnSignature, } from './_interfaces';

export class Dice<AddParams = undefined, Storage = any> {
  private entropyProvider: EntropyProvider<FnSignature<Storage, AddParams>>;

  protected constructor(
    entropyProvider: EntropyProvider<FnSignature<Storage, AddParams>>
  ) {
    this.entropyProvider = entropyProvider;

    [ ...Object.keys(Object.getPrototypeOf(this)),
      ...Object.keys(this.constructor)
    ].forEach((key) => {
      const descriptor =
        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), key) ||
        Object.getOwnPropertyDescriptor(this.constructor, key);

      if (
        descriptor &&
        typeof descriptor.value === 'function' &&
        !['with', 'constructor'].includes(key)
      ) {
        (this as any)[key] = (descriptor.value as Function).bind(this);
      }
    });
  }

  static with<AddParams = undefined, Storage = any>(
    fn: FnSignature<Storage, AddParams>,
    storage: Storage
  ): Dice<AddParams, Storage> {
    const entropyProvider = new EntropyProvider(fn, storage);
    return new Dice(entropyProvider);
  }

  // someMethod(
  //   params: TypeWithAddParams<{ a: number; b: number }, AddParams>
  // ): number {
  //   const executeParams = {
  //     min: params.a,
  //     max: params.b,
  //     ...(params as any).addParams ? { addParams: (params as any).addParams } : {},
  //   };

  //   return this.entropyProvider.execute(executeParams);
  // }
}
