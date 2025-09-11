import type { SimpleContainer } from 'src/infrastructure/di/container';
import { createMessageRouter } from 'src/infrastructure/browser/router/messageRouter';

export function registerRuntimeOnMessage(container: SimpleContainer) {
  const route = createMessageRouter(container);

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    (async () => {
      const messageRequest = request;
      const routingResult = await route(messageRequest);
      sendResponse(routingResult);
    })();
    return true; // async response
  });
}
