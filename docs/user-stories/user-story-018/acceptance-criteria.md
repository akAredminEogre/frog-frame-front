# 受け入れ条件

## ユーザーストーリー要件

- [ ] AC-1: `IImportRulesJsonUseCase.previewImport()` が `ImportRulesJsonInputData` を引数として受け取る
- [ ] AC-2: `ImportRulesJsonController.execute()` が `ImportRulesJsonInputData` を引数として受け取る
- [ ] AC-3: `ImportRulesJsonInputData` が実際にデータ転送に使用されている（未使用 DTO でない）
- [ ] AC-4: インポート機能の動作（プレビュー表示・確定インポート）が変更前と同一である

## 技術要件

- [ ] AC-5: 他の UseCase/Controller（例: `ExportRulesJsonUseCase`）と同じ InputData 注入パターンを採用している
- [ ] AC-6: `ImportRulesJsonInputData` に必要なフィールドが適切に定義されている（`jsonString` 等）
- [ ] AC-7: Clean Architecture の層構造が維持されている（UI 層が InputData を生成し Controller に渡す）
- [ ] AC-8: 影響を受ける全クラスのユニットテストが更新・通過している
- [ ] AC-9: 既存の E2E テスト（正常系インポートフロー）がすべて通過する
