#!/usr/bin/env node
/* 콘텐츠 검증 도구
 *   node tools/verify.js            전체 검사 (구조 + 예제 코드 실행)
 *   node tools/verify.js python     특정 트랙만
 *   node tools/verify.js --no-run   구조만 검사
 *
 * 1) 구조 검사: 필수 필드, 퀴즈 정답 인덱스, 중복 id 등
 * 2) 예제 실행: examples[].code 를 실제로 실행해 output 과 비교 (python / java / cpp / sql)
 *    - sql 은 python 내장 SQLite 로 실행 (tools/sqlrun.py). SQLite 에 없는 Oracle 전용 문법은 noverify: true
 *    - 컴파일러가 없으면 해당 언어는 건너뜁니다 (C++ 는 g++ / clang++ 필요)
 *    - 출력 비교가 불가능한 예제는 noverify: true 로 표시
 */
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process'), os = require('os');
const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const noRun = args.includes('--no-run');
const only = args.find(a => !a.startsWith('--'));

/* ---- 콘텐츠 로드 (index.html 에 적힌 순서대로) ---- */
const sandbox = {}; sandbox.window = sandbox; vm.createContext(sandbox);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const m of html.matchAll(/<script src="(content\/[^"]+)"/g)) {
  try { vm.runInContext(fs.readFileSync(path.join(root, m[1]), 'utf8'), sandbox, { filename: m[1] }); }
  catch (e) { console.error(`✖ ${m[1]} 로드 실패: ${e.message}`); process.exit(1); }
}
const tracks = (sandbox.STUDY_TRACKS || []).filter(t => !only || t.id === only);
if (!tracks.length) { console.error('트랙이 없습니다'); process.exit(1); }

let errors = 0, warns = 0;
const err = (where, msg) => { errors++; console.log(`  ✖ [${where}] ${msg}`); };
const warn = (where, msg) => { warns++; console.log(`  ⚠ [${where}] ${msg}`); };

/* ---- 구조 검사 ---- */
const ids = new Set();
const answerDist = [0, 0, 0, 0, 0];
for (const t of tracks) {
  for (const k of ['id', 'title', 'icon', 'color', 'level', 'desc', 'prereq', 'setup']) if (!t[k]) err(t.id, `트랙 필드 누락: ${k}`);
  t.lessons.forEach(l => {
    const w = l.id;
    if (ids.has(w)) err(w, '중복된 레슨 id'); ids.add(w);
    for (const k of ['unit', 'title', 'time', 'summary']) if (!l[k]) err(w, `필드 누락: ${k}`);
    if (!l.goals || !l.goals.length) err(w, 'goals 없음');
    if (!l.sections || !l.sections.length) err(w, 'sections 없음');
    if (!l.misconceptions || !l.misconceptions.length) warn(w, '흔한 오해 섹션이 없음');
    (l.misconceptions || []).forEach((m, i) => { if (!m.wrong || !m.right || !m.why) err(w, `misconceptions[${i}] 필드 누락`); });
    if (!l.examples || !l.examples.length) warn(w, '예제 코드 없음');
    if (!l.exercises || !l.exercises.length) warn(w, '직접 해보기 없음');
    if (!l.quiz || l.quiz.length < 5) err(w, `퀴즈가 5문제 미만 (${(l.quiz || []).length})`);
    (l.quiz || []).forEach((q, i) => {
      const qw = `${w} Q${i + 1}`;
      if (!q.q || !q.explain) err(qw, 'q/explain 누락');
      if (q.choices) {
        if (q.choices.length < 3 || q.choices.length > 5) err(qw, `보기 개수 이상 (${q.choices.length})`);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) err(qw, `answer 인덱스 오류: ${q.answer}`);
        else answerDist[q.answer]++;
        if (new Set(q.choices).size !== q.choices.length) err(qw, '중복된 보기');
      } else if (!Array.isArray(q.accept) || !q.accept.length) err(qw, 'choices 도 accept 도 없음');
      if (q.code && !q.lang) warn(qw, 'code 가 있는데 lang 이 없음');
    });
  });
}
console.log(`구조 검사: 트랙 ${tracks.length}개, 레슨 ${ids.size}개, 객관식 정답 위치 분포 [${answerDist.slice(0, 4).join(', ')}]`);

/* ---- 예제 실행 ---- */
function which(cmd) {
  const r = cp.spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.split(/\r?\n/)[0].trim() : null;
}
const tools = {
  python: which('python') || which('python3'),
  java: which('java') && which('javac') ? 'java' : null,
  cpp: which('g++') || which('clang++'),
  sql: which('python') || which('python3'),   // tools/sqlrun.py (SQLite)
};
const norm = s => s.replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/^\n+|\n+$/g, '');

function runExample(lang, code, stdin, dir, ex) {
  const opt = { cwd: dir, input: stdin || '', encoding: 'utf8', timeout: 60000, env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' } };
  if (lang === 'sql') {   // prelude: true 이면 공통 실습 테이블(SQLD_COMMON)을 앞에 붙여 실행
    fs.writeFileSync(path.join(dir, 'ex.sql'), (ex && ex.prelude ? sandbox.SQLD_COMMON + '\n' : '') + code);
    return cp.spawnSync(tools.python, ['-I', '-X', 'utf8', path.join(__dirname, 'sqlrun.py'), 'ex.sql'], opt);
  }
  if (lang === 'python') { fs.writeFileSync(path.join(dir, 'ex.py'), code); return cp.spawnSync(tools.python, ['-I', '-X', 'utf8', 'ex.py'], opt); }
  if (lang === 'java') {
    fs.writeFileSync(path.join(dir, 'Main.java'), code);
    return cp.spawnSync('java', ['-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-Dstderr.encoding=UTF-8', 'Main.java'], opt);
  }
  if (lang === 'cpp') {
    fs.writeFileSync(path.join(dir, 'ex.cpp'), code);
    const exe = path.join(dir, process.platform === 'win32' ? 'ex.exe' : 'ex');
    const c = cp.spawnSync(tools.cpp, ['-std=c++17', '-Wall', '-o', exe, 'ex.cpp'], opt);
    if (c.status !== 0) return c;
    return cp.spawnSync(exe, [], opt);
  }
  return null;
}

if (!noRun) {
  const stat = { ok: 0, fail: 0, skip: 0 };
  const skipped = {};
  for (const t of tracks) for (const l of t.lessons) (l.examples || []).forEach((e, i) => {
    const w = `${l.id} 예제${i + 1} "${e.title}"`;
    if (e.output === '@@') { err(w, 'output 이 비어 있음 → node tools/fill-sql.js 로 채우세요'); stat.fail++; return; }
    if (e.output == null || e.noverify) { stat.skip++; return; }
    const lang = e.lang === 'c' ? 'cpp' : e.lang;
    if (!tools[lang]) { stat.skip++; skipped[lang] = (skipped[lang] || 0) + 1; return; }
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'study-verify-'));
    try {
      const r = runExample(lang, e.code.replace(/^\n/, ''), e.stdin, dir, e);
      if (r.error) { err(w, `실행 실패: ${r.error.message}`); stat.fail++; return; }
      if (r.status !== 0) { err(w, `종료 코드 ${r.status}\n${(r.stderr || '').slice(0, 600)}`); stat.fail++; return; }
      if (norm(r.stdout) !== norm(e.output)) {
        err(w, `출력 불일치\n--- 기대 ---\n${norm(e.output)}\n--- 실제 ---\n${norm(r.stdout)}\n------------`); stat.fail++;
      } else stat.ok++;
    } finally {
      // Windows 에서 백신이 방금 만든 exe/임시 파일을 잠깐 붙잡고 있으면 삭제가 EBUSY 로 실패 → 재시도, 그래도 안 되면 무시
      try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 }); } catch (e) { /* 임시 폴더 정리 실패는 검증 결과와 무관 */ }
    }
  });
  console.log(`예제 실행: 통과 ${stat.ok}, 실패 ${stat.fail}, 건너뜀 ${stat.skip}` +
    Object.entries(skipped).map(([k, v]) => ` (${k} 컴파일러 없음: ${v}개 미검증)`).join(''));
}
console.log(errors ? `\n❌ 오류 ${errors}건, 경고 ${warns}건` : `\n✅ 통과 (경고 ${warns}건)`);
process.exit(errors ? 1 : 0);
