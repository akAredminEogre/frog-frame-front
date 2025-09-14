import { handlers } from 'src/infrastructure/browser/router/messageHandlers';

export function createMessageRouter() {
  return async (message: any) => {
    if (!message?.type || !(message.type in handlers)) {
      return { error: 'Unknown message' };
    }
    
    // ここにスキーマ検証や権限チェックのmiddlewareを挟める
    // validate(message)
    // authorize(message)
    // try/catchで共通エラーハンドリング
    // metrics(message)
    
    try {
      // @ts-ignore - Dynamic handler access
      const messageType = message.type;
      // @ts-ignore - Dynamic handler access
      const handler = handlers[messageType];
      const result = await handler(message);
      return result;
    } catch (error: any) {
      console.error('[messageRouter] Error handling message:', error);
      return { error: error.message };
    }
  };
}
