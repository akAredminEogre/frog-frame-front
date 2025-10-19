import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';

// グローバルにfake-indexeddbをセットアップ
globalThis.indexedDB = new IDBFactory();
