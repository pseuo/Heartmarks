window.VALENTINE_CONFIG = {
  anniversaryDate: "2025-10-18T00:00:00",
  names: {
    first: "Bai",
    second: "Yang"
  },
  text: {
    pageTitle: "宝贝,感谢你一直的陪伴！",
    anniversaryTitle: "在一起{value}{unit},始于初见,终于到老。",
    intro: "the times we together",
    musicPrompt: "点击右上角音乐按钮播放背景音乐",
    musicPlaying: "背景音乐已开始播放",
    musicUnavailable: "播放被浏览器拦截，请点击右上角音乐按钮",
    nextCelebrationEyebrow: "NEXT CELEBRATION",
    nextCelebrationHeading: "下一次心动",
    nextAnniversaryName: "{first} & {second} 的下一次纪念日",
    countdownPrefix: "距离",
    countdownSuffix: "还有",
    anniversaryMilestone: "{value} 周年",
    daysUntil: "天后",
    noteEyebrow: "A NOTE FOR YOU",
    noteHeading: "今日想对你说",
    refreshMessage: "换一句",
    timelineEyebrow: "OUR STORY",
    timelineHeading: "爱情时间线",
    shareEyebrow: "KEEP THIS DAY",
    shareHeading: "分享这一刻",
    shareLead: "我们已并肩走过",
    shareUnit: "天",
    shareNote: "每一天都值得珍藏",
    createPoster: "生成恋爱天数海报",
    posterEditorTitle: "制作纪念海报",
    posterMessage: "每一天都值得珍藏",
    posterFilename: "love-days-poster.png",
    themeEyebrow: "A NEW MOOD",
    themeHeading: "换一页心情",
    themePickerLabel: "选择纪念页主题",
    wishlistEyebrow: "OUR WISH LIST",
    wishlistHeading: "共同心愿清单",
    wishlistIntro: "把想一起经历的每一件小事，慢慢完成。",
    wishlistAdd: "加入清单",
    wishlistAdded: "已加入共同心愿清单",
    wishlistEmpty: "写下下一件想一起完成的事吧。"
  },
  music: {
    src: "./media/zui-mei-qing-lv-cut.mp3",
    type: "audio/mpeg"
  },
  carouselInterval: 3000,
  messages: [
    "和你一起，连平凡的日子都闪闪发光。",
    "谢谢你，把我的小事都放在心上。",
    "想和你一起，把日子过成喜欢的样子。",
    "我的答案一直都是你，也是我们。",
    "愿往后的每一次回头，都能看见你在身旁。"
  ],
  // 可选：生日或其他固定提醒。annual 为 true 时，date 使用 "MM-DD" 并每年重复。
  // 示例：{ name: "TA 的生日", date: "08-19", annual: true }
  importantDates: [],
  // 访问控制是可选的：password 留空时任何人都可访问；expiresAt 留空时永久有效。
  // 纯静态托管只能阻挡页面访问，无法加密已发布的图片和脚本。
  access: {
    password: "",
    expiresAt: ""
  },
  wishlistCategories: ["旅行", "餐厅", "一起完成"],
  wishlist: [
    { title: "去看一次海边日落", category: "旅行", completed: false },
    { title: "打卡一家想吃很久的餐厅", category: "餐厅", completed: false },
    { title: "一起学会做一道拿手菜", category: "一起完成", completed: false }
  ],
  timeline: [
    { date: "2025.10.18", title: "初见", text: "故事从一次不经意的相遇开始。", photo: "./images/love.jpg" },
    { date: "2025.11.12", title: "表白", text: "把藏了很久的喜欢，认真说给你听。", photo: "./images/1.jpg" },
    { date: "2025.12.24", title: "冬日旅行", text: "一起走过陌生的街道，也把彼此写进了风景。", photo: "./images/2.jpg" },
    { date: "2026.02.14", title: "第一个情人节", text: "原来被爱着的每一天，都可以是纪念日。", photo: "./images/3.jpg" }
  ],
  memoryPlaces: [
    { id: "hangzhou", city: "杭州", name: "西湖边", x: 63, y: 45, type: "约会", date: "2025-10-18", photo: "./images/love.jpg", note: "故事从一次不经意的相遇开始。", tags: ["初见", "约会"] },
    { id: "shanghai", city: "上海", name: "外滩夜景", x: 72, y: 38, type: "旅行", date: "2025-11-12", photo: "./images/1.jpg", note: "把心事认真说给彼此听。", tags: ["表白", "夜晚"] },
    { id: "suzhou", city: "苏州", name: "平江路", x: 66, y: 51, type: "约会", date: "2025-12-24", photo: "./images/2.jpg", note: "冬天的街道，也有暖暖的光。", tags: ["旅行", "冬日"] },
    { id: "xiamen", city: "厦门", name: "海边日落", x: 57, y: 76, type: "旅行", date: "2026-02-14", photo: "./images/3.jpg", note: "一起等海面慢慢变成粉色。", tags: ["海边", "情人节"] }
  ],
  moods: [
    { date: "2026-08-16", mood: "开心", weather: "晴", note: "晚风刚刚好" },
    { date: "2026-08-17", mood: "想念", weather: "小雨", note: "想快点见面" },
    { date: "2026-08-18", mood: "惊喜", weather: "多云", note: "收到你的小心意" }
  ],
  countdowns: [
    { name: "下次见面", date: "2026-08-28", type: "见面" },
    { name: "海边旅行", date: "2026-10-01", type: "旅行" },
    { name: "Bai 的生日", date: "10-12", annual: true, type: "生日" },
    { name: "我们的周年", date: "10-18", annual: true, type: "周年" }
  ],
  holidays: [
    { date: "02-14", theme: "valentine", eyebrow: "HAPPY VALENTINE'S DAY", title: "情人节快乐", message: "今天和每一天，都想把偏爱留给你。" },
    { date: "10-18", theme: "anniversary", eyebrow: "OUR ANNIVERSARY", title: "周年快乐", message: "又一起走过一年，未来请继续多多指教。" },
    { date: "12-25", theme: "christmas", eyebrow: "MERRY CHRISTMAS", title: "圣诞快乐", message: "愿每一场冬雪里，都有我们并肩的身影。" },
    { date: "2026-08-19", theme: "qixi", eyebrow: "HAPPY QIXI", title: "七夕快乐", message: "今夜星河很近，而你就在身边。" }
  ],
  collaborators: ["Bai", "Yang"],
  // 主题只定义在此处。新增主题时复制一项并调整 tokens，不需要新增页面或 CSS 选择器。
  defaultTheme: "valentine",
  themes: [
    {
      id: "daily",
      label: "日常",
      effect: "none",
      tokens: {
        background: "#F7F6F2", foreground: "#263238", primary: "#58786A", secondary: "#C78C73",
        accent: "#B9822C", card: "#FFFFFF", muted: "#EEF1EC", "muted-foreground": "#52615A",
        border: "#DCE4DA", shadow: "0 24px 70px rgba(38, 50, 56, 0.12)"
      }
    },
    {
      id: "birthday",
      label: "生日",
      effect: "none",
      tokens: {
        background: "#FFF4DF", foreground: "#4A315A", primary: "#D14C8B", secondary: "#6E75DD",
        accent: "#E68A29", card: "#FFFDF7", muted: "#FFF0F6", "muted-foreground": "#6A5971",
        border: "#F4D8E7", shadow: "0 24px 70px rgba(209, 76, 139, 0.16)"
      }
    },
    {
      id: "anniversary",
      label: "周年",
      effect: "none",
      tokens: {
        background: "#FDF2F8", foreground: "#3E2530", primary: "#BE185D", secondary: "#EC4899",
        accent: "#A16207", card: "#FFFFFF", muted: "#FBF1F5", "muted-foreground": "#475569",
        border: "#F7E3EB", shadow: "0 24px 70px rgba(190, 24, 93, 0.14)"
      }
    },
    {
      id: "valentine",
      label: "情人节",
      effect: "none",
      tokens: {
        background: "#FFF1F2", foreground: "#3F1D2A", primary: "#C81E4B", secondary: "#F4728C",
        accent: "#B7791F", card: "#FFFCFC", muted: "#FFE4E6", "muted-foreground": "#6B4350",
        border: "#FFD0D8", shadow: "0 24px 70px rgba(200, 30, 75, 0.17)"
      }
    },
    {
      id: "new-year",
      label: "新年",
      effect: "none",
      tokens: {
        background: "#FFF7E6", foreground: "#4A2418", primary: "#B4262A", secondary: "#D99A22",
        accent: "#8E1B21", card: "#FFFCF3", muted: "#FCEACB", "muted-foreground": "#72513A",
        border: "#F1D7A2", shadow: "0 24px 70px rgba(180, 38, 42, 0.16)"
      }
    },
    {
      id: "lantern-festival",
      label: "元宵",
      effect: "none",
      tokens: {
        background: "#FFF8ED", foreground: "#47232A", primary: "#BE334A", secondary: "#E4A84D",
        accent: "#8F2736", card: "#FFFEF9", muted: "#FBEBD5", "muted-foreground": "#76545A",
        border: "#F0D6BA", shadow: "0 24px 70px rgba(190, 51, 74, 0.15)"
      }
    },
    {
      id: "spring-outing",
      label: "春游",
      effect: "none",
      tokens: {
        background: "#F5F9ED", foreground: "#2E4836", primary: "#4B7A57", secondary: "#D98AA4",
        accent: "#A8762B", card: "#FEFFF9", muted: "#E9F0DE", "muted-foreground": "#5E7063",
        border: "#D6E3CD", shadow: "0 24px 70px rgba(75, 122, 87, 0.14)"
      }
    },
    {
      id: "summer",
      label: "夏日",
      effect: "none",
      tokens: {
        background: "#EDF9FA", foreground: "#164251", primary: "#17889B", secondary: "#F1A85B",
        accent: "#D87938", card: "#FCFFFF", muted: "#DFF2F4", "muted-foreground": "#49707A",
        border: "#C7E5E9", shadow: "0 24px 70px rgba(23, 136, 155, 0.14)"
      }
    },
    {
      id: "qixi",
      label: "七夕",
      effect: "none",
      tokens: {
        background: "#141B3B", foreground: "#F9F4E6", primary: "#C393F5", secondary: "#6D9EEB",
        accent: "#F0C861", card: "#202A52", muted: "#192247", "muted-foreground": "#D7DAEB",
        border: "#3C4A7B", shadow: "0 24px 70px rgba(5, 9, 34, 0.46)"
      }
    },
    {
      id: "mid-autumn",
      label: "中秋",
      effect: "none",
      tokens: {
        background: "#F8F4E8", foreground: "#314053", primary: "#6372A5", secondary: "#D9A94C",
        accent: "#A56E28", card: "#FFFDF7", muted: "#EEE9DB", "muted-foreground": "#627080",
        border: "#DCD6C2", shadow: "0 24px 70px rgba(49, 64, 83, 0.14)"
      }
    },
    {
      id: "autumn",
      label: "秋日",
      effect: "none",
      tokens: {
        background: "#FBF3E8", foreground: "#55372B", primary: "#A85B35", secondary: "#D99A46",
        accent: "#7D482C", card: "#FFFDF9", muted: "#F4E5D1", "muted-foreground": "#775D4D",
        border: "#E9D1B5", shadow: "0 24px 70px rgba(168, 91, 53, 0.15)"
      }
    },
    {
      id: "midnight-countdown",
      label: "跨年",
      effect: "none",
      tokens: {
        background: "#16182C", foreground: "#F8F4EA", primary: "#D8B95B", secondary: "#A889E7",
        accent: "#F0D78A", card: "#232640", muted: "#1B1E35", "muted-foreground": "#D5D4E2",
        border: "#424463", shadow: "0 24px 70px rgba(0, 0, 0, 0.42)"
      }
    },
    {
      id: "travel",
      label: "旅行",
      effect: "none",
      tokens: {
        background: "#F1F8F5", foreground: "#264A50", primary: "#3C7E82", secondary: "#D49B59",
        accent: "#B66D38", card: "#FCFFFD", muted: "#E2F0EA", "muted-foreground": "#5B7574",
        border: "#CAE2D8", shadow: "0 24px 70px rgba(60, 126, 130, 0.14)"
      }
    },
    {
      id: "movie-night",
      label: "电影夜",
      effect: "none",
      tokens: {
        background: "#1A1518", foreground: "#F8F1E9", primary: "#C54A54", secondary: "#CDA861",
        accent: "#E2C078", card: "#292126", muted: "#211A1E", "muted-foreground": "#D8C9C8",
        border: "#4D3D42", shadow: "0 24px 70px rgba(0, 0, 0, 0.48)"
      }
    },
    {
      id: "halloween",
      label: "万圣节",
      effect: "none",
      tokens: {
        background: "#211722", foreground: "#FFF2DF", primary: "#DB6A25", secondary: "#8C5BC7",
        accent: "#F2A34B", card: "#302331", muted: "#281C29", "muted-foreground": "#DEC9D3",
        border: "#583D5A", shadow: "0 24px 70px rgba(0, 0, 0, 0.5)"
      }
    },
    {
      id: "winter",
      label: "冬日",
      effect: "snow",
      tokens: {
        background: "#EFF5F8", foreground: "#284556", primary: "#527B93", secondary: "#A7BBC8",
        accent: "#AF7A3C", card: "#FCFEFF", muted: "#E2EDF2", "muted-foreground": "#5D7480",
        border: "#CEDFE7", shadow: "0 24px 70px rgba(40, 69, 86, 0.14)"
      }
    },
    {
      id: "christmas",
      label: "圣诞",
      effect: "snow",
      tokens: {
        background: "#F7F3EB", foreground: "#213B32", primary: "#B4233D", secondary: "#2F7C63",
        accent: "#B68724", card: "#FFFDF8", muted: "#EEF4EE", "muted-foreground": "#476158",
        border: "#D9E6D9", shadow: "0 24px 70px rgba(33, 59, 50, 0.14)"
      }
    }
  ],
  photos: [
    {
      src: "./images/love.jpg",
      alt: "我们的纪念照片",
      caption: "轻轻地说一声：“我喜欢你！”",
      date: "2025.10.18"
    },
    {
      src: "./images/1.jpg",
      alt: "你往前走，我一定在你身后",
      caption: "你往前走，我一定在你身后",
      date: "2025.11.12"
    },
    {
      src: "./images/2.jpg",
      alt: "You are my today and all of my tomorrows.",
      caption: "You are my today and all of my tomorrows.",
      date: "2025.12.24"
    },
    {
      src: "./images/3.jpg",
      alt: "你是我的今天和所有的明天",
      caption: "你是我的今天和所有的明天",
      date: "2026.02.14"
    }
  ]
};
