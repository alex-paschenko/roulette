class EntropyProvider {
    constructor(newFn, storage) {
        this.fn = newFn;
        this.storage = storage;
    }
    execute(params) {
        if (!this.fn) {
            throw new Error("Function not set. Use constructor to set a function.");
        }
        return this.fn({ ...params, storage: this.storage });
    }
}
class Dice1 {
    constructor(entropyProvider) {
        this.entropyProvider = entropyProvider;
    }
    static with(fn, storage) {
        const entropyProvider = new EntropyProvider(fn, storage);
        const instance = new (this)(entropyProvider);
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
    someMethod(params) {
        const executeParams = {
            min: params.a,
            max: params.b,
            ...params.addParams ? { addParams: params.addParams } : {},
        };
        // @ts-ignore
        return this.entropyProvider.execute(executeParams);
    }
}
class DerivedDice extends Dice1 {
    someMethod() {
        console.log('1');
        return 1;
    }
    der() {
        console.log('222');
    }
}
const baseD = Dice1.with((p) => 1, undefined);
const derD = DerivedDice.with((p) => 1, undefined);
class BaseClass {
    constructor(fn, s) {
        this.fn = fn;
        this.s = s;
    }
    static create(fn, s) {
        const instance = new this(fn, s);
        return instance;
    }
}
;
class DerivedClass extends BaseClass {
    someMethod() {
        const ppp = undefined;
        return ppp;
        console.log("I'm here!");
    }
}
// Пример использования:
const baseInstance = BaseClass.create((params) => 1, { v: "Hello!" }); // Тип: BaseClass<number, { v: string }>
const childInstance = DerivedClass.create((params) => 1, { v: "Hello!" }); // Тип: DerivedClass<number, { v: string }>
const result = childInstance.someMethod({}); // Вывод: "I'm here!"
// Проверка
const exampleParams = {
    storage: {
        v: "Hello!",
    },
    addParams: 42,
};
console.log(exampleParams);
// childInstance.someMethod(); // Вывод: "I'm here!"
// childInstance.som();
class SomeClass {
    static staticMethod() {
        return {};
        console.log("Type of class:", {});
    }
}
class SubClass extends SomeClass {
}
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
class Base {
    // Делаем конструктор public
    constructor(a) {
        this.a = a;
    }
    static with(//& (new (...args: ConstructorParameters<T>) => InstanceType<T>),
    a) {
        return new this(a); // Теперь конструктор будет использовать текущий класс
    }
    someMethod() {
        console.log("It's a base!");
    }
}
class Derived extends Base {
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
export {};
// Ошибка: производный класс имеет сигнатуру Dice<{k: string, any}> AdvanedDice<{k: string, z: number}>
//# sourceMappingURL=_test-fixed.js.map