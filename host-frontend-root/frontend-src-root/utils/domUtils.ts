// NodeFilter定数（Node.js環境でテスト実行時のためにPolyfill）
export const NODE_FILTER = {
  SHOW_TEXT: 4, // NodeFilter.SHOW_TEXT の値は 4
};

/**
 * DOMツリーを走査し、テキストノードを正規表現で置換する関数
 * @param root     ルートノード (例: document.body)
 * @param oldTextPattern  置換対象の正規表現パターン（文字列または正規表現）
 * @param newTextValue  置換後の文字列
 * @returns 置換が行われたノードの数
 */
export function replaceTextInNode(
  root: Node, 
  oldTextPattern: string | RegExp, 
  newTextValue: string
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
      // oldTextPatternが文字列の場合は正規表現に変換
      const regex = oldTextPattern instanceof RegExp ? oldTextPattern : new RegExp(oldTextPattern, 'g');
      const replacedText = oldText.replace(regex, newTextValue);
      if (replacedText !== oldText) {
        textNode.nodeValue = replacedText;
        replaceCount++;
      }
    }
  }
  
  return replaceCount;
}
