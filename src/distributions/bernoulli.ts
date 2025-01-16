import Builder, { UniformRandom } from './lib/builder';
import defaultEntropyProvider from './lib/defaultEntropyProvider';

const randomFn = (
  params: { p: number },
  uniformRandom: UniformRandom,
): number => uniformRandom({ min: 0, max: 1}) < params.p ? 1 : 0;

class Bernoulli extends Builder(defaultEntropyProvider, randomFn) {};

export default Bernoulli;
