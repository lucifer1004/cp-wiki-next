# AtCoder Beginner Contest 179

## Problem A - [Plural Form](https://atcoder.jp/contests/abc179/tasks/abc179_a)

直接实现逻辑即可。时间复杂度为$O(|S|)$。

:::details 参考代码 （Python 3）

```python
s = input()
print(s + ('s' if s[-1] != 's' else 'es'))
```

:::

## Problem B - [Go to Jail](https://atcoder.jp/contests/abc179/tasks/abc179_b)

按要求计数即可。时间复杂度为$O(N)$。

:::details 参考代码 （Python 3）

```python
n = int(input())
cnt = 0
ok = False
for _ in range(n):
    x, y = map(int, input().split())
    if x == y:
        cnt += 1
        if cnt >= 3:
            ok = True
    else:
        cnt = 0
print('Yes' if ok else 'No')
```

:::

## Problem C - [A x B + C](https://atcoder.jp/contests/abc179/tasks/abc179_c)

固定$C$，符合条件的二元组$(A, B)$的数目就等于$N-C$的因子数，而一个正整数的因子数可以通过质因数分解求得。

设

$$
n=p_1^{a_1}p_2^{a_2}\dots p_k^{a_k}
$$

则其因子数为

$$
\prod_{i=1}^k(a_i+1)
$$

所以我们就计算$1\dots N-1$每个数的因子数，然后求和即可。

因为$[1,x]$范围内的质数个数近似为$\frac{x}{\ln x}$，总时间复杂度为$O(\frac{N\sqrt{N}}{\log N})$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;
int main() {
  int n;
  cin >> n;
  vector<int> primes = {2, 3, 5, 7, 11, 13};
  for (int i = 17; i <= n - 1; i += 2) {
    bool is_prime = true;
    for (int j = 0; primes[j] * primes[j] <= i; ++j) {
      if (i % primes[j] == 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime)
      primes.emplace_back(i);
  }
  int ans = 0;
  for (int i = 1; i < n; ++i) {
    int k = i;
    int fac = 1;
    for (int j = 0; primes[j] * primes[j] <= k; ++j) {
      if (k % primes[j] == 0) {
        int cnt = 0;
        while (k % primes[j] == 0)
          cnt++, k /= primes[j];
        fac *= (cnt + 1);
      }
    }
    if (k != 1)
      fac *= 2;
    ans += fac;
  }
  cout << ans;
}
```

:::

## Problem D - [Leaping Tak](https://atcoder.jp/contests/abc179/tasks/abc179_d)

考虑我们当前处在$x$位置，我们上一步可能来自哪里？

我们需要检查所有的区间，然后找出对应的区间$[l,r]$（如果这样的区间存在的话），这一区间包含了所有能够利用原区间中的步长跳跃到当前位置的位置，也即上一步可能的位置。接下来我们将$sum(l,r)$累加到$dp[x]$上。

因为我们需要快速计算$sum(l,r)$，所以实际上我们可以使用前缀和$sum[i]$，而非$dp[i]$。

时间复杂度为$O(NK)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;
const ll MOD = 998244353;

int main() {
  int n, k;
  cin >> n >> k;
  vector<pair<int, int>> v(k);
  for (int i = 0; i < k; ++i)
    cin >> v[i].first >> v[i].second;
  vector<ll> sum(n + 1);
  sum[1] = 1;
  for (int i = 2; i <= n; ++i) {
    ll curr = 0;
    for (int j = 0; j < k; ++j) {
      if (v[j].first >= i)
        continue;
      int l = max(1, i - v[j].second);
      int r = i - v[j].first;
      curr += sum[r] - sum[l - 1];
    }
    curr %= MOD;
    if (curr < 0)
      curr += MOD;
    sum[i] = (sum[i - 1] + curr) % MOD;
  }
  ll ans = sum[n] - sum[n - 1];
  if (ans < 0)
    ans += MOD;
  cout << ans;
}
```

:::

## Problem E - [Sequence Sum](https://atcoder.jp/contests/abc179/tasks/abc179_e)

显然，操作足够多次后，一定会开始循环。因为$M\leq10^5$，所以循环的长度不超过$10^5$，因此我们直接模拟找出循环节即可。

需要注意的是，循环节的起点未必是$X$。

总时间复杂度为$O(M)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <map>
#include <vector>

using namespace std;
typedef long long ll;
int main() {
  ll n, x, m;
  cin >> n >> x >> m;
  map<ll, int> mp;
  int idx = 0;
  vector<ll> path;
  do {
    mp[x] = idx++;
    path.emplace_back(x);
    x = x * x % m;
  } while (!mp.count(x));
  int start = mp[x];
  int len = idx - start;
  ll sum = 0;
  for (int i = start; i < idx; ++i)
    sum += path[i];
  ll ans = 0;
  if (n < start) {
    for (int i = 0; i < n; ++i)
      ans += path[i];
  } else {
    for (int i = 0; i < start; ++i)
      ans += path[i];
    ll loop = (n - start) / len;
    ans += loop * sum;
    ll rem = (n - start) % len;
    for (int i = 0; i < rem; ++i)
      ans += path[start + i];
  }
  cout << ans;
}
```

:::

## Problem F - [Simplified Reversi](https://atcoder.jp/contests/abc179/tasks/abc179_f)

当我们放一个白石头的时候，会改变多少黑石头的颜色？

对于第一种操作，这是由该列最上面的白石头决定的；对于第二种操作，这是由该行最左边的白石头决定的。

而每种操作的影响是什么呢？第一种操作会影响$1\dots X$行（$X$是操作的列最上面的白石头所在的行），而第二种操作会影响$1\dots X$列（$X$是操作的行最左边的白石头所在的列）。

很自然地想到用线段树来处理。一个储存每行最上面的白石头，另一个储存每列最左边的白石头。对于非叶结点，我们存储区间的最大值。因为我们每次操作相当于一个切割，把所有大于$X$的数都变为$X$，因此，存储区间最大值，可以让我们很方便地判断当前的切割是否产生了影响。

时间复杂度为$O(Q\log N)$.

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <vector>
#define MAXN 200005
#define lson (idx << 1)
#define rson (idx << 1 | 1)

using namespace std;
typedef long long ll;

struct Node {
  int l, r, hi, lazy = 0;
};

struct SegTree {
  Node s[MAXN << 2];
  void calc(int idx) { s[idx].hi = max(s[lson].hi, s[rson].hi); }

  void pushdown(int idx) {
    if (s[idx].lazy) {
      for (int i = lson; i <= rson; ++i) {
        if (s[i].hi > s[idx].lazy) {
          s[i].hi = s[idx].lazy;
          s[i].lazy = s[idx].lazy;
        }
      }
    }
    s[idx].lazy = 0;
  }

  void build(int idx, int l, int r, vector<int> &a) {
    s[idx].l = l, s[idx].r = r;
    if (l == r) {
      s[idx].hi = a[l];
      return;
    }
    int mid = (l + r) >> 1;
    build(lson, l, mid, a);
    build(rson, mid + 1, r, a);
    calc(idx);
  }

  void update(int idx, int l, int r, int x) {
    if (s[idx].hi <= x)
      return;
    if (s[idx].l >= l && s[idx].r <= r) {
      s[idx].hi = x;
      s[idx].lazy = x;
      return;
    }
    pushdown(idx);
    int mid = (s[idx].l + s[idx].r) >> 1;
    if (l <= mid)
      update(lson, l, r, x);
    if (mid + 1 <= r)
      update(rson, l, r, x);
    calc(idx);
  }

  int query(int idx, int l, int r) {
    if (s[idx].l >= l && s[idx].r <= r)
      return s[idx].hi;
    pushdown(idx);
    int ans = 0;
    int mid = (s[idx].l + s[idx].r) >> 1;
    if (l <= mid)
      ans = max(ans, query(lson, l, r));
    if (mid + 1 <= r)
      ans = max(ans, query(rson, l, r));
    return ans;
  }
};

int main() {
  int n, q;
  cin >> n >> q;
  vector<int> col(n + 1, n), row(n + 1, n);
  col[n] = 1, row[n] = 1;
  SegTree C, R;
  C.build(1, 1, n, col);
  R.build(1, 1, n, row);
  ll ans = (ll)(n - 2) * (n - 2);
  for (int i = 0; i < q; ++i) {
    int t, x;
    cin >> t >> x;
    if (t == 1) {
      int hi = C.query(1, x, x);
      ans -= hi - 2;
      R.update(1, 1, hi, x);
      C.update(1, x, x, 1);
    } else {
      int hi = R.query(1, x, x);
      ans -= hi - 2;
      C.update(1, 1, hi, x);
      R.update(1, x, x, 1);
    }
  }
  cout << ans;
}
```

:::
