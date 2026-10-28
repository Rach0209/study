/* Java 기초 트랙 — 8강
 * 예제 규칙: 한 파일 안에서 main 이 있는 `public class Main` 을 맨 앞에 둡니다
 * (java Main.java 소스 실행 모드가 첫 번째 클래스를 실행하기 때문). 출력은 영문.
 */
(() => {
const R = String.raw;
const fence = (lang, src) => '```' + lang + '\n' + src.replace(/^\n|\n$/g, '') + '\n```';

window.STUDY_TRACKS = window.STUDY_TRACKS || [];
window.STUDY_TRACKS.push({
  id: 'java', order: 3, title: 'Java 기초', icon: '☕', color: '#e76f00', level: '초급',
  desc: '객체지향과 자료구조를 안전하게 배우기 좋은 언어. 가비지 컬렉터와 범위 검사 덕분에 C++ 보다 메모리 걱정이 적고, 기업용 서버·안드로이드 백엔드 채용이 많다.',
  prereq: 'Python 트랙 1~8강 + C++ 1~5강을 마쳤다면 훨씬 수월 (C++ 와 비교하며 배운다)',
  setup: 'JDK 17 이상 (Temurin / OpenJDK). 확인: 터미널에서 `java -version`, `javac -version`',
  lessons: [

/* ======================= 1 ======================= */
{
  id: 'jv-01', unit: '1부. 기본', title: 'JVM과 첫 프로그램', time: '45분',
  summary: 'Java 는 소스를 바이트코드(.class)로 컴파일하고, 운영체제마다 설치된 JVM 이 그 바이트코드를 실행한다.',
  goals: ['`javac` 와 `java` 의 역할을 구분한다', 'JDK / JRE / JVM 의 관계를 설명한다', '`main` 메서드의 형태와 문자열 연결 규칙을 안다'],
  terms: [
    { t: '바이트코드(bytecode)', d: 'JVM 이 이해하는 중간 언어. `.class` 파일에 들어 있다. 특정 CPU 의 기계어가 아니다.' },
    { t: 'JVM (Java Virtual Machine)', d: '바이트코드를 읽어 실제 컴퓨터에서 실행해 주는 가상 기계. 운영체제마다 JVM 이 있어서 같은 `.class` 가 어디서나 돈다.' },
    { t: 'JDK / JRE', d: 'JDK = 개발 도구(`javac` 컴파일러 등) + JRE. JRE = JVM + 표준 라이브러리 (실행만 가능). 개발자는 **JDK** 를 설치한다.' },
    { t: 'JIT 컴파일', d: '실행 중에 자주 쓰이는 바이트코드를 기계어로 바꿔 속도를 높이는 JVM 의 기능.' }
  ],
  sections: [
    { h: '컴파일 + 가상 머신', md: [
      fence('', 'Main.java ──javac──▶ Main.class (바이트코드) ──java(JVM)──▶ 실행'),
      '- `javac Main.java` : 소스 → 바이트코드. **문법/타입 오류가 여기서** 걸립니다 (C++ 처럼 정적 타입).',
      '- `java Main` : JVM 이 `Main.class` 를 실행합니다 (확장자 없이 클래스 이름).',
      '- JDK 11 이상은 단순 실습용으로 `java Main.java` (컴파일+실행 한 번에) 도 가능합니다.',
      'C++ 는 CPU 에 맞는 기계어로 바로 번역해 운영체제별로 따로 빌드해야 하지만, Java 는 **바이트코드를 한 번 만들면 JVM 이 있는 곳 어디서나** 실행됩니다.'] },
    { h: '프로그램의 뼈대', md: [
      fence('java', 'public class Main {                       // 파일 이름도 Main.java\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}'),
      '- Java 는 **모든 코드가 클래스 안**에 있습니다. `public` 클래스의 이름은 파일 이름과 같아야 합니다.',
      '- 시작점은 정확히 `public static void main(String[] args)` 입니다.',
      '- 문자열 연결: `+` 는 왼쪽부터 차례로 계산합니다. `"a" + 1 + 2` 는 `"a12"`, `1 + 2 + "a"` 는 `"3a"`.'] },
    { h: '출력과 입력', md: [
      '`System.out.println(값)` (줄바꿈 포함), `System.out.print(값)`, `System.out.printf("%d + %d%n", 2, 3)` (서식). 입력은 `java.util.Scanner` 의 `next()`, `nextInt()`, `nextLine()`.'] }
  ],
  misconceptions: [
    { wrong: '"Java 는 인터프리터 언어다 / 느리다."', right: '먼저 컴파일(바이트코드)하고, 실행 중에는 JIT 가 자주 쓰는 부분을 기계어로 바꿔 빠르게 만든다. 순수 인터프리터가 아니다.', why: '"컴파일 언어 vs 인터프리터 언어"는 이분법이 아니라 스펙트럼입니다. (Python 도 바이트코드를 쓰지만 JIT 이 기본이 아님)' },
    { wrong: '"JVM 은 Java 소스만 실행할 수 있다."', right: 'JVM 이 실행하는 것은 **바이트코드**다. Kotlin, Scala 등 다른 언어도 바이트코드로 컴파일되면 JVM 에서 돈다.', why: '그래서 안드로이드 앱과 서버 쪽에서 Kotlin 이 Java 와 섞여 쓰입니다.' },
    { wrong: '"`1 + 2 + "a"` 와 `"a" + 1 + 2` 는 같은 결과다."', right: '왼쪽부터 계산하므로 앞은 `"3a"`, 뒤는 `"a12"` 이다. 숫자끼리 먼저 더하려면 괄호 `"a" + (1 + 2)`.', why: '문자열이 한 번 등장한 뒤에는 `+` 가 모두 "이어 붙이기"가 됩니다.' },
    { wrong: '"JRE 만 설치하면 개발할 수 있다."', right: '컴파일러(`javac`)가 없다. 개발에는 **JDK** 가 필요하다.', why: '`javac -version` 이 동작하는지 확인하세요.' }
  ],
  examples: [
    { title: 'Hello + 문자열 연결 순서', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println("1 + 2 = " + (1 + 2));
        System.out.println("1 + 2 = " + 1 + 2);
    }
}
`, output: R`
Hello, Java!
1 + 2 = 3
1 + 2 = 12
`, notes: ['세 번째 줄은 `"1 + 2 = " + 1` 이 먼저 문자열이 된 뒤 `+ 2` 가 이어 붙습니다.'] },
    { title: 'print · printf', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        System.out.print("a");
        System.out.print("b\n");
        System.out.printf("%d + %d = %d%n", 2, 3, 5);
        System.out.printf("%.2f%n", 3.14159);
    }
}
`, output: R`
ab
2 + 3 = 5
3.14
`, notes: ['`%n` 은 운영체제에 맞는 줄바꿈, `%d` 정수, `%.2f` 소수 둘째 자리, `%s` 문자열.'] },
    { title: 'Scanner 로 입력 받기', lang: 'java', stdin: 'Minsu 25\n', code: R`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int age = sc.nextInt();
        System.out.println(name + " will be " + (age + 1));
    }
}
`, output: R`
Minsu will be 26
` }
  ],
  exercises: [
    { q: '`Main.java` 를 만들어 `javac Main.java` → `java Main` 순서로 실행해 보세요. 생성된 `Main.class` 파일을 확인하세요.', hint: '같은 폴더에서 실행해야 합니다.', answer: '`javac` 후 폴더에 `Main.class` 가 생기는 것을 확인합니다. `.class` 만 있으면 소스 없이도 JVM 이 실행할 수 있습니다.' },
    { q: '클래스 이름을 `Main` 이 아닌 `App` 으로 바꾸고 파일 이름은 그대로 두어 컴파일해 보세요. 어떤 오류가 나고 왜일까요?', hint: '`class App is public, should be declared in a file named App.java`', answer: 'public 클래스 이름과 파일 이름이 일치해야 하기 때문입니다.' },
    { q: '이름과 나이를 `Scanner` 로 입력받아 `printf` 로 "Hong (25)" 형태로 출력하세요.', hint: '`%s (%d)%n`', answer: fence('java', 'System.out.printf("%s (%d)%n", name, age);') }
  ],
  quiz: [
    { q: '`javac Main.java` 의 결과물은?', choices: ['실행 가능한 `.exe`', '`Main.class` (바이트코드)', '`Main.jar` 만 생성', '아무것도 생성되지 않음'], answer: 1, explain: '`javac` 는 소스를 바이트코드 `.class` 로 컴파일합니다.' },
    { q: '"운영체제가 달라도 같은 `.class` 파일이 실행된다"를 가능하게 하는 것은?', choices: ['JIT 컴파일러', 'JVM', '`javac`', '`Scanner`'], answer: 1, explain: '바이트코드를 각 운영체제용 JVM 이 해석·실행합니다.' },
    { q: '`System.out.println("a" + 1 + 2);` 의 출력은?', accept: ['a12'], explain: '왼쪽부터 계산: "a"+1 → "a1", 이후 +2 → "a12".' },
    { q: '`System.out.println(1 + 2 + "a");` 의 출력은?', choices: ['12a', '3a', 'a3', '1+2a'], answer: 1, explain: '`1 + 2` 가 먼저 숫자 3 으로 계산되고 이후 문자열과 이어집니다.' },
    { q: '개발(컴파일)을 하려면 반드시 설치해야 하는 것은?', choices: ['JRE', 'JVM 만', 'JDK', 'Scanner'], answer: 2, explain: 'JDK 에 `javac` 가 들어 있습니다.' }
  ]
},

/* ======================= 2 ======================= */
{
  id: 'jv-02', unit: '1부. 기본', title: '타입, 변수, String', time: '60분',
  summary: 'Java 의 타입은 값을 직접 담는 기본형(primitive)과 객체를 가리키는 참조형(reference)으로 나뉜다. 문자열 비교는 ==가 아니라 equals 다.',
  goals: ['기본형과 참조형의 차이를 설명한다', '`==` 와 `equals` 를 정확히 구분한다', '정수 나눗셈, 오버플로, 형변환 결과를 예측한다'],
  terms: [
    { t: '기본형(primitive)', d: '`int`, `long`, `double`, `boolean`, `char` 등 **값 자체**를 담는 8가지 타입. 소문자로 시작.' },
    { t: '참조형(reference)', d: '`String`, 배열, 클래스 등. 변수에는 객체의 **참조(주소 역할)** 가 들어 있고 객체는 힙에 있다. 아무것도 가리키지 않으면 `null`.' },
    { t: '불변(immutable)', d: '`String` 은 한 번 만들어지면 내용이 바뀌지 않는다. `toUpperCase()` 등은 새 문자열을 돌려준다.' },
    { t: '`final`', d: '변수에 붙이면 **재대입 금지**(C++ 의 `const` 와 비슷).' }
  ],
  sections: [
    { h: '기본형', md: [
      '| 타입 | 크기 | 비고 |', '|---|---|---|',
      '| `int` | **항상 32비트** | 약 ±21억 |', '| `long` | 64비트 | 리터럴은 `10L` |', '| `double` | 64비트 실수 | 기본 실수 타입 |',
      '| `boolean` | `true` / `false` | 0/1 로 대체 불가 |', '| `char` | 16비트 문자 | `\'A\'` (작은따옴표) |',
      'C++ 와 달리 크기가 **언어 차원에서 고정**입니다. 정수 나눗셈은 C++ 처럼 0 방향으로 절삭(`-7 / 2 == -3`), 나머지 부호는 왼쪽을 따릅니다.',
      '`int` 오버플로는 C++ 처럼 UB 가 아니라 **정의된 동작(되감김)** 입니다. `Integer.MAX_VALUE + 1` 은 최솟값이 됩니다. 에러 없이 조용히 되감기므로 더 위험할 수도 있습니다.'] },
    { h: '형변환', md: [
      '- 작은 타입 → 큰 타입은 자동(`int` → `long` → `double`).',
      '- 큰 타입 → 작은 타입은 **명시적 캐스트** 필요: `int x = (int) 3.9;` (값이 잘림).',
      '- `char + int` 는 `int`. 문자로 돌리려면 `(char)`. `var x = 10;` 은 타입 추론(지역 변수만).'] },
    { h: 'String 과 비교', md: [
      '`==` 는 기본형에서는 값 비교지만 **참조형에서는 "같은 객체인가"** 를 비교합니다. 문자열의 **내용**을 비교하려면 `a.equals(b)`.',
      '`"hello" == "hello"` 가 `true` 로 보이는 것은 같은 리터럴을 JVM 이 하나로 공유(interning)하기 때문이지, 비교 방식이 맞아서가 아닙니다. `new String("hello") == "hello"` 는 `false`.',
      '대입도 다릅니다: 기본형은 **값 복사**, 참조형은 **참조 복사**(둘이 같은 객체를 가리킴).'] }
  ],
  misconceptions: [
    { wrong: '"문자열 비교는 `==` 로 해도 된다."', right: '`==` 는 같은 객체인지 비교한다. 내용 비교는 `equals()`. 우연히 true 가 나오는 경우가 있어 더 위험하다.', why: 'Python 의 `==` 는 값 비교였기 때문에 가장 많이 틀리는 부분입니다.' },
    { wrong: '"`int` 가 최댓값을 넘으면 예외가 난다 / 자동으로 커진다."', right: '예외 없이 최솟값 쪽으로 **되감긴다.** 큰 수가 필요하면 `long`, `BigInteger`.', why: 'Python 은 정수가 무한히 커지고, C++ 는 UB, Java 는 되감기 — 세 언어가 모두 다릅니다.' },
    { wrong: '"`String s = "a"; s.toUpperCase();` 하면 `s` 가 대문자로 바뀐다."', right: '`String` 은 불변이라 **새 문자열을 반환**한다. `s = s.toUpperCase();` 처럼 받아야 한다.', why: 'C++ 의 `std::string` 은 가변이라는 점과 비교해 두세요.' },
    { wrong: '"기본형 변수도 객체 변수처럼 `null` 일 수 있다."', right: '기본형은 항상 값이 있다(`int` 기본 0). `null` 은 참조형만 가능하다.', why: '박싱 타입 `Integer` 는 참조형이라 `null` 이 가능하고, 그래서 6강 컬렉션에서 NPE 함정이 생깁니다.' }
  ],
  examples: [
    { title: '나눗셈 · 오버플로 · 캐스트 · char', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        int a = 7, b = 2;
        System.out.println(a / b + " " + a % b + " " + (double) a / b);
        System.out.println(-7 / 2 + " " + -7 % 2);

        int big = Integer.MAX_VALUE;
        System.out.println(big + 1);                 // wraps around silently
        long ok = (long) big + 1;
        System.out.println(ok);

        char c = 'A';
        System.out.println(c + 1);                   // int
        System.out.println((char) (c + 1));          // back to char
        System.out.println(0.1 + 0.2);
    }
}
`, output: R`
3 1 3.5
-3 -1
-2147483648
2147483648
66
B
0.30000000000000004
` },
    { title: '== 와 equals', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "hello";
        String s3 = new String("hello");
        System.out.println((s1 == s2) + " " + (s1 == s3) + " " + s1.equals(s3));

        String t = s1.toUpperCase();
        System.out.println(s1 + " " + t);
    }
}
`, output: R`
true false true
hello HELLO
`, notes: ['`s1 == s2` 가 true 인 것은 문자열 리터럴이 공유되기 때문입니다. 이 사실에 의존하지 마세요.'] },
    { title: '값 복사 vs 참조 복사', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        int x = 1;
        int y = x;          // copies the value
        y = 2;

        int[] p = {1};
        int[] q = p;        // copies the reference: same array
        q[0] = 2;

        System.out.println(x + " " + y + " " + p[0]);
    }
}
`, output: R`
1 2 2
` }
  ],
  exercises: [
    { q: '`int` 두 개를 입력받아 합, 차, 곱, 몫, 나머지, 실수 나눗셈 결과를 출력하세요. `a = 7, b = -2` 도 시험해 C++ 결과와 비교하세요.', hint: '`(double) a / b`', answer: '`7 / -2 == -3`, `7 % -2 == 1` (Java 도 C++ 와 같은 규칙). 실수 나눗셈은 `-3.5`.' },
    { q: '문자열 두 개를 입력받아 같은 내용인지 `==` 와 `equals` 로 각각 비교하고, 결과가 다르게 나오는 경우를 찾아보세요.', hint: '`sc.next()` 로 받은 두 문자열은 서로 다른 객체입니다.', answer: '사용자가 같은 글자를 입력해도 `==` 는 `false`, `equals` 는 `true` 가 나옵니다.' },
    { q: '`long` 타입으로 `Integer.MAX_VALUE` 에 1 을 더한 값을 올바르게 출력하세요 (2147483648).', hint: '더하기 전에 `long` 으로 바꿔야 합니다.', answer: fence('java', 'long v = (long) Integer.MAX_VALUE + 1;\nSystem.out.println(v);') }
  ],
  quiz: [
    { q: '`String a = new String("x"); String b = new String("x");` 일 때 `a == b` 는?', choices: ['true', 'false', '컴파일 오류', '실행마다 다름'], answer: 1, explain: '서로 다른 객체이므로 `==`(참조 비교)는 false. 내용 비교는 `a.equals(b)` (true).' },
    { q: '`System.out.println(Integer.MAX_VALUE + 1);` 의 결과는?', choices: ['2147483648', '예외 발생', '-2147483648', '컴파일 오류'], answer: 2, explain: '오버플로는 조용히 되감깁니다.' },
    { q: '`System.out.println(-7 / 2);` 의 출력은?', accept: ['-3'], explain: 'Java 도 C++ 처럼 0 방향으로 절삭합니다 (Python 의 `//` 와 다름).' },
    { q: '다음 중 `null` 을 저장할 수 있는 타입은?', choices: ['`int`', '`double`', '`String`', '`boolean`'], answer: 2, explain: '참조형만 `null` 이 가능합니다.' },
    { q: '`String s = "ab"; s.toUpperCase(); System.out.println(s);` 의 출력은?', choices: ['AB', 'ab', 'null', '컴파일 오류'], answer: 1, explain: '문자열은 불변이라 원본이 바뀌지 않습니다. 반환값을 받아야 합니다.' },
    { q: '`double d = 3.9; int i = (int) d;` 후 `i` 의 값은? (숫자만)', accept: ['3'], explain: '캐스트는 소수 부분을 버립니다 (반올림 아님).' }
  ]
},

/* ======================= 3 ======================= */
{
  id: 'jv-03', unit: '1부. 기본', title: '제어문과 배열', time: '60분',
  summary: '구조는 C++ 와 비슷하지만 조건은 반드시 boolean 이어야 하고, 배열은 객체라서 길이를 알고 범위를 벗어나면 예외가 난다.',
  goals: ['`if`, 새 `switch` 식, `for`, 향상된 `for` 를 쓴다', '배열의 기본값·길이·범위 검사·참조 특성을 안다', '`Arrays` 유틸리티를 사용한다'],
  terms: [
    { t: '배열(array)', d: '같은 타입 값의 고정 길이 나열. Java 에서 배열은 **객체**이며 길이는 `arr.length` (필드, 괄호 없음).' },
    { t: '향상된 for (for-each)', d: '`for (int v : arr)` — 원소를 처음부터 끝까지 차례로 꺼냄.' },
    { t: '예외(exception)', d: '실행 중 문제가 생겼을 때 던져지는 객체. 처리하지 않으면 프로그램이 종료되고 스택 트레이스가 출력된다 (7강).' }
  ],
  sections: [
    { h: 'C++ 와 다른 점', md: [
      '- 조건식은 **`boolean` 만** 가능합니다. `if (x = 3)` 은 `int` 이므로 **컴파일 오류** — C++ 의 대표 함정이 자동으로 막힙니다. `if (n)` 처럼 숫자를 조건으로 쓸 수도 없습니다.',
      '- `switch` 는 두 가지 형태가 있습니다. 전통 형태(`case X:` + `break`)는 C++ 처럼 fall-through 가 됩니다. **새 형태(`case X ->`)** 는 fall-through 가 없고 값을 돌려주는 식으로 쓸 수 있어 권장됩니다.',
      '- 지역 변수는 반드시 **초기화 후 사용**해야 컴파일됩니다 (컴파일러가 확인).'] },
    { h: '배열', md: [
      '- `int[] a = new int[3];` — 기본값으로 자동 초기화: 숫자 `0`, boolean `false`, 참조형 `null`.',
      '- `int[] b = {1, 2, 3};` 로 값을 바로 지정. 길이는 `b.length`.',
      '- 범위를 벗어나면 **`ArrayIndexOutOfBoundsException`** (C++ 는 UB 였음).',
      '- 배열은 참조형이라 `int[] q = p;` 는 **같은 배열**을 가리킵니다. 복사하려면 `p.clone()` 또는 `Arrays.copyOf(p, p.length)`.',
      '- `System.out.println(arr)` 는 `[I@1b6d3586` 같은 주소 비슷한 문자열을 찍습니다. 내용을 보려면 `Arrays.toString(arr)`, 2차원은 `Arrays.deepToString`.'] },
    { h: '자주 쓰는 Arrays', md: [
      '`Arrays.sort(a)`, `Arrays.fill(a, 값)`, `Arrays.toString(a)`, `Arrays.equals(a, b)`(내용 비교; `a.equals(b)` 는 참조 비교!), `Arrays.copyOf(a, n)`.'] }
  ],
  misconceptions: [
    { wrong: '"Java 에서도 `if (x = 3)` 이 실행된다."', right: '`int` 는 boolean 이 아니라서 컴파일 오류. 조건식은 반드시 `boolean`.', why: 'C++ 의 가장 흔한 실수 하나를 언어가 설계로 막았습니다.' },
    { wrong: '"배열 범위를 벗어나도 C++ 처럼 조용히 지나간다."', right: 'JVM 이 매번 검사해서 `ArrayIndexOutOfBoundsException` 을 던진다. 덕분에 버그가 즉시 드러난다.', why: '대신 검사 비용이 있으며, 이것이 C++ 와의 안전성/성능 trade-off 입니다.' },
    { wrong: '"`int[] q = p;` 는 배열을 복사한다."', right: '같은 배열을 가리키는 참조가 하나 더 생길 뿐이다. 복사는 `clone()` / `Arrays.copyOf`.', why: 'Python 리스트의 `b = a` 와 똑같은 함정입니다.' },
    { wrong: '"새 `switch` (`->`) 에서도 `break` 를 써야 한다."', right: '`->` 형태는 해당 분기만 실행하고 끝난다. fall-through 가 없다.', why: '새 코드에서는 이 형태를 쓰면 `break` 누락 버그가 사라집니다.' }
  ],
  examples: [
    { title: '전통 switch vs 새 switch 식', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        int day = 2;

        switch (day) {                      // traditional: falls through
            case 1: System.out.println("Mon");
            case 2: System.out.println("Tue");
            case 3: System.out.println("Wed"); break;
            default: System.out.println("other");
        }

        String name = switch (day) {        // new: no fall-through, returns a value
            case 1 -> "Mon";
            case 2 -> "Tue";
            case 3 -> "Wed";
            default -> "other";
        };
        System.out.println(name);
    }
}
`, output: R`
Tue
Wed
Tue
` },
    { title: '배열 기본', lang: 'java', code: R`
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] a = new int[3];
        System.out.println(Arrays.toString(a));              // default values

        a[0] = 5; a[1] = 3; a[2] = 8;
        Arrays.sort(a);
        System.out.println(Arrays.toString(a) + " " + a.length);

        int sum = 0;
        for (int v : a) sum += v;
        System.out.println(sum);

        String[] names = new String[2];
        System.out.println(names[0]);                        // reference default: null

        try {
            a[3] = 1;                                        // out of range
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("caught: " + e.getMessage());
        }
    }
}
`, output: R`
[0, 0, 0]
[3, 5, 8] 3
16
null
caught: Index 3 out of bounds for length 3
` },
    { title: '배열 참조 · 복사 · 2차원', lang: 'java', code: R`
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] p = {1, 2, 3};
        int[] q = p;                 // same array
        q[0] = 99;
        System.out.println(p[0]);

        int[] r = p.clone();         // independent copy
        r[1] = 77;
        System.out.println(p[1] + " " + r[1]);

        int[][] grid = new int[2][3];
        grid[1][2] = 7;
        System.out.println(Arrays.deepToString(grid));
    }
}
`, output: R`
99
2 77
[[0, 0, 0], [0, 0, 7]]
` },
    { title: '반복문', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) System.out.print(i + " ");
        System.out.println();

        int n = 0;
        while (n < 3) {
            n++;
            if (n == 2) continue;
            System.out.print(n + " ");
        }
        System.out.println();
    }
}
`, output: R`
0 1 2
1 3
` }
  ],
  exercises: [
    { q: '정수 배열 `{4, 9, 2, 7}` 의 최댓값·최솟값·평균을 구하세요 (평균은 `double`).', hint: '`sum / (double) arr.length`', answer: fence('java', 'int[] a = {4, 9, 2, 7};\nint max = a[0], min = a[0], sum = 0;\nfor (int v : a) { max = Math.max(max, v); min = Math.min(min, v); sum += v; }\nSystem.out.println(max + " " + min + " " + sum / (double) a.length);') },
    { q: '배열 `{1,2,3,4,5}` 를 뒤집어 출력하세요 (새 배열 없이 제자리에서).', hint: '앞과 뒤에서 한 칸씩 안쪽으로 교환.', answer: fence('java', 'for (int i = 0, j = a.length - 1; i < j; i++, j--) {\n    int t = a[i]; a[i] = a[j]; a[j] = t;\n}') },
    { q: '`new switch` 로 점수(0~100)를 받아 "A/B/C/D/F" 학점을 돌려주는 코드를 작성해 보세요.', hint: '`score / 10` 으로 구간을 나누고 `case 10, 9 ->`.', answer: fence('java', 'String g = switch (score / 10) {\n    case 10, 9 -> "A";\n    case 8 -> "B";\n    case 7 -> "C";\n    case 6 -> "D";\n    default -> "F";\n};') }
  ],
  quiz: [
    { q: '`int x = 0; if (x = 5) { }` 를 컴파일하면?', choices: ['정상 컴파일, 조건 참', '정상 컴파일, 조건 거짓', '컴파일 오류 (int 는 boolean 이 아님)', '실행 중 예외'], answer: 2, explain: 'Java 의 조건식은 반드시 boolean 이어야 합니다.' },
    { q: '`int[] a = new int[3]; System.out.println(a[3]);` 의 결과는?', choices: ['0 출력', 'null 출력', 'ArrayIndexOutOfBoundsException', '컴파일 오류'], answer: 2, explain: '유효한 인덱스는 0~2 입니다. 범위를 벗어나면 실행 중 예외가 납니다.' },
    { q: '`int[] p = {1}; int[] q = p; q[0] = 9; System.out.println(p[0]);` 의 출력은?', accept: ['9'], explain: '`q = p` 는 같은 배열을 가리키게 하므로 p 에서도 보입니다.' },
    { q: '새 `switch` 식 (`case X -> ...`) 의 특징은?', choices: ['fall-through 가 있다', 'fall-through 가 없고 값을 돌려줄 수 있다', '문자열을 쓸 수 없다', 'default 를 쓸 수 없다'], answer: 1, explain: '`break` 누락 버그가 원천적으로 사라집니다.' },
    { q: '배열의 내용을 사람이 읽을 수 있게 출력하려면?', choices: ['`System.out.println(arr)`', '`Arrays.toString(arr)`', '`arr.toString`', '`arr.print()`'], answer: 1, explain: '`println(arr)` 은 `[I@해시` 같은 문자열을 출력합니다.' }
  ]
},

/* ======================= 4 ======================= */
{
  id: 'jv-04', unit: '2부. 객체지향', title: '클래스와 객체', time: '80분',
  summary: 'Java 의 객체 변수는 참조이므로 대입하면 같은 객체를 공유한다. 메서드는 언제나 값 전달이지만, 객체의 경우 "참조의 복사본"이 전달된다.',
  goals: ['필드·생성자·메서드·`this`·`static` 을 쓴다', '참조 대입과 `null`, `NullPointerException` 을 이해한다', '"Java 는 항상 값에 의한 전달"을 정확히 설명한다'],
  terms: [
    { t: '인스턴스 / 정적(static)', d: '인스턴스 멤버는 객체마다 있고, `static` 멤버는 **클래스에 하나** 있다 (`Account.getCount()`).' },
    { t: '캡슐화', d: '필드를 `private` 으로 숨기고 getter/메서드로만 접근해 객체의 상태를 보호한다.' },
    { t: '`this`', d: '현재 객체 자신을 가리키는 참조. 필드와 매개변수 이름이 같을 때 `this.owner = owner;`.' },
    { t: '가비지 컬렉션(GC)', d: '아무도 참조하지 않는 객체를 JVM 이 자동으로 정리하는 기능. `delete` 가 없다.' }
  ],
  sections: [
    { h: '클래스와 객체 만들기', md: [
      '`new Account("minsu", 100)` 은 객체를 힙에 만들고 **참조**를 돌려줍니다. 변수 `Account a` 에는 그 참조가 들어 있습니다.',
      '- `Account b = a;` 는 **복사가 아니라 같은 객체 공유**입니다 (C++ 와 정반대).',
      '- `a == b` 는 같은 객체인지 비교합니다. 내용 비교는 `equals()` 를 정의해서 사용 (6강).',
      '- 참조에 `null` 이 들어 있는데 멤버에 접근하면 **`NullPointerException`**.',
      '- `toString()` 을 재정의하면 `println(객체)` 가 원하는 형태로 출력됩니다.',
      '- 메모리 해제는 GC 가 합니다. 직접 `delete` 할 수 없고, 참조가 모두 사라지면 정리 대상이 됩니다.'] },
    { h: '메서드 인자 전달', md: [
      'Java 는 **항상 값에 의한 전달**입니다. 객체를 넘기면 "객체의 참조값이 복사되어" 전달됩니다.',
      '- 매개변수로 받은 참조로 **객체의 내용을 바꾸면** 호출한 쪽에서도 보입니다 (같은 객체).',
      '- 매개변수에 **새 객체를 대입**(`arr = new int[]{...}`)하면 지역 변수만 바뀌고 호출한 쪽은 그대로입니다.',
      'Python 의 "이름표 전달"과 결과가 같고, C++ 의 `&` 참조 전달과는 다릅니다 (Java 에는 참조 매개변수가 없음).'] },
    { h: '접근 제어', md: [
      '| 키워드 | 접근 범위 |', '|---|---|',
      '| `public` | 어디서나 |', '| `protected` | 같은 패키지 + 자식 클래스 |', '| (없음) | 같은 패키지 |', '| `private` | 같은 클래스 안 |'] }
  ],
  misconceptions: [
    { wrong: '"Java 는 객체를 참조로 전달(pass-by-reference)한다."', right: '항상 값 전달이다. 객체를 넘길 때 **참조의 복사본**이 전달되기 때문에 내용 변경은 보이지만, 매개변수에 새 객체를 대입해도 호출한 쪽 변수는 바뀌지 않는다.', why: '진짜 참조 전달이었다면 `reassign` 예제가 원본을 바꿨을 것입니다. 아래 예제로 확인하세요.' },
    { wrong: '"`Account b = a;` 는 C++ 처럼 복사 생성이다."', right: '객체가 아니라 **참조**가 복사된다. 둘 다 같은 객체를 가리킨다.', why: 'C++ 의 객체는 값, Java 의 객체 변수는 참조입니다.' },
    { wrong: '"객체를 안 쓰게 되면 `delete` 처럼 직접 지워야 한다."', right: '참조가 모두 사라지면 GC 가 자동으로 정리한다. 다만 파일·소켓 같은 **자원**은 직접 닫아야 한다(7강 try-with-resources).', why: 'GC 가 해제하는 것은 메모리뿐입니다.' },
    { wrong: '"`static` 메서드에서도 `this` 와 인스턴스 필드를 쓸 수 있다."', right: '`static` 은 객체 없이 호출되므로 `this` 도 인스턴스 필드도 없다.', why: '`main` 이 `static` 이라서 객체를 만들지 않고는 인스턴스 메서드를 직접 호출할 수 없는 것도 같은 이유입니다.' }
  ],
  examples: [
    { title: '참조 공유 · static · toString · null', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        Account a = new Account("minsu", 100);
        Account b = a;                         // same object
        b.deposit(50);
        System.out.println(a.getBalance() + " " + b.getBalance());

        Account c = new Account("jia", 0);
        System.out.println((a == b) + " " + (a == c));
        System.out.println(a);                 // calls toString()
        System.out.println(Account.getCount());

        Account d = null;
        try {
            d.deposit(1);
        } catch (NullPointerException e) {
            System.out.println("NPE");
        }
    }
}

class Account {
    private static int count = 0;
    private final String owner;
    private int balance;

    Account(String owner, int balance) {
        this.owner = owner;
        this.balance = balance;
        count++;
    }
    void deposit(int amount) { if (amount > 0) balance += amount; }
    int getBalance() { return balance; }
    static int getCount() { return count; }

    @Override
    public String toString() { return owner + ":" + balance; }
}
`, output: R`
150 150
true false
minsu:150
2
NPE
` },
    { title: '값 전달: 내용 변경 vs 재대입', lang: 'java', code: R`
public class Main {
    static void mutate(int[] arr) { arr[0] = 100; }               // changes the shared object
    static void reassign(int[] arr) { arr = new int[]{-1}; }       // changes only the local copy
    static void incr(int x) { x++; }

    public static void main(String[] args) {
        int[] data = {1};
        mutate(data);
        System.out.println(data[0]);
        reassign(data);
        System.out.println(data[0]);

        int n = 1;
        incr(n);
        System.out.println(n);
    }
}
`, output: R`
100
100
1
` }
  ],
  exercises: [
    { q: '`Student` 클래스(이름, 점수 리스트 대신 점수 3개)를 만들고 평균을 반환하는 메서드를 작성하세요. `toString()` 도 재정의해 보세요.', hint: '`private` 필드 + 생성자 + `getAverage()`.', answer: fence('java', 'class Student {\n    private final String name;\n    private final int a, b, c;\n    Student(String name, int a, int b, int c) { this.name = name; this.a = a; this.b = b; this.c = c; }\n    double getAverage() { return (a + b + c) / 3.0; }\n    @Override public String toString() { return name + ": " + getAverage(); }\n}') },
    { q: '`Account` 의 `balance` 를 `public` 으로 바꾸면 어떤 위험이 생기는지, 어떻게 방어하는지 설명해 보세요.', hint: '외부에서 `a.balance = -1000;` 이 가능해집니다.', answer: '검증 없이 상태를 망가뜨릴 수 있습니다. `private` + `deposit/withdraw` 로 불변식(잔액 ≥ 0)을 지킵니다.' },
    { q: '`reassign` 예제의 `arr = new int[]{-1};` 를 `arr[0] = -1;` 로 바꾸면 결과가 어떻게 달라질지 예측해 보세요.', hint: '재대입과 내용 변경의 차이.', answer: '`data[0]` 이 `-1` 로 바뀝니다 (같은 배열의 내용을 바꾸므로).' }
  ],
  quiz: [
    { q: '출력은?', code: 'Account a = new Account("x", 10);\nAccount b = a;\nb.deposit(5);\nSystem.out.println(a.getBalance());', lang: 'java', accept: ['15'], explain: '`b` 와 `a` 는 같은 객체를 가리키므로 변경이 공유됩니다.' },
    { q: 'Java 의 메서드 인자 전달 방식으로 가장 정확한 것은?', choices: ['기본형은 값, 객체는 참조 전달', '항상 값 전달 (객체는 참조의 복사본)', '항상 참조 전달', '프로그래머가 선택'], answer: 1, explain: '객체의 참조값이 복사되어 전달됩니다. 그래서 재대입은 호출자에게 영향이 없습니다.' },
    { q: '`String s = null; s.length();` 을 실행하면?', choices: ['0 반환', '컴파일 오류', 'NullPointerException', '빈 문자열'], answer: 2, explain: 'null 참조의 멤버에 접근하면 NPE 가 발생합니다.' },
    { q: '`static` 필드에 대한 설명으로 옳은 것은?', choices: ['객체마다 별도로 존재한다', '클래스에 하나만 있고 모든 객체가 공유한다', '`private` 이면 쓸 수 없다', '상속할 수 없다'], answer: 1, explain: '클래스 이름으로 접근하며 객체 수와 무관하게 하나입니다.' },
    { q: 'Java 에서 사용하지 않는 객체의 메모리를 정리하는 것은?', choices: ['`delete` 연산자', '프로그래머가 호출하는 `free()`', '가비지 컬렉터', '컴파일러'], answer: 2, explain: '참조되지 않는 객체를 GC 가 회수합니다.' }
  ]
},

/* ======================= 5 ======================= */
{
  id: 'jv-05', unit: '2부. 객체지향', title: '상속, 인터페이스, 다형성', time: '80분',
  summary: 'Java 의 인스턴스 메서드는 기본적으로 모두 가상(virtual)이라, 부모 타입 변수로 호출해도 실제 객체의 메서드가 실행된다.',
  goals: ['`extends`, `super`, `@Override` 로 상속과 재정의를 쓴다', '추상 클래스와 인터페이스의 용도를 구분한다', '메서드는 다형적이지만 필드는 아니라는 사실을 안다'],
  terms: [
    { t: '`extends` / `implements`', d: '클래스 상속은 `extends`(부모 **하나만**), 인터페이스 구현은 `implements`(여러 개 가능).' },
    { t: '인터페이스(interface)', d: '"이런 메서드를 가져야 한다"는 **계약**. 구현은 클래스가 한다. `default` 메서드로 기본 구현을 줄 수도 있다.' },
    { t: '추상 클래스', d: '`abstract` 가 붙어 객체를 직접 만들 수 없는 클래스. 일부 구현 + 자식이 채울 추상 메서드를 가진다.' },
    { t: '`instanceof`', d: '객체의 실제 타입을 검사하는 연산자. `if (x instanceof Dog d)` 처럼 검사와 캐스팅을 한 번에 할 수 있다 (Java 16+).' }
  ],
  sections: [
    { h: '상속과 재정의', md: [
      '`class Dog extends Animal` — 자식은 부모의 비-private 멤버를 물려받습니다. 부모 생성자는 `super(...)` 로 호출하며 생성자의 **첫 줄**이어야 합니다. 재정의 시 `@Override` 를 붙이면 시그니처가 틀렸을 때 컴파일 오류로 알려 줍니다 (C++ 의 `override` 와 같은 역할).',
      'C++ 와 달리 **`virtual` 키워드가 없습니다.** 메서드(`static`·`private`·`final` 제외)는 기본적으로 실제 객체 타입에 따라 호출됩니다.'] },
    { h: '추상 클래스 vs 인터페이스', md: [
      '| | 추상 클래스 | 인터페이스 |', '|---|---|---|',
      '| 상속 개수 | 하나만 `extends` | 여러 개 `implements` |', '| 상태(필드) | 가질 수 있음 | 상수만 |',
      '| 의미 | "~는 ~이다" (공통 부분 구현 공유) | "~할 수 있다" (능력/계약) |',
      '다중 상속의 문제를 피하려고 Java 는 클래스 상속을 하나로 제한하고, 여러 계약은 인터페이스로 받습니다.'] },
    { h: '필드는 다형적이지 않다', md: [
      '메서드 호출은 실제 객체의 것이 실행되지만, **필드 접근은 변수의 선언된 타입**으로 결정됩니다(필드 가리기, hiding). 그래서 부모 변수로 자식 객체를 가리키고 `p.name` 을 읽으면 부모의 필드가 읽힙니다. 필드는 `private` 으로 두고 메서드로 접근하는 규칙이 이런 혼란을 막습니다.'] }
  ],
  misconceptions: [
    { wrong: '"Java 에서 다형성을 쓰려면 C++ 처럼 `virtual` 이 필요하다."', right: '필요 없다. 인스턴스 메서드는 기본적으로 동적 바인딩. (호출되지 않게 하려면 `final`)', why: 'C++ 와 정반대 기본값이라 두 언어를 오가면 혼란스럽습니다.' },
    { wrong: '"부모 변수로 자식 객체의 필드도 자식 것이 읽힌다."', right: '필드는 선언된 타입 기준이다 (`P p = new C(); p.name` 은 P 의 필드).', why: '아래 예제로 확인하세요. 필드를 `private` 으로 하고 메서드를 쓰면 문제가 없어집니다.' },
    { wrong: '"Java 에서도 클래스를 여러 개 상속할 수 있다."', right: '클래스는 하나만 상속(`extends`), 여러 능력은 인터페이스 `implements` 로 조합한다.', why: '다이아몬드 상속 같은 모호함을 언어 차원에서 제거했습니다.' },
    { wrong: '"자식 생성자에서 `super()` 를 안 쓰면 부모 초기화가 일어나지 않는다."', right: '명시하지 않으면 컴파일러가 `super()` (인자 없는 부모 생성자)를 자동 삽입한다. 부모에 기본 생성자가 없으면 컴파일 오류.', why: '부모 부분이 먼저 완성된 뒤 자식 부분이 만들어집니다.' }
  ],
  examples: [
    { title: '상속 · 오버라이딩 · instanceof', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        Animal[] zoo = { new Animal("generic"), new Dog("Rex"), new Cat("Tom") };
        for (Animal a : zoo) {
            System.out.println(a.name + ": " + a.sound());
        }
        Animal d = new Dog("Max");
        System.out.println(d instanceof Dog);
        if (d instanceof Dog dog) {
            System.out.println(dog.fetch());       // Dog-only method
        }
    }
}

class Animal {
    String name;
    Animal(String name) { this.name = name; }
    String sound() { return "..."; }
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override String sound() { return "woof"; }
    String fetch() { return name + " fetches"; }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    @Override String sound() { return "meow"; }
}
`, output: R`
generic: ...
Rex: woof
Tom: meow
true
Max fetches
` },
    { title: '인터페이스와 default 메서드', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        Shape[] shapes = { new Rect(2, 3), new Circle(2) };
        for (Shape s : shapes) System.out.println(s.describe());
    }
}

interface Shape {
    double area();
    default String describe() {
        return getClass().getSimpleName() + " area=" + area();
    }
}

class Rect implements Shape {
    private final double w, h;
    Rect(double w, double h) { this.w = w; this.h = h; }
    public double area() { return w * h; }
}

class Circle implements Shape {
    private final double r;
    Circle(double r) { this.r = r; }
    public double area() { return 3.0 * r * r; }      // pi ~ 3 for simplicity
}
`, output: R`
Rect area=6.0
Circle area=12.0
`, notes: ['인터페이스의 메서드는 기본적으로 `public` 이라 구현할 때 `public` 을 꼭 써야 합니다.'] },
    { title: '메서드는 다형적, 필드는 아니다', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        P p = new C();
        System.out.println(p.name + " " + p.who());
    }
}

class P {
    String name = "P";
    String who() { return "P"; }
}

class C extends P {
    String name = "C";                 // hides P.name (a different field)
    @Override String who() { return "C"; }
}
`, output: R`
P C
` }
  ],
  exercises: [
    { q: '`Shape` 인터페이스를 구현하는 `Triangle` 클래스를 추가하고, `Shape[]` 배열의 총면적을 구하는 코드를 작성하세요.', hint: '`area()` 구현 + 반복문 합산.', answer: fence('java', 'class Triangle implements Shape {\n    private final double b, h;\n    Triangle(double b, double h) { this.b = b; this.h = h; }\n    public double area() { return 0.5 * b * h; }\n}\n// double total = 0; for (Shape s : shapes) total += s.area();') },
    { q: '`Animal` 을 `abstract class` 로 바꾸고 `sound()` 를 추상 메서드로 만드세요. `new Animal("x")` 가 왜 컴파일 오류가 되는지 확인하세요.', hint: '`abstract String sound();`', answer: '추상 클래스는 객체를 직접 만들 수 없고, 자식 클래스는 반드시 `sound()` 를 구현해야 합니다.' },
    { q: '`@Override` 를 붙인 채 메서드 이름을 일부러 `sond()` 로 오타를 내 컴파일해 보세요.', hint: '`method does not override or implement a method from a supertype`', answer: '컴파일 오류로 실수를 알려 줍니다. `@Override` 가 없으면 조용히 새 메서드가 됩니다.' }
  ],
  quiz: [
    { q: '`Animal a = new Dog("x"); a.sound();` 에서 실행되는 것은? (Dog 가 sound 를 재정의했음)', choices: ['`Animal.sound()`', '`Dog.sound()`', '컴파일 오류', '둘 다'], answer: 1, explain: 'Java 의 인스턴스 메서드는 기본적으로 실제 객체 타입으로 결정됩니다.' },
    { q: '`P p = new C();` 일 때 `p.name` 은 어느 클래스의 필드를 읽는가? (둘 다 `name` 필드 보유)', choices: ['C 의 필드', 'P 의 필드', '컴파일 오류', '무작위'], answer: 1, explain: '필드는 변수의 선언된 타입(P) 기준으로 결정됩니다.' },
    { q: '클래스가 여러 개의 "능력"을 갖게 하려면?', choices: ['`extends` 를 여러 개', '`implements` 로 인터페이스 여러 개', '`static` 사용', '불가능'], answer: 1, explain: '클래스 상속은 하나만 가능하지만 인터페이스는 여러 개를 구현할 수 있습니다.' },
    { q: '추상 클래스에 대한 설명으로 옳은 것은?', choices: ['`new` 로 직접 객체를 만들 수 있다', '직접 객체를 만들 수 없다', '필드를 가질 수 없다', '자식 클래스를 가질 수 없다'], answer: 1, explain: '자식이 추상 메서드를 구현해야 객체를 만들 수 있습니다.' },
    { q: '`@Override` 의 역할은?', choices: ['메서드를 더 빠르게 한다', '부모의 메서드를 재정의하는지 컴파일러가 검사한다', '메서드를 private 으로 만든다', '메서드 호출을 막는다'], answer: 1, explain: '오타나 시그니처 불일치를 컴파일 타임에 잡습니다.' }
  ]
},

/* ======================= 6 ======================= */
{
  id: 'jv-06', unit: '3부. 표준 라이브러리', title: '컬렉션과 제네릭', time: '90분',
  summary: 'ArrayList, HashMap, HashSet 이 기본 도구다. 컬렉션에는 객체만 담을 수 있어 기본형은 자동으로 박싱되고, 해시 컬렉션의 키는 equals 와 hashCode 가 일관되어야 한다.',
  goals: ['`List`, `Map`, `Set` 의 특징과 사용 상황을 구분한다', '제네릭과 박싱, `remove(int)` / `remove(Object)` 함정을 안다', '`equals` / `hashCode` 재정의가 필요한 이유를 설명한다'],
  terms: [
    { t: '제네릭(generics)', d: '`List<Integer>` 처럼 컬렉션이 담을 **타입을 지정**하는 문법. 컴파일 시점에 타입 오류를 잡는다.' },
    { t: '박싱 / 언박싱', d: '`int` ↔ `Integer` 자동 변환. 제네릭에는 기본형을 쓸 수 없어서(`List<int>` ✗) 래퍼 클래스를 쓴다.' },
    { t: '`hashCode`', d: '객체를 정수 하나로 요약한 값. 해시 컬렉션이 저장 위치를 찾는 데 쓴다. **`equals` 가 같으면 `hashCode` 도 같아야 한다.**' },
    { t: '`ConcurrentModificationException`', d: '반복(iteration) 도중 컬렉션을 직접 수정했을 때 발생하는 예외.' }
  ],
  sections: [
    { h: '핵심 세 가지', md: [
      '| 인터페이스 | 구현체 | 특징 |', '|---|---|---|',
      '| `List<E>` | `ArrayList` | 순서 있음, 중복 허용, 인덱스 접근 (Python list, C++ vector) |',
      '| `Map<K,V>` | `HashMap` / `TreeMap` | 키로 값을 찾음. Hash=순서 없음·빠름, Tree=키 정렬 |',
      '| `Set<E>` | `HashSet` / `TreeSet` | 중복 없음 |',
      '변수 타입은 인터페이스로(`List<Integer> list = new ArrayList<>();`) 선언하면 나중에 구현체를 바꾸기 쉽습니다. `new ArrayList<>()` 의 `<>` 는 타입 추론.'] },
    { h: '리스트의 함정', md: [
      '`List<Integer>` 에서 `list.remove(1)` 은 **인덱스 1 의 원소**를 지웁니다. **값 1** 을 지우려면 `list.remove(Integer.valueOf(1))`. 두 메서드가 오버로딩되어 있기 때문입니다.',
      '불변 리스트 `List.of(1, 2, 3)` 은 수정하면 `UnsupportedOperationException`. 수정 가능한 복사본은 `new ArrayList<>(List.of(...))`.',
      '`for-each` 도중 `list.remove(...)` 를 하면 `ConcurrentModificationException` 이 날 수 있습니다. 조건 삭제는 `removeIf`.'] },
    { h: 'equals 와 hashCode', md: [
      '`HashMap` / `HashSet` 은 먼저 `hashCode` 로 칸을 찾고, 그 안에서 `equals` 로 같은지 확인합니다. 클래스가 이 둘을 재정의하지 않으면 **같은 내용의 서로 다른 객체는 다른 키**로 취급됩니다. 키로 쓸 클래스는 `equals` 와 `hashCode` 를 **함께** 재정의하세요. (`record` 는 자동으로 해 줍니다.)'] }
  ],
  misconceptions: [
    { wrong: '"`list.remove(1)` 은 값 1 을 지운다."', right: '`List<Integer>` 에서는 **인덱스 1** 을 지운다. 값을 지우려면 `remove(Integer.valueOf(1))`.', why: '컴파일러가 `int` 인자에 맞는 `remove(int index)` 를 먼저 선택하기 때문입니다.' },
    { wrong: '"내용이 같은 객체는 `HashSet` 에서 자동으로 중복 처리된다."', right: '`equals`/`hashCode` 를 재정의하지 않으면 객체의 **참조(정체성)** 로 비교되어 중복으로 보지 않는다.', why: '아래 예제의 `Bad` 클래스가 이 경우입니다.' },
    { wrong: '"`HashMap` 은 넣은 순서대로 꺼낼 수 있다."', right: '순서가 보장되지 않는다. 삽입 순서는 `LinkedHashMap`, 키 정렬은 `TreeMap`.', why: '출력 순서에 의존한 코드는 JVM 버전이 바뀌면 깨질 수 있습니다.' },
    { wrong: '"`for-each` 안에서 원소를 지워도 된다."', right: '`ConcurrentModificationException` 이 발생하거나(상황에 따라 안 나기도 해서 더 위험), 원소를 건너뛴다. `removeIf` 또는 `Iterator.remove()` 를 쓴다.', why: '"되는 경우도 있다"가 가장 나쁜 버그의 형태입니다.' }
  ],
  examples: [
    { title: 'ArrayList 와 remove 의 오버로딩 함정', lang: 'java', code: R`
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(3); list.add(1); list.add(2);
        Collections.sort(list);
        System.out.println(list + " " + list.size() + " " + list.get(0));

        List<Integer> nums = new ArrayList<>(List.of(10, 20, 30, 1));
        nums.remove(1);                          // removes INDEX 1 (the value 20)
        System.out.println(nums);
        nums.remove(Integer.valueOf(1));         // removes the VALUE 1
        System.out.println(nums);
    }
}
`, output: R`
[1, 2, 3] 3 1
[10, 30, 1]
[10, 30]
` },
    { title: 'HashMap · TreeMap · HashSet', lang: 'java', code: R`
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> count = new HashMap<>();
        for (String w : "to be or not to be".split(" ")) {
            count.put(w, count.getOrDefault(w, 0) + 1);
        }
        System.out.println(new TreeMap<>(count));        // sorted by key

        Set<Integer> s = new HashSet<>(List.of(1, 2, 2, 3));
        System.out.println(s.size() + " " + s.contains(2));
    }
}
`, output: R`
{be=2, not=1, or=1, to=2}
3 true
` },
    { title: 'equals / hashCode 가 없으면?', lang: 'java', code: R`
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Set<Bad> bad = new HashSet<>();
        bad.add(new Bad(1));
        System.out.println(bad.contains(new Bad(1)));

        Set<Good> good = new HashSet<>();
        good.add(new Good(1));
        System.out.println(good.contains(new Good(1)));
    }
}

class Bad {
    final int v;
    Bad(int v) { this.v = v; }
}

class Good {
    final int v;
    Good(int v) { this.v = v; }
    @Override public boolean equals(Object o) {
        return o instanceof Good g && g.v == v;
    }
    @Override public int hashCode() { return Objects.hash(v); }
}
`, output: R`
false
true
` },
    { title: '반복 중 삭제', lang: 'java', code: R`
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> xs = new ArrayList<>(List.of(1, 2, 3, 4));
        try {
            for (int x : xs) {
                if (x == 2) xs.remove(Integer.valueOf(x));   // modifies during iteration
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("CME");
        }
        xs.removeIf(x -> x % 2 == 0);                         // the safe way
        System.out.println(xs);
    }
}
`, output: R`
CME
[1, 3]
` }
  ],
  exercises: [
    { q: '문장 `"a b a c b a"` 의 단어별 개수를 `HashMap` 으로 세고 개수가 많은 순으로 출력하세요.', hint: '`entrySet()` 을 리스트로 만들어 `sort` — 또는 우선 `TreeMap` 으로 키 순 출력.', answer: fence('java', 'Map<String, Integer> c = new HashMap<>();\nfor (String w : "a b a c b a".split(" ")) c.merge(w, 1, Integer::sum);\nc.entrySet().stream()\n    .sorted((x, y) -> y.getValue() - x.getValue())\n    .forEach(e -> System.out.println(e.getKey() + "=" + e.getValue()));') },
    { q: '`Point(x, y)` 클래스를 만들어 `HashSet<Point>` 에서 `contains(new Point(1, 2))` 가 true 가 되게 하세요.', hint: '`equals` 와 `hashCode` 를 함께 재정의.', answer: '위 `Good` 예제와 같은 패턴을 사용합니다 (`Objects.hash(x, y)`).' },
    { q: '리스트 `[1,2,3,4,5,6]` 에서 짝수를 모두 지우는 두 가지 안전한 방법을 써 보세요.', hint: '`removeIf`, `Iterator`', answer: fence('java', 'list.removeIf(x -> x % 2 == 0);\n// 또는\nfor (Iterator<Integer> it = list.iterator(); it.hasNext();) {\n    if (it.next() % 2 == 0) it.remove();\n}') }
  ],
  quiz: [
    { q: '`List<Integer> a = new ArrayList<>(List.of(10, 20, 30)); a.remove(1); System.out.println(a);` 의 출력은?', choices: ['[10, 20, 30]', '[10, 30]', '[20, 30]', '[10, 20]'], answer: 1, explain: '`remove(int index)` 가 선택되어 인덱스 1 의 값 20 이 지워집니다.' },
    { q: '`List<int>` 처럼 기본형을 제네릭에 직접 쓸 수 없는 이유와 대안은?', choices: ['문법 오류라서 `Integer` 같은 래퍼 클래스를 쓴다', '속도가 느려서 `long` 을 쓴다', '가능하다', '배열로만 쓸 수 있다'], answer: 0, explain: '제네릭은 객체 타입만 받습니다. `List<Integer>` 로 쓰면 박싱/언박싱이 자동으로 됩니다.' },
    { q: '`equals` 를 재정의하면서 `hashCode` 는 재정의하지 않으면 생기는 문제는?', choices: ['컴파일 오류', '`HashSet` / `HashMap` 에서 같은 객체를 못 찾는 등 오동작', '아무 문제 없음', '`equals` 가 호출되지 않음'], answer: 1, explain: '해시 컬렉션은 hashCode 로 위치를 찾으므로 둘의 일관성이 필수입니다.' },
    { q: '키 순서대로 정렬된 상태를 유지하는 `Map` 구현은?', choices: ['`HashMap`', '`TreeMap`', '`ArrayList`', '`HashSet`'], answer: 1, explain: '`TreeMap` 은 키를 정렬된 상태로 유지합니다 (O(log n)).' },
    { q: '`Set<Integer> s = new HashSet<>(List.of(1, 1, 2, 2, 3)); s.size()` 의 값은?', accept: ['3'], explain: '중복이 제거되어 {1, 2, 3}.' }
  ]
},

/* ======================= 7 ======================= */
{
  id: 'jv-07', unit: '3부. 표준 라이브러리', title: '예외 처리', time: '60분',
  summary: 'Java 의 예외는 객체다. checked 예외는 컴파일러가 처리를 강제하고, 자원은 try-with-resources 로 자동으로 닫는다.',
  goals: ['`try / catch / finally` 와 `throw` / `throws` 를 쓴다', 'checked 와 unchecked 예외를 구분한다', '`try-with-resources` 로 자원을 안전하게 정리한다'],
  terms: [
    { t: 'checked 예외', d: '`Exception` 을 상속(단 `RuntimeException` 제외). 호출하는 쪽이 **반드시 잡거나 `throws` 로 선언**해야 컴파일된다. 예: `IOException`.' },
    { t: 'unchecked 예외', d: '`RuntimeException` 계열. 대개 **프로그래머 실수**(null 접근, 잘못된 인덱스, 0 으로 나누기). 처리를 강제하지 않는다.' },
    { t: '스택 트레이스', d: '예외가 발생한 위치와 거쳐 온 호출 경로. 맨 위 줄이 예외 종류·메시지, 그 아래가 호출 순서.' },
    { t: '`AutoCloseable`', d: '`close()` 를 가진 자원. `try (...)` 괄호 안에 선언하면 블록이 끝날 때 자동으로 닫힌다.' }
  ],
  sections: [
    { h: '기본 흐름', md: [
      fence('java', 'try {\n    위험한_코드;\n} catch (NumberFormatException e) {   // 구체적인 예외부터\n    처리;\n} finally {                          // 항상 실행\n    정리;\n}'),
      '- `throw new IllegalArgumentException("메시지");` 로 직접 던집니다.',
      '- checked 예외를 던지는 메서드는 `void pay() throws InsufficientFundsException` 처럼 **선언**해야 하고, 호출하는 쪽은 `try/catch` 하거나 다시 `throws` 해야 합니다.',
      '- 자식 예외를 먼저, 부모 예외를 나중에 `catch` 합니다 (순서가 반대면 컴파일 오류).'] },
    { h: '어떤 예외를 쓸까', md: [
      '- 호출자가 **복구할 수 있는** 상황(파일 없음, 잔액 부족) → checked',
      '- 호출자의 **프로그래밍 실수**(잘못된 인자, null) → unchecked (`IllegalArgumentException`, `IllegalStateException`)',
      '예외를 잡고 아무것도 안 하는 **빈 catch 블록**은 최악의 습관입니다. 최소한 로그를 남기거나 다시 던지세요.'] },
    { h: 'try-with-resources', md: [
      '`try (Resource r = new Resource()) { ... }` — 블록이 정상 종료되든 예외로 끝나든 `r.close()` 가 자동 호출됩니다. 여러 자원은 선언의 **역순**으로 닫힙니다. GC 는 메모리만 정리하므로 파일·소켓·DB 연결은 이렇게 닫아야 합니다.'] }
  ],
  misconceptions: [
    { wrong: '"예외는 오류가 났다는 신호이니 `catch (Exception e) {}` 로 다 막으면 된다."', right: '삼켜진 예외는 원인 추적을 불가능하게 만든다. 처리 방법이 있는 구체적인 예외만 잡고, 나머지는 위로 전달한다.', why: '파이썬 9강의 `except:` 와 같은 원칙입니다.' },
    { wrong: '"`finally` 는 예외가 났을 때만 실행된다."', right: '예외 여부와 관계없이 **항상** 실행된다 (`return` 직전에도).', why: '자원 정리용입니다. 이제는 대부분 try-with-resources 로 대체됩니다.' },
    { wrong: '"모든 예외는 처리하지 않으면 컴파일이 안 된다."', right: 'checked 예외만 그렇다. `NullPointerException` 같은 unchecked 예외는 처리를 강제하지 않는다.', why: '대신 unchecked 는 "코드를 고쳐서 없애야 하는" 버그입니다.' },
    { wrong: '"GC 가 있으니 파일을 닫을 필요가 없다."', right: 'GC 는 메모리만 회수한다. 파일 핸들·소켓은 직접(try-with-resources) 닫아야 한다.', why: '닫지 않으면 열 수 있는 파일 개수 제한에 걸려 서버가 멈출 수 있습니다.' }
  ],
  examples: [
    { title: 'try / catch / finally', lang: 'java', code: R`
public class Main {
    static int parse(String s) {
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return -1;
        } finally {
            System.out.println("parsed " + s);
        }
    }

    public static void main(String[] args) {
        System.out.println(parse("42"));
        System.out.println(parse("abc"));

        try {
            int zero = 0;
            System.out.println(10 / zero);
        } catch (ArithmeticException e) {
            System.out.println(e.getMessage());
        }
    }
}
`, output: R`
parsed 42
42
parsed abc
-1
/ by zero
` },
    { title: '사용자 정의 checked 예외', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        Wallet w = new Wallet();
        try {
            w.pay(30);
            w.pay(100);
            System.out.println("not reached");
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage());
        }
    }
}

class InsufficientFundsException extends Exception {
    InsufficientFundsException(String message) { super(message); }
}

class Wallet {
    private int balance = 100;
    void pay(int amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException("need " + (amount - balance) + " more");
        }
        balance -= amount;
    }
}
`, output: R`
need 30 more
` },
    { title: 'try-with-resources', lang: 'java', code: R`
public class Main {
    public static void main(String[] args) {
        try (Res a = new Res("a"); Res b = new Res("b")) {
            System.out.println("work");
            throw new IllegalStateException("boom");
        } catch (IllegalStateException e) {
            System.out.println("caught " + e.getMessage());
        }
    }
}

class Res implements AutoCloseable {
    private final String name;
    Res(String name) { this.name = name; System.out.println("open " + name); }
    @Override public void close() { System.out.println("close " + name); }
}
`, output: R`
open a
open b
work
close b
close a
caught boom
`, notes: ['자원은 선언의 **역순**으로 닫히고, `catch` 보다 **먼저** 닫힙니다.'] }
  ],
  exercises: [
    { q: '숫자가 아닌 문자열을 입력하면 "숫자만 입력하세요"를 출력하고 다시 입력받는 프로그램을 작성하세요.', hint: '`while (true)` + `try { Integer.parseInt(sc.next()); break; } catch (NumberFormatException e)`', answer: fence('java', 'while (true) {\n    try {\n        n = Integer.parseInt(sc.next());\n        break;\n    } catch (NumberFormatException e) {\n        System.out.println("numbers only");\n    }\n}') },
    { q: '`int[] a = new int[3]; a[3] = 1;` 이 던지는 예외 이름을 스택 트레이스에서 읽어 보세요. 이것은 checked 입니까, unchecked 입니까?', hint: '`RuntimeException` 의 자손인지 확인.', answer: '`ArrayIndexOutOfBoundsException` — unchecked (`RuntimeException` 계열).' },
    { q: '`AutoCloseable` 을 구현한 자신만의 클래스를 만들어 `try-with-resources` 로 사용해 보세요.', hint: '`close()` 에 출력문을 넣어 호출 순서를 확인.', answer: '위 `Res` 예제를 참고하세요.' }
  ],
  quiz: [
    { q: '다음 중 checked 예외에 해당하는 것은?', choices: ['`NullPointerException`', '`ArithmeticException`', '`IOException`', '`ArrayIndexOutOfBoundsException`'], answer: 2, explain: '`IOException` 은 `RuntimeException` 이 아닌 `Exception` 계열이라 처리를 강제합니다.' },
    { q: '`try { return 1; } finally { System.out.println("F"); }` 에서 "F" 는?', choices: ['출력되지 않는다', '출력된다', '컴파일 오류', '예외가 난 경우에만 출력된다'], answer: 1, explain: '`finally` 는 `return` 직전에도 항상 실행됩니다.' },
    { q: '`try (A a = new A(); B b = new B())` 에서 자원이 닫히는 순서는?', choices: ['a 다음 b', 'b 다음 a (역순)', '동시에', '닫히지 않는다'], answer: 1, explain: '나중에 열린 자원부터 닫습니다.' },
    { q: '`catch (Exception e) {}` (빈 블록) 이 나쁜 이유는?', choices: ['컴파일되지 않아서', '예외를 삼켜 원인 추적이 불가능해져서', '실행이 느려서', 'finally 가 실행되지 않아서'], answer: 1, explain: '예외는 처리하거나 다시 던지거나 최소한 기록해야 합니다.' },
    { q: '호출자가 복구할 수 있는 상황(예: 잔액 부족)에 어울리는 예외 종류는?', choices: ['checked 예외', 'unchecked 예외', '`Error`', '필요 없다'], answer: 0, explain: '호출자가 반드시 대응하도록 강제하려면 checked 예외로 설계합니다.' }
  ]
},

/* ======================= 8 ======================= */
{
  id: 'jv-08', unit: '3부. 표준 라이브러리', title: '람다와 스트림 입문', time: '70분',
  summary: '람다는 이름 없는 함수이고, 스트림은 컬렉션 데이터를 "필터 → 변환 → 모으기" 파이프라인으로 처리하는 도구다. 스트림은 최종 연산이 호출될 때만 실행되며 한 번만 쓸 수 있다.',
  goals: ['람다 식과 함수형 인터페이스를 읽고 쓴다', '`filter` / `map` / `collect` / `sum` 스트림 파이프라인을 작성한다', '스트림의 지연 실행과 1회성을 설명한다'],
  terms: [
    { t: '함수형 인터페이스', d: '추상 메서드가 **하나뿐인** 인터페이스. 람다를 넣을 수 있는 자리. 예: `Comparator`, `Runnable`, `Function<T,R>`, `Predicate<T>`.' },
    { t: '람다(lambda)', d: '`(a, b) -> a.length() - b.length()` — 함수형 인터페이스의 구현을 간단히 쓰는 식.' },
    { t: '스트림(stream)', d: '데이터를 **저장하는 자료구조가 아니라**, 컬렉션 등에서 흘러나오는 데이터를 처리하는 파이프라인.' },
    { t: '중간 연산 / 최종 연산', d: '`filter`, `map` 은 중간 연산(아직 실행 안 됨). `forEach`, `collect`, `sum`, `anyMatch` 가 최종 연산(이때 실제로 실행).' }
  ],
  sections: [
    { h: '람다', md: [
      '`(매개변수) -> 식` 또는 `(매개변수) -> { 문장들 }`. 자주 쓰는 형태:',
      '- 정렬 기준: `list.sort((a, b) -> a.length() - b.length());` 또는 `Comparator.comparingInt(String::length)`',
      '- 메서드 참조: `Integer::intValue`, `String::length`, `System.out::println`',
      '람다 안에서 바깥의 지역 변수를 쓰려면 그 변수가 **사실상 final(effectively final)** — 한 번 대입된 뒤 바뀌지 않아야 합니다. 바뀌는 값을 모으고 싶으면 스트림의 `sum`, `collect` 를 쓰세요.'] },
    { h: '스트림 파이프라인', md: [
      fence('java', 'List<Integer> result = nums.stream()   // 1. 원본에서 스트림 생성\n    .filter(n -> n % 2 == 0)            // 2. 중간 연산: 거르기\n    .map(n -> n * n)                    // 3. 중간 연산: 변환\n    .toList();                          // 4. 최종 연산: 실행하고 결과 모으기'),
      '- 원본 컬렉션은 **바뀌지 않습니다.** 결과는 새 컬렉션/값입니다.',
      '- **지연 실행**: 최종 연산을 호출하기 전까지 중간 연산은 아무 일도 하지 않습니다.',
      '- **1회용**: 한 번 최종 연산을 한 스트림은 다시 쓸 수 없습니다 (`IllegalStateException`).',
      '- 기본형 스트림 `IntStream`(`mapToInt`) 은 `sum()`, `average()`, `max()` 를 제공합니다.'] },
    { h: '언제 쓰나', md: [
      '"컬렉션을 훑어서 조건에 맞는 것만 변환·집계"하는 일에 간결합니다. 하지만 복잡한 로직까지 스트림에 욱여넣으면 오히려 읽기 어려우니, 단순 반복문이 더 명확하면 반복문을 쓰세요.'] }
  ],
  misconceptions: [
    { wrong: '"스트림은 컬렉션의 일종이다 (데이터를 저장한다)."', right: '스트림은 데이터를 저장하지 않는 **처리 파이프라인**이다. 원본 컬렉션은 그대로다.', why: '`stream()` 은 원본에 대한 "일련의 처리 단계"를 만드는 것입니다.' },
    { wrong: '"`filter` / `map` 을 호출하면 즉시 실행된다."', right: '지연 실행. 최종 연산(`forEach`, `toList`, `sum` ...)이 호출될 때 실제로 흐른다.', why: '아래 예제의 `peek` 출력 순서로 확인하세요.' },
    { wrong: '"같은 스트림을 두 번 `forEach` 할 수 있다."', right: '한 번 소비하면 닫힌다 → `IllegalStateException`. 다시 필요하면 `stream()` 을 새로 호출.', why: '스트림은 "한 번 흘려보내는 물"입니다.' },
    { wrong: '"람다 안에서 바깥 변수를 자유롭게 수정할 수 있다."', right: '바깥 지역 변수는 읽기만 가능하다(effectively final). 수정하려고 하면 컴파일 오류.', why: '값을 누적하려면 `sum()`, `reduce`, `collect` 같은 스트림 연산을 쓰는 것이 올바른 방법입니다.' }
  ],
  examples: [
    { title: '람다로 정렬', lang: 'java', code: R`
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("minsu", "jia", "ha", "alexander"));
        names.sort((a, b) -> a.length() - b.length());
        System.out.println(names);

        names.sort(Comparator.comparing(String::toString).reversed());   // method reference
        System.out.println(names);
    }
}
`, output: R`
[ha, jia, minsu, alexander]
[minsu, jia, ha, alexander]
`, notes: ['두 번째는 사전 역순입니다: minsu > jia > ha > alexander.'] },
    { title: 'filter · map · 집계', lang: 'java', code: R`
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);

        List<Integer> sq = nums.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .toList();
        System.out.println(sq);

        int sum = nums.stream().mapToInt(Integer::intValue).sum();
        System.out.println(sum);
        System.out.println(nums.stream().anyMatch(n -> n > 5));
        System.out.println(nums);                         // the original is unchanged
    }
}
`, output: R`
[4, 16, 36]
21
true
[1, 2, 3, 4, 5, 6]
` },
    { title: '지연 실행과 1회용', lang: 'java', code: R`
import java.util.stream.Stream;

public class Main {
    public static void main(String[] args) {
        Stream<Integer> st = Stream.of(1, 2, 3).peek(x -> System.out.println("peek " + x));
        System.out.println("before");                     // nothing ran yet
        st.forEach(x -> { });                             // terminal operation: runs now
        try {
            st.forEach(x -> { });                         // reuse
        } catch (IllegalStateException e) {
            System.out.println("reuse not allowed");
        }
    }
}
`, output: R`
before
peek 1
peek 2
peek 3
reuse not allowed
` },
    { title: '람다와 바깥 변수', lang: 'java', code: R`
import java.util.function.Function;

public class Main {
    public static void main(String[] args) {
        int base = 10;                                    // effectively final
        Function<Integer, Integer> f = x -> x + base;
        System.out.println(f.apply(5));
        // base++;   // uncommenting this would make the lambda above a compile error
    }
}
`, output: R`
15
` }
  ],
  exercises: [
    { q: '문자열 리스트에서 길이가 3 이상인 것만 대문자로 바꿔 새 리스트로 만드세요.', hint: '`filter(s -> s.length() >= 3).map(String::toUpperCase).toList()`', answer: fence('java', 'List<String> r = words.stream()\n    .filter(s -> s.length() >= 3)\n    .map(String::toUpperCase)\n    .toList();') },
    { q: '정수 리스트의 평균을 스트림으로 구하세요 (`double`).', hint: '`mapToInt(...).average().orElse(0)`', answer: fence('java', 'double avg = nums.stream().mapToInt(Integer::intValue).average().orElse(0);') },
    { q: '같은 작업을 반복문과 스트림으로 각각 작성해 비교해 보고, 어떤 경우에 어느 쪽이 더 읽기 쉬운지 생각해 보세요.', hint: '조건 두 개 이상 + 변환 + 집계가 섞일 때를 비교.', answer: '단순한 거르기·변환·집계는 스트림이 간결하고, 복잡한 상태 변경·조기 종료가 많으면 반복문이 더 명확한 경우가 많습니다.' }
  ],
  quiz: [
    { q: '`Stream<Integer> st = list.stream().filter(...).map(...);` 까지만 작성하고 최종 연산이 없다면?', choices: ['필터와 변환이 즉시 실행된다', '아무 일도 실행되지 않는다 (지연 실행)', '컴파일 오류', '원본 리스트가 바뀐다'], answer: 1, explain: '중간 연산은 최종 연산이 호출되어야 실행됩니다.' },
    { q: '한 번 `forEach` 로 소비한 스트림을 다시 `forEach` 하면?', choices: ['정상 실행', 'IllegalStateException', '빈 결과', '컴파일 오류'], answer: 1, explain: '스트림은 1회용입니다.' },
    { q: '`nums.stream().filter(n -> n > 2).toList()` 실행 후 원본 `nums` 는?', choices: ['조건에 맞는 원소만 남는다', '변하지 않는다', '비어 있다', '정렬된다'], answer: 1, explain: '스트림 연산은 원본을 수정하지 않고 새 결과를 만듭니다.' },
    { q: '다음 중 함수형 인터페이스의 조건은?', choices: ['메서드가 하나도 없다', '추상 메서드가 정확히 하나', '모든 메서드가 `static`', '반드시 제네릭'], answer: 1, explain: '추상 메서드가 하나이면 람다로 구현을 대신할 수 있습니다.' },
    { q: '람다 안에서 바깥 지역 변수에 접근하려면 그 변수는?', choices: ['반드시 `static`', '사실상 `final` (값이 바뀌지 않음)', '`public`', '배열이어야 함'], answer: 1, explain: '(effectively final) 값이 바뀌는 변수는 캡처할 수 없습니다.' }
  ]
}

  ]
});
})();
