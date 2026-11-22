// 由 data/site.json 渲染整页；改内容只改 JSON，不用碰这里的代码
(function () {
  "use strict";

  var STATUS_CLASS = {
    "进行中": "doing", "在做": "doing", "doing": "doing",
    "已完成": "done", "完成": "done", "done": "done",
    "规划中": "plan", "计划": "plan", "plan": "plan"
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function badge(status) {
    var cls = STATUS_CLASS[status] || "idle";
    return el("span", "badge " + cls, status || "—");
  }

  function renderMeta(meta) {
    document.getElementById("brandName").textContent = meta.name || "";
    document.getElementById("heroName").textContent = meta.name || "";
    document.getElementById("heroTagline").textContent = meta.tagline || "";
    document.getElementById("heroIntro").textContent = meta.intro || "";
    document.title = (meta.name || "") + " · " + (meta.tagline || "主页");

    var links = document.getElementById("heroLinks");
    links.textContent = "";
    (meta.links || []).forEach(function (l) {
      if (!l || !l.url || !l.label) return;
      var a = el("a", null, l.label);
      a.href = l.url;
      a.rel = "noopener";
      if (/^https?:/.test(l.url)) a.target = "_blank";
      links.appendChild(a);
    });

    var up = document.getElementById("updated");
    up.textContent = meta.updated ? "最后更新 " + meta.updated : "";
  }

  function renderProjects(list) {
    var box = document.getElementById("projectList");
    box.textContent = "";
    document.getElementById("projectCount").textContent = list.length ? list.length + " 个" : "";

    if (!list.length) {
      box.appendChild(el("p", "card", "还没有项目条目，去 data/site.json 里加。"));
      return;
    }

    list.forEach(function (p) {
      var card = el("article", "card");

      var top = el("div", "card-top");
      top.appendChild(el("h3", null, p.name || "未命名"));
      top.appendChild(badge(p.status));
      card.appendChild(top);

      if (p.summary) card.appendChild(el("p", null, p.summary));

      if (p.stack && p.stack.length) {
        var st = el("div", "stack");
        p.stack.forEach(function (s) { st.appendChild(el("span", null, s)); });
        card.appendChild(st);
      }

      var links = [];
      if (p.repo) links.push(["源码", p.repo]);
      if (p.demo) links.push(["访问", p.demo]);
      if (links.length) {
        var lw = el("div", "card-links");
        links.forEach(function (pair) {
          var a = el("a", null, pair[0]);
          a.href = pair[1];
          a.target = "_blank";
          a.rel = "noopener";
          lw.appendChild(a);
        });
        card.appendChild(lw);
      }

      box.appendChild(card);
    });
  }

  function renderGoals(list) {
    var box = document.getElementById("goalList");
    box.textContent = "";
    if (!list.length) {
      box.appendChild(el("p", null, "还没有目标条目。"));
      return;
    }
    list.forEach(function (g) {
      var item = el("div", "goal");
      var head = el("div", "goal-head");
      if (g.period) head.appendChild(el("span", "goal-period", g.period));
      head.appendChild(el("h3", null, g.title || ""));
      head.appendChild(badge(g.status));
      item.appendChild(head);
      if (g.items && g.items.length) {
        var ul = el("ul");
        g.items.forEach(function (t) { ul.appendChild(el("li", null, t)); });
        item.appendChild(ul);
      }
      box.appendChild(item);
    });
  }

  function renderWorks(list) {
    var box = document.getElementById("workList");
    box.textContent = "";
    if (!list.length) {
      box.appendChild(el("li", null, "还没有成果条目。"));
      return;
    }
    list.forEach(function (w) {
      var li = el("li");
      li.appendChild(el("span", "date", w.date || ""));
      var body = el("div");
      var t = el("div", "wtitle", w.title || "");
      if (w.link) {
        var a = el("a", null, w.title || "");
        a.href = w.link; a.target = "_blank"; a.rel = "noopener";
        t.textContent = ""; t.appendChild(a);
      }
      body.appendChild(t);
      if (w.desc) body.appendChild(el("div", "wdesc", w.desc));
      li.appendChild(body);
      box.appendChild(li);
    });
  }

  // 主题
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) root.setAttribute("data-theme", "light");

  document.getElementById("themeBtn").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  document.getElementById("footText").textContent =
    "© " + new Date().getFullYear() + " · 内容在 data/site.json 里维护";

  fetch("site.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (d) {
      renderMeta(d.meta || {});
      renderProjects(d.projects || []);
      renderGoals(d.goals || []);
      renderWorks(d.works || []);
    })
    .catch(function (e) {
      document.getElementById("heroName").textContent = "数据没加载上";
      document.getElementById("heroIntro").textContent =
        "data/site.json 读取失败（" + e.message + "）。本地直接双击 index.html 会因为浏览器的本地文件限制看不到数据，起个本地服务即可：python -m http.server";
    });
})();
