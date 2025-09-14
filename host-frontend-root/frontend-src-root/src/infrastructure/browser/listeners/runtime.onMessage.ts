import { createMessageRouter } from 'src/infrastructure/browser/router/messageRouter';

/**
 * 呼び出し元: entrypoints/background.ts
 * 
 * runtime.onMessageリスナーを登録し、メッセージをルーティングする
 */
export function registerRuntimeOnMessage() {
  const route = createMessageRouter();

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    (async () => {
      const messageRequest = request;
      const routingResult = await route(messageRequest);
      sendResponse(routingResult);
    })();
    return true; // async response
  });
}
