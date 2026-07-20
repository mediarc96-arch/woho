import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { Rating } from './rating.vo';

describe('Rating', () => {
  it.each([1, 2, 3, 4, 5])('accepts %i', (value) => {
    expect(Rating.create(value).value).toBe(value);
  });

  it('rejects 0 (below range)', () => {
    expect(() => Rating.create(0)).toThrow(InvalidArgumentException);
  });

  it('rejects 6 (above range)', () => {
    expect(() => Rating.create(6)).toThrow(InvalidArgumentException);
  });

  it('rejects a non-integer', () => {
    expect(() => Rating.create(4.5)).toThrow(InvalidArgumentException);
  });
});
