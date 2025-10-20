# 概要
<!-- このチケットで解決したい課題 -->
chromeの開発者機能から、「パッケージ化されていない拡張機能を読み込む」からこの拡張機能を読み込んだ際にエラーが出ます

```
ChromeCurrentTabService.ts:47 [ChromeCurrentTabService] Creating CurrentTab with tabId: 1488295989, url: chrome://extensions/
ChromeTabsService.ts:43 [ChromeTabsService] sendApplyAllRulesMessage error: Error: Could not establish connection. Receiving end does not exist.
sendApplyAllRulesMessage @ ChromeTabsService.ts:43
ChromeCurrentTabService.ts:47 [ChromeCurrentTabService] Creating CurrentTab with tabId: 1488295989, url: chrome://extensions/?errors=bdgnfbfnmjofkhbooelohnpgcoieiclh
ChromeTabsService.ts:43 [ChromeTabsService] sendApplyAllRulesMessage error: Error: Could not establish connection. Receiving end does not exist.
sendApplyAllRulesMessage @ ChromeTabsService.ts:43

```
拡張機能として満たすべき要件があるのかもしれませんが、調査と対応をお願いします。



## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->