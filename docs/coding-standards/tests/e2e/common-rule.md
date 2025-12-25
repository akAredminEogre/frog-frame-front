# E2Eテスト共通ルール

## ディレクトリ構造
E2Eテストは機能ごとに作成し、docs/designのディレクトリ構造を踏襲した形で配置する。

```
tests/e2e/pages/{page-name}/features/{feature-name}/
└── {テスト観点}.spec.ts
```