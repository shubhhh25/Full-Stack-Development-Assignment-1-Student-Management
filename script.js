const $ = (id) => document.getElementById(id);
const form = $("regForm"), rf = $("resForm");
const SUBJECTS = ["Maths", "Programming", "Database", "English"], PASS = 40;
let db = { students: {}, results: {} };
try { db = JSON.parse(localStorage.getItem("studentPortalV3")) || db; } catch (e) {}
const save = () => { try { localStorage.setItem("studentPortalV3", JSON.stringify(db)); } catch (e) {} };
const h = (tag, cls, txt) => {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (txt != null) el.textContent = txt;
  return el;
};

const rules = {
  fullName: (v) => (/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v) ? "" : "Letters only, at least 3 characters."),
  enrollment: (v) => (/^[A-Za-z0-9]{5,15}$/.test(v) ? "" : "5-15 letters or digits."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email."),
  phone: (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "10 digits, starting with 6-9."),
  course: (v) => (v ? "" : "Choose a course."),
  semester: (v) => (v ? "" : "Choose a semester."),
};
function check(id, rule = id) {
  const el = $(id), msg = rules[rule](el.value.trim());
  el.closest(".field").querySelector(".error").textContent = msg;
  el.classList.toggle("invalid", Boolean(msg));
  return !msg;
}
const clearErrors = (f) => {
  f.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  f.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
};

// ---------- Registration ----------
form.addEventListener("input", () => ($("done").hidden = true));
$("phone").addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")));
$("clear").onclick = () => { form.reset(); clearErrors(form); $("done").hidden = true; };

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!["fullName", "enrollment", "email", "phone", "course", "semester"].map((id) => check(id)).every(Boolean)) return;
  const en = $("enrollment").value.trim();
  db.students[en] = { name: $("fullName").value.trim(), course: $("course").value, semester: $("semester").value };
  save();
  form.reset();
  $("done").textContent = db.students[en].name + " has been registered successfully.";
  $("done").hidden = false;
});

// ---------- Tabs ----------
function show(res) {
  $("regView").hidden = res;
  $("resView").hidden = !res;
  $("tabReg").classList.toggle("active", !res);
  $("tabRes").classList.toggle("active", res);
  if (res) {
    $("enList").replaceChildren(...Object.keys(db.students).map((k) => new Option(db.students[k].name, k)));
    render();
  }
  window.scrollTo({ top: 0 });
}
$("tabReg").onclick = () => show(false);
$("tabRes").onclick = () => show(true);

// ---------- Results ----------
let flt = "all";
$("marksBox").innerHTML = SUBJECTS.map((s, i) =>
  `<div class="field"><label for="m${i}">${s}</label><input type="text" inputmode="numeric" id="m${i}" maxlength="3" placeholder="0-100"><small class="error"></small></div>`).join("");
$("marksBox").addEventListener("input", (e) => (e.target.value = e.target.value.replace(/\D/g, "")));
$("rEn").addEventListener("input", () => {
  const s = db.students[$("rEn").value.trim()];
  if (s) $("rName").value = s.name;
});

const grade = (p) => (p >= 90 ? "O" : p >= 80 ? "A+" : p >= 70 ? "A" : p >= 60 ? "B" : p >= 50 ? "C" : p >= PASS ? "D" : "F");

rf.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = [check("rEn", "enrollment"), check("rName", "fullName")].every(Boolean);
  const marks = SUBJECTS.map((_, i) => {
    const inp = $("m" + i), v = inp.value.trim(), bad = v === "" || +v > 100;
    inp.closest(".field").querySelector(".error").textContent = bad ? "0 to 100." : "";
    inp.classList.toggle("invalid", bad);
    if (bad) ok = false;
    return +v;
  });
  if (!ok) return;
  const en = $("rEn").value.trim(), exam = $("rExam").value;
  const percent = marks.reduce((a, b) => a + b, 0) / SUBJECTS.length;
  const passed = marks.every((m) => m >= PASS);
  db.results[en + "|" + exam] = {
    enrollment: en, name: $("rName").value.trim(), exam, marks,
    percent: Math.round(percent * 10) / 10, grade: passed ? grade(percent) : "F", passed,
  };
  save();
  rf.reset();
  render();
});
rf.addEventListener("reset", () => { clearErrors(rf); $("rSave").textContent = "Save result"; });
$("rSearch").addEventListener("input", render);
$("flt").addEventListener("click", (e) => {
  if (!e.target.dataset.f) return;
  flt = e.target.dataset.f;
  $("flt").querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === e.target));
  render();
});

function render() {
  const q = $("rSearch").value.trim().toLowerCase();
  const all = Object.values(db.results);
  const rows = all.filter((r) =>
    (flt === "all" || (flt === "pass") === r.passed) &&
    (!q || r.name.toLowerCase().includes(q) || r.enrollment.toLowerCase().includes(q)));

  $("sCount").textContent = all.length;
  $("sPass").textContent = (all.length ? Math.round((all.filter((r) => r.passed).length / all.length) * 100) : 0) + "%";
  $("sAvg").textContent = (all.length ? (all.reduce((a, r) => a + r.percent, 0) / all.length).toFixed(1) : 0) + "%";

  const grid = $("rGrid");
  grid.replaceChildren();
  if (!rows.length) {
    grid.append(h("p", "empty", all.length ? "No results match." : "No results yet. Add marks above to create the first card."));
    return;
  }

  rows.forEach((r) => {
    const s = db.students[r.enrollment], pct = Math.min(100, Number(r.percent) || 0);
    const card = h("article", "rc" + (r.passed ? "" : " bad"));

    const ring = h("div");
    ring.innerHTML = `<svg class="ring" viewBox="0 0 80 80"><circle class="bg" cx="40" cy="40" r="34"/><circle class="fg" cx="40" cy="40" r="34" stroke-dasharray="${(pct * 2.136).toFixed(1)} 213.6" transform="rotate(-90 40 40)"/><text x="40" y="46" text-anchor="middle">${pct}%</text></svg>`;

    const info = h("div", "info"), tags = h("div", "tags");
    tags.append(h("span", "tag", "Grade " + r.grade), h("span", "tag " + (r.passed ? "pass" : "fail"), r.passed ? "Pass" : "Fail"));
    info.append(h("b", null, r.name), h("small", null, r.enrollment + (s ? " · " + s.course + " Sem " + s.semester : "")), h("small", null, r.exam), tags);

    const subs = h("div", "subs");
    SUBJECTS.forEach((sub, i) => {
      const sp = h("span", null, sub + " "), em = h("em", r.marks[i] < PASS ? "low" : null, r.marks[i]);
      sp.append(em);
      subs.append(sp);
    });

    const links = h("div", "links"), edit = h("button", null, "Edit"), del = h("button", null, "Delete");
    edit.type = del.type = "button";
    edit.onclick = () => {
      $("rEn").value = r.enrollment; $("rName").value = r.name; $("rExam").value = r.exam;
      r.marks.forEach((m, i) => ($("m" + i).value = m));
      $("rSave").textContent = "Update result";
      rf.scrollIntoView({ behavior: "smooth" });
    };
    del.onclick = () => {
      if (confirm("Delete this result?")) { delete db.results[r.enrollment + "|" + r.exam]; save(); render(); }
    };
    links.append(edit, del);
    card.append(ring, info, subs, links);
    grid.append(card);
  });
}
