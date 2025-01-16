const defaultEntropyProvider =
  (context: {}, range: { min: number, max: number }) =>
    Math.random() * (range.max - range.min) + range.min;

export default defaultEntropyProvider;
