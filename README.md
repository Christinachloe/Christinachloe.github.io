# christinachloe.github.io

个人主页兼项目台账。纯静态、零构建、零依赖：一个 HTML、一个 CSS、一个 JS，内容全部在 `site.json`。

线上：<https://christinachloe.github.io/>

## 目录

| 文件 | 作用 |
|---|---|
| `index.html` | 骨架：顶栏、左右竖栏、四个区块、页脚 |
| `style.css` | 全部样式。深色为默认，浅色由 `[data-theme="light"]` 覆盖 |
| `app.js` | 读 `site.json` 渲染项目 / 目标 / 成果，管主题、滚动渐入、当前章节高亮 |
| `site.json` | **唯一数据源**：改文字只改这里 |
| `favicon.svg` / `og.png` | 站点图标与分享卡（1200×630） |
| `robots.txt` / `sitemap.xml` / `404.html` | 静态站配套 |

## 改内容

```jsonc
{
  "meta":     { "name", "greeting", "tagline", "intro", "updated", "links": [{ "label", "url" }] },
  "projects": [{ "name", "summary", "status", "stack": [], "repo", "demo", "note" }],
  "goals":    [{ "period", "status", "title", "items": [] }],
  "works":    [{ "date", "title", "desc", "link" }]
}
```

- `status` 认三种词：`进行中`（黄）、`已完成`（青绿）、`规划中`（灰）。
- 字段留空就自动不渲染（`repo` / `demo` / `note` / `link` 都可以是空串）。
- 新增条目直接在数组里加对象，不用动 HTML。

## 本地预览

```bash
cd site
python -m http.server 8899   # 然后打开 http://127.0.0.1:8899/
```

直接双击 `index.html` 会因浏览器 `file://` 限制读不到 `site.json`，页面会提示。

## 设计

视觉参照 [bchiang7/v4](https://github.com/bchiang7/v4) 的思路（不引用其代码，本站全部手写）：

- 底色 `#0a192f`，面板 `#112240`，青绿点缀 `#64ffda`，正文 `#8892b0` / 标题 `#e6f1ff`
- 等宽字体做标号与元信息：`01.` / `02.` / `03.`、状态药丸、日期
- 章节标题右侧一条细线拉满，宽度由 `flex` 自适应
- 左右两条固定竖栏（左社交、右站点名），窄屏自动隐藏
- 首屏压到 `100vh`，进入内容靠滚动

## 换主题

默认跟随系统；点右上角 `◐` 手动切换，选择存在 `localStorage`。改配色只动 `style.css` 顶部两组变量。

## 发布

站点从 `main` 分支根目录直接发布（GitHub Pages）。提交后 1 分钟左右生效，缓存靠 `og.png?v` 之外的强刷或等 CDN。
