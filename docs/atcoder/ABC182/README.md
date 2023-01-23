# AtCoder Beginner Contest 182

## Problem A - [twiblr](https://atcoder.jp/contests/abc182/tasks/abc182_a)

直接输出$2A+100-B$即可，时间复杂度$\mathcal{O}(1)$。

:::details 参考代码 （Python 3）

```python
a, b = map(int, input().split())
print(2 * a + 100 - b)
```

:::

## Problem B - [Almost GCD](https://atcoder.jp/contests/abc182/tasks/abc182_b)

暴力穷举。时间复杂度$\mathcal{O}(N\cdot\max(a))$。

:::details 参考代码 （Python 3）

```python
n = int(input())
a = list(map(int, input().split()))
hi = 0
ans = 0
for i in range(2, max(a) + 1):
    cnt = 0
    for j in a:
        if j % i == 0:
            cnt += 1
    if cnt > hi:
        hi = cnt
        ans = i
print(ans)
```

:::

## Problem C - [To 3](https://atcoder.jp/contests/abc182/tasks/abc182_c)

利用一个数能被$3$整除当且仅当其各位之和能被$3$整除。

- 如果本身能被$3$整除，则不需要删除。
- 如果被$3$除余$1$，则首先看是否能删去$1$个$1$，然后看是否能删去$2$个$2$。
- 如果被$3$除余$1$，则首先看是否能删去$1$个$2$，然后看是否能删去$2$个$1$。

时间复杂度$\mathcal{O}(\log N)$。

:::details 参考代码 （Python 3）

```python
s = input()
n = int(s)
if n % 3 == 0:
    print(0)
else:
    a = list(map(int, list(s)))
    c = [0] * 3
    for i in a:
        c[i % 3] += 1
    if c[n % 3] >= 1 and len(a) > 1:
        print(1)
    elif c[3 - n % 3] >= 2 and len(a) > 2:
        print(2)
    else:
        print(-1)
```

:::

## Problem D - [Wandering](https://atcoder.jp/contests/abc182/tasks/abc182_d)

记录最远位置$ans$，当前位置$pos$，前缀和$sum$，以及前缀和的最大值$hi$。

在每一轮中，首先更新前缀和，然后更新前缀和的最大值，本轮能达到的最大值显然是$pos+hi$，用其更新$ans$，再用$pos+sum$更新$pos$。

时间复杂度$\mathcal{O}(N)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int n;
  cin >> n;
  int a;
  ll ans = 0, hi = 0, sum = 0, pos = 0;
  for (int i = 1; i <= n; ++i) {
    cin >> a;
    sum += a;
    hi = max(hi, sum);
    ans = max(ans, pos + hi);
    pos += sum;
  }
  cout << ans;
}
```

:::

## Problem E - [Akari](https://atcoder.jp/contests/abc182/tasks/abc182_e)

将所有灯和墙都放到矩形中，然后逐行从左到右扫描一遍，再从右到左扫描一遍；逐列从上到下扫描一遍，再从下到上扫描一遍。最后统计亮着的格子即可。

时间复杂度$\mathcal{O}(HW)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
  int h, w, n, m;
  cin >> h >> w >> n >> m;
  int a, b, c, d;
  vector<vector<int>> mat(h, vector<int>(w));
  for (int i = 0; i < n; ++i) {
    cin >> a >> b;
    mat[a - 1][b - 1] = 1;
  }
  for (int i = 0; i < m; ++i) {
    cin >> c >> d;
    mat[c - 1][d - 1] = -1;
  }
  for (int i = 0; i < h; ++i) {
    bool light = false;
    for (int j = 0; j < w; ++j) {
      if (mat[i][j] == 1) {
        light = true;
      } else if (mat[i][j] == -1) {
        light = false;
      } else if (light)
        mat[i][j] = 2;
    }
    light = false;
    for (int j = w - 1; j >= 0; --j) {
      if (mat[i][j] == 1) {
        light = true;
      } else if (mat[i][j] == -1) {
        light = false;
      } else if (light)
        mat[i][j] = 2;
    }
  }
  for (int j = 0; j < w; ++j) {
    bool light = false;
    for (int i = 0; i < h; ++i) {
      if (mat[i][j] == 1) {
        light = true;
      } else if (mat[i][j] == -1) {
        light = false;
      } else if (light)
        mat[i][j] = 2;
    }
    light = false;
    for (int i = h - 1; i >= 0; --i) {
      if (mat[i][j] == 1) {
        light = true;
      } else if (mat[i][j] == -1) {
        light = false;
      } else if (light)
        mat[i][j] = 2;
    }
  }
  int ans = 0;
  for (int i = 0; i < h; ++i)
    for (int j = 0; j < w; ++j)
      ans += mat[i][j] > 0;
  cout << ans;
}
```

:::

## Problem F - [Valid payments](https://atcoder.jp/contests/abc182/tasks/abc182_f)

我们实际上就是要求出满足

$$
\sum k_ia_i=x
$$

并且满足

$$
\forall k_i, |k_ia_i| < a_{i+1}
$$

的整数元组$\{k_i\}$的种数。

我们不妨从小到大进行选择。容易看到，我们其实只需要记录当前每一个可能达到的总数以及对应的方法数，而不需要记录对应的具体方案。因为$a_{i+1}$总是$a_i$的倍数，所以在选择完$a_i$的系数$k_i$后，我们需要保证此时的总数能够被$a_{i+1}$整除。同时，因为$|k_ia_i| < a_{i+1}$的限制，因此，对于每一个原有的状态，我们实际上只能有两种选择。

我们以$\{x,1\}$作为初始状态开始递推。看起来，状态数会以指数规模增长，但实际上，任意时刻，我们最多同时保留两个状态，因此总时间复杂度为$\mathcal{O}(N)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int n;
  ll x;
  cin >> n >> x;
  vector<ll> a(n);
  for (int i = 0; i < n; ++i)
    cin >> a[i];
  unordered_map<ll, ll> v;
  v[x] = 1;
  ll ans = 0;
  for (int i = 0; i < n; ++i) {
    unordered_map<ll, ll> nv;
    for (auto [c, f] : v) {
      if (i + 1 < n) {
        ll rem = c % a[i + 1];
        nv[c - rem] += f;
        if (rem > 0)
          nv[c + a[i + 1] - rem] += f;
      } else {
        if (c % a[i] == 0)
          nv[0] += f;
      }
    }
    v = move(nv);
  }
  cout << v[0];
}
```

:::
