# Material lite


## 詳細

”[Angular material](https://material.angular.io/)”のデザインをパクったコンポーネントです。

<br>

| 相違点 | AM | AM Lite |
| :-: | :-: | :-: |
| パフォーマンス |   | ◎ |
| カスタマイズ性 | ◎ |   |

きっかけは、”[Angular material](https://material.angular.io/)”を使用しているとき、
”Change detection”発生量が多いComponentがあることに気づき、"Change detection"を極力少なくし、もう少し軽量なライブラリが欲しくなったからです。<br>
”One action”につき、”One change detection”を目指して作成しています。

また、Reactにも **ほとんど** 同じ動作をするComponentsを提供できるよう制作しています。

（最終的な目標は npm に公開することです。Vue版の制作は検討中です。）


## 実装済み機能

| 名前 | Angular | React |
| --- | :-: | :-: |
| Ripple    | ✓ | ✓ |
| Button    | ✓ | ✓ |
