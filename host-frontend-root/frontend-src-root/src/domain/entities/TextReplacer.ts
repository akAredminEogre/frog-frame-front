import { RewriteRule } from './RewriteRule';

export class TextReplacer {
  replace(root: Node, rule: RewriteRule): number {
    let replaceCount = 0;
    const { oldString, newString } = rule;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
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
