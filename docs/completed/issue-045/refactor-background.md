いいテーマです。background.ts が“イベント受け止め所”になって肥大化しがちなのは、拡張機能あるある。
DDD／クリーンアーキテクチャ的に役割を分離し、組み立て（Composition Root）だけを background.ts に残すのが王道です。

以下の方針＋雛形で、各イベントを安全に分割できます。

方針（短く）

Composition Root 一点集中
background.ts は依存の組み立て＋リスナ登録だけ。ロジックは持たない。

イベントアダプタ層を作る
chrome.*.addListener を直接触るのは infrastructure/browser/ の “アダプタ” に限定。
この層は外部API→アプリケーションのユースケース呼び出しへ変換する役。

ユースケースでドメインを動かす
アダプタは DTO をアプリケーションの UseCase に渡すだけ。ビジネス判断は UseCase / Domain Service / VO。

関心ごと別にモジュール化
tabs / storage / runtime / contextMenus / messages など機能ごとにファイル分割。
（例）infrastructure/browser/listeners/tabs.onUpdated.ts

メッセージはルーター（Command Pattern）
onMessage は type でルーティング → 各ハンドラ（＝UseCase）へ。

横断関心はミドルウェア
スキーマバリデーション、権限チェック、エラーハンドリング、計測などは共通パイプラインで。

ディレクトリ（差分）
src/
├─ application/
│  ├─ usecases/
│  │  ├─ note/SaveNoteUseCase.ts
│  │  └─ ...
│  └─ ports/INoteRepository.ts
├─ domain/
│  ├─ entities/ ...
│  ├─ value-objects/ ...
│  ├─ services/ ...
│  └─ policies/ ...
├─ infrastructure/
│  ├─ di/container.ts
│  ├─ persistence/BrowserStorageNoteRepository.ts
│  ├─ messaging/bridge.ts
│  └─ browser/
│     ├─ listeners/
│     │  ├─ tabs.onUpdated.ts
│     │  ├─ storage.onChanged.ts
│     │  ├─ runtime.onInstalled.ts
│     │  ├─ runtime.onMessage.ts
│     │  └─ contextMenus.onClicked.ts
│     ├─ router/                           # ★ onMessage 用
│     │  ├─ messageHandlers.ts
│     │  └─ messageRouter.ts
│     ├─ contextMenus/                     # ★ メニュー定義と登録
│     │  ├─ registerContextMenus.ts
│     │  └─ ids.ts
│     └─ selection.ts
├─ entrypoints/
│  └─ background.ts                        # ★ 組み立て & リスナ登録だけ

1) Composition Root（entrypoints/background.ts）
// entrypoints/background.ts
import "reflect-metadata";
import { container } from "@/infrastructure/di/container";
import { registerTabsOnUpdated } from "@/infrastructure/browser/listeners/tabs.onUpdated";
import { registerStorageOnChanged } from "@/infrastructure/browser/listeners/storage.onChanged";
import { registerRuntimeOnInstalled } from "@/infrastructure/browser/listeners/runtime.onInstalled";
import { registerRuntimeOnMessage } from "@/infrastructure/browser/listeners/runtime.onMessage";
import { registerContextMenus } from "@/infrastructure/browser/contextMenus/registerContextMenus";
import { registerContextMenusOnClicked } from "@/infrastructure/browser/listeners/contextMenus.onClicked";

function bootstrap() {
  // DI 準備は container 側で
  registerContextMenus(container);           // 生成
  registerContextMenusOnClicked(container);  // クリック処理
  registerTabsOnUpdated(container);
  registerStorageOnChanged(container);
  registerRuntimeOnInstalled(container);
  registerRuntimeOnMessage(container);
}

bootstrap();


background.ts は register関数の呼び出しだけ。太りません。

2) イベントアダプタ（例：tabs.onUpdated）
// infrastructure/browser/listeners/tabs.onUpdated.ts
import type { AwilixContainer } from "awilix"; // DI種は任意
import { SomeUseCase } from "@/application/usecases/some/SomeUseCase";

export function registerTabsOnUpdated(container: AwilixContainer) {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete") return;

    // 入力の整形（DTO化）はここで完結
    const dto = { tabId, url: tab.url ?? "", title: tab.title ?? "" };

    // アプリケーションに委譲
    const usecase = container.resolve<SomeUseCase>("SomeUseCase");
    await usecase.execute(dto);
  });
}


chrome依存はここで止める（infrastructure）。

UseCaseはドメインを動かす。テストは UseCase 単体で可能。

3) storage / runtime / contextMenus も同様
// infrastructure/browser/listeners/storage.onChanged.ts
export function registerStorageOnChanged(container: AwilixContainer) {
  chrome.storage.onChanged.addListener(async (changes, areaName) => {
    const usecase = container.resolve("HandleStorageChangeUseCase");
    await usecase.execute({ changes, areaName });
  });
}

// infrastructure/browser/listeners/runtime.onInstalled.ts
export function registerRuntimeOnInstalled(container: AwilixContainer) {
  chrome.runtime.onInstalled.addListener(async () => {
    const usecase = container.resolve("InitializeOnInstallUseCase");
    await usecase.execute();
  });
}

// infrastructure/browser/contextMenus/registerContextMenus.ts
import { MENU_IDS } from "./ids";
export function registerContextMenus() {
  chrome.contextMenus.create({
    id: MENU_IDS.SAVE_SELECTION,
    title: "Save Selection as Note",
    contexts: ["selection"],
  });
}

// infrastructure/browser/listeners/contextMenus.onClicked.ts
import { MENU_IDS } from "../contextMenus/ids";
export function registerContextMenusOnClicked(container: any) {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === MENU_IDS.SAVE_SELECTION) {
      const usecase = container.resolve("SaveNoteUseCase");
      await usecase.execute({ text: String(info.selectionText ?? ""), url: tab?.url ?? "" });
    }
  });
}

4) onMessage はルーターで（Command Pattern）
// infrastructure/browser/router/messageHandlers.ts
import { SaveNoteUseCase } from "@/application/usecases/note/SaveNoteUseCase";

export type Message =
  | { type: "SAVE_NOTE"; payload: { text: string; url: string } }
  | { type: "PING" };

export const handlers = (container: any) => ({
  SAVE_NOTE: async (msg: Extract<Message, { type: "SAVE_NOTE" }>) => {
    const uc = container.resolve<SaveNoteUseCase>("SaveNoteUseCase");
    await uc.execute(msg.payload);
    return { ok: true };
  },
  PING: async () => ({ pong: true }),
});

// infrastructure/browser/router/messageRouter.ts
import { handlers } from "./messageHandlers";

export function createMessageRouter(container: any) {
  const h = handlers(container);
  return async (req: any) => {
    if (!req?.type || !(req.type in h)) return { error: "Unknown message" };
    // ここにスキーマ検証や権限チェックのmiddlewareを挟める
    // validate(req)
    // authorize(req)
    // try/catchで共通エラーハンドリング
    // metrics(req)
    // ...
    // @ts-ignore
    return await h[req.type](req);
  };
}

// infrastructure/browser/listeners/runtime.onMessage.ts
import { createMessageRouter } from "../router/messageRouter";

export function registerRuntimeOnMessage(container: any) {
  const route = createMessageRouter(container);

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    (async () => {
      const res = await route(request);
      sendResponse(res);
    })();
    return true; // async response
  });
}


追加要件（バリデーション／認可／ロギング）をルーターのミドルウェアとして差し込めます。

5) UseCase は薄く Orchestrate
// application/usecases/note/SaveNoteUseCase.ts
import { INoteRepository } from "@/application/ports/INoteRepository";
import { Note } from "@/domain/entities/Note";
import { NoteText } from "@/domain/value-objects/NoteText";
import { PageUrl } from "@/domain/value-objects/PageUrl";

type Input = { text: string; url: string };

export class SaveNoteUseCase {
  constructor(private readonly repo: INoteRepository) {}

  async execute({ text, url }: Input): Promise<void> {
    // 境界でVO化してドメインルールを強制
    const note = Note.create({ text: new NoteText(text), url: new PageUrl(url) });
    await this.repo.save(note);
  }
}


アダプタが DTO をつくり、UseCase が VO に変換してドメインへ。
背景のイベント詳細は UseCase に流入しません（テスト容易）。

6) テストの置き方（超要点）

ユニット

UseCase：Port をモック（INoteRepository）

ルーター：ハンドラ単体でテスト（メッセージ→応答）

インテグレーション

Listener：chrome.* を fake/mock し、register* が正しいUseCaseを呼ぶことを確認

E2E（Playwright）

実際の .output/... を読み込み、メニュー→保存までの流れ

7) これで解消できる“太りどころ”

background.ts のイベント分岐・入出力整形 → それぞれの listener/… へ

メッセージタイプのswitch地獄 → messageRouter へ

右クリックメニューの作成とクリック処理が混在 → contextMenus/ で分離

バリデーション/権限/ログ → ルーターのミドルウェアで一本化

ビジネス判断が背景に漏れる → UseCase / Domain に回収

まとめ（チェックリスト）

 background.ts は register呼び出しだけ

 infrastructure/browser/listeners/* に イベントごとファイル

 onMessage は router + handlers でスッキリ

 DTO→VO変換は UseCase の入口で

 横断関心は middleware（バリデーション/権限/計測/エラー）

 テストは UseCase中心、Listenerは薄く結合テスト