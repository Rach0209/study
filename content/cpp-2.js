/* C++ 기초 트랙 (2/2) — 6~10강: 포인터, 메모리, 클래스, 상속, STL */
(() => {
const R = String.raw;
const fence = (lang, src) => '```' + lang + '\n' + src.replace(/^\n|\n$/g, '') + '\n```';
const track = (window.STUDY_TRACKS || []).find(t => t.id === 'cpp');
if (!track) return;

track.lessons.push(

/* ======================= 6 ======================= */
{
  id: 'cpp-06', unit: '2부. 메모리와 객체', title: '포인터와 참조', time: '80분',
  summary: '포인터는 "다른 변수의 주소를 담는 변수"이고, 참조는 "이미 있는 변수의 다른 이름"이다. 둘 다 원본을 직접 다루게 해 준다.',
  goals: ['`&`(주소)와 `*`(역참조)를 식에서 읽고 쓴다', '포인터와 참조의 차이를 표로 설명한다', '배열과 포인터의 관계, `nullptr`, 댕글링 포인터의 위험을 안다'],
  terms: [
    { t: '주소(address)', d: '메모리의 각 바이트에는 번호가 있다. 변수가 저장된 위치의 번호가 그 변수의 주소.' },
    { t: '포인터(pointer)', d: '**주소를 값으로 저장하는 변수**. `int*` 는 "int 가 있는 곳의 주소".' },
    { t: '역참조(dereference)', d: '포인터가 가리키는 곳으로 가서 값을 읽거나 쓰는 것. `*p`.' },
    { t: '`nullptr`', d: '"아무것도 가리키지 않음"을 나타내는 포인터 값. 이 값을 역참조하면 UB(보통 크래시).' },
    { t: '댕글링 포인터(dangling)', d: '이미 사라진(해제된) 메모리를 가리키는 포인터. 사용하면 UB.' }
  ],
  sections: [
    { h: '주소와 포인터', md: [
      fence('cpp', 'int x = 10;\nint* p = &x;   // p 에 x 의 주소를 저장 (p 는 x 를 "가리킨다")\n*p = 20;       // p 가 가리키는 곳(= x)에 20 을 쓴다\n// 이제 x 도 20'),
      '`*` 와 `&` 는 **쓰이는 자리**에 따라 의미가 다릅니다.',
      '| 자리 | `*` | `&` |', '|---|---|---|',
      '| 선언 (타입 옆) | `int* p` — 포인터 **타입** | `int& r` — 참조 **타입** |',
      '| 식 (값 앞) | `*p` — **역참조** | `&x` — **주소 연산자** |',
      '포인터도 변수라서 메모리를 차지합니다 (64비트 환경에서 보통 8바이트). 가리키는 대상의 크기와 무관합니다.'] },
    { h: '포인터 vs 참조', md: [
      '| | 포인터 | 참조 |', '|---|---|---|',
      '| 비어 있을 수 있나 | 가능 (`nullptr`) | 불가 (항상 대상이 있어야 함) |',
      '| 다른 대상으로 바꿀 수 있나 | 가능 (`p = &y;`) | **불가** (처음 묶인 대상에 평생 고정) |',
      '| 초기화 | 선택 (하지만 꼭 하자) | 선언할 때 필수 |',
      '| 쓰는 모양 | `*p`, `p->member` | 그냥 변수처럼 `r` |',
      '기본 원칙: **참조를 먼저 고려**하고, "없음(null)" 이 의미가 있거나 대상을 바꿔야 할 때 포인터를 씁니다.'] },
    { h: '배열과 포인터', md: [
      '배열 이름은 대부분의 식에서 **첫 원소의 주소**로 바뀝니다(decay). `p + 1` 은 주소에 1 바이트가 아니라 **원소 1개 크기(`sizeof(int)`)** 를 더합니다. 그래서 `arr[i]` 와 `*(arr + i)` 는 같은 뜻입니다.'] },
    { h: '안전하게 쓰기', md: [
      '- 포인터는 선언과 동시에 초기화한다: 가리킬 곳이 아직 없으면 `int* p = nullptr;`',
      '- 역참조하기 전에 `if (p != nullptr)` 로 확인한다.',
      '- 지역 변수나 이미 해제된 메모리의 주소를 오래 들고 있지 않는다.',
      '- 한 줄에 여러 개를 선언하지 않는다: `int* a, b;` 에서 `b` 는 **`int`** 입니다 (`*` 는 `a` 에만 적용).'] }
  ],
  misconceptions: [
    { wrong: '"`int* a, b;` 는 포인터 두 개를 만든다."', right: '`a` 만 `int*` 이고 `b` 는 그냥 `int` 다. 포인터 두 개는 `int *a, *b;`. 가장 안전한 것은 한 줄에 하나씩 선언하는 것.', why: '`*` 가 타입 옆에 붙어 쓰여도 문법상 변수 이름에 붙는 연산자 취급입니다.' },
    { wrong: '"참조 `r = d;` 는 `r` 이 `d` 를 가리키도록 바꾼다."', right: '참조는 한 번 묶이면 바꿀 수 없다. `r = d;` 는 `r` 이 묶인 **원래 변수에 d 의 값을 대입**한다.', why: '아래 예제로 직접 확인해 보세요 (`c d r` 이 `2 5 2` 가 됩니다).' },
    { wrong: '"`nullptr` 인 포인터를 역참조하면 0 이 읽힌다."', right: 'UB 이며 대부분 프로그램이 즉시 죽는다 (segmentation fault).', why: '사용 전에 항상 null 검사를 하거나, null 이 가능한 상황 자체를 설계로 없애세요.' },
    { wrong: '"포인터는 가리키는 값을 저장한다."', right: '포인터는 **주소**를 저장한다. 값을 얻으려면 역참조(`*p`)가 필요하다.', why: '`std::cout << p` 는 값이 아니라 주소를 출력하고, `std::cout << *p` 가 값을 출력합니다.' }
  ],
  examples: [
    { title: '주소 · 역참조 · nullptr', lang: 'cpp', code: R`
#include <iostream>

int main() {
    int x = 10;
    int* p = &x;                 // p holds the address of x
    *p = 20;                     // write through the pointer
    std::cout << x << ' ' << *p << '\n';
    std::cout << (p == &x) << '\n';

    int* q = nullptr;
    if (q == nullptr) std::cout << "q is null\n";
    return 0;
}
`, output: R`
20 20
1
q is null
` },
    { title: '배열 = 연속된 메모리 + 포인터 산술', lang: 'cpp', code: R`
#include <iostream>

int main() {
    int arr[4] = {10, 20, 30, 40};
    int* p = arr;                // the array name decays to a pointer to arr[0]
    std::cout << *p << ' ' << *(p + 2) << ' ' << p[3] << '\n';
    std::cout << arr[1] << ' ' << *(arr + 1) << '\n';
    ++p;                         // moves by sizeof(int) bytes
    std::cout << *p << '\n';
    return 0;
}
`, output: R`
10 30 40
20 20
20
` },
    { title: '포인터로 swap, 참조는 다시 묶이지 않는다', lang: 'cpp', code: R`
#include <iostream>

void swap_ptr(int* a, int* b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main() {
    int x = 1, y = 2;
    swap_ptr(&x, &y);
    std::cout << x << ' ' << y << '\n';

    int c = 1, d = 2;
    int& r = c;                  // r is another name for c
    r = d;                       // assigns d's value to c; does NOT rebind r
    d = 5;
    std::cout << c << ' ' << d << ' ' << r << '\n';
    return 0;
}
`, output: R`
2 1
2 5 2
` }
  ],
  exercises: [
    { q: '`int` 변수 `a`, `b` 와 포인터 `p` 로 `p = &a; *p = 7; p = &b; *p = 9;` 를 실행한 뒤 `a`, `b` 의 값을 먼저 예측하고 실행해 확인하세요.', hint: '`p` 가 바뀔 때마다 "지금 누구를 가리키는가"를 그려 보세요.', answer: '`a == 7`, `b == 9`. 그림을 그려 `p` 의 화살표가 `a` 에서 `b` 로 옮겨 가는 것을 확인하세요.' },
    { q: '배열 `{5, 3, 8, 1}` 의 합을 **포인터만으로**(인덱스 `[]` 없이) 구하세요.', hint: '`for (int* p = arr; p != arr + 4; ++p) sum += *p;`', answer: fence('cpp', 'int arr[4] = {5, 3, 8, 1};\nint sum = 0;\nfor (int* p = arr; p != arr + 4; ++p) sum += *p;\nstd::cout << sum << \'\\n\';   // 17') },
    { q: '`int* p;` (초기화 없음) 를 역참조하면 왜 위험한지 설명하고, 안전한 초기화 방법을 쓰세요.', hint: '쓰레기 주소가 들어 있는 상태를 생각해 보세요.', answer: '임의의 주소를 가리키므로 아무 메모리나 읽고 쓰게 되어 UB 입니다. `int* p = nullptr;` 로 초기화하고 사용 전에 null 검사를 합니다.' }
  ],
  quiz: [
    { q: '실행 후 출력은?', code: 'int x = 10;\nint* p = &x;\n*p = 20;\nstd::cout << x;', lang: 'cpp', accept: ['20'], explain: '`*p = 20` 은 p 가 가리키는 곳(x)에 20 을 씁니다.' },
    { q: '`int* a, b;` 에서 `b` 의 타입은?', choices: ['`int*`', '`int`', '`int&`', '컴파일 오류'], answer: 1, explain: '`*` 는 `a` 에만 붙습니다. 포인터 두 개는 `int *a, *b;`.' },
    { q: '참조와 포인터의 차이로 옳은 것은?', choices: ['참조는 null 일 수 있다', '포인터는 선언 때 반드시 초기화해야 한다', '참조는 한 번 묶이면 다른 대상으로 바꿀 수 없다', '둘은 완전히 같다'], answer: 2, explain: '참조는 초기화 필수이고 재바인딩이 불가능합니다. 포인터는 null 가능하고 다른 대상을 가리키도록 바꿀 수 있습니다.' },
    { q: '`int arr[4]` 에서 `*(arr + 1)` 과 같은 표현은?', choices: ['`arr[0]`', '`arr[1]`', '`&arr[1]`', '`arr + 1`'], answer: 1, explain: '`arr[i]` 는 `*(arr + i)` 의 다른 표기입니다.' },
    { q: '`nullptr` 를 가리키는 포인터를 역참조하면?', choices: ['0 이 반환된다', '컴파일 오류', '정의되지 않은 동작(대개 크래시)', '빈 문자열이 반환된다'], answer: 2, explain: '역참조 전에 null 검사를 해야 합니다.' },
    { q: '`int* p` 가 32비트 `int` 를 가리킬 때, `p + 1` 이 주소에 더하는 바이트 수는?', choices: ['1 바이트', '원소 1개 크기(`sizeof(int)` = 보통 4)', '8 바이트 고정', '0'], answer: 1, explain: '포인터 산술은 가리키는 타입의 크기를 단위로 합니다.' }
  ]
},

/* ======================= 7 ======================= */
{
  id: 'cpp-07', unit: '2부. 메모리와 객체', title: '스택, 힙, RAII, 스마트 포인터', time: '90분',
  summary: '지역 변수는 스택에 자동으로 생기고 사라지고, new 로 만든 힙 메모리는 직접 해제해야 한다. 현대 C++ 는 해제를 객체의 소멸에 맡기는 RAII(스마트 포인터)를 쓴다.',
  goals: ['스택과 힙의 수명 차이를 설명한다', '메모리 누수, 이중 해제, 댕글링의 원인을 구분한다', '`unique_ptr` / `shared_ptr` 의 소유권 개념을 이해하고 기본 사용을 한다'],
  terms: [
    { t: '스택(stack)', d: '함수의 지역 변수가 놓이는 영역. 블록이 끝나면 **자동으로** 사라진다. 빠르고 크기가 제한적.' },
    { t: '힙(heap)', d: '`new` 로 직접 요청하는 메모리 영역. 요청한 쪽이 **직접 반환(delete)** 하기 전에는 계속 남는다.' },
    { t: '메모리 누수(leak)', d: '더 이상 쓰지 않는 힙 메모리를 해제하지 않아 계속 쌓이는 것.' },
    { t: 'RAII', d: '"자원 획득은 초기화" — 자원(메모리, 파일, 락)을 객체의 **생성자에서 얻고 소멸자에서 반납**하여, 스코프를 벗어나면 자동 정리되게 하는 C++ 의 핵심 관용구.' },
    { t: '소유권(ownership)', d: '"이 메모리를 책임지고 해제할 주체"가 누구인지. `unique_ptr` 는 단독 소유, `shared_ptr` 는 공동 소유.' }
  ],
  sections: [
    { h: '스택과 힙', md: [
      '| | 스택 | 힙 |', '|---|---|---|',
      '| 만드는 법 | `int x = 1;` | `int* p = new int(1);` |',
      '| 해제 | 블록이 끝나면 자동 | `delete p;` 를 직접 |',
      '| 속도 | 매우 빠름 | 상대적으로 느림 |',
      '| 크기 | 작음 (수 MB) | 큼 (메모리가 허용하는 만큼) |',
      '| 수명 | 스코프에 묶임 | 해제할 때까지 |',
      '`new T` ↔ `delete`, `new T[n]` ↔ `delete[]` 는 **짝**입니다. 짝을 틀리면 UB.'] },
    { h: '직접 관리가 위험한 이유', md: [
      '- **누수**: `delete` 를 잊거나, 그 전에 `return` / 예외로 빠져나감',
      '- **이중 해제**: 같은 주소를 두 번 `delete`',
      '- **댕글링**: `delete p;` 이후 `p` 를 계속 사용 (`delete` 는 `p` 를 null 로 바꾸지 **않습니다** — 주소 값은 그대로 남아 있습니다)',
      '이런 버그는 에러 메시지 없이 가끔 이상한 값이 나오거나 어느 날 갑자기 크래시하는 형태로 나타나 찾기 어렵습니다.'] },
    { h: 'RAII 와 스마트 포인터', md: [
      '객체는 스코프를 벗어나면 **소멸자가 자동 호출**됩니다. 이를 이용해 "해제를 소멸자에 맡기는" 것이 RAII 입니다.',
      '- `std::unique_ptr<T>`: **단독 소유**. 복사 불가, 이동(`std::move`)만 가능. 기본 선택지.',
      '- `std::shared_ptr<T>`: **공동 소유**. 소유자 수(`use_count()`)가 0 이 되면 해제. 서로를 가리키는 순환 참조는 해제되지 않으므로 한쪽은 `std::weak_ptr`.',
      '- 생성은 `std::make_unique<T>(...)`, `std::make_shared<T>(...)`.',
      '현대 C++ 규칙: **직접 `new` / `delete` 를 쓰지 않는다.** 먼저 값(스택) → `vector`/`string` → 스마트 포인터 순으로 고려합니다.'] }
  ],
  misconceptions: [
    { wrong: '"`delete p;` 를 하면 `p` 가 `nullptr` 가 된다."', right: '`p` 는 해제된 주소를 그대로 들고 있는 댕글링 포인터가 된다. 필요하면 직접 `p = nullptr;`.', why: '해제된 메모리를 읽는 코드가 "가끔 정상 동작"하는 이유이자 위험성입니다.' },
    { wrong: '"프로그램이 끝나면 운영체제가 다 회수하니 누수는 신경 안 써도 된다."', right: '짧게 끝나는 프로그램에서는 티가 안 나지만, 서버·임베디드·로봇처럼 **오래 실행되는 프로그램**에서는 메모리가 계속 쌓여 결국 죽는다.', why: '누수 방지는 습관입니다. RAII 를 쓰면 신경 쓸 일 자체가 줄어듭니다.' },
    { wrong: '"C++ 에도 Java / Python 처럼 가비지 컬렉터가 있다."', right: '없다. 대신 객체 수명(스코프)과 소멸자에 의존한다. 이것이 예측 가능한 성능(실시간/임베디드에 유리)의 근거이기도 하다.', why: '"누가 해제하나?"에 항상 답할 수 있어야 합니다.' },
    { wrong: '"`shared_ptr` 만 쓰면 어떤 경우에도 누수가 없다."', right: '두 객체가 서로를 `shared_ptr` 로 가리키면 카운트가 0 이 되지 않아 영영 해제되지 않는다. 한쪽은 `weak_ptr` 로.', why: '"일단 shared_ptr" 보다 "단독 소유면 unique_ptr" 를 기본으로 하세요.' }
  ],
  examples: [
    { title: 'new / delete (직접 관리의 모양)', lang: 'cpp', code: R`
#include <iostream>

int main() {
    int* p = new int(42);
    std::cout << *p << '\n';
    delete p;                    // p is now dangling
    p = nullptr;                 // make it explicit

    int* arr = new int[3]{1, 2, 3};
    std::cout << arr[2] << '\n';
    delete[] arr;                // new[] pairs with delete[]
    return 0;
}
`, output: R`
42
3
` },
    { title: '소멸자가 자동으로 호출되는 순서', lang: 'cpp', code: R`
#include <iostream>
#include <memory>
#include <string>
#include <utility>

struct Tracer {
    std::string name;
    explicit Tracer(std::string n) : name(std::move(n)) { std::cout << "+" << name << '\n'; }
    ~Tracer() { std::cout << "-" << name << '\n'; }
};

int main() {
    Tracer a("a");
    {
        Tracer b("b");
    }                                         // b destroyed here
    auto p = std::make_unique<Tracer>("c");   // heap object owned by p
    std::cout << "end\n";
    return 0;
}                                             // p (c) then a are destroyed
`, output: R`
+a
+b
-b
+c
end
-c
-a
`, notes: ['`delete` 를 쓰지 않았는데도 `c` 가 정확히 해제됩니다. 지역 변수는 **만들어진 반대 순서**로 소멸합니다.'] },
    { title: '소유권: unique_ptr 이동, shared_ptr 개수', lang: 'cpp', code: R`
#include <iostream>
#include <memory>

int main() {
    auto p = std::make_unique<int>(5);
    auto q = std::move(p);                    // ownership moves from p to q
    std::cout << (p == nullptr) << ' ' << *q << '\n';

    auto s1 = std::make_shared<int>(42);
    {
        auto s2 = s1;                         // shared ownership
        std::cout << s1.use_count() << '\n';
    }
    std::cout << s1.use_count() << '\n';
    return 0;
}
`, output: R`
1 5
2
1
`, notes: ['`auto r = p;` (복사) 는 `unique_ptr` 에서는 **컴파일 오류**입니다. 단독 소유라는 규칙을 컴파일러가 강제해 줍니다.'] }
  ],
  exercises: [
    { q: '`new int[5]` 로 배열을 만들어 1~5 로 채우고 합을 출력한 뒤 올바르게 해제하세요. 그다음 `std::vector<int>` 로 바꿔 같은 일을 하고, 해제 코드가 사라지는 것을 확인하세요.', hint: '`delete[]`', answer: fence('cpp', 'int* a = new int[5];\nfor (int i = 0; i < 5; ++i) a[i] = i + 1;\nint s = 0; for (int i = 0; i < 5; ++i) s += a[i];\ndelete[] a;\n\n// vector 버전\nstd::vector<int> v = {1, 2, 3, 4, 5};   // 해제 코드 없음') },
    { q: '위 `Tracer` 예제에서 `Tracer a`, `Tracer b` 를 같은 스코프에 순서대로 선언하면 소멸 순서가 어떻게 되는지 예측하고 확인하세요.', hint: '나중에 만든 것이 먼저 사라집니다.', answer: 'b 가 먼저, 그다음 a 가 소멸합니다 (생성의 역순).' },
    { q: '`std::unique_ptr` 를 복사하려고 하면(`auto q = p;`) 어떤 오류가 나는지 확인하고, `std::move` 로 고치세요.', hint: '"use of deleted function" 이라는 메시지가 나옵니다.', answer: '`auto q = std::move(p);` — 이후 `p` 는 비어(nullptr) 있습니다.' }
  ],
  quiz: [
    { q: '다음 중 힙에 만들어진 객체의 설명으로 옳은 것은?', choices: ['블록이 끝나면 자동으로 사라진다', '`delete` 하기 전까지 남아 있다', '스택보다 항상 빠르다', '크기를 지정할 수 없다'], answer: 1, explain: '힙 메모리는 직접(또는 스마트 포인터가) 해제해야 합니다.' },
    { q: '`int* p = new int(1); delete p; std::cout << *p;` 에서 마지막 줄은?', choices: ['0 을 출력', '컴파일 오류', 'UB (댕글링 포인터 사용)', '정상 동작'], answer: 2, explain: '`delete` 이후 `p` 는 해제된 메모리를 가리킵니다.' },
    { q: '`new int[10]` 으로 만든 메모리를 해제하는 올바른 방법은?', choices: ['`delete p;`', '`delete[] p;`', '`free(p);`', '해제하지 않아도 된다'], answer: 1, explain: '`new[]` 는 `delete[]` 와 짝입니다.' },
    { q: '`std::unique_ptr` 에 대한 설명으로 옳은 것은?', choices: ['여러 포인터가 공동 소유할 수 있다', '복사할 수 없고 이동만 가능하다', '반드시 `new` 로 만들어야 한다', '순환 참조에 안전하다'], answer: 1, explain: '단독 소유를 표현하므로 복사가 금지됩니다. `std::move` 로 소유권을 넘깁니다.' },
    { q: '실행 후 출력되는 숫자는?', code: 'auto a = std::make_shared<int>(1);\nauto b = a;\nauto c = a;\nstd::cout << a.use_count();', lang: 'cpp', accept: ['3'], explain: '세 개의 `shared_ptr` 가 같은 객체를 소유하므로 3.' },
    { q: 'RAII 의 핵심 아이디어는?', choices: ['모든 변수를 전역으로 둔다', '자원을 생성자에서 얻고 소멸자에서 반납해 스코프 종료 시 자동 정리한다', '가비지 컬렉터가 메모리를 정리한다', '`delete` 를 여러 번 호출한다'], answer: 1, explain: 'C++ 에서 누수와 예외 안전성을 해결하는 대표 관용구입니다.' }
  ]
},

/* ======================= 8 ======================= */
{
  id: 'cpp-08', unit: '2부. 메모리와 객체', title: '클래스와 객체', time: '90분',
  summary: '클래스는 데이터와 기능을 묶고 private 으로 내부를 숨긴다. C++ 의 객체는 "값"이라서 대입하면 복사되고, 생성자와 소멸자가 수명을 관리한다.',
  goals: ['생성자(멤버 초기화 리스트), 소멸자, 접근 지정자를 사용한다', '`const` 멤버 함수와 `static` 멤버를 이해한다', '객체 대입이 복사임을 알고 Rule of Zero 를 따른다'],
  terms: [
    { t: '캡슐화(encapsulation)', d: '데이터를 `private` 으로 숨기고 공개 함수(`public`)로만 접근하게 해, 객체가 항상 올바른 상태를 유지하도록 하는 것.' },
    { t: '멤버 초기화 리스트', d: '`Account(int b) : balance_(b) {}` — 생성자 본문이 실행되기 **전에** 멤버를 직접 초기화하는 문법.' },
    { t: '`const` 멤버 함수', d: '`int balance() const` — 객체를 **변경하지 않겠다**는 약속. const 객체에서도 호출할 수 있다.' },
    { t: '`static` 멤버', d: '객체마다 따로 있는 것이 아니라 **클래스에 하나** 있는 멤버.' }
  ],
  sections: [
    { h: '클래스의 구성', md: [
      fence('cpp', 'class Account {\npublic:                       // 외부에 공개하는 인터페이스\n    Account(std::string owner, int balance = 0);   // 생성자\n    void deposit(int amount);\n    int balance() const;      // 객체를 바꾸지 않는 함수\nprivate:                      // 내부 구현 (외부 접근 불가)\n    std::string owner_;\n    int balance_;\n};'),
      '- `struct` 와 `class` 는 **기본 접근 지정자만 다릅니다** (`struct` 는 public, `class` 는 private).',
      '- 멤버 변수 이름 끝에 `_` 를 붙이는 것은 흔한 관례입니다.',
      '- 객체는 **값**입니다. `Account b = a;` 는 모든 멤버를 **복사**해 독립된 객체를 만듭니다. (Python / Java 는 같은 객체에 이름표가 하나 더 붙었음)'] },
    { h: '생성자와 소멸자', md: [
      '- 생성자는 객체가 만들어질 때, 소멸자(`~이름()`)는 스코프를 벗어나 사라질 때 자동 호출됩니다.',
      '- 멤버 초기화는 **초기화 리스트**로 합니다. `const` 멤버나 참조 멤버는 반드시 리스트에서 초기화해야 하고, 초기화 순서는 리스트에 쓴 순서가 아니라 **클래스 안에 선언된 순서**입니다.',
      '- 한 인자 생성자에는 `explicit` 을 붙여 의도하지 않은 암시적 변환을 막는 습관을 들입니다.'] },
    { h: 'Rule of Zero', md: [
      '메모리를 직접 관리하는 멤버(`int*` 와 `new`)를 두면 복사 생성자·복사 대입·소멸자를 모두 직접 정의해야 하는 "Rule of Three/Five" 에 빠집니다. 대신 멤버를 **`std::string`, `std::vector`, `std::unique_ptr`** 로 두면 컴파일러가 만든 기본 복사/소멸이 이미 올바르게 동작합니다. 이것이 **Rule of Zero** — 직접 쓰지 않는 것이 가장 좋은 코드입니다.'] },
    { h: '프로젝트에서의 모양 (미리 보기)', md: [
      '실제 프로젝트에서는 클래스 **선언**을 `account.h` (헤더), **구현**을 `account.cpp` 에 나누고 `#include "account.h"` 로 사용합니다. 헤더에는 `#pragma once` 를 맨 위에 둡니다. 로봇/임베디드 프로젝트 구조가 모두 이 방식입니다.'] }
  ],
  misconceptions: [
    { wrong: '"`Account b = a;` 는 Python 처럼 같은 객체를 공유한다."', right: '복사 생성으로 **독립된 객체**가 만들어진다. `b` 를 바꿔도 `a` 는 그대로. 공유하려면 참조/포인터를 쓴다.', why: 'Python / Java 는 객체를 참조로 다루고, C++ 는 값으로 다루는 것이 기본입니다.' },
    { wrong: '"`private` 은 보안 기능이라 외부에서 값을 못 읽게 막는다."', right: '`private` 은 **컴파일러가 접근을 검사**하는 설계 도구다. 보안(악의적 접근 방어)이 아니라 "실수로 망가뜨리지 않게 하는 안전장치"이다.', why: '목적은 객체가 항상 올바른 상태(불변식)를 유지하도록 하는 것입니다.' },
    { wrong: '"생성자 본문에서 `x_ = x;` 로 대입하는 것과 초기화 리스트는 같다."', right: '리스트는 **초기화**, 본문은 **초기화 후의 대입**이다. `const`·참조 멤버는 대입이 불가능하므로 리스트가 필수이고, 객체 멤버는 리스트가 더 효율적이다.', why: '본문에서는 이미 멤버가 기본 초기화된 뒤라는 것을 기억하세요.' },
    { wrong: '"`struct` 와 `class` 는 완전히 다른 개념이다."', right: '기본 접근 지정자(struct=public, class=private)만 다르다. 관례로 단순 데이터 묶음은 `struct`, 동작과 불변식이 있으면 `class`.', why: '둘 다 생성자, 상속, 멤버 함수를 가질 수 있습니다.' }
  ],
  examples: [
    { title: '클래스 · const 멤버 함수 · 복사', lang: 'cpp', code: R`
#include <iostream>
#include <string>
#include <utility>

class Account {
public:
    explicit Account(std::string owner, int balance = 0)
        : owner_(std::move(owner)), balance_(balance) {}

    void deposit(int amount) {
        if (amount > 0) balance_ += amount;     // keep the invariant
    }
    int balance() const { return balance_; }    // does not modify the object
    const std::string& owner() const { return owner_; }

private:
    std::string owner_;
    int balance_;
};

int main() {
    Account a("minsu", 100);
    Account b = a;                              // copy: independent object
    b.deposit(50);
    std::cout << a.balance() << ' ' << b.balance() << '\n';

    const Account c("jia");
    std::cout << c.owner() << ' ' << c.balance() << '\n';
    // c.deposit(1);   // error: deposit is not const
    return 0;
}
`, output: R`
100 150
jia 0
` },
    { title: 'static 멤버와 생성자/소멸자', lang: 'cpp', code: R`
#include <iostream>

class Counter {
public:
    Counter() { ++count_; }
    ~Counter() { --count_; }
    static int count() { return count_; }

private:
    static inline int count_ = 0;               // one shared variable (C++17)
};

int main() {
    std::cout << Counter::count() << '\n';
    Counter a;
    {
        Counter b;
        std::cout << Counter::count() << '\n';
    }                                           // b is destroyed here
    std::cout << Counter::count() << '\n';
    return 0;
}
`, output: R`
0
2
1
` },
    { title: 'struct 는 기본이 public', lang: 'cpp', code: R`
#include <iostream>

struct Point {
    int x;
    int y;
};

int main() {
    Point p{3, 4};
    Point q = p;
    q.x = 10;
    std::cout << p.x + p.y << ' ' << q.x + q.y << '\n';
    return 0;
}
`, output: R`
7 14
` }
  ],
  exercises: [
    { q: '`Rectangle` 클래스를 만드세요: 생성자(width, height), `area() const`, `perimeter() const`. 너비/높이가 0 이하이면 1 로 보정하세요.', hint: '`private` 멤버와 생성자 안의 검증.', answer: fence('cpp', 'class Rectangle {\npublic:\n    Rectangle(int w, int h) : w_(w > 0 ? w : 1), h_(h > 0 ? h : 1) {}\n    int area() const { return w_ * h_; }\n    int perimeter() const { return 2 * (w_ + h_); }\nprivate:\n    int w_, h_;\n};') },
    { q: '`Account` 에 `withdraw(int)` 를 추가하세요. 잔액보다 큰 금액이면 `false` 를 반환하고 변경하지 않아야 합니다.', hint: '반환형 `bool`.', answer: fence('cpp', 'bool withdraw(int amount) {\n    if (amount <= 0 || amount > balance_) return false;\n    balance_ -= amount;\n    return true;\n}') },
    { q: '`Counter` 예제에서 `Counter c = a;` (복사 생성)를 추가하면 `count()` 가 어떻게 될까요? 예측 후 확인해 보고, 왜 그런지 설명해 보세요.', hint: '복사 생성자는 직접 만들지 않았다는 점에 주목하세요.', answer: '컴파일러가 만든 복사 생성자는 `++count_` 를 호출하지 않으므로 카운터가 올라가지 않지만, 소멸 시에는 `--count_` 가 호출되어 **값이 어긋납니다**. 이 때문에 복사/소멸 규칙(Rule of Three/Five)이 중요합니다.' }
  ],
  quiz: [
    { q: '아래 코드의 출력은?', code: 'Account a("x", 100);\nAccount b = a;\nb.deposit(50);\nstd::cout << a.balance();', lang: 'cpp', accept: ['100'], explain: '`b = a` 는 복사라서 `b` 의 변경이 `a` 에 영향을 주지 않습니다.' },
    { q: '`struct` 와 `class` 의 차이로 옳은 것은?', choices: ['struct 는 멤버 함수를 가질 수 없다', '기본 접근 지정자가 다르다 (struct=public, class=private)', 'struct 는 힙에만 만들 수 있다', 'class 만 상속할 수 있다'], answer: 1, explain: '그 외의 기능은 같습니다.' },
    { q: '`int balance() const` 에서 `const` 의 의미는?', choices: ['반환값을 바꿀 수 없다', '이 함수는 객체의 멤버를 변경하지 않는다', '함수가 한 번만 호출될 수 있다', '컴파일 시간에 실행된다'], answer: 1, explain: 'const 객체에서도 호출할 수 있는 읽기 전용 함수라는 약속입니다.' },
    { q: '멤버 초기화는 어떤 순서로 이루어지나?', choices: ['초기화 리스트에 적은 순서', '클래스 안에 선언된 순서', '알파벳 순서', '무작위'], answer: 1, explain: '리스트를 다른 순서로 써도 선언 순서대로 초기화되므로(경고 발생) 리스트도 선언 순서에 맞추세요.' },
    { q: '`const` 멤버 변수를 초기화하는 올바른 방법은?', choices: ['생성자 본문에서 대입', '멤버 초기화 리스트', '소멸자에서 대입', '초기화할 수 없다'], answer: 1, explain: '`const` 는 대입이 불가능하므로 초기화 리스트에서 초기화해야 합니다.' },
    { q: '`private` 멤버의 가장 올바른 목적은?', choices: ['악의적 해킹 방어', '객체의 내부 상태를 함부로 바꾸지 못하게 해 불변식을 지킴', '실행 속도 향상', '메모리 절약'], answer: 1, explain: '컴파일러의 접근 검사로 설계상 실수를 막는 도구입니다.' }
  ]
},

/* ======================= 9 ======================= */
{
  id: 'cpp-09', unit: '3부. 객체 지향과 표준 라이브러리', title: '상속과 다형성', time: '90분',
  summary: '부모 타입의 포인터/참조로 자식 객체를 다루면서도 자식의 동작을 호출하려면 virtual 이 필요하다.',
  goals: ['상속과 `override` 로 동작을 재정의한다', '`virtual` 의 유무에 따른 호출 결과 차이를 설명한다', '가상 소멸자와 객체 슬라이싱의 위험을 피한다'],
  terms: [
    { t: '상속(inheritance)', d: '`class Dog : public Animal` — 부모의 멤버를 물려받는 "is-a(~는 ~이다)" 관계.' },
    { t: '다형성(polymorphism)', d: '같은 호출(`s->area()`)이 **객체의 실제 타입**에 따라 다르게 동작하는 것. C++ 에서는 `virtual` 로 실현.' },
    { t: '추상 클래스', d: '순수 가상 함수(`= 0`)를 하나라도 가진 클래스. 객체를 직접 만들 수 없고 인터페이스 역할을 한다.' },
    { t: '객체 슬라이싱', d: '자식 객체를 부모 타입 **값**에 대입/전달할 때 자식 부분이 잘려 나가는 현상.' }
  ],
  sections: [
    { h: '정적 바인딩 vs 동적 바인딩', md: [
      '기본적으로 C++ 의 함수 호출은 **변수의 선언된 타입**으로 결정됩니다 (컴파일 시점). 부모 참조/포인터가 자식 객체를 가리켜도 부모의 함수가 호출됩니다.',
      '부모 함수에 **`virtual`** 을 붙이면 **실제 객체의 타입**으로 실행 시점에 결정됩니다 (가상 함수 테이블 사용). 자식 클래스에서는 `override` 를 붙여 "부모의 가상 함수를 재정의한다"고 컴파일러에게 알립니다 — 함수 시그니처를 잘못 써서 오버라이드에 실패하면 컴파일 오류로 알려 줍니다.'] },
    { h: '가상 소멸자', md: [
      '부모 포인터로 자식 객체를 `delete` 할 때 부모의 소멸자가 `virtual` 이 아니면 **UB** 입니다 (자식의 소멸자가 호출되지 않아 자원이 누수됨). 상속을 염두에 둔 클래스에는 `virtual ~Base() = default;` 를 꼭 둡니다. (스마트 포인터를 써도 필요합니다.)'] },
    { h: '추상 클래스와 인터페이스', md: [
      '`virtual double area() const = 0;` 는 **순수 가상 함수** — 구현 없이 "자식이 반드시 구현해야 한다"고 선언합니다. 이런 클래스는 "Shape 처럼 모양이라는 개념만 있고 실체가 없는 것"을 표현할 때 씁니다. 로봇의 `Sensor`, `Motor` 같은 인터페이스가 대표 사례입니다.'] },
    { h: '다형성은 포인터/참조로', md: [
      '다형적으로 쓰려면 `std::vector<std::unique_ptr<Shape>>` 처럼 **포인터(스마트 포인터)나 참조**를 사용합니다. `std::vector<Shape>` 에 자식 객체를 넣으면 슬라이싱이 일어나 자식 부분이 사라집니다.'] },
    { h: '상속은 신중하게', md: [
      '상속은 "A 는 B 이다(is-a)" 가 진짜로 성립할 때만 씁니다. 단순히 코드를 재사용하려는 목적이라면 **멤버로 포함(has-a, 합성)** 하는 것이 대개 더 낫습니다.'] }
  ],
  misconceptions: [
    { wrong: '"부모 참조로 자식 객체를 가리키면 항상 자식의 함수가 호출된다."', right: '함수가 `virtual` 일 때만 그렇다. 그렇지 않으면 **참조의 선언된 타입**(부모)의 함수가 호출된다.', why: 'Java 는 모든 인스턴스 메서드가 기본적으로 가상이라 이 차이가 없습니다. C++ 는 명시해야 합니다.' },
    { wrong: '"부모 클래스의 소멸자는 virtual 이 아니어도 된다."', right: '부모 포인터로 자식을 `delete` 할 가능성이 있다면 **반드시 virtual**. 아니면 UB (자식 소멸자 미호출 → 누수).', why: '다형적으로 쓰이는 클래스는 `virtual ~Base() = default;` 를 습관처럼 둡니다.' },
    { wrong: '"`std::vector<Animal>` 에 `Dog` 를 넣어도 `Dog` 의 동작이 유지된다."', right: '`Animal` 부분만 복사되어 저장된다(슬라이싱). 다형성이 필요하면 `std::vector<std::unique_ptr<Animal>>`.', why: '값으로 저장하는 컨테이너는 "그 타입의 크기"만큼만 공간이 있습니다.' },
    { wrong: '"`override` 는 쓰나 안 쓰나 똑같으니 생략해도 된다."', right: '`override` 가 있으면 시그니처가 틀렸을 때(예: `const` 누락) **컴파일 오류**로 잡아 준다. 없으면 조용히 새로운 함수가 되어 다형성이 깨진다.', why: '안전장치입니다. 재정의에는 항상 `override` 를 쓰세요.' }
  ],
  examples: [
    { title: 'virtual 이 있을 때 / 없을 때', lang: 'cpp', code: R`
#include <iostream>

struct A {
    void hi() { std::cout << "A\n"; }                  // non-virtual
    virtual void hello() { std::cout << "A\n"; }       // virtual
};

struct B : A {
    void hi() { std::cout << "B\n"; }
    void hello() override { std::cout << "B\n"; }
};

int main() {
    B b;
    A& r = b;                  // base-class reference to a derived object
    r.hi();                    // decided by the declared type A
    r.hello();                 // decided by the actual type B
    return 0;
}
`, output: R`
A
B
` },
    { title: '추상 클래스와 다형성', lang: 'cpp', code: R`
#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;                              // pure virtual
    virtual std::string name() const { return "shape"; }          // default behavior
};

class Rect : public Shape {
public:
    Rect(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
    std::string name() const override { return "rect"; }
private:
    double w_, h_;
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return 3.0 * r_ * r_; }        // pi ~ 3 for simplicity
private:
    double r_;
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Rect>(2, 3));
    shapes.push_back(std::make_unique<Circle>(2));
    for (const auto& s : shapes)
        std::cout << s->name() << ' ' << s->area() << '\n';
    return 0;
}
`, output: R`
rect 6
shape 12
`, notes: ['`Circle` 은 `name()` 을 재정의하지 않아 부모의 기본 구현 `"shape"` 를 씁니다.', '`Shape s;` 처럼 추상 클래스를 직접 만들려 하면 컴파일 오류입니다.'] },
    { title: '객체 슬라이싱', lang: 'cpp', code: R`
#include <iostream>
#include <string>

struct Animal {
    virtual ~Animal() = default;
    virtual std::string sound() const { return "..."; }
};
struct Dog : Animal {
    std::string sound() const override { return "woof"; }
};

void by_value(Animal a) { std::cout << a.sound() << '\n'; }          // slicing!
void by_ref(const Animal& a) { std::cout << a.sound() << '\n'; }

int main() {
    Dog d;
    by_value(d);
    by_ref(d);
    return 0;
}
`, output: R`
...
woof
`, notes: ['값으로 받으면 `Dog` 가 `Animal` 부분만 복사되어 `Animal::sound()` 가 호출됩니다.'] }
  ],
  exercises: [
    { q: '`Shape`, `Rect`, `Circle` 예제에 `Triangle` 을 추가하세요. `main` 은 수정하지 않고 도형 목록에 하나만 더 넣어 총면적을 계산해 보세요.', hint: '`area()` 를 구현하고 `override` 를 붙이세요.', answer: fence('cpp', 'class Triangle : public Shape {\npublic:\n    Triangle(double b, double h) : b_(b), h_(h) {}\n    double area() const override { return 0.5 * b_ * h_; }\n    std::string name() const override { return "triangle"; }\nprivate:\n    double b_, h_;\n};\n// shapes.push_back(std::make_unique<Triangle>(4, 3));  // 면적 6') },
    { q: '위 `A` / `B` 예제에서 `hello()` 를 `virtual` 이 아니게 바꾸면 출력이 어떻게 달라질지 예측하고 확인하세요.', hint: '두 줄 모두 `A` 가 됩니다.', answer: '`r.hello()` 도 선언된 타입 `A` 의 함수를 호출하므로 `A A` 가 출력됩니다.' },
    { q: '`override` 를 쓴 상태에서 일부러 `area()` 의 `const` 를 빼고 컴파일해 보세요. 어떤 메시지가 나옵니까?', hint: '`marked \'override\', but does not override`', answer: '"marked override but does not override" 류의 오류로 실수를 즉시 알려 줍니다. `override` 가 없었다면 조용히 다른 함수가 만들어졌을 것입니다.' }
  ],
  quiz: [
    { q: '`virtual` 이 아닌 함수 `hi()` 를 부모 참조 `A& r` 로 호출하면 어느 함수가 실행되나?', choices: ['항상 자식의 `hi()`', '참조의 선언된 타입인 부모의 `hi()`', '컴파일 오류', '무작위'], answer: 1, explain: 'virtual 이 없으면 정적 바인딩 — 선언된 타입으로 결정됩니다.' },
    { q: '다형적으로 쓰는 부모 클래스에서 소멸자를 `virtual` 로 만드는 이유는?', choices: ['속도 향상', '부모 포인터로 `delete` 할 때 자식 소멸자도 호출되게 하려고', '컴파일을 통과하려고', '복사를 막으려고'], answer: 1, explain: '그렇지 않으면 UB 이며 자식의 자원이 정리되지 않을 수 있습니다.' },
    { q: '순수 가상 함수 `virtual void f() = 0;` 를 가진 클래스에 대해 옳은 것은?', choices: ['직접 객체를 만들 수 있다', '추상 클래스가 되어 직접 객체를 만들 수 없다', '`f` 는 구현을 가질 수 없다', '자식 클래스가 있을 수 없다'], answer: 1, explain: '자식이 `f` 를 구현해야 객체를 만들 수 있습니다.' },
    { q: '`std::vector<Animal> v; v.push_back(Dog());` 의 문제는?', choices: ['컴파일 오류', '슬라이싱으로 `Dog` 부분이 잘려 나간다', '메모리 누수', '문제 없음'], answer: 1, explain: '값으로 저장하는 컨테이너는 `Animal` 크기만큼만 복사합니다. 다형성을 쓰려면 스마트 포인터를 담으세요.' },
    { q: '`override` 키워드의 효과로 가장 알맞은 것은?', choices: ['함수를 더 빠르게 한다', '부모의 가상 함수를 재정의하는지 컴파일러가 검사해 준다', '함수를 private 으로 만든다', '함수가 호출되지 않게 한다'], answer: 1, explain: '시그니처 실수로 오버라이드가 안 되는 버그를 컴파일 시점에 잡습니다.' },
    { q: '단지 코드를 재사용하려고 상속을 쓰는 것에 대한 일반적인 조언은?', choices: ['적극 권장', 'is-a 관계가 아니라면 합성(멤버로 포함)을 먼저 고려', '`struct` 로만 가능', '반드시 `virtual` 이어야 함'], answer: 1, explain: '상속은 결합도가 높아 신중하게 써야 합니다.' }
  ]
},

/* ======================= 10 ======================= */
{
  id: 'cpp-10', unit: '3부. 객체 지향과 표준 라이브러리', title: 'STL, 람다, 템플릿', time: '90분',
  summary: '표준 템플릿 라이브러리(STL)는 컨테이너·반복자·알고리즘을 제공한다. 직접 만들기 전에 이미 있는지 먼저 찾아본다.',
  goals: ['`vector`, `map`, `set`, `unordered_map` 의 성격과 용도를 구분한다', '반복자 구간 `[begin, end)` 와 `<algorithm>` 의 주요 함수를 쓴다', '람다 식과 함수 템플릿을 읽고 쓴다'],
  terms: [
    { t: '컨테이너(container)', d: '데이터를 담는 자료구조 클래스: `vector`, `map`, `set`, `unordered_map` 등.' },
    { t: '반복자(iterator)', d: '컨테이너의 원소를 가리키며 순회하는 객체. 포인터와 비슷하게 `*it`, `++it` 를 쓴다. `end()` 는 **마지막 원소 다음**을 가리킨다.' },
    { t: '람다(lambda)', d: '`[캡처](매개변수){ 본문 }` — 이름 없는 작은 함수 객체. 알고리즘에 조건/비교 기준을 넘길 때 쓴다.' },
    { t: '템플릿(template)', d: '타입을 매개변수로 받는 코드 틀. 사용되는 타입마다 컴파일러가 **컴파일 시점에** 실제 코드를 생성한다.' }
  ],
  sections: [
    { h: '컨테이너 고르기', md: [
      '| 컨테이너 | 특징 | 검색 | 용도 |', '|---|---|---|---|',
      '| `vector<T>` | 연속 메모리, 순서 유지 | 인덱스 O(1), 값 검색 O(n) | **기본 선택** |',
      '| `map<K,V>` | **키 순서로 정렬**된 균형 트리 | O(log n) | 정렬된 키-값 |',
      '| `unordered_map<K,V>` | 해시 테이블, 순서 없음 | 평균 O(1) | 빠른 조회(Python dict 에 가까움) |',
      '| `set<T>` / `unordered_set<T>` | 중복 없는 집합 | O(log n) / 평균 O(1) | 중복 제거, 포함 검사 |',
      '일단 `vector` 로 시작하고, 필요가 생길 때 다른 컨테이너를 고릅니다.'] },
    { h: '반복자와 알고리즘', md: [
      '`<algorithm>` 의 함수들은 컨테이너가 아니라 **반복자 구간 `[first, last)`** 을 받습니다 (끝은 포함하지 않음 — Python 슬라이싱과 같은 규칙).',
      '`std::sort(v.begin(), v.end())`, `std::find`, `std::count_if`, `std::reverse`, `std::min_element`, 그리고 `<numeric>` 의 `std::accumulate`. 직접 반복문을 쓰기 전에 이미 있는 알고리즘인지 확인하세요.',
      '컨테이너를 순회하는 중에 **원소를 추가/삭제**하면 반복자가 무효화(invalidation)될 수 있어 UB 가 됩니다 (`vector::push_back` 은 재할당으로 모든 반복자를 무효화할 수 있음).'] },
    { h: '람다', md: [
      '`[](int a, int b) { return a > b; }` — 정렬 기준처럼 한 번 쓰는 함수를 그 자리에서 만듭니다.',
      '`[]` 안은 **캡처**: 바깥 변수를 쓰는 방법. `[x]` 는 **값 복사**(만든 시점의 값 고정), `[&x]` 는 **참조**(원본을 따라감), `[=]` / `[&]` 는 전부 값/참조.'] },
    { h: '함수 템플릿', md: [
      fence('cpp', 'template <typename T>\nT max_of(T a, T b) { return (a > b) ? a : b; }\n\nmax_of(3, 7);        // T = int\nmax_of(2.5, 1.5);    // T = double'),
      '`vector<int>` 와 `vector<string>` 도 같은 템플릿에서 만들어진 서로 다른 타입입니다. 템플릿 오류 메시지는 길지만, **맨 앞의 "required from here" 줄**부터 읽으세요.'] }
  ],
  misconceptions: [
    { wrong: '"`map` 에서 `m[key]` 는 값을 읽기만 한다."', right: '키가 없으면 **기본값으로 새 원소를 만들어 삽입**한다. 존재 확인은 `find` / `count` / `contains`(C++20) 로.', why: '`const map` 에서는 `operator[]` 를 쓸 수 없는 이유이기도 합니다.' },
    { wrong: '"`v.end()` 는 마지막 원소를 가리킨다."', right: '`end()` 는 마지막 원소 **바로 다음 위치**(원소가 아님). 역참조하면 UB. 마지막 원소는 `back()` 또는 `*(end() - 1)`.', why: '"끝은 포함하지 않는다"는 구간 규칙이 있기 때문에 빈 컨테이너도 `begin() == end()` 로 자연스럽게 표현됩니다.' },
    { wrong: '"템플릿은 실행 중에 타입을 보고 동작한다."', right: '**컴파일 시점에** 사용된 타입마다 코드가 생성된다. 실행 중 타입 판단이 아니다.', why: '그래서 타입 오류도 컴파일 단계에서 잡히며, 실행 속도 손해가 없습니다. 반면 사용된 모든 타입의 코드가 생성되어 실행 파일은 커질 수 있습니다.' },
    { wrong: '"람다의 `[x]` 는 x 를 참조한다."', right: '`[x]` 는 **값 복사**, `[&x]` 가 참조다. 값 캡처는 람다를 만든 순간의 값을 고정한다.', why: '아래 예제에서 `base` 를 나중에 바꿔도 `[base]` 람다 결과는 그대로입니다.' }
  ],
  examples: [
    { title: 'sort · count_if · accumulate · find', lang: 'cpp', code: R`
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> v = {5, 2, 8, 1, 9};
    std::sort(v.begin(), v.end());                              // ascending
    for (int x : v) std::cout << x << ' ';
    std::cout << '\n';

    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });   // descending
    std::cout << v.front() << '\n';

    int evens = std::count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
    std::cout << evens << '\n';
    std::cout << std::accumulate(v.begin(), v.end(), 0) << '\n';

    auto it = std::find(v.begin(), v.end(), 8);
    std::cout << (it != v.end()) << ' ' << (it - v.begin()) << '\n';
    return 0;
}
`, output: R`
1 2 5 8 9
9
2
25
1 1
`, notes: ['내림차순으로 정렬한 `v` 는 `{9, 8, 5, 2, 1}` 이라 8 의 위치(인덱스)는 1 입니다.'] },
    { title: 'map: 단어 세기 · [] 가 삽입한다', lang: 'cpp', code: R`
#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> words = {"to", "be", "or", "to", "be"};
    std::map<std::string, int> freq;
    for (const auto& w : words) ++freq[w];                  // missing key -> 0, then ++
    for (const auto& [word, n] : freq) std::cout << word << '=' << n << ' ';
    std::cout << '\n';

    std::map<std::string, int> m;
    if (m.find("x") == m.end()) std::cout << "none\n";
    int v = m["x"];                                         // inserts "x" with value 0
    std::cout << m.size() << ' ' << m.count("x") << ' ' << v << '\n';
    return 0;
}
`, output: R`
be=2 or=1 to=2
none
1 1 0
`, notes: ['`map` 은 키 순서(알파벳 순)로 순회됩니다. 삽입 순서가 아닙니다.', '구조적 바인딩 `[word, n]` 은 C++17 기능입니다 (`-std=c++17`).'] },
    { title: '람다 캡처와 템플릿', lang: 'cpp', code: R`
#include <iostream>
#include <string>

template <typename T>
T max_of(T a, T b) { return (a > b) ? a : b; }

int main() {
    std::cout << max_of(3, 7) << ' ' << max_of(2.5, 1.5) << ' '
              << max_of(std::string("apple"), std::string("banana")) << '\n';

    int base = 10;
    auto add_copy = [base](int x) { return x + base; };      // copies base now
    auto add_ref = [&base](int x) { return x + base; };      // follows base
    base = 100;
    std::cout << add_copy(1) << ' ' << add_ref(1) << '\n';
    return 0;
}
`, output: R`
7 2.5 banana
11 101
` }
  ],
  exercises: [
    { q: '`std::vector<std::string>` 의 문자열들을 길이 순으로 정렬하세요 (같은 길이는 사전순).', hint: '`std::sort` + 람다에서 길이 비교 후 같으면 문자열 비교.', answer: fence('cpp', 'std::sort(v.begin(), v.end(), [](const std::string& a, const std::string& b) {\n    if (a.size() != b.size()) return a.size() < b.size();\n    return a < b;\n});') },
    { q: '`std::unordered_map<char, int>` 로 문자열 `"banana"` 의 글자 빈도를 세어 출력하세요. (Python 7강의 글자 세기와 비교해 보세요)', hint: '`++count[ch]`', answer: fence('cpp', 'std::unordered_map<char, int> count;\nfor (char ch : std::string("banana")) ++count[ch];\nfor (const auto& [ch, n] : count) std::cout << ch << \'=\' << n << \'\\n\';   // 출력 순서는 보장되지 않음') },
    { q: '`vector<int>` 에서 짝수만 제거하는 코드를 `std::remove_if` 와 `erase` (erase–remove 관용구)로 작성해 보세요.', hint: '`v.erase(std::remove_if(...), v.end());`', answer: fence('cpp', 'v.erase(std::remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());') }
  ],
  quiz: [
    { q: '`std::map<std::string, int> m;` 에서 `int v = m["x"];` 를 실행한 뒤 `m.size()` 는? (키 "x" 는 처음 접근)', accept: ['1'], explain: '`operator[]` 는 키가 없으면 기본값(0)으로 원소를 삽입합니다.' },
    { q: '`v.end()` 가 가리키는 위치는?', choices: ['마지막 원소', '첫 원소', '마지막 원소의 바로 다음 위치', 'nullptr'], answer: 2, explain: '구간은 `[begin, end)` 로 끝을 포함하지 않습니다.' },
    { q: '다음 코드의 출력은?', code: 'int base = 10;\nauto f = [base](int x) { return x + base; };\nbase = 100;\nstd::cout << f(1);', lang: 'cpp', accept: ['11'], explain: '`[base]` 는 값 복사 캡처라 람다를 만든 시점의 10 이 고정됩니다. (`[&base]` 였다면 101)' },
    { q: '`std::map` 과 `std::unordered_map` 의 차이로 옳은 것은?', choices: ['`map` 은 키 순서로 정렬되고 `unordered_map` 은 순서가 없다', '`unordered_map` 이 항상 느리다', '`map` 은 키가 중복될 수 있다', '둘은 완전히 같다'], answer: 0, explain: '`map` 은 균형 트리(O(log n)), `unordered_map` 은 해시 테이블(평균 O(1))입니다.' },
    { q: '템플릿에 대한 설명으로 옳은 것은?', choices: ['실행 중에 타입을 판단해 동작한다', '사용된 타입마다 컴파일 시점에 코드가 생성된다', '타입을 바꿀 수 없다', '`virtual` 의 다른 이름이다'], answer: 1, explain: '컴파일 시간 다형성입니다.' },
    { q: '`std::sort(v.begin(), v.end(), comp)` 에서 세 번째 인자 `comp` 의 역할은?', choices: ['정렬할 개수', '두 원소의 순서를 판단하는 비교 기준', '결과를 저장할 컨테이너', '스레드 개수'], answer: 1, explain: '"a 가 b 앞에 와야 하면 true" 를 돌려주는 함수/람다입니다.' }
  ]
}

);
})();
