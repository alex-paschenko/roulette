export class RNGFinite {
    // The Bernoulli Distribution
    static bernoulli(p) {
        return randomUniform() < p ? 1 : 0;
    }
    // The Rademacher Distribution
    static rademacher() {
        return randomUniform() < 0.5 ? 1 : -1;
    }
    // The Binomial Distribution
    static binomial(trials, prob) {
        let successes = 0;
        for (let i = 0; i < trials; i++) {
            if (randomUniform() < prob)
                successes++;
        }
        return successes;
    }
    // Beta Distribution
    static beta(alpha, beta) {
        const x = gammaSample(alpha, 1);
        const y = gammaSample(beta, 1);
        return x / (x + y);
    }
    // Normal Distribution
    static normal(mean = 0, stdDev = 1) {
        const u1 = randomUniform();
        const u2 = randomUniform();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) *
            Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }
    // The Beta-Binomial Distribution
    static betaBinomial(trials, alpha, beta) {
        const p = Dice.beta(alpha, beta);
        return this.binomial(trials, p);
    }
    // The Degenerate Distribution
    static degenerate(x0) {
        return x0;
    }
    // The Discrete Uniform Distribution
    static discreteUniform(values) {
        const index = Math.floor(randomUniform() * values.length);
        return values[index];
    }
    // The Hypergeometric Distribution
    static hypergeometric(N, K, n) {
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
    static negativeHypergeometric(r, N, K) {
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
    static poissonBinomial(probabilities) {
        let successes = 0;
        probabilities.forEach((p) => {
            if (randomUniform() < p)
                successes++;
        });
        return successes;
    }
    // Fisher's Noncentral Hypergeometric Distribution
    static fishersNoncentralHypergeometric(N, K, n, odds) {
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
    static walleniusNoncentralHypergeometric(N, K, n, odds) {
        let successes = 0;
        let totalWeight = K * odds + (N - K);
        for (let i = 0; i < n; i++) {
            const p = (K * odds) / totalWeight;
            if (randomUniform() < p) {
                successes++;
                K--;
                totalWeight -= odds;
            }
            else {
                totalWeight--;
            }
        }
        return successes;
    }
    // Benford's Law
    static benford() {
        const randomValue = randomUniform();
        const benfordCDF = [0, 0.301, 0.477, 0.602, 0.699, 0.778, 0.845, 0.903, 0.954, 1];
        for (let i = 1; i < benfordCDF.length; i++) {
            if (randomValue < benfordCDF[i]) {
                return i;
            }
        }
        return 1;
    }
    // Ideal Soliton Distribution
    static solitonIdeal(N) {
        const randomValue = randomUniform();
        if (randomValue < 1 / N)
            return 1;
        for (let k = 2; k <= N; k++) {
            if (randomValue < (1 / k) + (1 / N))
                return k;
        }
        return N;
    }
    // Robust Soliton Distribution
    static solitonRobust(N, delta) {
        const tau = (k, N, delta) => {
            if (k < Math.floor(N / delta)) {
                return delta / (k * N);
            }
            else if (k === Math.floor(N / delta)) {
                return delta * Math.log(delta) / N;
            }
            return 0;
        };
        const ideal = (k, N) => (k === 1
            ? 1 / N
            : 1 / (k * (k - 1)));
        const probabilities = Array.from({ length: N }, (_, k) => ideal(k + 1, N) + tau(k + 1, N, delta));
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
    static zipf(N, s) {
        const harmonic = (n, s) => Array.from({ length: n }, (_, k) => 1 / Math.pow(k + 1, s)).reduce((a, b) => a + b, 0);
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
    static zipfMandelbrot(N, s, q) {
        const normalization = Array.from({ length: N }, (_, k) => 1 / Math.pow(k + 1 + q, s)).reduce((a, b) => a + b, 0);
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
    // Generate a random number in [min, max)
    static entropyProvider(min, max) {
        return Math.random() * (max - min) + min;
    }
    static setEntropyProvider(entropyProvider) {
        RNG.entropyProvider = entropyProvider;
    }
}
;
//# sourceMappingURL=_rng_finite.js.map