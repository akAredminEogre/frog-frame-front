/**
 * ping message handler
 * ヘルスチェック用のpingメッセージに対してpongを返す
 */
export const pingHandler = async () => ({ pong: true });