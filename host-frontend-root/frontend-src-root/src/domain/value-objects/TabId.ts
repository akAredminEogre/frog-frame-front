export class TabId {
  private readonly _value: number;

  constructor(value: number) {
    // より詳細なバリデーション（CurrentTabから移行）
    if (value === undefined || value === null) {
      throw new Error(`TabId constructor received invalid value: ${value}`);
    }
    
    if (typeof value !== 'number') {
      throw new Error(`TabId constructor expected number, but received: ${typeof value} (${value})`);
    }
    
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
