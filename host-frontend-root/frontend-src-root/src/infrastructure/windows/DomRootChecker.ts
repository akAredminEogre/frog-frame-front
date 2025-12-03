import { IDomRootChecker } from 'src/domain/ports/IDomRootChecker';

/**
 * DOMルート要素（document, document.body）の判定を行うインフラストラクチャサービス。
 * documentおよびdocument.bodyへの直接アクセスをカプセル化し、テスト容易性を向上させます。
 * IDomRootCheckerインターフェースを実装し、依存性の逆転の原則に従います。
 */
export class DomRootChecker implements IDomRootChecker {
  /**
   * 指定されたノードがDOMルート要素（documentまたはdocument.body）かどうかを判定します。
   * @param node 判定対象のノード。
   * @returns documentまたはdocument.bodyの場合はtrue。
   */
  public isDocumentRoot(node: Node): boolean {
    return node === document || node === document.body;
  }
}
