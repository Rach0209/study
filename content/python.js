/* Python 기초 트랙
 * 작성 규칙: 설명(md)은 줄 단위 배열, 코드는 R`...`(String.raw), 인라인 코드는 `백틱`.
 * examples[].output 은 tools/verify.js 가 실제로 실행해서 검증합니다.
 */
(() => {
const R = String.raw;
const fence = (lang, src) => '```' + lang + '\n' + src.replace(/^\n|\n$/g, '') + '\n```';

window.STUDY_TRACKS = window.STUDY_TRACKS || [];
window.STUDY_TRACKS.push({
  id: 'python', order: 1, title: 'Python 기초', icon: '🐍', color: '#3776ab', level: '입문',
  desc: '프로그래밍이 처음이어도 OK. 변수부터 클래스까지, 가장 읽기 쉬운 언어로 "프로그래밍 사고"를 만든다.',
  prereq: '없음 (컴퓨터를 켤 수 있으면 충분)',
  setup: 'Python 3.10 이상 (python.org) + 메모장보다 나은 편집기 (VS Code 추천)',
  lessons: [

/* ======================= 1 ======================= */
{
  id: 'py-01', unit: '1부. 기본 문법', title: '프로그램과 첫 실행', time: '30분',
  summary: '프로그램은 "위에서 아래로 차례대로 실행되는 명령 목록"이고, Python 인터프리터가 그것을 읽어 실행한다.',
  goals: ['`.py` 파일을 만들어 실행할 수 있다', '`print` 와 주석을 쓸 수 있다', '오류 메시지(Traceback)를 읽고 문제 줄을 찾을 수 있다'],
  terms: [
    { t: '소스 코드', d: '사람이 쓴 프로그램 글. Python 에서는 `.py` 파일.' },
    { t: '인터프리터', d: '소스 코드를 읽어서 그 명령을 실행해 주는 프로그램. Python 을 설치하면 `python` 명령으로 들어 있다.' },
    { t: '함수 호출', d: '`print("hi")` 처럼 `이름(값)` 형태로 미리 만들어진 기능을 실행하는 것. 괄호 안의 값을 **인자(argument)** 라고 한다.' },
    { t: '문자열(str)', d: '따옴표로 감싼 글자들. `"hello"` 또는 `\'hello\'`.' }
  ],
  sections: [
    { h: '프로그램이란?', md: [
      'CPU 는 0과 1로 된 **기계어**만 직접 실행합니다. 사람이 기계어를 직접 쓰기는 어려우니, 읽기 쉬운 언어로 적고 그것을 번역·실행해 주는 도구를 사용합니다.',
      '프로그램은 **명령을 순서대로 적어 둔 것**입니다. 특별한 지시(조건문·반복문·함수 호출)가 없으면 **위에서 아래로 한 줄씩** 실행됩니다.'] },
    { h: 'Python 은 어떻게 실행되나', md: [
      '터미널에서 `python hello.py` 를 입력하면 인터프리터가 파일을 읽고, 내부적으로 **바이트코드**로 번역한 뒤 **가상 머신**이 그것을 실행합니다. 사용자는 별도의 "컴파일 명령"을 치지 않기 때문에 "바로 실행된다"고 느낍니다.',
      '| 실행 방법 | 명령 | 용도 |', '|---|---|---|',
      '| 파일 실행 | `python hello.py` | 실제 프로그램 (Windows 에서 안 되면 `py hello.py`) |',
      '| 대화형 모드 | `python` | 한 줄씩 입력하며 실험 (종료: `exit()`) |'] },
    { h: 'print 와 주석', md: [
      '`print(값, 값, ...)` 은 값을 화면에 출력합니다. 값이 여러 개면 **공백**으로 구분해 출력하고, 마지막에 줄바꿈을 합니다.',
      '`#` 부터 그 줄 끝까지는 **주석**입니다. 컴퓨터는 무시하고, 사람에게 설명하는 용도입니다.'] },
    { h: '오류 메시지 읽는 법', md: [
      '오류는 실패가 아니라 **"어디가 왜 틀렸는지 알려 주는 안내문"** 입니다. 읽는 순서는 아래에서 위입니다.',
      fence('', 'Traceback (most recent call last):\n  File "hello.py", line 2, in <module>\n    print(nmae)\nNameError: name \'nmae\' is not defined'),
      '1. **맨 아래 줄**: 오류 종류(`NameError`)와 이유(`nmae` 라는 이름이 정의되지 않음)',
      '2. 그 위: 어느 파일 몇 번째 줄인지 (`line 2`)',
      '대표 오류: `SyntaxError`(문법이 틀려 실행 전에 거부), `NameError`(없는 이름 사용), `TypeError`(자료형이 안 맞는 연산), `IndentationError`(들여쓰기)'] }
  ],
  misconceptions: [
    { wrong: '"Python 은 컴파일을 하지 않는다."', right: '내부적으로 바이트코드로 번역(컴파일)한 뒤 실행한다. 다만 사용자가 따로 컴파일 명령을 치지 않을 뿐이다.', why: '이 차이는 C++ / Java 를 배울 때 "빌드 과정이 눈에 보이는 언어"와 비교하면서 다시 나옵니다.' },
    { wrong: '"`print` 는 값을 계산해서 돌려준다 (결과를 변수에 담을 수 있다)."', right: '`print` 는 화면에 **출력**만 하고 돌려주는 값은 `None` (아무것도 없음)이다.', why: '"화면에 보이는 것"과 "프로그램이 가진 값"은 다릅니다. 8강(함수)에서 `return` 과 `print` 의 차이로 이어집니다.' },
    { wrong: '"오류가 나면 내 컴퓨터/내 실력이 문제다."', right: '오류는 인터프리터가 문제 위치를 알려 주는 정상적인 피드백이다. 맨 아래 줄 → 줄 번호 순으로 읽는다.', why: '개발자의 일상은 오류를 읽고 고치는 일입니다. 읽는 법이 곧 실력입니다.' }
  ],
  examples: [
    { title: '첫 프로그램', lang: 'python', code: R`
# 인사하기 (이 줄은 주석)
print("Hello, World!")
print("1 + 2 =", 1 + 2)
`, output: R`
Hello, World!
1 + 2 = 3
`, notes: ['`"1 + 2 ="` 는 글자 그대로, `1 + 2` 는 **계산된 값 3** 으로 출력됩니다.', '`print` 에 값 두 개를 주면 사이에 공백이 하나 들어갑니다.'] },
    { title: 'print 가 돌려주는 값', lang: 'python', code: R`
result = print("안녕")
print(result)
print(type(result))
`, output: R`
안녕
None
<class 'NoneType'>
`, notes: ['첫 줄에서 "안녕"이 **출력**되고, `result` 에는 `None` 이 들어갑니다.'] }
  ],
  exercises: [
    { q: '`print` 3줄로 자기소개(이름 / 나이 / 좋아하는 것)를 출력하는 `intro.py` 를 만들어 실행해 보세요.', hint: '`print("이름: 홍길동")` 처럼 문자열을 따옴표로 감싸면 됩니다.', answer: fence('python', 'print("이름: 홍길동")\nprint("나이:", 25)\nprint("좋아하는 것: 코딩")') },
    { q: '일부러 오류를 만들어 보세요. ① `print("hi"` (괄호 안 닫기) ② `print(hello)` (따옴표 없이). 각각 오류 종류와 줄 번호를 읽어 보세요.', hint: '①은 실행 자체가 거부되는 `SyntaxError`, ②는 실행 중 발생하는 `NameError` 입니다.', answer: '①은 파일 전체가 실행되기 **전에** 문법 검사에서 걸립니다. ②는 그 줄에 도달했을 때 비로소 발생합니다. 앞줄 `print` 가 먼저 실행된 뒤 오류가 나는 것을 확인해 보세요.' }
  ],
  quiz: [
    { q: 'Python 파일 `hello.py` 를 `python hello.py` 로 실행할 때 일어나는 일로 가장 알맞은 것은?', choices: ['사람이 읽는 코드가 그대로 CPU 에서 실행된다', '인터프리터가 코드를 읽고 내부적으로 번역해 실행한다', '먼저 `.exe` 파일을 반드시 직접 만들어야 한다', '코드는 아래에서 위로 실행된다'], answer: 1, explain: 'CPU 는 기계어만 실행하므로 번역이 필요합니다. Python 은 인터프리터가 이 과정을 대신 해 주며, 코드는 기본적으로 위→아래로 실행됩니다.' },
    { q: '아래 코드를 실행한 뒤 마지막 줄의 출력은?', code: 'x = print("a")\nprint(x)', lang: 'python', choices: ['a', 'None', '오류', '빈 줄'], answer: 1, explain: '첫 줄에서 "a"가 출력되고, `print` 가 돌려주는 값은 `None` 입니다. 그래서 두 번째 줄은 `None` 을 출력합니다. (마지막 줄만 묻는 문제이므로 정답은 None)' },
    { q: 'Traceback 을 읽을 때 가장 먼저 확인해야 할 곳은?', choices: ['맨 위 줄', '맨 아래 줄 (오류 종류와 이유)', '가운데 줄', '읽지 않고 다시 실행'], answer: 1, explain: '맨 아래 줄에 오류 종류와 이유가 있습니다. 그다음 위쪽의 줄 번호로 위치를 찾습니다.' },
    { q: '이 코드의 출력은? (공백까지 정확히)', code: 'print("A", "B")', lang: 'python', accept: ['A B'], explain: '`print` 는 값 사이를 공백 하나로 구분해 출력합니다.' },
    { q: 'Python 에서 `#` 의 역할은?', choices: ['그 줄을 실행한다', '그 뒤부터 줄 끝까지는 주석(실행되지 않음)', '숫자를 표시한다', '오류를 숨긴다'], answer: 1, explain: '`#` 뒤는 사람을 위한 설명이며 실행되지 않습니다. (문자열 안의 `#` 은 그냥 글자입니다.)' }
  ]
},

/* ======================= 2 ======================= */
{
  id: 'py-02', unit: '1부. 기본 문법', title: '변수와 자료형', time: '45분',
  summary: '변수는 값을 담는 "상자"가 아니라 값(객체)에 붙이는 "이름표"이고, 모든 값에는 자료형이 있다.',
  goals: ['변수에 값을 붙이고 다시 붙이는(재할당) 동작을 설명할 수 있다', '`int`, `float`, `str`, `bool` 을 구분한다', '`/`, `//`, `%`, `**` 의 결과를 예측한다'],
  terms: [
    { t: '변수(variable)', d: '값(객체)에 붙인 **이름**. `a = 10` 은 "10 이라는 값에 `a` 라는 이름을 붙여라"라는 뜻이다. (이 연결을 **바인딩**이라 한다)' },
    { t: '자료형(type)', d: '값의 종류. 종류에 따라 할 수 있는 연산이 다르다. 예: 정수 `int`, 실수 `float`, 문자열 `str`, 참/거짓 `bool`.' },
    { t: '할당(assignment)', d: '`=` 로 이름에 값을 붙이는 것. 수학의 "같다"가 아니다.' },
    { t: '리터럴(literal)', d: '코드에 직접 쓴 값. `10`, `3.14`, `"hi"`, `True`.' }
  ],
  sections: [
    { h: '변수 = 이름표', md: [
      '`a = 10` 을 실행하면 메모리에 정수 `10` 이라는 값이 만들어지고, `a` 라는 이름이 그 값을 가리킵니다. `a = 20` 을 하면 `a` 가 **다른 값(20)을 가리키도록 옮겨 붙을 뿐**, 10 이 바뀌는 것이 아닙니다.',
      '정수·문자열 같은 값에서는 "상자"로 생각해도 결과가 같아 보이지만, **리스트(6강)** 에서는 이 차이가 정답과 오답을 가릅니다. 처음부터 "이름표" 모델로 익히세요.'] },
    { h: '기본 자료형', md: [
      '| 자료형 | 예 | 설명 |', '|---|---|---|',
      '| `int` | `42`, `-7` | 정수. 크기 제한이 사실상 없다 |',
      '| `float` | `3.14`, `1e3` | 실수 (소수). **근사값**으로 저장된다 |',
      '| `str` | `"안녕"` | 문자열 |',
      '| `bool` | `True`, `False` | 참/거짓 (대문자로 시작!) |',
      '| `NoneType` | `None` | "값 없음"을 뜻하는 특별한 값 |',
      '`type(값)` 으로 자료형을 확인할 수 있습니다.'] },
    { h: '산술 연산자', md: [
      '| 연산 | 의미 | 예 |', '|---|---|---|',
      '| `+ - *` | 더하기, 빼기, 곱하기 | `3 * 4` → `12` |',
      '| `/` | 나눗셈. **결과는 항상 float** | `7 / 2` → `3.5`, `10 / 2` → `5.0` |',
      '| `//` | 몫 (**내림** 나눗셈) | `7 // 2` → `3`, `-7 // 2` → `-4` |',
      '| `%` | 나머지 | `7 % 2` → `1` |',
      '| `**` | 거듭제곱 | `2 ** 10` → `1024` |',
      '짝수 판별(`n % 2 == 0`), 시계/요일 계산 같은 곳에서 `%` 를 아주 많이 씁니다.'] },
    { h: '형 변환과 변수 이름', md: [
      '`int("3")` → `3`, `str(3)` → `"3"`, `float("2.5")` → `2.5`. 변환할 수 없는 값(`int("abc")`, `int("3.5")`)은 `ValueError` 입니다.',
      '변수 이름: 영문·숫자·`_` 만, 숫자로 시작 불가, 대소문자 구분(`age` ≠ `Age`), 예약어(`if`, `for` ...) 불가. 관례는 `snake_case` (예: `total_score`).'] }
  ],
  misconceptions: [
    { wrong: '"변수는 값을 담아 두는 상자다."', right: '변수는 값에 붙인 이름표다. `b = a` 는 값을 복사하는 것이 아니라 **같은 값에 이름을 하나 더 붙이는 것**이다.', why: '상자 모델로 배우면 6강의 리스트 별칭(alias) 문제를 이해할 수 없게 됩니다.' },
    { wrong: '"`10 / 2` 는 `5` 다."', right: '`/` 는 항상 float 를 돌려주므로 `5.0` 이다. 정수 몫이 필요하면 `//`.', why: '`5` 와 `5.0` 은 값은 같지만 자료형이 다르고, 문자열로 합칠 때나 리스트 인덱스로 쓸 때 결과가 달라집니다.' },
    { wrong: '"`-7 // 2` 는 소수점을 버려서 `-3` 이다."', right: '`//` 는 **내림(floor)** 이라 `-4` 이다. 0 방향으로 버리는 것이 아니다.', why: '"소수점 버림"과 "내림"은 음수에서 갈립니다. (C++ 의 정수 나눗셈은 0 방향으로 버려서 `-3` — 언어마다 다릅니다.)' },
    { wrong: '"`0.1 + 0.2 == 0.3` 은 `True` 다."', right: '`False` 다. 실수는 2진수로 **근사 저장**되어 `0.30000000000000004` 가 된다.', why: '버그가 아니라 컴퓨터 실수 표현(IEEE 754)의 특성입니다. 실수끼리 `==` 비교는 피하고, 차이가 아주 작은지 보는 방식(`abs(a-b) < 1e-9`)을 씁니다.' }
  ],
  examples: [
    { title: '자료형 확인', lang: 'python', code: R`
age = 20
height = 175.5
name = "민수"
is_student = True
print(type(age), type(height), type(name), type(is_student))
`, output: R`
<class 'int'> <class 'float'> <class 'str'> <class 'bool'>
` },
    { title: '연산자 결과 예측해 보기', lang: 'python', code: R`
print(7 / 2)
print(7 // 2)
print(7 % 2)
print(2 ** 10)
print(10 / 2)
print(-7 // 2)
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
`, output: R`
3.5
3
1
1024
5.0
-4
0.30000000000000004
False
`, notes: ['실행하기 전에 각 줄의 결과를 먼저 종이에 적어 보고 맞춰 보세요. 예측 → 확인이 가장 빠른 학습법입니다.'] },
    { title: '재할당 = 이름표를 옮겨 붙이기', lang: 'python', code: R`
a = 10
b = a      # b 도 10 이라는 값에 붙는다
a = 20     # a 만 20 으로 옮겨 붙는다
print(a, b)
`, output: R`
20 10
`, notes: ['`a = 20` 은 `b` 에 영향을 주지 않습니다. 이름표 `a` 만 이동했기 때문입니다.'] }
  ],
  exercises: [
    { q: '`7`, `2` 를 변수에 담고 몫, 나머지, 거듭제곱, 실수 나눗셈 결과를 한 줄씩 출력하세요.', hint: '`//`, `%`, `**`, `/` 를 하나씩 써 보세요.', answer: fence('python', 'a = 7\nb = 2\nprint(a // b)   # 3\nprint(a % b)    # 1\nprint(a ** b)   # 49\nprint(a / b)    # 3.5') },
    { q: '초 단위 `3725` 를 "시간 / 분 / 초"로 나눠 출력하세요. (정답: 1시간 2분 5초)', hint: '3600 으로 `//` 하면 시간, 남은 값(`%`)을 60 으로 다시 `//` 하면 분입니다.', answer: fence('python', 'sec = 3725\nh = sec // 3600\nm = (sec % 3600) // 60\ns = sec % 60\nprint(h, m, s)   # 1 2 5') }
  ],
  quiz: [
    { q: '실행 후 출력은?', code: 'a = 5\nb = a\na = 7\nprint(b)', lang: 'python', choices: ['5', '7', '12', '오류'], answer: 0, explain: '`b = a` 로 `b` 는 5 에 붙었고, 이후 `a = 7` 은 `a` 만 7 로 옮겨 붙입니다. `b` 는 그대로 5 입니다.' },
    { q: '출력은? (공백으로 구분)', code: 'print(9 // 2, 9 % 2)', lang: 'python', accept: ['4 1'], explain: '9 = 2×4 + 1 이므로 몫 4, 나머지 1 입니다.' },
    { q: '`print(10 / 5)` 의 출력은?', choices: ['2', '2.0', '2.5', '오류'], answer: 1, explain: '`/` 는 나누어떨어져도 float 를 돌려줍니다. 정수 몫이 필요하면 `//` 를 쓰세요.' },
    { q: '`print(-7 // 2)` 의 출력을 숫자로 쓰세요.', accept: ['-4'], explain: '`//` 는 내림(floor)입니다. -3.5 를 내림하면 -4.' },
    { q: '"변수"에 대한 설명으로 가장 정확한 것은?', choices: ['값을 담는 상자', '값(객체)에 붙인 이름표', '화면에 출력하는 명령', '자료형의 다른 이름'], answer: 1, explain: 'Python 의 변수는 값에 붙은 이름이며, 재할당은 이름을 다른 값에 옮겨 붙이는 것입니다.' },
    { q: '`int("3.5")` 를 실행하면?', choices: ['3', '4', '3.5', 'ValueError'], answer: 3, explain: '`int()` 는 정수 모양의 문자열만 변환합니다. 소수 문자열은 `float("3.5")` 로 먼저 바꿔야 합니다.' }
  ]
},

/* ======================= 3 ======================= */
{
  id: 'py-03', unit: '1부. 기본 문법', title: '문자열과 입출력', time: '45분',
  summary: '문자열은 바꿀 수 없는(불변) 글자 나열이며, 0부터 번호를 매기고 [시작:끝]으로 잘라 쓴다. input() 은 언제나 문자열을 준다.',
  goals: ['인덱싱·슬라이싱 결과를 정확히 예측한다', 'f-string 으로 값을 끼워 넣는다', '`input()` 으로 받은 값을 숫자로 바꿔 계산한다'],
  terms: [
    { t: '인덱스(index)', d: '순서 번호. **0부터** 시작한다. 음수는 뒤에서부터(`-1` 이 마지막).' },
    { t: '슬라이싱(slicing)', d: '`s[시작:끝:간격]` 으로 일부를 잘라 **새 문자열**을 만드는 것. **끝 번호는 포함하지 않는다.**' },
    { t: '불변(immutable)', d: '만들어진 뒤에 내용을 바꿀 수 없는 성질. 바꾸고 싶으면 새 값을 만들어야 한다.' },
    { t: '메서드(method)', d: '값에 붙은 기능. `"abc".upper()` 처럼 `값.이름()` 으로 호출한다.' }
  ],
  sections: [
    { h: '인덱싱과 슬라이싱', md: [
      '`s = "Python"` 이라면 글자 번호는 `P(0) y(1) t(2) h(3) o(4) n(5)`, 거꾸로는 `n(-1) o(-2) ...` 입니다.',
      '`s[a:b]` 는 **a 번부터 b-1 번까지**입니다. "끝 번호 미포함" 규칙 덕분에 `s[0:2]` 의 길이는 항상 `2 - 0 = 2` 이고, `s[:k] + s[k:] == s` 가 성립합니다.',
      '생략하면 처음/끝: `s[:3]`, `s[3:]`. `s[::-1]` 은 뒤집기.'] },
    { h: '문자열 만들기와 다루기', md: [
      '- f-string: `f"{이름}님 {나이 + 1}살"` — 중괄호 안에 **식**을 쓸 수 있고, `{x:.2f}`(소수 2자리), `{n:,}`(천 단위 쉼표) 같은 서식도 가능합니다.',
      '- 자주 쓰는 메서드: `upper() lower() strip() split(구분자) replace(a, b) find(x) startswith(x)`; 길이는 `len(s)`.',
      '- 메서드는 **원본을 바꾸지 않고 새 문자열을 돌려줍니다.** 결과를 변수에 받아야 합니다.'] },
    { h: '입력: input()', md: [
      '`input("안내문")` 은 사용자가 입력한 한 줄을 **문자열(str)** 로 돌려줍니다. 숫자를 입력해도 마찬가지이므로 계산하려면 `int()` 또는 `float()` 로 바꿔야 합니다.'] }
  ],
  misconceptions: [
    { wrong: '"첫 번째 글자는 `s[1]` 이다."', right: '첫 글자는 `s[0]`. 번호는 "시작점에서 떨어진 거리"이기 때문에 0부터 시작한다.', why: '"몇 번째"(1부터 셈)와 "인덱스"(0부터)를 구분하세요. 이 습관이 반복문의 off-by-one 오류를 막아 줍니다.' },
    { wrong: '"`s[1:4]` 는 1번부터 4번까지 포함한다."', right: '1, 2, 3번 — **4번은 포함되지 않는다.**', why: '끝 번호는 "여기 직전까지"라는 뜻입니다. 길이 = 끝 − 시작.' },
    { wrong: '"`s[0] = \'H\'` 처럼 글자를 바꿀 수 있다."', right: '문자열은 불변이라 `TypeError` 가 난다. `s = "H" + s[1:]` 처럼 새 문자열을 만든다.', why: '`s.upper()` 도 s 를 바꾸지 않고 **새 문자열**을 돌려줍니다.' },
    { wrong: '"`input()` 에 25 를 입력하면 정수 25 다."', right: '문자열 `"25"` 다. `int(input())` 으로 바꿔야 한다.', why: '`"25" + "1"` 은 `"251"`, `int("25") + 1` 은 `26`. 입력 처리 버그 1순위입니다.' }
  ],
  examples: [
    { title: '인덱싱 · 슬라이싱', lang: 'python', code: R`
s = "Python"
print(s[0], s[-1])
print(s[0:2])
print(s[2:])
print(s[::-1])
print(len(s))
`, output: R`
P n
Py
thon
nohtyP
6
` },
    { title: 'f-string 과 메서드', lang: 'python', code: R`
name = "  Alice "
print(name.strip().upper())
print(f"{name.strip()}님, 안녕하세요")
price = 1234.5678
print(f"{price:.2f}")
print(f"{1000000:,}")
print("a,b,c".split(","))
`, output: R`
ALICE
Alice님, 안녕하세요
1234.57
1,000,000
['a', 'b', 'c']
` },
    { title: '입력은 항상 문자열', lang: 'python', stdin: '25\n', code: R`
age = input("나이: ")
print(type(age))
next_age = int(age) + 1
print(f"내년에는 {next_age}살")
`, output: R`
나이: <class 'str'>
내년에는 26살
`, notes: ['입력값 `25` 는 사용자가 키보드로 친 것이라 화면에 따로 출력되지 않았습니다. (위 결과에서 "나이: " 뒤에 바로 이어서 출력됨)'] },
    { title: '문자열은 불변', lang: 'python', code: R`
s = "hello"
t = s.upper()
print(s, t)
try:
    s[0] = "H"
except TypeError as e:
    print("오류:", e)
`, output: R`
hello HELLO
오류: 'str' object does not support item assignment
` }
  ],
  exercises: [
    { q: '이름을 입력받아 `"이름"님 환영합니다!` 형태로 출력하세요. 입력 앞뒤 공백은 제거하세요.', hint: '`input().strip()` 과 f-string.', answer: fence('python', 'name = input("이름: ").strip()\nprint(f"{name}님 환영합니다!")') },
    { q: '문자열 `"racecar"` 가 거꾸로 읽어도 같은지(회문) `True/False` 로 출력하세요.', hint: '`s[::-1]` 과 `==`.', answer: fence('python', 's = "racecar"\nprint(s == s[::-1])   # True') },
    { q: '숫자 두 개를 입력받아 합을 출력하세요. (`"3"`, `"4"` 를 입력하면 `7`, `34` 가 아님)', hint: '`int(input())` 로 각각 변환.', answer: fence('python', 'a = int(input())\nb = int(input())\nprint(a + b)') }
  ],
  quiz: [
    { q: '`s = "Python"` 일 때 `s[1:4]` 는?', choices: ['Pyth', 'yth', 'ytho', 'ython'], answer: 1, explain: '1, 2, 3번 글자 = y, t, h. 4번은 포함하지 않습니다.' },
    { q: '`s = "Python"` 일 때 `s[-2]` 는?', accept: ['o'], explain: '`-1` 이 `n`, `-2` 가 `o` 입니다.' },
    { q: '`type(input())` 의 결과로 가장 알맞은 것은? (사용자가 123 을 입력)', choices: ['int', 'float', 'str', 'bool'], answer: 2, explain: '`input()` 은 항상 문자열을 돌려줍니다.' },
    { q: '출력은?', code: 'print("ab" * 3)', lang: 'python', accept: ['ababab'], explain: '문자열 × 정수는 그 문자열을 반복합니다.' },
    { q: '`print("5" + 5)` 를 실행하면?', choices: ['10', '55', 'TypeError', '5 5'], answer: 2, explain: '문자열과 정수는 `+` 로 합칠 수 없습니다. 의도에 따라 `int("5") + 5`(=10) 또는 `"5" + str(5)`(="55") 로 바꿔야 합니다.' },
    { q: '`s = "hello"` 이후 `s.upper()` 만 실행하고 `print(s)` 하면 출력은?', choices: ['HELLO', 'hello', 'None', '오류'], answer: 1, explain: '메서드는 새 문자열을 돌려줄 뿐 원본을 바꾸지 않습니다. 결과를 변수에 받아야 합니다.' }
  ]
},

/* ======================= 4 ======================= */
{
  id: 'py-04', unit: '1부. 기본 문법', title: '조건문', time: '45분',
  summary: '조건문은 식의 참/거짓에 따라 실행할 코드 블록을 고르며, 블록의 범위는 들여쓰기로 결정된다.',
  goals: ['`if / elif / else` 로 분기를 작성한다', '`and / or / not` 과 비교 연산을 정확히 쓴다', '참/거짓으로 취급되는 값(truthy / falsy)을 안다'],
  terms: [
    { t: '조건식', d: '결과가 `True` 또는 `False` 로 해석되는 식. 예: `age >= 18`.' },
    { t: '블록(block)', d: '들여쓰기가 같은 연속된 줄 묶음. `:` 로 끝나는 줄 아래에 4칸 들여써서 만든다.' },
    { t: 'falsy / truthy', d: '조건식 자리에서 거짓처럼 / 참처럼 취급되는 값. 거짓: `0`, `0.0`, `""`, `[]`, `{}`, `None`, `False`. 나머지는 참.' }
  ],
  sections: [
    { h: '기본 형태', md: [
      fence('python', 'if 조건1:\n    ...      # 조건1이 참일 때\nelif 조건2:\n    ...      # 조건1은 거짓, 조건2가 참일 때\nelse:\n    ...      # 모두 거짓일 때'),
      '위에서부터 **처음으로 참인 분기 하나만** 실행되고 나머지는 건너뜁니다. `elif` / `else` 는 생략할 수 있습니다.'] },
    { h: '비교와 논리 연산', md: [
      '| 연산자 | 의미 |', '|---|---|',
      '| `== !=` | 값이 같다 / 다르다 |', '| `< <= > >=` | 크기 비교 (`1 < x < 10` 처럼 이어 쓸 수 있다) |',
      '| `and or not` | 그리고 / 또는 / 부정 |', '| `in`, `not in` | 포함 여부 (`3 in [1,2,3]`) |',
      '`=` 는 **할당**, `==` 는 **비교**입니다. 조건식에 `=` 를 쓰면 문법 오류가 납니다.',
      '`and` / `or` 는 **단락 평가**를 합니다: `A and B` 에서 A 가 거짓이면 B 는 평가조차 하지 않습니다.'] },
    { h: '들여쓰기가 곧 문법', md: [
      'Python 은 중괄호 대신 **들여쓰기**로 블록을 나눕니다. 같은 블록 안에서는 들여쓰기 칸 수가 같아야 하고(관례: 스페이스 4칸), 탭과 스페이스를 섞지 마세요.'] }
  ],
  misconceptions: [
    { wrong: '"`if x == 1 or 2:` 는 x 가 1 또는 2 인지 검사한다."', right: '`(x == 1) or 2` 로 읽힌다. `2` 는 항상 참이므로 **언제나 참**이다. 올바른 코드는 `x == 1 or x == 2` 또는 `x in (1, 2)`.', why: '한국어/영어 문장 "x 가 1 또는 2"를 그대로 옮기면 안 됩니다. `or` 는 두 **조건식**을 잇는 연산자입니다.' },
    { wrong: '"`==` 와 `is` 는 같은 비교다."', right: '`==` 는 **값이 같은가**, `is` 는 **같은 객체인가**. 내용이 같은 리스트 두 개는 `==` 는 참, `is` 는 거짓.', why: '값 비교에는 `==`. `is` 는 `x is None` 처럼 None 확인에만 주로 씁니다.' },
    { wrong: '"들여쓰기는 보기 좋게 하는 스타일일 뿐이다."', right: '들여쓰기가 **어느 코드가 if 안에 속하는지**를 결정한다. 한 칸 어긋나면 의미가 달라지거나 `IndentationError`.', why: 'C++ / Java 에서는 중괄호가 블록을 정하고 들여쓰기는 스타일입니다. Python 은 반대입니다.' },
    { wrong: '"`if x:` 는 x 가 `True` 일 때만 실행된다."', right: '`x` 가 truthy 이면 실행된다. 예를 들어 `x = 5`, `x = "a"`, `x = [0]` 도 참.', why: '빈 리스트 검사를 `if items:` 로 간결하게 쓰는 것은 이 규칙 덕분입니다.' }
  ],
  examples: [
    { title: 'if / elif / else', lang: 'python', code: R`
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
print(grade)
`, output: R`
B
`, notes: ['85 는 첫 조건(≥90)이 거짓, 둘째(≥80)가 참이므로 `"B"`. 셋째는 확인하지 않습니다.'] },
    { title: '참/거짓으로 취급되는 값', lang: 'python', code: R`
for v in [0, 1, "", "a", [], [0], None]:
    print(repr(v), bool(v))
`, output: R`
0 False
1 True
'' False
'a' True
[] False
[0] True
None False
`, notes: ['`[0]` 는 "0 이 들어 있는 리스트"이므로 비어 있지 않아 참입니다.'] },
    { title: '"or 2" 함정', lang: 'python', code: R`
x = 5
print(x == 1 or 2)
print(x == 1 or x == 2)
print(x in (1, 2))
`, output: R`
2
False
False
`, notes: ['첫 줄은 `False or 2` → `or` 는 첫 번째 참인 피연산자를 돌려주므로 `2`.'] },
    { title: '== 와 is', lang: 'python', code: R`
a = [1, 2]
b = [1, 2]
c = a
print(a == b, a is b, a is c)
`, output: R`
True False True
` }
  ],
  exercises: [
    { q: '정수를 입력받아 짝수/홀수를 출력하세요.', hint: '`n % 2 == 0`', answer: fence('python', 'n = int(input())\nif n % 2 == 0:\n    print("짝수")\nelse:\n    print("홀수")') },
    { q: '윤년 판별: 4로 나누어떨어지고 100으로 나누어떨어지지 않거나, 400으로 나누어떨어지면 윤년. 2024, 1900, 2000 으로 시험해 보세요.', hint: '`and`, `or` 와 괄호를 함께 사용.', answer: fence('python', 'y = int(input())\nif (y % 4 == 0 and y % 100 != 0) or y % 400 == 0:\n    print("윤년")\nelse:\n    print("평년")   # 2024 윤년, 1900 평년, 2000 윤년') }
  ],
  quiz: [
    { q: '`x = 5` 일 때 `print(x == 1 or 2)` 의 출력은?', accept: ['2'], explain: '`(x == 1) or 2` → `False or 2` → `2`. 이 코드는 의도(1 또는 2 인가)와 다르게 동작합니다.' },
    { q: '`print(not (3 > 2 and 1 > 2))` 의 출력은?', choices: ['True', 'False', '오류', 'None'], answer: 0, explain: '`3>2` 는 참, `1>2` 는 거짓 → `and` 결과 거짓 → `not` 으로 True.' },
    { q: '다음 중 조건식에서 **거짓**으로 취급되는 값이 아닌 것은?', choices: ['0', '""', '[]', '[0]'], answer: 3, explain: '`[0]` 는 원소가 하나 있는 리스트라 비어 있지 않으므로 참입니다. (`0`, 빈 문자열, 빈 리스트는 거짓)' },
    { q: '내용이 같은 두 리스트 `a = [1]`, `b = [1]` 에 대해 `a == b` 와 `a is b` 는?', choices: ['True, True', 'True, False', 'False, True', 'False, False'], answer: 1, explain: '`==` 는 값 비교, `is` 는 같은 객체인지 비교합니다. 두 리스트는 별개의 객체입니다.' },
    { q: '아래 코드를 실행하면?', code: 'x = 3\nif x = 3:\n    print("hi")', lang: 'python', choices: ['hi', 'SyntaxError', 'False', '아무 출력 없음'], answer: 1, explain: '`=` 는 할당이라 조건식 자리에 쓸 수 없습니다. 비교는 `==`.' },
    { q: '출력은?', code: 'n = 15\nif n % 3 == 0 and n % 5 == 0:\n    print("FizzBuzz")\nelif n % 3 == 0:\n    print("Fizz")\nelse:\n    print(n)', lang: 'python', accept: ['FizzBuzz'], explain: '15 는 3과 5의 배수이므로 첫 분기가 실행됩니다. 더 구체적인 조건을 위에 두는 것이 중요합니다.' }
  ]
},

/* ======================= 5 ======================= */
{
  id: 'py-05', unit: '1부. 기본 문법', title: '반복문', time: '50분',
  summary: '반복문은 같은 코드를 여러 번 실행한다. for 는 "횟수/대상이 정해진 반복", while 은 "조건이 참인 동안 반복".',
  goals: ['`range()` 가 만드는 숫자 범위를 정확히 안다', '`for` 와 `while` 중 알맞은 것을 고른다', '`break`, `continue` 의 차이를 설명한다'],
  terms: [
    { t: '반복 가능(iterable)', d: '`for` 로 하나씩 꺼낼 수 있는 것. 리스트, 문자열, `range` 등.' },
    { t: '누적(accumulate)', d: '반복하면서 변수에 값을 계속 더하거나 쌓아 결과를 만드는 패턴. `total += i`.' },
    { t: '무한 루프', d: '종료 조건이 영원히 거짓이 되지 않아 끝나지 않는 반복. 터미널에서 `Ctrl+C` 로 중단.' }
  ],
  sections: [
    { h: 'for 와 range', md: [
      '`for 변수 in 반복가능한것:` 은 대상에서 값을 **하나씩 꺼내 변수에 붙이고** 블록을 실행합니다.',
      '`range(stop)` → `0 .. stop-1`, `range(start, stop)` → `start .. stop-1`, `range(start, stop, step)`. 슬라이싱처럼 **끝 값은 포함하지 않습니다.** 원소 개수는 `stop - start` (step=1 일 때).'] },
    { h: 'while', md: [
      '`while 조건:` 은 조건이 참인 동안 블록을 반복합니다. 반복 횟수를 미리 모르는 경우(예: 올바른 입력이 들어올 때까지)에 씁니다. **반복 안에서 조건이 언젠가 거짓이 되도록** 무언가를 바꿔야 합니다.'] },
    { h: 'break 와 continue', md: [
      '- `break`: 가장 가까운 반복문을 **즉시 끝낸다**.',
      '- `continue`: 이번 회차의 **나머지를 건너뛰고** 다음 회차로 간다.'] },
    { h: '자주 쓰는 패턴', md: [
      '- 누적합: `total = 0` 으로 시작해 `total += i`',
      '- 인덱스와 값 같이: `for i, x in enumerate(리스트):` (시작 번호 바꾸기: `start=1`)',
      '- 중첩 반복: 바깥 1회전마다 안쪽이 **처음부터 끝까지** 돈다 (구구단, 별 찍기).'] }
  ],
  misconceptions: [
    { wrong: '"`range(5)` 는 1부터 5까지다."', right: '`0, 1, 2, 3, 4` — 0부터 시작, 5는 포함되지 않는다. 총 5개.', why: '1부터 5까지가 필요하면 `range(1, 6)`. "끝은 미포함" 규칙은 슬라이싱과 동일합니다.' },
    { wrong: '"`for` 문의 변수는 반복이 끝나면 사라진다."', right: 'Python 에는 블록 범위가 없어서 반복이 끝난 뒤에도 **마지막 값이 남아 있다.**', why: 'C++ / Java 에서는 `for (int i...)` 의 i 가 반복문 밖에서 사라집니다. 언어마다 다르니 주의.' },
    { wrong: '"`continue` 는 반복문을 끝낸다."', right: '`continue` 는 이번 회차만 건너뛴다. 반복문을 끝내는 것은 `break`.', why: '이름이 비슷해 헷갈립니다: continue = 계속(다음 회차로), break = 깨고 나간다.' },
    { wrong: '"`while True:` 는 항상 잘못된 코드다."', right: '`break` 와 함께 쓰면 "입력이 올바를 때까지 반복" 같은 코드를 깔끔하게 만든다. 문제는 **탈출 경로가 없을 때**이다.', why: '무한 루프의 원인은 대부분 조건 변수를 바꾸는 줄을 빼먹은 것입니다.' }
  ],
  examples: [
    { title: 'range 와 누적합', lang: 'python', code: R`
total = 0
for i in range(1, 6):
    total += i
print(total)
print(list(range(5)))
print(list(range(2, 10, 3)))
`, output: R`
15
[0, 1, 2, 3, 4]
[2, 5, 8]
` },
    { title: 'while + break / continue', lang: 'python', code: R`
n = 0
while True:
    n += 1
    if n % 2 == 0:
        continue      # 짝수는 건너뛴다
    if n > 7:
        break         # 7 을 넘으면 반복 종료
    print(n)
`, output: R`
1
3
5
7
`, notes: ['n=9 에서 `break` 가 먼저 실행되어 9 는 출력되지 않습니다.'] },
    { title: 'enumerate 와 중첩 반복', lang: 'python', code: R`
fruits = ["사과", "배", "귤"]
for i, f in enumerate(fruits, start=1):
    print(i, f)
for i in range(1, 4):
    print("*" * i)
`, output: R`
1 사과
2 배
3 귤
*
**
***
` },
    { title: '반복문 변수는 밖에서도 남는다', lang: 'python', code: R`
for i in range(3):
    pass
print(i)
`, output: R`
2
` }
  ],
  exercises: [
    { q: '1부터 100까지 정수 중 3의 배수의 합을 구하세요. (정답 1683)', hint: '`range(1, 101)` 과 `if i % 3 == 0`.', answer: fence('python', 'total = 0\nfor i in range(1, 101):\n    if i % 3 == 0:\n        total += i\nprint(total)   # 1683') },
    { q: '구구단 3단을 `3 x 1 = 3` 형태로 출력하세요.', hint: 'f-string: `f"3 x {i} = {3 * i}"`', answer: fence('python', 'for i in range(1, 10):\n    print(f"3 x {i} = {3 * i}")') },
    { q: '"양수를 입력할 때까지" 숫자를 계속 입력받는 코드를 `while True` 와 `break` 로 작성하세요.', hint: '입력을 `int` 로 바꾸고, 0 보다 크면 `break`.', answer: fence('python', 'while True:\n    n = int(input("양수: "))\n    if n > 0:\n        break\n    print("다시 입력하세요")\nprint("입력값:", n)') }
  ],
  quiz: [
    { q: '`len(range(3, 8))` 의 값은?', accept: ['5'], explain: '3, 4, 5, 6, 7 — 끝(8)은 미포함이므로 5개.' },
    { q: '아래 코드의 마지막으로 출력되는 값은?', code: 'for i in range(5):\n    print(i)', lang: 'python', choices: ['4', '5', '0', '오류'], answer: 0, explain: '`range(5)` 는 0~4 입니다.' },
    { q: '`sum(range(1, 101))` 의 값은? (1부터 100까지의 합)', accept: ['5050'], explain: '1~100 의 합 = 100×101/2 = 5050.' },
    { q: '`continue` 에 대한 설명으로 옳은 것은?', choices: ['반복문을 완전히 끝낸다', '이번 회차의 나머지를 건너뛰고 다음 회차로 간다', '프로그램을 종료한다', '반복을 처음부터 다시 시작한다'], answer: 1, explain: '반복문을 끝내는 것은 `break` 입니다.' },
    { q: '아래 코드의 출력은?', code: 'for i in range(3):\n    pass\nprint(i)', lang: 'python', accept: ['2'], explain: 'Python 의 반복 변수는 반복이 끝나도 마지막 값(2)을 유지합니다.' },
    { q: '다음 중 무한 루프가 되는 코드는?', choices: ['`i = 0` 후 `while i < 3:` 안에서 `i += 1`', '`i = 0` 후 `while i < 3:` 안에서 `print(i)` 만 실행', '`for i in range(3):`', '`while False:`'], answer: 1, explain: '조건에 쓰인 `i` 를 바꾸는 줄이 없으면 조건이 영원히 참입니다.' }
  ]
},

/* ======================= 6 ======================= */
{
  id: 'py-06', unit: '2부. 자료구조', title: '리스트와 튜플', time: '60분',
  summary: '리스트는 바꿀 수 있는(가변) 순서 있는 모음이고, 변수는 이름표이므로 `b = a` 는 복사가 아니라 같은 리스트를 공유한다.',
  goals: ['리스트의 추가·삭제·정렬·슬라이싱을 쓴다', '별칭(alias)과 복사의 차이를 설명한다', '튜플 / 언패킹 / 리스트 컴프리헨션을 읽고 쓴다'],
  terms: [
    { t: '가변(mutable)', d: '만든 뒤에 내용을 바꿀 수 있는 객체. 리스트, 딕셔너리, 집합.' },
    { t: '별칭(alias)', d: '하나의 객체에 이름이 둘 이상 붙은 상태. 한쪽으로 바꾸면 다른 쪽에서도 바뀐 것이 보인다.' },
    { t: '얕은 복사', d: '바깥 리스트만 새로 만들고 안의 원소(객체)는 그대로 공유하는 복사. `a.copy()`, `a[:]`, `list(a)`.' },
    { t: '컴프리헨션', d: '`[식 for 변수 in 반복대상 if 조건]` 으로 새 리스트를 한 줄에 만드는 문법.' }
  ],
  sections: [
    { h: '리스트 기본', md: [
      '`nums = [3, 1, 2]` — 인덱싱·슬라이싱은 문자열과 같습니다(0부터, 끝 미포함). 슬라이싱은 **새 리스트**를 만듭니다.',
      '| 메서드 | 동작 |', '|---|---|',
      '| `append(x)` | 끝에 추가 |', '| `insert(i, x)` | i 위치에 삽입 |', '| `pop()` / `pop(i)` | 꺼내면서 삭제 (값 반환) |',
      '| `remove(x)` | 처음 나오는 x 삭제 |', '| `sort()` | **제자리 정렬, 반환값 `None`** |', '| `sorted(리스트)` | 정렬된 **새 리스트** 반환, 원본 유지 |',
      '`len(x)`, `x in 리스트`, `sum()`, `min()`, `max()` 도 자주 씁니다.'] },
    { h: '별칭과 복사', md: [
      '`b = a` 는 리스트를 복사하지 않고 **같은 리스트에 이름을 하나 더** 붙입니다. 그래서 `b.append(4)` 하면 `a` 에서도 보입니다. 독립된 리스트가 필요하면 `a.copy()`.',
      '리스트 안에 리스트가 있으면(2차원) `copy()` 로도 안쪽 리스트는 공유됩니다(얕은 복사). 완전한 복사는 `copy.deepcopy`.'] },
    { h: '튜플', md: [
      '`point = (3, 4)` — 리스트와 비슷하지만 **불변**입니다. 좌표처럼 "바뀌면 안 되는 묶음", 함수가 여러 값을 돌려줄 때, 딕셔너리 키로 쓸 때 사용합니다.',
      '언패킹: `x, y = point`, 두 값 교환: `a, b = b, a`.'] },
    { h: '리스트 컴프리헨션', md: [
      '`[n * n for n in range(1, 6) if n % 2 == 1]` — "1~5 중 홀수 n 의 제곱 리스트". 읽는 순서: **for → if → 앞의 식**.'] }
  ],
  misconceptions: [
    { wrong: '"`b = a` 하면 리스트가 복사된다."', right: '같은 리스트에 이름이 둘 붙을 뿐이다. 복사하려면 `b = a.copy()`.', why: '변수=이름표 모델(2강)의 직접적인 결과입니다. 함수에 리스트를 넘길 때도 같은 원리로 원본이 바뀝니다.' },
    { wrong: '"`x = x.sort()` 로 정렬된 리스트를 받는다."', right: '`sort()` 는 제자리 정렬 후 `None` 을 돌려준다. `x` 가 `None` 이 되어 버린다.', why: '값을 **바꾸는** 메서드(append, sort, ...)는 대체로 `None` 을 반환합니다. 새 값을 원하면 `sorted(x)`.' },
    { wrong: '"`[[0] * 2] * 2` 는 서로 독립된 2×2 표를 만든다."', right: '안쪽 리스트 **하나**를 두 번 가리키는 구조다. 한 행을 바꾸면 모든 행이 바뀐다. `[[0] * 2 for _ in range(2)]` 로 만든다.', why: '`*` 는 원소(이름표)를 복사할 뿐 객체를 복제하지 않습니다.' },
    { wrong: '"튜플은 그냥 못 바꾸는 리스트일 뿐이다."', right: '맞는 면도 있지만, "의미상 고정된 묶음"이라는 의도를 드러내고, 해시 가능해서 딕셔너리 키·집합 원소가 될 수 있다.', why: '다만 튜플 안에 리스트가 들어 있으면 그 리스트 내용은 여전히 바뀔 수 있습니다.' }
  ],
  examples: [
    { title: '리스트 기본 조작', lang: 'python', code: R`
nums = [3, 1, 2]
nums.append(4)
nums.insert(0, 9)
print(nums)
print(nums.pop())
print(nums[1:3], nums[-1])
print(sorted(nums), nums)
nums.sort()
print(nums)
`, output: R`
[9, 3, 1, 2, 4]
4
[3, 1] 2
[1, 2, 3, 9] [9, 3, 1, 2]
[1, 2, 3, 9]
` },
    { title: '별칭 vs 복사', lang: 'python', code: R`
a = [1, 2, 3]
b = a            # 별칭
b.append(4)
print(a)
c = a.copy()     # 복사
c.append(5)
print(a, c)
print(a is b, a is c)
`, output: R`
[1, 2, 3, 4]
[1, 2, 3, 4] [1, 2, 3, 4, 5]
True False
` },
    { title: 'sort() 는 None 을 돌려준다', lang: 'python', code: R`
x = [3, 1, 2]
y = x.sort()
print(y)
print(x)
`, output: R`
None
[1, 2, 3]
` },
    { title: '2차원 리스트 함정', lang: 'python', code: R`
wrong = [[0] * 2] * 2
wrong[0][0] = 1
print(wrong)
right = [[0] * 2 for _ in range(2)]
right[0][0] = 1
print(right)
`, output: R`
[[1, 0], [1, 0]]
[[1, 0], [0, 0]]
` },
    { title: '튜플 · 언패킹 · 컴프리헨션', lang: 'python', code: R`
point = (3, 4)
x, y = point
print(x + y)
squares = [n * n for n in range(1, 6) if n % 2 == 1]
print(squares)
a, b = 1, 2
a, b = b, a
print(a, b)
`, output: R`
7
[1, 9, 25]
2 1
` }
  ],
  exercises: [
    { q: '리스트 `[5, 3, 8, 1]` 에서 최댓값을 `max()` 없이 반복문으로 찾으세요.', hint: '첫 원소를 `best` 로 두고, 더 큰 값이 나오면 갱신.', answer: fence('python', 'nums = [5, 3, 8, 1]\nbest = nums[0]\nfor n in nums:\n    if n > best:\n        best = n\nprint(best)   # 8') },
    { q: '`[1, 2, 3, 4, 5, 6]` 에서 짝수만 제곱한 리스트를 컴프리헨션으로 만드세요. (`[4, 16, 36]`)', hint: '`[n*n for n in ... if ...]`', answer: fence('python', 'print([n * n for n in [1, 2, 3, 4, 5, 6] if n % 2 == 0])') },
    { q: '`a = [1, 2]; b = a; b.append(3)` 후 `a` 를 예측하고 실행으로 확인한 뒤, `b = a.copy()` 로 바꾸면 어떻게 달라지는지 확인하세요.', hint: '`a is b` 도 출력해 보세요.', answer: '별칭이면 `a` 도 `[1, 2, 3]` 이 되고, `copy()` 후에는 `a` 가 `[1, 2]` 로 유지됩니다.' }
  ],
  quiz: [
    { q: '출력은?', code: 'a = [1, 2]\nb = a\nb.append(3)\nprint(len(a))', lang: 'python', accept: ['3'], explain: '`a` 와 `b` 는 같은 리스트라서 `b` 에 추가한 원소가 `a` 에서도 보입니다.' },
    { q: '`nums = [1, 2, 3]` 일 때 `nums[1:]` 은?', choices: ['[1, 2]', '[2, 3]', '[2]', '[1, 2, 3]'], answer: 1, explain: '1번부터 끝까지.' },
    { q: '`print([1, 3, 2].sort())` 의 출력은?', choices: ['[1, 2, 3]', 'None', '[1, 3, 2]', '오류'], answer: 1, explain: '`sort()` 는 제자리 정렬을 하고 `None` 을 반환합니다.' },
    { q: '`t = (1, 2)` 에 `t[0] = 9` 를 실행하면?', choices: ['t 가 (9, 2) 가 된다', 'TypeError', 'IndexError', '아무 일도 없다'], answer: 1, explain: '튜플은 불변이라 원소를 대입할 수 없습니다.' },
    { q: '출력은?', code: 'rows = [[0] * 2] * 2\nrows[0][0] = 7\nprint(rows)', lang: 'python', choices: ['[[7, 0], [0, 0]]', '[[7, 0], [7, 0]]', '[[7, 7], [0, 0]]', '오류'], answer: 1, explain: '두 행은 같은 안쪽 리스트를 가리킵니다. 한 행을 바꾸면 둘 다 바뀝니다.' },
    { q: '`list(range(0, 10, 3))` 의 결과를 그대로 쓰세요.', accept: ['[0, 3, 6, 9]'], explain: '0부터 3씩 증가, 10 미만: 0, 3, 6, 9.' }
  ]
},

/* ======================= 7 ======================= */
{
  id: 'py-07', unit: '2부. 자료구조', title: '딕셔너리와 집합', time: '50분',
  summary: '딕셔너리는 "키로 값을 찾는" 자료구조, 집합은 "중복 없이 있는지 빠르게 확인하는" 자료구조다.',
  goals: ['딕셔너리의 추가·조회·순회를 쓰고 `KeyError` 를 피한다', '`in` 이 무엇을 검사하는지 정확히 안다', '집합의 연산(교집합·합집합·차집합)을 쓴다'],
  terms: [
    { t: '키(key) / 값(value)', d: '딕셔너리의 한 항목은 `키: 값` 쌍. 키로 값을 찾는다. 키는 **중복될 수 없다.**' },
    { t: '해시 가능(hashable)', d: '딕셔너리 키·집합 원소가 될 수 있는 자격. 내용이 바뀌지 않는 값(int, str, tuple)은 가능, 리스트는 불가.' },
    { t: '집합(set)', d: '중복 없는 값의 모음. **순서와 인덱스가 없다.**' }
  ],
  sections: [
    { h: '딕셔너리', md: [
      '`scores = {"민수": 90, "지아": 85}` — `scores["민수"]` 로 조회, `scores["하늘"] = 77` 로 추가/수정, `del scores["지아"]` 로 삭제.',
      '- 없는 키로 `d[key]` 를 조회하면 **`KeyError`**. 안전하게는 `d.get(key)` (없으면 `None`) 또는 `d.get(key, 기본값)`.',
      '- `key in d` 는 **키**가 있는지 검사합니다 (값 아님).',
      '- 순회: `for k in d`(키), `d.values()`, `for k, v in d.items()`. Python 3.7+ 에서는 **넣은 순서가 유지**됩니다.'] },
    { h: '집합', md: [
      '`{1, 2, 3}` 또는 `set(리스트)`. 중복이 자동 제거되고 `x in s` 가 매우 빠릅니다.',
      '`a & b`(교집합), `a | b`(합집합), `a - b`(차집합). **빈 집합은 `set()`** 입니다 — `{}` 는 빈 딕셔너리!'] },
    { h: '무엇을 언제 쓰나', md: [
      '| 하고 싶은 일 | 알맞은 자료구조 |', '|---|---|',
      '| 순서대로 모아 두기, 번호로 접근 | 리스트 |', '| 이름(키)으로 값 찾기, 개수 세기 | 딕셔너리 |', '| 중복 제거, 포함 여부 빠르게 검사 | 집합 |'] }
  ],
  misconceptions: [
    { wrong: '"`85 in scores` 는 값 85 가 있는지 검사한다."', right: '`in` 은 딕셔너리에서 **키**를 검사한다. 값을 찾으려면 `85 in scores.values()`.', why: '딕셔너리의 기본 "얼굴"은 키입니다. 순회(`for x in d`)도 키를 줍니다.' },
    { wrong: '"`{}` 는 빈 집합이다."', right: '`{}` 는 빈 **딕셔너리**다. 빈 집합은 `set()`.', why: '중괄호가 두 가지 의미를 가지는 역사적 이유입니다. `type({})` 으로 확인해 보세요.' },
    { wrong: '"집합도 `s[0]` 으로 첫 원소를 꺼낼 수 있다."', right: '집합에는 순서도 인덱스도 없다. `s[0]` 은 `TypeError`.', why: '순서가 필요하면 `sorted(s)` 로 리스트를 만드세요.' },
    { wrong: '"리스트를 딕셔너리 키로 쓸 수 있다."', right: '`TypeError: unhashable type: \'list\'`. 키는 변하지 않는 값(문자열, 숫자, 튜플)이어야 한다.', why: '키가 바뀌면 저장 위치를 찾을 수 없게 되기 때문입니다.' }
  ],
  examples: [
    { title: '딕셔너리 기본', lang: 'python', code: R`
scores = {"민수": 90, "지아": 85}
scores["하늘"] = 77
print(scores["민수"])
print(scores.get("철수"))
print(scores.get("철수", 0))
print("지아" in scores, 85 in scores)
for name, sc in scores.items():
    print(name, sc)
`, output: R`
90
None
0
True False
민수 90
지아 85
하늘 77
` },
    { title: 'KeyError', lang: 'python', code: R`
d = {"a": 1}
try:
    d["b"]
except KeyError as e:
    print("KeyError:", e)
`, output: R`
KeyError: 'b'
` },
    { title: '글자 개수 세기 (딕셔너리의 대표 용도)', lang: 'python', code: R`
text = "banana"
count = {}
for ch in text:
    count[ch] = count.get(ch, 0) + 1
print(count)
`, output: R`
{'b': 1, 'a': 3, 'n': 2}
`, notes: ['처음 보는 글자는 `get(ch, 0)` 이 0 을 주므로 `0 + 1`, 이미 있으면 기존 값 + 1.'] },
    { title: '집합', lang: 'python', code: R`
a = {1, 2, 3, 3, 2}
b = {3, 4}
print(a)
print(a & b, a | b, a - b)
print(len(set([1, 1, 2, 2, 3])))
print(type({}), type(set()))
`, output: R`
{1, 2, 3}
{3} {1, 2, 3, 4} {1, 2}
3
<class 'dict'> <class 'set'>
` }
  ],
  exercises: [
    { q: '문장 `"to be or not to be"` 의 단어별 등장 횟수를 딕셔너리로 구하세요.', hint: '`split()` 으로 단어를 나눈 뒤 위의 글자 세기 패턴 사용.', answer: fence('python', 'count = {}\nfor w in "to be or not to be".split():\n    count[w] = count.get(w, 0) + 1\nprint(count)   # {\'to\': 2, \'be\': 2, \'or\': 1, \'not\': 1}') },
    { q: '리스트 `[3, 1, 3, 2, 1]` 에서 중복을 제거하되, 처음 등장한 순서를 유지하세요.', hint: '집합은 순서가 없으니 "이미 봤는지"만 기록하는 용도로 쓰세요.', answer: fence('python', 'seen = set()\nresult = []\nfor x in [3, 1, 3, 2, 1]:\n    if x not in seen:\n        seen.add(x)\n        result.append(x)\nprint(result)   # [3, 1, 2]') }
  ],
  quiz: [
    { q: '`d = {"a": 1}` 일 때 `1 in d` 의 결과는?', choices: ['True', 'False', 'KeyError', 'None'], answer: 1, explain: '`in` 은 키를 검사합니다. 키는 `"a"` 뿐이므로 False.' },
    { q: '`type({})` 은?', choices: ['set', 'dict', 'list', 'tuple'], answer: 1, explain: '빈 집합은 `set()` 으로 만들어야 합니다.' },
    { q: '없는 키 `"z"` 를 `d["z"]` 로 조회하면?', choices: ['None', '0', 'KeyError', '빈 문자열'], answer: 2, explain: '`d.get("z")` 를 쓰면 `None` 을 받을 수 있습니다.' },
    { q: '`len({1, 2, 2, 3, 3, 3})` 의 값은?', accept: ['3'], explain: '중복이 제거되어 {1, 2, 3} 입니다.' },
    { q: '다음 중 딕셔너리의 **키**로 쓸 수 없는 것은?', choices: ['"abc"', '42', '(1, 2)', '[1, 2]'], answer: 3, explain: '리스트는 가변이라 해시할 수 없어 키가 될 수 없습니다.' }
  ]
},

/* ======================= 8 ======================= */
{
  id: 'py-08', unit: '3부. 프로그램 구조화', title: '함수', time: '60분',
  summary: '함수는 이름을 붙인 코드 묶음이다. 결과를 "돌려주는" return 과 "화면에 보여주는" print 는 전혀 다르다.',
  goals: ['매개변수·인자·반환값을 구분한다', '`return` 과 `print` 의 차이를 설명한다', '지역/전역 변수 규칙과 기본값 인자의 함정을 안다'],
  terms: [
    { t: '매개변수(parameter) / 인자(argument)', d: '매개변수는 함수 **정의**의 변수 이름(`def f(a):` 의 `a`), 인자는 **호출** 때 넘기는 실제 값(`f(3)` 의 `3`).' },
    { t: '반환값(return value)', d: '`return` 으로 호출한 쪽에 돌려주는 값. `return` 이 없으면 `None`.' },
    { t: '스코프(scope)', d: '이름이 유효한 범위. 함수 안에서 만든 변수는 **지역 변수**로 함수가 끝나면 사라진다.' }
  ],
  sections: [
    { h: '정의와 호출', md: [
      fence('python', 'def add(a, b):      # 정의: a, b 는 매개변수\n    return a + b\n\nresult = add(2, 3)   # 호출: 2, 3 은 인자'),
      '함수를 **정의**만 해서는 아무 일도 일어나지 않습니다. 호출해야 실행됩니다. `return` 을 만나면 그 자리에서 함수가 끝나고 값을 돌려줍니다.'] },
    { h: 'return vs print', md: [
      '`print` 는 사람에게 **보여주기**, `return` 은 프로그램의 다른 부분에 **값 전달하기**입니다. 함수의 결과를 다른 계산에 쓰려면 반드시 `return` 해야 합니다.'] },
    { h: '인자 다루기', md: [
      '- **기본값**: `def greet(name, greeting="안녕")` — 생략하면 기본값 사용.',
      '- **키워드 인자**: `greet(greeting="Hi", name="Jia")` — 이름으로 지정, 순서 무관.',
      '- 인자는 "값 복사"가 아니라 **같은 객체에 새 이름표를 붙이는 것**입니다. 리스트를 넘겨 함수 안에서 `append` 하면 원본이 바뀝니다. 반면 `lst = []` 처럼 함수 안에서 이름을 다른 값에 다시 붙이는 것은 호출한 쪽에 영향이 없습니다.'] },
    { h: '스코프', md: [
      '함수 안에서 `x = 1` 로 **대입**하면 항상 새 지역 변수입니다(같은 이름의 전역 변수가 있어도). 전역 변수를 정말 바꾸려면 `global x` 를 선언해야 하지만, 대부분은 `return` 으로 값을 돌려주는 설계가 더 좋습니다.'] }
  ],
  misconceptions: [
    { wrong: '"`print(x)` 로 보여주면 함수가 결과를 돌려준 것이다."', right: '화면에 보이는 것과 함수의 반환값은 별개다. `print` 만 있는 함수의 반환값은 `None`.', why: '"계산은 return, 출력은 호출한 쪽에서" 가 기본 설계입니다.' },
    { wrong: '"함수 안에서 전역 변수에 대입하면 전역 변수가 바뀐다."', right: '대입은 새 지역 변수를 만든다. 바꾸려면 `global` 선언이 필요하다.', why: '(읽기만 하는 것은 선언 없이 가능합니다.)' },
    { wrong: '"기본값 `items=[]` 는 호출할 때마다 새 빈 리스트가 된다."', right: '기본값은 **함수를 정의할 때 딱 한 번** 만들어져 모든 호출이 공유한다. 기본값은 `None` 으로 두고 안에서 새로 만든다.', why: '가변 객체(리스트·딕셔너리)를 기본값으로 쓰는 것은 대표적인 Python 함정입니다.' },
    { wrong: '"함수에 리스트를 넘기면 복사본이 전달된다."', right: '같은 리스트가 전달된다. 함수 안에서 내용을 바꾸면 원본이 바뀐다.', why: '원본을 지키려면 함수 안에서 `lst.copy()` 로 복사하세요.' }
  ],
  examples: [
    { title: 'return 과 print', lang: 'python', code: R`
def add(a, b):
    return a + b

def show(a, b):
    print(a + b)

x = add(2, 3)
y = show(2, 3)
print(x, y)
`, output: R`
5
5 None
`, notes: ['첫 `5` 는 `show` 가 **출력**한 것입니다. `y` 에는 `None` 이 들어갑니다.'] },
    { title: '기본값 · 키워드 인자', lang: 'python', code: R`
def greet(name, greeting="안녕"):
    return f"{greeting}, {name}!"

print(greet("민수"))
print(greet("민수", "반가워"))
print(greet(greeting="Hi", name="Jia"))
`, output: R`
안녕, 민수!
반가워, 민수!
Hi, Jia!
` },
    { title: '지역 변수 vs 전역 변수', lang: 'python', code: R`
count = 0

def bad():
    count = 99      # 새 지역 변수가 만들어짐
    return count

def good():
    global count
    count += 1

bad()
print(count)
good()
print(count)
`, output: R`
0
1
` },
    { title: '기본값 함정', lang: 'python', code: R`
def add_item(x, items=[]):
    items.append(x)
    return items

print(add_item(1))
print(add_item(2))

def add_item_ok(x, items=None):
    if items is None:
        items = []
    items.append(x)
    return items

print(add_item_ok(1))
print(add_item_ok(2))
`, output: R`
[1]
[1, 2]
[1]
[2]
` },
    { title: '인자로 넘긴 리스트', lang: 'python', code: R`
def add_one(lst):
    lst.append(1)       # 같은 리스트의 내용을 바꾼다

def reset(lst):
    lst = []            # 지역 이름 lst 를 새 리스트에 붙일 뿐

nums = []
add_one(nums)
print(nums)
reset(nums)
print(nums)
`, output: R`
[1]
[1]
` }
  ],
  exercises: [
    { q: '정수 리스트를 받아 평균을 **반환**하는 `average(nums)` 를 만들고, 반환값을 받아서 출력하세요. (빈 리스트면 `0` 반환)', hint: '`sum(nums) / len(nums)`; 빈 리스트 검사 `if not nums:`', answer: fence('python', 'def average(nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)\n\nprint(average([80, 90, 100]))   # 90.0') },
    { q: '`is_prime(n)` 함수를 만들어 2~30 사이 소수를 출력하세요.', hint: '2 부터 `n-1`(또는 √n) 까지 나누어떨어지는 수가 있으면 소수가 아님.', answer: fence('python', 'def is_prime(n):\n    if n < 2:\n        return False\n    for d in range(2, int(n ** 0.5) + 1):\n        if n % d == 0:\n            return False\n    return True\n\nprint([n for n in range(2, 31) if is_prime(n)])') }
  ],
  quiz: [
    { q: '아래 코드의 마지막 출력은?', code: 'def f(x):\n    print(x * 2)\n\nr = f(4)\nprint(r)', lang: 'python', choices: ['8', 'None', '4', '오류'], answer: 1, explain: '`f` 는 8 을 출력(첫 줄)하지만 `return` 이 없어 `None` 을 돌려줍니다.' },
    { q: '`def add(a, b):` 에서 `a`, `b` 를, `add(2, 3)` 에서 `2`, `3` 을 각각 부르는 이름은?', choices: ['인자, 매개변수', '매개변수, 인자', '둘 다 매개변수', '둘 다 인자'], answer: 1, explain: '정의의 이름 = 매개변수, 호출 때 넘기는 값 = 인자.' },
    { q: '출력은?', code: 'x = 10\ndef f():\n    x = 20\nf()\nprint(x)', lang: 'python', accept: ['10'], explain: '함수 안의 `x = 20` 은 새 지역 변수를 만듭니다. 전역 `x` 는 그대로 10.' },
    { q: '`def f(x, items=[])` 의 가장 큰 문제는?', choices: ['문법 오류', '기본 리스트가 모든 호출에서 공유된다', '호출할 때 반드시 리스트를 넘겨야 한다', '문제 없음'], answer: 1, explain: '기본값은 정의 시점에 한 번만 만들어집니다. `None` 을 기본값으로 쓰고 안에서 새 리스트를 만드세요.' },
    { q: '함수 안에서 `lst.append(1)` 을 하면 호출한 쪽의 리스트는?', choices: ['그대로다', '함께 바뀐다', '오류', '복사본만 바뀐다'], answer: 1, explain: '같은 리스트 객체를 가리키므로 내용 변경이 원본에 보입니다.' }
  ]
},

/* ======================= 9 ======================= */
{
  id: 'py-09', unit: '3부. 프로그램 구조화', title: '파일과 예외 처리', time: '50분',
  summary: '파일은 with 로 열어 자동으로 닫고, 예외는 try/except 로 "예상 가능한 실패"만 정확히 골라서 처리한다.',
  goals: ['`with open(...)` 으로 파일을 읽고 쓴다 (`r`, `w`, `a` 모드)', '`try / except / else / finally` 의 실행 흐름을 설명한다', '구체적인 예외를 잡고, 필요하면 `raise` 로 직접 발생시킨다'],
  terms: [
    { t: '예외(exception)', d: '실행 중 발생한 오류 객체. 처리하지 않으면 프로그램이 멈춘다. 예: `ValueError`, `KeyError`, `FileNotFoundError`.' },
    { t: '컨텍스트 매니저 (`with`)', d: '블록이 끝나면(오류가 나도) 자원을 자동으로 정리해 주는 문법. 파일 닫기에 쓴다.' },
    { t: '인코딩', d: '글자를 바이트로 바꾸는 규칙. 한글 파일은 `encoding="utf-8"` 을 명시하는 습관을 들이자.' }
  ],
  sections: [
    { h: '파일 열기: 모드', md: [
      '| 모드 | 의미 | 주의 |', '|---|---|---|',
      '| `"r"` | 읽기 (기본) | 파일이 없으면 `FileNotFoundError` |',
      '| `"w"` | 쓰기 | **기존 내용을 모두 지우고** 새로 시작 |',
      '| `"a"` | 이어쓰기 | 끝에 덧붙임 |',
      '`with open(경로, 모드, encoding="utf-8") as f:` 블록이 끝나면 파일이 자동으로 닫힙니다. 쓰기 내용이 디스크에 확실히 반영되는 것도 닫을 때입니다.',
      '줄바꿈은 자동으로 들어가지 않습니다. `f.write("글\\n")` 처럼 `\\n` 을 직접 넣습니다(`print` 와 다름).'] },
    { h: 'try / except', md: [
      fence('python', 'try:\n    위험한_코드\nexcept ValueError:       # 이 종류의 오류일 때만\n    대응\nelse:                    # (선택) 오류가 없었을 때\n    ...\nfinally:                 # (선택) 오류가 있든 없든 마지막에 항상\n    정리'),
      '**잡을 오류를 구체적으로** 적으세요. `except:` 나 `except Exception:` 으로 모두 삼키면 진짜 버그까지 숨겨집니다.',
      '직접 오류를 일으키려면 `raise ValueError("메시지")`.'] }
  ],
  misconceptions: [
    { wrong: '"`open(..., \'w\')` 는 파일 끝에 덧붙여 쓴다."', right: '`"w"` 는 파일을 **비우고** 새로 쓴다. 덧붙이려면 `"a"`.', why: '기존 데이터를 날리는 가장 흔한 실수입니다. 모드를 쓸 때 한 번 더 확인하세요.' },
    { wrong: '"파일은 `close()` 를 안 해도 상관없다."', right: '닫지 않으면 쓴 내용이 반영되지 않거나 자원이 낭비될 수 있다. `with` 를 쓰면 자동으로 닫힌다.', why: '`with` 는 중간에 오류가 나도 닫아 줍니다.' },
    { wrong: '"모든 오류를 `except:` 로 잡으면 안전하다."', right: '버그와 사용자 중단(`Ctrl+C`)까지 삼켜서 원인을 찾기 어려워진다. 예상한 오류만 잡는다.', why: '"처리할 방법을 아는 오류만 잡는다"가 원칙입니다.' },
    { wrong: '"`finally` 는 오류가 났을 때만 실행된다."', right: '오류 여부와 관계없이 **항상** 실행된다. (`return` 으로 빠져나가는 경우에도)', why: '파일/네트워크 연결 정리 같은 "무조건 해야 하는 일"에 씁니다.' }
  ],
  examples: [
    { title: '파일 쓰기 · 읽기 · 이어쓰기', lang: 'python', code: R`
with open("memo.txt", "w", encoding="utf-8") as f:
    f.write("첫 줄\n")
    f.write("둘째 줄\n")

with open("memo.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

with open("memo.txt", "a", encoding="utf-8") as f:
    f.write("셋째 줄\n")

with open("memo.txt", encoding="utf-8") as f:
    print(len(f.readlines()))
`, output: R`
첫 줄
둘째 줄
3
`, notes: ['`line.strip()` 을 쓰는 이유: 파일에서 읽은 줄 끝에는 `\\n` 이 붙어 있어 `print` 가 빈 줄을 추가하기 때문입니다.'] },
    { title: 'try / except / finally', lang: 'python', code: R`
def to_int(text):
    try:
        return int(text)
    except ValueError:
        return None
    finally:
        print("변환 시도:", text)

print(to_int("42"))
print(to_int("abc"))
`, output: R`
변환 시도: 42
42
변환 시도: abc
None
`, notes: ['`return` 으로 함수를 빠져나가기 직전에도 `finally` 가 먼저 실행됩니다.'] },
    { title: 'raise 와 구체적인 예외', lang: 'python', code: R`
def divide(a, b):
    if b == 0:
        raise ValueError("0으로 나눌 수 없습니다")
    return a / b

try:
    divide(1, 0)
except ValueError as e:
    print("잡았다:", e)

try:
    open("없는파일.txt", encoding="utf-8")
except FileNotFoundError:
    print("파일이 없습니다")
`, output: R`
잡았다: 0으로 나눌 수 없습니다
파일이 없습니다
` }
  ],
  exercises: [
    { q: '숫자를 입력받되, 숫자가 아니면 "숫자만 입력하세요"를 출력하고 다시 입력받는 코드를 작성하세요.', hint: '`while True` + `try: int(input())` + `except ValueError`.', answer: fence('python', 'while True:\n    try:\n        n = int(input("숫자: "))\n        break\n    except ValueError:\n        print("숫자만 입력하세요")\nprint("입력:", n)') },
    { q: '메모 프로그램: 한 줄을 입력받아 `notes.txt` 에 **이어서** 저장하고, 전체 내용을 번호와 함께 출력하세요.', hint: '모드 `"a"` 로 저장, 다시 `"r"` 로 열어 `enumerate`.', answer: fence('python', 'text = input("메모: ")\nwith open("notes.txt", "a", encoding="utf-8") as f:\n    f.write(text + "\\n")\nwith open("notes.txt", encoding="utf-8") as f:\n    for i, line in enumerate(f, start=1):\n        print(i, line.strip())') }
  ],
  quiz: [
    { q: '이미 내용이 있는 파일을 `open("a.txt", "w")` 로 열고 아무것도 쓰지 않은 채 닫으면?', choices: ['내용이 그대로 유지된다', '파일이 비워진다', '오류가 난다', '내용이 두 배가 된다'], answer: 1, explain: '`"w"` 모드는 여는 순간 파일을 비웁니다.' },
    { q: '파일 끝에 내용을 덧붙이려면 어떤 모드를 써야 하나요? (문자 1개)', accept: ['a'], explain: '`"a"` = append.' },
    { q: '`finally` 블록은 언제 실행되나?', choices: ['오류가 났을 때만', '오류가 나지 않았을 때만', '오류 여부와 관계없이 항상', '`return` 이 있으면 실행되지 않음'], answer: 2, explain: '`return` 이 있어도 함수를 빠져나가기 전에 실행됩니다.' },
    { q: '`int("abc")` 가 일으키는 예외는?', choices: ['TypeError', 'ValueError', 'KeyError', 'IndexError'], answer: 1, explain: '자료형은 맞지만(문자열) 값이 변환 불가능할 때 `ValueError`.' },
    { q: '`except:` (종류 없이) 로 모든 오류를 잡는 것이 좋지 않은 이유는?', choices: ['문법 오류이기 때문', '실행 속도가 느려서', '진짜 버그까지 숨겨 원인 파악이 어려워져서', '파일이 닫히지 않아서'], answer: 2, explain: '처리 방법을 아는 예외만 구체적으로 잡는 것이 원칙입니다.' }
  ]
},

/* ======================= 10 ======================= */
{
  id: 'py-10', unit: '3부. 프로그램 구조화', title: '클래스와 객체', time: '70분',
  summary: '클래스는 "데이터(속성)와 기능(메서드)을 묶은 설계도", 객체(인스턴스)는 그 설계도로 만든 실제 값이다.',
  goals: ['클래스를 정의하고 객체를 만든다', '`self` 의 정체와 `__init__` 의 역할을 설명한다', '인스턴스 속성과 클래스 속성의 차이, 상속의 기본을 안다'],
  terms: [
    { t: '클래스(class) / 객체(object, instance)', d: '클래스는 설계도(자료형 자체), 객체는 그 설계도로 만든 하나하나의 값. `Account` 가 클래스, `Account("민수")` 가 객체.' },
    { t: '속성(attribute) / 메서드(method)', d: '객체가 가진 데이터(`self.balance`) / 객체에 붙은 함수(`deposit()`).' },
    { t: '`self`', d: '메서드가 **지금 호출된 그 객체**를 가리키기 위해 받는 첫 번째 매개변수. 호출할 때 Python 이 자동으로 넣어 준다.' },
    { t: '`__init__`', d: '객체를 만들 때 자동으로 호출되는 초기화 메서드(생성자 역할).' }
  ],
  sections: [
    { h: '클래스 기본 구조', md: [
      '`class 이름:` 안에 메서드를 `def` 로 정의합니다. `a = Account("민수")` 는 ① 빈 객체를 만들고 ② `__init__(그 객체, "민수")` 를 호출해 속성을 채웁니다.',
      '`a.deposit(500)` 은 내부적으로 `Account.deposit(a, 500)` 과 같습니다. 그래서 정의에는 `self` 가 있고 호출에는 인자 하나가 적게 보입니다.',
      '`__str__` 을 정의하면 `print(객체)` 때 보여줄 문자열을 정할 수 있습니다.'] },
    { h: '인스턴스 속성 vs 클래스 속성', md: [
      '- **인스턴스 속성**: `self.x = ...` — 객체마다 따로.',
      '- **클래스 속성**: 클래스 본문에 직접 쓴 변수 — 모든 객체가 공유. 상수나 개수 세기에 적합합니다. **리스트 같은 가변 객체를 클래스 속성에 두면 모든 객체가 같은 리스트를 공유**하니 주의.'] },
    { h: '상속', md: [
      '`class Dog(Animal):` — `Dog` 는 `Animal` 의 속성/메서드를 물려받고, 같은 이름의 메서드를 다시 정의(**오버라이딩**)해서 동작을 바꿀 수 있습니다. 부모의 초기화는 `super().__init__(...)`.',
      '"같은 이름의 메서드를 호출했는데 객체 종류에 따라 다르게 동작하는 것"이 **다형성**입니다. C++ / Java 에서 다시 깊게 다룹니다.'] }
  ],
  misconceptions: [
    { wrong: '"`self` 는 Python 의 예약어(키워드)다."', right: '관례적인 이름일 뿐이며 **메서드의 첫 매개변수**가 그 역할을 한다. 다만 다른 이름을 쓰지 않는 것이 규칙처럼 지켜진다.', why: '핵심은 이름이 아니라 "첫 번째 매개변수로 호출한 객체가 자동 전달된다"는 사실입니다.' },
    { wrong: '"클래스와 객체는 같은 말이다."', right: '클래스는 설계도, 객체는 그것으로 만든 실제 값. 클래스 하나로 객체를 여러 개 만들 수 있고 각 객체의 속성은 독립이다.', why: '`int` 가 클래스이고 `5` 가 그 객체입니다. (`type(5)` 로 확인)' },
    { wrong: '"클래스 안에 `items = []` 를 쓰면 객체마다 빈 리스트를 갖는다."', right: '클래스 속성이라 **모든 객체가 하나를 공유**한다. 객체마다 따로 가지려면 `__init__` 에서 `self.items = []`.', why: '8강의 "가변 기본값 인자" 함정과 같은 뿌리입니다: 가변 객체는 만들어지는 시점과 횟수를 항상 확인하세요.' },
    { wrong: '"메서드 안에서 `balance` 라고만 쓰면 객체의 `balance` 속성에 접근한다."', right: '`self.balance` 라고 써야 한다. `balance` 는 그냥 (정의되지 않은) 지역/전역 이름이다.', why: 'Java / C++ 에서는 `this` 를 생략할 수 있지만 Python 은 항상 `self.` 가 필요합니다.' }
  ],
  examples: [
    { title: '계좌 클래스', lang: 'python', code: R`
class Account:
    bank = "BSS Bank"            # 클래스 속성: 모두 공유

    def __init__(self, owner, balance=0):
        self.owner = owner       # 인스턴스 속성: 객체마다 따로
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("금액은 양수여야 합니다")
        self.balance += amount

    def __str__(self):
        return f"{self.owner}: {self.balance}원"

a = Account("민수")
b = Account("지아", 1000)
a.deposit(500)
print(a)
print(b)
print(a.bank, b.bank)
Account.deposit(a, 100)     # a.deposit(100) 과 같은 호출
print(a.balance)
`, output: R`
민수: 500원
지아: 1000원
BSS Bank BSS Bank
600
` },
    { title: '클래스 속성 공유 함정', lang: 'python', code: R`
class Bag:
    items = []                  # 위험: 클래스 속성 (공유)
    def add(self, x):
        self.items.append(x)

class SafeBag:
    def __init__(self):
        self.items = []         # 객체마다 따로
    def add(self, x):
        self.items.append(x)

b1, b2 = Bag(), Bag()
b1.add("a")
print(b2.items)

s1, s2 = SafeBag(), SafeBag()
s1.add("a")
print(s2.items)
`, output: R`
['a']
[]
` },
    { title: '상속과 오버라이딩', lang: 'python', code: R`
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return f"{self.name}: 멍멍"

for pet in [Animal("누구"), Dog("바둑이")]:
    print(pet.speak())
`, output: R`
...
바둑이: 멍멍
`, notes: ['같은 `pet.speak()` 호출이 객체의 실제 종류에 따라 다르게 동작합니다 (다형성).'] }
  ],
  exercises: [
    { q: '`Rectangle(width, height)` 클래스를 만들고 `area()`, `perimeter()` 메서드를 구현하세요. `Rectangle(3, 4).area()` → `12`.', hint: '`__init__` 에서 `self.width`, `self.height` 저장.', answer: fence('python', 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n    def perimeter(self):\n        return 2 * (self.width + self.height)\n\nprint(Rectangle(3, 4).area())   # 12') },
    { q: '위 `Account` 에 `withdraw(amount)` 를 추가하세요. 잔액이 부족하면 `ValueError` 를 발생시킵니다.', hint: '`if amount > self.balance: raise ValueError(...)`', answer: fence('python', '    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError("잔액 부족")\n        self.balance -= amount') },
    { q: '`Animal` 을 상속하는 `Cat` 을 만들고 `speak()` 를 오버라이딩해 보세요.', hint: '`class Cat(Animal):`', answer: fence('python', 'class Cat(Animal):\n    def speak(self):\n        return f"{self.name}: 야옹"') }
  ],
  quiz: [
    { q: '`a.deposit(500)` 호출 시 `self` 에는 무엇이 전달되나?', choices: ['500', '클래스 `Account`', '호출한 객체 `a`', '아무것도 전달되지 않는다'], answer: 2, explain: '`a.deposit(500)` 은 `Account.deposit(a, 500)` 과 같고, `a` 가 `self` 로 들어갑니다.' },
    { q: '클래스와 객체의 관계로 알맞은 것은?', choices: ['클래스는 객체의 복사본', '클래스는 설계도, 객체는 그 설계도로 만든 실체', '둘은 같은 말', '객체가 클래스를 만든다'], answer: 1, explain: '클래스 하나에서 독립적인 객체를 여러 개 만들 수 있습니다.' },
    { q: '출력은?', code: 'class C:\n    n = 0\n\nx, y = C(), C()\nC.n = 5\nprint(x.n, y.n)', lang: 'python', accept: ['5 5'], explain: '`n` 은 클래스 속성이라 모든 객체가 공유하며, 클래스에서 바꾸면 모두에게 보입니다.' },
    { q: '객체마다 독립된 리스트를 가지게 하려면 어디에서 만들어야 하나?', choices: ['클래스 본문 (`items = []`)', '`__init__` 안 (`self.items = []`)', '전역 변수', '`__str__` 안'], answer: 1, explain: '`__init__` 은 객체를 만들 때마다 호출되므로 객체마다 새 리스트가 생깁니다.' },
    { q: '`class Dog(Animal)` 에서 `Dog` 가 `speak()` 를 다시 정의하는 것을 무엇이라 하나?', choices: ['오버로딩', '오버라이딩', '캡슐화', '직렬화'], answer: 1, explain: '부모의 메서드를 자식이 재정의 = 오버라이딩.' }
  ]
}

  ]
});
})();
