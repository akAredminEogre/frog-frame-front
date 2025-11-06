import { createContentMessageRouter } from 'src/infrastructure/browser/router/content/messageRouter';

/**
 * 呼び出し元: entrypoints/content.ts
 *
 * Content Script用のruntime.onMessageリスナーを登録し、メッセージをルーティングする
 */
export function runtimeOnMessageReceived() {
  const route = createContentMessageRouter();

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    (async () => {
      const messageRequest = request;
      const routingResult = await route(messageRequest);
      sendResponse(routingResult);
    })();
    return true; // async response
  });
}