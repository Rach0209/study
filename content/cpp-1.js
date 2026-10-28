/* C++ 기초 트랙 (1/2) — 1~5강
 * 표준: C++17.  출력 문자열은 콘솔 인코딩 문제를 피하려고 영문을 사용합니다.
 */
(() => {
const R = String.raw;
const fence = (lang, src) => '```' + lang + '\n' + src.replace(/^\n|\n$/g, '') + '\n```';

window.STUDY_TRACKS = window.STUDY_TRACKS || [];
window.STUDY_TRACKS.push({
  id: 'cpp', order: 2, title: 'C++ 기초', icon: '⚙️', color: '#00599c', level: '초급',
  desc: '메모리와 컴파일이 어떻게 동작하는지까지 배우는 시스템 언어. 게임·금융·자율주행·로봇(ROS2)·AI 추론 엔진, 그리고 임베디드(C)로 이어지는 가장 넓은 길.',
  prereq: 'Python 트랙 1~8강 (변수·조건·반복·함수 개념). 개념이 낯설면 먼저 Python 부터.',
  setup: 'C++17 컴파일러: g++ (Windows 는 MSYS2 의 mingw-w64, 또는 Visual Studio Build Tools). 설치가 어려우면 godbolt.org / onlinegdb.com 같은 온라인 컴파일러로 시작해도 됩니다.',
  lessons: [

/* ======================= 1 ======================= */
{
  id: 'cpp-01', unit: '1부. 시작과 기본 문법', title: '컴파일 모델과 첫 프로그램', time: '50분',
  summary: 'C++ 는 실행 전에 소스 코드 전체를 기계어로 번역(컴파일 + 링크)해 실행 파일을 만들고, 그 실행 파일은 main 에서 시작한다.',
  goals: ['소스 → 전처리 → 컴파일 → 링크 → 실행 파일의 흐름을 설명한다', '`g++` 로 직접 빌드하고 실행한다', '컴파일 오류 / 링크 오류 / 실행 중 오류를 구분한다'],
  terms: [
    { t: '컴파일(compile)', d: '소스 코드를 기계어(목적 파일, `.o`)로 번역하는 단계. 문법 검사와 **타입 검사**가 여기서 일어난다.' },
    { t: '링크(link)', d: '여러 목적 파일과 라이브러리를 이어 붙여 하나의 실행 파일로 만드는 단계. 함수 정의가 없으면 여기서 실패한다.' },
    { t: '전처리기(preprocessor)', d: '컴파일 전에 `#`으로 시작하는 줄(`#include` 등)을 **텍스트 수준에서** 처리하는 단계.' },
    { t: '정적 타입', d: '모든 변수/식의 타입이 **컴파일 시점에** 정해져 있는 것. Python 은 실행 중에 정해지는 동적 타입.' }
  ],
  sections: [
    { h: 'Python 과 무엇이 다른가', md: [
      'Python 은 `python hello.py` 하나로 실행했습니다. C++ 는 **먼저 번역해서 실행 파일을 만들고, 그 파일을 실행**합니다.',
      fence('', 'hello.cpp ──(전처리)──▶ ──(컴파일)──▶ hello.o ──(링크)──▶ hello(.exe) ──(실행)──▶ 화면'),
      '번역된 실행 파일은 기계어이므로 빠르고, 번역 단계에서 **타입 오류를 미리 잡아 줍니다.** 대신 코드를 고칠 때마다 다시 빌드해야 합니다.'] },
    { h: '빌드와 실행', md: [
      fence('bash', 'g++ -std=c++17 -Wall -Wextra hello.cpp -o hello\n./hello          # Windows: hello.exe 또는 .\\hello'),
      '`-std=c++17` 은 표준 버전, `-Wall -Wextra` 는 경고를 최대한 켜는 옵션입니다. **경고도 오류처럼 읽는 습관**을 들이세요 — C++ 에서 경고는 대부분 진짜 버그의 신호입니다.',
      '> Windows 에서 한글이 깨지면 터미널에서 `chcp 65001` 을 먼저 실행하거나, 학습용 출력은 영어로 쓰세요.'] },
    { h: '프로그램의 뼈대', md: [
      '- `#include <iostream>`: 입출력 기능의 **선언**이 들어 있는 헤더 파일 내용을 그 자리에 **복사해 붙인다.**',
      '- `int main()`: 프로그램이 **시작되는 함수**. 반환값 `0` 은 "정상 종료"를 뜻한다 (`main` 에서는 `return 0;` 을 생략해도 0).',
      '- `std::cout << 값`: 화면 출력. `<<` 로 이어 붙인다. `std::` 는 표준 라이브러리의 이름이 들어 있는 **네임스페이스**.',
      '- 모든 문장은 `;` 로 끝나고, 블록은 `{ }` 로 묶는다 (들여쓰기는 문법이 아니라 가독성).',
      '- `\'\\n\'` 은 줄바꿈. `std::endl` 은 줄바꿈 + 버퍼 비우기(flush)라 반복 출력에서는 느려질 수 있다.'] },
    { h: '오류는 세 종류', md: [
      '| 종류 | 언제 | 예 |', '|---|---|---|',
      '| 컴파일 오류 | 번역 중 | 세미콜론 누락, 타입 불일치, 선언 안 된 이름 |',
      '| 링크 오류 | 이어 붙일 때 | `undefined reference to ...` (선언만 있고 정의가 없음) |',
      '| 실행 중 오류 | 실행 파일 동작 중 | 0 으로 나누기, 잘못된 메모리 접근 (크래시) |',
      '**컴파일이 성공했다고 프로그램이 맞는 것은 아닙니다.** 컴파일러가 보장하는 것은 "문법과 타입이 맞다"까지입니다.'] },
    { h: '왜 C 가 아니라 C++ 인가', md: [
      'C++ 는 C 를 거의 포함(상위 호환에 가까움)하면서 클래스, 표준 컨테이너(`vector`, `string`), 스마트 포인터 등을 더한 언어입니다. 게임·금융·자율주행·로봇·AI 추론 엔진 등 **일반 소프트웨어 분야의 채용이 넓고**, 포인터와 메모리 개념은 C 와 그대로 공통입니다. 그래서 여기서 C++ 를 배우면 나중에 **임베디드(C 중심)** 로 갈 때 필요한 핵심도 대부분 이미 갖춘 셈입니다.'] }
  ],
  misconceptions: [
    { wrong: '"C++ 도 Python 처럼 한 줄씩 해석하며 실행된다."', right: '실행 전에 전체를 기계어로 번역한다. 문법/타입 오류가 하나라도 있으면 **실행 파일 자체가 만들어지지 않는다.**', why: '그래서 Python 은 오류 줄 직전까지 실행되지만, C++ 는 아무것도 실행되지 못합니다.' },
    { wrong: '"`#include` 는 Python 의 `import` 와 같다."', right: '`#include` 는 파일 내용을 **텍스트로 복사**하는 전처리 지시다. 모듈을 "불러와 실행"하는 것이 아니다.', why: '헤더에는 대개 "이런 함수가 있다"는 선언만 있고 실제 구현은 링크 단계에서 합쳐집니다.' },
    { wrong: '"컴파일 경고(warning)는 무시해도 된다."', right: '경고는 "문법은 맞지만 거의 확실히 버그"인 경우가 많다. `-Wall -Wextra` 를 켜고 경고 0개를 목표로 한다.', why: '초기화 안 된 변수, `if (x = 3)` 같은 실수가 경고로만 알려집니다.' },
    { wrong: '"`std::endl` 과 `\'\\n\'` 은 완전히 같다."', right: '`endl` 은 줄바꿈 후 출력 버퍼를 **강제로 비운다.** 대량 출력에서는 `\'\\n\'` 이 훨씬 빠르다.', why: '입출력은 느린 작업이라 버퍼에 모아서 한꺼번에 내보냅니다.' }
  ],
  examples: [
    { title: 'Hello, C++', lang: 'cpp', code: R`
#include <iostream>

int main() {
    std::cout << "Hello, C++!" << '\n';
    std::cout << "1 + 2 = " << 1 + 2 << '\n';
    return 0;
}
`, output: R`
Hello, C++!
1 + 2 = 3
`, notes: ['`<<` 보다 `+` 의 우선순위가 높아서 `1 + 2` 가 먼저 계산됩니다.', 'Python 의 `print` 와 달리 값 사이에 공백이 자동으로 들어가지 않습니다. 필요하면 직접 `" "` 를 넣으세요.'] },
    { title: '입력 받기', lang: 'cpp', stdin: 'Minsu 25\n', code: R`
#include <iostream>
#include <string>

int main() {
    std::string name;
    int age;
    std::cout << "name and age: ";
    std::cin >> name >> age;
    std::cout << name << " will be " << age + 1 << " next year\n";
    return 0;
}
`, output: R`
name and age: Minsu will be 26 next year
`, notes: ['`std::cin >> 변수` 는 공백/줄바꿈 단위로 끊어서 **변수의 타입에 맞게** 읽어 줍니다. Python 의 `input()` 이 항상 문자열이던 것과 다릅니다.'] }
  ],
  exercises: [
    { q: '컴파일러를 준비하고 `hello.cpp` 를 직접 빌드·실행해 보세요. 그다음 `;` 하나를 지우고 빌드해서 오류 메시지의 **줄 번호**를 읽어 보세요.', hint: 'g++ 가 없으면 먼저 설치하거나 온라인 컴파일러를 쓰세요. 오류 줄 번호는 "실제 문제 줄의 바로 다음 줄"로 표시될 때도 있습니다.', answer: '`g++ -std=c++17 -Wall hello.cpp -o hello` 후 `./hello`. `;` 를 지우면 `expected \';\' before ...` 같은 메시지가 나오고 실행 파일은 만들어지지 않습니다.' },
    { q: '`std::cout` 으로 자기소개 3줄을 출력하세요. 한 번은 `\'\\n\'`, 한 번은 `std::endl` 로 줄바꿈해 보세요.', hint: '`#include <iostream>` 을 잊지 마세요.', answer: fence('cpp', '#include <iostream>\nint main() {\n    std::cout << "name: Hong" << \'\\n\';\n    std::cout << "age: 25" << std::endl;\n    std::cout << "like: coding" << \'\\n\';\n}') },
    { q: '일부러 `main` 안에서 선언하지 않은 변수 `x` 를 출력해 보세요. 어느 단계의 오류인가요?', hint: '"컴파일 / 링크 / 실행 중" 중에서 고르세요.', answer: '컴파일 오류입니다 (`\'x\' was not declared in this scope`). 실행 파일이 만들어지지 않습니다.' }
  ],
  quiz: [
    { q: 'C++ 프로그램을 만드는 단계 순서로 알맞은 것은?', choices: ['링크 → 컴파일 → 전처리 → 실행', '전처리 → 컴파일 → 링크 → 실행', '컴파일 → 전처리 → 실행 → 링크', '실행 → 컴파일 → 링크'], answer: 1, explain: '전처리(`#include` 처리) → 컴파일(목적 파일) → 링크(실행 파일 생성) → 실행.' },
    { q: '`#include <iostream>` 의 정확한 의미는?', choices: ['iostream 모듈을 실행 중에 불러온다', 'iostream 헤더의 내용을 그 자리에 복사해 넣는다', '프로그램의 시작 지점을 지정한다', '입출력 속도를 높인다'], answer: 1, explain: '전처리기가 텍스트를 복사해 넣습니다. 함수의 실제 구현은 링크 단계에서 합쳐집니다.' },
    { q: '`undefined reference to \'foo()\'` 오류는 어느 단계에서 발생하나?', choices: ['전처리', '컴파일', '링크', '실행'], answer: 2, explain: '선언은 있지만 정의(구현)를 못 찾을 때 링크 단계에서 발생합니다.' },
    { q: '`int main()` 이 반환하는 `0` 의 의미로 알맞은 것은?', choices: ['정상 종료', '오류 발생', '출력할 값', '프로그램 반복 실행'], answer: 0, explain: '운영체제에 "정상 종료"를 알리는 값입니다. 0 이 아닌 값은 보통 오류를 뜻합니다.' },
    { q: '대량 출력 반복문에서 줄바꿈으로 더 효율적인 것은?', choices: ['`std::endl`', '`\'\\n\'`', '둘은 완전히 같다', '`std::flush`'], answer: 1, explain: '`endl` 은 매번 버퍼를 비우므로 느립니다. `\'\\n\'` 은 줄바꿈만 합니다.' },
    { q: '컴파일은 성공했지만 실행하자 프로그램이 죽었다. 이것이 의미하는 것은?', choices: ['컴파일러가 고장났다', '문법/타입은 맞지만 실행 중 논리·메모리 오류가 있다', '링크가 되지 않았다', '`main` 이 없다'], answer: 1, explain: '컴파일 성공은 문법과 타입의 정합성만 보장합니다. 실행 중 오류는 별개입니다.' }
  ]
},

/* ======================= 2 ======================= */
{
  id: 'cpp-02', unit: '1부. 시작과 기본 문법', title: '변수, 타입, 메모리 크기', time: '70분',
  summary: '모든 변수는 타입을 갖고, 타입은 메모리 크기와 표현 범위를 정한다. 초기화하지 않은 값과 범위를 넘는 연산은 정의되지 않은 동작이다.',
  goals: ['기본 타입과 정확한 크기가 필요할 때 쓰는 `<cstdint>` 타입을 구분한다', '정수 나눗셈·나머지·형변환 결과를 정확히 예측한다', '초기화와 정의되지 않은 동작(UB)의 의미를 설명한다'],
  terms: [
    { t: '정의되지 않은 동작 (UB, Undefined Behavior)', d: '언어 규칙상 **결과가 보장되지 않는** 동작. 크래시, 엉뚱한 값, 또는 "잘 돌아가는 것처럼 보임" 모두 가능하다. 가장 위험한 버그 유형.' },
    { t: '초기화(initialization)', d: '변수를 만들 때 값을 주는 것. 지역 변수는 초기화하지 않으면 **쓰레기 값**이 들어 있다.' },
    { t: '축소 변환 (narrowing)', d: '값이 손실될 수 있는 변환 (`double` → `int`, `int` → `char`). `{}` 초기화에서는 컴파일 오류가 된다.' },
    { t: '`sizeof`', d: '타입 또는 변수가 차지하는 **바이트 수**를 돌려주는 연산자.' }
  ],
  sections: [
    { h: '기본 타입', md: [
      '| 타입 | 용도 | 크기 |', '|---|---|---|',
      '| `int` | 정수 | **최소 16비트**, 보통 32비트 (구현마다 다름) |',
      '| `long long` | 큰 정수 | 최소 64비트 |', '| `double` / `float` | 실수 | 보통 64 / 32비트 (근사값) |',
      '| `char` | 문자 1개 = **작은 정수** | 항상 1바이트 |', '| `bool` | 참/거짓 | 보통 1바이트 |',
      '정확한 크기가 중요하면 `<cstdint>` 의 `std::int32_t`, `std::uint8_t`, `std::int64_t` 처럼 **비트 수가 이름에 있는 타입**을 씁니다. 임베디드·통신·파일 포맷에서 필수입니다.'] },
    { h: '초기화', md: [
      '- `int a = 5;`, `int b{5};` 모두 초기화. **지역 변수를 초기화 없이 읽으면 UB** 입니다 (Python 의 `NameError` 와 다릅니다 — 에러 없이 쓰레기 값을 읽습니다).',
      '- 중괄호 초기화 `int c{3.5};` 는 값이 손실되므로 **컴파일 오류**. `int c = 3.5;` 는 컴파일되고 조용히 `3` 이 됩니다.',
      '- `const` 는 값 변경 금지, `constexpr` 는 컴파일 시간에 값이 정해지는 상수. `auto x = 10 / 4.0;` 은 초기값으로 타입을 추론(`double`).'] },
    { h: '정수 연산', md: [
      '- 정수끼리의 `/` 는 **소수점 이하를 버립니다**(0 방향으로). `7 / 2 == 3`, `-7 / 2 == -3`.',
      '- `%` 의 부호는 **왼쪽 피연산자를 따릅니다**: `-7 % 2 == -1`. (Python 은 `-7 % 2 == 1`)',
      '- 실수 나눗셈을 하려면 한쪽을 `double` 로: `static_cast<double>(a) / b`.',
      '- `signed` 정수가 범위를 넘으면(overflow) **UB**, `unsigned` 는 2^n 으로 나눈 나머지로 **되감깁니다**(`0u - 1` 이 최댓값).'] },
    { h: 'char 는 숫자다', md: [
      '`char c = \'A\';` 는 문자 \'A\' 의 코드값 65 를 저장합니다. `c + 1` 은 `int`(66) 이고, `std::cout << c` 는 문자로 출력합니다. 문자로 되돌리려면 `static_cast<char>(c + 1)`.'] }
  ],
  misconceptions: [
    { wrong: '"`int` 는 항상 4바이트다."', right: '표준은 최소 범위만 보장한다. 보통 4바이트지만 항상은 아니다. 정확한 크기가 필요하면 `std::int32_t`.', why: '`sizeof(char)` 만 항상 1 입니다. 임베디드에서는 `int` 가 2바이트인 칩도 있습니다.' },
    { wrong: '"초기화하지 않은 `int x;` 는 0 이다."', right: '지역 변수는 **불확정 값(쓰레기)** 이며 읽으면 UB 다. (전역/static 변수만 0 으로 초기화된다.)', why: '"어쩌다 0 이 나와서 잘 돌던" 코드가 다른 컴퓨터에서 깨지는 전형적인 원인입니다.' },
    { wrong: '"`-7 / 2` 는 Python 처럼 `-4` 다."', right: 'C++ 는 0 방향으로 버려 `-3`, 나머지는 `-1`. Python 의 `//`, `%` 는 내림 기준이라 다르다.', why: '언어를 옮길 때 가장 자주 틀리는 부분입니다. 음수가 섞일 때 조심하세요.' },
    { wrong: '"`int` 가 최댓값을 넘으면 Python 처럼 알아서 커지거나 0 으로 되감긴다."', right: 'Python 의 `int` 는 무한 정밀도지만 C++ 의 `int` 는 고정 크기. `signed` 오버플로는 **UB**, `unsigned` 만 되감김이 보장된다.', why: '컴파일러는 "UB 는 일어나지 않는다"고 가정하고 최적화하기 때문에 예측 불가능한 결과가 나올 수 있습니다.' },
    { wrong: '"`char` 는 글자 전용이라 산술이 안 된다."', right: '`char` 는 1바이트 정수다. `\'A\' + 1` 은 `int` 66 이다.', why: '출력할 때 문자로 보이게 하려면 `char` 로 형변환해야 합니다.' }
  ],
  examples: [
    { title: '정수 나눗셈 · 나머지 · char · unsigned', lang: 'cpp', code: R`
#include <cstdint>
#include <iostream>

int main() {
    int a = 7, b = 2;
    std::cout << a / b << ' ' << a % b << ' ' << static_cast<double>(a) / b << '\n';
    std::cout << -7 / 2 << ' ' << -7 % 2 << '\n';

    char c = 'A';
    std::cout << c << ' ' << c + 1 << ' ' << static_cast<char>(c + 1) << '\n';

    std::uint32_t u = 0;
    u = u - 1;                         // unsigned: wraps around
    std::cout << u << '\n';

    std::cout << std::boolalpha << (3 > 2) << ' ' << (3 < 2) << '\n';
    return 0;
}
`, output: R`
3 1 3.5
-3 -1
A 66 B
4294967295
true false
`, notes: ['`std::boolalpha` 가 없으면 `bool` 은 `1`/`0` 으로 출력됩니다.'] },
    { title: '초기화 · 변환 · auto', lang: 'cpp', code: R`
#include <iostream>

int main() {
    constexpr int kMax = 100;
    int x{5};
    double d = 3.9;
    int t = d;                           // allowed, silently truncates to 3
    int y{static_cast<int>(d)};          // explicit conversion
    std::cout << x << ' ' << t << ' ' << y << ' ' << kMax << '\n';

    auto z = 10 / 4;                     // int / int -> int
    auto w = 10 / 4.0;                   // int / double -> double
    std::cout << z << ' ' << w << '\n';
    return 0;
}
`, output: R`
5 3 3 100
2 2.5
`, notes: ['`int y{d};` 처럼 `{}` 로 `double` 을 `int` 에 넣으면 컴파일 오류가 납니다. 실수를 막아 주므로 `{}` 초기화를 습관으로 삼으면 좋습니다.'] },
    { title: '정확한 크기의 정수형', lang: 'cpp', code: R`
#include <cstdint>
#include <iostream>

int main() {
    std::cout << sizeof(char) << ' ' << sizeof(std::int32_t) << ' ' << sizeof(std::int64_t) << '\n';
    return 0;
}
`, output: R`
1 4 8
` }
  ],
  exercises: [
    { q: '`int a = 17, b = 5;` 에 대해 몫, 나머지, 실수 나눗셈 결과를 출력하세요. 그다음 `a = -17` 로 바꿔 Python 결과(`-4`, `3`)와 비교해 보세요.', hint: '`static_cast<double>(a) / b`.', answer: '양수: `3 2 3.4`. 음수: C++ 는 `-3 -2` (Python 은 `-4 3`). 차이의 이유는 C++ 는 0 방향 절삭, Python 은 내림이기 때문입니다.' },
    { q: '`int x;` 를 초기화하지 않고 `std::cout << x;` 를 해 보세요. `-Wall -Wextra` 로 컴파일했을 때 컴파일러가 알려 주는 경고를 읽어 보세요.', hint: '`warning: \'x\' is used uninitialized` 라는 메시지가 나옵니다.', answer: '값이 매번 다르게 나올 수 있고, 경고가 뜨는 것이 정상입니다. 이것이 UB 의 실제 모습입니다.' },
    { q: '`char c = \'a\';` 를 대문자 `\'A\'` 로 바꾸는 코드를 쓰세요. (힌트: 소문자와 대문자의 코드 차이는 32)', hint: '`c - 32` 는 `int` 이므로 `char` 로 되돌려야 합니다.', answer: fence('cpp', 'char c = \'a\';\nchar up = static_cast<char>(c - 32);\nstd::cout << up << \'\\n\';   // A') }
  ],
  quiz: [
    { q: '`std::cout << -7 / 2 << \' \' << -7 % 2;` 의 출력은?', choices: ['-4 1', '-3 -1', '-3 1', '-4 -1'], answer: 1, explain: 'C++ 는 0 방향으로 절삭하므로 몫 -3, 나머지는 왼쪽 피연산자의 부호를 따라 -1 (-3×2 + (-1) = -7).' },
    { q: '`int x;` 만 선언하고 읽었다. 그 값은?', choices: ['항상 0', '항상 -1', '불확정(쓰레기) 값이며 읽는 것은 UB', '컴파일 오류'], answer: 2, explain: '지역 변수는 자동 초기화되지 않습니다.' },
    { q: '항상 정확히 32비트 정수가 필요할 때 쓰는 타입은?', choices: ['`int`', '`long`', '`std::int32_t`', '`double`'], answer: 2, explain: '`<cstdint>` 의 고정 크기 타입을 씁니다. `int` 의 크기는 구현에 따라 다릅니다.' },
    { q: '`char c = \'A\'; std::cout << c + 1;` 의 출력은?', accept: ['66'], explain: '`c + 1` 은 `int` 로 승격되어 66 이 출력됩니다. 문자 \'B\' 를 보려면 `static_cast<char>(c + 1)`.' },
    { q: '`int a = 3.9;` 후 `a` 의 값은?', choices: ['4', '3', '3.9', '컴파일 오류'], answer: 1, explain: '소수점 이하가 버려집니다. 반올림이 아닙니다. (`int a{3.9};` 였다면 컴파일 오류.)' },
    { q: '`std::uint32_t u = 0; u = u - 1;` 의 결과는?', choices: ['-1', '0', '4294967295', 'UB(정의되지 않음)'], answer: 2, explain: '부호 없는 정수는 2^32 로 나눈 나머지로 되감깁니다. UB 는 `signed` 오버플로에 해당합니다.' }
  ]
},

/* ======================= 3 ======================= */
{
  id: 'cpp-03', unit: '1부. 시작과 기본 문법', title: '제어문과 반복', time: '60분',
  summary: '조건과 반복의 구조는 Python 과 같지만, 블록은 중괄호로 정해지고 switch 는 break 가 없으면 다음 case 로 흘러내려간다.',
  goals: ['`if / switch / for / while / do-while` 을 알맞게 고른다', '`switch` 의 fall-through 와 `if` 조건 속 대입 같은 함정을 피한다', '변수의 유효 범위(scope)를 설명한다'],
  terms: [
    { t: '블록 스코프', d: '`{ }` 안에서 만든 변수는 그 블록이 끝나면 사라진다. `for (int i...)` 의 `i` 는 for 문 안에서만 유효.' },
    { t: 'fall-through', d: '`switch` 에서 `break` 가 없으면 해당 `case` 이후의 코드가 **다음 case 로 이어서** 실행되는 현상.' },
    { t: '단락 평가', d: '`A && B` 에서 A 가 거짓이면 B 를 평가하지 않는다. `A || B` 에서 A 가 참이면 B 를 평가하지 않는다.' }
  ],
  sections: [
    { h: 'Python 과 비교', md: [
      '| 항목 | Python | C++ |', '|---|---|---|',
      '| 조건 | `if x > 0:` | `if (x > 0) { ... }` (괄호 필수) |',
      '| 논리 연산 | `and or not` | `&& \\|\\| !` |',
      '| 블록 | 들여쓰기 | 중괄호 `{ }` |', '| 반복 | `for i in range(n)` | `for (int i = 0; i < n; ++i)` |',
      '| else if | `elif` | `else if` |',
      '`for (초기화; 조건; 증감)` 은 세 부분이 각각 "시작 전 1회 / 매 회 시작 전 검사 / 매 회 끝난 뒤 실행" 입니다.'] },
    { h: '반복문 고르기', md: [
      '- **for**: 횟수가 정해진 반복. `for (int i = 0; i < n; ++i)` — 0부터 n-1 까지 n 번.',
      '- **while**: 조건이 참인 동안. 먼저 검사하므로 한 번도 안 돌 수 있다.',
      '- **do-while**: 먼저 실행하고 나중에 검사하므로 **최소 1번은 실행**.',
      '- `break` 는 가장 가까운 반복문(또는 switch)을 끝내고, `continue` 는 이번 회차의 나머지를 건너뜁니다.'] },
    { h: 'switch', md: [
      '`switch (정수식) { case 값: ... break; default: ... }` — 정수/문자/열거형만 쓸 수 있습니다. 각 `case` 끝에 `break` 를 쓰지 않으면 다음 case 코드까지 실행됩니다. 의도한 fall-through 라면 주석으로 남기세요.'] },
    { h: '숫자도 조건이 된다', md: [
      '조건식 자리에서 **0 은 거짓, 0 이 아닌 값은 참**입니다. 그래서 `if (x = 3)` 처럼 `==` 대신 `=` 를 써도 **컴파일이 됩니다** (x 에 3 을 넣고, 그 값 3 이 참이라 항상 실행). Python 에서는 문법 오류가 났던 실수가 C++ 에서는 조용한 버그가 됩니다. 경고(`-Wall`)를 반드시 확인하세요.'] }
  ],
  misconceptions: [
    { wrong: '"`if (x = 3)` 은 컴파일 오류다."', right: '컴파일된다. `x` 에 3 을 **대입**하고 그 결과(3, 참)로 조건을 판단하므로 항상 참이다.', why: '비교는 `==`. 일부 개발자는 `if (3 == x)` 처럼 상수를 왼쪽에 쓰는 습관으로 방어하기도 합니다.' },
    { wrong: '"`switch` 는 일치하는 `case` 하나만 실행한다."', right: '일치하는 case 부터 시작해 `break` 를 만날 때까지 **아래로 계속** 실행한다.', why: '`break` 를 빼먹는 것이 switch 버그 1위입니다.' },
    { wrong: '"`for (int i = 0; ...)` 의 `i` 를 반복이 끝난 뒤에도 쓸 수 있다."', right: '`i` 는 for 문 안에서만 존재한다. 밖에서 쓰면 컴파일 오류. (Python 은 반복 변수가 남았다.)', why: '반복 후의 값이 필요하면 for 앞에서 변수를 선언하세요.' },
    { wrong: '"들여쓰기가 맞으면 `else` 는 내가 보는 `if` 에 붙는다."', right: '`else` 는 **가장 가까운 `if`** 에 붙는다. 들여쓰기는 컴파일러가 보지 않는다. 항상 `{ }` 를 쓰자.', why: '이를 dangling else 문제라 합니다. 한 줄짜리 본문에도 중괄호를 쓰면 사라집니다.' }
  ],
  examples: [
    { title: 'switch 의 fall-through', lang: 'cpp', code: R`
#include <iostream>

int main() {
    int day = 2;
    switch (day) {
        case 1:
            std::cout << "Mon\n";
        case 2:
            std::cout << "Tue\n";      // starts here
        case 3:
            std::cout << "Wed\n";      // falls through to here
            break;
        default:
            std::cout << "other\n";
    }
    return 0;
}
`, output: R`
Tue
Wed
`, notes: ['`day == 2` 인데 "Wed" 까지 출력됩니다. 의도하지 않았다면 `case 2` 끝에 `break;` 를 넣어야 합니다.'] },
    { title: '반복문 세 가지', lang: 'cpp', code: R`
#include <iostream>

int main() {
    int sum = 0;
    for (int i = 1; i <= 10; ++i) {
        if (i % 2 == 0) continue;      // skip even numbers
        sum += i;
    }
    std::cout << sum << '\n';          // 1+3+5+7+9

    int n = 5, fact = 1;
    while (n > 1) {
        fact *= n;
        --n;
    }
    std::cout << fact << '\n';         // 5!

    int k = 10;
    do {
        std::cout << k << ' ';         // runs at least once
        --k;
    } while (k > 8);
    std::cout << '\n';
    return 0;
}
`, output: R`
25
120
10 9
` },
    { title: 'if 조건 속의 대입', lang: 'cpp', code: R`
#include <iostream>

int main() {
    int x = 0;
    if (x = 3) {                       // assignment, not comparison!
        std::cout << "entered, x=" << x << '\n';
    }
    return 0;
}
`, output: R`
entered, x=3
`, notes: ['`-Wall` 로 컴파일하면 "suggest parentheses around assignment used as truth value" 경고가 뜹니다. 경고를 읽는 습관이 왜 중요한지 보여 주는 예입니다.'] },
    { title: 'dangling else', lang: 'cpp', code: R`
#include <iostream>

int main() {
    int a = 2, b = 0;
    if (a == 1)
        if (b == 1) std::cout << "A\n";
    else
        std::cout << "B\n";            // belongs to the inner if!
    return 0;
}
`, output: '', notes: ['`a == 1` 이 거짓이라 아무것도 출력되지 않습니다. 들여쓰기만 보면 `else` 가 바깥 `if` 의 것처럼 보여 "B" 가 나와야 할 것 같지만, 컴파일러는 가장 가까운 `if (b == 1)` 에 붙입니다.'] }
  ],
  exercises: [
    { q: '1부터 100까지 중 3의 배수이면서 5의 배수는 아닌 수의 합을 구하세요.', hint: '`i % 3 == 0 && i % 5 != 0`', answer: fence('cpp', '#include <iostream>\nint main() {\n    int sum = 0;\n    for (int i = 1; i <= 100; ++i) {\n        if (i % 3 == 0 && i % 5 != 0) sum += i;\n    }\n    std::cout << sum << \'\\n\';\n}') },
    { q: '`switch` 로 1~7 을 입력받아 평일/주말을 판별하세요. fall-through 를 일부러 활용해 보세요(예: 1~5 는 같은 출력).', hint: '`case 1: case 2: ... case 5: ... break;`', answer: fence('cpp', 'switch (d) {\n    case 1: case 2: case 3: case 4: case 5:\n        std::cout << "weekday\\n"; break;\n    case 6: case 7:\n        std::cout << "weekend\\n"; break;\n    default:\n        std::cout << "invalid\\n";\n}') },
    { q: '구구단 2단~9단을 중첩 `for` 로 출력하세요.', hint: '바깥 for 는 단, 안쪽 for 는 곱하는 수.', answer: fence('cpp', 'for (int dan = 2; dan <= 9; ++dan)\n    for (int i = 1; i <= 9; ++i)\n        std::cout << dan << " x " << i << " = " << dan * i << \'\\n\';') }
  ],
  quiz: [
    { q: '다음 코드의 실행 결과는?', code: 'int x = 1;\nswitch (x) {\n    case 1: std::cout << "A";\n    case 2: std::cout << "B"; break;\n    case 3: std::cout << "C";\n}', lang: 'cpp', choices: ['A', 'AB', 'ABC', 'B'], answer: 1, explain: 'case 1 부터 실행하고 break 가 없어서 case 2 로 이어진 뒤, case 2 의 break 에서 끝납니다.' },
    { q: '`int x = 0; if (x = 5) { ... }` 에 대한 설명으로 옳은 것은?', choices: ['컴파일 오류가 난다', '조건이 거짓이라 본문이 실행되지 않는다', 'x 에 5 가 대입되고 조건은 참이다', '런타임 오류가 난다'], answer: 2, explain: '대입식의 값은 대입된 값(5)이고 0 이 아니므로 참입니다.' },
    { q: '`for (int i = 0; i < 3; ++i) {}` 가 끝난 뒤 `i` 를 사용하면?', choices: ['3 이 출력된다', '2 가 출력된다', '컴파일 오류 (i 는 for 안에서만 유효)', '0 이 출력된다'], answer: 2, explain: '`for` 초기화에서 선언한 변수의 범위는 for 문 안입니다.' },
    { q: '최소 한 번은 반드시 실행되는 반복문은?', choices: ['for', 'while', 'do-while', 'range-for'], answer: 2, explain: 'do-while 은 본문을 실행한 뒤 조건을 검사합니다.' },
    { q: '`for (int i = 1; i < 10; i += 3)` 이 반복하는 횟수는? (숫자만)', accept: ['3'], explain: 'i = 1, 4, 7 에서 실행되고 10 에서 종료 → 3번.' },
    { q: '`else` 가 붙는 `if` 는?', choices: ['들여쓰기가 같은 `if`', '가장 바깥 `if`', '가장 가까운(바로 앞의) `if`', '가장 먼저 나온 `if`'], answer: 2, explain: '컴파일러는 들여쓰기를 보지 않고 가장 가까운 if 에 else 를 붙입니다. 항상 중괄호를 쓰세요.' }
  ]
},

/* ======================= 4 ======================= */
{
  id: 'cpp-04', unit: '1부. 시작과 기본 문법', title: '함수와 참조 전달', time: '70분',
  summary: 'C++ 함수는 기본적으로 인자를 "복사해서" 받는다. 원본을 바꾸거나 복사를 피하려면 참조(&)를 쓴다.',
  goals: ['함수의 선언과 정의를 구분한다', '값 전달 / 참조 전달 / const 참조 전달을 상황에 맞게 고른다', '오버로딩과 기본 인자를 사용한다'],
  terms: [
    { t: '선언(declaration) / 정의(definition)', d: '선언은 "이런 이름과 타입의 함수가 있다"는 소개(`int add(int, int);`), 정의는 실제 본문. 호출하려면 그 앞에 선언이 보여야 한다.' },
    { t: '값 전달(pass by value)', d: '인자의 **복사본**이 매개변수가 된다. 함수 안에서 바꿔도 원본은 그대로.' },
    { t: '참조(reference)', d: '`int& r = x;` — 이미 있는 변수의 **다른 이름(별칭)**. 새 변수를 만들지 않고 같은 메모리를 가리킨다.' },
    { t: '오버로딩(overloading)', d: '이름은 같고 **매개변수 목록이 다른** 함수를 여러 개 정의하는 것. 컴파일러가 인자에 맞는 것을 고른다.' }
  ],
  sections: [
    { h: '선언과 정의, 호출 순서', md: [
      'C++ 컴파일러는 파일을 **위에서 아래로** 읽습니다. 호출하는 줄 앞에서 함수를 아직 몰라서 오류가 나지 않게 하려면, 앞에 **선언(프로토타입)** 을 두고 정의는 나중에 적을 수 있습니다. 정의가 아예 없으면 링크 오류입니다.'] },
    { h: '세 가지 전달 방식', md: [
      '| 방식 | 문법 | 특징 | 쓸 때 |', '|---|---|---|---|',
      '| 값 | `void f(int x)` | 복사본. 원본 불변 | 작은 타입(int, double) 읽기만 할 때 |',
      '| 참조 | `void f(int& x)` | 원본을 직접 수정 | 결과를 호출한 쪽에 돌려줄 때 |',
      '| const 참조 | `void f(const std::string& s)` | 복사 없이 읽기만 가능 | **큰 객체(string, vector)를 읽기만 할 때** |',
      '**Python 과 가장 크게 다른 점**: Python 은 이름표(참조)를 넘겼지만, C++ 의 기본은 **값의 복사**입니다. `vector` 같은 큰 객체를 값으로 넘기면 전체가 복사되어 느려집니다.'] },
    { h: '오버로딩과 기본 인자', md: [
      '`int add(int, int)` 와 `double add(double, double)` 는 서로 다른 함수입니다. 반환 타입만 다른 오버로딩은 불가능합니다. 기본 인자는 **오른쪽 매개변수부터** 지정합니다: `int power(int base, int exp = 2)`.'] },
    { h: '지역 변수와 수명', md: [
      '함수 안의 변수는 함수가 끝나면 사라집니다. 따라서 **지역 변수에 대한 참조나 포인터를 반환하면 안 됩니다** — 이미 사라진 변수를 가리키는 "댕글링 참조"가 되어 UB 입니다. 값을 반환(`return x;`)하는 것은 안전합니다.'] }
  ],
  misconceptions: [
    { wrong: '"함수에서 매개변수를 바꾸면 원본도 바뀐다 (Python 리스트처럼)."', right: '값 전달이면 복사본만 바뀐다. 원본을 바꾸려면 `int&` 처럼 참조로 받아야 한다.', why: 'Python 에서 리스트를 넘기면 내용이 바뀌었던 것은 "같은 객체에 이름표가 붙었기 때문". C++ 는 복사가 기본이라 정반대입니다.' },
    { wrong: '"`const std::string&` 로 받으면 느려진다 / 값으로 받는 게 더 안전하다."', right: '큰 객체를 읽기만 한다면 `const &` 가 복사를 피하면서 수정도 막아 **가장 좋은** 방식이다.', why: '`const` 가 붙어 있으므로 함수 안에서 실수로 바꾸려 하면 컴파일 오류가 납니다.' },
    { wrong: '"함수가 지역 변수의 참조를 반환해도 값은 남아 있다."', right: '함수가 끝나는 순간 지역 변수는 소멸한다. 참조를 쓰는 순간 UB. (값을 반환하면 안전)', why: '때로 "정상 동작하는 것처럼" 보여서 더 위험합니다.' },
    { wrong: '"반환 타입이 다르면 같은 이름의 함수를 오버로딩할 수 있다."', right: '오버로딩은 **매개변수의 개수/타입**으로만 구분된다. 반환 타입만 다르면 컴파일 오류.', why: '호출 코드만 보고는 어느 것을 부를지 알 수 없기 때문입니다.' }
  ],
  examples: [
    { title: '값 / 참조 / const 참조', lang: 'cpp', code: R`
#include <iostream>
#include <string>

void inc_value(int x) { x += 1; }                 // modifies a copy
void inc_ref(int& x) { x += 1; }                  // modifies the original
int length_of(const std::string& s) {             // read-only, no copy
    return static_cast<int>(s.size());
}

int main() {
    int n = 10;
    inc_value(n);
    std::cout << n << '\n';
    inc_ref(n);
    std::cout << n << '\n';
    std::cout << length_of("hello") << '\n';
    return 0;
}
`, output: R`
10
11
5
` },
    { title: '오버로딩 · 기본 인자', lang: 'cpp', code: R`
#include <iostream>

int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }

int power(int base, int exp = 2) {
    int result = 1;
    for (int i = 0; i < exp; ++i) result *= base;
    return result;
}

int main() {
    std::cout << add(1, 2) << ' ' << add(1.5, 2.5) << '\n';
    std::cout << power(3) << ' ' << power(2, 10) << '\n';
    return 0;
}
`, output: R`
3 4
9 1024
`, notes: ['`add(1.5, 2.5)` 는 `double` 4.0 이지만 `cout` 은 `4` 로 출력합니다.'] },
    { title: '프로토타입 + swap', lang: 'cpp', code: R`
#include <iostream>

void swap_ints(int& a, int& b);        // declaration (prototype)

int main() {
    int x = 1, y = 2;
    swap_ints(x, y);
    std::cout << "x=" << x << " y=" << y << '\n';
    return 0;
}

void swap_ints(int& a, int& b) {       // definition
    int tmp = a;
    a = b;
    b = tmp;
}
`, output: R`
x=2 y=1
` }
  ],
  exercises: [
    { q: '`bool is_prime(int n)` 을 작성하고 2~50 사이의 소수를 출력하세요.', hint: '2 부터 `i * i <= n` 까지만 나눠 보면 충분합니다.', answer: fence('cpp', '#include <iostream>\nbool is_prime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; ++i)\n        if (n % i == 0) return false;\n    return true;\n}\nint main() {\n    for (int n = 2; n <= 50; ++n)\n        if (is_prime(n)) std::cout << n << \' \';\n    std::cout << \'\\n\';\n}') },
    { q: '두 값 중 최댓값과 최솟값을 **참조 매개변수**로 돌려주는 `void min_max(int a, int b, int& mn, int& mx)` 를 만들어 보세요.', hint: '`mn = (a < b) ? a : b;`', answer: fence('cpp', 'void min_max(int a, int b, int& mn, int& mx) {\n    mn = (a < b) ? a : b;\n    mx = (a < b) ? b : a;\n}') },
    { q: '`std::string` 을 값으로 받는 함수와 `const std::string&` 로 받는 함수를 만들어 긴 문자열을 100만 번 넘겨 시간 차이를 느껴 보세요(선택).', hint: '`<chrono>` 를 사용하거나 `time ./a.out`.', answer: '일반적으로 const 참조 쪽이 훨씬 빠릅니다(매번 문자열을 복사하지 않으므로). 단, 짧은 문자열은 최적화로 차이가 작을 수 있습니다.' }
  ],
  quiz: [
    { q: '다음 코드 실행 후 `n` 의 값은?', code: 'void f(int x) { x = 99; }\nint main() {\n    int n = 1;\n    f(n);\n    // n = ?\n}', lang: 'cpp', accept: ['1'], explain: '값 전달이라 `f` 의 `x` 는 `n` 의 복사본입니다. 원본은 그대로 1.' },
    { q: '큰 `std::vector` 를 읽기만 하는 함수의 매개변수로 가장 적절한 것은?', choices: ['`std::vector<int> v`', '`std::vector<int>& v`', '`const std::vector<int>& v`', '`std::vector<int>* v`'], answer: 2, explain: '복사를 피하면서 실수로 수정하지 못하게 막아 줍니다.' },
    { q: '다음 중 오버로딩이 **불가능한** 경우는?', choices: ['`int f(int)` 와 `int f(double)`', '`int f(int)` 와 `int f(int, int)`', '`int f(int)` 와 `double f(int)`', '`void f(int)` 와 `void f(const char*)`'], answer: 2, explain: '매개변수 목록이 같고 반환 타입만 다르면 구분할 수 없어 컴파일 오류입니다.' },
    { q: '함수 안에서 만든 지역 변수에 대한 **참조를 반환**하면?', choices: ['정상적이다', '컴파일러가 자동으로 복사해 준다', '함수가 끝나면 사라진 변수를 가리키므로 UB', '링크 오류'], answer: 2, explain: '댕글링 참조입니다. 값 자체를 반환하세요.' },
    { q: '`int power(int base, int exp = 2)` 에 대해 `power(5)` 의 값은?', accept: ['25'], explain: '`exp` 의 기본값이 2 라서 5² = 25.' }
  ]
},

/* ======================= 5 ======================= */
{
  id: 'cpp-05', unit: '1부. 시작과 기본 문법', title: '배열, string, vector', time: '70분',
  summary: '배열은 크기가 고정되고 범위 검사가 없다. 실무에서는 크기가 자라는 std::vector 와 std::string 을 쓰고, 이들은 대입하면 내용이 복사된다.',
  goals: ['C 배열의 한계(고정 크기·범위 검사 없음)를 안다', '`std::vector` 와 `std::string` 의 기본 연산을 쓴다', '`size()` 의 부호 없는 타입(`size_t`) 함정을 피한다'],
  terms: [
    { t: '배열(array)', d: '같은 타입의 값을 **연속된 메모리**에 나란히 둔 것. 크기는 컴파일 시간에 고정. `int a[5];`' },
    { t: '`std::vector<T>`', d: '크기가 자라고 줄 수 있는 배열. 원소는 연속된 메모리에 저장되며 메모리 관리를 자동으로 해 준다.' },
    { t: '`size_t`', d: '크기·개수를 나타내는 **부호 없는(unsigned)** 정수 타입. `v.size()` 의 반환 타입.' },
    { t: '범위 기반 for', d: '`for (int x : v)` — 컨테이너의 원소를 처음부터 끝까지 차례로 꺼내는 for. 수정하려면 `int& x`.' }
  ],
  sections: [
    { h: 'C 스타일 배열', md: [
      '`int arr[5] = {1, 2, 3, 4, 5};` — 크기 5 고정. `arr[i]` 로 접근하지만 **`i` 가 범위를 벗어나도 검사하지 않습니다.** `arr[10]` 은 UB: 에러 없이 이웃 메모리를 읽거나 덮어써서, 크래시나 이상한 값, 보안 취약점으로 이어집니다.',
      '배열을 함수에 넘기면 크기 정보가 사라지고 첫 원소를 가리키는 포인터가 됩니다(6강). 그래서 실무에서는 `std::vector` / `std::array` 를 선호합니다.'] },
    { h: 'std::vector', md: [
      fence('cpp', '#include <vector>\nstd::vector<int> v = {3, 1, 2};\nv.push_back(4);        // 끝에 추가\nv.size();              // 원소 개수\nv[0];  v.at(0);        // 접근 ([] 는 무검사, at 은 범위 검사 후 예외)\nv.back();  v.front();  // 마지막 / 첫 원소\nv.pop_back();          // 마지막 제거\nv.clear();             // 전부 제거'),
      '`std::vector<int> a(3, 7)` 는 **7이 3개**, `std::vector<int> b{3, 7}` 는 **원소 3과 7 두 개**입니다. 괄호와 중괄호가 다른 의미입니다.',
      '`b = a` 처럼 대입하면 **모든 원소가 복사**됩니다 (Python 의 별칭과 다릅니다).'] },
    { h: 'std::string', md: [
      '`std::string` 은 **수정할 수 있는** 문자열입니다 (Python / Java 의 문자열과 다릅니다). `s[0] = \'H\'`, `s += " world"`, `s.substr(6, 5)`, `s.find("w")`, `s.size()`.',
      '공백이 포함된 한 줄을 읽으려면 `std::getline(std::cin, line)`. (`cin >> s` 는 공백에서 끊깁니다.)'] },
    { h: 'size_t 의 함정', md: [
      '`v.size()` 는 **부호 없는** 정수입니다. 비어 있는 벡터에서 `v.size() - 1` 은 `-1` 이 아니라 **엄청나게 큰 수**로 되감깁니다. `for (int i = 0; i < v.size(); ++i)` 는 부호 있는/없는 비교 경고가 나므로, 인덱스가 필요 없으면 range-for 를 쓰고 필요하면 `size_t` 를 쓰세요.'] }
  ],
  misconceptions: [
    { wrong: '"크기 5인 배열의 `arr[10]` 을 읽으면 에러가 난다."', right: '아무 검사 없이 그 위치의 메모리를 읽는다 (UB). 에러 없이 쓰레기 값이 나오거나 어느 순간 크래시한다.', why: '"에러가 안 났다 = 맞다"가 아닙니다. 범위 검사가 필요하면 `at()` 을 쓰거나 인덱스를 직접 확인하세요.' },
    { wrong: '"`b = a` (vector) 는 Python 리스트처럼 같은 것을 가리킨다."', right: '원소 전체가 **복사**되어 서로 독립이다. 같은 대상을 가리키려면 참조(`&`)나 포인터를 쓴다.', why: 'C++ 의 변수는 이름표가 아니라 값을 직접 가진 "상자"에 가깝습니다. (Python 과 정반대)' },
    { wrong: '"`std::string` 도 불변이다."', right: '`std::string` 은 가변이다. 글자를 바꾸고 이어 붙일 수 있다.', why: 'Java 의 `String`, Python 의 `str` 은 불변이라 헷갈리기 쉽습니다.' },
    { wrong: '"`v.size() - 1` 은 비어 있으면 `-1` 이다."', right: '`size_t` 는 부호 없는 정수라 최댓값 근처의 큰 수가 된다. 반복문이 사실상 끝나지 않을 수 있다.', why: '`for (size_t i = 0; i + 1 < v.size(); ++i)` 처럼 뺄셈을 덧셈으로 바꿔 쓰면 안전합니다.' }
  ],
  examples: [
    { title: 'vector 기본', lang: 'cpp', code: R`
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {3, 1, 2};
    v.push_back(4);
    std::cout << v.size() << ' ' << v[0] << ' ' << v.back() << '\n';

    int sum = 0;
    for (int x : v) sum += x;                // copy of each element
    std::cout << sum << '\n';

    for (int& x : v) x *= 2;                 // reference: modifies elements
    std::cout << v[0] << ' ' << v[3] << '\n';

    std::vector<int> a(3, 7);                // three 7s
    std::vector<int> b{3, 7};                // two elements: 3 and 7
    std::cout << a.size() << ' ' << b.size() << '\n';
    return 0;
}
`, output: R`
4 3 4
10
6 8
3 2
` },
    { title: '대입은 복사', lang: 'cpp', code: R`
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {1, 2, 3};
    std::vector<int> b = a;                  // copies all elements
    b.push_back(4);
    std::cout << a.size() << ' ' << b.size() << '\n';
    return 0;
}
`, output: R`
3 4
` },
    { title: 'string 은 수정 가능', lang: 'cpp', code: R`
#include <iostream>
#include <string>

int main() {
    std::string s = "hello";
    s[0] = 'H';
    s += " world";
    std::cout << s << ' ' << s.size() << '\n';
    std::cout << s.substr(6, 5) << ' ' << s.find("world") << '\n';
    return 0;
}
`, output: R`
Hello world 11
world 6
` },
    { title: 'size_t 되감김', lang: 'cpp', code: R`
#include <cstddef>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> empty;
    std::size_t n = empty.size() - 1;        // unsigned: wraps to a huge number
    std::cout << (n > 1000000) << '\n';
    return 0;
}
`, output: R`
1
` },
    { title: '배열과 공백 포함 입력', lang: 'cpp', stdin: 'hello world\n', code: R`
#include <iostream>
#include <string>

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    int total = 0;
    for (int i = 0; i < 5; ++i) total += arr[i];
    std::cout << total << ' ' << sizeof(arr) / sizeof(arr[0]) << '\n';

    std::string line;
    std::getline(std::cin, line);
    std::cout << line.size() << '\n';
    return 0;
}
`, output: R`
15 5
11
`, notes: ['`sizeof(arr) / sizeof(arr[0])` 은 배열 **원래 변수**에서만 원소 개수를 구할 수 있습니다. 함수 매개변수로 넘어간 배열에서는 동작하지 않습니다.'] }
  ],
  exercises: [
    { q: '정수를 여러 개 입력받아(`0` 이 입력되면 종료) `vector` 에 저장하고, 합계·평균·최댓값을 출력하세요.', hint: '`while (std::cin >> n && n != 0)`. 평균은 `double` 로.', answer: fence('cpp', '#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v;\n    int n;\n    while (std::cin >> n && n != 0) v.push_back(n);\n    if (v.empty()) return 0;\n    int sum = 0, mx = v[0];\n    for (int x : v) { sum += x; if (x > mx) mx = x; }\n    std::cout << sum << \' \' << static_cast<double>(sum) / v.size() << \' \' << mx << \'\\n\';\n}') },
    { q: '문자열을 입력받아 모음(a, e, i, o, u)의 개수를 세세요.', hint: 'range-for 로 `char c : s` 를 돌며 비교.', answer: fence('cpp', 'int cnt = 0;\nfor (char c : s)\n    if (c==\'a\'||c==\'e\'||c==\'i\'||c==\'o\'||c==\'u\') ++cnt;') },
    { q: '`std::vector<int> v;` 가 비어 있을 때 `for (size_t i = 0; i <= v.size() - 1; ++i)` 가 왜 위험한지 설명하고, 안전한 형태로 고쳐 보세요.', hint: '`v.size() - 1` 이 무엇이 되는지 생각해 보세요.', answer: '`0 - 1` 이 `size_t` 의 최댓값이 되어 범위 밖 접근이 발생합니다. `for (size_t i = 0; i < v.size(); ++i)` 로 쓰면 안전합니다.' }
  ],
  quiz: [
    { q: '`int arr[5];` 에 대해 `arr[10]` 을 읽으면?', choices: ['항상 예외가 발생한다', '컴파일 오류', '검사 없이 접근하는 UB', '항상 0 이 반환된다'], answer: 2, explain: 'C 배열은 범위 검사를 하지 않습니다.' },
    { q: '`std::vector<int> a(3, 7);` 의 결과는?', choices: ['원소 {3, 7} 두 개', '원소 {7, 7, 7} 세 개', '원소 {3} 하나', '컴파일 오류'], answer: 1, explain: '소괄호 `(개수, 값)` 은 "값 7 을 3개"입니다. 중괄호 `{3, 7}` 이면 원소 두 개.' },
    { q: '`std::vector<int> a = {1,2}; auto b = a; b.push_back(3);` 후 `a.size()` 는?', accept: ['2'], explain: '`b = a` 는 복사이므로 `a` 는 변하지 않습니다.' },
    { q: '비어 있는 `std::vector<int> v;` 에서 `v.size() - 1` 의 값은?', choices: ['-1', '0', '1', '매우 큰 양수'], answer: 3, explain: '`size()` 는 부호 없는 정수라서 0 - 1 이 되감겨 최댓값 근처가 됩니다.' },
    { q: '`std::string` 에 대한 설명으로 옳은 것은?', choices: ['불변이라 `s[0]` 대입은 오류다', '수정 가능하다', '항상 최대 255자까지만 저장한다', '문자열 리터럴과 같은 타입이다'], answer: 1, explain: '`std::string` 은 가변이며 길이도 자유롭게 늘릴 수 있습니다.' },
    { q: '공백이 포함된 한 줄 전체를 읽기에 알맞은 것은?', choices: ['`std::cin >> s`', '`std::getline(std::cin, s)`', '`std::cout << s`', '`std::cin.get()`'], answer: 1, explain: '`cin >> s` 는 공백에서 끊깁니다.' }
  ]
}

  ]
});
})();
