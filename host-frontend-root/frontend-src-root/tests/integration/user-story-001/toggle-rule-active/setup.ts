/**
 * user-story-001 結合テスト セットアップファイル
 * fake-indexeddbを使用してIndexedDBをエミュレート
 */
import 'fake-indexeddb/auto';

import { IDBFactory } from 'fake-indexeddb';

// グローバルにfake-indexeddbをセットアップ
globalThis.indexedDB = new IDBFactory();
