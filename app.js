// 整页由 site.json 渲染：改内容只改 JSON，不用碰 HTML/CSS/JS
(function () {
  "use strict";

  var STATUS_CLASS = {
    "进行中": "doing", "在做": "doing", "doing": "doing",
    "已完成": "done", "完成": "done", "done": "done",
    "规划中": "plan", "计划": "plan", "plan": "plan"
  };

  var root = document.documentElement;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function badge(status) {
    return el("span", "badge " + (STATUS_CLASS[status] || "idle"), status || "—");
  }

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- 主题 ---------- */
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }
  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      themeBtn.setAttribute("aria-pressed", next === "light" ? "true" : "false");
    });
  }

  /* ---------- 渲染 ---------- */
  function renderMeta(meta) {
    var name = meta.name || "Christinachloe";
    document.getElementById("brandName").textContent = name;
    document.getElementById("heroName").textContent = name;
    document.getElementById("heroGreeting").textContent = meta.greeting || "你好，我是";
    document.getElementById("heroTagline").textContent = meta.tagline || "";
    document.getElementById("heroIntro").textContent = meta.intro || "";
    document.title = name + (meta.tagline ? " · " + meta.tagline : "");

    var links = document.getElementById("heroLinks");
    links.textContent = "";
    (meta.links || []).forEach(function (l) {
      if (!l || !l.url || !l.label) return;
      var a = el("a", null, l.label);
      a.href = l.url;
      a.rel = "noopener";
      if (/^https?:/.test(l.url)) a.target = "_blank";
      links.appendChild(a);
      if (/github/i.test(l.label) || /github\.com/i.test(l.url)) {
        var cta = document.getElementById("ctaGithub");
        if (cta) cta.href = l.url;
      }
    });

    var upd = document.getElementById("updated");
    if (upd) upd.textContent = meta.updated ? "最后更新 " + meta.updated : "";
  }

  function renderProjects(list) {
    var box = document.getElementById("projectList");
    box.textContent = "";
    document.getElementById("projectCount").textContent = list.length ? list.length + " 个" : "";

    if (!list.length) {
      box.appendChild(el("p", null, "还没有项目条目，去 site.json 里加。"));
      return;
    }

    list.forEach(function (p, i) {
      var card = el("article", "card reveal");

      var top = el("div", "card-top");
      top.appendChild(el("h3", null, (pad2(i + 1)) + " · " + (p.name || "未命名")));
      top.appendChild(badge(p.status));
      card.appendChild(top);

      if (p.summary) card.appendChild(el("p", null, p.summary));
      if (p.note) card.appendChild(el("p", "note", p.note));

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
          var a = el("a", null, pair[0] + " ↗");
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
    document.getElementById("goalCount").textContent = list.length ? list.length + " 阶段" : "";
    if (!list.length) {
      box.appendChild(el("p", null, "还没有目标条目。"));
      return;
    }
    list.forEach(function (g) {
      var item = el("div", "goal reveal");
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
    document.getElementById("workCount").textContent = list.length ? list.length + " 条" : "";
    if (!list.length) {
      box.appendChild(el("li", null, "还没有成果条目。"));
      return;
    }
    list.forEach(function (w) {
      var li = el("li", "reveal");
      li.appendChild(el("span", "date", w.date || ""));
      var body = el("div");
      var t = el("div", "wtitle");
      if (w.link) {
        var a = el("a", null, (w.title || "") + " ↗");
        a.href = w.link; a.target = "_blank"; a.rel = "noopener";
        t.appendChild(a);
      } else {
        t.textContent = w.title || "";
      }
      body.appendChild(t);
      if (w.desc) body.appendChild(el("div", "wdesc", w.desc));
      li.appendChild(body);
      box.appendChild(li);
    });
  }

  /* ---------- 滚动渐入 + 当前章节 ---------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  }

  function setupNav() {
    var links = [].slice.call(document.querySelectorAll(".nav a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute("href"));
      if (sec) map[sec.id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          links.forEach(function (x) { x.removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
    window.addEventListener("scroll", function () {
      if (window.scrollY < 80) links.forEach(function (x) { x.removeAttribute("aria-current"); });
    }, { passive: true });
  }

  /* ---------- 启动 ---------- */
  document.getElementById("footText").textContent =
    "© " + new Date().getFullYear() + " · 内容在 site.json 里维护 · 纯静态零构建";

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
      setupReveal();
      setupNav();
    })
    .catch(function (e) {
      document.getElementById("heroName").textContent = "数据没加载上";
      document.getElementById("heroIntro").textContent =
        "site.json 读取失败（" + e.message + "）。直接双击 index.html 会因浏览器本地文件限制看不到数据，起个本地服务即可：python -m http.server";
    });
})();
