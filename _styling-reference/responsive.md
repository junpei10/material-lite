# 草案 - 1

・設定する要素
- Breakpoint
- 倍率


## 概要

`Breakpoint`とその範囲のときの`倍率`を設定すれば、ある程度のResponsiveに対応できるのでは？


## 例

通常、ボタンコンポーネントには`padding: 0 16px;`がついている。  
`Breakpoint: 0px ~ 400px, 倍率: 0.5`を設けた場合、  
windowのwidthが`0px ~ 400px`の間、ボタンコンポーネントには`padding: 0 8px`がつくようになるようにする。

---
<br>

# 草案 - 2

・設定する要素
- sm, md, lg の三種類のBreakpoint

## 概要

予め３種類のStyleを設定しておき、３種類を切り分ける。