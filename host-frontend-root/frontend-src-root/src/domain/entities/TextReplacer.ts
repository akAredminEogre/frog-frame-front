import { RewriteRule } from './RewriteRule';

// NodeFilter定数（Node.js環境でテスト実行時のためにPolyfill）
const NODE_FILTER = {
  SHOW_TEXT: 4, // NodeFilter.SHOW_TEXT の値は 4
};

export class TextReplacer {
  replace(root: Node, rule: RewriteRule): number {
    let replaceCount = 0;
    const { oldString, newString } = rule;

    const nodeFilterValue =
      typeof NodeFilter !== 'undefined'
        ? NodeFilter.SHOW_TEXT
        : NODE_FILTER.SHOW_TEXT;

    const walker = document.createTreeWalker(root, nodeFilterValue, null);
    let textNode: Node | null;

    while ((textNode = walker.nextNode())) {
      const oldText = textNode.nodeValue;
      if (oldText) {
        const regex = new RegExp(oldString, 'g');
        let match;
        let lastIndex = 0;
        let newText = '';
        let replacedInNode = false;
        while ((match = regex.exec(oldText)) !== null) {
          newText += oldText.substring(lastIndex, match.index) + newString;
          lastIndex = regex.lastIndex;
          replaceCount++;
          replacedInNode = true;
        }
        if (replacedInNode) {
          newText += oldText.substring(lastIndex);
          textNode.nodeValue = newText;
        }
      }
    }
    return replaceCount;
  }
}
