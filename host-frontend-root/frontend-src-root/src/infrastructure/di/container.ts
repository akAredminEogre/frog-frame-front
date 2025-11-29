import { asClass, AwilixContainer, createContainer, InjectionMode } from 'awilix';

import { ContextMenuSetupUseCase } from 'src/application/usecases/contextmenu/ContextMenuSetupUseCase';
import { HandleContextMenuReplaceDomElement } from 'src/application/usecases/contextmenu/HandleContextMenuSelectionUseCase';
import { PopupInitFormUseCase } from 'src/application/usecases/popup/PopupInitFormUseCase';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { CloseCurrentWindowUseCase } from 'src/application/usecases/window/CloseCurrentWindowUseCase';
import { ChromePopupService } from 'src/infrastructure/browser/popup/ChromePopupService';
import { ChromeRuntimeService } from 'src/infrastructure/browser/runtime/ChromeRuntimeService';
import { ChromeCurrentTabService } from 'src/infrastructure/browser/tabs/ChromeCurrentTabService';
import { ChromeTabsService } from 'src/infrastructure/browser/tabs/ChromeTabsService';
import { ChromeWindowService } from 'src/infrastructure/browser/window/ChromeWindowService';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { SelectedPageTextRepository } from 'src/infrastructure/persistence/storage/SelectedPageTextRepository';
import { GetSelectionService } from 'src/infrastructure/windows/getSelectionService';

// Awilixコンテナを作成（CLASSIC modeでコンストラクタ引数名ベースのDI）
export const container: AwilixContainer = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

// Register infrastructure services (引数名ベースで登録)
container.register({
  // Infrastructure services - 引数名と同じ名前で登録
  tabsService: asClass(ChromeTabsService).singleton(),
  popupService: asClass(ChromePopupService).singleton(),
  rewriteRuleRepository: asClass(DexieRewriteRuleRepository).singleton(),
  windowService: asClass(ChromeWindowService).singleton(),
  selectedPageTextRepository: asClass(SelectedPageTextRepository).singleton(),
  currentTabService: asClass(ChromeCurrentTabService).singleton(),
  chromeRuntimeService: asClass(ChromeRuntimeService).singleton(),
  getSelectionService: asClass(GetSelectionService).singleton(),
  repository: asClass(DexieRewriteRuleRepository).singleton(),

  // UseCases - クラス名のcamelCase形式で登録
  handleContextMenuReplaceDomElement: asClass(HandleContextMenuReplaceDomElement).transient(),
  contextMenuSetupUseCase: asClass(ContextMenuSetupUseCase).transient(),
  loadRewriteRuleForEditUseCase: asClass(LoadRewriteRuleForEditUseCase).transient(),
  updateRewriteRuleUseCase: asClass(UpdateRewriteRuleUseCase).transient(),
  closeCurrentWindowUseCase: asClass(CloseCurrentWindowUseCase).transient(),
  saveRewriteRuleAndApplyToCurrentTabUseCase: asClass(SaveRewriteRuleAndApplyToCurrentTabUseCase).transient(),
  popupInitFormUseCase: asClass(PopupInitFormUseCase).transient(),

  // 具象クラスの直接解決用エイリアス（camelCase形式）
  chromeTabsService: asClass(ChromeTabsService).singleton(),
  chromeCurrentTabService: asClass(ChromeCurrentTabService).singleton(),
  dexieRewriteRuleRepository: asClass(DexieRewriteRuleRepository).singleton()
});
