export class TabId {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('Tab ID must be an integer');
    }
    if (value <= 0) {
      throw new Error('Tab ID must be positive');
    }
    
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}
