/* SQLD 트랙 — 4파일: 과목2 관리 구문(DML·TCL, DDL·제약조건·DCL) + 실전 모의고사 2회
 * 모의고사 문제는 기출 경향(결과 예측, NULL·조인·그룹·윈도우 함정, 용어 구분)을 반영해 새로 만든 문제입니다.
 */
(() => {
const R = String.raw;
const fence = (lang, src) => '```' + lang + '\n' + src.replace(/^\n|\n$/g, '') + '\n```';
const t = window.STUDY_TRACKS.find(x => x.id === 'sqld');

t.lessons.push(

/* ======================= 14 ======================= */
{
  id: 'sq-14', unit: '4부. 관리 구문 (과목2)', title: 'DML과 트랜잭션 제어(TCL)', time: '80분',
  summary: 'INSERT·UPDATE·DELETE·MERGE 는 데이터를 바꾸고, COMMIT·ROLLBACK·SAVEPOINT 는 그 변경을 확정하거나 되돌린다. DELETE 와 TRUNCATE, DDL 의 자동 커밋 차이가 단골이다.',
  goals: ['INSERT/UPDATE/DELETE/MERGE 구문을 읽고 쓴다', 'WHERE 를 빼먹으면 어떻게 되는지 안다', 'DELETE / TRUNCATE / DROP 의 차이를 표로 구분한다', 'COMMIT / ROLLBACK / SAVEPOINT 의 결과를 순서대로 추적한다'],
  terms: [
    { t: 'DML', d: '데이터를 입력·수정·삭제·병합하는 SQL (INSERT, UPDATE, DELETE, MERGE). 트랜잭션 제어가 필요하다.' },
    { t: '트랜잭션(Transaction)', d: '하나의 논리적 작업 단위. 전부 반영되거나 전부 취소된다 (ACID).' },
    { t: 'COMMIT / ROLLBACK', d: 'COMMIT = 변경을 **영구 반영**, ROLLBACK = 마지막 COMMIT(또는 SAVEPOINT) 이후의 변경을 **취소**.' },
    { t: 'SAVEPOINT', d: '트랜잭션 **중간 저장 지점**. `ROLLBACK TO 이름` 으로 그 지점까지만 되돌릴 수 있다.' }
  ],
  sections: [
    { h: '1. DML', md: [
      '```sql\nINSERT INTO 테이블 (컬럼, ...) VALUES (값, ...);      -- 컬럼 목록을 생략하면 모든 컬럼을 정의된 순서대로\nINSERT INTO 테이블 SELECT ...;                       -- 조회 결과를 여러 행 입력\nUPDATE 테이블 SET 컬럼 = 값 [, ...] [WHERE 조건];\nDELETE FROM 테이블 [WHERE 조건];\n```',
      '- 문자·날짜 값은 **작은따옴표**로 묶습니다. NOT NULL 컬럼에 값을 주지 않으면 오류(DEFAULT 가 있으면 그 값).',
      '- **WHERE 를 생략**하면 `UPDATE` 는 **모든 행**을, `DELETE` 는 **모든 행**을 바꿉니다(단 DML 이라 COMMIT 전이면 ROLLBACK 가능).',
      '- `UPDATE` 의 SET 에는 서브쿼리도 쓸 수 있습니다. 컬럼에 NULL 을 넣으려면 `SET 컬럼 = NULL`.',
      '**MERGE** (Oracle, SQL Server): 조건에 맞는 행이 **있으면 UPDATE, 없으면 INSERT** 를 한 문장으로.',
      '```sql\nMERGE INTO 대상 T USING 원본 S ON (T.키 = S.키)\nWHEN MATCHED     THEN UPDATE SET T.값 = S.값\nWHEN NOT MATCHED THEN INSERT (키, 값) VALUES (S.키, S.값);\n```'] },
    { h: '2. DELETE · TRUNCATE · DROP 비교 — 매우 중요', md: [
      '| | DELETE | TRUNCATE | DROP |', '|---|---|---|---|',
      '| 분류 | DML | **DDL** | **DDL** |',
      '| 대상 | 행(조건으로 일부 가능) | 테이블의 **모든 행** (조건 불가) | **테이블 자체**(구조+데이터) |',
      '| ROLLBACK | **가능**(COMMIT 전) | **불가**(자동 커밋) | **불가** |',
      '| 속도·로그 | 느림, 행 단위 로그 | 빠름, 로그 최소 | — |',
      '| 저장 공간 | 즉시 해제되지 않을 수 있음 | **해제**(초기화) | 해제 |',
      '| 테이블 구조 | 유지 | 유지 | **삭제** |'] },
    { h: '3. 트랜잭션 제어(TCL)', md: [
      '| 명령 | 효과 |', '|---|---|',
      '| `COMMIT` | 지금까지의 변경을 영구 반영, 이전 상태로 복구 불가, **락 해제** |',
      '| `ROLLBACK` | 마지막 커밋 이후의 변경을 모두 취소 |',
      '| `SAVEPOINT 이름` | 중간 지점 표시 |',
      '| `ROLLBACK TO 이름` | 그 SAVEPOINT 까지만 되돌림(그 이후 SAVEPOINT 는 사라지고, **트랜잭션은 계속** 열려 있음) |',
      '**COMMIT 전**: 변경 사항은 **자신만** 볼 수 있고 다른 사용자는 볼 수 없으며, 변경된 행은 **잠금(LOCK)** 되어 다른 사용자가 수정할 수 없습니다. 메모리(버퍼)에서 작업한 상태라 되돌릴 수 있습니다.',
      '**Oracle 과 SQL Server 의 차이**',
      '| | Oracle | SQL Server |', '|---|---|---|',
      '| 트랜잭션 시작 | 첫 DML 에서 **암시적**으로 시작 | 기본은 **AUTOCOMMIT**(문장마다 자동 커밋). `BEGIN TRAN` 으로 명시적 시작 |',
      '| 종료 | `COMMIT` / `ROLLBACK` | `COMMIT TRAN` / `ROLLBACK TRAN` |',
      '| SAVEPOINT | `SAVEPOINT a` / `ROLLBACK TO a` | `SAVE TRAN a` / `ROLLBACK TRAN a` |',
      '**자동 커밋/롤백**: **DDL(CREATE, ALTER, DROP, TRUNCATE …)은 실행 직전·직후에 자동 COMMIT** 됩니다(Oracle). 그래서 DML 후 DDL 을 실행하면 앞선 DML 이 확정되어 ROLLBACK 할 수 없습니다. 정상 종료(`EXIT`) 시 자동 COMMIT, 비정상 종료(세션 끊김·정전) 시 자동 ROLLBACK 입니다.'] }
  ],
  misconceptions: [
    { wrong: '"`DELETE FROM EMP` (WHERE 없음) 는 아무것도 지우지 않는다 / 오류가 난다."', right: 'WHERE 가 없으면 **모든 행**이 삭제된다. (COMMIT 전이라면 ROLLBACK 으로 복구 가능)', why: 'UPDATE 도 WHERE 가 없으면 전체 행이 바뀝니다. 실무 사고의 대표 원인입니다.' },
    { wrong: '"TRUNCATE 는 DELETE 처럼 ROLLBACK 할 수 있다."', right: 'TRUNCATE 는 **DDL** 이라 자동 커밋되어 ROLLBACK 이 **불가**하다. 조건(WHERE)도 쓸 수 없다.', why: '대신 속도가 빠르고 저장 공간을 해제합니다.' },
    { wrong: '"COMMIT 하기 전에도 다른 사용자가 내 변경을 볼 수 있다."', right: '볼 수 **없다**. 다른 사용자는 변경 전 값을 보며, 변경한 행은 잠겨서 수정도 못 한다.', why: '그래서 트랜잭션을 길게 열어두면 다른 사용자가 대기(락 대기)합니다.' },
    { wrong: '"`ROLLBACK TO S1` 을 실행하면 트랜잭션 전체가 끝난다."', right: 'S1 시점까지만 되돌리고 **트랜잭션은 계속** 열려 있다. 이후에 COMMIT 해야 확정된다.', why: 'S1 이후에 만든 SAVEPOINT(S2 등)는 사라집니다.' },
    { wrong: '"DML 후 CREATE TABLE 을 해도 ROLLBACK 으로 DML 을 취소할 수 있다."', right: 'DDL 은 **자동 COMMIT** 이라 그 앞의 DML 도 확정된다. ROLLBACK 해도 되돌릴 수 없다.', why: '"DDL = 자동 커밋" 한 줄로 외우세요.' },
    { wrong: '"SQL Server 도 Oracle 처럼 첫 DML 이 트랜잭션을 암묵적으로 시작하고 COMMIT 전까지 유지한다."', right: 'SQL Server 는 기본이 **AUTOCOMMIT** 이다. 여러 문장을 묶으려면 `BEGIN TRAN` 으로 **명시적**으로 시작.', why: 'DBMS 별 기본 트랜잭션 모드는 비교표로 자주 출제됩니다.' }
  ],
  examples: [
    { title: 'INSERT / UPDATE / DELETE 와 WHERE 생략', lang: 'sql', prelude: true, code: R`
INSERT INTO DEPT (DEPTNO, DNAME, LOC) VALUES (40, 'QA', 'JEJU');
UPDATE EMP SET SAL = SAL + 100 WHERE DEPTNO = 20;
DELETE FROM EMP WHERE ENAME = 'SHIN';
SELECT COUNT(*) AS DEPT_CNT FROM DEPT;
SELECT ENAME, SAL FROM EMP WHERE DEPTNO = 20 ORDER BY EMPNO;
SELECT COUNT(*) AS EMP_CNT FROM EMP;
`, output: R`
DEPT_CNT
4

ENAME | SAL
PARK | 2900
HAN | 2600
YOON | 1100

EMP_CNT
7
`, notes: ['부서 4개, 20번 부서 사원 급여만 +100, SHIN 삭제로 사원 7명. WHERE 를 빼먹었다면 모든 사원의 급여가 올랐을 것입니다.'] },
    { title: 'INSERT ... SELECT', lang: 'sql', prelude: true, code: R`
CREATE TABLE HIGH_PAID (EMPNO INTEGER, ENAME TEXT, SAL INTEGER);
INSERT INTO HIGH_PAID SELECT EMPNO, ENAME, SAL FROM EMP WHERE SAL >= 2800;
SELECT * FROM HIGH_PAID ORDER BY EMPNO;
`, output: R`
EMPNO | ENAME | SAL
1 | KIM | 5000
2 | LEE | 3000
3 | PARK | 2800
`, notes: ['조회 결과(KIM, LEE, PARK)가 한 번에 여러 행으로 입력됩니다. VALUES 절은 쓰지 않습니다.'] },
    { title: '전체 삭제 후 ROLLBACK (DML 은 되돌릴 수 있다)', lang: 'sql', prelude: true, code: R`
BEGIN;
DELETE FROM EMP;
SELECT COUNT(*) AS AFTER_DELETE FROM EMP;
ROLLBACK;
SELECT COUNT(*) AS AFTER_ROLLBACK FROM EMP;
`, output: R`
AFTER_DELETE
0

AFTER_ROLLBACK
8
`, notes: ['COMMIT 전이므로 ROLLBACK 으로 8행이 복구됩니다. (SQLite 의 `BEGIN` 이 트랜잭션 시작. Oracle 에서는 DELETE 가 곧 트랜잭션의 시작입니다.) TRUNCATE 였다면 롤백이 불가능합니다.'] },
    { title: 'SAVEPOINT 추적', lang: 'sql', code: R`
CREATE TABLE T (V INTEGER);
BEGIN;
INSERT INTO T VALUES (1);
SAVEPOINT S1;
INSERT INTO T VALUES (2);
SAVEPOINT S2;
INSERT INTO T VALUES (3);
ROLLBACK TO S1;
INSERT INTO T VALUES (4);
COMMIT;
SELECT V FROM T ORDER BY V;
`, output: R`
V
1
4
`, notes: ['`ROLLBACK TO S1` 은 S1 이후의 INSERT(2, 3)만 취소하고, 이후 INSERT 4 와 처음의 1 은 COMMIT 으로 확정됩니다. 최종: 1, 4.'] },
    { title: '[Oracle] MERGE', lang: 'sql', noverify: true, code: R`
-- EMP_BONUS 에는 (1, 0), (2, 0) 이 들어 있다고 가정
MERGE INTO EMP_BONUS B
USING (SELECT EMPNO, SAL FROM EMP WHERE DEPTNO = 10) S
   ON (B.EMPNO = S.EMPNO)
WHEN MATCHED THEN
  UPDATE SET B.BONUS = S.SAL / 10
WHEN NOT MATCHED THEN
  INSERT (EMPNO, BONUS) VALUES (S.EMPNO, S.SAL / 10);

SELECT * FROM EMP_BONUS ORDER BY EMPNO;
`, output: R`
EMPNO | BONUS
1 | 500
2 | 300
4 | 150
5 | 150
`, notes: ['Oracle/SQL Server 전용이라 검증하지 못했고 출력은 직접 계산했습니다. 10번 부서 사원 4명 중 KIM(1), LEE(2)는 이미 있어 **UPDATE**(보너스 갱신), CHOI(4), JUNG(5)는 없어서 **INSERT**.'] }
  ],
  exercises: [
    { q: '공통 테이블에서 YOON 의 급여를 1500 으로 바꾸는 UPDATE 를 쓰고, WHERE 를 빼먹으면 어떤 일이 생기는지 설명하세요.', hint: 'UPDATE EMP SET SAL = 1500 WHERE ENAME = \'YOON\'', answer: fence('sql', "UPDATE EMP SET SAL = 1500 WHERE ENAME = 'YOON';") + '\nWHERE 가 없으면 **모든 사원**의 급여가 1500 이 된다.' },
    { q: '다음 순서로 실행했을 때 T 에 남는 행은? `INSERT 1; COMMIT; INSERT 2; SAVEPOINT A; INSERT 3; ROLLBACK TO A; ROLLBACK;`', hint: 'COMMIT 이후의 변경은 전부 취소된다', answer: '1 만 남는다. (COMMIT 으로 1 이 확정됨. 이후 INSERT 2, 3 은 마지막 ROLLBACK 으로 모두 취소)' },
    { q: 'Oracle 에서 `DELETE FROM T; CREATE TABLE T2 (A NUMBER); ROLLBACK;` 후 T 의 데이터는 복구될까요?', hint: 'DDL 은 자동 COMMIT', answer: '복구되지 않는다. CREATE TABLE(DDL)이 자동 COMMIT 되어 DELETE 가 이미 확정되었기 때문.' }
  ],
  quiz: [
    { q: '다음 중 ROLLBACK 으로 취소할 수 없는 작업은? (Oracle)', choices: ['DELETE', 'UPDATE', 'INSERT', 'TRUNCATE TABLE'], answer: 3, explain: 'TRUNCATE 는 DDL 이라 자동 커밋되어 롤백할 수 없습니다.' },
    { q: '`DELETE FROM EMP;` (WHERE 없음) 를 실행했을 때의 결과는?', choices: ['오류 발생', '아무 행도 삭제되지 않음', '모든 행이 삭제됨(COMMIT 전이라 ROLLBACK 가능)', '모든 행과 테이블 구조가 삭제됨'], answer: 2, explain: 'WHERE 가 없으면 모든 행이 삭제되지만 테이블 구조는 남고, COMMIT 전이면 ROLLBACK 이 가능합니다.' },
    { q: '테이블 구조는 그대로 두고 모든 행을 빠르게 삭제하며 롤백이 불가능한 명령은?', accept: ['TRUNCATE', 'TRUNCATE TABLE', 'truncate', 'truncate table'], explain: 'TRUNCATE TABLE 은 DDL 로 모든 행을 빠르게 지우고 공간을 해제하며 자동 커밋됩니다.' },
    { q: '`INSERT 1; SAVEPOINT S1; INSERT 2; SAVEPOINT S2; INSERT 3; ROLLBACK TO S1; COMMIT;` 후 테이블에 남는 값은?', choices: ['1', '1, 2', '1, 2, 3', '없음'], answer: 0, explain: 'S1 로 되돌리면 INSERT 2, 3 이 취소되고 1 만 남아 COMMIT 으로 확정됩니다.' },
    { q: 'Oracle 에서 DML 실행 후 DDL(CREATE TABLE)을 실행하고 ROLLBACK 하면 앞의 DML 은?', choices: ['취소된다', '확정되어 취소되지 않는다', '오류가 난다', 'DDL 이 취소된다'], answer: 1, explain: 'DDL 은 자동 COMMIT 되어 이전 DML 도 함께 확정됩니다.' },
    { q: 'COMMIT 하기 전의 상태에 대한 설명으로 옳은 것은?', choices: ['다른 사용자도 변경된 데이터를 볼 수 있다', '변경된 행은 다른 사용자가 수정할 수 없도록 잠긴다', '변경 이전 상태로 복구할 수 없다', '자동으로 영구 반영된다'], answer: 1, explain: 'COMMIT 전에는 자신만 변경을 볼 수 있고, 변경한 행은 락이 걸려 다른 사용자가 수정할 수 없습니다. ROLLBACK 도 가능.' },
    { q: 'SQL Server 의 기본 트랜잭션 모드는?', choices: ['첫 DML 에서 암시적 시작', 'AUTOCOMMIT(문장마다 자동 커밋)', '항상 읽기 전용', '명시적 COMMIT 전까지 대기'], answer: 1, explain: 'SQL Server 는 기본이 AUTOCOMMIT 이며 BEGIN TRAN 으로 명시적 트랜잭션을 시작합니다. Oracle 은 암시적 시작.' },
    { q: '조건에 맞는 행이 있으면 UPDATE, 없으면 INSERT 를 한 문장으로 처리하는 DML 은?', accept: ['MERGE', 'merge'], explain: 'MERGE 는 WHEN MATCHED THEN UPDATE / WHEN NOT MATCHED THEN INSERT 를 한 문장으로 처리합니다.' },
    { q: '`INSERT INTO T SELECT ...` 에 대한 설명으로 옳은 것은?', choices: ['VALUES 를 반드시 써야 한다', '조회한 여러 행을 한 번에 입력한다', '오직 한 행만 입력된다', 'DDL 이다'], answer: 1, explain: 'INSERT ... SELECT 는 SELECT 결과 전체(여러 행)를 입력합니다.' }
  ]
},

/* ======================= 15 ======================= */
{
  id: 'sq-15', unit: '4부. 관리 구문 (과목2)', title: 'DDL, 제약조건, DCL', time: '85분',
  summary: 'DDL 은 테이블 등 구조를 만들고 바꾸며 실행 즉시 확정된다. 제약조건(PK·UNIQUE·NOT NULL·CHECK·FK)은 데이터 무결성을 DB 가 지키게 하고, DCL(GRANT/REVOKE)은 권한을 관리한다.',
  goals: ['CREATE / ALTER / DROP / RENAME / TRUNCATE 를 구분해 쓴다', '5가지 제약조건의 의미와 차이를 설명한다', 'FOREIGN KEY 의 삭제 옵션(CASCADE 등)을 안다', 'GRANT / REVOKE / ROLE / GRANT OPTION 을 이해한다'],
  terms: [
    { t: 'DDL', d: '데이터 **구조**(테이블·뷰·인덱스 등)를 정의·변경·삭제하는 SQL. 실행 즉시 **자동 커밋**.' },
    { t: '제약조건', d: '컬럼·테이블에 걸어 **잘못된 데이터가 들어오지 못하게** 하는 규칙(PK, UNIQUE, NOT NULL, CHECK, FK).' },
    { t: 'CTAS', d: 'Create Table As Select. 조회 결과로 **테이블을 만들면서 복사**. (SQL Server: `SELECT ... INTO`)' },
    { t: 'DCL', d: '권한을 주고(GRANT) 회수(REVOKE)하는 SQL.' },
    { t: 'ROLE', d: '여러 권한을 **묶어 놓은 이름**. 사용자에게 롤을 부여해 권한 관리를 단순화.' }
  ],
  sections: [
    { h: '1. DDL 기본', md: [
      '```sql\nCREATE TABLE EMP2 (\n  EMPNO  NUMBER(4) PRIMARY KEY,\n  ENAME  VARCHAR2(20) NOT NULL,\n  SAL    NUMBER(7,2) DEFAULT 0 CHECK (SAL >= 0),\n  DEPTNO NUMBER(2) REFERENCES DEPT(DEPTNO)\n);\nALTER TABLE EMP2 ADD (HIREDATE DATE);          -- 컬럼 추가\nALTER TABLE EMP2 MODIFY (ENAME VARCHAR2(30));  -- 컬럼 변경 (SQL Server: ALTER COLUMN)\nALTER TABLE EMP2 DROP COLUMN HIREDATE;         -- 컬럼 삭제\nALTER TABLE EMP2 RENAME COLUMN SAL TO PAY;     -- 컬럼 이름 변경\nRENAME EMP2 TO EMP3;                            -- 테이블 이름 변경 (Oracle)\nDROP TABLE EMP3;                                -- 구조+데이터 삭제 (부모는 CASCADE CONSTRAINTS)\nTRUNCATE TABLE EMP3;                            -- 데이터만 전부 삭제\n```',
      '| 데이터 타입 (Oracle) | 설명 | SQL Server |', '|---|---|---|',
      '| `CHAR(n)` | **고정 길이**. 남는 길이는 공백으로 채움 | `CHAR(n)` |',
      '| `VARCHAR2(n)` | **가변 길이**. 입력한 길이만큼만 저장 | `VARCHAR(n)` |',
      '| `NUMBER(p, s)` | 전체 p 자리, 소수 s 자리 숫자 | `INT`, `DECIMAL(p,s)` |',
      '| `DATE` | 날짜+시각 | `DATETIME` |',
      '- **CHAR 비교**: 두 값이 모두 CHAR 이면 짧은 쪽을 공백으로 채워 비교해 `\'AB\'` = `\'AB  \'` 입니다. 한쪽이라도 VARCHAR2 이면 공백까지 구분해 서로 다른 값입니다.',
      '- **이름 규칙**: 문자로 시작, 영문자·숫자·`_`·`$`·`#` 사용, **예약어 불가**, 같은 사용자 안에서 **같은 이름의 테이블 불가**.',
      '- **ALTER 제약**: 컬럼을 삭제해도 **최소 하나의 컬럼**은 남아야 하고, 데이터가 있는 컬럼은 타입·크기를 줄이는 변경이 제한됩니다. 컬럼 **추가**는 마지막 위치에만 되고, 새 컬럼은 기본적으로 **NULL** 입니다(DEFAULT 지정 가능).',
      '- **CTAS**: `CREATE TABLE T2 AS SELECT * FROM T1;` 은 데이터와 **NOT NULL 제약조건만** 복사하고 PK, FK 등 다른 제약조건은 복사되지 않습니다. 데이터 없이 구조만 복사하려면 `WHERE 1 = 2`.'] },
    { h: '2. 제약조건', md: [
      '| 제약조건 | 의미 | 핵심 규칙 |', '|---|---|---|',
      '| `PRIMARY KEY` | 행을 유일하게 식별 | **UNIQUE + NOT NULL**, 테이블에 **1개**(복합 가능) |',
      '| `UNIQUE` | 중복 값 금지 | NULL 허용(Oracle 은 NULL 여러 개 가능), 테이블에 여러 개 가능 |',
      '| `NOT NULL` | NULL 금지 | 컬럼 단위로만 지정 |',
      '| `CHECK` | 값의 범위·조건 | `CHECK (SAL > 0)` 처럼 조건 지정 |',
      '| `FOREIGN KEY` | 다른 테이블의 PK(UNIQUE) 참조 | **참조 무결성**: 부모에 없는 값 입력 불가, 자식이 있는 부모 삭제 제한 |',
      '- 제약조건 이름 지정: `CONSTRAINT 이름 PRIMARY KEY (...)`. 나중에 `ALTER TABLE ... ADD CONSTRAINT`, `DROP CONSTRAINT` 로 추가·삭제.',
      '- **FK 의 삭제/수정 옵션**: `ON DELETE CASCADE`(부모 삭제 시 자식도 삭제), `ON DELETE SET NULL`(자식의 FK 를 NULL 로), 기본(RESTRICT/NO ACTION)은 자식이 있으면 **부모 삭제 거부**.',
      '- FK 가 있는 테이블은 **부모 테이블을 먼저 생성**하고, 삭제는 **자식을 먼저** 합니다.',
      '- 제약조건은 **행이 입력·수정될 때** 검사됩니다.'] },
    { h: '3. DELETE · TRUNCATE · DROP 한 번 더', md: [
      '| | 데이터 | 구조 | 트랜잭션 |', '|---|---|---|---|',
      '| `DELETE` | 삭제 (조건 가능) | 유지 | **DML**, 롤백 가능 |',
      '| `TRUNCATE` | 전부 삭제 | 유지 | **DDL**, 자동 커밋 |',
      '| `DROP` | 삭제 | **삭제** | **DDL**, 자동 커밋 |'] },
    { h: '4. DCL — 권한 관리', md: [
      '```sql\nGRANT SELECT, INSERT ON EMP TO USER1;                  -- 객체 권한 부여\nGRANT SELECT ON EMP TO USER1 WITH GRANT OPTION;       -- 받은 권한을 남에게 재부여 가능\nGRANT CREATE SESSION, CREATE TABLE TO USER1;           -- 시스템 권한\nREVOKE SELECT ON EMP FROM USER1;                       -- 권한 회수\n\nCREATE ROLE R_ANALYST;\nGRANT SELECT ON EMP TO R_ANALYST;\nGRANT R_ANALYST TO USER1;                              -- 롤을 사용자에게\n```',
      '- **시스템 권한**: 사용자가 DB 에서 할 수 있는 작업(`CREATE SESSION`(접속), `CREATE TABLE`, `CREATE VIEW` …). **객체 권한**: 특정 객체(테이블 등)에 대한 접근(`SELECT`, `INSERT`, `UPDATE`, `DELETE ON 객체`).',
      '- **`WITH GRANT OPTION`**(객체 권한): 권한을 받은 사용자가 **다른 사용자에게 다시 부여**할 수 있음. 원 부여자가 REVOKE 하면 재부여받은 사용자의 권한도 **함께 회수(연쇄)** 됩니다. 시스템 권한·롤에서는 `WITH ADMIN OPTION`(연쇄 회수 없음).',
      '- **ROLE**: 권한 묶음. 롤을 만들고 → 롤에 권한을 부여 → 사용자에게 롤을 부여. 사용자가 늘어도 관리가 쉽습니다. Oracle 기본 롤: `CONNECT`, `RESOURCE`, `DBA`.',
      '- DCL 도 DDL 처럼 **자동 커밋**입니다(트랜잭션 제어 대상이 아님).'] }
  ],
  misconceptions: [
    { wrong: '"UNIQUE 와 PRIMARY KEY 는 같다."', right: 'PK 는 UNIQUE + **NOT NULL**, 테이블당 **하나**. UNIQUE 는 NULL 을 허용하고 여러 개 둘 수 있다.', why: 'NULL 허용 여부와 개수가 시험 단골 비교점입니다.' },
    { wrong: '"CTAS(`CREATE TABLE AS SELECT`)는 PK, FK 까지 모두 복사한다."', right: '**데이터와 NOT NULL** 만 복사된다. PK, UNIQUE, FK, CHECK, 인덱스는 복사되지 않는다.', why: '복사한 뒤 필요한 제약조건은 `ALTER TABLE ... ADD CONSTRAINT` 로 다시 걸어야 합니다.' },
    { wrong: '"CHAR(5) 에 \'AB\' 를 저장하면 2 바이트만 쓴다."', right: 'CHAR 는 **고정 길이**라 남는 자리를 공백으로 채워 5 바이트를 쓴다. 가변은 VARCHAR2.', why: '그래서 CHAR 끼리는 공백 무시 비교, VARCHAR2 와는 길이가 다르면 다른 값입니다.' },
    { wrong: '"FK 가 걸린 부모 행은 자식이 있어도 언제나 삭제된다."', right: '기본 동작은 자식이 있으면 부모 삭제를 **거부**한다. `ON DELETE CASCADE` 를 주면 자식도 함께 삭제.', why: '자식 테이블을 먼저 지우거나 옵션을 지정해야 합니다.' },
    { wrong: '"WITH GRANT OPTION 으로 부여한 권한을 REVOKE 하면 재부여된 권한은 그대로 남는다."', right: '객체 권한에서는 **연쇄 회수**된다. (시스템 권한의 WITH ADMIN OPTION 은 연쇄되지 않음)', why: '둘의 차이도 자주 나옵니다.' },
    { wrong: '"GRANT/REVOKE 는 ROLLBACK 으로 되돌릴 수 있다."', right: 'DCL 은 DDL 처럼 **자동 커밋**이라 롤백할 수 없다.', why: '권한 실수는 REVOKE 로 직접 고쳐야 합니다.' }
  ],
  examples: [
    { title: '제약조건: DEFAULT, UNIQUE 와 NULL', lang: 'sql', code: R`
CREATE TABLE MEMBER (
  ID     INTEGER PRIMARY KEY,
  EMAIL  TEXT UNIQUE,
  STATUS TEXT DEFAULT 'ACTIVE' NOT NULL,
  AGE    INTEGER CHECK (AGE >= 0)
);
INSERT INTO MEMBER (ID, EMAIL, AGE) VALUES (1, 'a@x.com', 20);
INSERT INTO MEMBER (ID, EMAIL, AGE) VALUES (2, NULL, 30);
INSERT INTO MEMBER (ID, EMAIL, AGE) VALUES (3, NULL, 40);
SELECT ID, EMAIL, STATUS FROM MEMBER ORDER BY ID;
`, output: R`
ID | EMAIL | STATUS
1 | a@x.com | ACTIVE
2 | NULL | ACTIVE
3 | NULL | ACTIVE
`, notes: ['STATUS 는 값을 주지 않아 DEFAULT \'ACTIVE\'. UNIQUE 컬럼 EMAIL 에는 NULL 이 두 번 들어갔습니다(NULL 은 서로 다른 값으로 취급). 같은 값 \'a@x.com\' 을 또 넣거나 AGE 에 -1 을 넣으면 제약조건 오류가 납니다.'] },
    { title: 'FOREIGN KEY 와 ON DELETE CASCADE', lang: 'sql', code: R`
PRAGMA foreign_keys = ON;
CREATE TABLE PARENT (ID INTEGER PRIMARY KEY);
CREATE TABLE CHILD (
  CID INTEGER PRIMARY KEY,
  PID INTEGER REFERENCES PARENT(ID) ON DELETE CASCADE
);
INSERT INTO PARENT VALUES (1), (2);
INSERT INTO CHILD VALUES (10, 1), (11, 1), (12, 2);
DELETE FROM PARENT WHERE ID = 1;
SELECT CID, PID FROM CHILD ORDER BY CID;
`, output: R`
CID | PID
12 | 2
`, notes: ['부모 1 을 지우자 자식 10, 11 도 함께 삭제되었습니다(CASCADE). 옵션이 없었다면 자식이 있는 부모 삭제가 **거부**됩니다. (SQLite 는 `PRAGMA foreign_keys = ON` 을 켜야 FK 가 동작합니다.)'] },
    { title: 'CTAS: 데이터는 복사, 제약조건은 (NOT NULL 외) 복사 안 됨', lang: 'sql', prelude: true, code: R`
CREATE TABLE EMP_COPY AS SELECT EMPNO, ENAME, SAL FROM EMP WHERE DEPTNO = 10;
SELECT * FROM EMP_COPY ORDER BY EMPNO;
CREATE TABLE EMP_EMPTY AS SELECT * FROM EMP WHERE 1 = 2;
SELECT COUNT(*) AS EMPTY_CNT FROM EMP_EMPTY;
`, output: R`
EMPNO | ENAME | SAL
1 | KIM | 5000
2 | LEE | 3000
4 | CHOI | 1500
5 | JUNG | 1500

EMPTY_CNT
0
`, notes: ['`WHERE 1 = 2` 는 항상 거짓이라 구조만 복사됩니다(데이터 0건). (Oracle 의 CTAS 는 NOT NULL 외 제약조건을 복사하지 않습니다. 이 예제의 SQLite 는 제약조건 복사 여부를 보여 주지 않으므로 규칙은 본문으로 기억하세요.)'] },
    { title: 'ALTER TABLE: 컬럼 추가 / 이름 변경 / 삭제', lang: 'sql', code: R`
CREATE TABLE T (A INTEGER, B INTEGER);
INSERT INTO T VALUES (1, 10), (2, 20);
ALTER TABLE T ADD COLUMN C TEXT;
ALTER TABLE T RENAME COLUMN B TO BB;
ALTER TABLE T DROP COLUMN A;
SELECT * FROM T;
`, output: R`
BB | C
10 | NULL
20 | NULL
`, notes: ['추가된 컬럼 C 는 기존 행에서 NULL. B 는 BB 로 이름이 바뀌고 A 는 삭제되었습니다. (Oracle 에서 타입 변경은 `MODIFY`, SQL Server 는 `ALTER COLUMN`.)'] },
    { title: '[Oracle] CHAR vs VARCHAR2 비교', lang: 'sql', noverify: true, code: R`
-- COL_C CHAR(5) = 'AB', COL_V VARCHAR2(5) = 'AB'  (각각 'AB   ', 'AB' 로 저장)
SELECT CASE WHEN 'AB' = 'AB   ' THEN 'SAME' ELSE 'DIFF' END AS LITERAL_VS_LITERAL FROM DUAL;
-- 문자 리터럴 끼리는 CHAR 의미(공백 패딩 비교)지만 VARCHAR2 컬럼이 끼면 길이까지 비교
`, output: R`
LITERAL_VS_LITERAL
SAME
`, notes: ['Oracle 은 문자 **리터럴** 끼리는 CHAR 처럼 공백을 채워 비교하므로 SAME. 하지만 한쪽이 VARCHAR2 **컬럼**이면 \'AB\' 와 \'AB   \' 는 다른 값입니다. 출력은 직접 계산했습니다(Oracle 전용).'] },
    { title: '[Oracle] GRANT / REVOKE / ROLE', lang: 'sql', noverify: true, code: R`
GRANT SELECT ON EMP TO USER1 WITH GRANT OPTION;   -- USER1 은 이 권한을 남에게 줄 수 있다
-- USER1 로 접속해서:  GRANT SELECT ON SCOTT.EMP TO USER2;
REVOKE SELECT ON EMP FROM USER1;                  -- USER1 뿐 아니라 USER1 이 준 USER2 의 권한도 함께 회수

CREATE ROLE R_ANALYST;
GRANT SELECT ON EMP TO R_ANALYST;
GRANT R_ANALYST TO USER3;                         -- 롤로 권한 묶음 부여
`, notes: ['DCL 은 결과 표 대신 권한 상태가 바뀝니다(그래서 출력 없음). 객체 권한의 WITH GRANT OPTION 은 **연쇄 회수**, 롤은 **권한 묶음**이라는 점을 기억하세요.'] }
  ],
  exercises: [
    { q: 'EMP 테이블에서 CTAS 로 "구조만" 복사한 EMP_COPY 를 만드는 문장을 쓰세요. PK 는 복사되나요?', hint: 'WHERE 1 = 2', answer: fence('sql', 'CREATE TABLE EMP_COPY AS SELECT * FROM EMP WHERE 1 = 2;') + '\nPK 는 복사되지 않는다(NOT NULL 만 복사). 필요하면 ALTER TABLE ADD CONSTRAINT.' },
    { q: 'PRIMARY KEY 와 UNIQUE 의 차이를 NULL 과 개수 관점에서 한 줄로 설명하세요.', hint: 'NOT NULL, 테이블당 개수', answer: 'PK 는 NULL 불가·테이블당 1개, UNIQUE 는 NULL 허용(Oracle 은 여러 개)·여러 개 가능.' },
    { q: '`GRANT SELECT ON EMP TO A WITH GRANT OPTION` 후 A 가 B 에게 같은 권한을 주었다. 이제 원 부여자가 A 의 권한을 REVOKE 하면 B 는?', hint: '객체 권한의 연쇄 회수', answer: 'B 의 SELECT 권한도 함께 회수된다(객체 권한 WITH GRANT OPTION).' }
  ],
  quiz: [
    { q: '다음 중 테이블의 구조는 그대로 두고 모든 데이터만 삭제하는 DDL 은?', choices: ['DELETE', 'DROP', 'TRUNCATE', 'ALTER'], answer: 2, explain: 'TRUNCATE 는 DDL 이며 모든 행을 삭제합니다. DELETE 는 DML, DROP 은 구조까지 삭제.' },
    { q: 'PRIMARY KEY 제약조건의 특징으로 옳은 것은?', choices: ['NULL 을 허용하고 중복을 허용한다', 'UNIQUE 와 NOT NULL 을 함께 만족하며 테이블당 하나만 둘 수 있다', '여러 개 만들 수 있다', 'DEFAULT 값이 필수다'], answer: 1, explain: 'PK = UNIQUE + NOT NULL. 한 테이블에 하나(복합 키 가능)입니다.' },
    { q: '`CREATE TABLE T2 AS SELECT * FROM T1` 에서 T2 로 복사되지 않는 것은?', choices: ['데이터', 'NOT NULL 제약조건', 'PRIMARY KEY 제약조건', '컬럼 이름'], answer: 2, explain: 'CTAS 는 데이터와 NOT NULL 만 복사하고 PK 등 나머지 제약조건은 복사하지 않습니다.' },
    { q: 'FOREIGN KEY 에 `ON DELETE CASCADE` 를 지정하고 부모 행을 삭제하면?', choices: ['삭제가 거부된다', '자식 행이 NULL 로 바뀐다', '참조하는 자식 행도 함께 삭제된다', '오류 없이 아무 일도 없다'], answer: 2, explain: 'CASCADE 는 부모 삭제 시 자식도 연쇄 삭제합니다. NULL 로 바꾸는 것은 ON DELETE SET NULL.' },
    { q: 'DCL 에 해당하지 않는 것은?', choices: ['GRANT', 'REVOKE', 'COMMIT', 'GRANT ... TO ROLE 부여'], answer: 2, explain: 'COMMIT 은 TCL 입니다. GRANT/REVOKE 가 DCL.' },
    { q: '`WITH GRANT OPTION` 으로 객체 권한을 받은 사용자 A 가 B 에게 권한을 재부여했다. 원 부여자가 A 의 권한을 REVOKE 하면 B 의 권한은?', choices: ['남아 있다', '함께 회수된다', '읽기 전용으로 바뀐다', '오류로 REVOKE 가 거부된다'], answer: 1, explain: '객체 권한에서는 연쇄 회수됩니다.' },
    { q: '여러 권한을 묶어 이름을 붙여 사용자에게 한꺼번에 부여할 수 있게 하는 객체는?', accept: ['ROLE', 'role', '롤', '역할'], explain: 'ROLE 은 권한 묶음으로, 사용자에게 롤을 부여하면 권한 관리가 쉬워집니다.' },
    { q: '같은 사용자(스키마) 안에서 테이블 이름에 대한 규칙으로 옳은 것은?', choices: ['예약어를 테이블 이름으로 쓸 수 있다', '같은 이름의 테이블을 둘 수 있다', '문자로 시작해야 한다', '숫자로 시작해도 된다'], answer: 2, explain: '테이블 이름은 문자로 시작해야 하고 예약어는 불가하며 같은 사용자 안에서 중복될 수 없습니다.' },
    { q: 'CHAR(5) 컬럼에 \'AB\' 를 저장했을 때의 설명으로 옳은 것은?', choices: ['2 바이트만 저장된다', '뒤를 공백으로 채워 5 바이트가 저장된다', '앞을 0 으로 채운다', 'NULL 로 저장된다'], answer: 1, explain: 'CHAR 는 고정 길이라 남는 부분을 공백으로 채웁니다.' }
  ]
},

/* ======================= 16 ======================= */
{
  id: 'sq-16', unit: '5부. 실전', title: '실전 모의고사 ① — 모델링 + SQL 기본', time: '40분',
  summary: '시험과 같은 구성(모델링 약 20% + SQL 80%)으로 20문제를 푼다. 틀린 문제는 자동으로 오답노트에 쌓이니 복습(🔁)으로 약점을 줄이자. 80% 이상이면 이 레슨이 완료된다.',
  goals: ['실제 시험처럼 시간을 재며 결과 예측 문제를 푼다', '틀린 유형(NULL·조인·그룹·실행 순서)을 오답노트로 정리한다', '자주 틀리는 함정을 점검표로 되짚는다'],
  terms: [
    { t: '결과 예측 문제', d: '쿼리와 테이블이 주어지고 **실행 결과(행 수·값)** 를 묻는 문제. SQLD 2과목의 핵심 유형.' },
    { t: '오답노트', d: '틀린 문제를 모아 1·3·7·14일 간격으로 다시 풀게 하는 이 앱의 복습 기능.' }
  ],
  sections: [
    { h: '풀기 전에', md: [
      '- **공통 테이블**(EMP 8행, DEPT 3행)은 SQL 기본 레슨의 표를 보세요. 이번 모의고사의 모든 쿼리는 그 데이터를 기준으로 합니다. 막히면 표를 보고 **한 행씩 손으로** 계산하는 연습이 중요합니다.',
      '- 시간 목표: 20문제 **30분**(실전은 문항당 약 1.8분). 시험장에서는 계산기를 쓸 수 없습니다.',
      '- 확신이 없으면 소거법으로 보기를 줄이고 표시한 뒤 넘어가세요.'] },
    { h: '시험 직전 체크리스트: 이것만은 반드시', md: [
      '**NULL**',
      '- `= NULL` 은 UNKNOWN(아무 행도 안 나옴) → `IS NULL`. `NULL + 1` = NULL. `COUNT(*)` 만 NULL 행을 센다. `AVG` 는 NULL 을 분모에서도 뺀다.',
      '- Oracle: `\'\'` = NULL. 정렬: Oracle ASC 에서 NULL 맨 뒤 / SQL Server ASC 에서 맨 앞.',
      '- `NOT IN (…NULL…)` 은 0건. `NVL2(a,b,c)`: a 가 NOT NULL 이면 b. `NULLIF(a,b)`: 같으면 NULL. `CASE x WHEN NULL` 은 안 걸림.',
      '**실행 순서**: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY (WHERE 에 별칭·집계 ✗, ORDER BY 에 별칭 ✓).',
      '**조인**: INNER 는 짝 있는 행만, LEFT 는 왼쪽 보존, WHERE 로 오른쪽 조건을 걸면 INNER 처럼 변함, N 개 테이블 = 조건 N−1 개, 별칭을 붙이면 원래 테이블명 ✗.',
      '**Oracle ↔ SQL Server**: `||` ↔ `+`, `NVL` ↔ `ISNULL`, `SUBSTR` ↔ `SUBSTRING`, `LENGTH` ↔ `LEN`, `SYSDATE` ↔ `GETDATE()`, `MINUS` ↔ `EXCEPT`, `ROWNUM`/`FETCH` ↔ `TOP`, `DUAL` 필요 ↔ 불필요.'] }
  ],
  misconceptions: [
    { wrong: '"결과 예측은 쿼리를 한 번 읽으면 바로 답이 보인다."', right: '대부분 **NULL, 조인 짝 없는 행, 동점, 중복 제거** 중 하나가 숨어 있다. 반드시 표에 대입해 한 행씩 계산한다.', why: '출제자는 "직관으로 읽으면 틀리는 지점"을 일부러 만듭니다.' },
    { wrong: '"모의고사는 점수만 보면 된다."', right: '점수보다 **틀린 이유 유형**이 중요하다. 오답노트에서 NULL/조인/그룹/윈도우 중 어디가 약한지 찾아 해당 레슨으로 돌아가라.', why: '같은 유형의 실수를 반복하면 실전에서도 반복됩니다.' }
  ],
  examples: [
    { title: '손으로 푼 답을 실행으로 확인 (DISTINCT 조합)', lang: 'sql', prelude: true, code: R`
SELECT COUNT(*) AS COMBOS FROM (SELECT DISTINCT JOB, DEPTNO FROM EMP);
SELECT COUNT(*) AS LEFT_ROWS FROM EMP E LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO;
SELECT COUNT(COMM) AS C, AVG(COMM) AS A FROM EMP;
`, output: R`
COMBOS
7

LEFT_ROWS
8

C | A
2 | 150
`, notes: ['모의고사의 몇 문제를 직접 실행으로 검산한 예입니다. 문제를 풀 때 먼저 손으로 계산하고, 이렇게 실제로 돌려서 맞는지 확인하는 습관을 들이세요.'] }
  ],
  exercises: [
    { q: '모의고사에서 틀린 문제를 유형별(NULL / 조인 / 그룹 / 함수 / 모델링)로 나누어 개수를 세어 보세요. 가장 많은 유형은?', hint: '오답노트 화면에서 레슨 이름으로 구분', answer: '가장 많은 유형의 레슨을 다시 읽고, 그 레슨의 "흔한 오해 바로잡기"를 중심으로 복습합니다.' }
  ],
  quiz: [
    { q: '다음 중 엔터티로 도출하기에 **부적절한** 것은?', choices: ['사원 (수백 명)', '상품 (수천 종)', '회사명 (값이 하나뿐인 정보)', '주문 (매일 발생)'], answer: 2, explain: '엔터티는 인스턴스가 2개 이상인 집합이어야 합니다. 값이 하나뿐인 회사명은 속성(또는 상수)입니다.' },
    { q: '주문상세(주문번호, 상품번호, 상품명, 수량)에서 PK 는 (주문번호, 상품번호), 상품번호 → 상품명 의 종속이 있다. 이 테이블이 **처음으로 만족하지 못하는** 정규형은?', choices: ['제1정규형', '제2정규형', '제3정규형', 'BCNF'], answer: 1, explain: '속성이 모두 원자값이라 1NF 는 만족하지만, 상품명이 복합키의 일부(상품번호)에만 종속된 부분 함수 종속이라 2NF 를 위반합니다.' },
    { q: '부모 엔터티의 주식별자가 자식 엔터티의 **일반 속성(FK)** 으로 상속되는 관계는?', choices: ['식별 관계', '비식별 관계', '재귀 관계', '배타 관계'], answer: 1, explain: '자식의 주식별자 일부로 상속되면 식별 관계, 일반 속성으로 상속되면 비식별 관계입니다.' },
    { q: '저장 장치를 교체해 물리적 저장 구조가 바뀌어도 개념 스키마와 응용 프로그램은 영향받지 않는다. 이 성질은?', choices: ['논리적 독립성', '물리적 독립성', '무결성', '정규성'], answer: 1, explain: '내부 스키마 변경이 개념 스키마에 영향을 주지 않는 것은 물리적 독립성입니다.' },
    { q: '다음 중 DML 에 속하는 명령어는?', choices: ['CREATE', 'TRUNCATE', 'MERGE', 'GRANT'], answer: 2, explain: 'MERGE 는 DML. CREATE/TRUNCATE 는 DDL, GRANT 는 DCL.' },
    { q: '공통 테이블 기준, 결과는?', code: 'SELECT COUNT(*) FROM EMP\nWHERE COMM IS NULL AND DEPTNO = 10;', lang: 'sql', choices: ['1', '2', '3', '4'], answer: 2, explain: '10번 부서 4명(KIM, LEE, CHOI, JUNG) 중 COMM 이 NULL 인 사원은 CHOI 를 제외한 3명입니다.' },
    { q: '공통 테이블 기준, 결과는? (COMM: 300, 0 외에는 NULL)', code: 'SELECT COUNT(COMM), AVG(COMM) FROM EMP;', lang: 'sql', choices: ['8, 37.5', '2, 150', '2, 37.5', '8, 150'], answer: 1, explain: 'NULL 을 제외하면 값은 2개(300, 0). 평균은 (300+0)/2 = 150.' },
    { q: '공통 테이블 기준, 결과 행 수는?', code: 'SELECT * FROM EMP\nWHERE SAL BETWEEN 1200 AND 2500;', lang: 'sql', choices: ['3', '4', '5', '6'], answer: 1, explain: 'SHIN(1200), CHOI(1500), JUNG(1500), HAN(2500). 양 끝 값을 포함하므로 4행.' },
    { q: '공통 테이블 기준, 결과 행 수는?', code: "SELECT * FROM EMP\nWHERE ENAME LIKE '%O%';", lang: 'sql', choices: ['1', '2', '3', '4'], answer: 1, explain: 'O 가 들어 있는 이름은 CHOI, YOON 두 명입니다.' },
    { q: '공통 테이블 기준, 결과 행 수는?', code: 'SELECT DEPTNO, COUNT(*) FROM EMP\nGROUP BY DEPTNO\nHAVING COUNT(*) >= 3;', lang: 'sql', choices: ['1', '2', '3', '4'], answer: 1, explain: '부서별 인원: 10번 4명, 20번 3명, NULL 1명. 3명 이상인 그룹은 10, 20 → 2행.' },
    { q: '공통 테이블 기준, 결과는?', code: 'SELECT COUNT(*) FROM EMP E\nLEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO;', lang: 'sql', choices: ['7', '8', '9', '24'], answer: 1, explain: 'LEFT JOIN 은 EMP 8행을 모두 보존합니다(SHIN 은 DNAME NULL).' },
    { q: '공통 테이블 기준, 결과는? (SHIN 의 COMM 은 0)', code: "SELECT COALESCE(COMM, SAL, 0) FROM EMP\nWHERE ENAME = 'SHIN';", lang: 'sql', choices: ['0', '1200', 'NULL', '오류'], answer: 0, explain: 'SHIN 의 COMM 은 NULL 이 아니라 0 입니다. COALESCE 는 첫 NULL 이 아닌 값 0 을 반환합니다.' },
    { q: '공통 테이블 기준, CHOI 에 대한 결과는? (CHOI: SAL 1500)', code: "SELECT NULLIF(SAL, 1500) FROM EMP\nWHERE ENAME = 'CHOI';", lang: 'sql', choices: ['1500', '0', 'NULL', '오류'], answer: 2, explain: 'NULLIF(a, b) 는 a 와 b 가 같으면 NULL 을 반환합니다.' },
    { q: '공통 테이블 기준, 결과 행 수는?', code: 'SELECT DISTINCT JOB, DEPTNO FROM EMP;', lang: 'sql', choices: ['5', '6', '7', '8'], answer: 2, explain: '(PRESIDENT,10), (MANAGER,10), (MANAGER,20), (SALESMAN,10), (ANALYST,20), (CLERK,20), (CLERK,NULL) = 7 조합. DISTINCT 는 조합 기준이고 NULL 도 하나의 값으로 봅니다.' },
    { q: '다음 중 **오류가 나는** 쿼리는?', choices: ['SELECT SAL * 12 AS A FROM EMP ORDER BY A', 'SELECT SAL * 12 AS A FROM EMP WHERE A > 1000', 'SELECT DEPTNO, COUNT(*) FROM EMP GROUP BY DEPTNO', "SELECT ENAME FROM EMP WHERE ENAME LIKE 'K%'"], answer: 1, explain: 'WHERE 는 SELECT 보다 먼저 실행되어 별칭 A 를 알지 못합니다. ORDER BY 에서는 별칭을 쓸 수 있습니다.' },
    { q: 'Oracle 에서 다음 결과는?', code: "SELECT SUBSTR('ABCDEFG', 3, 2) FROM DUAL;", lang: 'sql', accept: ['CD'], explain: '3번째 문자 C 부터 2글자 → CD.' },
    { q: 'Oracle 에서 `SELECT COMM FROM EMP ORDER BY COMM DESC` 의 **첫 번째 행**은?', choices: ['300', '0', 'NULL', '오류'], answer: 2, explain: 'Oracle 은 NULL 을 가장 큰 값으로 보므로 내림차순에서 NULL 이 맨 앞에 옵니다.' },
    { q: '공통 테이블 기준, 실행 결과는?', code: "SELECT ENAME FROM EMP\nWHERE SAL = (SELECT SAL FROM EMP WHERE JOB = 'CLERK');", lang: 'sql', choices: ['YOON', 'SHIN', 'YOON, SHIN', '오류 (서브쿼리가 2행을 반환)'], answer: 3, explain: 'CLERK 은 YOON(1000), SHIN(1200) 두 명이라 서브쿼리가 2행을 반환하고, 단일행 연산자 `=` 와 맞지 않아 오류입니다.' },
    { q: '공통 테이블 기준, 결과 행 수는?', code: 'SELECT * FROM DEPT\nWHERE DEPTNO NOT IN (SELECT DEPTNO FROM EMP);', lang: 'sql', choices: ['0', '1', '2', '3'], answer: 0, explain: 'EMP.DEPTNO 에 NULL(SHIN)이 있어 NOT IN 결과가 항상 UNKNOWN → 0건입니다. 의도대로 HR 을 찾으려면 NOT EXISTS.' },
    { q: '공통 테이블 기준, 결과는?', code: "SELECT COUNT(*) FROM EMP E\nJOIN DEPT D ON E.DEPTNO = D.DEPTNO\nWHERE D.DNAME = 'DEV';", lang: 'sql', choices: ['2', '3', '4', '7'], answer: 1, explain: 'DEV(20번) 부서 사원은 PARK, HAN, YOON 3명입니다.' }
  ]
},

/* ======================= 17 ======================= */
{
  id: 'sq-17', unit: '5부. 실전', title: '실전 모의고사 ② — SQL 활용 + 관리 구문', time: '45분',
  summary: '집합 연산자, ROLLUP/CUBE, 윈도우 함수, Top N, 계층형 질의, 트랜잭션, DDL/DCL 을 섞은 20문제. 결과 예측과 용어 구분을 시험과 같은 난이도로 점검한다.',
  goals: ['고급 SQL 의 결과 행 수·값을 손으로 계산한다', 'Oracle / SQL Server 문법 차이를 정확히 고른다', '트랜잭션·DDL·DCL 의 동작을 추적한다'],
  terms: [
    { t: '행 수 세기 전략', d: '복잡한 쿼리는 **어떤 그룹/조합이 몇 개 생기는지**를 먼저 세고 값은 나중에 계산한다. (ROLLUP/CUBE/UNION 결과 행 수 문제에 특히 유효)' }
  ],
  sections: [
    { h: '시험 직전 체크리스트 (활용·관리 구문)', md: [
      '**집합 연산자**: UNION(중복 제거) / UNION ALL(유지) / INTERSECT / MINUS(=EXCEPT). 컬럼 수·타입 일치, ORDER BY 는 마지막 한 번, NULL 은 같은 값으로 중복 판정.',
      '**그룹 함수**: ROLLUP(A,B) = (A,B)+(A)+전체 · CUBE(A,B) = 4가지 조합 · GROUPING SETS = 지정한 조합만 · GROUPING()=1 이면 소계의 NULL.',
      '**윈도우**: RANK(건너뜀) / DENSE_RANK(연속) / ROW_NUMBER(고유). 윈도우 함수는 SELECT·ORDER BY 에서만. ORDER BY 있는 기본 윈도우 = RANGE UNBOUNDED PRECEDING ~ CURRENT ROW.',
      '**Top N**: ROWNUM 은 정렬 전에 부여 → 정렬된 인라인 뷰 바깥에서 사용. `ROWNUM = 2`, `> 1` 은 결과 없음. SQL Server `TOP n [WITH TIES]`.',
      '**계층형**: START WITH(루트) · CONNECT BY PRIOR(PRIOR 쪽이 부모) · LEVEL(루트=1) · ORDER SIBLINGS BY. SQL Server 는 재귀 CTE.',
      '**DML/TCL/DDL/DCL**: DELETE(DML, 롤백 O) / TRUNCATE·DROP(DDL, 자동 커밋). DDL·DCL 은 자동 커밋. SAVEPOINT + ROLLBACK TO 추적. PK = UNIQUE + NOT NULL. CTAS 는 NOT NULL 만 복사. 객체 권한 WITH GRANT OPTION 은 연쇄 회수.'] }
  ],
  misconceptions: [
    { wrong: '"고급 문법 문제는 문법을 외워야만 풀 수 있다."', right: '대부분 **개념(어떤 그룹이 생기는가, 어떤 순서로 실행되는가)** 으로 풀 수 있다. 문법은 보기에 힌트로 나온다.', why: '행 수 세기와 "첫 번째로 필터되는 단계" 찾기에 집중하세요.' }
  ],
  examples: [
    { title: '검산: UNION / ROLLUP 행 수를 UNION ALL 로 확인', lang: 'sql', prelude: true, code: R`
SELECT COUNT(*) AS UNION_CNT FROM (SELECT DEPTNO FROM EMP UNION SELECT DEPTNO FROM DEPT);
SELECT COUNT(*) AS UNION_ALL_CNT FROM (SELECT DEPTNO FROM EMP UNION ALL SELECT DEPTNO FROM DEPT);
SELECT COUNT(*) AS INTERSECT_CNT FROM (SELECT DEPTNO FROM EMP INTERSECT SELECT DEPTNO FROM DEPT);
`, output: R`
UNION_CNT
4

UNION_ALL_CNT
11

INTERSECT_CNT
2
`, notes: ['UNION 4, UNION ALL 11, INTERSECT 2. 이런 숫자를 손으로 먼저 예측해 본 뒤 확인하세요.'] }
  ],
  exercises: [
    { q: '모의고사 ① 과 ② 를 합쳐 틀린 문제를 레슨별로 묶어 보고, 가장 약한 레슨 하나를 골라 흔한 오해 섹션만 다시 읽어 보세요.', hint: '오답노트 화면 활용', answer: '약한 레슨의 오해 섹션을 읽은 뒤 해당 퀴즈를 다시 풀어 80% 이상이 되는지 확인합니다.' }
  ],
  quiz: [
    { q: '공통 테이블 기준, 결과 행 수는?', code: 'SELECT DEPTNO FROM DEPT\nUNION ALL\nSELECT DEPTNO FROM EMP;', lang: 'sql', choices: ['3', '8', '10', '11'], answer: 3, explain: 'UNION ALL 은 중복을 유지하므로 DEPT 3행 + EMP 8행 = 11행.' },
    { q: '공통 테이블 기준, 결과 행 수는? (DEPT: 10,20,30 / EMP: 10×4, 20×3, NULL×1)', code: 'SELECT DEPTNO FROM EMP\nUNION\nSELECT DEPTNO FROM DEPT;', lang: 'sql', choices: ['3', '4', '5', '11'], answer: 1, explain: '중복 제거 후 NULL, 10, 20, 30 → 4행. 집합 연산의 중복 판정에서 NULL 은 같은 값으로 취급됩니다.' },
    { q: '공통 테이블 기준, 결과는? (Oracle)', code: 'SELECT DEPTNO FROM DEPT\nMINUS\nSELECT DEPTNO FROM EMP;', lang: 'sql', choices: ['10', '20', '30', '결과 없음'], answer: 2, explain: 'DEPT 에는 있고 EMP 에는 없는 30 만 남습니다.' },
    { q: '`GROUP BY ROLLUP(DEPTNO, JOB)` 의 결과 행 수는? (DEPTNO NOT NULL 인 7명 기준: 부서-직무 조합 6개, 부서 2개)', choices: ['6', '8', '9', '14'], answer: 2, explain: '(DEPTNO, JOB) 6행 + DEPTNO 소계 2행 + 총계 1행 = 9행.' },
    { q: '`GROUP BY CUBE(DEPTNO, JOB)` 의 결과 행 수는? (부서-직무 조합 6개, 부서 2개, 직무 5종류)', choices: ['9', '12', '14', '16'], answer: 2, explain: '상세 6 + 부서 소계 2 + 직무 소계 5 + 총계 1 = 14행.' },
    { q: '`GROUP BY GROUPING SETS (DEPTNO, JOB)` 의 결과 행 수는? (부서 2개, 직무 5종류)', accept: ['7'], explain: '(DEPTNO) 2행 + (JOB) 5행 = 7행. 총계는 지정하지 않았으므로 없습니다.' },
    { q: '점수가 [100, 90, 90, 80] 일 때 마지막 점수 80 의 `DENSE_RANK() OVER (ORDER BY 점수 DESC)` 값은?', choices: ['2', '3', '4', '5'], answer: 1, explain: 'DENSE_RANK 는 동점 뒤에도 순위를 건너뛰지 않아 100→1, 90→2, 80→3. (RANK 라면 4)' },
    { q: '공통 테이블 기준, SHIN 의 순위는?', code: 'SELECT ENAME,\n  RANK() OVER (ORDER BY SAL DESC) RK\nFROM EMP;', lang: 'sql', choices: ['6', '7', '8', '5'], answer: 1, explain: '급여 내림차순: 5000, 3000, 2800, 2500, 1500, 1500, 1200(SHIN), 1000. 1500 이 공동 5위라 SHIN 은 7위입니다.' },
    { q: '공통 테이블 기준, 입사일 순으로 HAN 의 LAG(SAL) 값은? (입사 순서: KIM, LEE, PARK, HAN, CHOI, JUNG, YOON, SHIN)', code: 'SELECT ENAME,\n  LAG(SAL) OVER (ORDER BY HIREDATE) P\nFROM EMP;', lang: 'sql', choices: ['3000', '2800', '2500', '1500'], answer: 1, explain: 'HAN 바로 앞 입사자는 PARK(2800) 입니다.' },
    { q: 'Oracle 에서 `SELECT * FROM EMP WHERE ROWNUM = 2` 의 결과 행 수는?', choices: ['0', '1', '2', '오류'], answer: 0, explain: '첫 행이 ROWNUM 1 을 받고 `= 2` 에 불합격하면 다음 행이 다시 ROWNUM 1 이 되므로 영원히 2 가 될 수 없어 0건입니다.' },
    { q: '계층형 질의에서 LEVEL 이 3 인 사원은 몇 명인가? (KIM → LEE, PARK → CHOI, JUNG(LEE 부하), HAN, YOON, SHIN(PARK 부하))', code: 'SELECT LEVEL, ENAME FROM EMP\nSTART WITH MGR IS NULL\nCONNECT BY PRIOR EMPNO = MGR;', lang: 'sql', choices: ['2', '3', '5', '8'], answer: 2, explain: '루트 KIM 이 LEVEL 1, LEE·PARK 가 2, 그 부하 5명(CHOI, JUNG, HAN, YOON, SHIN)이 LEVEL 3 입니다.' },
    { q: '`START WITH ENAME = \'YOON\' CONNECT BY EMPNO = PRIOR MGR` 의 결과 행 수는? (YOON → 상사 PARK → 상사 KIM)', choices: ['1', '2', '3', '8'], answer: 2, explain: 'PRIOR 가 MGR 쪽이라 자식→부모로 올라갑니다. YOON, PARK, KIM 의 3행.' },
    { q: '다음 순서로 실행한 뒤 COMMIT 했을 때 T 에 남는 행 수는? `INSERT 1; SAVEPOINT S1; INSERT 2; SAVEPOINT S2; INSERT 3; ROLLBACK TO S1; INSERT 4;`', accept: ['2'], explain: 'S1 로 롤백하면 2, 3 이 취소되고 1, 4 가 남습니다 → 2행.' },
    { q: 'Oracle 에서 `INSERT ...; CREATE TABLE X(...); ROLLBACK;` 를 차례로 실행하면 앞의 INSERT 는?', choices: ['취소된다', '확정되어 취소되지 않는다', '오류가 난다', 'CREATE 만 취소된다'], answer: 1, explain: 'DDL(CREATE TABLE)이 자동 COMMIT 되므로 앞선 INSERT 가 확정되어 ROLLBACK 해도 되돌릴 수 없습니다.' },
    { q: 'Oracle 에서 ROLLBACK 으로 복구할 수 **있는** 작업은?', choices: ['TRUNCATE TABLE T', 'DROP TABLE T', 'DELETE FROM T', 'GRANT SELECT ON T TO U'], answer: 2, explain: 'DELETE 는 DML 이라 COMMIT 전이면 롤백 가능. 나머지는 DDL/DCL 로 자동 커밋됩니다.' },
    { q: '`ON DELETE CASCADE` FK 에서 부모 행을 삭제했을 때 참조하던 자식 행은?', choices: ['그대로 남는다', 'FK 가 NULL 로 바뀐다', '함께 삭제된다', '삭제가 거부된다'], answer: 2, explain: 'CASCADE 는 부모 삭제를 자식에게 연쇄 전파합니다.' },
    { q: '`GRANT SELECT ON EMP TO A WITH GRANT OPTION` 후 A 가 B 에게 부여했다. 원 부여자가 A 의 권한을 REVOKE 하면 B 의 권한은?', choices: ['유지', '함께 회수', '읽기만 유지', '오류'], answer: 1, explain: '객체 권한의 WITH GRANT OPTION 은 REVOKE 가 연쇄됩니다.' },
    { q: '다음 SQL 의 결과로 알맞은 것은? (PIVOT 과 같은 조건부 집계)', code: "SELECT DEPTNO,\n  SUM(CASE WHEN JOB='CLERK' THEN SAL END) C\nFROM EMP WHERE DEPTNO IS NOT NULL\nGROUP BY DEPTNO ORDER BY DEPTNO;", lang: 'sql', choices: ['10 → 0, 20 → 1000', '10 → NULL, 20 → 1000', '10 → 1000, 20 → NULL', '10 → NULL, 20 → NULL'], answer: 1, explain: '10번 부서에는 CLERK 이 없어 CASE 가 모두 NULL → SUM 도 NULL. 20번은 YOON(1000)만 해당.' },
    { q: '공통 테이블 기준, 결과는?', code: 'SELECT COUNT(*) FROM DEPT D\nWHERE EXISTS (SELECT 1 FROM EMP E\n              WHERE E.DEPTNO = D.DEPTNO);', lang: 'sql', choices: ['1', '2', '3', '8'], answer: 1, explain: '사원이 있는 부서는 10(SALES), 20(DEV) 두 개입니다. HR(30)은 사원이 없어 제외.' }
  ]
}

);
})();
