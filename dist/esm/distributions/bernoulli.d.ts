import { UniformRandom } from './lib/builder';
declare const Bernoulli_base: import("./lib/builder").BuilderI<(context: {}, range: {
    min: number;
    max: number;
}) => number, (params: {
    p: number;
}, uniformRandom: UniformRandom) => number>;
declare class Bernoulli extends Bernoulli_base {
}
export default Bernoulli;
//# sourceMappingURL=bernoulli.d.ts.map