# 受け入れ条件 - User Story 022

## 機能要件

- [ ] `IFileTextReader` インターフェースが `application-business-rules/ports/services/` に存在する
- [ ] `IFileSizeValidator` インターフェースが `application-business-rules/ports/services/` に存在する
- [ ] `IByteSizeCalculator` インターフェースが `application-business-rules/ports/services/` に存在する
- [ ] `FileTextReader` クラスが `frameworks-and-drivers/File/` に存在し、`IFileTextReader` を実装する
- [ ] `FileSizeValidator` クラスが `frameworks-and-drivers/File/` に存在し、`IFileSizeValidator` を実装する（上限 5MB）
- [ ] `BlobByteSizeCalculator` クラスが `frameworks-and-drivers/File/` に存在し、`IByteSizeCalculator` を実装する
- [ ] 3モジュールが DI コンテナ (`di/container.ts`) に登録されている（`IFileTextReader`, `IFileSizeValidator`, `IByteSizeCalculator` トークン）
- [ ] `useImportRulesJson.ts` の `handleFileSelect` がブラウザAPI（FileReader, File.size, Blob）を直接使用していない
- [ ] `useImportRulesJson.ts` が DI コンテナ経由で 3モジュールを解決して使用している

## 品質要件

- [ ] TypeScript 型チェック（`tsc --noEmit`）がエラーなしで通る
- [ ] PR#394 コードレビューコメント（id: 2867019852, 2867020655, 2867021390）への返信が完了している
