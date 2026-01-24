import type { IElementFactory } from 'src/domain/ports/IElementFactory';

/**
 * テスト用のモックElementFactoryを作成
 * テスト環境（happy-dom）のdocument.createElementを使用
 */
export function createMockElementFactory(): IElementFactory {
  return {
    createElement: (tagName: string) => document.createElement(tagName)
  };
}
