/* 진도 병합 — 두 기기의 기록을 하나로 합칩니다 (순수 함수, 브라우저/노드 공용).
 *
 * 규칙
 *  - 레슨: 완료 여부는 OR, 시도 횟수·최고 점수는 큰 값. 나머지 필드는 더 최근(t) 쪽.
 *  - 복습 카드: 더 최근(t)에 푼 쪽을 통째로 채택.
 *  - 직접 해보기 체크: 더 최근(exT) 쪽.
 *  - 학습 기록(log): 날짜별 큰 값.
 *  - 마지막 레슨: lastT 가 더 큰 쪽.
 *  - 전체 초기화(resetAt): 초기화 이전의 기록은 어느 쪽에서 왔든 버립니다 (되살아나지 않게).
 */
(function (root) {
  'use strict';

  const pad = n => String(n).padStart(2, '0');
  const ymd = ms => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const obj = x => (x && typeof x === 'object' && !Array.isArray(x)) ? x : {};

  function merge(a, b) {
    a = obj(a); b = obj(b);
    const R = Math.max(a.resetAt || 0, b.resetAt || 0);
    const keep = t => R === 0 || (t || 0) > R;
    const out = { v: 1, lessons: {}, cards: {}, ex: {}, exT: {}, log: {}, last: null, lastT: 0, resetAt: R };

    // 레슨
    const la = obj(a.lessons), lb = obj(b.lessons);
    for (const id of new Set([...Object.keys(la), ...Object.keys(lb)])) {
      const x = keep(obj(la[id]).t) && la[id], y = keep(obj(lb[id]).t) && lb[id];
      if (x && y) {
        const [n, o] = (x.t || 0) >= (y.t || 0) ? [x, y] : [y, x];
        out.lessons[id] = Object.assign({}, o, n, {
          attempts: Math.max(x.attempts || 0, y.attempts || 0),
          best: Math.max(x.best || 0, y.best || 0),
          done: !!(x.done || y.done),
          t: Math.max(x.t || 0, y.t || 0),
        });
      } else if (x || y) out.lessons[id] = Object.assign({}, x || y);
    }

    // 복습 카드
    const ca = obj(a.cards), cb = obj(b.cards);
    for (const id of new Set([...Object.keys(ca), ...Object.keys(cb)])) {
      const x = keep(obj(ca[id]).t) && ca[id], y = keep(obj(cb[id]).t) && cb[id];
      const pick = x && y ? ((y.t || 0) > (x.t || 0) ? y : x) : (x || y);
      if (pick) out.cards[id] = Object.assign({}, pick);
    }

    // 직접 해보기 체크
    const ea = obj(a.ex), eb = obj(b.ex), ta = obj(a.exT), tb = obj(b.exT);
    for (const k of new Set([...Object.keys(ea), ...Object.keys(eb)])) {
      const x = k in ea && keep(ta[k]) ? { v: !!ea[k], t: ta[k] || 0 } : null;
      const y = k in eb && keep(tb[k]) ? { v: !!eb[k], t: tb[k] || 0 } : null;
      const pick = x && y ? (y.t > x.t ? y : (x.t > y.t ? x : { v: x.v || y.v, t: x.t })) : (x || y);
      if (pick) { out.ex[k] = pick.v; if (pick.t) out.exT[k] = pick.t; }
    }

    // 학습 기록
    const floor = R ? ymd(R) : '';
    const ga = obj(a.log), gb = obj(b.log);
    for (const d of new Set([...Object.keys(ga), ...Object.keys(gb)])) {
      if (floor && d < floor) continue;
      out.log[d] = Math.max(ga[d] || 0, gb[d] || 0);
    }

    // 마지막 레슨
    const cand = [[a.last, a.lastT || 0], [b.last, b.lastT || 0]].filter(([id, t]) => id && keep(t));
    if (cand.length) { cand.sort((p, q) => q[1] - p[1]); out.last = cand[0][0]; out.lastT = cand[0][1]; }

    return out;
  }

  // 키 순서와 상관없이 비교할 수 있는 직렬화
  function stable(x) {
    if (Array.isArray(x)) return '[' + x.map(stable).join(',') + ']';
    if (x && typeof x === 'object') return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + stable(x[k])).join(',') + '}';
    return JSON.stringify(x);
  }

  root.StudyMerge = { merge, stable };
})(typeof window !== 'undefined' ? window : globalThis);
