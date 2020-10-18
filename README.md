# Material lite


## 詳細

”[Angular material](https://material.angular.io/)”のデザインをパクったコンポーネントです。<br>

<br>

| 相違点 | AM | AM Lite |
| :-: | :-: | :-: |
| パフォーマンス |   | ◎ |
| カスタマイズ性 | ◎ |   |

<br>

きっかけは、[Angular material](https://material.angular.io/)をしているときの”Change detection”発生量がとても多かったため、"Change detection"を極力少なくしたライブラリが欲しくなったからです。<br>
”One action”につき、”One change detection”を目指して作成しています。

また、Reactにも **ほとんど** 同じ動作をするComponentsを提供できるよう制作しています。

（最終的な目標は npm に公開することです）


## 実装済み機能

| 名前 | Angular | React |
| --- | :-: | :-: |
| Ripple    | ✓ | ✓ |
| Button    | ✓ | ✓ |
