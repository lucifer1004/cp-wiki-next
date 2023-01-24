# AtCoder Beginner Contest 186

[Video Editorial](https://www.youtube.com/watch?v=gU9nK5hzBjA)

<iframe width="560" height="315" src="https://www.youtube.com/embed/gU9nK5hzBjA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A - [Brick](https://atcoder.jp/contests/abc186/tasks/abc186_a)

The answer is $\left\lfloor\frac{N}{W}\right\rfloor$.

Time complexity is $\mathcal{O}(1)$.

:::details Code (Python 3)

```python
n, w = map(int, input().split())
print(n // w)
```

:::

## Problem B - [Blocks on Grid](https://atcoder.jp/contests/abc186/tasks/abc186_b)

The answer is $\sum A_{i,j}-\min A_{i,j}\cdot NM$.

Time complexity is $\mathcal{O}(NM)$.

:::details Code (Python 3)

```python
def read_int():
    return int(input())


def read_ints():
    return map(int, input().split(' '))


h, w = read_ints()
lo = 100
s = 0
for i in range(h):
    row = list(read_ints())
    lo = min(lo, min(row))
    s += sum(row)
print(s - lo * h * w)
```

:::

## Problem C - [Unlucky 7](https://atcoder.jp/contests/abc186/tasks/abc186_c)

Just enumerate and check each number.

Time complexity is $\mathcal{O}(N\log N)$.

:::details Code (Python 3)

```python
n = int(input())
ans = 0
for i in range(1, n + 1):
    if '7' in str(i) or '7' in oct(i):
        continue
    ans += 1
print(ans)
```

:::

## Problem D - [Sum of difference](https://atcoder.jp/contests/abc186/tasks/abc186_d)

Note that:

$$
\begin{aligned}
\sum_{i=1}^{N-1}\sum_{j=i+1}^N|A_i-A_j|&=\frac{1}{2}\sum_{i=1}^{N-1}\sum_{j=i+1}^N2|A_i-A_j|\\
&=\frac{1}{2}\sum_{i=1}^{N-1}\sum_{j=i+1}^N|A_i-A_j|+|A_j-A_i|\\
&=\frac{1}{2}\sum_{i=1}^{N}\sum_{j=1}^N|A_i-A_j|
\end{aligned}
$$

We can first sort the array and then calculate the sum using prefix sum.

Time complexity is $\mathcal{O}(N\log N)$.

:::details Code (Python 3)

```python
n = int(input())
a = list(map(int, input().split()))
a.sort()
r = sum(a)
ans = 0
l = 0
for i in range(n):
    r -= a[i]
    ans += r - (n - 1 - i) * a[i] + i * a[i] - l
    l += a[i]
print(ans // 2)
```

:::

## Problem E - [Throne](https://atcoder.jp/contests/abc186/tasks/abc186_e)

Denote $X$ as the number of moves, and $Y$ as the number of loops.

$$
XK+S=YN
$$

So,

$$
YN-XK=S
$$

We can first use extended GCD on $N$ and $K$ to get,

$$
Y'N+X'K=gcd(N,K)
$$

If $S$ cannot be divided by $gcd(N,K)$, we have no answer. Otherwise, we multiply both sides with $\frac{S}{gcd(N,K)}$,

$$
Y''N+X''K=S
$$

Then we use $lcm(N,K)$ to minimize $Y$ and thus get the answer $X$.

Time complexity is $\mathcal{O}(\log(\min(N,K)))$.

:::details Code (Python 3)

```python
def exgcd(a, b):
    s = 0
    olds = 1
    t = 1
    oldt = 0
    r = b
    oldr = a
    while r:
        q = oldr // r
        oldr, r = r, oldr-q*r
        olds, s = s, olds-q*s
        oldt, t = t, oldt-q*t
    return oldr, olds, oldt


t = int(input())
for _ in range(t):
    n, s, k = map(int, input().split())
    g, a, b = exgcd(n, k)
    if s % g != 0:
        print(-1)
    else:
        a *= s // g
        b *= s // g
        lcm = n * k // g
        print(((a * n - s) % lcm + lcm) % lcm // k)
```

:::

## Problem F - [Rook on Grid](https://atcoder.jp/contests/abc186/tasks/abc186_f)

First consider right-down routes, then down-right routes. There might be duplicates, which can be handled with data structures such as Fenwick tree or Balanced Binary Search Tree.

Time complexity is $\mathcal{O}(W+H\log W)$.

:::details Code (C++)

```cpp
#include <algorithm>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
#include <iostream>
#include <vector>

using namespace __gnu_pbds;
using namespace std;
typedef long long ll;
typedef tree<int, null_type, less_equal<>, rb_tree_tag,
             tree_order_statistics_node_update>
    indexed_set;

int main() {
  int h, w, m;
  cin >> h >> w >> m;
  vector<int> x(m), y(m);
  vector<int> hlimit(h + 1, w), wlimit(w + 1, h);
  for (int i = 0; i < m; ++i) {
    cin >> x[i] >> y[i];
    hlimit[x[i]] = min(hlimit[x[i]], y[i] - 1);
    wlimit[y[i]] = min(wlimit[y[i]], x[i] - 1);
  }
  ll ans = 0;
  for (int i = 1; i <= hlimit[1]; ++i)
    ans += wlimit[i];
  vector<pair<int, int>> v;
  for (int i = 2; i <= wlimit[1]; ++i)
    v.emplace_back(hlimit[i], i);
  sort(v.begin(), v.end());
  indexed_set s;
  int r = 0;
  for (auto [hl, i] : v) {
    while (r < hl && r < hlimit[1])
      s.insert(wlimit[++r]);
    int dup = s.size() - s.order_of_key(i - 1);
    ans += hlimit[i] - dup;
  }
  cout << ans << endl;
}
```

:::
