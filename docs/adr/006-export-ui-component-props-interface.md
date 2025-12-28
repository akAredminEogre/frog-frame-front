# ADR-006: UIコンポーネントのPropsインターフェースをエクスポートする

## ステータス

採用

## コンテキスト

ReactのUIコンポーネントでは、Propsの型定義（インターフェース）をエクスポートするかどうかの選択肢がある。

```typescript
// エクスポートしない場合
interface ButtonProps {
  onClick: () => void;
}
export const Button: React.FC<ButtonProps> = ...

// エクスポートする場合
export interface ButtonProps {
  onClick: () => void;
}
export const Button: React.FC<ButtonProps> = ...
```

### 検討した観点

1. **エクスポートする利点**
   - 親コンポーネントやラッパーコンポーネントで型を参照できる
   - Storybookのargsで型を明示できる
   - 型の再利用性が向上する
   - 大規模コンポーネントライブラリ（MUI、Chakra UI、Radix UI等）での一般的なパターン

2. **エクスポートしない利点**
   - 公開APIを最小限に保てる
   - `React.ComponentProps<typeof Button>` で型取得可能なため必須ではない

3. **エクスポートのデメリット**
   - 実質的なデメリットはほぼない
   - エクスポートした型は「公開契約」となるが、アプリ内部コンポーネントでは実質的な問題にならない

## 決定

**今後作成するUIコンポーネントでは、Propsインターフェースをエクスポートする。**

```typescript
// 推奨パターン
export interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ ... }) => {
  ...
};
```

### 既存コンポーネントの対応

以下の既存コンポーネントは本ADR採用以前に作成されたため、Propsインターフェースがエクスポートされていない：

| コンポーネント | 配置 |
|---------------|------|
| ToggleSwitch | `src/frameworks-and-drivers/ui/components/atoms/` |
| DeleteButton | `src/frameworks-and-drivers/ui/components/atoms/DeleteButton/` |
| ConfirmDialog | `src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/` |
| ToastNotification | `src/frameworks-and-drivers/ui/components/atoms/ToastNotification/` |

これらは以下のいずれかのタイミングで対応する：

1. 該当コンポーネントに変更が加わる際に合わせて対応
2. 別途リファクタリングタスクとして対応

## 理由

1. **一貫性**: 全コンポーネントで統一されたパターンを使用する
2. **型の再利用性**: 必要に応じて親コンポーネントで型を参照できる
3. **デメリットの少なさ**: エクスポートによる実質的なデメリットがない
4. **業界標準との整合**: 主要なコンポーネントライブラリと同じパターン

## 影響ドキュメント

このADRが変更された場合、以下のドキュメントも更新が必要：

- なし

## 関連ドキュメント

- なし
