/**
 * chrome.tabs.Tab型のモックオブジェクトを生成する
 * @param id タブID（undefinedを許容）
 * @param url タブURL（undefinedを許容）
 * @returns chrome.tabs.Tab型のモックオブジェクト
 */
export const createMockTab = (id?: number, url?: string): chrome.tabs.Tab => {
  return {
    id,
    url,
    index: 0,
    pinned: false,
    highlighted: false,
    windowId: 1,
    active: false,
    incognito: false,
    selected: false,
    discarded: false,
    autoDiscardable: true,
    groupId: -1,
  } as chrome.tabs.Tab;
};
