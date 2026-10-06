# Ame 雨音 貼紙手帳

虛構藝術家 Ame 雨音的 AI 角色插畫作品集。日系拼貼手帳風格：方格紙是桌面，作品是白邊貼紙，紙膠帶負責固定與分段；切換角色時，整本手帳會換成她的主題色。

純 HTML + CSS + 原生 JavaScript，不需要安裝或建置。

## 本機預覽

直接用瀏覽器開 `index.html` 即可。若要測試全部功能，建議用本機伺服器：

```bash
python3 -m http.server 8000
# 打開 http://localhost:8000
```

## 檔案結構

| 檔案 | 內容 | 階段 |
| --- | --- | --- |
| `index.html` | 首頁：Hero、作品集、線上手帳展、About / Contact 預覽 | 2–6 |
| `work.html` | 作品詳細頁（`work.html?id=midori-01`） | 6 |
| `about.html` | 關於 Ame、角色名片、AI 協作聲明 | 6 |
| `contact.html` | 明信片聯絡表單 | 6 |
| `css/base.css` | 設計變數、方格紙、貼紙／紙膠帶／便條紙元件 | 1–2 |
| `css/hero.css` | 導覽列排版、Hero 與進場動畫 | 2 |
| `css/gallery.css` | 瀑布流、索引標籤 | 3 |
| `css/lightbox.css` | Lightbox、全螢幕畫廊 | 4 |
| `css/effects.css` | Hover、導覽列互動、捲動效果 | 5 |
| `css/pages.css` | 手帳展、詳細頁、About、Contact | 6 |
| `css/responsive.css` | 平板與手機 | 7 |
| `js/works.js` | **作品與角色資料（新增或修改作品都在這裡）** | 3 |
| `js/*.js` | 各頁面互動，每支檔案開頭都有中文說明 | 2–6 |
| `AI_LOG.md` | AI 協作紀錄（請補上「修改」欄） | — |

## 作業要求對照

- **Home**：Logo、導覽、主視覺、主標題、副標題、CTA、捲動指引；主圖使用 Scale、Position、Opacity
- **Gallery**：9 件作品，每件有圖片、標題、類別、年份、描述
- **Category**：All＋4 位角色；淡出 → FLIP 位移 → 新作品淡入 → 主題色漸變
- **Lightbox**：大圖、名稱、資訊、Close、Previous、Next；← → Esc
- **Fullscreen**：滑鼠喚出控制列、上一張 / 下一張、鍵盤 ← →、Esc、翻頁轉場、手機滑動
- **Hover**：轉正、抬起放大、陰影、捲角、便條浮現
- **Scroll Effect**：卡片貼上、紙膠帶標題展開、視差貼紙、水平展牆、閱讀進度條、詳細頁 Hero 視差
- **Navigation**：紙膠帶連結、螢光筆底線標示目前區塊、捲動縮小、手機漢堡選單
- **Project Detail**：主視覺、名稱、簡介、日期與類別、創意理念、更多圖片
- **Responsive**：桌機 / 平板 / 手機；支援「減少動態效果」系統設定

## 上線前要改的地方

1. `js/works.js` → `SITE.designer` 改成你的名字。
2. `js/works.js` → 每件作品的 `prompt` 填上生圖時用的提示詞（留空時詳細頁不顯示）。
3. `contact.html` → Email 與社群連結目前是佔位用。

## 部署到 Vercel

1. 在 GitHub 新建 repository，把整個資料夾推上去（已含 Git 歷史，每個階段一個 commit）：
   ```bash
   git remote add origin https://github.com/你的帳號/ame-portfolio.git
   git push -u origin main
   ```
2. 到 vercel.com → Add New → Project → 匯入這個 repository。
3. Framework Preset 選 **Other**，其他設定不用改，按 Deploy。
4. 之後每次 `git push`，Vercel 會自動重新部署。

## 聲明

Ame 雨音為虛構藝術家，網站內所有作品皆由 AI 生成。網站設計與程式由學生與 AI（Claude）協作完成，過程見 `AI_LOG.md`。
