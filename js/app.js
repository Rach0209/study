/* 독학 스터디 — 학습 앱 엔진
 * 콘텐츠(content/*.js)는 window.STUDY_TRACKS 에 트랙을 push 하면 자동 등록됩니다.
 * 진도는 브라우저 localStorage 에 저장되며, 설정 화면에서 백업/복원할 수 있습니다.
 */
(() => {
'use strict';

const TRACKS = (window.STUDY_TRACKS || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
const PLANNED = window.STUDY_PLANNED || [];
const $app = document.getElementById('app');
const $side = document.getElementById('side');
const KEY = 'study.v1';

/* ---------- 유틸 ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => ymd(new Date());
const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return ymd(new Date(y, m - 1, d + n)); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- 인덱스 ---------- */
const LES = {};   // lessonId -> {lesson, track, idx}
const QS = {};    // questionId -> {q, lesson, track}
TRACKS.forEach(t => t.lessons.forEach((l, idx) => {
  LES[l.id] = { lesson: l, track: t, idx };
  (l.quiz || []).forEach((q, i) => { QS[`${l.id}#${i}`] = { q, lesson: l, track: t, id: `${l.id}#${i}` }; });
}));

/* ---------- 저장소 ---------- */
let storageOK = true;
const blank = () => ({ v: 1, lessons: {}, cards: {}, ex: {}, log: {} });
let S = blank();
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || 'null') || {}); } catch (e) { storageOK = false; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { storageOK = false; } }
function logActivity(n = 1) { const d = today(); S.log[d] = (S.log[d] || 0) + n; }

/* ---------- 복습 카드 (라이트너 박스) ----------
 * 틀린 문제 → 박스 1. 복습에서 맞힐 때마다 박스+1, 간격은 1·3·7·14일. 박스 6 이 되면 '정복'.
 */
const INTERVALS = [0, 0, 1, 3, 7, 14];
function cardWrong(id) {
  const c = S.cards[id] || (S.cards[id] = { box: 1, due: today(), wrong: 0 });
  c.box = 1; c.due = today(); c.wrong++; c.mastered = false;
}
function cardRight(id) {
  const c = S.cards[id]; if (!c || c.mastered) return;
  c.box++;
  if (c.box >= 6) { c.mastered = true; } else { c.due = addDays(today(), INTERVALS[c.box]); }
}
const dueCards = () => Object.keys(S.cards).filter(id => QS[id] && !S.cards[id].mastered && S.cards[id].due <= today());
const activeCards = () => Object.keys(S.cards).filter(id => QS[id] && !S.cards[id].mastered);

function streak() {
  let d = today(), n = 0;
  if (!S.log[d]) d = addDays(d, -1);
  while (S.log[d]) { n++; d = addDays(d, -1); }
  return n;
}
const isDone = id => !!(S.lessons[id] && S.lessons[id].done);
const trackProgress = t => { const done = t.lessons.filter(l => isDone(l.id)).length; return { done, total: t.lessons.length, pct: Math.round(done / t.lessons.length * 100) }; };
function nextLesson() {
  for (const t of TRACKS) for (const l of t.lessons) if (!isDone(l.id)) return { track: t, lesson: l };
  return null;
}

/* ---------- 코드 하이라이트 ---------- */
const words = s => new Set(s.split(/\s+/));
const LANG = {
  python: {
    kw: words('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield self'),
    ty: words('int float str bool list dict set tuple print len range input type isinstance open sum min max sorted enumerate zip'),
    cm: String.raw`#[^\n]*`, pp: '(?!)',
    str: String.raw`[rRbBfF]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')`
  },
  cpp: {
    kw: words('alignas auto bool break case catch char class const constexpr continue default delete do double else enum explicit false final float for friend if inline int long mutable namespace new noexcept nullptr operator override private protected public return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while'),
    ty: words('string vector map unordered_map set array unique_ptr shared_ptr make_unique make_shared cout cin cerr endl size_t std pair optional'),
    cm: String.raw`//[^\n]*|/\*[\s\S]*?\*/`, pp: String.raw`^[ \t]*#[ \t]*\w+[^\n]*`,
    str: String.raw`R"\([\s\S]*?\)"|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'`
  },
  java: {
    kw: words('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new null package private protected public return short static super switch synchronized this throw throws try var void volatile while true false record'),
    ty: words('String Integer Double Boolean Character List ArrayList Map HashMap Set HashSet Optional System Math Object Exception Scanner Arrays Collections Stream'),
    cm: String.raw`//[^\n]*|/\*[\s\S]*?\*/`, pp: '(?!)',
    str: String.raw`"""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'`
  }
};
LANG.c = LANG.cpp;
const RE_CACHE = {};
function highlight(code, lang) {
  const L = LANG[lang];
  if (!L) return esc(code);
  const re = RE_CACHE[lang] || (RE_CACHE[lang] = new RegExp(`(${L.cm})|(${L.pp})|(${L.str})|(\\b\\d[\\d_.]*(?:[eE][+-]?\\d+)?[fFlLuU]*\\b)|([A-Za-z_]\\w*)`, 'gm'));
  re.lastIndex = 0;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    if (m[0] === '') { re.lastIndex++; continue; }
    out += esc(code.slice(last, m.index));
    last = re.lastIndex;
    const t = esc(m[0]);
    if (m[1] !== undefined) out += `<span class="tc">${t}</span>`;
    else if (m[2] !== undefined) out += `<span class="tp">${t}</span>`;
    else if (m[3] !== undefined) out += `<span class="ts">${t}</span>`;
    else if (m[4] !== undefined) out += `<span class="tn">${t}</span>`;
    else if (L.kw.has(m[5])) out += `<span class="tk">${t}</span>`;
    else if (L.ty.has(m[5])) out += `<span class="tt">${t}</span>`;
    else if (code[last] === '(') out += `<span class="tf">${t}</span>`;
    else out += t;
  }
  return out + esc(code.slice(last));
}
function codeBlock(code, lang) {
  code = code.replace(/^\n|\n$/g, '');
  return `<div class="codewrap">${lang ? `<span class="lang">${esc(lang)}</span>` : ''}<pre class="code"><code>${highlight(code, lang)}</code></pre><button class="copy" data-act="copy">복사</button></div>`;
}

/* ---------- 미니 마크다운 ---------- */
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}
function md(text) {
  if (Array.isArray(text)) text = text.join('\n');   // 콘텐츠에서는 줄 단위 배열로 쓰면 편함
  const lines = String(text).replace(/\r/g, '').split('\n');
  let html = '', i = 0;
  const isTableSep = l => /^\s*\|?\s*:?-{2,}/.test(l || '') && (l || '').includes('|');
  while (i < lines.length) {
    const ln = lines[i];
    if (/^\s*$/.test(ln)) { i++; continue; }
    const fence = ln.match(/^```(\w*)\s*$/);
    if (fence) {
      const buf = []; i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) buf.push(lines[i++]);
      i++; html += codeBlock(buf.join('\n'), fence[1]); continue;
    }
    if (/^###\s+/.test(ln)) { html += `<h3>${inline(ln.replace(/^###\s+/, ''))}</h3>`; i++; continue; }
    if (ln.trim().startsWith('|') && isTableSep(lines[i + 1])) {
      // 셀 안의 \| 는 파이프 문자 그대로 (예: `||` 를 표에 쓸 때)
      const cells = r => r.trim().replace(/\\\|/g, '\u0001').replace(/^\||\|$/g, '').split('|').map(c => c.trim().replace(/\u0001/g, '|'));
      const head = cells(ln); i += 2; const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      html += `<table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      continue;
    }
    if (/^\s*(-|\d+\.)\s+/.test(ln)) {
      const ordered = /^\s*\d+\./.test(ln); const items = [];
      while (i < lines.length && (/^\s*(-|\d+\.)\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (/^\s*(-|\d+\.)\s+/.test(lines[i])) items.push(lines[i].replace(/^\s*(-|\d+\.)\s+/, ''));
        else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      html += `<${tag}>${items.map(x => `<li>${inline(x)}</li>`).join('')}</${tag}>`; continue;
    }
    if (/^>\s?/.test(ln)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      html += `<blockquote>${inline(buf.join(' '))}</blockquote>`; continue;
    }
    const buf = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^```/.test(lines[i]) && !/^###\s/.test(lines[i]) && !/^\s*(-|\d+\.)\s+/.test(lines[i]) && !/^>\s?/.test(lines[i])) buf.push(lines[i++].trim());
    html += `<p>${inline(buf.join(' '))}</p>`;
  }
  return html;
}

/* ---------- 퀴즈 러너 ---------- */
let keyHandler = null;
function setKeys(fn) { if (keyHandler) document.removeEventListener('keydown', keyHandler); keyHandler = fn; if (fn) document.addEventListener('keydown', fn); }
const normFill = s => String(s).trim().replace(/\s+/g, ' ');
const answerText = q => q.choices ? q.choices[q.answer] : q.accept[0];

/* items: [{id, q}], opts: {onAnswer(item, ok, retry), onDone(results), requeueWrong} */
function runQuiz(root, items, opts) {
  const queue = items.slice(), results = [];
  let i = 0;
  const total0 = items.length;

  function show() {
    if (i >= queue.length) { setKeys(null); opts.onDone(results); return; }
    const it = queue[i], q = it.q, retry = !!it.retry;
    const order = q.choices ? shuffle(q.choices.map((_, k) => k)) : null;
    let answered = false;

    root.innerHTML = `<div class="qcard">
      <div class="qhead"><span>${retry ? '🔁 다시 도전' : `문제 ${Math.min(results.length + 1, total0)} / ${total0}`}</span><span>${esc(it.tag || '')}</span></div>
      <div class="bar"><i style="width:${Math.round(results.length / total0 * 100)}%"></i></div>
      <div class="qtext" style="margin-top:14px">${md(q.q)}</div>
      ${q.code ? codeBlock(q.code, q.lang) : ''}
      ${order
        ? `<div class="choices">${order.map((k, n) => `<button class="choice" data-k="${k}"><span class="k">${n + 1}</span><span>${inline(q.choices[k])}</span></button>`).join('')}</div>`
        : `<div class="fill"><input type="text" autocomplete="off" spellcheck="false" placeholder="정답 입력 후 Enter"><button class="btn">확인</button></div>`}
      <div class="fb"></div>
    </div>`;

    const fb = root.querySelector('.fb');
    function finish(ok) {
      answered = true;
      if (!retry) results.push({ item: it, ok });
      opts.onAnswer(it, ok, retry);
      if (!ok && opts.requeueWrong && !retry) queue.push({ ...it, retry: true });
      const last = i + 1 >= queue.length;
      fb.innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}"><b class="t">${ok ? '✅ 정답!' : '❌ 오답'}</b>
        ${ok ? '' : `<div><b>정답:</b> ${inline(answerText(q))}</div>`}
        <div style="margin-top:6px">${md(q.explain)}</div></div>
        <div class="row"><button class="btn" data-next>${last ? '결과 보기' : '다음 문제 →'}</button><span class="muted">(Enter)</span></div>`;
      fb.querySelector('[data-next]').focus();
      fb.querySelector('[data-next]').onclick = () => { i++; show(); };
    }

    if (order) {
      const btns = [...root.querySelectorAll('.choice')];
      btns.forEach(b => b.onclick = () => {
        if (answered) return;
        const k = +b.dataset.k, ok = k === q.answer;
        btns.forEach(x => { x.disabled = true; if (+x.dataset.k === q.answer) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        finish(ok);
      });
      setKeys(e => {
        if (e.target.tagName === 'INPUT') return;
        if (!answered && /^[1-9]$/.test(e.key) && btns[+e.key - 1]) btns[+e.key - 1].click();
        else if (answered && e.key === 'Enter') { e.preventDefault(); fb.querySelector('[data-next]').click(); }
      });
    } else {
      const input = root.querySelector('input'), btn = root.querySelector('.fill .btn');
      const submit = () => {
        if (answered || !input.value.trim()) return;
        const v = normFill(input.value), ok = q.accept.some(a => normFill(a) === v);
        input.disabled = true; btn.disabled = true; finish(ok);
      };
      btn.onclick = submit;
      input.onkeydown = e => { if (e.key === 'Enter') submit(); };
      input.focus();
      setKeys(e => { if (answered && e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); fb.querySelector('[data-next]').click(); } });
    }
  }
  show();
}

function wrongList(results) {
  const bad = results.filter(r => !r.ok);
  if (!bad.length) return '';
  return `<h3>다시 확인할 문제 (${bad.length})</h3>` + bad.map(r => `<div class="wrong-item">
    <div><b>${md(r.item.q.q)}</b></div>${r.item.q.code ? codeBlock(r.item.q.code, r.item.q.lang) : ''}
    <div><span class="badge ok">정답</span> ${inline(answerText(r.item.q))}</div>
    <div class="muted">${md(r.item.q.explain)}</div></div>`).join('');
}

/* ---------- 화면: 홈 ---------- */
function viewHome() {
  const nx = nextLesson(), due = dueCards().length;
  const doneAll = TRACKS.reduce((n, t) => n + trackProgress(t).done, 0);
  const totalAll = TRACKS.reduce((n, t) => n + t.lessons.length, 0);
  const solved = S.log[today()] || 0;
  return `
  <h1>오늘도 한 걸음 📘</h1>
  <p class="muted">읽기 → <b>직접 쳐보기</b> → 퀴즈 → 오답 복습. 이 순서를 지키면 "알겠는데 못 푸는" 상태를 막을 수 있어요.</p>
  ${storageOK ? '' : '<div class="warnbox">⚠ 브라우저 저장소를 쓸 수 없어 진도가 저장되지 않습니다. (시크릿 모드이거나 저장소가 차단됨)</div>'}
  <div class="grid">
    <div class="card stat"><b>${doneAll}/${totalAll}</b><span>완료한 레슨</span></div>
    <div class="card stat"><b>${streak()}일</b><span>연속 학습</span></div>
    <div class="card stat"><b>${solved}</b><span>오늘 푼 문제</span></div>
    <div class="card stat"><b style="color:${due ? 'var(--bad)' : 'var(--ok)'}">${due}</b><span>오늘 복습할 문제</span></div>
  </div>
  <div class="card">
    <h3 style="margin-top:0">🎯 오늘 할 일</h3>
    <ol>
      <li>${due ? `<a href="#/review"><b>복습 ${due}문제</b></a> 먼저 풀기 (5분 안팎)` : '복습할 문제 없음 — 좋아요!'}</li>
      <li>${nx ? `새 레슨: <a href="#/lesson/${nx.lesson.id}"><b>${esc(nx.track.title)} · ${esc(nx.lesson.title)}</b></a>` : '모든 레슨을 마쳤어요 🎉 오답노트를 정리해 보세요.'}</li>
      <li>레슨의 <b>"직접 해보기"</b>는 눈으로만 읽지 말고 실제로 코드를 쳐서 실행해 보기</li>
    </ol>
    ${nx ? `<a class="btn" href="#/lesson/${nx.lesson.id}">이어서 학습하기 →</a>` : ''}
  </div>
  <h2>학습 트랙</h2>
  ${TRACKS.map(t => { const p = trackProgress(t); return `<a class="card track-card" style="display:block;color:inherit;border-left-color:${t.color}" href="#/track/${t.id}">
    <h3>${t.icon} ${esc(t.title)} <span class="badge">${esc(t.level)}</span></h3>
    <div class="muted">${esc(t.desc)}</div>
    <div class="row" style="margin-top:8px"><div class="bar" style="flex:1"><i style="width:${p.pct}%;background:${t.color}"></i></div><small>${p.done}/${p.total}</small></div></a>`; }).join('')}
  <p><a href="#/roadmap">앞으로의 로드맵(임베디드·로봇·AI 포함) 보기 →</a></p>`;
}

/* ---------- 화면: 트랙 ---------- */
function viewTrack(id) {
  const t = TRACKS.find(x => x.id === id); if (!t) return notFound();
  const p = trackProgress(t);
  let unit = null, rows = '';
  t.lessons.forEach((l, i) => {
    if (l.unit !== unit) { unit = l.unit; rows += `<div class="unit-title">${esc(unit || '')}</div>`; }
    const st = S.lessons[l.id] || {};
    rows += `<a class="lrow ${st.done ? 'done' : ''}" href="#/lesson/${l.id}"><span class="no">${st.done ? '✓' : i + 1}</span>
      <span class="t">${esc(l.title)}<br><small>${esc(l.summary)}</small></span><small>${esc(l.time)}${st.best != null ? ` · 최고 ${st.best}%` : ''}</small></a>`;
  });
  return `<div class="crumb"><a href="#/">홈</a> › 트랙</div>
  <h1>${t.icon} ${esc(t.title)}</h1>
  <p>${esc(t.desc)}</p>
  <div class="card"><b>선수 지식:</b> ${esc(t.prereq)}<br><b>준비물:</b> ${esc(t.setup)}
    <div class="row" style="margin-top:10px"><div class="bar" style="flex:1"><i style="width:${p.pct}%;background:${t.color}"></i></div><small>${p.done}/${p.total} 완료</small></div></div>
  ${rows}`;
}

/* ---------- 화면: 레슨 ---------- */
function viewLesson(id) {
  const ref = LES[id]; if (!ref) return notFound();
  const { lesson: l, track: t, idx } = ref, st = S.lessons[id] || {};
  const prev = t.lessons[idx - 1], next = t.lessons[idx + 1];
  const sec = (title, body) => body ? `<h2>${title}</h2>${body}` : '';
  const html = `
  <article class="lesson" style="--accent:${t.color}">
  <div class="crumb"><a href="#/">홈</a> › <a href="#/track/${t.id}">${esc(t.title)}</a> › ${esc(l.unit || '')}</div>
  <h1>${idx + 1}. ${esc(l.title)}</h1>
  <p class="muted">⏱ ${esc(l.time)} ${st.done ? `<span class="badge ok">완료 · 최고 ${st.best}%</span>` : ''}</p>
  <div class="summary"><b>한 줄 요약</b> — ${inline(l.summary)}</div>
  <div class="card goals"><b>🎯 이 레슨이 끝나면</b><ul>${l.goals.map(g => `<li>${inline(g)}</li>`).join('')}</ul></div>
  ${l.terms && l.terms.length ? `<div class="card terms"><b>📖 먼저 알아둘 용어</b><dl>${l.terms.map(x => `<dt>${inline(x.t)}</dt><dd>${inline(x.d)}</dd>`).join('')}</dl></div>` : ''}
  ${l.sections.map(s => `<h2>${esc(s.h)}</h2>${md(s.md)}`).join('')}
  ${sec('⚠ 흔한 오해 바로잡기', (l.misconceptions || []).map(m => `<div class="mis">
      <div class="w">❌ <b>오해</b> — ${inline(m.wrong)}</div><div class="r">✅ <b>실제</b> — ${inline(m.right)}</div>
      <div class="why">${inline(m.why)}</div></div>`).join(''))}
  ${sec('💻 코드로 확인하기', (l.examples || []).map(e => `<div class="ex-title">${esc(e.title)}</div>${codeBlock(e.code, e.lang)}
      ${e.output != null ? `<div class="outlabel">실행 결과</div><pre class="out">${esc(e.output.replace(/^\n|\n$/g, ''))}</pre>` : ''}
      ${e.notes ? `<ul class="notes">${e.notes.map(n => `<li>${inline(n)}</li>`).join('')}</ul>` : ''}`).join(''))}
  ${sec('✍ 직접 해보기', (l.exercises || []).map((x, i) => `<div class="exercise"><label><input type="checkbox" data-ex="${id}@${i}" ${S.ex[`${id}@${i}`] ? 'checked' : ''}><span>${inline(x.q)}</span></label>
      <details><summary>힌트</summary>${md(x.hint)}</details><details><summary>예시 답안 (먼저 직접 풀어본 뒤에 열기)</summary>${md(x.answer)}</details></div>`).join(''))}
  <h2>✅ 확인 퀴즈</h2>
  <p class="muted">${l.quiz.length}문제 · 80% 이상이면 레슨 완료. 틀린 문제는 오답노트에 저장되어 며칠 뒤 다시 나옵니다.</p>
  <div id="quizArea"><button class="btn" data-act="startQuiz">퀴즈 시작</button></div>
  <div class="row" style="margin-top:40px;justify-content:space-between">
    ${prev ? `<a class="btn ghost" href="#/lesson/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
    ${next ? `<a class="btn ghost" href="#/lesson/${next.id}">${esc(next.title)} →</a>` : ''}
  </div></article>`;
  return { html, after() {
    const area = document.getElementById('quizArea');
    const start = () => {
      const items = l.quiz.map((q, i) => ({ id: `${id}#${i}`, q, tag: l.title }));
      runQuiz(area, shuffle(items), {
        onAnswer(it, ok) {
          logActivity();
          if (ok) { if (S.cards[it.id] && S.cards[it.id].due <= today()) cardRight(it.id); } else cardWrong(it.id);
          save(); renderSide();
        },
        onDone(results) {
          const right = results.filter(r => r.ok).length, pct = Math.round(right / results.length * 100);
          const rec = S.lessons[id] || (S.lessons[id] = { attempts: 0, best: 0, done: false });
          rec.attempts++; rec.best = Math.max(rec.best, pct); rec.last = today();
          const passed = pct >= 80; if (passed) rec.done = true;
          save(); renderSide();
          area.innerHTML = `<div class="qcard"><div class="result-big">${right} / ${results.length} <span class="muted" style="font-size:1rem">(${pct}%)</span></div>
            <p>${passed ? '🎉 <b>레슨 완료!</b> ' + (next ? '다음 레슨으로 넘어가세요.' : '트랙을 모두 마쳤어요!') : '조금만 더! 아래 설명을 다시 읽고 재도전해 보세요. (80% 이상이면 완료)'}</p>
            <div class="row"><button class="btn ghost" data-act="startQuiz">다시 풀기</button>
            ${next ? `<a class="btn" href="#/lesson/${next.id}">다음: ${esc(next.title)} →</a>` : `<a class="btn" href="#/track/${t.id}">트랙으로</a>`}</div>
            ${wrongList(results)}</div>`;
        }
      });
      area.scrollIntoView({ block: 'center' });
    };
    area.addEventListener('click', e => { if (e.target.closest('[data-act="startQuiz"]')) start(); });
  } };
}

/* ---------- 화면: 복습 / 오답노트 ---------- */
function viewReview() {
  const ids = dueCards();
  if (!ids.length) {
    const upcoming = activeCards().map(id => S.cards[id].due).sort()[0];
    return { html: `<h1>🔁 복습</h1><div class="card empty"><div style="font-size:2.5rem">🎉</div><p><b>오늘 복습할 문제가 없어요.</b></p>
      <p>${upcoming ? `다음 복습 예정일: ${upcoming}` : '레슨 퀴즈에서 틀린 문제가 여기 쌓입니다.'}</p><a class="btn" href="#/">홈으로</a></div>` };
  }
  return { html: `<h1>🔁 오늘의 복습 <span class="badge warn">${ids.length}문제</span></h1>
    <p class="muted">맞히면 복습 간격이 늘어나고(1·3·7·14일), 5번 연속 맞히면 "정복" 처리됩니다. 틀리면 처음부터 다시 시작해요.</p><div id="quizArea"></div>`,
    after() {
      const items = shuffle(ids).map(id => ({ id, q: QS[id].q, tag: QS[id].lesson.title }));
      runQuiz(document.getElementById('quizArea'), items, {
        requeueWrong: true,
        onAnswer(it, ok, retry) { logActivity(); if (!retry) { ok ? cardRight(it.id) : cardWrong(it.id); } save(); renderSide(); },
        onDone(results) {
          const right = results.filter(r => r.ok).length;
          document.getElementById('quizArea').innerHTML = `<div class="qcard"><div class="result-big">${right} / ${results.length}</div>
            <p>복습 끝! 한 번에 맞힌 문제는 간격이 늘어났어요.</p><a class="btn" href="#/">홈으로</a>${wrongList(results)}</div>`;
        }
      });
    } };
}
function viewNotes() {
  const ids = activeCards().sort((a, b) => S.cards[a].due.localeCompare(S.cards[b].due));
  const mastered = Object.keys(S.cards).filter(id => QS[id] && S.cards[id].mastered).length;
  return `<h1>📓 오답노트</h1>
  <p class="muted">진행 중 ${ids.length}문제 · 정복 ${mastered}문제</p>
  ${ids.length ? `<a class="btn" href="#/review">${dueCards().length ? '오늘 복습 시작' : '복습 화면'}</a>` : ''}
  ${ids.length ? '' : '<div class="card empty">아직 틀린 문제가 없어요. 퀴즈를 풀어 보세요!</div>'}
  ${ids.map(id => { const r = QS[id], c = S.cards[id]; return `<div class="card">
    <div class="row" style="justify-content:space-between"><span class="badge">${esc(r.track.title)} · ${esc(r.lesson.title)}</span>
    <span class="muted">박스 ${c.box}/5 · 오답 ${c.wrong}회 · 다음 복습 ${c.due <= today() ? '<b style="color:var(--bad)">오늘</b>' : c.due}</span></div>
    <div style="margin-top:8px"><b>${md(r.q.q)}</b></div>${r.q.code ? codeBlock(r.q.code, r.q.lang) : ''}
    <details><summary>정답과 해설 보기</summary><p><b>정답:</b> ${inline(answerText(r.q))}</p>${md(r.q.explain)}</details></div>`; }).join('')}`;
}

/* ---------- 화면: 로드맵 / 설정 ---------- */
function viewRoadmap() {
  return `<h1>🗺 로드맵</h1>
  <p class="muted">지금은 <b>프로그래밍 기초 3개 언어</b>를 다집니다. 아래 "예정" 트랙은 기초가 끝난 뒤 추가할 수 있도록 미리 설계해 둔 것입니다.</p>
  <h2>지금 학습 가능</h2>
  ${TRACKS.map(t => `<a class="card track-card" style="display:block;color:inherit;border-left-color:${t.color}" href="#/track/${t.id}"><b>${t.icon} ${esc(t.title)}</b> — ${esc(t.desc)}</a>`).join('')}
  <h2>예정 트랙</h2>
  ${PLANNED.map(p => `<div class="card planned"><b>${p.icon} ${esc(p.title)}</b> <span class="badge warn">${esc(p.when)}</span>
    <p class="muted" style="margin:4px 0">${esc(p.why)}</p><ul>${p.topics.map(x => `<li>${inline(x)}</li>`).join('')}</ul></div>`).join('')}`;
}
function viewSettings() {
  return { html: `<h1>⚙ 설정 · 백업</h1>
  <div class="card"><h3 style="margin-top:0">진도 백업 / 복원</h3>
    <p>진도는 <b>이 브라우저</b>에만 저장됩니다. 브라우저를 바꾸거나 사이트 데이터를 지우면 사라지니, 가끔 백업해 두세요.</p>
    <div class="row"><button class="btn" data-act="export">백업 파일 저장</button>
    <label class="btn ghost">백업 파일 불러오기<input type="file" accept="application/json" hidden data-act="import"></label></div></div>
  <div class="card"><h3 style="margin-top:0">초기화</h3><p>모든 진도와 오답노트를 지웁니다.</p><button class="btn ghost" data-act="reset" style="color:var(--bad);border-color:var(--bad)">전체 초기화</button></div>
  <div class="card"><h3 style="margin-top:0">단축키</h3><p>퀴즈: <code>1</code>~<code>4</code> 보기 선택 · <code>Enter</code> 다음 문제</p></div>`,
  after() {
    $app.querySelector('[data-act="export"]').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
      a.download = `study-progress-${today()}.json`; a.click();
    };
    $app.querySelector('[data-act="import"]').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); if (!d || d.v !== 1) throw 0; S = Object.assign(blank(), d); save(); alert('불러왔어요!'); route(); } catch { alert('올바른 백업 파일이 아닙니다.'); } };
      r.readAsText(f);
    };
    $app.querySelector('[data-act="reset"]').onclick = () => { if (confirm('정말 모든 진도를 지울까요? 되돌릴 수 없습니다.')) { S = blank(); save(); route(); } };
  } };
}
function notFound() { return '<h1>찾을 수 없어요</h1><a href="#/">홈으로</a>'; }

/* ---------- 사이드바 / 라우터 ---------- */
function renderSide() {
  const h = location.hash || '#/';
  const cur = (h.match(/^#\/lesson\/(.+)$/) || [])[1];
  const curTrack = cur && LES[cur] ? LES[cur].track.id : (h.match(/^#\/track\/(.+)$/) || [])[1];
  const nav = (href, label, extra = '') => `<a class="nav ${h === href ? 'on' : ''}" href="${href}"><span>${label}</span>${extra}</a>`;
  const due = dueCards().length;
  $side.innerHTML = `<a class="logo" href="#/">📘 독학 스터디</a>
    ${nav('#/', '🏠 홈')}${nav('#/review', '🔁 복습', due ? `<span class="pill">${due}</span>` : '')}${nav('#/notes', '📓 오답노트')}${nav('#/roadmap', '🗺 로드맵')}${nav('#/settings', '⚙ 설정·백업')}
    <div class="grp">학습 트랙</div>
    ${TRACKS.map(t => { const p = trackProgress(t);
      return nav(`#/track/${t.id}`, `${t.icon} ${esc(t.title)}`, `<small class="muted">${p.done}/${p.total}</small>`) +
        (curTrack === t.id ? `<div class="lessons">${t.lessons.map((l, i) => `<a href="#/lesson/${l.id}" class="${cur === l.id ? 'on' : ''} ${isDone(l.id) ? 'done' : ''}">${i + 1}. ${esc(l.title)}</a>`).join('')}</div>` : ''); }).join('')}`;
}
function route() {
  setKeys(null);
  document.body.classList.remove('menu-open');
  const h = location.hash || '#/';
  let m, out;
  if ((m = h.match(/^#\/track\/(.+)$/))) out = viewTrack(m[1]);
  else if ((m = h.match(/^#\/lesson\/(.+)$/))) out = viewLesson(m[1]);
  else if (h === '#/review') out = viewReview();
  else if (h === '#/notes') out = viewNotes();
  else if (h === '#/roadmap') out = viewRoadmap();
  else if (h === '#/settings') out = viewSettings();
  else out = viewHome();
  const obj = typeof out === 'string' ? { html: out } : out;
  $app.innerHTML = obj.html;
  if (obj.after) obj.after();
  renderSide();
  window.scrollTo(0, 0);
}

document.addEventListener('click', e => {
  const copy = e.target.closest('[data-act="copy"]');
  if (copy) {
    const code = copy.parentElement.querySelector('code').innerText;
    (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(() => { copy.textContent = '복사됨'; setTimeout(() => copy.textContent = '복사', 1200); }).catch(() => { copy.textContent = '복사 실패'; });
  }
  if (e.target.id === 'menuBtn') document.body.classList.toggle('menu-open');
  else if (document.body.classList.contains('menu-open') && !e.target.closest('#side')) document.body.classList.remove('menu-open');
});
document.addEventListener('change', e => {
  const x = e.target.dataset && e.target.dataset.ex;
  if (x) { S.ex[x] = e.target.checked; save(); }
});
window.addEventListener('hashchange', route);
route();
})();
