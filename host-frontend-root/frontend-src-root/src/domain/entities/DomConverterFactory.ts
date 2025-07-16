import { DomConverterStrategy } from './DomConverterStrategy';
import { DefaultDomConverter } from './DefaultDomConverter';
import { TableDomConverter } from './TableDomConverter';
import { TagName } from '../value-objects/TagName';

export class DomConverterFactory {
  static createConverter(tagName: TagName): DomConverterStrategy {
    if (tagName.isTableRelated()) {
      return new TableDomConverter(tagName);
    }
    return new DefaultDomConverter();
  }
}
