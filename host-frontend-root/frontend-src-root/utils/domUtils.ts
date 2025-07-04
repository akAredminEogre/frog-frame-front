// NodeFilter定数（Node.js環境でテスト実行時のためにPolyfill）
export const NODE_FILTER = {
  SHOW_TEXT: 4, // NodeFilter.SHOW_TEXT の値は 4
};

/**
 * DOMツリーを走査し、テキストノードを正規表現で置換する関数
 * @param root     ルートノード (例: document.body)
 * @param pattern  置換対象の正規表現パターン（文字列または正規表現）
 * @param replacement  置換後の文字列
 * @returns 置換が行われたノードの数
 */
export function replaceTextInNode(
  root: Node, 
  pattern: string | RegExp, 
  replacement: string
): number {
  // ブラウザ環境とテスト環境の両方で動作するように条件分岐
  const nodeFilterValue = typeof NodeFilter !== 'undefined' 
    ? NodeFilter.SHOW_TEXT 
    : NODE_FILTER.SHOW_TEXT;
  
  const walker = document.createTreeWalker(root, nodeFilterValue, null);
  let textNode: Node | null;
  let replaceCount = 0;
  
  while ((textNode = walker.nextNode())) {
    const oldText = textNode.nodeValue;
    if (oldText) {
      // patternが文字列の場合は正規表現に変換
      const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'g');
      const newText = oldText.replace(regex, replacement);
      if (newText !== oldText) {
        textNode.nodeValue = newText;
        replaceCount++;
      }
    }
  }
  
  return replaceCount;
}
