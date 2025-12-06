/**
 * DOMルート要素（document, document.body）の判定を抽象化するインターフェース。
 * 依存性の逆転の原則に従い、domain層がinfrastructure層に依存することなく
 * DOMルート要素の判定を行えるようにします。
 */
export interface IDomRootChecker {
  /**
   * 指定されたノードがDOMルート要素（documentまたはdocument.body）かどうかを判定します。
   * @param node 判定対象のノード。
   * @returns documentまたはdocument.bodyの場合はtrue。
   */
  isDocumentRoot(node: Node): boolean;

  /**
   * 指定された要素がドキュメントに接続されているかどうかを判定します。
   * @param element 判定対象の要素。
   * @returns document.body.contains(element)の結果。
   */
  isAttachedToDocument(element: Element): boolean;
}
