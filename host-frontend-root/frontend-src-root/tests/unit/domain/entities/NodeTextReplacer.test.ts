import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Window } from 'happy-dom';
import { NodeTextReplacer } from 'src/domain/entities/NodeTextReplacer';
import { RewriteRule } from 'src/domain/entities/RewriteRule';
import { TextReplacer } from 'src/domain/entities/TextReplacer';
import { HtmlReplacer } from 'src/domain/entities/HtmlReplacer';

// モックの設定
vi.mock('src/domain/entities/TextReplacer');
vi.mock('src/domain/entities/HtmlReplacer');

describe('NodeTextReplacer', () => {
  const window = new Window();
  const document = window.document as any;
  let mockTextReplacer: TextReplacer;
  let mockHtmlReplacer: HtmlReplacer;

  beforeEach(() => {
    (global as any).NodeFilter = { SHOW_TEXT: 4 };
    (global as any).DOMParser = window.DOMParser;
    mockTextReplacer = new (vi.mocked(TextReplacer))();
    mockHtmlReplacer = new (vi.mocked(HtmlReplacer))();
  });

  it('should delegate to TextReplacer for plain text', () => {
    const rule: RewriteRule = { id: '1', oldString: 'world', newString: 'test' };
    const replacer = new NodeTextReplacer(mockTextReplacer, mockHtmlReplacer);
    mockTextReplacer.replace = vi.fn().mockReturnValue(1);

    const count = replacer.replace(document.body, rule);

    expect(mockTextReplacer.replace).toHaveBeenCalledWith(document.body, rule);
    expect(mockHtmlReplacer.replace).not.toHaveBeenCalled();
    expect(count).toBe(1);
  });

  it('should delegate to HtmlReplacer for HTML string', () => {
    const rule: RewriteRule = {
      id: '1',
      oldString: '<p>hello</p>',
      newString: '<b>replaced</b>',
    };
    const replacer = new NodeTextReplacer(mockTextReplacer, mockHtmlReplacer);
    mockHtmlReplacer.replace = vi.fn().mockReturnValue(1);

    const count = replacer.replace(document.body, rule);

    expect(mockHtmlReplacer.replace).toHaveBeenCalledWith(document.body, rule);
    expect(mockTextReplacer.replace).not.toHaveBeenCalled();
    expect(count).toBe(1);
  });
});
