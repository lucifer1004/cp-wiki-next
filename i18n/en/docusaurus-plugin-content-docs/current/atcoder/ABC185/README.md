# AtCoder Beginner Contest 185 Tutorial

See the [Video Tutorial](https://www.youtube.com/watch?v=sq-A_1kBvPQ).

<iframe width="560" height="315" src="https://www.youtube.com/embed/sq-A_1kBvPQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And here are the solutions.

## Problem A - [ABC Preparation](https://atcoder.jp/contests/abc185/tasks/abc185_a)

Just output the minimum of the four numbers.

Time complexity is $\mathcal{O}(1)$。

:::details Code (Python 3)

```python
print(min(map(int, input().split())))
```

:::

## Problem B - [Smartphone Addiction](https://atcoder.jp/contests/abc185/tasks/abc185_b)

Simulation.

Time complexity is $\mathcal{O}(M)$.

:::details Code (Python 3)

```python
n, m, t = map(int, input().split())
last = 0
now = n
for _ in range(m):
    ai, bi = map(int, input().split())
    now -= ai - last
    if now <= 0:
        print('No')
        exit(0)
    now += bi - ai
    if now > n:
        now = n
    last = bi
now -= t - last
print('Yes' if now > 0 else 'No')
```

:::

## Problem C - [Duodecim Ferra](https://atcoder.jp/contests/abc185/tasks/abc185_c)

The answer is ${L-1}\choose11$.

Time complexity is $\mathcal{O}(1)$.

:::details Code (Python 3)

```python
from math import comb

l = int(input())
print(comb(l - 1, 11))
```

:::

## Problem D - [Stamp](https://atcoder.jp/contests/abc185/tasks/abc185_d)

Find all white segments. The length of the shortest segment will be the optimal value for $k$. Then just calculate $\sum\lceil\frac{l_i}{k}\rceil$, where $l_i$ is the length of the $i$-th white segment.

Time complexity is $\mathcal{O}(M)$.

:::details Code (Python 3)

```python
n, m = map(int, input().split())
a = [] if m == 0 else list(map(int, input().split()))
a.sort()
if m == 0:
    print(1)
else:
    seg = []
    if a[0] != 1:
        seg.append(a[0] - 1)
    if a[-1] != n:
        seg.append(n - a[-1])
    for i in range(m - 1):
        if a[i + 1] - a[i] > 1:
            seg.append(a[i + 1] - a[i] - 1)
    if len(seg) == 0:
        print(0)
    else:
        shortest = min(seg)
        print(sum((si - 1) // shortest + 1 for si in seg))
```

:::

## Problem E - [Sequence Matching](https://atcoder.jp/contests/abc185/tasks/abc185_e)

Similar to the Longest Common Subsequence problem. Consider transitions from $dp[i-1][j],dp[i][j-1],dp[i-1][j-1]$.

Time complexity is $\mathcal{O}(NM)$.

:::details Code (Python 3)

```python
n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
dp = [[0 for _ in range(m + 1)] for _ in range(n + 1)]
for i in range(n + 1):
    for j in range(m + 1):
        if i == 0 and j == 0:
            continue
        dp[i][j] = int(1e6)
        if i > 0:
            dp[i][j] = min(dp[i][j], dp[i - 1][j] + 1)
        if j > 0:
            dp[i][j] = min(dp[i][j], dp[i][j - 1] + 1)
        if i > 0 and j > 0:
            extra = -1 if a[i - 1] == b[j - 1] else 0
            dp[i][j] = min(dp[i][j], dp[i - 1][j - 1] + 1 + extra)
print(dp[n][m])
```

:::

## Problem F - [Range Xor Query](https://atcoder.jp/contests/abc185/tasks/abc185_f)

A typical segment tree with single update and range query. Just use the template in AC-Library.

Time complexity is $\mathcal{O}((N+Q)\log N)$.

:::details Code (C++)

```cpp
#include <atcoder/segtree>
#include <iostream>
#include <vector>

using namespace std;

int op(int a, int b) { return a ^ b; }

int e() { return 0; }

int main() {
  int n, q;
  cin >> n >> q;
  vector<int> v(n);
  for (int i = 0; i < n; ++i)
    cin >> v[i];
  atcoder::segtree<int, op, e> seg(v);
  while (q--) {
    int t, x, y;
    cin >> t >> x >> y;
    if (t == 1) {
      seg.set(x - 1, v[x - 1] ^ y);
      v[x - 1] ^= y;
    } else {
      cout << seg.prod(x - 1, y) << endl;
    }
  }
}
```

:::
