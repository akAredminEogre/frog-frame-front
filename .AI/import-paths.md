# インポートパスルール

→ ルール詳細は [`.clinerules/01-coding-standards.md`](.clinerules/01-coding-standards.md) を参照（`src` 始まりの絶対パス使用）

## tsconfig.json パス設定

`host-frontend-root/frontend-src-root/tsconfig.json` に設定されたパスエイリアス:
- `src/*` → `./src/*`
- `tests/*` → `./tests/*`
- `entrypoints/*` → `./src/entrypoints/*`
