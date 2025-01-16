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
