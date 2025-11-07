workflow-code-according-to-the-rules

```cline-instructions
コーディングの際には
.clinerules/01-coding-standards.md
.clinerules/03-test-standards.md
.clinerules/03-test-coding-standards(ディレクトリ)
.clinerules/05-project-specific-rules.md
を参照しながら進めてください。

## テスト実装時の重要原則
テスト実装時は最初からプロジェクトのテスト規約を適用してください：
- **Abendディレクトリ使用**: 異常系テストは必ずAbendディレクトリに配置
- **describe分離**: テストケースは適切にdescribeで分離・整理
- **配列ベーステスト**: 共通パターンのテストは配列ベース実装を検討

## YAGNI原則の適用
設計・実装時にはYAGNI原則を重視してください：
- 不要な機能（デバッグ用メソッド、未使用インターフェース等）は最初から作らない
- Strategy Pattern等の設計パターン適用時は、過度な抽象化を避けシンプルなアプローチを優先
- 投機的な実装（将来必要になるかもしれない機能）は避ける

実装が完了したら
workflow-test-check-before-complete
のワークフローを必ず行ってください。
```
