import { DomMutationObserverService } from 'src/infrastructure/browser/content/mutation/DomMutationObserverService';
import { runtimeOnMessageReceived } from 'src/infrastructure/browser/content/runtime/onMessageReceived';
import { matchUrl } from 'src/utils/matchUrl';


export default defineContentScript({
  matches: process.env.NODE_ENV === 'development'
    ? matchUrl  // 開発時は特定URLのみ（リロード負荷を軽減）
    : ['*://*/*'],             // 本番時は全URL対応
  // injection: 'document_idle', // 必要に応じてタイミングを指定

  main() {
    // メッセージ受信リスナーを登録
    runtimeOnMessageReceived();

    // DOM更新を監視してrewrite rulesを適用する
    const mutationObserverService = new DomMutationObserverService(window.location.href);
    mutationObserverService.startObserving();
  },
});
