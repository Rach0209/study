/* SQLD 트랙 — 2파일: 과목2 SQL 기본 (SELECT, 함수, WHERE·ORDER BY, GROUP BY, 조인)
 * Oracle 전용 문법(DUAL, TRUNC, (+) 등)을 쓴 예제는 noverify 이며 출력은 직접 계산한 값입니다.
 */
(() => {
const R = String.raw;
const fence = (lang, src) => '```' + lang + '\n' + src.replace(/^\n|\n$/g, '') + '\n```';
const t = window.STUDY_TRACKS.find(x => x.id === 'sqld');

t.lessons.push(

/* ======================= 5 ======================= */
{
  id: 'sq-05', unit: '2부. SQL 기본 (과목2)', title: '관계형 DB 개요와 SELECT 기본', time: '65분',
  summary: '관계형 DB 는 데이터를 행과 열의 표(릴레이션)로 저장한다. SQL 은 목적에 따라 DML·DDL·DCL·TCL 로 나뉘고, SELECT 로 원하는 컬럼(투영)과 행(선택)을 골라낸다.',
  goals: ['SQL 명령어를 DML/DDL/DCL/TCL 로 분류한다', '릴레이션의 차수와 카디널리티를 구분한다', 'SELECT 의 별칭·DISTINCT·연결 연산자를 정확히 쓴다', 'Oracle 과 SQL Server 의 기본 문법 차이를 안다'],
  terms: [
    { t: '릴레이션(Relation)', d: '관계형 DB 의 **테이블**. 행(튜플)과 열(속성)로 이루어진다.' },
    { t: '튜플 / 속성', d: '튜플 = 행 = 레코드 = 인스턴스. 속성 = 열 = 컬럼 = 필드.' },
    { t: '차수(Degree)와 카디널리티(Cardinality)', d: '릴레이션의 **차수 = 속성(열)의 개수**, **카디널리티 = 튜플(행)의 개수**.' },
    { t: '투영(Projection) / 선택(Selection)', d: '관계 대수 연산. 투영 = 필요한 **열**만 고르기(SELECT 절), 선택 = 조건에 맞는 **행**만 고르기(WHERE 절).' },
    { t: '별칭(Alias)', d: '컬럼이나 테이블에 붙이는 임시 이름. `AS` 는 생략 가능.' }
  ],
  sections: [
    { h: '1. SQL 명령어 분류', md: [
      '| 분류 | 명령어 | 용도 |', '|---|---|---|',
      '| DML (데이터 조작어) | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE` | 데이터를 조회·입력·수정·삭제 |',
      '| DDL (데이터 정의어) | `CREATE`, `ALTER`, `DROP`, `RENAME`, `TRUNCATE` | 테이블 등 **구조**를 정의 |',
      '| DCL (데이터 제어어) | `GRANT`, `REVOKE` | 권한 부여·회수 |',
      '| TCL (트랜잭션 제어어) | `COMMIT`, `ROLLBACK`, `SAVEPOINT` | 트랜잭션 확정·취소 |',
      '`SELECT` 는 DML 에 속하며 DQL 이라고 따로 부르기도 합니다. `TRUNCATE` 는 데이터를 지우지만 **DDL** 입니다(롤백 불가 — 과목2 후반부에서 다시).'] },
    { h: '2. 관계형 데이터베이스', md: [
      '- 데이터를 **릴레이션(테이블)** 에 저장하고 릴레이션 사이는 키(PK, FK)로 연결합니다.',
      '- 테이블의 행 수는 **카디널리티**, 열 수는 **차수**. (모델링의 "관계 차수 1:N" 과는 다른 뜻의 카디널리티이니 주의!)',
      '- **관계 대수** 연산: 선택(행), 투영(열), 합집합·교집합·차집합, 카티션 곱, 조인, 나누기. SQL 의 WHERE = 선택, SELECT 컬럼 목록 = 투영, 집합 연산자 = 집합 연산.',
      '- 스키마 객체: 테이블, 뷰, 인덱스, 시퀀스 등.'] },
    { md: window.SQLD_COMMON_TABLE, h: '3. 실습용 공통 테이블' },
    { h: '4. SELECT 기본', md: [
      fence('sql', 'SELECT [DISTINCT] 컬럼 또는 식 [AS 별칭], ...\nFROM   테이블;'),
      '- `*` : 모든 컬럼(실무에서는 필요한 컬럼만 쓰는 것이 좋습니다).',
      '- **별칭**: `SAL * 12 AS ANNUAL`. 공백·특수문자·대소문자 구분이 필요하면 큰따옴표 `"연 봉"` (Oracle). **WHERE 절에서는 SELECT 의 별칭을 쓸 수 없습니다**(실행 순서상 WHERE 가 먼저 실행되기 때문).',
      '- **DISTINCT**: 중복 행 제거. `SELECT DISTINCT A, B` 는 **A, B 조합**이 같은 행을 제거합니다(A 만 보는 것이 아님).',
      '- **산술 연산자**: `+ - * /` , 곱셈·나눗셈이 먼저, 괄호로 우선순위 변경. NULL 이 끼면 결과도 NULL.',
      '- **문자열 연결**: Oracle `||` (또는 `CONCAT(a, b)` — 두 개만), SQL Server `+`.',
      '- **FROM 없는 SELECT**: Oracle 은 반드시 `FROM DUAL`(한 행짜리 가상 테이블) 필요, SQL Server 는 FROM 생략 가능.'] }
  ],
  misconceptions: [
    { wrong: '"SELECT 는 DDL 이다 / TRUNCATE 는 DML 이다."', right: 'SELECT 는 **DML**(질의). TRUNCATE 는 데이터만 지우지만 **DDL** 이다.', why: 'TRUNCATE 는 자동 커밋되고 롤백이 안 되며 구조(테이블) 단위로 처리되는 DDL 의 성격을 가집니다.' },
    { wrong: '"카디널리티는 컬럼 수이다."', right: '릴레이션의 카디널리티는 **행(튜플) 수**, 차수가 열(속성) 수이다.', why: '"차수 = 열(속성) 수"로 외우고, 남는 것(카디널리티)이 행 수라고 기억하세요.' },
    { wrong: '"`SELECT DISTINCT A, B` 는 A 만 중복 제거하고 B 는 그대로 보여준다."', right: 'DISTINCT 는 **선택된 모든 컬럼의 조합**을 기준으로 중복을 제거한다.', why: 'A 가 같아도 B 가 다르면 두 행 모두 남습니다.' },
    { wrong: '"SELECT 에서 만든 별칭을 WHERE 절에서 바로 쓸 수 있다."', right: '쓸 수 없다. WHERE 는 SELECT 보다 **먼저** 실행된다. 별칭은 ORDER BY 에서는 쓸 수 있다(ORDER BY 가 가장 마지막).', why: '실행 순서: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.' },
    { wrong: '"모든 DBMS 에서 문자열 연결은 `||` 이다."', right: 'Oracle 은 `||`, SQL Server 는 `+`. (`CONCAT` 함수는 둘 다 사용 가능하지만 Oracle 은 인자 2개만)', why: 'SQLD 는 두 DBMS 의 차이를 표로 외우게 합니다.' }
  ],
  examples: [
    { title: '투영·별칭·산술식', lang: 'sql', prelude: true, code: R`
SELECT ENAME, SAL, SAL * 12 AS ANNUAL
FROM EMP
WHERE DEPTNO = 20
ORDER BY EMPNO;
`, output: R`
ENAME | SAL | ANNUAL
PARK | 2800 | 33600
HAN | 2500 | 30000
YOON | 1000 | 12000
`, notes: ['컬럼 목록 = 투영, WHERE = 선택. `ANNUAL` 이라는 별칭이 결과 헤더가 됩니다.'] },
    { title: 'DISTINCT 는 조합 기준', lang: 'sql', prelude: true, code: R`
SELECT DISTINCT DEPTNO FROM EMP ORDER BY DEPTNO;
SELECT DISTINCT DEPTNO, JOB FROM EMP ORDER BY DEPTNO, JOB;
`, output: R`
DEPTNO
NULL
10
20

DEPTNO | JOB
NULL | CLERK
10 | MANAGER
10 | PRESIDENT
10 | SALESMAN
20 | ANALYST
20 | CLERK
20 | MANAGER
`, notes: ['첫 쿼리는 DEPTNO 값(NULL 포함) 종류, 두 번째는 (DEPTNO, JOB) 조합의 종류입니다. 조합이 다르면 DEPTNO 가 같아도 모두 남습니다.'] },
    { title: '문자열 연결 (표준/Oracle 의 ||)', lang: 'sql', prelude: true, code: R`
SELECT ENAME || ' is ' || JOB AS DESCRIPTION
FROM EMP
WHERE EMPNO <= 3
ORDER BY EMPNO;
`, output: R`
DESCRIPTION
KIM is PRESIDENT
LEE is MANAGER
PARK is MANAGER
`, notes: ['SQL Server 에서는 `ENAME + \' is \' + JOB` 로 씁니다.'] },
    { title: '[Oracle] FROM DUAL', lang: 'sql', noverify: true, code: R`
SELECT 1 + 2 * 3 AS RESULT FROM DUAL;
`, output: R`
RESULT
7
`, notes: ['Oracle 전용(SQLite 로 검증하지 못함). 곱셈이 먼저라 1 + (2×3) = 7.'] }
  ],
  exercises: [
    { q: '`SELECT DISTINCT JOB FROM EMP` 는 몇 행이 나올까요? (공통 테이블 기준) 직접 실행해 확인하세요.', hint: 'JOB 종류: PRESIDENT, MANAGER, SALESMAN, ANALYST, CLERK', answer: '5행.' },
    { q: '연봉(SAL×12)이 40000 이상인 사원의 이름과 연봉을 별칭 ANNUAL 로 조회하세요. WHERE 에서 별칭을 쓰면 왜 오류가 나는지도 설명해 보세요.', hint: 'WHERE SAL * 12 >= 40000', answer: fence('sql', 'SELECT ENAME, SAL * 12 AS ANNUAL FROM EMP WHERE SAL * 12 >= 40000;') + '\nWHERE 가 SELECT 보다 먼저 실행되어 그 시점에는 별칭이 아직 없기 때문입니다.' }
  ],
  quiz: [
    { q: 'SQL 명령어 중 DDL 에 속하는 것은?', choices: ['SELECT', 'TRUNCATE', 'COMMIT', 'GRANT'], answer: 1, explain: 'TRUNCATE 는 DDL. SELECT 는 DML, COMMIT 은 TCL, GRANT 는 DCL 입니다.' },
    { q: '릴레이션의 "차수(Degree)"가 뜻하는 것은?', choices: ['행의 개수', '열(속성)의 개수', '기본키의 개수', '관계의 개수'], answer: 1, explain: '차수 = 속성(열)의 수, 카디널리티 = 튜플(행)의 수.' },
    { q: '관계 대수에서 "조건에 맞는 행을 고르는" 연산은?', choices: ['투영(Projection)', '선택(Selection)', '조인(Join)', '카티션 곱'], answer: 1, explain: '선택은 행, 투영은 열을 고릅니다. SQL 의 WHERE 가 선택입니다.' },
    { q: 'EMP 8행에서 `SELECT DISTINCT DEPTNO FROM EMP` 의 결과 행 수는? (DEPTNO: 10이 4개, 20이 3개, NULL 이 1개)', choices: ['2', '3', '4', '8'], answer: 1, explain: 'DISTINCT 는 NULL 도 하나의 값으로 보고 중복을 제거해 10, 20, NULL → 3행입니다.' },
    { q: '`SELECT SAL * 12 AS ANNUAL FROM EMP WHERE ANNUAL > 1000` 이 오류가 나는 이유는?', choices: ['AS 는 사용할 수 없다', 'WHERE 가 SELECT 보다 먼저 실행되어 별칭을 모른다', 'SAL 은 숫자가 아니다', '12 는 상수라서'], answer: 1, explain: '실행 순서상 WHERE 는 SELECT 이전이므로 SELECT 에서 정의한 별칭을 쓸 수 없습니다.' },
    { q: 'Oracle 에서 FROM 절 없이 계산식을 평가하려면 쓰는 가상 테이블은?', accept: ['DUAL', 'dual'], explain: 'Oracle 은 SELECT 문에 FROM 이 필수라서 한 행짜리 DUAL 테이블을 씁니다.' },
    { q: 'Oracle 의 문자열 연결 연산자는?', choices: ['+', '||', '&', '.'], answer: 1, explain: 'Oracle 은 `||`, SQL Server 는 `+` 입니다.' },
    { q: '`SELECT DISTINCT A, B FROM T` 에 대한 설명으로 옳은 것은?', choices: ['A 의 중복만 제거한다', 'B 의 중복만 제거한다', '(A, B) 조합이 같은 행의 중복을 제거한다', '둘 다 NULL 이면 오류'], answer: 2, explain: 'DISTINCT 는 SELECT 목록 전체 조합 기준입니다.' }
  ]
},

/* ======================= 6 ======================= */
{
  id: 'sq-06', unit: '2부. SQL 기본 (과목2)', title: '함수 — 문자·숫자·날짜·변환·NULL·CASE', time: '85분',
  summary: '단일행 함수는 행마다 값 하나를 돌려준다. NULL 처리 함수(NVL, NVL2, NULLIF, COALESCE)와 CASE/DECODE 는 시험 빈출 주제이며 결과 예측 문제로 나온다.',
  goals: ['문자·숫자 함수의 결과를 손으로 계산한다', 'NVL / NVL2 / NULLIF / COALESCE 를 구분해 쓴다', 'CASE 와 DECODE 의 차이(특히 NULL 처리)를 안다', 'Oracle 과 SQL Server 함수 이름 차이를 안다'],
  terms: [
    { t: '단일행 함수', d: '**행 하나당 결과 하나**를 돌려주는 함수(문자·숫자·날짜·변환·NULL 함수). 반대는 여러 행을 묶어 하나를 돌려주는 **집계(그룹) 함수**.' },
    { t: '암시적 형변환 / 명시적 형변환', d: 'DBMS 가 자동으로 타입을 바꾸는 것 / `TO_CHAR`, `TO_DATE`, `CAST` 처럼 사람이 지정하는 것. 암시적 변환은 성능·정확성 문제가 생길 수 있어 명시적 변환을 권장.' },
    { t: 'COALESCE', d: '인자 중 **처음으로 NULL 이 아닌 값**을 반환하는 표준 함수.' }
  ],
  sections: [
    { h: '1. 문자 함수', md: [
      '| 함수 | 결과 예 |', '|---|---|',
      '| `UPPER(\'sql\')` / `LOWER(\'SQL\')` | `SQL` / `sql` |',
      '| `LENGTH(\'HELLO\')` (SQL Server: `LEN`) | `5` |',
      '| `SUBSTR(\'SQLDEV\', 2, 3)` (SQL Server: `SUBSTRING`) | `QLD` — **시작 위치는 1부터**, 세 번째 인자는 길이 |',
      '| `SUBSTR(\'ABCDE\', -2)` (Oracle) | `DE` — 음수는 뒤에서부터 |',
      '| `INSTR(\'HELLO WORLD\', \'O\')` | `5` — 처음 나타나는 위치(없으면 0) |',
      '| `REPLACE(\'A-B-C\', \'-\', \'\')` | `ABC` |',
      '| `TRIM(\'  X  \')` / `LTRIM` / `RTRIM` | 공백 제거 |',
      '| `LPAD(\'7\', 3, \'0\')` / `RPAD` | `007` — 지정 길이가 되도록 채움 |',
      '| `CONCAT(\'A\', \'B\')` | `AB` (Oracle 은 인자 2개만) |',
      '`INITCAP` 은 Oracle 에서 단어의 첫 글자만 대문자로 바꿉니다. `ASCII(\'A\')`=65, `CHR(65)`=\'A\'.'] },
    { h: '2. 숫자 함수', md: [
      '| 함수 | 결과 예 |', '|---|---|',
      '| `ABS(-5)` | `5` |', '| `SIGN(-5)` | `-1` (양수 1, 0 → 0) |',
      '| `MOD(7, 3)` (SQL Server: `7 % 3`) | `1` |',
      '| `CEIL(3.1)` / `FLOOR(3.9)` (SQL Server: `CEILING`) | `4` / `3` |',
      '| `ROUND(123.456, 1)` | `123.5` (반올림) |', '| `ROUND(123.456, -1)` | `120` (음수 = 정수 자리) |',
      '| `TRUNC(123.456, 1)` (SQL Server 는 `ROUND(x, 1, 1)`) | `123.4` (**버림**) |',
      '| `POWER(2, 3)` | `8` |',
      '`CEIL` 은 올림, `FLOOR` 는 내림이고 **음수에서 헷갈립니다**: `CEIL(-3.1)` = -3, `FLOOR(-3.1)` = -4. `ROUND` 는 소수점 위치 인자를 생략하면 정수로 반올림합니다.'] },
    { h: '3. 날짜 함수와 변환 함수', md: [
      '- 현재 시각: Oracle `SYSDATE`, SQL Server `GETDATE()`.',
      '- Oracle 에서 **날짜 + 숫자 = 숫자만큼의 일(day) 뒤**: `SYSDATE + 1` 은 내일. 날짜 − 날짜 = 일수(숫자).',
      '- `ADD_MONTHS(날짜, n)`, `MONTHS_BETWEEN(a, b)`, `LAST_DAY(날짜)`(그 달의 마지막 날), `EXTRACT(YEAR FROM 날짜)`.',
      '- 변환: `TO_CHAR(값, 형식)`, `TO_DATE(문자열, 형식)`, `TO_NUMBER(문자열)`. 표준 `CAST(값 AS 타입)`.',
      '- 예: `TO_CHAR(날짜, \'YYYY-MM-DD\')`, `TO_CHAR(1234567, \'9,999,999\')`.',
      '- **암시적 변환**은 DBMS 가 비교 시 자동 변환하는 것으로, 예를 들어 문자 컬럼을 숫자와 비교하면 컬럼 쪽이 변환되어 인덱스를 못 쓰는 문제가 생길 수 있습니다.'] },
    { h: '4. NULL 관련 함수 — 시험 빈출', md: [
      '| 함수 | 동작 | 예 (COMM 이 NULL 일 때) |', '|---|---|---|',
      '| `NVL(a, b)` (Oracle) / `ISNULL(a, b)` (SQL Server) | a 가 NULL 이면 b, 아니면 a | `NVL(NULL, 0)` → 0 |',
      '| `NVL2(a, b, c)` | a 가 **NOT NULL 이면 b**, NULL 이면 c | `NVL2(NULL, \'있음\', \'없음\')` → 없음 |',
      '| `NULLIF(a, b)` | **a = b 이면 NULL**, 아니면 a | `NULLIF(5, 5)` → NULL, `NULLIF(5, 3)` → 5 |',
      '| `COALESCE(a, b, c, ...)` | 처음 NULL 이 아닌 값 | `COALESCE(NULL, NULL, 3)` → 3 |',
      'NULLIF 는 "특정 값이면 NULL 로 바꾸기"에 쓰입니다. 예: 0 으로 나누기 방지 `x / NULLIF(y, 0)` — y 가 0 이면 NULL 이 되어 오류 대신 NULL 결과가 됩니다.'] },
    { h: '5. CASE 와 DECODE', md: [
      '**CASE** — 표준 문법. 조건을 위에서부터 평가해 처음 참인 THEN 을 반환하고, 모두 아니면 ELSE, ELSE 도 없으면 **NULL**.',
      fence('sql', "-- 검색형 (조건식)\nCASE WHEN SAL >= 3000 THEN 'HIGH'\n     WHEN SAL >= 1500 THEN 'MID'\n     ELSE 'LOW' END\n-- 단순형 (값 비교)\nCASE JOB WHEN 'CLERK' THEN 'C' WHEN 'MANAGER' THEN 'M' ELSE 'X' END"),
      '**DECODE** (Oracle 전용): `DECODE(식, 값1, 결과1, 값2, 결과2, ..., 기본값)`. 마지막 인자(기본값)를 생략하면 불일치 시 NULL.',
      '**NULL 비교 차이**: `DECODE` 는 `DECODE(NULL, NULL, \'Y\', \'N\')` 이 **\'Y\'** (NULL 끼리 일치로 봄) 인 반면, **CASE 의 `=` 비교는 NULL 을 매치하지 못합니다** (`CASE x WHEN NULL THEN ...` 은 절대 참이 안 됨 → `WHEN x IS NULL` 로 써야 함).'] }
  ],
  misconceptions: [
    { wrong: '"SUBSTR 의 시작 위치는 0 부터 센다."', right: 'SQL 의 문자 위치는 **1 부터** 센다. `SUBSTR(\'ABC\', 1, 1)` = \'A\'.', why: '(Oracle 은 시작 0 을 1 처럼 취급하지만, 의존하지 마세요.) 다른 언어(C/Java/Python)는 0부터라 혼동이 많습니다.' },
    { wrong: '"NVL2(a, b, c) 는 a 가 NULL 이면 b 를 반환한다."', right: 'a 가 **NULL 이 아니면 b**, NULL 이면 c 이다. (이름의 2 = 두 가지 경우를 모두 지정)', why: 'NVL(a,b) 는 "NULL 이면 b 로 바꾼다", NVL2 는 "NULL 이 아니면 b, NULL 이면 c" — 반대로 외우기 쉽습니다.' },
    { wrong: '"CASE 의 ELSE 를 생략하면 오류가 난다."', right: 'ELSE 를 생략하고 어떤 WHEN 도 맞지 않으면 **NULL** 을 반환한다.', why: '그 NULL 이 이후 집계·연산에서 결과를 조용히 바꿀 수 있습니다.' },
    { wrong: '"CEIL 은 항상 값이 커지고 FLOOR 는 항상 0 에 가까워진다."', right: 'CEIL 은 **더 큰 정수 쪽**(올림), FLOOR 는 **더 작은 정수 쪽**(내림). 음수에서 `CEIL(-3.1) = -3`, `FLOOR(-3.1) = -4`. 0 쪽으로 자르는 것은 TRUNC.', why: '"올림/내림"은 수직선 방향이지 절댓값 방향이 아닙니다.' },
    { wrong: '"`NULLIF(a, b)` 는 a 가 NULL 이면 b 를 반환하는 함수다."', right: '`NULLIF(a, b)` 는 **a 와 b 가 같으면 NULL**, 다르면 a 를 반환한다. NULL 을 다른 값으로 바꾸는 것은 NVL/COALESCE.', why: '이름은 "NULL if equal" 로 읽으세요.' }
  ],
  examples: [
    { title: '문자·숫자 함수 결과 확인', lang: 'sql', code: R`
SELECT UPPER('sql') AS A, LENGTH('HELLO') AS B, SUBSTR('SQLDEV', 2, 3) AS C,
       INSTR('HELLO WORLD', 'O') AS D, REPLACE('A-B-C', '-', '') AS E,
       LPAD('7', 3, '0') AS F, ABS(-5) AS G, MOD(7, 3) AS H,
       ROUND(123.456, 1) AS I, CEIL(3.1) AS J, FLOOR(-3.1) AS K;
`, output: R`
A | B | C | D | E | F | G | H | I | J | K
SQL | 5 | QLD | 5 | ABC | 007 | 5 | 1 | 123.5 | 4 | -4
`, notes: ['A=SQL, B=5, C=QLD, D=5, E=ABC, F=007, G=5, H=1, I=123.5, J=4, K=-4. (`LPAD`, `MOD`, `CEIL` 은 이 앱의 실행기에서 Oracle 동작을 흉내 낸 함수입니다.)'] },
    { title: 'NVL / NVL2 / NULLIF / COALESCE', lang: 'sql', prelude: true, code: R`
SELECT ENAME, COMM,
       NVL(COMM, -1) AS NVL_,
       NVL2(COMM, 'Y', 'N') AS NVL2_,
       NULLIF(COMM, 0) AS NULLIF_,
       COALESCE(COMM, SAL) AS COAL_
FROM EMP
WHERE EMPNO IN (1, 4, 8)
ORDER BY EMPNO;
`, output: R`
ENAME | COMM | NVL_ | NVL2_ | NULLIF_ | COAL_
KIM | NULL | -1 | N | NULL | 5000
CHOI | 300 | 300 | Y | 300 | 300
SHIN | 0 | 0 | Y | NULL | 0
`, notes: ['KIM(COMM NULL): NVL → -1, NVL2 → N, NULLIF → NULL, COALESCE → SAL(5000). CHOI(300): 300 / Y / 300 / 300. SHIN(COMM 0): 0 / Y / **NULL**(0 과 같으므로) / 0.'] },
    { title: 'CASE: 검색형, ELSE 없을 때 NULL', lang: 'sql', prelude: true, code: R`
SELECT ENAME, SAL,
       CASE WHEN SAL >= 3000 THEN 'HIGH'
            WHEN SAL >= 1500 THEN 'MID'
            ELSE 'LOW' END AS GRADE,
       CASE JOB WHEN 'CLERK' THEN 'C' WHEN 'MANAGER' THEN 'M' END AS JOB_CODE
FROM EMP
ORDER BY EMPNO;
`, output: R`
ENAME | SAL | GRADE | JOB_CODE
KIM | 5000 | HIGH | NULL
LEE | 3000 | HIGH | M
PARK | 2800 | MID | M
CHOI | 1500 | MID | NULL
JUNG | 1500 | MID | NULL
HAN | 2500 | MID | NULL
YOON | 1000 | LOW | C
SHIN | 1200 | LOW | C
`, notes: ['PRESIDENT, SALESMAN, ANALYST 는 단순 CASE 의 어떤 WHEN 에도 해당하지 않고 ELSE 도 없어서 JOB_CODE 가 NULL 입니다. SAL 3000 이상은 HIGH(KIM, LEE).'] },
    { title: 'CASE 의 NULL 비교 함정', lang: 'sql', prelude: true, code: R`
SELECT ENAME,
       CASE COMM WHEN NULL THEN 'NO COMM' ELSE 'HAS/UNKNOWN' END AS WRONG_WAY,
       CASE WHEN COMM IS NULL THEN 'NO COMM' ELSE 'HAS COMM' END AS RIGHT_WAY
FROM EMP
WHERE EMPNO IN (1, 4)
ORDER BY EMPNO;
`, output: R`
ENAME | WRONG_WAY | RIGHT_WAY
KIM | HAS/UNKNOWN | NO COMM
CHOI | HAS/UNKNOWN | HAS COMM
`, notes: ['`CASE COMM WHEN NULL` 은 `COMM = NULL` 비교이므로 절대 참이 되지 못해 KIM 도 ELSE 쪽으로 갑니다. NULL 판정은 `IS NULL` 을 써야 합니다.'] },
    { title: '[Oracle] TRUNC · DECODE · 날짜', lang: 'sql', noverify: true, code: R`
SELECT TRUNC(123.456, 1) AS A,
       TRUNC(-3.7)       AS B,
       ROUND(123.456, -1) AS C,
       DECODE(NULL, NULL, 'Y', 'N') AS D,
       TO_CHAR(ADD_MONTHS(TO_DATE('2026-01-31', 'YYYY-MM-DD'), 1), 'YYYY-MM-DD') AS E
FROM DUAL;
`, output: R`
A | B | C | D | E
123.4 | -3 | 120 | Y | 2026-02-28
`, notes: ['Oracle 전용이라 SQLite 로 검증하지 못했고 출력은 직접 계산했습니다. TRUNC 는 버림(0 방향), ROUND(…, -1) 은 10 의 자리로 반올림, DECODE 는 NULL 끼리 일치로 보며, ADD_MONTHS 는 1월 31일 +1개월 → 2월의 마지막 날(28일, 2026은 평년).'] }
  ],
  exercises: [
    { q: '`SUBSTR(\'ABCDEFG\', 3, 2)`, `INSTR(\'ABCABC\', \'C\')`, `LPAD(\'AB\', 5, \'*\')`, `CEIL(-0.5)` 의 결과를 손으로 구해 보세요.', hint: '위치는 1부터. LPAD 는 왼쪽을 채운다.', answer: '`CD`, `3`, `***AB`, `0` (CEIL(-0.5) 는 -0 이 아닌 0 으로 표시).' },
    { q: '수당(COMM)이 NULL 이면 0 으로 보고 월급+수당을 구하는 쿼리를 NVL 과 COALESCE 두 가지로 써 보세요.', hint: 'SAL + NVL(COMM, 0)', answer: fence('sql', 'SELECT ENAME, SAL + NVL(COMM, 0) AS TOTAL FROM EMP;\nSELECT ENAME, SAL + COALESCE(COMM, 0) AS TOTAL FROM EMP;') },
    { q: '`SELECT 100 / NULLIF(0, 0)` 은 오류일까요 NULL 일까요? 왜 그럴까요?', hint: 'NULLIF(a,b) a=b 이면 NULL', answer: 'NULL. NULLIF(0, 0) 이 NULL 을 반환하고 100 / NULL = NULL 이므로 0 으로 나누는 오류가 나지 않습니다.' }
  ],
  quiz: [
    { q: '`SUBSTR(\'SQLDEV\', 2, 3)` 의 결과는?', accept: ['QLD'], explain: '2번째 문자 Q 부터 3글자 → QLD. 시작 위치는 1부터 셉니다.' },
    { q: '`NVL2(COMM, \'Y\', \'N\')` 에서 COMM 이 NULL 일 때 결과는?', choices: ['Y', 'N', 'NULL', '오류'], answer: 1, explain: 'NVL2 는 첫 인자가 NOT NULL 이면 두 번째, NULL 이면 세 번째 값을 반환합니다.' },
    { q: '`NULLIF(5, 5)` 의 결과는?', choices: ['5', '0', 'NULL', '1'], answer: 2, explain: '두 값이 같으면 NULL 을 반환합니다.' },
    { q: '`COALESCE(NULL, NULL, 7, 9)` 의 결과는?', accept: ['7'], explain: '처음으로 NULL 이 아닌 값 7 을 반환합니다.' },
    { q: '`CEIL(-3.1)` 과 `FLOOR(-3.1)` 의 결과를 차례로 나열한 것은?', choices: ['-3, -4', '-4, -3', '-3, -3', '-4, -4'], answer: 0, explain: 'CEIL 은 더 큰 정수(-3), FLOOR 는 더 작은 정수(-4)입니다.' },
    { q: '`ROUND(123.456, -1)` 의 결과는?', choices: ['123.5', '120', '130', '123'], answer: 1, explain: '두 번째 인자가 음수이면 정수 부분의 자리에서 반올림합니다. 123 → 120.' },
    { q: 'ELSE 가 없는 CASE 식에서 어떤 WHEN 조건도 만족하지 않으면 결과는?', choices: ['오류', '0', '빈 문자열', 'NULL'], answer: 3, explain: 'ELSE 를 생략하면 NULL 을 반환합니다.' },
    { q: '`CASE COMM WHEN NULL THEN \'A\' ELSE \'B\' END` 에서 COMM 이 NULL 인 행의 결과는?', choices: ['A', 'B', 'NULL', '오류'], answer: 1, explain: '`COMM = NULL` 은 참이 되지 않아 ELSE 인 B 가 됩니다. NULL 은 `WHEN COMM IS NULL` 로 판별해야 합니다.' },
    { q: 'Oracle 에서 `DECODE(NULL, NULL, \'Y\', \'N\')` 의 결과는?', choices: ['Y', 'N', 'NULL', '오류'], answer: 0, explain: 'DECODE 는 NULL 끼리 같은 것으로 비교해 \'Y\' 를 반환합니다(CASE 의 `=` 와 다름).' },
    { q: 'Oracle 에서 현재 날짜·시각을 반환하는 키워드는?', accept: ['SYSDATE', 'sysdate'], explain: 'Oracle 은 SYSDATE, SQL Server 는 GETDATE() 입니다.' }
  ]
},

/* ======================= 7 ======================= */
{
  id: 'sq-07', unit: '2부. SQL 기본 (과목2)', title: 'WHERE 절과 ORDER BY', time: '70분',
  summary: 'WHERE 는 조건이 참(TRUE)인 행만 통과시킨다. NULL 과 비교하면 UNKNOWN 이라 통과하지 못한다는 점, AND/OR 우선순위, NOT IN 의 NULL 함정이 핵심이다.',
  goals: ['비교·SQL·논리 연산자를 정확히 쓴다', 'BETWEEN / IN / LIKE 의 경계 규칙을 안다', '3값 논리와 NOT IN + NULL 함정을 설명한다', 'ORDER BY 의 정렬 규칙과 NULL 정렬을 안다'],
  terms: [
    { t: '3값 논리', d: 'SQL 의 조건 결과는 TRUE / FALSE / **UNKNOWN**(NULL 이 낀 비교). WHERE 는 TRUE 인 행만 통과시킨다.' },
    { t: '와일드카드', d: 'LIKE 에서 `%` = 0개 이상의 임의 문자열, `_` = 임의의 한 글자.' },
    { t: '연산자 우선순위', d: '산술 > 비교/SQL 연산자 > NOT > AND > OR. 헷갈리면 괄호.' }
  ],
  sections: [
    { h: '1. 연산자', md: [
      '| 종류 | 연산자 |', '|---|---|',
      '| 비교 | `=`, `>`, `>=`, `<`, `<=`, 같지 않음: `<>` (`!=`, `^=` 도 가능) |',
      '| SQL | `BETWEEN a AND b`, `IN (...)`, `LIKE`, `IS NULL` |',
      '| 논리 | `AND`, `OR`, `NOT` |',
      '- **BETWEEN a AND b** 는 **a 와 b 를 모두 포함**(`>= a AND <= b`)합니다. a 가 b 보다 크면 결과 없음.',
      '- **IN (1, 2, 3)** 은 `= 1 OR = 2 OR = 3`. **NOT IN** 은 `<> 1 AND <> 2 AND <> 3`.',
      '- **LIKE**: `\'K%\'` K 로 시작, `\'%N\'` N 으로 끝, `\'%A%\'` A 포함, `\'_A%\'` 두 번째가 A. 와일드카드 문자 자체를 찾으려면 `ESCAPE`.',
      '- **IS NULL / IS NOT NULL**: NULL 판정은 이것뿐.'] },
    { h: '2. 3값 논리와 NULL 함정', md: [
      '- `NULL` 과 비교하는 모든 `=, <>, >, <` 의 결과는 **UNKNOWN**이고, WHERE 는 UNKNOWN 인 행을 버립니다.',
      '- `COMM <> 100` 은 COMM 이 NULL 인 행을 **고르지 않습니다** (NULL <> 100 → UNKNOWN). NULL 행도 보고 싶다면 `OR COMM IS NULL` 을 직접 써야 합니다.',
      '- **NOT IN 함정**: `x NOT IN (1, 2, NULL)` 은 `x<>1 AND x<>2 AND x<>NULL` 인데 마지막이 UNKNOWN 이라 **전체가 TRUE 가 될 수 없어 결과가 0건**입니다. 서브쿼리 결과에 NULL 이 섞이면 같은 일이 생겨서 `NOT EXISTS` 를 권장합니다.',
      '- 논리 표: `TRUE AND UNKNOWN = UNKNOWN`, `FALSE AND UNKNOWN = FALSE`, `TRUE OR UNKNOWN = TRUE`, `FALSE OR UNKNOWN = UNKNOWN`, `NOT UNKNOWN = UNKNOWN`.'] },
    { h: '3. 우선순위', md: [
      '`WHERE A OR B AND C` 는 `A OR (B AND C)` 입니다(AND 가 먼저). 의도대로 쓰려면 괄호.',
      '`SAL > 1000 + 500 * 2` 는 `SAL > 2000` 처럼 산술이 먼저 계산됩니다.'] },
    { h: '4. ORDER BY', md: [
      '- 기본은 **오름차순(ASC)**, 내림차순은 `DESC`. 여러 컬럼이면 앞 컬럼이 같은 행끼리 다음 컬럼으로 정렬하며 컬럼마다 방향을 따로 지정합니다.',
      '- **SELECT 의 별칭**, **컬럼 번호**(`ORDER BY 2`)를 쓸 수 있습니다 (ORDER BY 가 SELECT 이후에 실행되므로).',
      '- 숫자는 크기순, 문자는 사전순, 날짜는 시간순.',
      '- **NULL 정렬**: Oracle 은 오름차순에서 **NULL 이 맨 뒤**(가장 큰 값 취급), SQL Server 는 오름차순에서 **NULL 이 맨 앞**. Oracle 은 `NULLS FIRST / NULLS LAST` 로 지정 가능.',
      '- SELECT 에 쓰지 않은 컬럼으로도 정렬 가능합니다. 단 `GROUP BY` 나 `DISTINCT` 가 있으면 그 결과에 있는 컬럼만 가능.'] }
  ],
  misconceptions: [
    { wrong: '"`BETWEEN 1000 AND 2000` 은 1000 초과 2000 미만이다."', right: '양끝(1000, 2000)을 **모두 포함**한다.', why: '`>= 1000 AND <= 2000` 와 동치입니다.' },
    { wrong: '"`COMM <> 300` 이면 COMM 이 NULL 인 사원도 나온다."', right: 'NULL 행은 **나오지 않는다**. NULL <> 300 은 UNKNOWN.', why: '"300 이 아닌 모든 사람"이라는 직관과 다르므로 NULL 행이 필요하면 `OR COMM IS NULL`.' },
    { wrong: '"`NOT IN (…, NULL)` 은 NULL 만 제외하고 나머지를 돌려준다."', right: '목록에 NULL 이 하나라도 있으면 **결과가 한 건도 없다**.', why: '`NOT IN` 은 모든 항목에 대해 "같지 않다"가 참이어야 하는데 NULL 과의 비교는 UNKNOWN 이기 때문입니다.' },
    { wrong: '"`A OR B AND C` 는 왼쪽부터 차례로 계산한다."', right: '**AND 가 OR 보다 먼저** 계산된다: `A OR (B AND C)`.', why: '의도가 (A OR B) AND C 라면 괄호를 반드시 써야 합니다.' },
    { wrong: '"모든 DBMS 에서 NULL 은 오름차순 정렬 시 맨 뒤에 온다."', right: 'Oracle 은 맨 뒤, SQL Server 는 맨 **앞**.', why: '그래서 시험 문제에는 DBMS 가 명시됩니다.' }
  ],
  examples: [
    { title: 'BETWEEN 은 양끝 포함, IN, LIKE', lang: 'sql', prelude: true, code: R`
SELECT ENAME, SAL FROM EMP WHERE SAL BETWEEN 1500 AND 2800 ORDER BY EMPNO;
SELECT ENAME FROM EMP WHERE JOB IN ('CLERK', 'ANALYST') ORDER BY EMPNO;
SELECT ENAME FROM EMP WHERE ENAME LIKE '_A%' ORDER BY EMPNO;
`, output: R`
ENAME | SAL
PARK | 2800
CHOI | 1500
JUNG | 1500
HAN | 2500

ENAME
HAN
YOON
SHIN

ENAME
PARK
HAN
`, notes: ['1500 과 2800 이 모두 포함됩니다(CHOI·JUNG 1500, PARK 2800, HAN 2500). `_A%` 는 두 번째 글자가 A (PARK, HAN).'] },
    { title: 'NULL 은 <> 에도 걸리지 않는다', lang: 'sql', prelude: true, code: R`
SELECT COUNT(*) AS NE_300 FROM EMP WHERE COMM <> 300;
SELECT COUNT(*) AS NE_300_OR_NULL FROM EMP WHERE COMM <> 300 OR COMM IS NULL;
`, output: R`
NE_300
1

NE_300_OR_NULL
7
`, notes: ['COMM 이 300 이 아닌 값을 가진 행은 SHIN(0) 하나뿐입니다. NULL 인 6행은 UNKNOWN 이라 빠져요. `OR COMM IS NULL` 을 붙이면 7행.'] },
    { title: 'NOT IN 에 NULL 이 섞이면 0건', lang: 'sql', prelude: true, code: R`
SELECT COUNT(*) AS NOT_IN_NO_NULL FROM EMP WHERE EMPNO NOT IN (1, 2);
SELECT COUNT(*) AS NOT_IN_WITH_NULL FROM EMP WHERE EMPNO NOT IN (1, 2, NULL);
`, output: R`
NOT_IN_NO_NULL
6

NOT_IN_WITH_NULL
0
`, notes: ['목록에 NULL 이 있는 두 번째 쿼리는 모든 행이 UNKNOWN/FALSE 라 0 건입니다.'] },
    { title: 'AND 가 OR 보다 먼저', lang: 'sql', prelude: true, code: R`
SELECT ENAME, JOB, SAL FROM EMP
WHERE JOB = 'CLERK' OR JOB = 'MANAGER' AND SAL >= 3000
ORDER BY EMPNO;
SELECT ENAME, JOB, SAL FROM EMP
WHERE (JOB = 'CLERK' OR JOB = 'MANAGER') AND SAL >= 3000
ORDER BY EMPNO;
`, output: R`
ENAME | JOB | SAL
LEE | MANAGER | 3000
YOON | CLERK | 1000
SHIN | CLERK | 1200

ENAME | JOB | SAL
LEE | MANAGER | 3000
`, notes: ['첫 쿼리 = CLERK 전체 OR (MANAGER 이면서 SAL>=3000) → LEE, YOON, SHIN. 두 번째는 괄호로 묶어 SAL>=3000 이 둘 다에 적용 → LEE 만.'] },
    { title: 'ORDER BY: 별칭, 다중 정렬, NULLS LAST', lang: 'sql', prelude: true, code: R`
SELECT ENAME, DEPTNO, SAL * 12 AS ANNUAL
FROM EMP
ORDER BY DEPTNO DESC NULLS LAST, ANNUAL DESC;
`, output: R`
ENAME | DEPTNO | ANNUAL
PARK | 20 | 33600
HAN | 20 | 30000
YOON | 20 | 12000
KIM | 10 | 60000
LEE | 10 | 36000
CHOI | 10 | 18000
JUNG | 10 | 18000
SHIN | NULL | 14400
`, notes: ['DEPTNO 내림차순에 NULL 은 `NULLS LAST` 로 맨 뒤, 같은 부서는 ANNUAL(연봉) 내림차순. 별칭 `ANNUAL` 을 ORDER BY 에서 쓸 수 있습니다. 참고: `NULLS LAST` 를 쓰지 않은 Oracle 은 NULL 을 가장 큰 값으로 보므로 DESC 정렬에서는 NULL 이 맨 앞에 옵니다.'] }
  ],
  exercises: [
    { q: '`SELECT * FROM EMP WHERE SAL BETWEEN 3000 AND 1500` 는 몇 행일까요? 왜 그럴까요?', hint: '하한이 상한보다 크다', answer: '0행. `>= 3000 AND <= 1500` 을 동시에 만족하는 값이 없다.' },
    { q: '`WHERE DEPTNO NOT IN (10, 20)` 을 실행하면 몇 행이 나올까요? (공통 테이블, SHIN 의 DEPTNO 는 NULL)', hint: 'NULL <> 10 → UNKNOWN', answer: '0행. SHIN(DEPTNO NULL)은 UNKNOWN 이라 제외되고, 나머지는 10 또는 20 이라 모두 걸러진다.' },
    { q: '이름이 4글자이고 마지막 글자가 N 인 사원을 LIKE 로 찾아 보세요.', hint: '_ 가 한 글자', answer: fence('sql', "SELECT ENAME FROM EMP WHERE ENAME LIKE '___N';") + '\nSHIN 이 나옵니다. (한글 DB 는 글자 수 기준)' }
  ],
  quiz: [
    { q: '`WHERE SAL BETWEEN 1500 AND 2500` 에 대한 설명으로 옳은 것은?', choices: ['1500 이상 2500 미만', '1500 초과 2500 이하', '1500 이상 2500 이하', '1500 초과 2500 미만'], answer: 2, explain: 'BETWEEN 은 양 끝 값을 모두 포함합니다.' },
    { q: 'EMP 의 COMM 컬럼에서 NULL 이 6행, 300 이 1행, 0 이 1행이다. `WHERE COMM <> 300` 의 결과 행 수는?', choices: ['1', '7', '2', '8'], answer: 0, explain: 'COMM 이 NULL 인 행은 비교 결과가 UNKNOWN 이라 걸러집니다. 300 이 아닌 값은 0 한 행뿐입니다.' },
    { q: '`WHERE X NOT IN (1, 2, NULL)` 의 결과는?', choices: ['NULL 을 제외한 모든 행', 'X 가 1, 2 가 아닌 모든 행', '결과 0건', '오류'], answer: 2, explain: 'NOT IN 목록에 NULL 이 있으면 어떤 행도 TRUE 가 될 수 없어 0건입니다.' },
    { q: '`A OR B AND C` 와 같은 것은?', choices: ['(A OR B) AND C', 'A OR (B AND C)', 'A AND B OR C', '(A AND B) OR C'], answer: 1, explain: 'AND 가 OR 보다 우선순위가 높습니다.' },
    { q: '`LIKE \'_A%\'` 가 만족하는 문자열은?', choices: ['ABC', 'PARK', 'APPLE', 'A'], answer: 1, explain: '`_` 는 정확히 한 글자, 그 뒤 A. 두 번째 글자가 A 인 PARK 이 해당합니다.' },
    { q: 'Oracle 에서 ORDER BY 오름차순 정렬 시 NULL 은 어디에 위치하는가?', choices: ['맨 앞', '맨 뒤', '무작위', '제외'], answer: 1, explain: 'Oracle 은 NULL 을 가장 큰 값처럼 취급해 오름차순에서 맨 뒤입니다. SQL Server 는 반대.' },
    { q: 'ORDER BY 절에서 SELECT 절에 정의한 별칭을 사용할 수 있는 이유는?', choices: ['별칭은 항상 모든 절에서 쓸 수 있다', 'ORDER BY 가 SELECT 이후에 실행되기 때문', 'ORDER BY 는 문법 검사를 하지 않아서', 'DBMS 마다 다르다'], answer: 1, explain: '실행 순서가 FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY 라서 SELECT 이후인 ORDER BY 에서는 별칭이 이미 정의됩니다.' },
    { q: 'SAL 오름차순, 같은 SAL 이면 ENAME 내림차순으로 정렬하는 ORDER BY 절을 쓰시오. (SAL, ENAME 순서대로)', accept: ['ORDER BY SAL ASC, ENAME DESC', 'ORDER BY SAL, ENAME DESC', 'order by sal asc, ename desc', 'order by sal, ename desc'], explain: '컬럼마다 정렬 방향을 따로 지정합니다. ASC 는 생략 가능.' }
  ]
},

/* ======================= 8 ======================= */
{
  id: 'sq-08', unit: '2부. SQL 기본 (과목2)', title: 'GROUP BY, HAVING, 집계 함수와 실행 순서', time: '70분',
  summary: '집계 함수는 여러 행을 묶어 하나의 값을 만든다. WHERE 는 묶기 전 행을, HAVING 은 묶은 후 그룹을 거른다. SELECT 의 비집계 컬럼은 반드시 GROUP BY 에 있어야 한다.',
  goals: ['COUNT/SUM/AVG/MIN/MAX 의 NULL 처리와 결과를 계산한다', 'WHERE 와 HAVING 의 차이를 정확히 구분한다', 'GROUP BY 의 SELECT 목록 규칙을 안다', 'SQL 의 논리적 실행 순서를 외운다'],
  terms: [
    { t: '집계 함수', d: '여러 행을 입력받아 **하나의 값**을 반환(COUNT, SUM, AVG, MIN, MAX, STDDEV, VARIANCE). **NULL 은 무시**(COUNT(*) 제외).' },
    { t: 'GROUP BY', d: '지정한 컬럼 값이 같은 행끼리 **그룹**으로 묶는 절.' },
    { t: 'HAVING', d: '그룹화된 결과에 대한 **조건**. 집계 함수를 쓸 수 있다.' }
  ],
  sections: [
    { h: '1. 집계 함수', md: [
      '| 함수 | 의미 | NULL 처리 |', '|---|---|---|',
      '| `COUNT(*)` | 전체 행 수 | NULL 행도 **센다** |',
      '| `COUNT(컬럼)` | NULL 이 아닌 값의 수 | NULL 제외 |',
      '| `COUNT(DISTINCT 컬럼)` | 중복 제거한 값의 수 | NULL 제외 |',
      '| `SUM`, `AVG`, `MIN`, `MAX` | 합, 평균, 최소, 최대 | NULL 제외 (AVG 의 분모에서도 제외) |',
      '- 집계 함수는 **WHERE 절에 쓸 수 없습니다**. (WHERE 는 그룹화 이전에 실행)',
      '- 대상 행이 **0 건**이어도 GROUP BY 없는 집계는 한 행을 반환합니다: `COUNT` = 0, `SUM`/`AVG`/`MIN`/`MAX` = NULL.',
      '- 집계 함수 중첩은 Oracle 에서 `MAX(AVG(SAL))` 처럼 GROUP BY 와 함께 가능하지만 SELECT 에 다른 비집계 컬럼과 같이 쓸 수 없습니다.'] },
    { h: '2. GROUP BY 와 HAVING', md: [
      fence('sql', 'SELECT   그룹 컬럼, 집계함수(...)\nFROM     테이블\nWHERE    행 조건              -- 그룹 만들기 전에 행을 거름\nGROUP BY 그룹 컬럼\nHAVING   그룹 조건            -- 집계 결과로 그룹을 거름\nORDER BY 정렬 컬럼;'),
      '- **SELECT 목록에는 집계 함수이거나 GROUP BY 에 있는 컬럼만** 쓸 수 있습니다.',
      '- Oracle 은 GROUP BY 에서 **별칭을 쓸 수 없습니다**(SELECT 보다 먼저 실행). 같은 이유로 HAVING 에서도 불가.',
      '- GROUP BY 의 NULL 은 **하나의 그룹**으로 묶입니다.',
      '- **WHERE vs HAVING**: 집계 함수가 필요 없는 조건은 WHERE 로 먼저 거르는 것이 효율적이고 의미도 분명합니다. 집계 결과에 대한 조건만 HAVING.',
      '- 그룹 결과 정렬 보장은 ORDER BY 로만 가능합니다(GROUP BY 만으로는 정렬 순서가 보장되지 않음).'] },
    { h: '3. SQL 실행(논리) 순서 — 외우세요', md: [
      fence('', '1. FROM       테이블(조인) 결정\n2. WHERE      행 걸러내기\n3. GROUP BY   그룹화\n4. HAVING     그룹 걸러내기\n5. SELECT     컬럼·식·별칭 계산\n6. ORDER BY   정렬'),
      '이 순서가 곧 "어디서 무엇을 쓸 수 있는가"의 규칙입니다.',
      '- WHERE 에서 SELECT 별칭 ✗, 집계 함수 ✗ / HAVING 에서 집계 함수 ✓ / ORDER BY 에서 SELECT 별칭 ✓.'] }
  ],
  misconceptions: [
    { wrong: '"WHERE 절에서도 집계 함수를 쓸 수 있다."', right: '쓸 수 없다. 그룹 조건은 **HAVING**.', why: 'WHERE 시점에는 아직 그룹이 만들어지지 않았습니다.' },
    { wrong: '"GROUP BY 컬럼 외에 일반 컬럼도 SELECT 에 쓸 수 있다."', right: '집계 함수 안에 있거나 GROUP BY 에 포함된 컬럼만 쓸 수 있다(표준·Oracle).', why: '(SQLite 나 일부 DB 는 허용하지만 결과가 의미 없습니다.) 어느 행의 값을 보여줘야 하는지 정할 수 없기 때문입니다.' },
    { wrong: '"AVG(COMM) 은 COMM 의 합을 전체 행 수로 나눈다."', right: 'NULL 행은 **분모에서도 제외**된다. 합 ÷ NULL 이 아닌 행 수.', why: 'NULL 을 0 으로 보고 평균 내려면 `AVG(NVL(COMM, 0))`.' },
    { wrong: '"집계 대상이 0 행이면 결과가 한 행도 안 나온다."', right: 'GROUP BY 가 **없으면** 한 행이 나온다(COUNT 는 0, 나머지는 NULL). GROUP BY 가 있으면 그룹이 없으니 0 행.', why: '"전체를 한 그룹으로 본다"는 규칙 때문입니다.' },
    { wrong: '"GROUP BY 를 쓰면 결과가 그룹 컬럼 순으로 자동 정렬된다."', right: '정렬은 ORDER BY 를 써야 보장된다. DBMS/실행 방식에 따라 정렬돼 보일 수 있지만 보장이 없다.', why: '시험에서는 "정렬이 보장되는 것은 ORDER BY 뿐"이라고 답하세요.' }
  ],
  examples: [
    { title: '부서별 집계 — NULL 은 하나의 그룹', lang: 'sql', prelude: true, code: R`
SELECT DEPTNO, COUNT(*) AS CNT, SUM(SAL) AS SUM_SAL, AVG(SAL) AS AVG_SAL, MAX(SAL) AS MAX_SAL
FROM EMP
GROUP BY DEPTNO
ORDER BY DEPTNO;
`, output: R`
DEPTNO | CNT | SUM_SAL | AVG_SAL | MAX_SAL
NULL | 1 | 1200 | 1200 | 1200
10 | 4 | 11000 | 2750 | 5000
20 | 3 | 6300 | 2100 | 2800
`, notes: ['DEPTNO 가 NULL 인 SHIN 도 별도 그룹으로 나타납니다(ORDER BY 에서 SQLite 는 NULL 을 앞에 둠 — Oracle 이라면 맨 뒤).'] },
    { title: 'WHERE 로 먼저 거르고, HAVING 으로 그룹 거르기', lang: 'sql', prelude: true, code: R`
SELECT DEPTNO, COUNT(*) AS CNT, AVG(SAL) AS AVG_SAL
FROM EMP
WHERE SAL >= 1200
GROUP BY DEPTNO
HAVING COUNT(*) >= 2
ORDER BY DEPTNO;
`, output: R`
DEPTNO | CNT | AVG_SAL
10 | 4 | 2750
20 | 2 | 2650
`, notes: ['WHERE 로 SAL 1000(YOON) 이 빠지고 나서 부서별로 묶습니다. DEPTNO NULL(SHIN 한 명, 1200)은 WHERE 를 통과하지만 그룹 크기가 1 이라 HAVING 에서 탈락합니다. 부서 10 은 KIM·LEE·CHOI·JUNG 4명, 부서 20 은 PARK·HAN 2명이 남습니다.'] },
    { title: '집계 대상이 0행이면?', lang: 'sql', prelude: true, code: R`
SELECT COUNT(*) AS CNT, SUM(SAL) AS S, MAX(SAL) AS M FROM EMP WHERE SAL > 99999;
SELECT DEPTNO, COUNT(*) FROM EMP WHERE SAL > 99999 GROUP BY DEPTNO;
`, output: R`
CNT | S | M
0 | NULL | NULL

DEPTNO | COUNT(*)
`, notes: ['GROUP BY 가 없으면 결과가 한 행(COUNT 0, 나머지 NULL). GROUP BY 가 있으면 만들어진 그룹이 없어 헤더만 나오고 행은 0개입니다.'] },
    { title: 'COUNT 의 세 가지 얼굴', lang: 'sql', prelude: true, code: R`
SELECT COUNT(*)        AS C_STAR,
       COUNT(DEPTNO)   AS C_COL,
       COUNT(DISTINCT DEPTNO) AS C_DISTINCT
FROM EMP;
`, output: R`
C_STAR | C_COL | C_DISTINCT
8 | 7 | 2
`, notes: ['COUNT(*) 8, COUNT(DEPTNO) 7(SHIN 의 NULL 제외), COUNT(DISTINCT DEPTNO) 2(10, 20).'] }
  ],
  exercises: [
    { q: '직무(JOB)별 평균 급여가 2000 이상인 직무와 그 평균을 구하세요.', hint: '집계 결과 조건은 HAVING', answer: fence('sql', 'SELECT JOB, AVG(SAL) FROM EMP GROUP BY JOB HAVING AVG(SAL) >= 2000;') + '\nPRESIDENT(5000), MANAGER(2900), ANALYST(2500).' },
    { q: '`SELECT DEPTNO, ENAME, COUNT(*) FROM EMP GROUP BY DEPTNO` 가 오류인 이유는?', hint: 'ENAME 이 GROUP BY 에 없다', answer: 'ENAME 은 집계 함수도 아니고 GROUP BY 컬럼도 아니기 때문에 그룹마다 어떤 이름을 보여줄지 정할 수 없다.' },
    { q: '`SELECT COUNT(DISTINCT JOB) FROM EMP` 의 결과를 예측해 보세요.', hint: '직무 종류 수', answer: '5 (PRESIDENT, MANAGER, SALESMAN, ANALYST, CLERK).' }
  ],
  quiz: [
    { q: 'SQL 문의 논리적 실행 순서로 올바른 것은?', choices: ['FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY', 'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY', 'FROM → SELECT → WHERE → GROUP BY → HAVING → ORDER BY', 'FROM → WHERE → SELECT → GROUP BY → HAVING → ORDER BY'], answer: 0, explain: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY 입니다.' },
    { q: '값이 [10, 20, NULL, 30, NULL] 인 컬럼 X 에 대해 `COUNT(*)`, `COUNT(X)`, `AVG(X)` 의 결과는?', choices: ['5, 3, 12', '5, 3, 20', '3, 3, 20', '5, 5, 12'], answer: 1, explain: 'COUNT(*) 는 5, COUNT(X) 는 NULL 제외 3, AVG 는 (10+20+30)/3 = 20.' },
    { q: '그룹에 대한 조건(집계 결과 조건)을 지정하는 절은?', accept: ['HAVING', 'having', 'HAVING 절'], explain: 'HAVING 이 GROUP BY 결과에 조건을 건다. WHERE 는 그룹화 전 행 조건.' },
    { q: '다음 중 오류가 나는 쿼리는?', choices: ['SELECT DEPTNO, COUNT(*) FROM EMP GROUP BY DEPTNO', 'SELECT DEPTNO FROM EMP GROUP BY DEPTNO HAVING COUNT(*) > 1', 'SELECT DEPTNO, ENAME FROM EMP GROUP BY DEPTNO', 'SELECT COUNT(*) FROM EMP'], answer: 2, explain: 'GROUP BY 컬럼이 아니고 집계 함수도 아닌 ENAME 을 SELECT 에 쓸 수 없습니다.' },
    { q: '`SELECT COUNT(*), SUM(SAL) FROM EMP WHERE SAL > 99999` (조건에 맞는 행이 없음)의 결과는?', choices: ['0건 (결과 없음)', '0, 0', '0, NULL', 'NULL, NULL'], answer: 2, explain: 'GROUP BY 없는 집계는 한 행이 반환되며 COUNT 는 0, SUM 은 NULL 입니다.' },
    { q: 'WHERE 절에 집계 함수를 쓸 수 없는 가장 적절한 이유는?', choices: ['문법 오류라서', 'WHERE 는 그룹화 이전 단계에서 실행되기 때문', '집계 함수는 SELECT 에서만 정의돼서', 'NULL 때문에'], answer: 1, explain: '논리적 실행 순서상 WHERE 는 GROUP BY 보다 먼저라 그룹 결과(집계)가 아직 없습니다.' },
    { q: 'GROUP BY 컬럼에 NULL 값이 있는 행들은?', choices: ['모두 제외된다', '하나의 그룹으로 묶인다', '각각 별도 그룹이 된다', '오류가 난다'], answer: 1, explain: 'NULL 은 GROUP BY 에서 같은 값으로 취급되어 하나의 그룹으로 묶입니다.' },
    { q: 'EMP 에서 `SELECT COUNT(DISTINCT DEPTNO) FROM EMP` 의 결과는? (DEPTNO: 10, 10, 10, 10, 20, 20, 20, NULL)', accept: ['2'], explain: 'DISTINCT 후 NULL 은 COUNT 에서 제외되어 10, 20 → 2 입니다.' }
  ]
},

/* ======================= 9 ======================= */
{
  id: 'sq-09', unit: '2부. SQL 기본 (과목2)', title: '조인 — 내부·외부·표준 조인', time: '90분',
  summary: '조인은 둘 이상의 테이블을 조건으로 연결한다. 내부 조인은 짝이 맞는 행만, 외부 조인은 짝이 없어도 한쪽(또는 양쪽)을 보존한다. ON 과 WHERE 에 조건을 두는 위치가 결과를 바꾼다.',
  goals: ['INNER / LEFT / RIGHT / FULL OUTER / CROSS 조인의 결과 행 수를 계산한다', 'NATURAL JOIN 과 USING 의 규칙을 안다', 'ON 절과 WHERE 절 조건의 차이를 설명한다', 'Oracle 의 (+) 문법을 읽는다'],
  terms: [
    { t: '동등(Equi) 조인', d: '조인 조건이 `=` 인 조인. 가장 흔함. 그 외 연산자(`BETWEEN`, `>` 등)는 비동등(Non-Equi) 조인.' },
    { t: '내부(INNER) 조인', d: '조인 조건을 **만족하는 행만** 결과에 포함.' },
    { t: '외부(OUTER) 조인', d: '조건에 맞는 짝이 없는 행도 **NULL 로 채워서 보존**. LEFT / RIGHT / FULL.' },
    { t: '카티션 곱 (CROSS JOIN)', d: '조인 조건 없이 **모든 행 × 모든 행**. 결과 행 수 = 행 수의 곱.' },
    { t: '자연(NATURAL) 조인', d: '두 테이블의 **이름이 같은 모든 컬럼**을 자동으로 동등 조인.' }
  ],
  sections: [
    { h: '1. 기본: 내부 조인', md: [
      fence('sql', '-- 표준(ANSI) 문법\nSELECT E.ENAME, D.DNAME\nFROM   EMP E INNER JOIN DEPT D ON E.DEPTNO = D.DEPTNO;\n\n-- 예전(Oracle) 방식: FROM 에 나열하고 WHERE 에 조건\nSELECT E.ENAME, D.DNAME\nFROM   EMP E, DEPT D\nWHERE  E.DEPTNO = D.DEPTNO;'),
      '- `INNER` 는 생략 가능(그냥 `JOIN`). 두 문법의 결과는 같습니다.',
      '- 컬럼명이 양쪽에 모두 있으면(`DEPTNO`) **별칭으로 한정**해야 합니다(그렇지 않으면 모호성 오류).',
      '- **테이블에 별칭을 붙였다면 원래 테이블명으로는 참조할 수 없습니다.**',
      '- N 개 테이블을 조인하려면 **최소 N−1 개의 조인 조건**이 필요합니다. 조건이 빠지면 일부가 카티션 곱이 됩니다.',
      '- 공통 테이블 기준 `EMP`(8행) ⋈ `DEPT`(3행): SHIN(부서 NULL)과 HR(30, 사원 없음)은 짝이 없으므로 **내부 조인 결과는 7행**.'] },
    { h: '2. 외부 조인', md: [
      '| 문법 | 보존되는 쪽 | 공통 테이블 결과 행 수 |', '|---|---|---|',
      '| `EMP LEFT JOIN DEPT` | EMP 전체 (왼쪽) | 8 (SHIN 포함, DNAME 은 NULL) |',
      '| `EMP RIGHT JOIN DEPT` | DEPT 전체 (오른쪽) | 8 (HR 포함, ENAME 은 NULL) |',
      '| `EMP FULL JOIN DEPT` | 양쪽 모두 | 9 (7 + SHIN + HR) |',
      '| `EMP CROSS JOIN DEPT` | 조건 없음 | 24 (8 × 3) |',
      '- **Oracle (+) 문법**: 짝이 없어서 NULL 로 채워질 쪽에 `(+)` 를 붙입니다. `WHERE E.DEPTNO = D.DEPTNO(+)` 는 **EMP 를 보존**(LEFT OUTER)하는 의미입니다. 사실 `(+)` 는 **부족한 쪽**에 붙습니다. FULL OUTER 는 (+) 로 쓸 수 없고 표준 `FULL OUTER JOIN` 을 써야 합니다.',
      '- **ON 절 vs WHERE 절** (OUTER 조인에서 중요):',
      '  - ON 의 조건은 **조인 과정**에서 짝을 찾는 데 쓰이므로 보존 쪽 행은 조건이 안 맞아도 남습니다(상대 컬럼이 NULL 로 채워짐).',
      '  - WHERE 의 조건은 **조인이 끝난 뒤** 행을 거르므로 NULL 로 채워진 행이 조건에 걸려 사라질 수 있어 **사실상 내부 조인처럼** 변합니다.'] },
    { h: '3. NATURAL JOIN 과 USING', md: [
      '- `NATURAL JOIN` : 이름이 같은 **모든 컬럼**을 자동으로 동등 조인합니다. 조인 컬럼에 **별칭/테이블명 한정자를 붙일 수 없습니다**(Oracle). 같은 이름이지만 의미가 다른 컬럼이 있으면 의도치 않은 조인이 됩니다.',
      '- `USING (컬럼)` : 지정한 같은 이름의 컬럼으로만 조인하며 그 컬럼에는 **한정자를 쓸 수 없습니다**(Oracle). 결과에서 해당 컬럼은 한 번만 나옵니다.',
      '- `ON` : 조인 조건을 직접 서술. 가장 유연하고 안전하며 가독성이 높습니다.'] },
    { h: '4. 비동등 조인과 기타', md: [
      '- 비동등(Non-Equi) 조인: `ON E.SAL BETWEEN S.LOSAL AND S.HISAL` 처럼 `=` 가 아닌 조건(급여 등급 테이블이 대표 예).',
      '- 셀프 조인(자기 자신과 조인)은 계층형 질의 레슨에서 다룹니다.',
      '- 세 테이블 이상: `A JOIN B ON ... JOIN C ON ...` 처럼 왼쪽부터 차례로 연결.'] }
  ],
  misconceptions: [
    { wrong: '"EMP 와 DEPT 를 조인하면 항상 EMP 의 모든 사원이 나온다."', right: 'INNER 조인은 짝이 있는 행만 나온다. 부서가 NULL 인 SHIN 은 **제외**된다. 모두 나오려면 LEFT OUTER JOIN.', why: '조인 결과 행 수를 묻는 문제의 단골 함정입니다.' },
    { wrong: '"LEFT JOIN 에서 오른쪽 테이블 조건을 WHERE 에 써도 ON 에 쓴 것과 결과가 같다."', right: 'WHERE 로 쓰면 **조인 후 필터링**되어 NULL 로 채워진 행이 사라질 수 있다. ON 에 쓰면 짝 찾기 조건이라 보존 행이 유지된다.', why: '`LEFT JOIN … WHERE D.DNAME = \'DEV\'` 는 결과적으로 INNER 조인과 같아집니다.' },
    { wrong: '"Oracle 의 (+) 는 보존하고 싶은 쪽에 붙인다."', right: '(+) 는 짝이 없어서 **NULL 로 채워질 쪽(부족한 쪽)** 에 붙인다.', why: '`E.DEPTNO = D.DEPTNO(+)` → DEPT 쪽이 부족해도 EMP 행을 보존 = LEFT OUTER JOIN.' },
    { wrong: '"NATURAL JOIN 은 PK-FK 컬럼을 자동으로 찾아서 조인한다."', right: '키와 상관없이 **이름이 같은 모든 컬럼**을 조인한다. 이름이 같은데 의미가 다른 컬럼이 있으면 잘못된 조인이 된다.', why: '그래서 실무에서는 ON 이나 USING 을 선호합니다.' },
    { wrong: '"테이블 별칭을 붙였어도 원래 테이블명으로 컬럼을 한정할 수 있다."', right: '별칭을 붙이면 **그 쿼리 안에서는 원래 이름을 쓸 수 없다**(`EMP E` 이면 `EMP.ENAME` ✗, `E.ENAME` ✓).', why: '오라클은 오류(ORA-00904)를 냅니다.' },
    { wrong: '"3개 테이블 조인에 조인 조건은 하나면 충분하다."', right: 'N 개 테이블이면 최소 **N−1 개** 조건이 필요하다. 부족하면 카티션 곱이 섞인다.', why: '결과 행 수가 폭증하는 대표적인 실수입니다.' }
  ],
  examples: [
    { title: '내부 / 왼쪽 / 오른쪽 / 완전 외부 조인의 행 수', lang: 'sql', prelude: true, code: R`
SELECT 'INNER' AS KIND, COUNT(*) AS CNT FROM EMP E JOIN DEPT D ON E.DEPTNO = D.DEPTNO
UNION ALL
SELECT 'LEFT',  COUNT(*) FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO
UNION ALL
SELECT 'RIGHT', COUNT(*) FROM EMP E RIGHT JOIN DEPT D ON E.DEPTNO = D.DEPTNO
UNION ALL
SELECT 'FULL',  COUNT(*) FROM EMP E FULL JOIN DEPT D ON E.DEPTNO = D.DEPTNO
UNION ALL
SELECT 'CROSS', COUNT(*) FROM EMP E CROSS JOIN DEPT D;
`, output: R`
KIND | CNT
INNER | 7
LEFT | 8
RIGHT | 8
FULL | 9
CROSS | 24
`, notes: ['INNER 7, LEFT 8, RIGHT 8, FULL 9, CROSS 24. UNION ALL 은 다음 레슨(집합 연산자)에서 다시 설명합니다.'] },
    { title: 'LEFT JOIN: 짝 없는 행은 NULL 로 보존', lang: 'sql', prelude: true, code: R`
SELECT E.ENAME, E.DEPTNO, D.DNAME
FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO
WHERE E.EMPNO IN (1, 8)
ORDER BY E.EMPNO;
`, output: R`
ENAME | DEPTNO | DNAME
KIM | 10 | SALES
SHIN | NULL | NULL
`, notes: ['SHIN 은 DEPTNO 가 NULL 이라 짝이 없지만 LEFT JOIN 이라 남고 DNAME 은 NULL 입니다.'] },
    { title: 'ON 조건 vs WHERE 조건 (LEFT JOIN)', lang: 'sql', prelude: true, code: R`
SELECT E.ENAME, D.DNAME
FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO AND D.DNAME = 'DEV'
ORDER BY E.EMPNO;
SELECT E.ENAME, D.DNAME
FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO
WHERE D.DNAME = 'DEV'
ORDER BY E.EMPNO;
`, output: R`
ENAME | DNAME
KIM | NULL
LEE | NULL
PARK | DEV
CHOI | NULL
JUNG | NULL
HAN | DEV
YOON | DEV
SHIN | NULL

ENAME | DNAME
PARK | DEV
HAN | DEV
YOON | DEV
`, notes: ['첫 쿼리는 **8행**(모든 사원 보존, DEV 가 아닌 사원은 DNAME NULL). 두 번째는 WHERE 가 조인 후에 걸러서 **3행**(PARK, HAN, YOON)만 남습니다 — 사실상 INNER 조인.'] },
    { title: 'RIGHT JOIN: 사원이 없는 부서도 보인다', lang: 'sql', prelude: true, code: R`
SELECT D.DNAME, COUNT(E.EMPNO) AS EMP_CNT
FROM EMP E RIGHT JOIN DEPT D ON E.DEPTNO = D.DEPTNO
GROUP BY D.DNAME
ORDER BY D.DNAME;
`, output: R`
DNAME | EMP_CNT
DEV | 3
HR | 0
SALES | 4
`, notes: ['HR(30)은 사원이 없지만 RIGHT JOIN 이라 보존되고, `COUNT(E.EMPNO)` 는 NULL 을 세지 않아 0 입니다. (`COUNT(*)` 였다면 1 이 되는 함정!)'] },
    { title: 'NATURAL JOIN 과 USING', lang: 'sql', prelude: true, code: R`
SELECT ENAME, DNAME FROM EMP NATURAL JOIN DEPT WHERE EMPNO <= 2 ORDER BY EMPNO;
SELECT ENAME, DNAME FROM EMP JOIN DEPT USING (DEPTNO) WHERE EMPNO <= 2 ORDER BY EMPNO;
`, output: R`
ENAME | DNAME
KIM | SALES
LEE | SALES

ENAME | DNAME
KIM | SALES
LEE | SALES
`, notes: ['두 테이블에서 이름이 같은 컬럼은 DEPTNO 하나뿐이라 두 쿼리가 같은 결과를 냅니다. 이름이 같은 컬럼이 더 있으면(예: 둘 다 LOC 가 있다면) NATURAL JOIN 은 그 컬럼도 조건에 넣어 버립니다.'] },
    { title: '[Oracle] (+) 문법', lang: 'sql', noverify: true, code: R`
SELECT E.ENAME, D.DNAME
FROM EMP E, DEPT D
WHERE E.DEPTNO = D.DEPTNO(+)
  AND E.EMPNO IN (1, 8)
ORDER BY E.EMPNO;
`, output: R`
ENAME | DNAME
KIM | SALES
SHIN | NULL
`, notes: ['Oracle 전용 문법이라 검증하지 못했고 출력은 직접 계산했습니다. DEPT 쪽에 (+) 가 붙어 EMP 가 보존되는 LEFT OUTER JOIN 입니다.'] }
  ],
  exercises: [
    { q: '공통 테이블에서 부서별 사원 수를 모든 부서(사원 없는 HR 포함)에 대해 구하고, HR 이 0 으로 나오는지 확인하세요.', hint: 'DEPT 를 보존 + COUNT(E.EMPNO)', answer: fence('sql', 'SELECT D.DNAME, COUNT(E.EMPNO) FROM DEPT D LEFT JOIN EMP E ON D.DEPTNO = E.DEPTNO GROUP BY D.DNAME;') },
    { q: '`EMP CROSS JOIN DEPT` 에서 `WHERE E.DEPTNO = D.DEPTNO` 를 붙이면 어떤 조인과 같은가요?', hint: '카티션 곱 + 조건', answer: '내부(동등) 조인과 같다. 이것이 FROM 에 나열 + WHERE 조건 방식(옛 문법)의 원리다.' },
    { q: '부서가 없는 사원만 찾는 쿼리를 LEFT JOIN 으로 써 보세요.', hint: '짝이 없으면 D 쪽 컬럼이 NULL', answer: fence('sql', 'SELECT E.ENAME FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO WHERE D.DEPTNO IS NULL;') + '\n(이름 SHIN)' }
  ],
  quiz: [
    { q: 'EMP(8행)와 DEPT(3행)를 `CROSS JOIN` 하면 결과 행 수는?', choices: ['3', '8', '11', '24'], answer: 3, explain: '카티션 곱이므로 8 × 3 = 24 행입니다.' },
    { q: '공통 테이블에서 EMP 와 DEPT 의 INNER JOIN 결과는 몇 행인가? (SHIN 의 DEPTNO 는 NULL, HR(30)에는 사원이 없음)', accept: ['7'], explain: '짝이 있는 행만 나오므로 SHIN(부서 NULL)과 HR(사원 없음)이 빠져 7행입니다.' },
    { q: '같은 데이터에서 EMP FULL OUTER JOIN DEPT 의 결과 행 수는?', choices: ['7', '8', '9', '24'], answer: 2, explain: 'INNER 7 + 짝 없는 SHIN 1 + 짝 없는 HR 1 = 9행입니다.' },
    { q: 'LEFT OUTER JOIN 에서 오른쪽 테이블의 조건을 WHERE 절에 쓰면 일어나는 일은?', choices: ['아무 변화가 없다', 'NULL 로 채워진 행이 걸러져 사실상 내부 조인처럼 된다', '오류가 난다', '모든 행이 반환된다'], answer: 1, explain: 'WHERE 는 조인 후에 적용되어 NULL 로 채워진 행이 조건에 걸려 사라집니다. 보존하려면 조건을 ON 에 써야 합니다.' },
    { q: 'Oracle 의 `WHERE E.DEPTNO = D.DEPTNO(+)` 는 어떤 조인과 같은가?', choices: ['EMP 를 보존하는 LEFT OUTER JOIN', 'DEPT 를 보존하는 LEFT OUTER JOIN', 'FULL OUTER JOIN', 'INNER JOIN'], answer: 0, explain: '(+) 는 부족한 쪽(DEPT)에 붙고, 반대편인 EMP 가 보존됩니다.' },
    { q: 'NATURAL JOIN 에 대한 설명으로 옳은 것은?', choices: ['PK-FK 를 자동으로 찾아 조인한다', '이름이 같은 모든 컬럼으로 자동 동등 조인한다', '조인 컬럼 앞에 테이블 별칭을 붙여야 한다', '조인 조건이 없으면 카티션 곱이 된다'], answer: 1, explain: '이름이 같은 컬럼을 모두 조인 조건으로 사용하며, Oracle 에서는 해당 컬럼에 한정자를 붙일 수 없습니다.' },
    { q: '`SELECT COUNT(*) FROM DEPT D LEFT JOIN EMP E ON D.DEPTNO = E.DEPTNO WHERE D.DNAME = \'HR\'` 의 결과는? (HR 에는 사원이 없음)', choices: ['0', '1', 'NULL', '3'], answer: 1, explain: 'LEFT JOIN 으로 HR 행이 NULL 로 채워진 1행이 남고, COUNT(*) 는 그 행을 셉니다. COUNT(E.EMPNO) 였다면 0.' },
    { q: '3개 테이블을 조인할 때 필요한 최소 조인 조건의 개수는?', accept: ['2', '2개'], explain: 'N 개 테이블이면 N−1 개의 조인 조건이 필요합니다.' },
    { q: '`SELECT E.ENAME FROM EMP E ...` 와 같이 별칭 E 를 붙인 뒤 `EMP.ENAME` 으로 참조하면?', choices: ['정상 동작', '오류', '경고만 발생', '별칭이 무시된다'], answer: 1, explain: '별칭을 지정하면 그 문장 안에서는 원래 테이블명을 쓸 수 없습니다.' }
  ]
}

);
})();
