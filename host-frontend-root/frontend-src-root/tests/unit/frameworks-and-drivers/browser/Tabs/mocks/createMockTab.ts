/**
 * chrome.tabs.Tab型のモックオブジェクトを生成する
 * Tabsクラスが使用するプロパティ（id, url）のみを設定
 * @param id タブID（undefinedを許容）
 * @param url タブURL（undefinedを許容）
 * @returns chrome.tabs.Tab型のモックオブジェクト
 */
export const createMockTab = (id?: number, url?: string): chrome.tabs.Tab => {
  return { id, url } as chrome.tabs.Tab;
};
