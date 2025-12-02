# Naming Rule (命名規則)

## 概要
本ドキュメントは、Clean Architectureの4層構造における命名規則を定義します。

## 適用対象ディレクトリ
以下のディレクトリ内でこの命名規則を適用します：
- `src/enterprise-business-rules/`
- `src/application-business-rules/`
- `src/interface-adapters/`
- `src/frameworks-and-drivers/`

## 命名規則

### 1. ディレクトリ名・フォルダ名
**ケバブケース（kebab-case）**を使用します。

例：
- `user-management/`
- `data-processing/`
- `auth-service/`
- `value-objects/`

### 2. ファイル名

#### TypeScriptファイル
**用途に応じて使い分け**：

- **Reactコンポーネント**: パスカルケース
  - `UserProfile.tsx`
  - `LoginForm.tsx`

- **クラス定義ファイル**: パスカルケース
  - `UserEntity.ts`
  - `AuthService.ts`

- **その他のファイル**: キャメルケース
  - `userHelpers.ts`
  - `dataUtils.ts`

#### テストファイル
対象ファイル名に`.test`を追加：
- `UserEntity.test.ts`
- `authService.test.ts`

### 3. コード内の命名規則

#### クラス名
**パスカルケース（PascalCase）**を使用します。

```typescript
class UserEntity { }
class AuthenticationService { }
```

#### インターフェース・型定義
**パスカルケース（PascalCase）**を使用します。
インターフェースには`I`プレフィックスを付けます。

```typescript
interface IUserRepository { }
type UserProfile = { }
enum UserRole { }
```

#### 変数名・関数名
**キャメルケース（camelCase）**を使用します。

```typescript
const userName = "John";
const getUserData = () => { };
const handleClick = () => { };
```

#### 定数
**アッパースネークケース（UPPER_SNAKE_CASE）**を使用します。

```typescript
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";
```

## Clean Architecture層別の詳細規則

### Enterprise Business Rules層
- エンティティクラス: `UserEntity.ts`（パスカルケース）
- 値オブジェクト: `EmailAddress.ts`（パスカルケース）
- ディレクトリ: `entities/`, `value-objects/`（ケバブケース）

### Application Business Rules層
- ユースケース: `CreateUserUseCase.ts`（パスカルケース）
- ポート（インターフェース）: `IUserRepository.ts`（パスカルケース、Iプレフィックス）
- ディレクトリ: `use-cases/`, `ports/`（ケバブケース）

### Interface Adapters層
- コントローラー: `UserController.ts`（パスカルケース）
- プレゼンター: `UserPresenter.ts`（パスカルケース）
- ゲートウェイ: `UserGateway.ts`（パスカルケース）
- ディレクトリ: `controllers/`, `presenters/`, `gateways/`（ケバブケース）

### Frameworks and Drivers層
- 実装クラス: `ChromeStorageRepository.ts`（パスカルケース）
- 設定ファイル: `databaseConfig.ts`（キャメルケース）
- ディレクトリ: `web/`, `database/`, `external-services/`（ケバブケース）

## 注意事項

1. **既存コードとの整合性**
   - 既存のプロジェクトコードとの整合性を保ちながら、段階的に本規則を適用します

2. **フレームワーク固有の規則**
   - React、WXTなどのフレームワーク固有の命名規則がある場合は、それらを優先します

3. **Linterによる強制**
   - ESLintの設定により、これらの命名規則を自動的に検証します

## 参考
- Clean Architecture (Robert C. Martin)
- TypeScript Style Guide
- React Naming Conventions