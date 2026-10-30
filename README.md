# 📘 독학 스터디

프로그래밍 기초를 **오해 없이, 순서대로** 독학하기 위한 로컬 학습 앱입니다.
설치할 것 없이 `index.html` 을 열면 됩니다 (또는 `start.bat` 더블클릭).

## 커리큘럼 (총 46강)

| 순서 | 트랙 | 강의 | 핵심 |
|---|---|---|---|
| 1 | 🐍 Python 기초 | 10강 | 변수 → 조건/반복 → 리스트/딕셔너리 → 함수 → 파일/예외 → 클래스 |
| 2 | ⚙️ C++ 기초 | 10강 | 컴파일 모델 → 타입/메모리 → 함수/참조 → 포인터 → RAII/스마트 포인터 → 클래스 → 상속/다형성 → STL |
| 3 | ☕ Java 기초 | 8강 | JVM → 타입/String → 배열 → 객체/참조 → 상속/인터페이스 → 컬렉션 → 예외 → 람다/스트림 |
| 4 | 🗄️ SQLD 자격증 | 18강 | 시험 안내 → 데이터 모델링(과목1, 4강) → SQL 기본(SELECT·함수·WHERE·GROUP BY·조인) → SQL 활용(서브쿼리·집합/그룹 함수·윈도우·계층형·PIVOT·정규식) → 관리 구문(DML·TCL·DDL·DCL) → 실전 모의고사 2회 |

**SQLD 트랙**은 한국데이터산업진흥원 SQL 개발자 필기시험(50문항·90분·60점 합격, 과목별 40% 미만 과락) 출제범위를 기준으로 합니다. 시험 일정·응시료는 바뀔 수 있으니 dataq.or.kr 공고를 확인하세요. 문제는 기출 경향을 반영해 **새로 만든 것**이며 실제 기출문제 복원본이 아닙니다. **SQLP 는 SQLD 합격 후 별도 과정**이라 이 트랙에 포함하지 않았습니다.

**왜 C 가 아니라 C++ 인가?** 일반 소프트웨어(게임·금융·자율주행·로봇·AI 추론 엔진) 채용이 넓고, 포인터/메모리 개념은 C 와 공통이라 나중에 임베디드(C)로 가기 쉽습니다.

**예정(로드맵 화면에도 표시)**: 자료구조·알고리즘 → Git/리눅스 → **임베디드(C)** → **로봇(ROS2)** → **AI/ML**

## 레슨의 구성 (모든 레슨 동일)

1. 🎯 이 레슨이 끝나면 (학습 목표)
2. 📖 먼저 알아둘 용어 — 정의를 정확히
3. 본문 설명
4. ⚠ **흔한 오해 바로잡기** — ❌오해 / ✅실제 / 이유 (오해 방지의 핵심)
5. 💻 코드로 확인하기 — 실행 결과 포함
6. ✍ 직접 해보기 — 힌트와 예시 답안
7. ✅ 확인 퀴즈 — 80% 이상이면 레슨 완료

## 공부 방법 (추천)

1. 레슨 읽기 → **예제는 눈으로만 보지 말고 직접 쳐서 실행**
2. "직접 해보기" 풀기 (예시 답안은 풀어본 뒤에)
3. 퀴즈 → 틀린 문제는 자동으로 **오답노트**에 저장
4. 매일 **🔁 복습** 먼저: 틀린 문제가 1·3·7·14일 간격으로 다시 나옴 (5번 연속 맞히면 정복)

진도는 브라우저에 저장됩니다. **⚙ 설정·백업** 에서 백업 파일을 저장해 두세요.

## 폰·PC 동기화 (GitHub Gist, 선택)

GitHub 토큰을 한 번 넣으면 기기 간 진도(이어서 학습하기, 완료 레슨, 오답노트)가 합쳐집니다.

1. https://github.com/settings/tokens/new?scopes=gist&description=study-sync 에서 **classic 토큰**을 만듭니다. 권한은 **gist 하나만**, 만료일은 90일 등으로 설정합니다.
2. 앱의 **⚙ 설정·백업 → 기기 간 동기화**에 토큰(`ghp_…`)을 붙여 넣고 **연결**합니다. 계정에 비공개 Gist 가 하나 생깁니다.
3. 다른 기기에서도 같은 토큰으로 연결하면 끝입니다.

- 토큰은 그 기기 브라우저에만 저장되고 백업 파일에는 들어가지 않습니다. 의심되면 GitHub 에서 토큰을 삭제하면 즉시 무효가 됩니다.
- 병합 규칙은 `js/merge.js` 에 있고 `node tools/test-merge.js` 로 테스트합니다.

## 준비물

- Python: python.org 에서 3.10 이상
- C++: g++ (Windows 는 MSYS2 의 mingw-w64 또는 Visual Studio Build Tools). 어려우면 godbolt.org / onlinegdb.com 으로 시작
- Java: JDK 17 이상 (Temurin)
- 편집기: VS Code 추천

## 폴더 구조

```
index.html          앱 진입점
css/style.css       디자인 (다크 모드 자동)
js/app.js           앱 엔진 (화면, 퀴즈, 오답노트/복습, 진도 저장, Gist 동기화)
js/merge.js         두 기기의 진도를 합치는 순수 함수 (tools/test-merge.js 로 테스트)
content/            ← 강의 내용. 여기만 고치면 됨
  roadmap.js        예정 트랙 목록
  python.js  cpp-1.js  cpp-2.js  java.js
  sqld-1.js ~ sqld-4.js   SQLD (시험 안내+모델링 / SQL 기본 / SQL 활용 / 관리 구문+모의고사)
tools/verify.js     콘텐츠 검증 (구조 + 예제 코드를 실제 실행해 출력 비교)
tools/sqlrun.py     SQL 예제 실행기 (SQLite). Oracle 함수 일부(NVL, DECODE, REGEXP_* 등)는 흉내
tools/fill-sql.js   SQL 예제의 `output: '@@'` 를 실제 실행 결과로 채움
tools/test-merge.js 기기 간 동기화 병합 규칙 테스트
```

## 내용 추가/수정

레슨은 `content/*.js` 의 객체입니다. 기존 레슨을 복사해 `id`, `title`, 본문, `quiz` 를 바꾸면 됩니다.
새 트랙 파일을 만들면 `index.html` 의 `<script src="content/...">` 목록에 추가하세요.

- 본문은 줄 단위 배열 (`**굵게**`, `` `코드` ``, `- 목록`, 표, 코드 펜스 지원)
- 퀴즈: 객관식 `{q, choices, answer, explain}` / 주관식 `{q, accept:[...], explain}`

수정 후 반드시 검증:

```bash
node tools/verify.js            # 전체
node tools/verify.js python     # 한 트랙만
```

구조 오류(정답 인덱스 등)를 잡고, 예제의 `output` 이 실제 실행 결과와 같은지 확인합니다.
**C++ 예제는 g++ 또는 clang++ 가 설치되어 있어야 검증됩니다** (없으면 "미검증"으로 표시하고 건너뜀).
**SQL 예제는 Python 내장 SQLite 로 실행**합니다. SQLite 에 없는 Oracle 전용 문법(ROLLUP/CUBE, CONNECT BY, ROWNUM, PIVOT, `(+)`, ANY/ALL 등)은 `noverify: true` 로 표시하고, 출력은 같은 의미의 표준 SQL 을 SQLite 로 계산한 값을 옮겼습니다. 새 SQL 예제는 `output: '@@'` 로 두고 `node tools/fill-sql.js content/sqld-N.js` 를 실행하면 실행 결과가 채워집니다.
