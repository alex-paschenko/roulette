
import { Roulette } from '../src/_roulette';

const testDataSet = [{v: 'a', w: 1}, {v: 'b', w: 2}];

describe('Entropy Provider Testing', () => {
  it('Default Entropy Provider', () => {
    expect(() => (new Roulette()).buildFrom(testDataSet).spin).not.toThrow();
  });

  it('Function as Entrophy Provider', () => {
    expect(() => (new Roulette(() => ({ value: 1}))).buildFrom(testDataSet).spin).not.toThrow();
  });

  it('Object as Entropy Provider', () => {
    // @ts-ignore
    expect(() => (new Roulette({ fn: () => ({ value: 1})})).buildFrom(testDataSet).spin).toThrow(
      /When a constructor parameter is present, it must be a synchronous or asynchronous function/
    );
  });

  it('String as Entropy Provider', () => {
    // @ts-ignore
    expect(() => (new Roulette('provider')).buildFrom(testDataSet).spin).toThrow(
      /When a constructor parameter is present, it must be a synchronous or asynchronous function/
    );
  });
});