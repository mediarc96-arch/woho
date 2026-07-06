import { InvalidArgumentException } from '../exceptions/domain.exception';
import { ValueObject } from '../value-object.base';

interface MoneyProps {
  amount: number; // minor units (e.g. cents)
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  static create(amount: number, currency = 'EUR'): Money {
    if (!Number.isInteger(amount)) {
      throw new InvalidArgumentException('Money amount must be an integer in minor units');
    }
    if (amount < 0) {
      throw new InvalidArgumentException('Money amount cannot be negative');
    }
    return new Money({ amount, currency });
  }

  multiply(factor: number): Money {
    if (!Number.isInteger(factor)) {
      throw new InvalidArgumentException('Money can only be multiplied by an integer factor');
    }
    return Money.create(this.props.amount * factor, this.props.currency);
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }
}
