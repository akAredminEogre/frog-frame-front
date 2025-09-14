import { describe, it, expect, beforeEach } from 'vitest';
import { SimpleContainer } from 'src/infrastructure/di/container';

// テスト用のクラス
class TestService {
  message: string;
  constructor(message: string = 'default') {
    this.message = message;
  }
}

class AnotherTestService {
  value: number;
  constructor(value: number = 42) {
    this.value = value;
  }
}

describe('SimpleContainer.register', () => {
  let container: SimpleContainer;

  beforeEach(() => {
    container = new SimpleContainer();
  });

  it('サービスを正常に登録する', () => {
    const resolver = () => new TestService('registered');

    expect(() => {
      container.register(TestService, resolver);
    }).not.toThrow();
  });

  it('複数の異なるサービスクラスを登録する', () => {
    const testResolver = () => new TestService('test');
    const anotherResolver = () => new AnotherTestService(100);

    expect(() => {
      container.register(TestService, testResolver);
      container.register(AnotherTestService, anotherResolver);
    }).not.toThrow();
  });

  it('同じサービスクラスを複数回登録できる（上書きされる）', () => {
    const firstResolver = () => new TestService('first');
    const secondResolver = () => new TestService('second');

    expect(() => {
      container.register(TestService, firstResolver);
      container.register(TestService, secondResolver);
    }).not.toThrow();

    // 後から登録した方が有効になることを確認
    const resolvedService = container.resolve(TestService);
    expect(resolvedService.message).toBe('second');
  });
});
