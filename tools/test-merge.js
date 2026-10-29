// 진도 병합 규칙 테스트:  node tools/test-merge.js
require('../js/merge.js');
const { merge, stable } = globalThis.StudyMerge;
const assert = require('assert');
let n = 0;
const t = (name, fn) => { fn(); n++; console.log('  ✓', name); };
const base = o => Object.assign({ v: 1, lessons: {}, cards: {}, ex: {}, exT: {}, log: {}, last: null, lastT: 0, resetAt: 0 }, o);

t('빈 기록과 합치면 그대로', () => {
  const a = base({ lessons: { 'py-01': { attempts: 1, best: 90, done: true, t: 5 } }, log: { '2026-10-29': 3 } });
  assert.strictEqual(stable(merge(a, base())), stable(merge(a, a)));
  assert.strictEqual(merge(a, base()).lessons['py-01'].done, true);
});
t('레슨: 완료는 OR, 점수·횟수는 max', () => {
  const a = base({ lessons: { x: { attempts: 3, best: 60, done: false, t: 10 } } });
  const b = base({ lessons: { x: { attempts: 1, best: 90, done: true, t: 20 } } });
  const m = merge(a, b).lessons.x;
  assert.deepStrictEqual([m.attempts, m.best, m.done], [3, 90, true]);
});
t('카드: 더 최근에 푼 쪽 채택', () => {
  const a = base({ cards: { q: { box: 4, due: '2026-11-05', wrong: 1, t: 100 } } });
  const b = base({ cards: { q: { box: 1, due: '2026-10-29', wrong: 2, t: 200 } } });
  assert.strictEqual(merge(a, b).cards.q.box, 1);
  assert.strictEqual(merge(b, a).cards.q.box, 1);
});
t('직접 해보기: 최근 체크/해제가 이김', () => {
  const a = base({ ex: { e: true }, exT: { e: 10 } });
  const b = base({ ex: { e: false }, exT: { e: 20 } });
  assert.strictEqual(merge(a, b).ex.e, false);
});
t('학습 기록: 날짜별 max', () => {
  const m = merge(base({ log: { '2026-10-28': 2, '2026-10-29': 5 } }), base({ log: { '2026-10-28': 4 } }));
  assert.deepStrictEqual(m.log, { '2026-10-28': 4, '2026-10-29': 5 });
});
t('마지막 레슨: lastT 가 큰 쪽', () => {
  const m = merge(base({ last: 'py-03', lastT: 10 }), base({ last: 'jv-01', lastT: 20 }));
  assert.strictEqual(m.last, 'jv-01');
});
t('교환법칙: merge(a,b) == merge(b,a)', () => {
  const a = base({ lessons: { x: { attempts: 2, best: 70, done: false, t: 9 } }, cards: { q: { box: 2, due: 'd', wrong: 1, t: 3 } }, log: { d1: 1 }, last: 'a', lastT: 1 });
  const b = base({ lessons: { x: { attempts: 1, best: 85, done: true, t: 8 } }, cards: { q: { box: 3, due: 'e', wrong: 1, t: 4 } }, log: { d1: 2 }, last: 'b', lastT: 2 });
  assert.strictEqual(stable(merge(a, b)), stable(merge(b, a)));
});
t('멱등: merge(m,m) == m', () => {
  const m = merge(base({ cards: { q: { box: 2, due: 'd', wrong: 1, t: 3 } }, last: 'a', lastT: 1 }), base({ log: { d: 1 } }));
  assert.strictEqual(stable(merge(m, m)), stable(m));
});
t('전체 초기화 후 옛 기록이 되살아나지 않음', () => {
  const R = Date.now(), before = R - 3 * 86400000;
  const old = base({ lessons: { x: { attempts: 1, best: 90, done: true, t: before } }, cards: { q: { box: 2, due: 'd', wrong: 1, t: before } }, ex: { e: true }, exT: { e: before }, log: { '2020-01-01': 4 }, last: 'x', lastT: before });
  const reset = base({ resetAt: R });
  const m = merge(reset, old);
  assert.deepStrictEqual([m.lessons, m.cards, m.ex, m.log, m.last], [{}, {}, {}, {}, null]);
  assert.strictEqual(m.resetAt, R);
  assert.strictEqual(stable(merge(old, reset)), stable(m));
});
t('초기화 이후에 푼 기록은 유지', () => {
  const R = Date.now();
  const fresh = base({ resetAt: R, lessons: { y: { attempts: 1, best: 80, done: true, t: R + 2000 } } });
  const old = base({ lessons: { x: { attempts: 1, best: 90, done: true, t: R - 5000 } } });
  assert.deepStrictEqual(Object.keys(merge(fresh, old).lessons), ['y']);
});
t('손상된 입력도 죽지 않음', () => {
  assert.doesNotThrow(() => merge(null, undefined));
  assert.doesNotThrow(() => merge('x', [1, 2]));
});
console.log(`\n✅ ${n}개 통과`);
