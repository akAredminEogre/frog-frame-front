# 02-sequence.puml ルール

01-class-design.md を実現するシーケンス図をPlantUML形式で記載するドキュメント。

## 必須要素

| 要素 | 必須 | 説明 |
|------|------|------|
| 参加者（participant） | ○ | 各層のクラス/コンポーネント |
| メッセージ | ○ | クラス間の呼び出し（メソッド名含む） |
| 戻り値 | ○ | 処理結果の返却 |
| 注釈 | △ | 必要に応じて補足説明 |

## 01-class-design.md との整合性

**重要**: 01-class-design.md と整合性を保つこと

- **01-class-design.md のクラス一覧に記載した全てのクラス/型を participant として含めること**
  - Interface（IToggleRuleActiveUseCase 等）
  - 具象クラス（ToggleRuleActiveInteractor 等）
  - DTO（ToggleRuleActiveInputData, ToggleRuleActiveOutputData, RewriteRuleDTO 等）
  - Entity（RewriteRule）
- クラス設計で定義したメソッドがシーケンス図に反映されていること
- 層の境界を明確に示すこと

## 命名規則
- participant名
  - クラス名をそのまま使用（例: ToggleRuleActiveInteractor）
    - participant名に注釈や補足説明をしない

## note（注釈）の使用ルール

**インスタンス生成やメソッド呼び出しは、note（注釈）ではなくシーケンス図の記法で表現すること**

- ✅ `MessagingRepo -> Entity : fromDTO(dto)` （メソッド呼び出しとして表現）
- ❌ `note over MessagingRepo : DTOからEntity再構築` （処理内容を注釈で説明）

注釈は「なぜそうするか」の補足説明に限定し、「何をするか」はシーケンス図で表現する

### 例外: View層の状態管理

**View層（React コンポーネント）における状態管理チェックは note での表現を許容する**

React の useState による競合防止チェック等は、ドメインロジックではなくフレームワーク固有の状態管理であるため、
メソッド呼び出しとして表現することが不自然な場合がある。

- ✅ `note over View : togglingIds.has(ruleId) の場合は早期リターン` （状態チェックを注釈で説明）
- ❌ `View -> View : validateNotToggling()` （実装に存在しないメソッドを表現）

**理由**: React の関数コンポーネント内での useState を使った状態チェックは、クラスメソッドではなく
関数内のローカルな条件分岐であり、シーケンス図のメソッド呼び出しとして表現すると実装と乖離する

## Chrome拡張機能固有のルール

- **interface-adapters/gateways/messaging 以下のクラスも忘れずに設計に含めること**
  - Chrome拡張機能では popup/rules ↔ background 間の通信が必要

## 抽象インターフェースの扱い

**Iで始まる抽象インターフェースもシーケンス図に含めること**

- Input Port（例: IToggleRuleActiveUseCase）
- Output Port（例: IToggleRuleActivePresenter）
- Gateway Interface（例: IRewriteRuleRepository, ITabsGateway）
- 依存性逆転の原則を明示するため、具象クラスではなくインターフェースへの依存を示す
- **01-class-design.md のクラス一覧に記載した全ての Interface を漏れなく含めること**

## 複数実行コンテキストの扱い

**複数の実行コンテキスト（Rules Page, Background Script等）がある場合、各コンテキスト内のクラスも Clean Architecture 層で分類すること**

- 例: Background Script 内でも frameworks-and-drivers 層と interface-adapters 層を区別する
