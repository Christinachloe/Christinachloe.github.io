# christinachloe.github.io

个人主页 / 项目台账。纯静态，无构建步骤，GitHub Pages 直接发布。
线上地址：https://christinachloe.github.io/

## 改内容

所有文字都在 `site.json` 里，改完保存推上去即可，不用碰 HTML/CSS/JS。

| 字段 | 作用 |
|---|---|
| `meta.name` | 显示的名字（顶栏、首屏、`<title>` 一起用） |
| `meta.tagline` | 一句话副标题 |
| `meta.intro` | 首屏介绍，1–2 句 |
| `meta.links` | 首屏按钮，`[{label, url}]` |
| `meta.updated` | 「最后更新」日期 |
| `projects[]` | 项目卡片：`name` / `summary` / `status` / `stack` / `repo` / `demo` / `note` |
| `goals[]` | 目标时间线：`period` / `title` / `status` / `items[]` |
| `works[]` | 成果列表：`date` / `title` / `desc` / `link` |

- `status` 认这几个值：`进行中` `已完成` `规划中`（也认 doing / done / plan）。
- `repo` / `demo` / `link` 留空就不显示对应按钮，别填没上线的地址。
- `note` 是卡片底部那行小字，用来说明「现在到哪一步了」，不需要就留空。

## 目录

```
index.html    页面骨架（含 OG / favicon / noscript 兜底）
style.css     样式（深色默认，浅色由 data-theme 覆盖，右上角 ◐ 切换）
app.js        读 JSON 渲染，一般不需要改
site.json     全部内容
favicon.svg   标签页图标
og.png        分享卡片图 1200×630（og:image 用）
robots.txt    允许抓取 + 指向 sitemap
sitemap.xml   单页站点地图
404.html      GitHub Pages 的 404 页
.nojekyll     让 GitHub Pages 不做 Jekyll 处理
```

换 `og.png` 时保持 1200×630、深色底，别用远程图床。

## 本地预览

```bash
python -m http.server 8899
# 打开 http://127.0.0.1:8899/
```

直接双击 `index.html` 会看不到数据——浏览器禁止 `file://` 页面 fetch 本地 JSON。

## 发布

GitHub Pages 从 `main` 分支根目录直接发布，推上去等一两分钟即可。

两个坑先说：

- **一个文件一个 commit** 会把历史弄得很碎，Pages 也会跟着重建好几次。GitHub 网页版支持
  一次上传多个文件（`/upload/main`），多个文件落在同一个 commit 里，只重建一次。
- **没有 token 也能提交**：网页编辑器 / 上传页用的是浏览器里已有的登录态。有 token 的话最快
  是一条 `git commit && git push`，或者一次 REST `PUT /repos/{owner}/{repo}/contents/{path}`。

## 带 token 的发布路径（推荐）

本机有一个 fine-grained PAT（名称 `dsh-workstation-site`，90 天有效期），权限只有本仓库
Contents: Read and write。它存在 `效率优化/private/.gh-token`，不进仓库。

有了 token，最省事的是 git push：

```bash
TOK=$(cat private/.gh-token)
git clone "https://x-access-token:$TOK@github.com/Christinachloe/Christinachloe.github.io.git"
cd Christinachloe.github.io && git commit -am "update" && git push
```

单文件改动用 REST 也行，不必 clone；没有 token 时退回浏览器登录态那套（见上节）。

两个前提：`api.github.com` 未认证按 IP 限流（60 次/小时），带 token 是 5000 次/小时；
本机若存在 `HTTP_PROXY` 且代理已死，curl 要加 `--noproxy '*'`，浏览器侧则会偶发
`ERR_CONNECTION_CLOSED`，重试一次即可。
