import { describe, it, expect, beforeEach, vi } from 'vitest';
import { replaceTextInNode, NODE_FILTER } from '../domUtils';

/**
 * DOM APIをモックするヘルパー関数
 */
function setupDomEnvironment() {
  // テキストノードを作成するヘルパー
  const createTextNode = (text: string): Node => ({
    nodeValue: text,
    nodeType: NODE_FILTER.SHOW_TEXT
  } as Node);

  // createTreeWalkerのモック
  const mockWalker = (nodes: Node[]) => {
    let index = -1;
    return {
      nextNode: () => {
        index++;
        return index < nodes.length ? nodes[index] : null;
      }
    };
  };

  // document.createTreeWalkerのモック
  vi.stubGlobal('document', {
    createTreeWalker: (
      root: Node,
      whatToShow: number,
      filter: NodeFilter | null
    ) => {
      // ルートノードに設定されたchildNodesプロパティを使用
      return mockWalker((root as any).childNodes as Node[]);
    }
  });

  return {
    createTextNode,
    createRootNode: (childNodes: Node[]): Node => ({
      childNodes,
      nodeType: 1, // Element node
    } as unknown as Node)
  };
}

describe('replaceTextInNode', () => {
  const { createTextNode, createRootNode } = setupDomEnvironment();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('テキストを正しく置換できること', () => {
    // テストノードの準備
    const textNode = createTextNode('Hello, world!');
    const rootNode = createRootNode([textNode]);

    // 実行
    const count = replaceTextInNode(rootNode, 'world', 'JavaScript');

    // 検証
    expect(textNode.nodeValue).toBe('Hello, JavaScript!');
    expect(count).toBe(1); // 1つのノードが置換された
  });

  it('正規表現を使った置換が正しく機能すること', () => {
    // テストノードの準備
    const textNode = createTextNode('The quick brown fox jumps over the lazy dog');
    const rootNode = createRootNode([textNode]);

    // 実行 - 単語の先頭が大文字のものをすべて置換
    const regex = /[A-Z][a-z]+/g;
    const count = replaceTextInNode(rootNode, regex, 'X');

    // 検証
    expect(textNode.nodeValue).toBe('X quick brown fox jumps over the lazy dog');
    expect(count).toBe(1); // 1つのノードが置換された
  });

  it('複数のノードを正しく処理できること', () => {
    // テストノードの準備
    const textNode1 = createTextNode('First node with text');
    const textNode2 = createTextNode('Second node with more text');
    const textNode3 = createTextNode('Third entry without match'); // "node"という単語を使わない
    const rootNode = createRootNode([textNode1, textNode2, textNode3]);

    // 実行
    const count = replaceTextInNode(rootNode, 'node', 'element');

    // 検証
    expect(textNode1.nodeValue).toBe('First element with text');
    expect(textNode2.nodeValue).toBe('Second element with more text');
    expect(textNode3.nodeValue).toBe('Third entry without match'); // 変更なし
    expect(count).toBe(2); // 2つのノードが置換された
  });

  it('置換がない場合は0を返すこと', () => {
    // テストノードの準備
    const textNode = createTextNode('No matches here');
    const rootNode = createRootNode([textNode]);

    // 実行
    const count = replaceTextInNode(rootNode, 'nonexistent', 'replacement');

    // 検証
    expect(textNode.nodeValue).toBe('No matches here'); // 変更なし
    expect(count).toBe(0); // 置換されたノードなし
  });

  it('パターンが文字列の場合も正しく動作すること', () => {
    // テストノードの準備
    const textNode = createTextNode('This is a test string');
    const rootNode = createRootNode([textNode]);

    // 実行
    const count = replaceTextInNode(rootNode, 'test', 'sample');

    // 検証
    expect(textNode.nodeValue).toBe('This is a sample string');
    expect(count).toBe(1); // 1つのノードが置換された
  });
});
