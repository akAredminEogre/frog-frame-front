import { handlers } from 'src/infrastructure/browser/router/content/messageHandlers';

/**
 * Content script用のメッセージルーター
 * 受信したメッセージを適切なハンドラにルーティングする
 *
 * 呼び出し経路:
 * content.ts → registerRuntimeOnMessageForContent → createContentMessageRouter → 各ハンドラー
 */
export function createContentMessageRouter() {

  return async (message: any) => {
    if (!message?.type || !(message.type in handlers)) {
      return { error: 'Unknown message' };
    }

    try {
      // @ts-ignore - Dynamic handler access
      const messageType = message.type;
      // @ts-ignore - Dynamic handler access
      const handler = handlers[messageType];
      const result = await handler(message);
      return result;
    } catch (error: any) {
      console.error('[contentMessageRouter] Error handling message:', error);
      return { error: error.message };
    }
  };
}
