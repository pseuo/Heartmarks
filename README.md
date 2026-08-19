# Heartmarks

一个用于记录情侣纪念日的纯静态网页。页面包含恋爱计时、爱情时间线、纪念日提醒、照片互动、情书卡片和分享海报，适合部署成个人纪念日页面或节日告白页面。

## 功能特点

- 恋爱计时：实时显示从指定日期开始经过的天、小时、分钟和秒数。
- 照片轮播：自动切换纪念照片，支持上一张、下一张、圆点导航、暂停和全屏查看。
- 爱情时间线：按日期记录初见、表白、旅行、纪念日等事件，并可附照片。
- 纪念日提醒：显示下一个 100 天或周年倒计时，也支持生日等固定提醒。
- 留言卡片：展示专属情书，并可随机切换“今日想对你说”。
- 恋爱天数海报：一键生成当前恋爱天数 PNG，方便保存或分享到朋友圈。
- 主题切换：提供日常、生日、周年、情人节、新年、元宵、春游、夏日、七夕、中秋、秋日、万圣节、冬日、跨年、旅行、电影夜、圣诞等主题，并记住上次选择。
- 共同心愿清单：记录旅行、餐厅或想一起完成的事，可在页面中勾选完成并加入新的心愿；完成状态保存在当前浏览器中。
- 访问控制：可选设置访问密码和分享有效期；不设置密码时，在有效期内任何人都可以访问。
- 背景音乐：仅可通过右上角音乐按钮播放、暂停或继续播放；用户暂停后的状态会被记住，重新打开页面不会自动恢复。
- 雪花动画：仅在圣诞主题下使用 Three.js 和雪花图片素材渲染；切换离开该主题或页面隐藏时会停止渲染，且不受“减少动态效果”设置影响。
- 移动端适配：页面以手机竖屏访问为主，同时可在桌面浏览器打开。
- 分享信息：内置 Open Graph 元信息，便于分享时展示标题、描述和封面图。
- PWA：支持安装到手机主屏幕，以独立 App 窗口打开；首次成功访问后可离线查看页面和播放已缓存的背景音乐。

## 项目结构

```text
.
├── index.html              # 页面结构与静态分享元信息
├── manifest.webmanifest    # PWA 安装信息
├── service-worker.js       # 离线缓存策略
├── app-icon.svg            # PWA 应用图标
├── css/
│   └── index.css           # 页面样式
├── js/
│   ├── app.js              # 页面交互逻辑
│   ├── count-time.js       # 恋爱计时逻辑
│   └── site-config.js      # 所有个性化内容配置
│   └── three.js            # 雪花渲染库
├── images/                 # 页面照片
│   └── snow/               # 雪花图片素材
├── media/                  # 背景音乐文件和裁剪后的音频
├── font/                   # 自定义字体
├── favicon.ico             # 网站图标
├── pic-icon.png            # 分享封面图
├── cut-music.py            # 音频裁剪辅助脚本
└── tinyimage.py            # 图片压缩辅助脚本
```


## 个性化配置

姓名、纪念日、页面文案、照片、音乐、轮播间隔和主题都在 `js/site-config.js` 中维护，无需修改 `index.html`。

```js
window.VALENTINE_CONFIG = {
  anniversaryDate: "2025-10-18T00:00:00",
  names: { first: "Bai", second: "Yang" },
  text: { intro: "the times we together" },
  music: { src: "./media/zui-mei-qing-lv-cut.mp3", type: "audio/mpeg" },
  carouselInterval: 3000,
  photos: [
    { src: "./images/love.jpg", alt: "照片替代文本", caption: "照片文案", date: "2025.10.18" }
  ]
};
```

添加照片时，将图片放入 `images/` 目录，并在 `photos` 增加一项；`date` 会显示在照片文案旁，也会同步显示在全屏查看中。照片轮播、圣诞主题飘雪和音乐图标旋转均不受“减少动态效果”设置影响。

`timeline` 数组用于维护爱情事件，每项包含 `date`、`title`、`text` 与 `photo`，可按需添加初见、表白、旅行、生日或周年等节点。`messages` 数组用于随机情话。要添加生日等固定提醒，在 `importantDates` 中增加日期；如果它早于下一个恋爱里程碑，提醒卡会优先显示它：

```js
importantDates: [
  { name: "TA 的生日", date: "08-19", annual: true },
  { name: "我们的旅行日", date: "2026-10-01" }
]
```

### 共同心愿与访问控制

在 `wishlist` 中维护首次打开页面时显示的共同心愿；每项可设置 `title`、`category` 和 `completed`。访问者新增或勾选完成的状态存储在其当前浏览器中；如需让所有访问者看到同一份更新，请同步修改 `site-config.js` 后重新发布。

`access.password` 留空时页面不要求密码；`expiresAt` 留空时分享永不过期。有效期可以使用日期（当天 23:59:59 失效）或 ISO 日期时间：

```js
access: {
  password: "only-for-us",
  expiresAt: "2026-02-15T23:59:59+08:00"
},
wishlist: [
  { title: "去看一次海边日落", category: "旅行", completed: false },
  { title: "打卡一家想吃很久的餐厅", category: "餐厅", completed: true }
]
```

这是纯静态网页，访问控制仅阻止页面正常打开，不能加密或隐藏已部署在公开静态托管上的图片、脚本和音频。需要真正保护私人照片和文字时，应使用带服务端鉴权的托管方案，并将私密资源放在受保护的存储中。

### 主题系统

主题由 `defaultTheme` 和 `themes` 配置驱动。每项的 `tokens` 会覆盖页面使用的语义色彩变量，`effect` 用于控制可选的场景效果；当前 `snow` 用于圣诞和冬日主题。增加或移除主题只需维护数组，页面会自动生成对应的切换按钮：

```js
defaultTheme: "valentine",
themes: [
  {
    id: "daily",
    label: "日常",
    effect: "none",
    tokens: {
      background: "#F7F6F2",
      foreground: "#263238",
      primary: "#58786A",
      secondary: "#C78C73",
      accent: "#B9822C",
      card: "#FFFFFF",
      muted: "#EEF1EC",
      "muted-foreground": "#52615A",
      border: "#DCE4DA",
      shadow: "0 24px 70px rgba(38, 50, 56, 0.12)"
    }
  }
]
```

新主题应使用唯一的 `id`，并提供完整的 `tokens`。浏览器已保存但配置中不存在的旧主题会自动回退到主题数组第一项。

### 修改页面标题和分享信息

页面标题在 `js/site-config.js` 的 `text` 中配置。分享标题、描述和封面图仍需在 `index.html` 的 Open Graph 元信息中配置，以便不执行 JavaScript 的分享爬虫读取。发布前必须把 `og:url` 和 `og:image` 同时替换为正式站点下可公开访问的绝对 HTTPS URL：

```html
<meta property="og:description" content="记录“我们在一起走过点点滴滴”">
<meta property="og:title" content="轻轻地说一声：“我喜欢你！”">
<meta property="og:url" content="https://your-domain.example/">
<meta property="og:image" content="https://your-domain.example/pic-icon.png">
```

## 部署

此项目没有构建步骤，任意静态文件托管都可直接部署。发布前请确认 `js/site-config.js` 中的日期、名字、照片和 Open Graph 中的正式站点地址已更新。

### PWA 与离线使用

PWA 的安装和 Service Worker 离线缓存需要 HTTPS（本地开发可使用 `http://localhost`）。部署后先在线完整打开一次页面，浏览器会缓存页面、字体、照片、雪花素材和当前配置的背景音乐；之后断网仍可打开已缓存版本。

Android Chrome 会显示页面左上角的“安装 App”按钮，也可从浏览器菜单选择“安装应用”。iPhone 或 iPad 请使用 Safari 的分享菜单，选择“添加到主屏幕”。

### GitHub Pages

1. 将项目推送到 GitHub 仓库。
2. 打开仓库的 **Settings > Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**，分支选择 `main`，目录选择 `/(root)`，点击保存。
4. 等待部署完成，访问页面中显示的 `https://<用户名>.github.io/<仓库名>/` 地址。

### Vercel

1. 在 [Vercel](https://vercel.com/new) 导入 GitHub 仓库。
2. Framework Preset 选择 **Other**，不要填写 Build Command 或 Output Directory。
3. 点击 **Deploy**；之后每次推送都会自动发布。

### Netlify

1. 在 [Netlify](https://app.netlify.com/start) 选择 **Import an existing project** 并连接仓库。
2. Build command 留空，Publish directory 填 `.`。
3. 点击 **Deploy site**；也可以将整个项目文件夹直接拖入 Netlify Deploys 页面。

本地预览可在项目根目录运行 `python -m http.server 8000`，再访问 `http://localhost:8000`。



## 音频裁剪脚本

`cut-music.py` 可以用来裁剪 MP3 音频片段。

使用前需要安装依赖：

```bash
pip install pydub
```

如果直接运行，会使用脚本里的默认配置：

```bash
python cut-music.py
```

也可以通过参数指定输入文件、输出文件和裁剪时间：

```bash
python cut-music.py -i ./media/zui-mei-qing-lv.mp3 -o ./media/zui-mei-qing-lv-cut.mp3 -s 0:08 -e 1:37
```

参数说明：

- `-i` 或 `--input`：输入音频文件路径。
- `-o` 或 `--output`：输出音频文件路径。
- `-s` 或 `--start`：开始时间，支持 `MM:SS` 或 `HH:MM:SS`。
- `-e` 或 `--end`：结束时间，支持 `MM:SS` 或 `HH:MM:SS`。

如果导出失败，请确认本机已经安装并配置好 `ffmpeg`。

## 图片压缩脚本

`tinyimage.py` 会读取 `origin_images/` 目录中的图片，压缩后输出到 `images/` 目录，并把生成的图片路径复制到剪贴板，方便加入 `js/site-config.js` 的 `photos` 配置。

使用前需要安装依赖：

```bash
pip install pillow pyperclip
```

使用方式：

```bash
python tinyimage.py
```

注意：

- 请先创建 `origin_images/` 目录，并把原始图片放进去。
- 支持 `.jpg`、`.jpeg`、`.png` 和 `.webp` 图片。
- 小于约 `1.5MB` 的图片会直接处理输出，超过该大小的图片会按脚本配置压缩。
