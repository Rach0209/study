#!/usr/bin/env node
/* SQL 예제의 output 자동 채우기
 *   node tools/fill-sql.js content/sqld-1.js [content/sqld-2.js ...]
 *
 * 예제에 `output: '@@'` 라고 써 두면, 실제로 SQLite 에서 실행한 결과로 바꿔 넣습니다.
 * (손으로 계산한 출력이 아니라 실행 결과만 믿기 위한 도구. 결과가 의도와 다르면 쿼리를 고치세요.)
 */
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process'), os = require('os');
const root = path.join(__dirname, '..');
const targets = process.argv.slice(2).map(f => path.resolve(f));
if (!targets.length) { console.error('사용법: node tools/fill-sql.js content/sqld-1.js ...'); process.exit(1); }

const sandbox = {}; sandbox.window = sandbox; vm.createContext(sandbox);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const lessonsOf = {};   // 파일 -> 그 파일이 추가한 레슨 객체들
for (const m of html.matchAll(/<script src="(content\/[^"]+)"/g)) {
  const file = path.join(root, m[1]);
  const before = new Set((sandbox.STUDY_TRACKS || []).flatMap(t => t.lessons));
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: m[1] });
  lessonsOf[file] = (sandbox.STUDY_TRACKS || []).flatMap(t => t.lessons).filter(l => !before.has(l));
}

let failed = false;
for (const file of targets) {
  let text = fs.readFileSync(file, 'utf8');
  const jobs = (lessonsOf[file] || []).flatMap(l => (l.examples || []).filter(e => e.output === '@@').map(e => ({ l, e })));
  const slots = (text.match(/output:\s*'@@'/g) || []).length;
  if (jobs.length !== slots) { console.error(`✖ ${path.basename(file)}: '@@' ${slots}개 vs 예제 ${jobs.length}개 (예제 객체에 output 을 한 번만 쓰세요)`); failed = true; continue; }
  const outs = jobs.map(({ l, e }) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'study-fill-'));
    try {
      fs.writeFileSync(path.join(dir, 'ex.sql'), (e.prelude ? sandbox.SQLD_COMMON + '\n' : '') + e.code.replace(/^\n/, ''));
      const r = cp.spawnSync('python', ['-I', '-X', 'utf8', path.join(__dirname, 'sqlrun.py'), 'ex.sql'], { cwd: dir, encoding: 'utf8', env: { ...process.env, PYTHONUTF8: '1' } });
      if (r.status !== 0) { console.error(`✖ ${l.id} "${e.title}" 실행 실패\n${r.stderr}`); failed = true; return null; }
      return r.stdout.replace(/\r/g, '').replace(/\s+$/, '');
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
  let i = 0;
  text = text.replace(/output:\s*'@@'/g, () => { const o = outs[i++]; return o == null ? "output: '@@'" : 'output: R`\n' + o + '\n`'; });
  fs.writeFileSync(file, text);
  console.log(`✔ ${path.basename(file)}: ${outs.filter(o => o != null).length}/${jobs.length}개 채움`);
}
process.exit(failed ? 1 : 0);
