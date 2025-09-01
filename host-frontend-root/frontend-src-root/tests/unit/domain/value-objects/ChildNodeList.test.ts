import { ChildNodeList } from 'src/domain/value-objects/ChildNodeList';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ChildNodeList', () => {
  let parentDiv: HTMLDivElement;
  let tempDiv: HTMLDivElement;

  beforeEach(() => {
    parentDiv = document.createElement('div');
    tempDiv = document.createElement('div');
  });

  const testCases = [
    {
      name: 'should append all child nodes to parent element',
      html: '<span>first</span><p>second</p>',
      expectedChildCount: 2,
      expectedFirstChildNodeName: 'SPAN',
      expectedSecondChildNodeName: 'P',
    },
    {
      name: 'should handle empty node list',
      html: '',
      expectedChildCount: 0,
    },
    {
      name: 'should handle single text node',
      html: 'Just text',
      expectedChildCount: 1,
      expectedFirstChildNodeName: '#text',
    },
    {
      name: 'should handle single element',
      html: '<div>content</div>',
      expectedChildCount: 1,
      expectedFirstChildNodeName: 'DIV',
    },
  ];

  testCases.forEach(({ name, html, expectedChildCount, expectedFirstChildNodeName, expectedSecondChildNodeName }) => {
    it(name, () => {
      tempDiv.innerHTML = html;
      const childNodeList = new ChildNodeList(tempDiv.childNodes);

      childNodeList.appendAllTo(parentDiv);
      expect(parentDiv.childNodes.length).toBe(expectedChildCount);

      if (expectedChildCount > 0) {
        expect(parentDiv.firstChild?.nodeName).toBe(expectedFirstChildNodeName);
      }

      if (expectedChildCount > 1 && expectedSecondChildNodeName) {
        expect(parentDiv.childNodes[1]?.nodeName).toBe(expectedSecondChildNodeName);
      }
    });
  });

  describe('clearAllFrom', () => {
    it('should clear all child nodes from parent element', () => {
      parentDiv.innerHTML = '<span>child1</span><p>child2</p><div>child3</div>';
      expect(parentDiv.childNodes.length).toBe(3);

      ChildNodeList.clearAllFrom(parentDiv);
      expect(parentDiv.childNodes.length).toBe(0);
    });

    it('should handle empty parent element', () => {
      expect(parentDiv.childNodes.length).toBe(0);

      ChildNodeList.clearAllFrom(parentDiv);
      expect(parentDiv.childNodes.length).toBe(0);
    });

    it('should clear text nodes as well', () => {
      parentDiv.textContent = 'Some text content';
      expect(parentDiv.childNodes.length).toBe(1);

      ChildNodeList.clearAllFrom(parentDiv);
      expect(parentDiv.childNodes.length).toBe(0);
    });
  });
});
