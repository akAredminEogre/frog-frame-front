# 概要
<!-- このチケットで解決したい課題 -->
export function replaceInNodeがファットになってきたので、CODING_STYLE.mdのDomainオブジェクトにする。

## 関連リンク

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->
- [ ] replaceInNodeの実装がDomainオブジェクトに移行されていること
```
制約: このレイヤーは、純粋なTypeScriptで記述され、WXTやブラウザAPI、UIフレームワーク、その他の外部ライブラリへの依存を一切持ちません。完全に独立した、アプリケーションの心臓部です。
```
- [ ] replaceInNodeのユニットテストが存在し、すべてのテストがパスすること

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->
- 現時点で、すべてのコードをCODING_STYLE.mdのディレクトリ構造に従わせる必要はない。今回の開発に絞った範囲でディレクトリ・アーキテクチャを移行するのみでよい
- wxt.config.tsの`srcDir: 'src'`を設定することになるが、今回このディレクトリに移動するのは最小限にとどめたい。言い換えれば、現時点ではfrog-frame-front/host-frontend-root/frontend-src-root/entrypointsとその中身はそのままにしておきたいが、そんなことが可能なのか。

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->
- [x]`wxt.config.ts`で`srcDir: 'src'`を設定し、  
`src`ディレクトリ以下にレイヤーごとのフォルダを配置する
- [x] replaceInNodeの実装をDomainオブジェクトに移行する
- [x] replaceInNodeのユニットテストを作成する
- [x] `@/src/domain/entities/NodeTextReplacer`を使用するように、`content.ts`を修正する

# 成果物
<!-- PR以外の成果物のリンクを記載 -->


# 振り返り
<!-- チケットを進める過程で発生したトラブル等 -->
