# AtCoder Beginner Contest 179 Tutorial

## Problem A - [Plural Form](https://atcoder.jp/contests/abc179/tasks/abc179_a)

Just implement the logic.

Time complexity $O(|S|)$.

:::details Code (Python 3)

```python
s = input()
print(s + ('s' if s[-1] != 's' else 'es'))
```

:::

## Problem B - [Go to Jail](https://atcoder.jp/contests/abc179/tasks/abc179_b)

Use a counter to store current consecutive doublets, and check whether the counter has ever gone up to $3$.

Time complexity $O(N)$.

:::details Code (Python 3)

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

For a specific $C$, the number of $(A, B)$ pairs equals to the number of factors of $N-C$.

Note that the number of factors can be calculated via prime factorization. If 

$$
n=p_1^{a_1}p_2^{a_2}\dots p_k^{a_k}
$$

Then the number of factors is 

$$
\prod_{i=1}^k(a_i+1)
$$

So we just perform prime factorization on all integers $1\dots N-1$, and calculate the sum of the number of factors.

Considering the number of prime numbers within $[1,x]$ can be approximated by $\frac{x}{\ln x}$, the total time complexity is $O(\frac{N\sqrt{N}}{\log N})$.

:::details Code (C++)

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

Suppose that we are currently at position $x$, where can we come from?

We need to check all segments, and find a corresponding (if there is) segment $[l,r]$, which consists of the positions that can be our last position. Then we add $sum(l,r)$ to $dp[x]$.

Since we need to calculate $sum(l,r)$ quickly, instead of using $dp[i]$, we use the prefix sum $sum[i]$.

Time complexity is $O(NK)$.

:::details Code (C++)

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

Obviously, after enough operations, the sequence will start looping forever. Since $M\leq10^5$, the length of the loop cannot be longer than $10^5$, so we just find the loop and calculate the result.

Be careful that the start point of the loop is not necessarily $X$.

Time complexity is $O(M)$.

:::details Code (C++)

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

When we put a white stone, how many black stones will be changed to white?

If we are performing the first type of operation, the number depends on the topmost white stone in the chosen column. If we are performing the second type of operation, the number depends on the leftmost white stone in the chosen row.

What effects will our operation have on the board? The first type of operation will affect all rows within $[1, X]$ (where $X$ is the topmost white stone's row), and the second type of operation will affect all columns within $[1,X]$ (where $X$ is the leftmost white stone's column).

So we just use two segment trees, one for columns and the other for rows. For each node, we store the maximum value in the segment. Particularly, for a leaf node, its maximum value equals to the topmost/leftmost position.

Then when we apply an operation, it is like performing a cut on $[1,X]$, which sets all values $>X$ to $X$.

Time complexity is $O(Q\log N)$.

:::details Code (C++)

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
