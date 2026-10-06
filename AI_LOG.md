# AI 協作紀錄｜Ame 雨音 貼紙手帳

格式依作業要求：**Prompt → AI Output → 修改 → 最終成果**。
「AI Output」欄已經由 AI 填好（含 Git commit 編號）；「修改」與「最終成果」請你自己填。每個階段至少改一處，並寫下原因。

> 誠實標示：本網站作品圖由 AI 生成；網站程式由 Claude（Anthropic）依照下方提示詞產生第一版，之後由學生修改。

---

## 0. 前期協作（設計方向）

| 項目 | 內容 |
| --- | --- |
| Prompt | 上傳作業 PDF，請 AI 整理要求；選定主題 B（藝術家作品集）、日系拼貼手帳風；上傳 9 張 AI 生成的角色插畫作為作品 |
| AI Output | 整理作業重點；提出「少女貼紙拼貼」視覺方向；建議以 4 位角色當分類，每位角色一組主題色；寫出 7 階段提示詞文件 |
| 我的決定 | （例：選擇以角色分類而不是畫風分類，因為……） |

---

## 階段 1｜設計概念

| 項目 | 內容 |
| --- | --- |
| Prompt | 見提示詞文件「階段 1」 |
| AI Output | `css/base.css` 開頭的設計變數：方格紙底、墨線、腮紅粉、四組角色主題色；字體 LXGW WenKai TC（標題）、Noto Sans TC（內文）、Caveat（英文手寫）；元件：白邊貼紙、格紋紙膠帶、便條紙、貼紙按鈕 |
| 修改 | |
| 最終成果 | （Figma 設計稿截圖） |

## 階段 2｜網站架構與 Hero　`commit dde9daa`

| 項目 | 內容 |
| --- | --- |
| Prompt | 見提示詞文件「階段 2」 |
| AI Output | `index.html` 骨架、`css/hero.css`、`js/hero.js`。進場 Timeline：主圖 scale 1.1→1＋opacity（0s）→ 側邊貼紙由上落下旋轉（0.45s）→ 裝飾貼紙彈跳貼上（0.7s 起每張 +0.1s）→ 標題上移淡入（0.8s）→ 導覽列淡入（1.3s）→ 捲動指引（1.6s） |
| AI 自行除錯 | `figure` 預設外距與圖片 `height` 屬性讓拼貼變形 → 加上 `figure { margin: 0 }`、`img { height: auto }` |
| 修改 | |
| 最終成果 | |

## 階段 3｜Gallery 與分類篩選　`commit 564da7a`

| 項目 | 內容 |
| --- | --- |
| Prompt | 見提示詞文件「階段 3」 |
| AI Output | `js/works.js`（作品＋角色資料）、`css/gallery.css`、`js/gallery.js`。篩選：淡出縮小 250ms → FLIP 位移 400ms → 新作品淡入每張間隔 60ms → 主題色 0.6s 漸變 |
| AI 自行除錯 | 原本用 CSS `columns` 做瀑布流，篩選後只剩 2 張時會擠在同一欄 → 改成 CSS Grid（每列 4px）＋ JS 計算每張卡片跨幾列 |
| 修改 | |
| 最終成果 | |

## 階段 4｜Lightbox 與全螢幕　`commit 54e0700`

| 項目 | 內容 |
| --- | --- |
| Prompt | 見提示詞文件「階段 4」 |
| AI Output | `css/lightbox.css`、`js/lightbox.js`。Lightbox：縮圖 1→1.05、主題色格紋遮罩 0→1、大圖 0.9→1；← → Esc；只在目前分類內循環。全螢幕：Fullscreen API、rotateY 翻頁轉場、控制列 2 秒隱藏、手機左右滑 |
| 修改 | |
| 最終成果 | |

## 階段 5｜Hover、導覽列、捲動效果　`commit dfe1413`

| 項目 | 內容 |
| --- | --- |
| Prompt | 見提示詞文件「階段 5」 |
| AI Output | `css/effects.css`、`js/effects.js`。Hover 5 種變化（轉正、抬起放大、陰影、捲角、便條浮現）；導覽列紙膠帶＋螢光筆底線＋捲動縮小＋漢堡選單；捲動效果：卡片貼上、紙膠帶標題展開、視差貼紙、進度條 |
| AI 自行除錯 | 導覽列進場後仍是透明 → `.js .page-home .site-nav` 權重比 `.is-entered.site-nav` 高，改成 `:not(.is-entered)` |
| 修改 | |
| 最終成果 | |

## 階段 6｜其他頁面　`commit b02afef`

| 項目 | 內容 |
| --- | --- |
| Prompt | 見提示詞文件「階段 6」 |
| AI Output | `work.html`＋`js/work.js`（作品詳細頁）、`js/exhibition.js`（釘住的水平展牆）、`about.html`＋`js/about.js`（翻面名片、AI 聲明）、`contact.html`＋`js/contact.js`（明信片表單、印章動畫）、`css/pages.css` |
| AI 自行除錯 | 展牆釘住前標題和展區之間留白太大 → 把區塊標題一起放進釘住的容器 |
| 修改 | （必做：在 `js/works.js` 把 `SITE.designer` 改成你的名字；把每件作品的 `prompt` 填上你生圖時用的提示詞） |
| 最終成果 | |

## 階段 7｜響應式　`commit 7aeaf25`

| 項目 | 內容 |
| --- | --- |
| Prompt | 見提示詞文件「階段 7-1」 |
| AI Output | `css/responsive.css`，在 390px、820px、1366px 三種寬度截圖檢查，皆無橫向捲軸 |
| 修改 | （建議：用自己的手機實測，記下問題，再用「7-2 除錯」提示詞修正） |
| 最終成果 | |
