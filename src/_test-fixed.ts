import {} from 'console'

interface EProviderFnParams {
  min: number;
  max: number;
  storage: any;
  addParams: any;
}
type TypeWithAddParams<T, AddParams> = T &
  (AddParams extends undefined ? {} : { addParams: AddParams });

type RangeWithStorageAndOptAddParams<Storage, AddParams> =
  EProviderFnParams &
  (AddParams extends undefined ? {} : { addParams: AddParams }) &
  { storage: Storage };

type FnSignature<Storage, AddParams> =
  (params: RangeWithStorageAndOptAddParams<Storage, AddParams>) => number;

type AP<AddParams> = { addParams: AddParams };

class EntropyProvider<Fn extends (params: EProviderFnParams) => number> {
  private fn!: Fn;
  private storage?: Parameters<Fn>[0]["storage"];

  constructor(newFn: Fn, storage: Parameters<Fn>[0]["storage"]) {
    this.fn = newFn;
    this.storage = storage;
  }

  execute(params: EProviderFnParams): number {
    if (!this.fn) {
      throw new Error("Function not set. Use constructor to set a function.");
    }
    return this.fn({ ...params, storage: this.storage });
  }
}

// Утилита для конструктора
type Constructor<T = any> = new (...args: any[]) => T;

class Dice1<AddParams = undefined, Storage = any> {
  protected entropyProvider: EntropyProvider<FnSignature<Storage, AddParams>>;

  constructor(
    entropyProvider: EntropyProvider<FnSignature<Storage, AddParams>>
  ) {
    this.entropyProvider = entropyProvider;
  }

  static with<
    T extends Constructor<Dice1<AddParams, Storage>>,
    Fn extends FnSignature<any, any>,
    Storage = Parameters<Fn>[0]["storage"],
    AddParams = Parameters<Fn>[0]["addParams"]
  >(
    this: T,
    fn: Fn,
    storage: Parameters<Fn>[0]["storage"]
  ) {
    const entropyProvider = new EntropyProvider(fn, storage);
    const instance = new (this)(entropyProvider) as InstanceType<T>;
//    let itype: InstanceType<T> = instance;
    return instance;
  }
  // static with2<
  //   T extends new (entropyProvider: EntropyProvider<FnSignature<Storage, AddParams>>) => Dice1<AddParams, Storage>,
  //   Fn extends FnSignature<any, any>,
  //   Storage = Parameters<Fn>[0]["storage"],
  //   AddParams = Parameters<Fn>[0]["addParams"]
  // >(
  //   //this: T, // `this` как конструктор класса
  //   fn: Fn,
  //   storage: Parameters<Fn>[0]["storage"]
  // ): InstanceType<T> {
  //   const entropyProvider = new EntropyProvider(fn, storage);
  //   const tp: typeof this =
  //   const instance = (new Dice1<AddParams, Storage>(entropyProvider));
  //   return instance as InstanceType<T>;
  // }

  someMethod(
    params: TypeWithAddParams<{ a: number; b: number }, AddParams>
  ): number {
    const executeParams = {
      min: params.a,
      max: params.b,
      ...(params as any).addParams ? { addParams: (params as any).addParams } : {},
    };

    // @ts-ignore
    return this.entropyProvider.execute(executeParams);
  }
}

class DerivedDice<AddParams, Storage> extends Dice1<AddParams, Storage> {
  someMethod () {
    console.log('1');
    return 1;
  }

  der() {
    console.log('222')
  }
}


const baseD = Dice1.with((p: { min: number, max: number, storage: { value: number }, addParams: { k: number } }) => 1, undefined)
const derD = DerivedDice.with((p: { min: number, max: number, storage: { value: number }, addParams: { k: number } }) => 1, undefined)
//const ctctc = derD.der();

type FnType<A = any, S = any> = (params: { a: A; s: S; anotherParam: any }) => number;

class BaseClass<Fn extends FnType<any, any>> {
  protected fn: FnType<any, any>;
  protected s: Parameters<Fn>[0]['s'];

  constructor(fn: FnType<Parameters<Fn>[0]['a'], Parameters<Fn>[0]['s']>, s: Parameters<Fn>[0]['s']) {
    this.fn = fn;
    this.s = s;
  }

  static create<
    Fn extends FnType<any, any>,
    This extends new (fn: Fn, s: Parameters<Fn>[0]['s']) => BaseClass<Fn> = typeof BaseClass
  >(
    this: This,
    fn: Fn,
    s: Parameters<Fn>[0]['s']
  ) {
    const instance =
      new this(fn, s) as (InstanceType<This> & { classParams: {
        storage: Parameters<Fn>[0]['s'],
        addParams: Parameters<Fn>[0]['a']
      }});
    return instance;
  }
}

interface ClassParams {
  storage: any;
  addParams: any;
};

class DerivedClass<Fn extends FnType<any, any>> extends BaseClass<Fn> {
  someMethod() {
    const ppp: ExtractClassParams<Fn> = undefined
    return ppp;
    console.log("I'm here!");
  }
}


// Пример использования:
const baseInstance = BaseClass.create(
  (params: { a: number; s: { v: string }; anotherParam: any }) => 1,
  { v: "Hello!" }
); // Тип: BaseClass<number, { v: string }>

const childInstance = DerivedClass.create(
  (params: { a: number; s: { v: string }; anotherParam: any }) => 1,
  { v: "Hello!" }
); // Тип: DerivedClass<number, { v: string }>

const result = childInstance.someMethod({}); // Вывод: "I'm here!"

// Утилита для извлечения classParams из типа
// Используем проверку на наличие ключа classParams

type ExtractClassParams<T> = T extends { classParams: infer Params }
  ? Params
  : never;

// Пример использования

type DerivedClassExample = DerivedClass<FnType<any, any>> & {
  classParams: {
    storage: {
      v: string;
    };
    addParams: number;
  };
};

type ExtractedParams = ExtractClassParams<DerivedClassExample>;

// Проверка
const exampleParams: ExtractedParams = {
  storage: {
    v: "Hello!",
  },
  addParams: 42,
};

console.log(exampleParams);




// childInstance.someMethod(); // Вывод: "I'm here!"
// childInstance.som();
class SomeClass<U = string> {
  static staticMethod<T extends SomeClass<U>, U = any>(this: new (...args: any[]) => T) {
    type typeOfClass = T;
    return {} as T;
    console.log("Type of class:", {} as typeOfClass);
  }
}

class SubClass<T> extends SomeClass<T> {}

// Пример использования
const su = SubClass.staticMethod();

// type FirstType = { min: number, max: number, storage: { value: number }, addParams: { k: number } };
// type SecondType = { min: number, max: number, storage: { message: string } };

// const firstFn = (params: FirstType) => {
//   console.log("First function received:", params);
//   return 1.5;
// };

// const secondFn = (params: SecondType) => {
//   console.log("Second function received:", params);
//   return 22;
// };

// const wrapper = new EntropyProvider(firstFn, { value: 2 });

// // Установка первой функции и параметров
// const updatedWrapper = new EntropyProvider(firstFn, { value: 2 });
// updatedWrapper.execute({min: 0, max: 1, addParams: { k: 6 } }); // Вывод: First function received: { value: 42 }

// // Замена функции и параметров
// const finalWrapper = new EntropyProvider(secondFn, { message: "Hello, world!" });
// finalWrapper.execute({min: 2, max: 3});

// // Пример использования
// const dice = Dice.with((params: { min, max, storage: { z: number }, addParams: { k: string } }) => 1, { z: 2 });
// console.log(d.someMethod({ a: 0, b: 1, addParams: { k: "value" } }));

// const ad = AdvancedDice.with((params: { min, max, addParams: { k: string }, storage: {} }) => 1, {});

// const d = Dice.with((params: {min, max,  addParams: {k: string } }) => 1, {zя: 2});
// d.someMethod({a: 0, b: 1, addParams: {k: ''}})

// const dd = AdvancedDice.with((params: {min, max, addParams: {k: string } }) => 1, undefined);
// dd.someMethod({a: 0, b: 1, addParams: {k: ''}})

class Base<A> {
  private a: string;

  // Делаем конструктор public
  public constructor(a: string) {
    this.a = a;
  }

  static with<T extends typeof Base>(
    this: T ,//& (new (...args: ConstructorParameters<T>) => InstanceType<T>),
    a: string
  ): InstanceType<T> {
    return new this(a) as InstanceType<T>; // Теперь конструктор будет использовать текущий класс
  }

  someMethod() {
    console.log("It's a base!");
  }
}

class Derived<A> extends Base<A> {
  someMethod() {
    console.log("I'm here!");
  }
}

// Проверка
const derived = Derived.with('example'); // Тип derived — Derived
derived.someMethod(); // Вывод: I'm here!

const anotherDerived = Derived.with('another example'); // Тип anotherDerived — Derived
anotherDerived.someMethod(); // Вывод: I'm here!
const der = Derived.with('bbb'); // Теперь тип der — Derived
der.someMethod(); // Вывод: "I'm here!"

// Ошибка: производный класс имеет сигнатуру Dice<{k: string, any}> AdvanedDice<{k: string, z: number}>