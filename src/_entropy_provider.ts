import { EProviderFnParams } from "./_interfaces";

const defaultEProviderFn = (params: {min: number, max: number}): number => {
  return Math.random() * (params.max - params.min) + params.min;
};

export class EntropyProvider<Fn extends (params: EProviderFnParams) => number> {
  private fn!: Fn;
  private storage?: Parameters<Fn>[0]["storage"];

  constructor(newFn: Fn, storage: Parameters<Fn>[0]["storage"]) {
    this.fn = newFn;
    this.storage = storage;
  }

  execute(params: EProviderFnParams): number {
    return this.fn({ ...params, storage: this.storage });
  }
};

export const defaultEProvider = new EntropyProvider(defaultEProviderFn, undefined);
