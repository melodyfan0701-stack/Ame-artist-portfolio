/* =========================================================
   works.js｜作品與角色資料（階段 3）
   全站共用這一份資料：Gallery、Lightbox、全螢幕、作品詳細頁、About。
   新增作品只要在 WORKS 加一筆，並把圖片放進 images/。
   ========================================================= */

// 網站資訊：把 designer 換成你的名字
const SITE = {
  artist: 'Ame 雨音',
  designer: '（你的名字）',
  year: 2026
};

// 四位角色＝四個分類。main / accent 要和 css/base.css 的 [data-char] 一致
const CHARACTERS = {
  midori: {
    name: 'Midori 翠',
    short: 'Midori',
    face: 'images/face-midori.jpg',
    main: '#8b1e1e',
    accent: '#1e9e6e',
    palette: '莓果紅 × 綠',
    motto: '嘴硬心軟的畫畫少女。',
    bio: '紅格紋是她的戰鬥服，綠色長髮永遠綁不住。口袋裡總有幾張櫻桃貼紙，心情好就貼在臉頰上。'
  },
  sumire: {
    name: 'Sumire 菫',
    short: 'Sumire',
    face: 'images/face-sumire.jpg',
    main: '#6e58a8',
    accent: '#c9a646',
    palette: '薰衣草 × 黑 × 金',
    motto: '安靜，但想被看見。',
    bio: '喜歡收集金色的小東西：鈕扣、髮夾、玫瑰。很少開口，秘密都夾在粉紅手帳的最後一頁。'
  },
  shiro: {
    name: 'Shiro 白',
    short: 'Shiro',
    face: 'images/face-shiro.jpg',
    main: '#8a4b2a',
    accent: '#5fb3a1',
    palette: '奶白 × 焦糖 × 薄荷',
    motto: '穿搭跟著季節換色。',
    bio: '奶白色頭髮配一雙紅眼睛。秋天穿焦糖格紋，夏天換成薄荷氣泡色，表情貼紙替她說出不好意思講的話。'
  },
  mimi: {
    name: 'Mimi 蜜',
    short: 'Mimi',
    face: 'images/face-mimi.jpg',
    main: '#3e8fd0',
    accent: '#f19ab0',
    palette: '天空藍 × 粉',
    motto: '表情最多的那一個。',
    bio: '金色雙馬尾、粉色蝴蝶結。總是第一個比心的人，負責把大家的手帳貼滿愛心。'
  }
};

/* 作品：
   aspect   Gallery 縮圖的裁切比例（tall 4:5 / square 1:1 / wide 5:4），做出瀑布流的高低差
   focus    縮圖裁切的對焦點（object-position）
   concept  創作理念（作品詳細頁）
   prompt   生成這張圖的提示詞：請貼上你實際使用的版本，留空時詳細頁不顯示 */
const WORKS = [
  {
    id: 'midori-01', title: '格紋心事', character: 'midori', year: 2026,
    image: 'images/midori-01.jpg', aspect: 'tall', focus: '62% 40%',
    description: '紅格紋配綠長髮，今天的心事是一顆貼在臉頰的愛心。',
    concept: '全身立繪和臉部特寫放在同一張紙上，像角色設定稿也像一頁貼紙手帳。外框的紅格紋把畫面收住，白邊的 Q 版頭像和表情貼紙打破框線，讓人物看起來是「被貼上去」的。',
    prompt: ''
  },
  {
    id: 'midori-02', title: '畫桌午後', character: 'midori', year: 2026,
    image: 'images/midori-02.jpg', aspect: 'wide', focus: '40% 45%',
    description: '趴在素描本旁發呆，筆還沒動，貼紙先貼滿了。',
    concept: '把角色放回「畫畫的人」的日常：素描本、筆筒、紅手套。俯趴的姿勢讓長髮沿著畫面鋪開，背景的方格紙和格紋布延續了手帳的桌面感。',
    prompt: ''
  },
  {
    id: 'midori-03', title: '櫻桃貼紙', character: 'midori', year: 2026,
    image: 'images/midori-03.jpg', aspect: 'square', focus: '55% 50%',
    description: '抱著膝蓋等雨停，口袋裡的櫻桃貼紙是今天的好運。',
    concept: '抱膝坐姿把視線拉近，黑色皮革和紅格紋裙維持 Midori 的配色。左上角的 Q 版小翠和右下的櫻桃、蝴蝶結貼紙，是這一系列反覆出現的符號。',
    prompt: ''
  },
  {
    id: 'sumire-01', title: '格紋蝴蝶結', character: 'sumire', year: 2026,
    image: 'images/sumire-01.jpg', aspect: 'tall', focus: '50% 35%',
    description: '藍紫格紋和大蝴蝶結，安靜的人也有想被看見的一天。',
    concept: '低頭、閉眼、雙手交握，用姿勢表現 Sumire 的內向。藍紫格紋和金色飾品是她的識別色，背景的淡紫方格和玫瑰貼紙讓畫面保持柔和。',
    prompt: ''
  },
  {
    id: 'sumire-02', title: '金玫瑰', character: 'sumire', year: 2026,
    image: 'images/sumire-02.jpg', aspect: 'square', focus: '50% 50%',
    description: '黑色洋裝與金玫瑰，把秘密夾在粉紅手帳的最後一頁。',
    concept: '黑色洋裝讓 Sumire 多了一點哥德感，和粉紅手帳、粉彩雲朵形成反差。金玫瑰貼紙是畫面的焦點，也呼應她收集金色小東西的設定。',
    prompt: ''
  },
  {
    id: 'shiro-01', title: '焦糖星光', character: 'shiro', year: 2026,
    image: 'images/shiro-01.jpg', aspect: 'wide', focus: '58% 35%',
    description: '焦糖格紋配檸檬黃，托著下巴想今天要穿什麼。',
    concept: '秋天版本的 Shiro：焦糖格紋、皮革綁帶和琥珀耳環。檸檬黃的雲朵色塊讓暖色調不會太沉，臉頰上的黃色愛心是整張圖最亮的一點。',
    prompt: ''
  },
  {
    id: 'shiro-02', title: '薄荷氣泡', character: 'shiro', year: 2026,
    image: 'images/shiro-02.jpg', aspect: 'tall', focus: '35% 45%',
    description: '薄荷色像汽水泡泡，笑臉雲朵替她說出心情。',
    concept: '同一個角色換成夏天的薄荷色。笑臉雲朵貼紙散在四周，和她有點害羞的表情形成對比，像是貼紙在替她把話說出來。',
    prompt: ''
  },
  {
    id: 'mimi-01', title: '粉藍蝴蝶結', character: 'mimi', year: 2026,
    image: 'images/mimi-01.jpg', aspect: 'square', focus: '50% 40%',
    description: '雙馬尾綁上粉色蝴蝶結，捧著臉等你先開口。',
    concept: '捲曲的雙馬尾佔滿畫面兩側，形成一個框住臉的構圖。粉藍漸層背景和粉色小熊貼紙讓整張圖像一張可以撕下來的大貼紙。',
    prompt: ''
  },
  {
    id: 'mimi-02', title: '比心', character: 'mimi', year: 2026,
    image: 'images/mimi-02.jpg', aspect: 'tall', focus: '50% 40%',
    description: '從上往下看的比心，送給翻開這本手帳的你。',
    concept: '俯視角度讓觀看者像是站在桌邊低頭看手帳。藍色方格紙、活頁圈和果凍愛心貼紙，把 Mimi 的比心手勢直接送給觀眾。',
    prompt: ''
  }
];

// 作品詳細頁網址（統一從這裡產生）
function workUrl(id) {
  return 'work.html?id=' + encodeURIComponent(id);
}
