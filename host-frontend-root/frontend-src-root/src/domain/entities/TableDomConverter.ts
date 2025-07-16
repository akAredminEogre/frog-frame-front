import { DomConverterStrategy } from './DomConverterStrategy';
import { HtmlString } from '../value-objects/HtmlString';
import { TagName } from '../value-objects/TagName';

export class TableDomConverter implements DomConverterStrategy {
  constructor(private readonly tagName: TagName) {}

  convert(htmlString: HtmlString): Node {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString.toString(), 'text/html');
    if (this.tagName.toString() === 'table') {
      return doc.body.firstChild || doc.createTextNode('');
    }

    const table = doc.createElement('table');
    const tempContainer = this.getTableContainer(table, this.tagName);
    tempContainer.innerHTML = htmlString.toString();
    return tempContainer.firstChild || doc.createTextNode('');
  }

  private getTableContainer(table: HTMLTableElement, tagName: TagName): HTMLElement {
    if (tagName.toString() === 'td' || tagName.toString() === 'th') {
      return table.createTBody().insertRow();
    }
    if (tagName.toString() === 'tr') {
      return table.createTBody();
    }
    return table;
  }
}
