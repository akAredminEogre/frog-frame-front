import { RewriteRule } from './RewriteRule';

export class HtmlReplacer {
  replace(root: Node, rule: RewriteRule): number {
    let replaceCount = 0;
    const { oldString, newString } = rule;

    // oldStringからタグ名を抽出
    const match = oldString.match(/<([a-z0-9]+)/i);
    if (!match) return 0;
    const tagName = match[1];

    const elements = (root as Element).querySelectorAll(tagName);

    // DOMノードから不要な空白テキストノードを削除する
    const cleanNode = (node: Node) => {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      const nodesToRemove: Node[] = [];
      while (walker.nextNode()) {
        const textNode = walker.currentNode;
        if (textNode.nodeValue?.trim() === '') {
          nodesToRemove.push(textNode);
        }
      }
      nodesToRemove.forEach((n) => n.parentNode?.removeChild(n));
      return node;
    };

    // oldStringをDOMノードに変換
    const parser = new DOMParser();
    let context = null;
    // テーブル関連要素の場合、適切なコンテキストでラップする
    if (['td', 'th', 'tr'].includes(tagName.toLowerCase())) {
      context = document.createElement('table');
      if (tagName.toLowerCase() === 'tr') {
        context.innerHTML = oldString;
      } else {
        context.innerHTML = `<tbody><tr>${oldString}</tr></tbody>`;
      }
    }

    const oldDoc = context
      ? parser.parseFromString(context.outerHTML, 'text/html')
      : parser.parseFromString(oldString, 'text/html');

    let oldNode: Node | null = null;
    if (context) {
      if (tagName.toLowerCase() === 'tr') {
        oldNode = oldDoc.querySelector('tr');
      } else {
        oldNode = oldDoc.querySelector(tagName);
      }
    } else {
      oldNode = oldDoc.body.firstChild;
    }

    if (!oldNode) return 0;

    // 比較対象のノードもクリーンにする
    const cleanedOldNode = cleanNode(oldNode.cloneNode(true));

    // newStringをDOMノードに変換
    let newContext = null;
    if (['td', 'th', 'tr'].includes(tagName.toLowerCase())) {
      newContext = document.createElement('table');
      if (tagName.toLowerCase() === 'tr') {
        newContext.innerHTML = newString;
      } else {
        newContext.innerHTML = `<tbody><tr>${newString}</tr></tbody>`;
      }
    }
    
    const newDoc = newContext
      ? parser.parseFromString(newContext.outerHTML, 'text/html')
      : parser.parseFromString(newString, 'text/html');

    let newNodes: Node[] = [];
    if (newContext) {
      if (tagName.toLowerCase() === 'tr') {
        newNodes = Array.from(newDoc.querySelectorAll('tr'));
      } else {
        newNodes = Array.from(newDoc.querySelectorAll(tagName));
      }
    } else {
      newNodes = Array.from(newDoc.body.childNodes);
    }

    if (newNodes.length === 0) return 0;

    elements.forEach((element) => {
      const cleanedElement = cleanNode(element.cloneNode(true));

      if (cleanedElement.isEqualNode(cleanedOldNode)) {
        element.replaceWith(...newNodes.map((n) => n.cloneNode(true)));
        replaceCount++;
      }
    });

    return replaceCount;
  }
}
