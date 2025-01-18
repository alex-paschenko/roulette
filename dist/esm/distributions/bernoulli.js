import Builder from './lib/builder.js';
import defaultEntropyProvider from './lib/defaultEntropyProvider.js';
const randomFn = (params, uniformRandom) => uniformRandom({ min: 0, max: 1 }) < params.p ? 1 : 0;
class Bernoulli extends Builder(defaultEntropyProvider, randomFn) {
}
;
export default Bernoulli;
//# sourceMappingURL=bernoulli.js.map