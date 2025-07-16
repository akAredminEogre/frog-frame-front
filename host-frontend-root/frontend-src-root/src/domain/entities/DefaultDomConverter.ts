import { DomConverterStrategy } from './DomConverterStrategy';
import { HtmlString } from '../value-objects/HtmlString';

export class DefaultDomConverter implements DomConverterStrategy {
  convert(htmlString: HtmlString): Node {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString.toString(), 'text/html');
    return doc.body.firstChild || doc.createTextNode('');
  }
}
