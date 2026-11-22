# christinachloe.github.io

个人主页 / 项目台账。纯静态，无构建步骤，GitHub Pages 直接发布。

## 改内容

所有文字都在 `site.json` 里，改完保存推上去即可，不用碰 HTML/CSS/JS。

| 字段 | 作用 |
|---|---|
| `meta.name` | 显示的名字 |
| `meta.tagline` | 一句话副标题 |
| `meta.intro` | 首屏介绍，1–2 句 |
| `meta.links` | 首屏的圆形按钮 |
| `projects[]` | 项目卡片：name / summary / status / stack / repo / demo |
| `goals[]` | 目标时间线：period / title / status / items[] |
| `works[]` | 成果列表：date / title / desc / link |

`status` 认这几个值：`进行中` `已完成` `规划中`（也认 doing / done / plan）。

## 目录

```
index.html    页面骨架
style.css     样式（深色/浅色，右上角 ◐ 切换）
app.js        读 JSON 渲染，一般不需要改
site.json     全部内容
.nojekyll     让 GitHub Pages 不做 Jekyll 处理
```

## 本地预览

```bash
python -m http.server 8899
# 打开 http://127.0.0.1:8899/
```

直接双击 `index.html` 会看不到数据——浏览器禁止 `file://` 页面 fetch 本地 JSON。
