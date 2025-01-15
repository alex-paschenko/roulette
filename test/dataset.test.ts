import { Roulette } from '../src/_roulette';

describe('Dataset testing', () => {
  describe('Valid datasets', () => {
    it('Items as arrays', () => {
      expect(() => (new Roulette()).buildFrom([['a', 1], ['b', 2]])).not.toThrow();
    });

    it('Items as { v, w } objects', () => {
      expect(() => (new Roulette())
        .buildFrom([{v: 'a', w: 1}, {v: 'b', w: 2}]))
        .not.toThrow();
    });

    it('Items as { value, width } objects', () => {
      expect(() => (new Roulette())
        .buildFrom([{value: 'a', width: 1}, {value: 'b', width: 2}]))
        .not.toThrow();
    });
  });

  describe('Invalid datasets', () => {

  });
});
