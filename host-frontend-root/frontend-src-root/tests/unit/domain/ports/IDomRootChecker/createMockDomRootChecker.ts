import type { IDomRootChecker } from 'src/domain/ports/IDomRootChecker';

/**
 * テスト用のモックDomRootCheckerを作成
 * @param attachedElements ドキュメントに接続されている要素のSet
 * @returns IDomRootCheckerのモック実装
 */
export function createMockDomRootChecker(attachedElements: Set<Element>): IDomRootChecker {
  return {
    isDocumentRoot: () => false,
    isAttachedToDocument: (element: Element) => attachedElements.has(element)
  };
}
