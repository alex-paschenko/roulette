import { EntropyProvider } from "./_interfaces";
export declare class RNGFinite {
    static bernoulli(p: number): number;
    static rademacher(): number;
    static binomial(trials: number, prob: number): number;
    static beta(alpha: number, beta: number): number;
    static normal(mean?: number, stdDev?: number): number;
    static betaBinomial(trials: number, alpha: number, beta: number): number;
    static degenerate(x0: number): number;
    static discreteUniform(values: number[]): number;
    static hypergeometric(N: number, K: number, n: number): number;
    static negativeHypergeometric(r: number, N: number, K: number): number;
    static poissonBinomial(probabilities: number[]): number;
    static fishersNoncentralHypergeometric(N: number, K: number, n: number, odds: number): number;
    static walleniusNoncentralHypergeometric(N: number, K: number, n: number, odds: number): number;
    static benford(): number;
    static solitonIdeal(N: number): number;
    static solitonRobust(N: number, delta: number): number;
    static zipf(N: number, s: number): number;
    static zipfMandelbrot(N: number, s: number, q: number): number;
    static entropyProvider(min: number, max: number): number;
    static setEntropyProvider(entropyProvider: EntropyProvider): void;
}
//# sourceMappingURL=_rng_finite.d.ts.map