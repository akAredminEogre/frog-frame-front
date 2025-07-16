import { DomConverterFactory } from '../DomConverterFactory';
import { DefaultDomConverter } from '../DefaultDomConverter';
import { TableDomConverter } from '../TableDomConverter';
import { TagName } from '../../value-objects/TagName';

describe('DomConverterFactory', () => {
  it('should return a DefaultDomConverter for non-table related tags', () => {
    const tagName = new TagName('div');
    const converter = DomConverterFactory.createConverter(tagName);
    expect(converter).toBeInstanceOf(DefaultDomConverter);
  });

  it('should return a TableDomConverter for table related tags (td)', () => {
    const tagName = new TagName('td');
    const converter = DomConverterFactory.createConverter(tagName);
    expect(converter).toBeInstanceOf(TableDomConverter);
  });

  it('should return a TableDomConverter for table related tags (tr)', () => {
    const tagName = new TagName('tr');
    const converter = DomConverterFactory.createConverter(tagName);
    expect(converter).toBeInstanceOf(TableDomConverter);
  });

  it('should return a TableDomConverter for table related tags (table)', () => {
    const tagName = new TagName('table');
    const converter = DomConverterFactory.createConverter(tagName);
    expect(converter).toBeInstanceOf(TableDomConverter);
  });
});
