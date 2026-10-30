"""SQL 예제 실행기 (verify.js / fill-sql.js 가 호출).  python -I tools/sqlrun.py file.sql

SQLite(메모리 DB)로 실행해서 SELECT 결과를 'a | b' 형식으로 출력한다.
Oracle 스타일 함수 몇 개(NVL, NVL2, DECODE, LPAD, RPAD ...)는 여기서 흉내 낸다.
SQLite 에 없는 문법(ROLLUP/CUBE, CONNECT BY, ROWNUM, (+), MINUS ...)은 검증 대상이 아니다.
"""
import math
import sqlite3
import sys

con = sqlite3.connect(':memory:', isolation_level=None)   # 자동 커밋 모드: BEGIN/COMMIT/ROLLBACK 을 쓴 그대로 실행

def fn(name, n, f):
    con.create_function(name, n, f, deterministic=True)

fn('NVL', 2, lambda a, b: b if a is None else a)
fn('NVL2', 3, lambda a, b, c: b if a is not None else c)

def decode(*a):
    expr, rest = a[0], list(a[1:])
    while len(rest) >= 2:
        k, v = rest[0], rest[1]
        if k == expr or (k is None and expr is None):
            return v
        rest = rest[2:]
    return rest[0] if rest else None
fn('DECODE', -1, decode)

fn('LPAD', 3, lambda s, n, p: None if s is None else (str(s)[:n] if len(str(s)) >= n else ((p * n)[: n - len(str(s))] + str(s))))
fn('RPAD', 3, lambda s, n, p: None if s is None else (str(s)[:n] if len(str(s)) >= n else (str(s) + (p * n)[: n - len(str(s))])))
fn('MOD', 2, lambda a, b: None if a is None or b is None else (a if b == 0 else int(math.fmod(a, b))))
fn('CEIL', 1, lambda a: None if a is None else math.ceil(a))
fn('FLOOR', 1, lambda a: None if a is None else math.floor(a))
fn('SIGN', 1, lambda a: None if a is None else (a > 0) - (a < 0))
fn('POWER', 2, lambda a, b: None if a is None or b is None else a ** b)
fn('CHR', 1, lambda a: None if a is None else chr(a))


import re

# 정규 표현식 함수 (Oracle 의 REGEXP_*). 단순한 패턴(^ $ . * + ? [] | ())만 검증 대상.
fn('REGEXP_LIKE', 2, lambda s, p: None if s is None else int(re.search(p, s) is not None))
fn('REGEXP_LIKE', 3, lambda s, p, f: None if s is None else int(re.search(p, s, re.I if 'i' in f else 0) is not None))
fn('REGEXP_REPLACE', 2, lambda s, p: None if s is None else re.sub(p, '', s))
fn('REGEXP_REPLACE', 3, lambda s, p, r: None if s is None else re.sub(p, r, s))
fn('REGEXP_SUBSTR', 2, lambda s, p: None if s is None or re.search(p, s) is None else re.search(p, s).group(0))
fn('REGEXP_INSTR', 2, lambda s, p: None if s is None else (re.search(p, s).start() + 1 if re.search(p, s) else 0))
fn('REGEXP_COUNT', 2, lambda s, p: None if s is None else len(re.findall(p, s)))


def show(v):
    if v is None:
        return 'NULL'
    if isinstance(v, float) and v == int(v):
        return str(int(v))
    return str(v)


sql = open(sys.argv[1], encoding='utf-8').read()
buf, first = '', True
for line in sql.splitlines(True):
    buf += line
    if not sqlite3.complete_statement(buf):
        continue
    cur = con.execute(buf)
    if cur.description:
        if not first:
            print()
        first = False
        print(' | '.join(d[0] for d in cur.description))
        for row in cur.fetchall():
            print(' | '.join(show(v) for v in row))
    buf = ''
if buf.strip():
    con.executescript(buf)
