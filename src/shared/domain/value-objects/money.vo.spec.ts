import { InvalidArgumentException } from '../exceptions/domain.exception';
import { Money } from './money.vo';

describe('Money', () => {
  it('creates with amount and default EUR currency', () => {
    const money = Money.create(2500);
    expect(money.amount).toBe(2500);
    expect(money.currency).toBe('EUR');
  });

  it('accepts an explicit currency', () => {
    expect(Money.create(100, 'USD').currency).toBe('USD');
  });

  it('rejects a non-integer amount', () => {
    expect(() => Money.create(10.5)).toThrow(InvalidArgumentException);
  });

  it('rejects a negative amount', () => {
    expect(() => Money.create(-1)).toThrow(InvalidArgumentException);
  });

  it('multiplies by an integer factor preserving currency', () => {
    const total = Money.create(2500, 'USD').multiply(3);
    expect(total.amount).toBe(7500);
    expect(total.currency).toBe('USD');
  });

  it('rejects multiplication by a non-integer factor', () => {
    expect(() => Money.create(2500).multiply(1.5)).toThrow(InvalidArgumentException);
  });

  it('treats equal amounts and currencies as equal', () => {
    expect(Money.create(100).equals(Money.create(100))).toBe(true);
    expect(Money.create(100).equals(Money.create(200))).toBe(false);
  });
});
