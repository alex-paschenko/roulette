// Utility functions
function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function gamma(n: number): number {
  if (n === 1) return 1;
  if (n === 0.5) return Math.sqrt(Math.PI);
  return (n - 1) * gamma(n - 1);
}

function randomUniform(): number {
  return Math.random();
}

// Gamma Sample Utility
function gammaSample(shape: number, scale: number): number {
  if (shape < 1) {
    const u = randomUniform();
    return gammaSample(1 + shape, scale) * Math.pow(u, 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x, v;
    do {
      x = normal(0, 1);
      v = 1 + c * x;
    } while (v <= 0);

    v = v ** 3;
    const u = randomUniform();
    if (
      u < 1 - 0.0331 * (x ** 4) ||
      Math.log(u) < 0.5 * x ** 2 + d * (1 - v + Math.log(v))
    ) {
      return d * v * scale;
    }
  }
}

// Normal Distribution Utility
function normal(mean: number = 0, stdDev: number = 1): number {
  const u1 = randomUniform();
  const u2 = randomUniform();
  const z0 = Math.sqrt(-2.0 * Math.log(u1))
    * Math.cos(2.0 * Math.PI * u2);

  return z0 * stdDev + mean;
}

class Dice {
  // The Bernoulli Distribution
  static bernoulli(p: number): number {
    return randomUniform() < p ? 1 : 0;
  }

  // The Rademacher Distribution
  static rademacher(): number {
    return randomUniform() < 0.5 ? 1 : -1;
  }

  // The Binomial Distribution
  static binomial(trials: number, prob: number): number {
    let successes = 0;
    for (let i = 0; i < trials; i++) {
      if (randomUniform() < prob) successes++;
    }
    return successes;
  }

  // Beta Distribution
  static beta(alpha: number, beta: number): number {
    const x = gammaSample(alpha, 1);
    const y = gammaSample(beta, 1);
    return x / (x + y);
  }

  // Normal Distribution
  static normal(mean: number = 0, stdDev: number = 1): number {
    const u1 = randomUniform();
    const u2 = randomUniform();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) *
      Math.cos(2.0 * Math.PI * u2);

    return z0 * stdDev + mean;
  }

  // The Beta-Binomial Distribution
  static betaBinomial(
    trials: number,
    alpha: number,
    beta: number
  ): number {
    const p = Dice.beta(alpha, beta);
    return this.binomial(trials, p);
  }

  // The Degenerate Distribution
  static degenerate(x0: number): number {
    return x0;
  }

  // The Discrete Uniform Distribution
  static discreteUniform(values: number[]): number {
    const index = Math.floor(randomUniform() * values.length);
    return values[index];
  }

  // The Hypergeometric Distribution
  static hypergeometric(N: number, K: number, n: number): number {
    let successes = 0;
    for (let i = 0; i < n; i++) {
      if (randomUniform() < K / N) {
        successes++;
        K--;
      }
      N--;
    }
    return successes;
  }

  // The Negative Hypergeometric Distribution
  static negativeHypergeometric(
    r: number,
    N: number,
    K: number
  ): number {
    let attempts = 0;
    let successes = 0;
    while (successes < r) {
      if (randomUniform() < K / N) {
        successes++;
        K--;
      }
      N--;
      attempts++;
    }
    return attempts;
  }

  // The Poisson Binomial Distribution
  static poissonBinomial(probabilities: number[]): number {
    let successes = 0;
    probabilities.forEach((p) => {
      if (randomUniform() < p) successes++;
    });
    return successes;
  }

  // Fisher's Noncentral Hypergeometric Distribution
  static fishersNoncentralHypergeometric(
    N: number,
    K: number,
    n: number,
    odds: number
  ): number {
    let successes = 0;
    for (let i = 0; i < n; i++) {
      const p = (odds * K) / ((odds * K) + (N - K));
      if (randomUniform() < p) {
        successes++;
        K--;
      }
      N--;
    }
    return successes;
  }

  // Wallenius' Noncentral Hypergeometric Distribution
  static walleniusNoncentralHypergeometric(
    N: number,
    K: number,
    n: number,
    odds: number
  ): number {
    let successes = 0;
    let totalWeight = K * odds + (N - K);
    for (let i = 0; i < n; i++) {
      const p = (K * odds) / totalWeight;
      if (randomUniform() < p) {
        successes++;
        K--;
        totalWeight -= odds;
      } else {
        totalWeight--;
      }
    }
    return successes;
  }

  // Benford's Law
  static benford(): number {
    const randomValue = randomUniform();
    const benfordCDF =
      [0, 0.301, 0.477, 0.602, 0.699, 0.778, 0.845, 0.903, 0.954, 1];

    for (let i = 1; i < benfordCDF.length; i++) {
      if (randomValue < benfordCDF[i]) {
        return i;
      }
    }
    return 1;
  }

  // Ideal Soliton Distribution
  static solitonIdeal(N: number): number {
    const randomValue = randomUniform();
    if (randomValue < 1 / N) return 1;
    for (let k = 2; k <= N; k++) {
      if (randomValue < (1 / k) + (1 / N)) return k;
    }
    return N;
  }

  // Robust Soliton Distribution
  static solitonRobust(N: number, delta: number): number {
    const tau = (k: number, N: number, delta: number) => {
      if (k < Math.floor(N / delta)) {
        return delta / (k * N);
      } else if (k === Math.floor(N / delta)) {
        return delta * Math.log(delta) / N;
      }
      return 0;
    };
    const ideal = (k: number, N: number) => (
      k === 1
      ? 1 / N
      : 1 / (k * (k - 1))
    );

    const probabilities = Array.from(
      { length: N }, (_, k) => ideal(k + 1, N) + tau(k + 1, N, delta)
    );

    const randomValue = randomUniform();
    let cumulative = 0;
    for (let k = 0; k < probabilities.length; k++) {
      cumulative += probabilities[k];
      if (randomValue < cumulative) {
        return k + 1;
      }
    }
    return N;
  }

  // Zipf's Law
  static zipf(N: number, s: number): number {
    const harmonic = (n: number, s: number) => Array.from(
      { length: n }, (_, k) => 1 / Math.pow(k + 1, s)
    ).reduce((a, b) => a + b, 0);

    const H = harmonic(N, s);
    const randomValue = randomUniform();

    let cumulative = 0;
    for (let k = 1; k <= N; k++) {
      cumulative += 1 / (Math.pow(k, s) * H);
      if (randomValue < cumulative) {
        return k;
      }
    }
    return N;
  }

  // Zipf-Mandelbrot Law
  static zipfMandelbrot(N: number, s: number, q: number): number {
    const normalization = Array.from(
      { length: N },
      (_, k) => 1 / Math.pow(k + 1 + q, s)
    ).reduce((a, b) => a + b, 0);

    const randomValue = randomUniform();
    let cumulative = 0;
    for (let k = 1; k <= N; k++) {
      cumulative += 1 / (Math.pow(k + q, s) * normalization);
      if (randomValue < cumulative) {
        return k;
      }
    }
    return N;
  }
}

// AdvancedDistributions class
class AdvancedDistributions {
  // Beta Negative Binomial Distribution
  static betaNegativeBinomial(
    trials: number,
    alpha: number,
    beta: number
  ): number {
    const p = Dice.beta(alpha, beta);
    return this.negativeBinomial(trials, p);
  }

  // Boltzmann Distribution
  static boltzmann(energyLevels: number[], temperature: number): number {
    const weights = energyLevels.map((e) => Math.exp(-e / temperature));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const probabilities = weights.map((w) => w / totalWeight);

    let cumulative = 0;
    const randomValue = randomUniform();
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (randomValue < cumulative) {
        return i;
      }
    }
    return energyLevels.length - 1;
  }

  // Generalized Boltzmann Distribution
  static generalizedBoltzmann(
    energyLevels: number[],
    temperature: number,
    weightFunction: (energy: number) => number
  ): number {
    const weights = energyLevels.map(
      (e) => weightFunction(e) * Math.exp(-e / temperature)
    );
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const probabilities = weights.map((w) => w / totalWeight);

    let cumulative = 0;
    const randomValue = randomUniform();
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (randomValue < cumulative) {
        return i;
      }
    }
    return energyLevels.length - 1;
  }

  // Gibbs Distribution
  static gibbs(
    energyLevels: number[],
    temperature: number,
    interactionMatrix: number[][]
  ): number {
    const weights = energyLevels.map((e, i) => {
      const interactionSum =
        interactionMatrix[i]?.reduce((sum, value) => sum + value, 0) || 0;
      return Math.exp(-(e + interactionSum) / temperature);
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const probabilities = weights.map((w) => w / totalWeight);

    let cumulative = 0;
    const randomValue = randomUniform();
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (randomValue < cumulative) {
        return i;
      }
    }
    return energyLevels.length - 1;
  }

  static maxwellBoltzmann(
    velocity: number,
    temperature: number,
    mass: number): number {
    const factor = Math.sqrt((mass / (2 * Math.PI * temperature)) ** 3);
    return factor * velocity ** 2 * Math.exp(
      (-mass * velocity ** 2) / (2 * temperature)
    );
  }

  // Borel Distribution
  static borel(lambda: number): number {
    const randomValue = randomUniform();
    let cumulative = 0;
    let k = 1;

    while (true) {
      cumulative += Math.exp(-lambda * k) *
        (Math.pow(lambda * k, k - 1) / factorial(k));

      if (randomValue < cumulative) return k;
      k++;
    }
  }

  // Discrete Phase-Type Distribution
  static discretePhaseType(
    transitionMatrix: number[][],
    absorbingState: number
  ): number {
    let currentState = 0;
    let steps = 0;

    while (currentState !== absorbingState) {
      const probabilities = transitionMatrix[currentState];
      const randomValue = randomUniform();
      let cumulative = 0;

      for (let i = 0; i < probabilities.length; i++) {
        cumulative += probabilities[i];
        if (randomValue < cumulative) {
          currentState = i;
          break;
        }
      }
      steps++;
    }

    return steps;
  }

  // Extended Negative Binomial Distribution
  static extendedNegativeBinomial(
    trials: number,
    r: number,
    p: number
  ): number {
    return this.negativeBinomial(trials, p) + r;
  }

  // Generalized Log-Series Distribution
  static generalizedLogSeries(alpha: number, beta: number): number {
    let k = 1;
    while (true) {
      const p = alpha * Math.pow(beta, k) / k;
      if (randomUniform() < p) return k;
      k++;
    }
  }

  // Gauss–Kuzmin Distribution
  static gaussKuzmin(q: number = 2): number {
    const randomValue = randomUniform();
    let cumulative = 0;
    for (let k = 1; ; k++) {
      cumulative += Math.log(1 + 1 / (k * (k + 1))) / Math.log(q);
      if (randomValue < cumulative) return k;
    }
  }

  // Geometric Distribution
  static geometric(p: number): number {
    return Math.ceil(Math.log(1 - randomUniform()) / Math.log(1 - p));
  }

  // Hermite Distribution
  static hermite(lambda1: number, lambda2: number): number {
    const poisson1 = this.poisson(lambda1);
    const poisson2 = this.poisson(lambda2);
    return poisson1 + 2 * poisson2;
  }

  // Logarithmic Distribution
  static logarithmic(p: number): number {
    const logP = Math.log(1 - p);
    let k = 1;
    while (true) {
      if (randomUniform() < ((-1) ** (k + 1)) * (p ** k) / (k * logP)) {
        return k;
      }

      k++;
    }
  }

  // Mixed Poisson Distribution
  static mixedPoisson(lambdaFunction: () => number): number {
    const lambda = lambdaFunction();
    return this.poisson(lambda);
  }

  // Negative Binomial Distribution
  static negativeBinomial(r: number, p: number): number {
    let failures = 0;
    let successes = 0;
    while (successes < r) {
      if (randomUniform() < p) {
        successes++;
      } else {
        failures++;
      }
    }
    return failures;
  }
  // Discrete Compound Poisson Distribution
  static discreteCompoundPoisson(
    lambda: number,
    distributionFunction: () => number
  ): number {
    const n = this.poisson(lambda);
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += distributionFunction();
    }
    return sum;
  }

  // Parabolic Fractal Distribution
  static parabolicFractal(a: number, b: number): number {
    const randomValue = randomUniform();
    const range = b - a;
    return a + range * Math.sqrt(randomValue);
  }

  // Poisson Distribution
  static poisson(lambda: number): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= randomUniform();
    } while (p > L);
    return k - 1;
  }

  // Conway–Maxwell–Poisson Distribution
  static conwayMaxwellPoisson(lambda: number, nu: number): number {
    let sum = 0;
    let prob = Math.exp(-lambda);
    let k = 0;
    const randomValue = randomUniform();
    while (true) {
      sum += prob;
      if (randomValue < sum) return k;
      k++;
      prob *= lambda / (Math.pow(k, nu));
    }
  }

  // Zero-Truncated Poisson Distribution
  static zeroTruncatedPoisson(lambda: number): number {
    while (true) {
      const value = this.poisson(lambda);
      if (value > 0) return value;
    }
  }

  // Polya–Eggenberger Distribution
  static polyaEggenberger(n: number, a: number, b: number): number {
    let successes = 0;
    let failures = 0;

    for (let i = 0; i < n; i++) {
      const p = (a + successes) / (a + b + successes + failures);
      if (randomUniform() < p) {
        successes++;
      } else {
        failures++;
      }
    }

    return successes;
  }

  // Skellam Distribution
  static skellam(mu1: number, mu2: number): number {
    const poisson1 = this.poisson(mu1);
    const poisson2 = this.poisson(mu2);
    return poisson1 - poisson2;
  }

  // Skew Elliptical Distribution
  static skewElliptical(
    mean: number,
    scale: number,
    skewness: number
  ): number {
    const u1 = randomUniform();
    const u2 = randomUniform();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = skewness * Math.abs(z0) + (1 - skewness) * z0;
    return z1 * scale + mean;
  }

  // Yule-Simon Distribution
  static yuleSimon(rho: number): number {
    const randomValue = randomUniform();
    return Math.ceil(Math.log(1 - randomValue) / Math.log(1 - 1 / rho));
  }

  // Zeta Distribution
  static zeta(s: number): number {
    const randomValue = randomUniform();
    let cumulative = 0;
    for (let k = 1; ; k++) {
      cumulative += 1 / Math.pow(k, s);
      if (randomValue < cumulative) return k;
    }
  }

  // Hardy Distribution (Simplified as an example)
  static hardy(probabilities: number[]): number {
    let cumulative = 0;
    const randomValue = randomUniform();
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (randomValue < cumulative) return i;
    }
    return probabilities.length - 1;
  }
}

export { Dice };
