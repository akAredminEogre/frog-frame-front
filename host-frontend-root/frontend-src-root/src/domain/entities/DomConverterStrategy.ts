import { HtmlString } from '../value-objects/HtmlString';

export interface DomConverterStrategy {
  convert(htmlString: HtmlString): Node;
}
