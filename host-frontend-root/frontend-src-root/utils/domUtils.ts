// NodeFilter定数（Node.js環境でテスト実行時のためにPolyfill）
export const NODE_FILTER = {
  SHOW_TEXT: 4, // NodeFilter.SHOW_TEXT の値は 4
};

/**
 * DOMツリーを走査し、テキストノードまたはDOM要素を置換する関数
 * @param root ルートノード (例: document.body)
 * @param oldString 置換対象の文字列（テキストまたはHTML文字列）
 * @param newString 置換後の文字列（テキストまたはHTML文字列）
 * @returns 置換が行われた数
 */
export function replaceInNode(
  root: Node,
  oldString: string,
  newString: string
): number {
  let replaceCount = 0;

  // oldStringがHTMLタグを含んでいるか簡易的に判定
  const isHtml = /<[a-z][\s\S]*>/i.test(oldString);

  if (isHtml) {
    // DOM要素の置換
    // oldStringからタグ名を抽出
    const match = oldString.match(/<([a-z0-9]+)/i);
    if (!match) return 0;
    const tagName = match[1];

    const elements = (root as Element).querySelectorAll(tagName);
    
    // DOMノードから不要な空白テキストノードを削除する
    const cleanNode = (node: Node) => {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      const nodesToRemove: Node[] = [];
      while(walker.nextNode()) {
        const textNode = walker.currentNode;
        if (textNode.nodeValue?.trim() === '') {
          nodesToRemove.push(textNode);
        }
      }
      nodesToRemove.forEach(n => n.parentNode?.removeChild(n));
      return node;
    }

    // oldStringをDOMノードに変換
    const parser = new DOMParser();
    const oldDoc = parser.parseFromString(oldString, 'text/html');
    const oldNode = oldDoc.body.firstChild;

    if (!oldNode) return 0;
    
    // 比較対象のノードもクリーンにする
    const cleanedOldNode = cleanNode(oldNode.cloneNode(true));

    elements.forEach(element => {
      const cleanedElement = cleanNode(element.cloneNode(true));
      
      if (cleanedElement.isEqualNode(cleanedOldNode)) {
        element.outerHTML = newString;
        replaceCount++;
      }
    });

  } else {
    // テキストノードの置換
    const nodeFilterValue = typeof NodeFilter !== 'undefined'
      ? NodeFilter.SHOW_TEXT
      : NODE_FILTER.SHOW_TEXT;

    const walker = document.createTreeWalker(root, nodeFilterValue, null);
    let textNode: Node | null;

    while ((textNode = walker.nextNode())) {
      const oldText = textNode.nodeValue;
      if (oldText) {
        const regex = new RegExp(oldString, 'g');
        const replacedText = oldText.replace(regex, newString);
        if (replacedText !== oldText) {
          textNode.nodeValue = replacedText;
          replaceCount++;
        }
      }
    }
  }

  return replaceCount;
}
