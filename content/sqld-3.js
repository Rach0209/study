/* SQLD 트랙 — 3파일: 과목2 SQL 활용 (서브쿼리·뷰, 집합 연산자·그룹 함수, 윈도우 함수·Top N, 계층형·PIVOT·정규식)
 * SQLite 에 없는 Oracle 문법(ROLLUP/CUBE/GROUPING SETS, CONNECT BY, ROWNUM, PIVOT/UNPIVOT, FETCH FIRST)은 noverify 예제이며,
 * 출력은 같은 의미의 표준 SQL(UNION ALL, 재귀 CTE, CASE 집계)을 SQLite 로 실행한 결과를 옮긴 것입니다.
 */
(() => {
const R = String.raw;
const fence = (lang, src) => '```' + lang + '\n' + src.replace(/^\n|\n$/g, '') + '\n```';
const t = window.STUDY_TRACKS.find(x => x.id === 'sqld');

t.lessons.push(

/* ======================= 10 ======================= */
{
  id: 'sq-10', unit: '3부. SQL 활용 (과목2)', title: '서브쿼리와 뷰', time: '90분',
  summary: '서브쿼리는 다른 쿼리 안에 들어간 SELECT 다. 반환 행·열 수에 맞는 연산자를 써야 하고, 연관 서브쿼리는 메인 쿼리의 행마다 실행된다. NOT IN 의 NULL 함정은 EXISTS 로 피한다.',
  goals: ['서브쿼리를 위치(SELECT/FROM/WHERE)와 반환 형태로 분류한다', '단일행·다중행 연산자(IN, ANY, ALL, EXISTS)를 올바르게 고른다', '연관 서브쿼리의 실행 방식을 설명한다', '뷰의 특징과 제약을 안다'],
  terms: [
    { t: '서브쿼리(Subquery)', d: '다른 SQL 문 안에 **괄호로 묶여 들어간** SELECT. 바깥은 메인 쿼리.' },
    { t: '스칼라 서브쿼리', d: 'SELECT 절에 쓰며 **정확히 1행 1열**을 반환하는 서브쿼리(값 하나처럼 쓴다).' },
    { t: '인라인 뷰', d: 'FROM 절에 쓰는 서브쿼리. 임시 테이블처럼 동작하며 이름(별칭)을 붙인다.' },
    { t: '연관(Correlated) 서브쿼리', d: '서브쿼리가 **메인 쿼리의 컬럼을 참조**하는 서브쿼리. 메인 쿼리의 각 행에 대해 실행되는 것처럼 동작.' },
    { t: '뷰(View)', d: '실제 데이터를 저장하지 않고 **SELECT 문의 정의만 저장**한 가상 테이블.' }
  ],
  sections: [
    { h: '1. 위치별 분류', md: [
      '| 위치 | 이름 | 특징 |', '|---|---|---|',
      '| SELECT 절 | 스칼라 서브쿼리 | **1행 1열**만 허용. 2행 이상이면 오류 |',
      '| FROM 절 | 인라인 뷰 | 결과를 테이블처럼 사용. **ORDER BY 사용 가능** (Top N 에 필수) |',
      '| WHERE / HAVING 절 | 중첩 서브쿼리 | 조건 비교에 사용. 일반적으로 ORDER BY 는 쓰지 않는다 |',
      '메인 쿼리는 서브쿼리의 컬럼을 쓸 수 없지만(인라인 뷰는 예외 — 별칭으로 컬럼을 노출), **서브쿼리는 메인 쿼리의 컬럼을 참조할 수 있습니다**(연관 서브쿼리).'] },
    { h: '2. 반환 형태별 분류와 연산자', md: [
      '| 반환 | 쓸 수 있는 연산자 | 예 |', '|---|---|---|',
      '| 단일 행 | `=`, `<>`, `>`, `>=`, `<`, `<=` | `SAL > (SELECT AVG(SAL) FROM EMP)` |',
      '| 다중 행 | `IN`, `NOT IN`, `ANY`, `SOME`, `ALL`, `EXISTS` | `DEPTNO IN (SELECT ...)` |',
      '| 다중 컬럼 | 컬럼 묶음 비교 (Oracle) | `(DEPTNO, SAL) IN (SELECT DEPTNO, MAX(SAL) ...)` |',
      '- **단일행 연산자에 다중 행 서브쿼리**를 쓰면 오류입니다("single-row subquery returns more than one row").',
      '- `x > ANY (a, b)` = **하나라도 크면** → `x > MIN`. `x > ALL (a, b)` = **모두보다 크면** → `x > MAX`.',
      '- `x < ANY` = `x < MAX`, `x < ALL` = `x < MIN`. `x = ANY` 는 `IN`, `x <> ALL` 은 `NOT IN` 과 같습니다.'] },
    { h: '3. 연관 서브쿼리와 EXISTS', md: [
      '```sql\n-- 자기 부서 평균보다 급여가 높은 사원: 서브쿼리가 메인의 E.DEPTNO 를 참조\nSELECT ENAME FROM EMP E\nWHERE SAL > (SELECT AVG(SAL) FROM EMP WHERE DEPTNO = E.DEPTNO);\n```',
      '- **EXISTS**: 서브쿼리가 **한 행이라도 반환하면 TRUE**. 존재 여부만 보므로 서브쿼리 SELECT 목록은 `1` 등 무엇이든 무방. 조건에 맞는 첫 행을 찾으면 멈춰서 효율적일 수 있습니다.',
      '- **NOT IN 의 NULL 함정**: `NOT IN (서브쿼리)` 결과에 **NULL 이 한 건이라도 있으면 전체 결과가 0건**이 됩니다. NULL 이 가능한 컬럼에는 `NOT EXISTS` 가 안전합니다.'] },
    { h: '4. 뷰(View)', md: [
      '```sql\nCREATE VIEW V_DEV AS SELECT EMPNO, ENAME, SAL FROM EMP WHERE DEPTNO = 20;\n```',
      '- 장점: **독립성**(원본 구조 변경 영향 감소), **편리성**(복잡한 쿼리를 단순화), **보안성**(필요한 컬럼·행만 노출).',
      '- 뷰는 데이터를 **저장하지 않습니다.** 조회할 때마다 정의된 SELECT 가 실행됩니다. 삭제는 `DROP VIEW`(원본 데이터는 그대로).',
      '- 단순 뷰(한 테이블)는 DML 이 가능한 경우가 많지만, **집계 함수·GROUP BY·DISTINCT·조인 등이 있는 복합 뷰**는 INSERT/UPDATE/DELETE 에 제약이 있습니다.',
      '- Oracle: `CREATE OR REPLACE VIEW`, `WITH READ ONLY`, `WITH CHECK OPTION`.'] }
  ],
  misconceptions: [
    { wrong: '"서브쿼리는 항상 메인 쿼리보다 먼저 한 번만 실행된다."', right: '**비연관** 서브쿼리는 한 번 실행되지만 **연관** 서브쿼리는 메인 쿼리의 각 행 값을 받아 반복 실행되는 것처럼 동작한다.', why: '메인 컬럼을 참조하는지가 두 종류를 가르는 기준입니다.' },
    { wrong: '"`NOT IN (서브쿼리)` 에 NULL 이 섞여도 NULL 만 무시하고 나머지는 나온다."', right: '결과가 **0건**이 된다. NOT IN 은 모든 항목과 `<>` 가 참이어야 하는데 NULL 과의 비교가 UNKNOWN 이라서.', why: '`NOT EXISTS` 나 서브쿼리에 `WHERE 컬럼 IS NOT NULL` 을 붙여 해결합니다.' },
    { wrong: '"스칼라 서브쿼리는 여러 행을 돌려줘도 된다."', right: '**1행 1열**만 허용한다. 2행 이상이면 오류, 0행이면 NULL.', why: '값 하나처럼 쓰이기 때문입니다.' },
    { wrong: '"`x > ALL (a, b)` 는 `x > MIN(a, b)` 와 같다."', right: '`> ALL` 은 **모두보다 크다 = MAX 보다 크다**. `> ANY` 가 MIN 보다 크다.', why: '"하나라도(ANY)"는 느슨한 조건이라 MIN 기준, "모두(ALL)"는 엄격해서 MAX 기준입니다.' },
    { wrong: '"뷰를 만들면 데이터의 복사본이 생긴다."', right: '뷰는 **SELECT 문의 정의만 저장**한다. 원본이 바뀌면 뷰 조회 결과도 바로 바뀐다.', why: '(물리적으로 결과를 저장하는 것은 Materialized View 라는 다른 객체입니다.)' }
  ],
  examples: [
    { title: '단일행 서브쿼리: 평균보다 높은 급여', lang: 'sql', prelude: true, code: R`
SELECT ENAME, SAL
FROM EMP
WHERE SAL > (SELECT AVG(SAL) FROM EMP)
ORDER BY EMPNO;
`, output: R`
ENAME | SAL
KIM | 5000
LEE | 3000
PARK | 2800
HAN | 2500
`, notes: ['평균은 18500 / 8 = 2312.5. 이보다 높은 KIM, LEE, PARK, HAN 이 나옵니다.'] },
    { title: '[Oracle/SQL Server] 다중행: ANY, ALL', lang: 'sql', noverify: true, code: R`
SELECT ENAME FROM EMP
WHERE SAL > ALL (SELECT SAL FROM EMP WHERE JOB = 'SALESMAN')
ORDER BY EMPNO;
SELECT ENAME FROM EMP
WHERE SAL < ANY (SELECT SAL FROM EMP WHERE JOB = 'MANAGER')
ORDER BY EMPNO;
`, output: R`
ENAME
KIM
LEE
PARK
HAN

ENAME
PARK
CHOI
JUNG
HAN
YOON
SHIN
`, notes: ['SQLite 가 ANY/ALL 을 지원하지 않아 실행 검증은 못 했습니다. 같은 의미의 `SAL > (SELECT MAX(...))`, `SAL < (SELECT MAX(...))` 로 SQLite 에서 계산한 값입니다. SALESMAN 급여는 1500, 1500 → `> ALL` 은 1500 초과(KIM, LEE, PARK, HAN). MANAGER 급여는 3000, 2800 → `< ANY` 는 최댓값 3000 미만이라 PARK(2800)은 포함되고 LEE(3000)·KIM 은 제외됩니다.'] },
    { title: '다중 컬럼: 부서별 최고 급여자', lang: 'sql', prelude: true, code: R`
SELECT ENAME, DEPTNO, SAL
FROM EMP
WHERE (DEPTNO, SAL) IN (SELECT DEPTNO, MAX(SAL) FROM EMP GROUP BY DEPTNO)
ORDER BY EMPNO;
`, output: R`
ENAME | DEPTNO | SAL
KIM | 10 | 5000
PARK | 20 | 2800
`, notes: ['DEPTNO 가 NULL 인 SHIN 은 (NULL, 1200) 과 비교가 UNKNOWN 이라 제외됩니다.'] },
    { title: '연관 서브쿼리: 자기 부서 평균보다 높은 사원', lang: 'sql', prelude: true, code: R`
SELECT E.ENAME, E.DEPTNO, E.SAL
FROM EMP E
WHERE E.SAL > (SELECT AVG(SAL) FROM EMP WHERE DEPTNO = E.DEPTNO)
ORDER BY E.EMPNO;
`, output: R`
ENAME | DEPTNO | SAL
KIM | 10 | 5000
LEE | 10 | 3000
PARK | 20 | 2800
HAN | 20 | 2500
`, notes: ['10번 부서 평균 2750 → KIM, LEE. 20번 부서 평균 2100 → PARK, HAN. SHIN 은 부서가 NULL 이라 평균도 NULL 이 되어 제외.'] },
    { title: 'EXISTS vs NOT IN (NULL 함정)', lang: 'sql', prelude: true, code: R`
SELECT DNAME FROM DEPT D
WHERE NOT EXISTS (SELECT 1 FROM EMP E WHERE E.DEPTNO = D.DEPTNO);
SELECT DNAME FROM DEPT
WHERE DEPTNO NOT IN (SELECT DEPTNO FROM EMP);
`, output: R`
DNAME
HR

DNAME
`, notes: ['사원이 없는 부서를 찾는 의도입니다. `NOT EXISTS` 는 HR 을 정확히 찾지만, `NOT IN` 은 서브쿼리 결과에 NULL(SHIN)이 있어 **0건**이 됩니다.'] },
    { title: '스칼라 서브쿼리와 인라인 뷰', lang: 'sql', prelude: true, code: R`
-- SELECT 절의 스칼라 서브쿼리
SELECT E.ENAME,
       (SELECT D.DNAME FROM DEPT D WHERE D.DEPTNO = E.DEPTNO) AS DNAME
FROM EMP E WHERE E.EMPNO IN (1, 8) ORDER BY E.EMPNO;
-- FROM 절의 인라인 뷰
SELECT D.DNAME, V.AVG_SAL
FROM DEPT D JOIN (SELECT DEPTNO, AVG(SAL) AS AVG_SAL FROM EMP GROUP BY DEPTNO) V
  ON D.DEPTNO = V.DEPTNO
ORDER BY D.DEPTNO;
`, output: R`
ENAME | DNAME
KIM | SALES
SHIN | NULL

DNAME | AVG_SAL
SALES | 2750
DEV | 2100
`, notes: ['스칼라 서브쿼리는 짝이 없으면 NULL(SHIN). 인라인 뷰는 부서별 평균을 임시 테이블처럼 만들어 조인합니다.'] },
    { title: '뷰는 정의만 저장한다', lang: 'sql', prelude: true, code: R`
CREATE VIEW V_DEV AS SELECT EMPNO, ENAME, SAL FROM EMP WHERE DEPTNO = 20;
SELECT COUNT(*) AS BEFORE_UPDATE FROM V_DEV WHERE SAL >= 2500;
UPDATE EMP SET SAL = 3500 WHERE ENAME = 'YOON';
SELECT COUNT(*) AS AFTER_UPDATE FROM V_DEV WHERE SAL >= 2500;
`, output: R`
BEFORE_UPDATE
2

AFTER_UPDATE
3
`, notes: ['원본 EMP 를 고치면 뷰 조회 결과도 즉시 달라집니다(뷰에 데이터 복사본이 없다는 증거).'] }
  ],
  exercises: [
    { q: '급여가 전체 최고 급여인 사원의 이름을 서브쿼리로 구하세요.', hint: 'WHERE SAL = (SELECT MAX(SAL) ...)', answer: fence('sql', 'SELECT ENAME FROM EMP WHERE SAL = (SELECT MAX(SAL) FROM EMP);') + '\nKIM.' },
    { q: '`SELECT ENAME FROM EMP WHERE SAL = (SELECT SAL FROM EMP WHERE JOB = \'SALESMAN\')` 는 왜 오류일까요? 고치는 방법은?', hint: '서브쿼리가 몇 행을 돌려주나?', answer: 'SALESMAN 이 두 명이라 서브쿼리가 2행을 반환해 단일행 연산자 `=` 와 맞지 않는다. `=` 대신 `IN` (또는 `= ANY`)을 쓴다.' },
    { q: '부서에 소속된 사원이 한 명 이상 있는 부서만 EXISTS 로 조회해 보세요.', hint: '연관 서브쿼리', answer: fence('sql', 'SELECT DNAME FROM DEPT D WHERE EXISTS (SELECT 1 FROM EMP E WHERE E.DEPTNO = D.DEPTNO);') }
  ],
  quiz: [
    { q: 'SELECT 절에 사용하는 스칼라 서브쿼리가 반환할 수 있는 결과는?', choices: ['여러 행 여러 열', '1행 여러 열', '1행 1열', '0행만'], answer: 2, explain: '스칼라 서브쿼리는 정확히 1행 1열(값 하나)을 반환해야 합니다. 0행이면 NULL, 2행 이상이면 오류.' },
    { q: '`SAL > ALL (1500, 1500, 2000)` 과 같은 의미는?', choices: ['SAL > 1500', 'SAL > 2000', 'SAL > 3000', 'SAL > 1500 OR SAL > 2000'], answer: 1, explain: '모든 값보다 커야 하므로 최댓값 2000 보다 큰 것입니다.' },
    { q: '`SAL < ANY (3000, 2800)` 과 같은 의미는?', choices: ['SAL < 2800', 'SAL < 3000', 'SAL < 5800', 'SAL < 0'], answer: 1, explain: '하나라도 만족하면 되므로 최댓값 3000 보다 작으면 참입니다.' },
    { q: '다음 중 서브쿼리가 **여러 행**을 돌려줄 때 사용하는 연산자는?', choices: ['=', '>=', '<>', 'IN'], answer: 3, explain: '`=`, `>=`, `<>` 같은 단일행 비교 연산자에 다중 행 서브쿼리를 쓰면 오류입니다. IN, ANY, ALL, EXISTS 가 다중 행 연산자입니다.' },
    { q: '`WHERE DEPTNO NOT IN (SELECT DEPTNO FROM EMP)` 에서 서브쿼리 결과에 NULL 이 한 건 포함되어 있으면 결과는?', choices: ['NULL 을 제외한 나머지가 반환된다', '0건', '모든 행', '오류'], answer: 1, explain: 'NOT IN 은 모든 항목과 <> 비교가 참이어야 하는데 NULL 과의 비교는 UNKNOWN 이므로 어떤 행도 만족하지 못합니다.' },
    { q: '메인 쿼리의 컬럼을 서브쿼리 안에서 참조하는 서브쿼리를 무엇이라 하는가?', accept: ['연관 서브쿼리', '상관 서브쿼리', '연관서브쿼리', 'correlated'], explain: '메인 쿼리의 값을 참조하는 서브쿼리는 연관(상관) 서브쿼리입니다.' },
    { q: 'FROM 절의 서브쿼리를 무엇이라 부르며, 이 위치에서만 일반적으로 허용되는 것은?', choices: ['스칼라 서브쿼리 / GROUP BY', '인라인 뷰 / ORDER BY', '중첩 서브쿼리 / HAVING', '뷰 / DROP'], answer: 1, explain: 'FROM 절의 서브쿼리는 인라인 뷰이며 Top N 질의 등에서 ORDER BY 를 사용할 수 있습니다.' },
    { q: '뷰에 대한 설명으로 옳은 것은?', choices: ['뷰는 원본 데이터의 복사본을 저장한다', '뷰를 삭제하면 원본 테이블의 데이터도 삭제된다', '뷰는 SELECT 문의 정의만 저장한 가상 테이블이다', '뷰는 인덱스를 가질 수 없고 조회도 불가능하다'], answer: 2, explain: '뷰는 정의만 저장하며 DROP VIEW 는 원본 데이터에 영향이 없습니다.' },
    { q: '다음 중 보통 INSERT/UPDATE/DELETE 가 제한되는 뷰는?', choices: ['한 테이블의 컬럼만 고른 단순 뷰', 'GROUP BY 와 집계 함수를 사용한 뷰', 'WHERE 조건만 있는 뷰', '별칭을 사용한 뷰'], answer: 1, explain: '집계·GROUP BY·DISTINCT 가 있는 뷰는 원본 행과 1:1 대응이 안 되어 DML 이 제한됩니다.' }
  ]
},

/* ======================= 11 ======================= */
{
  id: 'sq-11', unit: '3부. SQL 활용 (과목2)', title: '집합 연산자와 그룹 함수(ROLLUP·CUBE)', time: '90분',
  summary: '집합 연산자는 두 쿼리의 결과를 합치거나 비교한다(UNION, UNION ALL, INTERSECT, MINUS). ROLLUP/CUBE/GROUPING SETS 는 한 번의 GROUP BY 로 소계와 총계를 함께 만든다.',
  goals: ['UNION / UNION ALL / INTERSECT / MINUS(EXCEPT)의 결과를 구분한다', '집합 연산자의 사용 규칙(컬럼 수·타입, ORDER BY 위치)을 안다', 'ROLLUP 의 계층 소계와 CUBE 의 모든 조합을 예측한다', 'GROUPING 함수로 소계 행의 NULL 을 구분한다'],
  terms: [
    { t: '집합 연산자', d: '두 개 이상의 SELECT 결과를 **행 단위로** 합치거나 비교하는 연산자.' },
    { t: 'ROLLUP', d: '지정한 컬럼의 **오른쪽부터 하나씩 줄여가며** 소계를 만들고 마지막에 총계. `ROLLUP(A, B)` → (A,B), (A), ().' },
    { t: 'CUBE', d: '지정한 컬럼의 **모든 조합**의 소계와 총계. `CUBE(A, B)` → (A,B), (A), (B), ().' },
    { t: 'GROUPING SETS', d: '원하는 **그룹 조합만 직접 지정**해 집계. 결과는 UNION ALL 과 같다.' },
    { t: 'GROUPING(컬럼)', d: '해당 행에서 그 컬럼이 **소계/총계 때문에 NULL 이 된 것이면 1**, 원래 값(원래 NULL 포함)이면 0 을 반환.' }
  ],
  sections: [
    { h: '1. 집합 연산자', md: [
      '| 연산자 | 의미 | 중복 | 비고 |', '|---|---|---|---|',
      '| `UNION` | 합집합 | **제거** | 정렬(중복 제거) 비용 발생 |',
      '| `UNION ALL` | 합집합 | **유지** | 정렬·중복 제거 없음 → 더 빠름 |',
      '| `INTERSECT` | 교집합 | 제거 | 양쪽에 모두 있는 행 |',
      '| `MINUS` (Oracle) / `EXCEPT` (SQL Server·표준) | 차집합 | 제거 | 앞 쿼리에만 있는 행 |',
      '**사용 규칙**',
      '- 두 SELECT 의 **컬럼 개수가 같고**, 대응하는 컬럼의 **데이터 타입이 호환**되어야 합니다.',
      '- **결과 컬럼 이름은 첫 번째 SELECT** 를 따릅니다.',
      '- **ORDER BY 는 맨 마지막에 한 번만** 쓸 수 있고, 첫 번째 SELECT 의 컬럼명(또는 위치 번호)을 사용합니다.',
      '- 중복 판정에서 **NULL 은 서로 같은 값**으로 봅니다(그래서 UNION 에서 NULL 이 하나로 합쳐짐). 앞서 나온 `=` 비교와 다른 점!',
      '- 여러 집합 연산자를 섞을 때는 DBMS 마다 우선순위가 다를 수 있으므로 **괄호**로 순서를 명확히 합니다.'] },
    { h: '2. 그룹 함수: ROLLUP / CUBE / GROUPING SETS', md: [
      '일반 `GROUP BY` 는 지정한 컬럼 조합 하나만 집계합니다. 부서별+직무별 합계, 부서별 소계, 전체 합계를 모두 보려면 쿼리를 여러 번 합쳐야 했지만 이 세 가지가 해결합니다.',
      '| 구문 | 만들어지는 그룹 | 그룹 수 (컬럼 2개) |', '|---|---|---|',
      '| `ROLLUP(A, B)` | (A,B) + (A) + 전체 | 3 — **계층적**이라 순서가 중요 |',
      '| `CUBE(A, B)` | (A,B) + (A) + (B) + 전체 | 4 — 모든 조합, 순서 무관 |',
      '| `GROUPING SETS((A),(B))` | 지정한 (A), (B) 만 | 지정한 개수 |',
      '- 소계 행에서는 집계에서 제외된 컬럼이 **NULL** 로 표시됩니다. 원래 데이터에 NULL 이 있으면 구분이 안 되므로 `GROUPING(컬럼)` 이 1 인지 확인합니다.',
      '- `ROLLUP(A, B)` 는 `GROUP BY A, B` 의 결과에 A 별 소계와 총계가 더해진 것입니다. `ROLLUP(B, A)` 는 소계가 B 기준으로 나옵니다.',
      '- `CUBE(A, B, C)` 는 2³ = 8 가지 그룹입니다.',
      '- **SQL Server** 는 `GROUP BY ROLLUP(A, B)` 외에 `WITH ROLLUP` 표기도 지원합니다(`GROUP BY A, B WITH ROLLUP`).'] }
  ],
  misconceptions: [
    { wrong: '"UNION 은 두 결과를 그냥 이어 붙인다."', right: '**UNION 은 중복을 제거**한다. 이어 붙이기(중복 유지)는 **UNION ALL**.', why: '결과 건수를 묻는 문제에서 가장 자주 틀리는 부분입니다. 중복 제거가 불필요하면 UNION ALL 이 더 빠릅니다.' },
    { wrong: '"집합 연산자에서 각 SELECT 마다 ORDER BY 를 쓸 수 있다."', right: 'ORDER BY 는 **전체 결과에 대해 맨 마지막에 한 번**만 쓴다. 컬럼명은 첫 SELECT 기준.', why: '(괄호로 묶은 인라인 뷰 안에서는 가능하지만 직접 이어 붙인 형태에서는 불가.)' },
    { wrong: '"`ROLLUP(A, B)` 와 `ROLLUP(B, A)` 는 같은 결과다."', right: 'ROLLUP 은 오른쪽부터 줄여가는 **계층적** 소계라 순서가 다르면 소계가 달라진다. 순서에 상관없는 것은 CUBE.', why: 'ROLLUP(부서, 직무) 는 부서별 소계, ROLLUP(직무, 부서) 는 직무별 소계를 만듭니다.' },
    { wrong: '"소계 행의 NULL 과 원래 데이터의 NULL 은 구별할 수 없다."', right: '`GROUPING(컬럼)` 이 **1 이면 소계/총계 때문에 생긴 NULL**, 0 이면 원래 값이다.', why: '이를 이용해 NULL 을 "합계" 같은 라벨로 바꿔 출력하는 CASE 문이 자주 쓰입니다.' },
    { wrong: '"INTERSECT 와 MINUS 는 중복을 유지한다."', right: 'UNION ALL 만 중복을 유지한다. 나머지(UNION, INTERSECT, MINUS)는 **중복을 제거**한다.', why: '"ALL 이 없으면 중복 제거"로 외우세요.' }
  ],
  examples: [
    { title: 'UNION vs UNION ALL', lang: 'sql', prelude: true, code: R`
SELECT DEPTNO FROM DEPT
UNION
SELECT DEPTNO FROM EMP
ORDER BY DEPTNO;
SELECT COUNT(*) AS UNION_ALL_CNT FROM (
  SELECT DEPTNO FROM DEPT UNION ALL SELECT DEPTNO FROM EMP
);
`, output: R`
DEPTNO
NULL
10
20
30

UNION_ALL_CNT
11
`, notes: ['UNION 은 DEPT(10,20,30)와 EMP(10×4, 20×3, NULL)의 중복을 제거해 NULL, 10, 20, 30 의 4행(NULL 도 하나로 합쳐짐). UNION ALL 은 3 + 8 = 11행.'] },
    { title: 'INTERSECT 와 차집합(EXCEPT / MINUS)', lang: 'sql', prelude: true, code: R`
SELECT DEPTNO FROM DEPT
INTERSECT
SELECT DEPTNO FROM EMP
ORDER BY DEPTNO;
SELECT DEPTNO FROM DEPT
EXCEPT
SELECT DEPTNO FROM EMP;
`, output: R`
DEPTNO
10
20

DEPTNO
30
`, notes: ['교집합은 10, 20. 차집합은 DEPT 에만 있는 30. (Oracle 에서는 `EXCEPT` 대신 `MINUS`.)'] },
    { title: '[Oracle] ROLLUP(DEPTNO, JOB)', lang: 'sql', noverify: true, code: R`
SELECT DEPTNO, JOB, SUM(SAL) AS SUM_SAL
FROM EMP
WHERE DEPTNO IS NOT NULL
GROUP BY ROLLUP (DEPTNO, JOB)
ORDER BY DEPTNO, JOB;
`, output: R`
DEPTNO | JOB | SUM_SAL
10 | MANAGER | 3000
10 | PRESIDENT | 5000
10 | SALESMAN | 3000
10 | NULL | 11000
20 | ANALYST | 2500
20 | CLERK | 1000
20 | MANAGER | 2800
20 | NULL | 6300
NULL | NULL | 17300
`, notes: ['SQLite 는 ROLLUP 을 지원하지 않아 검증하지 못했습니다. 출력은 같은 의미의 UNION ALL 쿼리를 SQLite 로 실행한 값입니다. (부서,직무) 상세 + **부서별 소계**(JOB 이 NULL) + **총계**(둘 다 NULL). 소계 행의 위치는 Oracle 의 ORDER BY 에서 NULL 이 뒤라 이렇게 보입니다.'] },
    { title: '[Oracle] CUBE 와 GROUPING', lang: 'sql', noverify: true, code: R`
SELECT DEPTNO, JOB, SUM(SAL) AS SUM_SAL,
       GROUPING(DEPTNO) AS G_D, GROUPING(JOB) AS G_J
FROM EMP
WHERE DEPTNO IS NOT NULL
GROUP BY CUBE (DEPTNO, JOB)
ORDER BY DEPTNO, JOB;
`, output: R`
DEPTNO | JOB | SUM_SAL | G_D | G_J
10 | MANAGER | 3000 | 0 | 0
10 | PRESIDENT | 5000 | 0 | 0
10 | SALESMAN | 3000 | 0 | 0
10 | NULL | 11000 | 0 | 1
20 | ANALYST | 2500 | 0 | 0
20 | CLERK | 1000 | 0 | 0
20 | MANAGER | 2800 | 0 | 0
20 | NULL | 6300 | 0 | 1
NULL | ANALYST | 2500 | 1 | 0
NULL | CLERK | 1000 | 1 | 0
NULL | MANAGER | 5800 | 1 | 0
NULL | PRESIDENT | 5000 | 1 | 0
NULL | SALESMAN | 3000 | 1 | 0
NULL | NULL | 17300 | 1 | 1
`, notes: ['ROLLUP 결과(9행)에 **직무별 소계**(DEPTNO 가 NULL, G_D = 1)가 더해져 14행이 됩니다: (부서,직무) 상세 6 + 부서별 소계 2 + 직무별 소계 5 + 총계 1. G_D / G_J 가 1 인 NULL 은 "소계 때문에 생긴 NULL" 입니다.'] },
    { title: '[Oracle] GROUPING SETS', lang: 'sql', noverify: true, code: R`
SELECT DEPTNO, JOB, SUM(SAL) AS SUM_SAL
FROM EMP
WHERE DEPTNO IS NOT NULL
GROUP BY GROUPING SETS (DEPTNO, JOB)
ORDER BY DEPTNO, JOB;
`, output: R`
DEPTNO | JOB | SUM_SAL
10 | NULL | 11000
20 | NULL | 6300
NULL | ANALYST | 2500
NULL | CLERK | 1000
NULL | MANAGER | 5800
NULL | PRESIDENT | 5000
NULL | SALESMAN | 3000
`, notes: ['지정한 두 그룹((DEPTNO), (JOB))만 만들어집니다. 총계나 (DEPTNO, JOB) 상세는 없습니다. `GROUP BY GROUPING SETS (DEPTNO, JOB)` 는 UNION ALL 로 두 번 집계한 것과 같습니다.'] }
  ],
  exercises: [
    { q: '위 CUBE 예제의 결과 행 수를 직접 세어 보세요. (부서,직무) 상세 행은 몇 개, 부서 소계 몇 개, 직무 소계 몇 개, 총계 1개입니다.', hint: '상세: 10-MANAGER, 10-PRESIDENT, 10-SALESMAN, 20-ANALYST, 20-CLERK, 20-MANAGER = 6개', answer: '상세 6 + 부서 소계 2 + 직무 소계 5 + 총계 1 = **14행**.' },
    { q: '`SELECT DEPTNO FROM EMP UNION ALL SELECT DEPTNO FROM DEPT` 와 `UNION` 의 행 수 차이를 설명해 보세요.', hint: '11행 vs 4행', answer: 'UNION ALL 은 중복을 유지해 3+8 = 11행, UNION 은 NULL·10·20·30 만 남겨 4행.' },
    { q: 'ROLLUP(JOB, DEPTNO) 로 바꾸면 소계는 무엇 기준으로 나올까요?', hint: '오른쪽부터 줄어든다', answer: 'JOB 별 소계가 나온다(JOB 기준 계층). (JOB, DEPTNO) 상세 → (JOB) 소계 → 총계.' }
  ],
  quiz: [
    { q: '중복 행을 제거하지 않고 두 쿼리 결과를 합치는 연산자는?', accept: ['UNION ALL', 'union all'], explain: 'UNION ALL 은 중복을 제거하지 않아 UNION 보다 빠릅니다.' },
    { q: '다음 중 집합 연산자 사용 규칙으로 옳은 것은?', choices: ['두 SELECT 의 컬럼 수가 달라도 된다', '결과 컬럼명은 마지막 SELECT 를 따른다', 'ORDER BY 는 맨 마지막에 한 번만 쓸 수 있다', 'NULL 은 항상 서로 다른 값으로 취급한다'], answer: 2, explain: '컬럼 수와 타입이 같아야 하고, 결과 컬럼명은 첫 SELECT 를 따르며 ORDER BY 는 마지막에 한 번만 쓸 수 있습니다. 집합 연산의 중복 판정에서 NULL 은 같은 값으로 봅니다.' },
    { q: 'A 에는 있고 B 에는 없는 행만 구하는 Oracle 의 집합 연산자는?', accept: ['MINUS', 'minus'], explain: 'Oracle 은 MINUS, SQL Server·표준은 EXCEPT 입니다.' },
    { q: 'DEPT.DEPTNO = {10,20,30}, EMP.DEPTNO = {10,10,10,10,20,20,20,NULL} 일 때 `SELECT DEPTNO FROM EMP INTERSECT SELECT DEPTNO FROM DEPT` 의 결과 행 수는?', choices: ['2', '3', '7', '8'], answer: 0, explain: '교집합은 중복 없이 10, 20 → 2행. NULL 은 DEPT 에 없습니다.' },
    { q: '`GROUP BY ROLLUP(A, B)` 가 만드는 그룹 조합은?', choices: ['(A,B), (A), 전체', '(A,B), (B), 전체', '(A,B), (A), (B), 전체', '(A), (B)'], answer: 0, explain: 'ROLLUP 은 오른쪽 컬럼부터 하나씩 줄여가는 계층 소계: (A,B) → (A) → ().' },
    { q: '`GROUP BY CUBE(A, B)` 가 만드는 그룹 조합의 개수는?', accept: ['4', '4개'], explain: '(A,B), (A), (B), () 로 2² = 4 가지입니다.' },
    { q: '소계 행에서 NULL 이 "집계 때문에 생긴 NULL" 인지 구분하는 함수는?', choices: ['NVL', 'GROUPING', 'COALESCE', 'NULLIF'], answer: 1, explain: 'GROUPING(컬럼)은 소계/총계로 인한 NULL 이면 1 을 반환합니다.' },
    { q: '지정한 컬럼 조합만 골라 집계하며 결과가 UNION ALL 과 같은 구문은?', choices: ['ROLLUP', 'CUBE', 'GROUPING SETS', 'PIVOT'], answer: 2, explain: 'GROUPING SETS 는 원하는 그룹 조합을 직접 나열합니다.' },
    { q: 'ROLLUP(A, B) 와 ROLLUP(B, A) 의 차이에 대한 설명으로 옳은 것은?', choices: ['항상 같은 결과', '컬럼 순서에 따라 소계 기준이 달라진다', 'ROLLUP 은 컬럼이 1개만 가능', '두 번째는 오류'], answer: 1, explain: 'ROLLUP 은 계층적이라 순서가 다르면 소계의 기준이 달라집니다. CUBE 는 순서와 무관합니다.' }
  ]
},

/* ======================= 12 ======================= */
{
  id: 'sq-12', unit: '3부. SQL 활용 (과목2)', title: '윈도우 함수와 Top N 쿼리', time: '95분',
  summary: '윈도우 함수는 행을 합치지 않고 각 행 옆에 순위·누적·이전 값을 붙인다. RANK / DENSE_RANK / ROW_NUMBER 의 동점 처리 차이, 윈도우 절의 기본 범위가 단골 함정이다.',
  goals: ['순위 함수 3종의 동점 처리를 계산한다', '`OVER (PARTITION BY ... ORDER BY ...)` 구조를 읽는다', '누적 합과 윈도우 절(ROWS/RANGE)의 차이를 안다', 'Top N 을 ROWNUM / FETCH / TOP / 윈도우 함수로 구한다'],
  terms: [
    { t: '윈도우 함수', d: '`함수() OVER (...)` 형태로, **행을 줄이지 않고** 각 행에 대해 파티션 안에서 계산한 값을 붙이는 함수. 분석 함수라고도 부른다.' },
    { t: 'PARTITION BY', d: '그룹 나누기(그룹별로 따로 계산). GROUP BY 와 달리 행이 합쳐지지 않는다.' },
    { t: '윈도우 절', d: '계산에 포함할 행의 범위. `ROWS`(물리적 행 수) / `RANGE`(값 범위). 예: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.' },
    { t: 'Top N 쿼리', d: '정렬 기준으로 **상위(또는 하위) N 건**만 가져오는 쿼리.' }
  ],
  sections: [
    { h: '1. 문법', md: [
      '```sql\n함수(인자) OVER ( [PARTITION BY 컬럼] [ORDER BY 컬럼 [ASC|DESC]] [윈도우 절] )\n```',
      '- 윈도우 함수는 **SELECT 절과 ORDER BY 절에서만** 쓸 수 있습니다 (WHERE, GROUP BY, HAVING 불가). 조건에 쓰려면 **인라인 뷰**로 감싸서 바깥에서 거릅니다.',
      '- `OVER` 안의 `ORDER BY` 는 윈도우 내부 계산용이고, 결과 출력 순서를 보장하지 않습니다.'] },
    { h: '2. 순위 함수 — 동점 처리가 시험 포인트', md: [
      '| 함수 | 동점 처리 | 점수 5000, 3000, 3000, 2000 의 결과 |', '|---|---|---|',
      '| `RANK()` | 동점은 같은 순위, **다음 순위를 건너뜀** | 1, 2, 2, **4** |',
      '| `DENSE_RANK()` | 동점은 같은 순위, **건너뛰지 않음** | 1, 2, 2, **3** |',
      '| `ROW_NUMBER()` | 동점이어도 **고유한 번호**(동점의 순서는 임의) | 1, 2, 3, 4 |',
      '- `NTILE(n)`: 행을 n 개의 균등한 그룹으로 나누어 그룹 번호를 부여.',
      '- `PERCENT_RANK()`, `CUME_DIST()`: 상대적 위치(0~1)와 누적 분포.'] },
    { h: '3. 집계 윈도우, 행 이동, 값 함수', md: [
      '- **집계 함수**를 윈도우로: `SUM(SAL) OVER (PARTITION BY DEPTNO)` (부서 합계를 각 행에), `SUM(SAL) OVER (ORDER BY ...)` (누적 합).',
      '- **LAG(컬럼, n, 기본값)**: n 행 **이전** 값, **LEAD**: n 행 **이후** 값 (n 기본 1). 없으면 NULL(또는 기본값).',
      '- **FIRST_VALUE / LAST_VALUE**: 윈도우의 첫/마지막 값.',
      '- `RATIO_TO_REPORT(컬럼)`: 전체(파티션) 합계 대비 비율 (Oracle).',
      '**윈도우 절 기본값(함정)**: `ORDER BY` 가 있고 윈도우 절이 **없으면** 기본 범위는 `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` 입니다. 그래서',
      '- 누적 합에서 **동점(같은 정렬 값) 행이 같은 누적 값**을 갖고,',
      '- `LAST_VALUE` 는 파티션의 마지막이 아니라 **현재 행(까지 동점 포함)의 값**이 나옵니다. 진짜 마지막 값을 원하면 `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.'] },
    { h: '4. Top N 쿼리', md: [
      '| DBMS | 방법 |', '|---|---|',
      '| Oracle | `ROWNUM` (인라인 뷰), `FETCH FIRST n ROWS ONLY` (12c+), 윈도우 함수 |',
      '| SQL Server | `SELECT TOP n ...`, `TOP n WITH TIES` (동점 포함), `OFFSET/FETCH` |',
      '| 공통 | 인라인 뷰 + `RANK`/`ROW_NUMBER` 로 순위를 매긴 뒤 바깥에서 필터 |',
      '**ROWNUM 의 함정**: ROWNUM 은 **정렬 전에** 행에 번호가 붙고 WHERE 가 먼저 적용됩니다. `WHERE ROWNUM <= 3 ORDER BY SAL` 은 "정렬 후 상위 3건"이 아니라 "아무 3건을 가져와서 정렬"입니다. 올바른 방법은 **정렬된 인라인 뷰를 만들고 그 바깥에서 ROWNUM 조건**을 거는 것입니다. 또 `ROWNUM = 2` 나 `ROWNUM > 1` 은 항상 결과가 없습니다(첫 행이 ROWNUM 1 이라 탈락하면 다음 행이 다시 1 번이 되기 때문).',
      '`FETCH FIRST 3 ROWS ONLY` 는 ORDER BY **뒤**에 붙이고 `WITH TIES` 를 쓰면 동점을 함께 가져옵니다.'] }
  ],
  misconceptions: [
    { wrong: '"RANK 와 DENSE_RANK 는 같은 결과다."', right: '동점 이후가 다르다. RANK 는 건너뛴 순위(1,2,2,**4**), DENSE_RANK 는 연속 순위(1,2,2,**3**).', why: '"밀도(DENSE)가 높다 = 빈틈 없다"로 외우세요.' },
    { wrong: '"윈도우 함수는 WHERE 절에서 조건으로 바로 쓸 수 있다."', right: '쓸 수 없다. **인라인 뷰**로 한 번 감싸 바깥 WHERE 에서 `RN <= 3` 처럼 거른다.', why: '논리적 실행 순서에서 윈도우 함수는 WHERE/GROUP BY/HAVING 이후 SELECT 단계에서 계산됩니다.' },
    { wrong: '"`PARTITION BY` 는 `GROUP BY` 와 같아서 행이 합쳐진다."', right: 'PARTITION BY 는 계산 범위를 나눌 뿐 **행 수는 그대로**다. 각 행 옆에 집계값이 붙는다.', why: 'GROUP BY 는 행을 그룹당 하나로 줄이는 반면 윈도우 함수는 줄이지 않습니다.' },
    { wrong: '"`WHERE ROWNUM <= 3 ORDER BY SAL DESC` 는 급여 상위 3명이다."', right: 'ROWNUM 이 정렬보다 먼저 적용되어 **임의의 3행을 정렬**한 것이다. 정렬된 인라인 뷰에서 ROWNUM 을 걸어야 한다.', why: '(우연히 물리적 순서가 맞으면 맞아 보여서 더 위험합니다.)' },
    { wrong: '"LAST_VALUE 는 항상 파티션의 마지막 행 값을 준다."', right: '기본 윈도우가 현재 행까지라서 **현재 행 값(동점 포함)** 이 나온다. 마지막 값을 위해서는 UNBOUNDED FOLLOWING 까지 지정.', why: '`ORDER BY` 가 있고 윈도우 절이 없을 때의 기본값 때문입니다.' }
  ],
  examples: [
    { title: 'RANK / DENSE_RANK / ROW_NUMBER', lang: 'sql', prelude: true, code: R`
SELECT ENAME, SAL,
       RANK()       OVER (ORDER BY SAL DESC) AS RK,
       DENSE_RANK() OVER (ORDER BY SAL DESC) AS DRK,
       ROW_NUMBER() OVER (ORDER BY SAL DESC, EMPNO) AS RN
FROM EMP
ORDER BY SAL DESC, EMPNO;
`, output: R`
ENAME | SAL | RK | DRK | RN
KIM | 5000 | 1 | 1 | 1
LEE | 3000 | 2 | 2 | 2
PARK | 2800 | 3 | 3 | 3
HAN | 2500 | 4 | 4 | 4
CHOI | 1500 | 5 | 5 | 5
JUNG | 1500 | 5 | 5 | 6
SHIN | 1200 | 7 | 6 | 7
YOON | 1000 | 8 | 7 | 8
`, notes: ['CHOI 와 JUNG 은 둘 다 1500(공동 5위). RANK 는 다음이 7 위(5,5 다음 7), DENSE_RANK 는 6 위. ROW_NUMBER 는 동점이어도 EMPNO 로 구분해 5, 6.'] },
    { title: 'PARTITION BY: 부서별 순위와 부서 합계', lang: 'sql', prelude: true, code: R`
SELECT ENAME, DEPTNO, SAL,
       RANK() OVER (PARTITION BY DEPTNO ORDER BY SAL DESC) AS DEPT_RK,
       SUM(SAL) OVER (PARTITION BY DEPTNO) AS DEPT_SUM
FROM EMP
WHERE DEPTNO IS NOT NULL
ORDER BY DEPTNO, SAL DESC, EMPNO;
`, output: R`
ENAME | DEPTNO | SAL | DEPT_RK | DEPT_SUM
KIM | 10 | 5000 | 1 | 11000
LEE | 10 | 3000 | 2 | 11000
CHOI | 10 | 1500 | 3 | 11000
JUNG | 10 | 1500 | 3 | 11000
PARK | 20 | 2800 | 1 | 6300
HAN | 20 | 2500 | 2 | 6300
YOON | 20 | 1000 | 3 | 6300
`, notes: ['행은 줄지 않고(7행) 각 행에 부서 합계가 붙습니다. 순위는 부서마다 다시 1 부터.'] },
    { title: '누적 합: RANGE 기본값과 ROWS 의 차이', lang: 'sql', prelude: true, code: R`
SELECT ENAME, SAL,
       SUM(SAL) OVER (ORDER BY SAL)                          AS RUN_RANGE,
       SUM(SAL) OVER (ORDER BY SAL ROWS UNBOUNDED PRECEDING) AS RUN_ROWS
FROM EMP
ORDER BY SAL, EMPNO;
`, output: R`
ENAME | SAL | RUN_RANGE | RUN_ROWS
YOON | 1000 | 1000 | 1000
SHIN | 1200 | 2200 | 2200
CHOI | 1500 | 5200 | 3700
JUNG | 1500 | 5200 | 5200
HAN | 2500 | 7700 | 7700
PARK | 2800 | 10500 | 10500
LEE | 3000 | 13500 | 13500
KIM | 5000 | 18500 | 18500
`, notes: ['동점(SAL 1500: CHOI, JUNG)에서 윈도우 절이 없는 기본(RANGE)은 두 행이 **같은 누적 값 5200** 입니다(동점 행을 한꺼번에 포함). `ROWS` 는 물리적 행 단위라 CHOI 는 3700, JUNG 은 5200 으로 한 행씩 쌓입니다.'] },
    { title: 'LAG / LEAD 와 LAST_VALUE 함정', lang: 'sql', prelude: true, code: R`
SELECT ENAME, HIREDATE, SAL,
       LAG(SAL, 1)  OVER (ORDER BY HIREDATE) AS PREV_SAL,
       LEAD(SAL, 1) OVER (ORDER BY HIREDATE) AS NEXT_SAL,
       LAST_VALUE(SAL) OVER (ORDER BY HIREDATE) AS LAST_DEFAULT,
       LAST_VALUE(SAL) OVER (ORDER BY HIREDATE ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LAST_REAL
FROM EMP
ORDER BY HIREDATE;
`, output: R`
ENAME | HIREDATE | SAL | PREV_SAL | NEXT_SAL | LAST_DEFAULT | LAST_REAL
KIM | 2015-03-01 | 5000 | NULL | 3000 | 5000 | 1200
LEE | 2017-06-15 | 3000 | 5000 | 2800 | 3000 | 1200
PARK | 2018-01-10 | 2800 | 3000 | 2500 | 2800 | 1200
HAN | 2019-11-05 | 2500 | 2800 | 1500 | 2500 | 1200
CHOI | 2020-09-01 | 1500 | 2500 | 1500 | 1500 | 1200
JUNG | 2021-02-20 | 1500 | 1500 | 1000 | 1500 | 1200
YOON | 2022-07-11 | 1000 | 1500 | 1200 | 1000 | 1200
SHIN | 2023-04-03 | 1200 | 1000 | NULL | 1200 | 1200
`, notes: ['입사일 순으로 보면 LAG 는 바로 앞 사원의 급여, LEAD 는 바로 뒤. `LAST_DEFAULT` 는 현재 행 값과 같고(기본 윈도우가 현재 행까지), `LAST_REAL` 만 전체의 마지막(SHIN 1200)이 나옵니다.'] },
    { title: 'Top N: 윈도우 함수로 부서별 급여 상위 1명', lang: 'sql', prelude: true, code: R`
SELECT DEPTNO, ENAME, SAL
FROM (SELECT DEPTNO, ENAME, SAL,
             RANK() OVER (PARTITION BY DEPTNO ORDER BY SAL DESC) AS RK
      FROM EMP WHERE DEPTNO IS NOT NULL)
WHERE RK = 1
ORDER BY DEPTNO;
`, output: R`
DEPTNO | ENAME | SAL
10 | KIM | 5000
20 | PARK | 2800
`, notes: ['윈도우 함수는 WHERE 에 직접 못 쓰므로 인라인 뷰로 감싸 바깥에서 `RK = 1` 로 거릅니다.'] },
    { title: '[Oracle] ROWNUM 의 함정', lang: 'sql', noverify: true, code: R`
-- (1) 잘못된 Top 3: 임의의 3행을 가져온 뒤 정렬
SELECT ENAME, SAL FROM EMP WHERE ROWNUM <= 3 ORDER BY SAL;
-- (2) 올바른 하위 3명: 정렬된 인라인 뷰 + 바깥 ROWNUM
SELECT ENAME, SAL
FROM (SELECT ENAME, SAL FROM EMP ORDER BY SAL, EMPNO)
WHERE ROWNUM <= 3;
`, output: R`
ENAME | SAL
PARK | 2800
LEE | 3000
KIM | 5000

ENAME | SAL
YOON | 1000
SHIN | 1200
CHOI | 1500
`, notes: ['Oracle 전용이라 검증하지 못했습니다(출력은 저장된 순서 KIM, LEE, PARK, … 를 가정해 직접 계산). (1) 은 처음 읽힌 3행(KIM, LEE, PARK)을 정렬한 것이라 **진짜 하위 3명이 아닙니다**. (2) 가 정답. 실제 Oracle 에서 (1) 의 "처음 3행"은 저장 순서에 따라 달라질 수 있습니다.'] },
    { title: '[Oracle/SQL Server] FETCH FIRST · TOP', lang: 'sql', noverify: true, code: R`
-- Oracle 12c 이상
SELECT ENAME, SAL FROM EMP ORDER BY SAL DESC FETCH FIRST 3 ROWS ONLY;
-- SQL Server
SELECT TOP 3 ENAME, SAL FROM EMP ORDER BY SAL DESC;
`, output: R`
ENAME | SAL
KIM | 5000
LEE | 3000
PARK | 2800

ENAME | SAL
KIM | 5000
LEE | 3000
PARK | 2800
`, notes: ['두 구문의 결과가 같습니다(급여 상위 3명). 동점까지 가져오려면 Oracle 은 `FETCH FIRST 3 ROWS WITH TIES`, SQL Server 는 `TOP 3 WITH TIES`(ORDER BY 필수).'] }
  ],
  exercises: [
    { q: 'RANK, DENSE_RANK, ROW_NUMBER 를 점수 [90, 80, 80, 70] 에 적용한 결과를 각각 써 보세요.', hint: '동점 처리', answer: 'RANK: 1,2,2,4 / DENSE_RANK: 1,2,2,3 / ROW_NUMBER: 1,2,3,4.' },
    { q: '부서별 급여 순위 상위 2명만 보는 쿼리를 윈도우 함수와 인라인 뷰로 써 보세요.', hint: 'WHERE RK <= 2', answer: fence('sql', 'SELECT * FROM (\n  SELECT DEPTNO, ENAME, SAL, RANK() OVER (PARTITION BY DEPTNO ORDER BY SAL DESC) RK\n  FROM EMP WHERE DEPTNO IS NOT NULL\n) WHERE RK <= 2;') },
    { q: '`WHERE ROWNUM = 2` 를 쓰면 왜 항상 0건일까요?', hint: '첫 행이 ROWNUM 1 을 받은 뒤 탈락하면?', answer: '첫 행이 ROWNUM = 1 을 받고 조건(= 2)에 맞지 않아 탈락하면 다음 행이 다시 ROWNUM = 1 이 되므로 2 가 될 수 없다.' }
  ],
  quiz: [
    { q: '점수가 [100, 90, 90, 80] 일 때 `RANK()` 의 결과는?', choices: ['1,2,3,4', '1,2,2,3', '1,2,2,4', '1,2,2,2'], answer: 2, explain: 'RANK 는 동점에 같은 순위를 주고 다음 순위를 건너뜁니다.' },
    { q: '같은 점수일 때 `DENSE_RANK()` 의 특징은?', choices: ['순위가 모두 다르다', '동점 후 다음 순위가 건너뛰어진다', '동점 후 다음 순위가 연속된다', 'NULL 이 된다'], answer: 2, explain: 'DENSE_RANK 는 동점에 같은 순위를 주고 다음 순위를 건너뛰지 않습니다.' },
    { q: '동점이어도 항상 서로 다른 고유 번호를 부여하는 함수는?', accept: ['ROW_NUMBER', 'row_number', 'ROW_NUMBER()', 'row_number()'], explain: 'ROW_NUMBER() 는 중복 없는 일련번호를 줍니다.' },
    { q: '윈도우 함수를 사용할 수 있는 절은?', choices: ['SELECT 절과 ORDER BY 절', 'WHERE 절', 'GROUP BY 절', 'HAVING 절'], answer: 0, explain: '윈도우 함수는 SELECT 와 ORDER BY 에서만 사용할 수 있습니다.' },
    { q: '`SUM(SAL) OVER (PARTITION BY DEPTNO)` 에 대한 설명으로 옳은 것은?', choices: ['부서별로 행이 하나로 합쳐진다', '각 행에 소속 부서의 급여 합계가 붙는다', 'NULL 부서는 오류', '전체 합계만 반환한다'], answer: 1, explain: '윈도우 함수는 행 수를 줄이지 않고 각 행에 파티션별 집계값을 붙입니다.' },
    { q: '`LAG(SAL, 1) OVER (ORDER BY HIREDATE)` 는 무엇을 반환하는가?', choices: ['다음 행의 SAL', '바로 이전 행의 SAL', '첫 행의 SAL', '평균 SAL'], answer: 1, explain: 'LAG 는 정렬 기준에서 n 행 이전 값, LEAD 는 이후 값입니다.' },
    { q: 'ORDER BY 가 있고 윈도우 절이 없는 `SUM() OVER (ORDER BY X)` 에서 X 가 같은 행들의 누적 합은?', choices: ['서로 다르다', '모두 같은 값이다(동점 행까지 포함)', 'NULL', '오류'], answer: 1, explain: '기본 범위가 RANGE UNBOUNDED PRECEDING ~ CURRENT ROW 라서 동점(같은 정렬값) 행이 함께 포함되어 같은 누적 값을 가집니다.' },
    { q: 'Oracle 에서 `SELECT * FROM EMP WHERE ROWNUM <= 3 ORDER BY SAL DESC` 가 급여 상위 3명을 보장하지 않는 이유는?', choices: ['ORDER BY 가 먼저 실행되어서', 'ROWNUM 이 정렬 전에 적용되어서', 'DESC 는 사용할 수 없어서', 'ROWNUM 은 숫자가 아니라서'], answer: 1, explain: 'WHERE 의 ROWNUM 조건이 정렬보다 먼저 적용되어 임의의 3행을 정렬하게 됩니다. 정렬된 인라인 뷰를 만들고 바깥에서 ROWNUM 을 써야 합니다.' },
    { q: 'SQL Server 에서 동점을 포함하여 상위 N 건을 가져오는 구문은?', choices: ['TOP N', 'TOP N WITH TIES', 'FETCH N', 'LIMIT N'], answer: 1, explain: '`TOP N WITH TIES` (ORDER BY 필수). Oracle 은 `FETCH FIRST N ROWS WITH TIES`.' }
  ]
},

/* ======================= 13 ======================= */
{
  id: 'sq-13', unit: '3부. SQL 활용 (과목2)', title: '계층형 질의, 셀프 조인, PIVOT/UNPIVOT, 정규 표현식', time: '95분',
  summary: '계층 구조(상사-부하)는 Oracle 의 CONNECT BY / SQL Server 의 재귀 CTE 로 조회한다. 행↔열 전환은 PIVOT/UNPIVOT, 문자열 패턴 검색은 REGEXP 함수다.',
  goals: ['CONNECT BY 의 START WITH, PRIOR, LEVEL 의 의미와 방향을 설명한다', '셀프 조인으로 사원-상사를 함께 조회한다', 'PIVOT/UNPIVOT 의 결과 모양을 예측한다', 'REGEXP_LIKE/SUBSTR/REPLACE 를 읽는다'],
  terms: [
    { t: '계층형 질의', d: '트리 구조(조직도, 카테고리)를 부모-자식 관계를 따라 **깊이 순서**로 조회하는 질의.' },
    { t: 'START WITH / CONNECT BY PRIOR', d: 'Oracle 의 계층 질의 절. START WITH = **루트 행** 조건, CONNECT BY = 부모-자식 연결 조건, PRIOR = "이전(부모) 행의 값".' },
    { t: 'LEVEL', d: '계층 깊이. 루트가 **1**.' },
    { t: '셀프 조인', d: '**같은 테이블을 두 번** 별칭을 달리해 조인(예: 사원 테이블에서 사원과 그 상사).' },
    { t: 'PIVOT / UNPIVOT', d: 'PIVOT = **행을 열로** 돌려 요약, UNPIVOT = **열을 행으로** 되돌림.' }
  ],
  sections: [
    { h: '1. 셀프 조인', md: [
      '```sql\n-- 사원과 그 상사의 이름\nSELECT E.ENAME AS EMP, M.ENAME AS MGR\nFROM   EMP E LEFT JOIN EMP M ON E.MGR = M.EMPNO;\n```',
      '같은 테이블이라 **별칭이 필수**입니다. 루트(KIM, MGR 이 NULL)도 보려면 LEFT JOIN.'] },
    { h: '2. 계층형 질의 (Oracle)', md: [
      '```sql\nSELECT LEVEL, LPAD(\' \', 2 * (LEVEL - 1)) || ENAME AS TREE, EMPNO, MGR\nFROM   EMP\nSTART WITH MGR IS NULL           -- 루트: 상사가 없는 사람\nCONNECT BY PRIOR EMPNO = MGR     -- 부모의 EMPNO = 자식의 MGR  (순방향)\nORDER SIBLINGS BY EMPNO;         -- 같은 부모 아래 형제끼리 정렬\n```',
      '| 요소 | 의미 |', '|---|---|',
      '| `START WITH 조건` | 계층의 **시작(루트) 행** 지정 |',
      '| `CONNECT BY [NOCYCLE] 조건` | 부모-자식 연결. `PRIOR` 가 붙은 쪽이 **부모 행**의 컬럼 |',
      '| `LEVEL` | 깊이(루트 = 1) |',
      '| `ORDER SIBLINGS BY` | 계층 구조를 **유지한 채** 형제끼리 정렬 (일반 ORDER BY 는 트리를 깨뜨림) |',
      '| `CONNECT_BY_ROOT 컬럼` | 현재 행의 **루트** 값 |',
      '| `SYS_CONNECT_BY_PATH(컬럼, 구분자)` | 루트부터 현재 행까지의 **경로 문자열** |',
      '| `CONNECT_BY_ISLEAF` | 말단(자식 없음)이면 1 |',
      '| `NOCYCLE` | 순환 참조가 있어도 오류 없이 중단 |',
      '**방향**: `PRIOR EMPNO = MGR` 은 부모→자식(**순방향/Top-down**), `EMPNO = PRIOR MGR` 은 자식→부모(**역방향/Bottom-up**, 말단에서 루트로 거슬러 올라감). PRIOR 가 어느 쪽에 붙었는지로 판단합니다.',
      '**WHERE 와 CONNECT BY 의 차이**: WHERE 는 계층이 **전부 만들어진 뒤** 행을 걸러내고(자식은 유지될 수 있음), CONNECT BY 에 붙인 조건은 **가지 자체를 자릅니다**(그 아래 후손도 사라짐).',
      '**SQL Server** 는 CONNECT BY 가 없어 **재귀 CTE**(`WITH ... AS (앵커 UNION ALL 재귀)`)로 같은 일을 합니다.'] },
    { h: '3. PIVOT 과 UNPIVOT (Oracle 11g+)', md: [
      '```sql\nSELECT * FROM (SELECT DEPTNO, JOB, SAL FROM EMP)\nPIVOT (SUM(SAL) FOR JOB IN (\'CLERK\' AS CLERK, \'MANAGER\' AS MANAGER));\n```',
      '- PIVOT: **집계 함수** + `FOR 피벗컬럼 IN (값 목록)`. 값 목록의 각 값이 **새 컬럼**이 되고, 나머지 컬럼은 자동으로 GROUP BY 기준이 됩니다. 해당 행이 없으면 **NULL**. IN 절에는 **상수 값만** 쓸 수 있습니다(서브쿼리 불가).',
      '- UNPIVOT: `UNPIVOT (값컬럼 FOR 구분컬럼 IN (열1, 열2, ...))` — 열 이름이 구분 컬럼의 값, 열 값이 값 컬럼의 값이 되는 행이 생성됩니다. 기본적으로 **NULL 값 행은 제외**(`EXCLUDE NULLS`)됩니다.',
      '- PIVOT 이 없던 시절의 방식은 `SUM(CASE WHEN JOB = \'CLERK\' THEN SAL END)` 처럼 **조건부 집계**를 쓰는 것이며 결과가 같습니다.'] },
    { h: '4. 정규 표현식 함수 (Oracle)', md: [
      '| 함수 | 용도 |', '|---|---|',
      '| `REGEXP_LIKE(문자열, 패턴 [, 옵션])` | 패턴과 일치하면 TRUE (WHERE 에서 사용). 옵션 `\'i\'` = 대소문자 무시 |',
      '| `REGEXP_SUBSTR(문자열, 패턴 ...)` | 패턴에 일치하는 **부분 문자열** 추출 (없으면 NULL) |',
      '| `REGEXP_REPLACE(문자열, 패턴, 바꿀 값)` | 일치 부분을 **치환** |',
      '| `REGEXP_INSTR(문자열, 패턴 ...)` | 일치 부분의 **시작 위치** (없으면 0) |',
      '| `REGEXP_COUNT(문자열, 패턴)` | 일치 **횟수** |',
      '**메타문자**: `^` 시작, `$` 끝, `.` 임의 한 글자, `*` 0회 이상, `+` 1회 이상, `?` 0 또는 1회, `{n,m}` n~m 회, `[abc]` 문자 집합, `[^abc]` 부정, `|` 또는, `( )` 그룹. 숫자는 `[0-9]` 또는 `[[:digit:]]`.',
      '`LIKE` 는 `%`/`_` 만 되지만 정규식은 "숫자로만 이루어진 문자열", "이메일 형식" 같은 **복잡한 패턴**을 표현합니다. 주의: 정규식 함수는 LIKE 보다 느릴 수 있습니다.'] }
  ],
  misconceptions: [
    { wrong: '"`CONNECT BY PRIOR EMPNO = MGR` 의 PRIOR 는 자식 쪽을 가리킨다."', right: 'PRIOR 는 **부모 행**의 컬럼 값이다. `PRIOR EMPNO = MGR` → 부모의 EMPNO 와 자식의 MGR 이 같음 = 부모에서 자식으로 내려가는 순방향.', why: '`EMPNO = PRIOR MGR` 로 쓰면 반대로 자식에서 부모로 올라가는 역방향입니다.' },
    { wrong: '"계층 질의의 ORDER BY 로 정렬해도 트리 구조는 유지된다."', right: '일반 `ORDER BY` 는 전체를 다시 정렬해 **계층 순서가 깨진다**. 형제끼리만 정렬하려면 `ORDER SIBLINGS BY`.', why: 'LEVEL 순서로 정렬하면 레벨별로 나열되는 모양이 됩니다.' },
    { wrong: '"계층 질의에서 루트의 LEVEL 은 0 이다."', right: '**루트의 LEVEL 은 1**이다.', why: '들여쓰기를 `LPAD(\' \', 2 * (LEVEL - 1))` 로 하는 이유입니다.' },
    { wrong: '"WHERE 절에 쓴 조건은 CONNECT BY 의 조건과 똑같이 가지를 자른다."', right: 'WHERE 는 계층이 완성된 **뒤에** 해당 행만 걸러낼 뿐(후손은 남을 수 있음), CONNECT BY 의 조건은 **그 가지와 후손 전체**를 제외한다.', why: '쿼리 실행 순서: START WITH → CONNECT BY → WHERE.' },
    { wrong: '"PIVOT 의 IN 절에는 서브쿼리를 쓸 수 있다."', right: 'IN 절에는 **상수 값 목록**만 가능하다(동적으로 늘리려면 XML 옵션이나 동적 SQL).', why: '컬럼의 개수는 쿼리 작성 시점에 고정되어야 하기 때문입니다.' },
    { wrong: '"REGEXP_LIKE 의 `.` 은 마침표 문자 자체와 일치한다."', right: '`.` 은 **임의의 한 글자**. 마침표를 찾으려면 `\\.` 로 이스케이프.', why: '메타문자를 문자 그대로 찾을 때는 역슬래시를 씁니다.' }
  ],
  examples: [
    { title: '셀프 조인: 사원과 상사', lang: 'sql', prelude: true, code: R`
SELECT E.ENAME AS EMP, M.ENAME AS MGR
FROM EMP E LEFT JOIN EMP M ON E.MGR = M.EMPNO
ORDER BY E.EMPNO;
`, output: R`
EMP | MGR
KIM | NULL
LEE | KIM
PARK | KIM
CHOI | LEE
JUNG | LEE
HAN | PARK
YOON | PARK
SHIN | PARK
`, notes: ['KIM 은 상사가 없어 MGR 이 NULL (LEFT JOIN 이라 보존). 같은 테이블을 E, M 두 별칭으로 사용.'] },
    { title: '재귀 CTE — 계층 조회 (표준/SQL Server)', lang: 'sql', prelude: true, code: R`
WITH RECURSIVE ORG (EMPNO, ENAME, MGR, LVL, PATH) AS (
  SELECT EMPNO, ENAME, MGR, 1, ENAME FROM EMP WHERE MGR IS NULL
  UNION ALL
  SELECT E.EMPNO, E.ENAME, E.MGR, O.LVL + 1, O.PATH || '/' || E.ENAME
  FROM EMP E JOIN ORG O ON E.MGR = O.EMPNO
)
SELECT LVL, ENAME, PATH FROM ORG ORDER BY PATH;
`, output: R`
LVL | ENAME | PATH
1 | KIM | KIM
2 | LEE | KIM/LEE
3 | CHOI | KIM/LEE/CHOI
3 | JUNG | KIM/LEE/JUNG
2 | PARK | KIM/PARK
3 | HAN | KIM/PARK/HAN
3 | SHIN | KIM/PARK/SHIN
3 | YOON | KIM/PARK/YOON
`, notes: ['루트(KIM)부터 부하로 내려가며 LVL 을 1 씩 늘립니다. Oracle 의 CONNECT BY 결과와 같은 트리입니다. (경로 문자열 정렬은 이름순이라 형제 순서가 EMPNO 순과 다를 수 있음)'] },
    { title: '[Oracle] CONNECT BY 순방향', lang: 'sql', noverify: true, code: R`
SELECT LEVEL, LPAD(' ', 2 * (LEVEL - 1)) || ENAME AS TREE
FROM EMP
START WITH MGR IS NULL
CONNECT BY PRIOR EMPNO = MGR
ORDER SIBLINGS BY EMPNO;
`, output: R`
LEVEL | TREE
1 | KIM
2 |   LEE
3 |     CHOI
3 |     JUNG
2 |   PARK
3 |     HAN
3 |     YOON
3 |     SHIN
`, notes: ['Oracle 전용이라 검증하지 못했고, 같은 트리를 재귀 CTE 로 계산해 옮겼습니다. 루트 KIM 이 LEVEL 1, 그 부하 LEE·PARK 가 2, 손자들이 3. `ORDER SIBLINGS BY EMPNO` 로 형제끼리 EMPNO 순.'] },
    { title: '[Oracle] 역방향(Bottom-up) 과 경로', lang: 'sql', noverify: true, code: R`
SELECT LEVEL, ENAME, SYS_CONNECT_BY_PATH(ENAME, '/') AS PATH
FROM EMP
START WITH ENAME = 'YOON'
CONNECT BY EMPNO = PRIOR MGR;
`, output: R`
LEVEL | ENAME | PATH
1 | YOON | /YOON
2 | PARK | /YOON/PARK
3 | KIM | /YOON/PARK/KIM
`, notes: ['PRIOR 가 MGR 쪽에 붙어 **자식→부모** 방향으로 올라갑니다(YOON → 상사 PARK → 상사 KIM). 직접 계산한 출력입니다.'] },
    { title: 'PIVOT 과 같은 결과를 만드는 조건부 집계', lang: 'sql', prelude: true, code: R`
SELECT DEPTNO,
       SUM(CASE WHEN JOB = 'CLERK'   THEN SAL END) AS CLERK,
       SUM(CASE WHEN JOB = 'MANAGER' THEN SAL END) AS MANAGER
FROM EMP
WHERE DEPTNO IS NOT NULL
GROUP BY DEPTNO
ORDER BY DEPTNO;
`, output: R`
DEPTNO | CLERK | MANAGER
10 | NULL | 3000
20 | 1000 | 2800
`, notes: ['10번 부서는 CLERK 이 없어 NULL, 20번 부서는 CLERK 1000 / MANAGER 2800. Oracle 의 `PIVOT (SUM(SAL) FOR JOB IN (\'CLERK\' AS CLERK, \'MANAGER\' AS MANAGER))` 가 만들어 내는 결과와 같습니다.'] },
    { title: '[Oracle] UNPIVOT', lang: 'sql', noverify: true, code: R`
-- 위 PIVOT 결과를 PIVOTED 라고 할 때
SELECT DEPTNO, JOB, SAL
FROM PIVOTED
UNPIVOT (SAL FOR JOB IN (CLERK, MANAGER));
`, output: R`
DEPTNO | JOB | SAL
10 | MANAGER | 3000
20 | CLERK | 1000
20 | MANAGER | 2800
`, notes: ['열(CLERK, MANAGER)이 행으로 돌아옵니다. 10번 부서의 CLERK 값은 NULL 이라 **기본값(EXCLUDE NULLS)** 에 의해 행 자체가 만들어지지 않습니다. 직접 계산한 출력입니다.'] },
    { title: '정규 표현식 함수', lang: 'sql', code: R`
CREATE TABLE T (V TEXT);
INSERT INTO T VALUES ('A12'), ('B345'), ('C'), ('1a2b3c');
SELECT V FROM T WHERE REGEXP_LIKE(V, '^[A-Z][0-9]+$') ORDER BY V;
SELECT V, REGEXP_REPLACE(V, '[0-9]', '#') AS MASKED,
       REGEXP_SUBSTR(V, '[0-9]+') AS FIRST_NUM,
       REGEXP_COUNT(V, '[0-9]') AS DIGITS
FROM T ORDER BY V;
`, output: R`
V
A12
B345

V | MASKED | FIRST_NUM | DIGITS
1a2b3c | #a#b#c | 1 | 3
A12 | A## | 12 | 2
B345 | B### | 345 | 3
C | C | NULL | 0
`, notes: ['`^[A-Z][0-9]+$` 는 "대문자 하나 + 숫자 1개 이상으로 끝남" → A12, B345. `C`(숫자 없음)와 `1a2b3c`(대문자로 시작하지 않음)는 제외. (이 앱의 실행기는 Oracle 의 REGEXP_* 를 Python 정규식으로 흉내 냅니다.)'] }
  ],
  exercises: [
    { q: '`START WITH MGR IS NULL CONNECT BY PRIOR EMPNO = MGR` 에서 LEVEL 이 3 인 사원은 누구인가요?', hint: 'KIM(1) → LEE·PARK(2) → …', answer: 'CHOI, JUNG, HAN, YOON, SHIN (KIM 의 손자들).' },
    { q: '`CONNECT BY EMPNO = PRIOR MGR` 로 START WITH ENAME = \'CHOI\' 이면 어떤 순서로 나올까요?', hint: '자식 → 부모로 올라간다', answer: 'CHOI(1) → LEE(2) → KIM(3).' },
    { q: '직무(JOB)별로 부서 10, 20 의 급여 합계를 열로 펼치는 쿼리를 조건부 집계로 써 보세요.', hint: 'SUM(CASE WHEN DEPTNO = 10 THEN SAL END)', answer: fence('sql', "SELECT JOB,\n       SUM(CASE WHEN DEPTNO = 10 THEN SAL END) AS D10,\n       SUM(CASE WHEN DEPTNO = 20 THEN SAL END) AS D20\nFROM EMP GROUP BY JOB;") }
  ],
  quiz: [
    { q: 'Oracle 계층형 질의에서 루트 행의 LEVEL 값은?', accept: ['1'], explain: '루트(START WITH 로 지정한 행)의 LEVEL 은 1 입니다.' },
    { q: '`CONNECT BY PRIOR EMPNO = MGR` 은 어떤 방향의 전개인가?', choices: ['자식 → 부모 (역방향)', '부모 → 자식 (순방향)', '형제 방향', '방향이 없다'], answer: 1, explain: 'PRIOR 쪽이 부모 행의 컬럼이므로 부모의 EMPNO 와 자식의 MGR 이 같은 행으로 내려가는 순방향입니다.' },
    { q: '계층 구조를 유지하면서 같은 부모를 가진 형제 행끼리만 정렬하는 구문은?', choices: ['ORDER BY LEVEL', 'ORDER SIBLINGS BY', 'GROUP BY LEVEL', 'SORT BY PRIOR'], answer: 1, explain: '`ORDER SIBLINGS BY` 는 트리 순서를 유지한 채 형제만 정렬합니다. 일반 ORDER BY 는 트리를 깨뜨립니다.' },
    { q: 'SQL Server 에서 계층형 질의를 구현하는 방법은?', choices: ['CONNECT BY', '재귀 CTE (WITH ... UNION ALL)', 'START WITH', 'PRIOR'], answer: 1, explain: 'SQL Server 는 CONNECT BY 가 없고 재귀 CTE 로 계층을 조회합니다.' },
    { q: '루트부터 현재 행까지의 경로를 문자열로 만들어 주는 Oracle 계층 질의 함수는?', accept: ['SYS_CONNECT_BY_PATH', 'sys_connect_by_path'], explain: 'SYS_CONNECT_BY_PATH(컬럼, 구분자)가 경로 문자열을 만듭니다.' },
    { q: '`PIVOT` 에 대한 설명으로 옳은 것은?', choices: ['열을 행으로 바꾼다', '행을 열로 바꾸며 집계 함수를 사용한다', '중복 행을 제거한다', '정렬 순서를 바꾼다'], answer: 1, explain: 'PIVOT 은 집계 함수와 함께 행 값을 컬럼으로 펼칩니다. 반대 작업이 UNPIVOT.' },
    { q: 'UNPIVOT 은 기본적으로 NULL 값 행을 어떻게 처리하는가?', choices: ['NULL 행도 포함한다', '제외한다(EXCLUDE NULLS 가 기본)', '0 으로 바꾼다', '오류가 난다'], answer: 1, explain: 'UNPIVOT 의 기본은 EXCLUDE NULLS 라서 NULL 값의 행은 생성되지 않습니다. INCLUDE NULLS 로 바꿀 수 있습니다.' },
    { q: '문자열이 패턴과 일치하는지 검사하여 WHERE 절에서 사용하는 Oracle 함수는?', accept: ['REGEXP_LIKE', 'regexp_like'], explain: 'REGEXP_LIKE 가 정규 표현식 패턴 일치 여부를 TRUE/FALSE 로 판단합니다.' },
    { q: '정규 표현식에서 "임의의 한 글자"를 의미하는 메타문자는?', choices: ['*', '.', '+', '^'], answer: 1, explain: '`.` 은 임의의 한 글자, `*` 은 0회 이상, `+` 은 1회 이상, `^` 은 시작을 뜻합니다.' }
  ]
}

);
})();
