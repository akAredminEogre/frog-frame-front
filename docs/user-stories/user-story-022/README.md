# User Story 022: ImportRulesJson - ブラウザAPI を F&D 専用モジュールへ抽出

## ストーリー

> ルールJSONインポート時に使用するブラウザ固有API（FileReader、File.size、Blob）を
> frameworks-and-drivers 層の専用モジュールに移動し、
> CA（クリーンアーキテクチャ）の依存方向ルールを完全に遵守してほしい

## 概要

`useImportRulesJson.ts` はカスタムフックでありながら、ブラウザ固有APIを直接使用していた:

| ブラウザAPI | 使用箇所 | 問題 |
|------------|---------|------|
| `new FileReader()` / `reader.readAsText()` | handleFileSelect (line 90-94) | F&D層のAPIが上位層なしで直接使用 |
| `file.size > 5 * 1024 * 1024` | handleFileSelect (line 84) | File.size APIをフック内で直接参照 |
| `new Blob([jsonString]).size` | handleFileSelect (line 98) | Blob APIをフック内で直接参照 |

これらのブラウザAPIはすでに `frameworks-and-drivers/` 層内のファイルに存在するが、
依存関係の逆転（DI）によるテスタビリティの向上と、
APIの変更・モック差し替えを容易にするため、専用クラスに抽出すべきである。

## 背景

PR#394 コードレビュー（GitHub）における殿（レビュアー）の指摘:

| コメントID | 対象行 | 指摘内容 |
|-----------|--------|---------|
| 2867019852 | line 98 (`new Blob([...]).size`) | 「frameworksanddriversにモジュールを作って対応してください」 |
| 2867020655 | line 86 (`file.size > 5 * 1024 * 1024`) | 「ファイルを扱うモジュールをframeworksanddrivers層に作成して対応するようにしてください」 |
| 2867021390 | line 95 (`reader.readAsText(file)`) | 「ファイルを扱うモジュールをframeworksanddrivers層に作成して対応するようにしてください」 |

JsonParser（JSON.parse のラッパー）と同様のパターンで、
ブラウザAPIごとに port interface + F&D 実装クラスを作成し、DI コンテナで管理する。

## 実装内容

### 新規作成ファイル

#### Service Port (ABR/ports/services/)

```typescript
// IFileTextReader.ts
export interface IFileTextReader {
  readAsText(file: File): Promise<string>;
}

// IFileSizeValidator.ts
export interface IFileSizeValidator {
  isExceedingMaxSize(file: File): boolean;
  readonly maxSizeBytes: number;
}

// IByteSizeCalculator.ts
export interface IByteSizeCalculator {
  calculateByteSize(text: string): number;
}
```

#### F&D 実装 (frameworks-and-drivers/File/)

```typescript
// FileTextReader.ts - FileReader.readAsText をラップ
export class FileTextReader implements IFileTextReader {
  readAsText(file: File): Promise<string> { ... }
}

// FileSizeValidator.ts - File.size チェックをラップ（上限 5MB）
export class FileSizeValidator implements IFileSizeValidator {
  readonly maxSizeBytes = 5 * 1024 * 1024;
  isExceedingMaxSize(file: File): boolean { ... }
}

// BlobByteSizeCalculator.ts - Blob API によるバイト計算をラップ
export class BlobByteSizeCalculator implements IByteSizeCalculator {
  calculateByteSize(text: string): number { ... }
}
```

### 修正ファイル

- `di/container.ts`: 3モジュールを DI コンテナに登録（`IFileTextReader`, `IFileSizeValidator`, `IByteSizeCalculator` トークン）
- `useImportRulesJson.ts`: `useMemo` で 3モジュールを解決し、`handleFileSelect` で使用

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
