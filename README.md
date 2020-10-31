# Material lite


## 詳細

[`Angular material`](https://material.angular.io/)のデザインをパクったコンポーネントです。
<br>

| 相違点 | Material lite | Angular material |
| :-: | :-: | :-: |
| パフォーマンス | ◎ |   |
| カスタマイズ性 |    | ◎ |

きっかけは、[`Angular material`](https://material.angular.io/)を使用しているとき、
`Change detection`発生量が多いコンポーネントがあることに気づき、`Change detection`を極力少なくし、もう少し軽量なライブラリが欲しくなったからです。<br>
`One action`につき`One change detection`を目指して作成しています。

また、`React`にも **ほとんど** 同じ動作をする`Components`を提供できるよう制作しています。<br>
進行優先順位は基本、`Angular` => `React` としています。 

（最終的な目標は `npm`に公開することです。`Vue`版の制作は検討中です。）



## 依存関係

依存関係は極力作らないように努めています。

### Angular
(`angular-cLI`を使用) <br>
・なし

### React
(`react-create-app`を使用) <br>
・ node-sass


## 機能一覧

(一部、完成しているが未だにこっちのリポジトリにコードを移行していない)

- (名前) - 実装しないかもしれないコンポーネント
- ✓ - 完成
- Δ - 完成に近づいているが課題・問題あり

| 名前 | Angular | React |
| --- | :-: | :-: |
| Autocomplete     |   |   |
| Badge            |   |   |
| Bottom sheet     |   |   |
| Button           | ✓ | ✓ |
| Button toggle    |   |   |
| Card             |   |   |
| (Datepicker)     |   |   |
| Dialog           | △ |   |
| Divider          |   |   |
| Expansion panel  |   |   |
| Form field       |   |   |
| (Grid list)      |   |   |
| Header           |   |   |
| Icon             | ✓ |   |
| List             |   |   |
| Nav              | ✓ |   |
| Menu             |   |   |
| Paginator        |   |   |
| Progress bar     |   |   |
| Progress spinner |   |   |
| Radio button     |   |   |
| Ripple           | ✓ | ✓ |
| Select           |   |   |
| Slider           |   |   |
| Snackbar         |   |   |
| Stepper          |   |   |
| (Sort header)    |   |   |
| Table            |   |   |
| Tabs             | △ |   |
| Toolbar          |   |   |
| Tooltip          |   |   |
