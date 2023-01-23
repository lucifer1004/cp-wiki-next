# AtCoder Beginner Contest 186

[视频题解](https://www.youtube.com/watch?v=gU9nK5hzBjA)

<iframe width="560" height="315" src="https://www.youtube.com/embed/gU9nK5hzBjA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A - [Brick](https://atcoder.jp/contests/abc186/tasks/abc186_a)

答案为$\left\lfloor\frac{N}{W}\right\rfloor$。

时间复杂度$\mathcal{O}(1)$。

:::details 参考代码 （Python 3）

```python
n, w = map(int, input().split())
print(n // w)
```

:::

## Problem B - [Blocks on Grid](https://atcoder.jp/contests/abc186/tasks/abc186_b)

因为只能减少不能增加，所以答案为$\sum A_{i,j}-\min A_{i,j}\cdot NM$。

时间复杂度$\mathcal{O}(NM)$。

:::details 参考代码 （Python 3）

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

直接遍历$1\dots N$，检查每个数字的十进制和八进制表示中是否含有数字`7`即可。

时间复杂度$\mathcal{O}(N\log N)$。

:::details 参考代码 （Python 3）

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

注意到：

$$
\begin{aligned}
\sum_{i=1}^{N-1}\sum_{j=i+1}^N|A_i-A_j|&=\frac{1}{2}\sum_{i=1}^{N-1}\sum_{j=i+1}^N2|A_i-A_j|\\
&=\frac{1}{2}\sum_{i=1}^{N-1}\sum_{j=i+1}^N|A_i-A_j|+|A_j-A_i|\\
&=\frac{1}{2}\sum_{i=1}^{N}\sum_{j=1}^N|A_i-A_j|
\end{aligned}
$$

排序后利用前缀和求解即可。

时间复杂度$\mathcal{O}(N\log N)$。

:::details 参考代码 （Python 3）

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

令$X$为移动次数，$Y$为移动圈数，则有：

$$
XK+S=YN
$$

从而

$$
YN-XK=S
$$

这是一个典型的同余方程，这里可以利用扩展GCD先求解得到：

$$
Y'N+X'K=gcd(N,K)
$$

如果$S$不能被$gcd(N,K)$整除，则无解。否则，我们先将两边同时乘上$\frac{S}{gcd(N,K)}$，得到：

$$
Y''N+X''K=S
$$

然后我们利用$lcm(N,K)$最小化$Y$后就可以得到答案$X$。

时间复杂度$\mathcal{O}(\log(\min(N,K)))$。

:::details 参考代码 （Python 3）

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

先考虑先向右再向下的走法；再考虑先向下再向右的走法，这里可能有重复，可以利用树状数组或平衡二叉树等数据结构求解。

时间复杂度$\mathcal{O}(W+H\log W)$。

:::details 参考代码 （C++）

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
