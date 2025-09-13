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

describe('SimpleContainer.resolve', () => {
  let container: SimpleContainer;

  beforeEach(() => {
    container = new SimpleContainer();
  });

  it('登録されたサービスを正常に解決する', () => {
    const expectedMessage = 'resolved service';
    const resolver = () => new TestService(expectedMessage);
    
    container.register(TestService, resolver);
    
    const resolvedService = container.resolve(TestService);
    
    expect(resolvedService).toBeInstanceOf(TestService);
    expect(resolvedService.message).toBe(expectedMessage);
  });

  it('未登録のサービスを解決しようとするとエラーをスローする', () => {
    expect(() => {
      container.resolve(TestService);
    }).toThrow('Service TestService not found');
  });

  it('複数のサービスを正常に解決する', () => {
    const testResolver = () => new TestService('multi test');
    const anotherResolver = () => new AnotherTestService(999);
    
    container.register(TestService, testResolver);
    container.register(AnotherTestService, anotherResolver);
    
    const testService = container.resolve(TestService);
    const anotherService = container.resolve(AnotherTestService);
    
    expect(testService.message).toBe('multi test');
    expect(anotherService.value).toBe(999);
  });

  it('resolverが毎回新しいインスタンスを返す', () => {
    const resolver = () => new TestService('new instance');
    container.register(TestService, resolver);
    
    const instance1 = container.resolve(TestService);
    const instance2 = container.resolve(TestService);
    
    // 毎回新しいインスタンスが返されることを確認（シングルトンではない）
    expect(instance1).not.toBe(instance2);
    expect(instance1).toBeInstanceOf(TestService);
    expect(instance2).toBeInstanceOf(TestService);
  });

  it('resolverが例外をスローした場合、その例外が伝播する', () => {
    const errorMessage = 'Resolver error';
    const resolver = () => {
      throw new Error(errorMessage);
    };
    
    container.register(TestService, resolver);
    
    expect(() => {
      container.resolve(TestService);
    }).toThrow(errorMessage);
  });

  it('正しい型でサービスを返す', () => {
    const resolver = () => new TestService('typed');
    container.register(TestService, resolver);
    
    const service: TestService = container.resolve(TestService);
    
    expect(service.message).toBe('typed');
  });
});
