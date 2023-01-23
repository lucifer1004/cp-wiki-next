# AtCoder Beginner Contest 177 Tutorial

## Problem A - [Don't be late](https://atcoder.jp/contests/abc177/tasks/abc177_a)

Just compare how far he can go and how far he needs to go.

:::details Code (Python3)

```python
d, t, s = map(int, input().split(' '))
print('Yes' if s * t >= d else 'No')
```

:::

## Problem B - [Substring](https://atcoder.jp/contests/abc177/tasks/abc177_b)

Since $|S|\leq1000$, we can just enumerate all possibilities and take the minimum.

:::details Code (Python3)

```python
s = input()
t = input()
ls = len(s)
lt = len(t)
ans = lt
for i in range(ls - lt + 1):
    diff = 0
    for j in range(lt):
        if s[i + j] != t[j]:
            diff += 1
    ans = min(ans, diff)
print(ans)
```

:::

## Problem C - [Sum of product of pairs](https://atcoder.jp/contests/abc177/tasks/abc177_c)

We have

$$\prod_{i<j} a_ia_j=\frac{\sum a_i(\sum a_j-a_i)}{2}$$

Note that

$$\frac{1}{2}(\mod P)\equiv2^{P-2}(\mod P)$$

:::details Code (Python3)

```python
mod = int(1e9 + 7)


def fexp(x, y):
    ret = 1
    while y > 0:
        if y % 2 == 1:
            ret = ret * x % mod
        x = x * x % mod
        y = y // 2
    return ret


input()
a = list(map(int, input().split(' ')))
s = sum(a)
ans = 0
for i in a:
    ans = (ans + i * (s - i)) % mod
print(ans * fexp(2, mod - 2) % mod)
```

:::

## Problem D - [Friends](https://atcoder.jp/contests/abc177/tasks/abc177_d)

Just use DSU to find the biggest connected component. Since for one group, we can choose at most one person from each component.

:::details Code (C++)

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;

template <typename T> void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-')
      sig = -1;
  for (; isdigit(c); c = getchar())
    x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

class UnionFind {
  vector<int> parent, size;

public:
  UnionFind(int n) {
    parent = vector<int>(n);
    size = vector<int>(n, 1);
    for (int i = 0; i < n; ++i)
      parent[i] = i;
  }

  int find(int idx) {
    if (parent[idx] == idx)
      return idx;
    return parent[idx] = find(parent[idx]);
  }

  void connect(int a, int b) {
    int fa = find(a), fb = find(b);
    if (fa != fb) {
      if (size[fa] > size[fb]) {
        parent[fb] = fa;
        size[fa] += size[fb];
      } else {
        parent[fa] = fb;
        size[fb] += size[fa];
      }
    }
  }

  int solve() { return *max_element(size.begin(), size.end()); }
};

class Solution {
public:
  void solve() {
    int n, m;
    read(n), read(m);
    UnionFind uf(n);
    for (int i = 0; i < m; ++i) {
      int u, v;
      read(u), read(v);
      u--, v--;
      uf.connect(u, v);
    }
    printf("%d", uf.solve());
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  Solution solution = Solution();
  solution.solve();
}
```

:::

## Problem E - [Coprime](https://atcoder.jp/contests/abc177/tasks/abc177_e)

Just perform prime factor decompositon on all numbers, and find the maximum occurrence among all prime factors (each element counts only once).

If the maximum is equal to or less than $1$, the numbers are pairwise coprime. If the maximum is less than $N$, they are setwise coprime. Otherwise they are not coprime.

:::details Code (C++)

```cpp
#include <cstdio>
#include <iostream>
#include <map>
#include <vector>

using namespace std;

template <typename T> void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-')
      sig = -1;
  for (; isdigit(c); c = getchar())
    x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

class Solution {
public:
  void solve() {
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    vector<int> primes = {2, 3, 5, 7, 11, 13};
    for (int i = 17; i < 1000; i += 2) {
      bool ok = true;
      for (int j = 0; primes[j] * primes[j] <= i; ++j) {
        if (i % primes[j] == 0) {
          ok = false;
          break;
        }
      }
      if (ok)
        primes.emplace_back(i);
    }
    map<int, int> cnt;
    for (int i : a) {
      int t = i;
      for (int j = 0; primes[j] * primes[j] <= t; ++j) {
        if (t % primes[j] == 0)
          cnt[primes[j]]++;
        while (t % primes[j] == 0)
          t /= primes[j];
      }
      if (t != 1)
        cnt[t]++;
    }
    int hi = 0;
    for (auto p : cnt)
      hi = max(hi, p.second);
    if (hi <= 1) {
      printf("pairwise coprime");
      return;
    }
    printf(hi < n ? "setwise coprime" : "not coprime");
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  Solution solution = Solution();
  solution.solve();
}
```

:::

## Problem F - [I hate Shortest Path Problem](https://atcoder.jp/contests/abc177/tasks/abc177_f)

We can use segment tree. For each row, if the prohibited range is $[L,R]$, then we need to 

- add one to $[1,L-1]$ and $[R+1,W]$ (just go down)
- update [L,R] to $f(i)=f(L-1)+i-L+1$ (since we must go right from $L-1$)

We need to query the range minimum.

So we can just implement the two types of operations and the range minimum query.

:::details Code (C++)

```cpp
#include <cstdio>
#include <iostream>
#include <vector>

#define lson (idx << 1)
#define rson (idx << 1 | 1)
#define INF 1000000000000LL
#define MAXN 200010

using namespace std;
typedef long long ll;

template <typename T> void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-')
      sig = -1;
  for (; isdigit(c); c = getchar())
    x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

// `lo` is the current minimum of the segment.
// `lh` is the current value of the left endpoint.
// `lazy` is the lazy tag for addition.
// `flag` is the lazy tag for assignment.
struct Node {
  int l, r;
  ll lo, lh, lazy = 0;
  bool flag = false;
} s[MAXN << 2];
int h, w;

// Push up
void calc(int idx) {
  s[idx].lo = min(s[lson].lo, s[rson].lo);
  s[idx].lh = s[lson].lh;
}

void build(int idx, int l, int r) {
  s[idx].l = l, s[idx].r = r;
  if (l == r)
    return;
  int mid = (l + r) >> 1;
  build(lson, l, mid);
  build(rson, mid + 1, r);
}

// Lazy propagation
void pushdown(int idx) {
  if (s[idx].flag) {
    ll L = s[idx].lh;
    int l = s[idx].l;
    for (int i = lson; i <= rson; ++i) {
      s[i].lo = s[i].lh = L + s[i].l - l;
      s[i].flag = true;
      s[i].lazy = 0;
    }
  } else if (s[idx].lazy) {
    for (int i = lson; i <= rson; ++i) {
      s[i].lh += s[idx].lazy;
      s[i].lo += s[idx].lazy;
      s[i].lazy += s[idx].lazy;
    }
  }
  s[idx].flag = false;
  s[idx].lazy = 0;
}

// Assign segment [l, r] according to f[l-1] = L
void update(int idx, int l, int r, ll L) {
  if (s[idx].l >= l && s[idx].r <= r) {
    s[idx].lo = s[idx].lh = L + s[idx].l - l + 1;
    s[idx].flag = true;
    s[idx].lazy = 0;
    return;
  }
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    update(lson, l, r, L);
  if (mid + 1 <= r)
    update(rson, l, r, L);
  calc(idx);
}

// Range addition
void add(int idx, int l, int r) {
  if (s[idx].l >= l && s[idx].r <= r) {
    s[idx].lh++;
    s[idx].lo++;
    s[idx].lazy++;
    return;
  }
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    add(lson, l, r);
  if (mid + 1 <= r)
    add(rson, l, r);
  calc(idx);
}

// Range minimum query
ll query(int idx, int l, int r) {
  if (r < 1 || l > w)
    return INF;
  if (s[idx].l >= l && s[idx].r <= r)
    return s[idx].lo;
  pushdown(idx);
  ll ans = INF;
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    ans = min(ans, query(lson, l, r));
  if (mid + 1 <= r)
    ans = min(ans, query(rson, l, r));
  return ans;
}

class Solution {
public:
  void solve() {
    read(h), read(w);
    vector<int> l(h), r(h);
    for (int i = 0; i < h; ++i)
      read(l[i]), read(r[i]);
    vector<ll> ans(h, INF);
    build(1, 1, w);
    for (int i = 0; i < h; ++i) {
      if (l[i] > 1)
        add(1, 1, l[i] - 1);
      if (r[i] < w)
        add(1, r[i] + 1, w);
      ll L = query(1, l[i] - 1, l[i] - 1);
      update(1, l[i], r[i], L);
      ans[i] = min(ans[i], query(1, 1, w));
      if (ans[i] == INF)
        break;
    }
    for (ll i : ans)
      cout << (i == INF ? -1 : i) << endl;
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  Solution solution = Solution();
  solution.solve();
}
```

:::

:::tip Tips

If we are also allowed to go left, we only need to make a few modifications to the code above. For range $[L,R]$, we can both come from the left and the right. But no matter where we come from, the range minimum is at either $L$ or $R$.

:::

:::details Code (C++, modified problem)

```cpp
#include <cstdio>
#include <iostream>
#include <vector>

#define lson (idx << 1)
#define rson (idx << 1 | 1)
#define INF 10000000000LL
#define MAXN 200010

using namespace std;
typedef long long ll;

template <typename T> void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-')
      sig = -1;
  for (; isdigit(c); c = getchar())
    x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

// `lo` is the minimum of the segment.
// `lh` is the current value of the left endpoint.
// `rh` is the current value of the right endpoint.
// `lazy` is the lazy tag for addition.
// `flag` is the lazy tag for assignment.
struct Node {
  int l, r;
  ll lo, lh, rh, lazy = 0;
  bool flag = false;
} s[MAXN << 2];
int h, w;

void calc(int idx) {
  s[idx].lo = min(s[lson].lo, s[rson].lo);
  s[idx].lh = s[lson].lh;
  s[idx].rh = s[rson].rh;
}

void build(int idx, int l, int r) {
  s[idx].l = l, s[idx].r = r;
  if (l == r)
    return;
  int mid = (l + r) >> 1;
  build(lson, l, mid);
  build(rson, mid + 1, r);
}

void pushdown(int idx) {
  if (s[idx].flag) {
    ll L = s[idx].lh, R = s[idx].rh;
    int l = s[idx].l, r = s[idx].r;
    for (int i = lson; i <= rson; ++i) {
      s[i].lh = min(L + s[i].l - l, R + r - s[i].l);
      s[i].rh = min(L + s[i].r - l, R + r - s[i].r);
      s[i].lo = min(s[i].lh, s[i].rh);
      s[i].flag = true;
      s[i].lazy = 0;
    }
  } else if (s[idx].lazy) {
    for (int i = lson; i <= rson; ++i) {
      s[i].lh += s[idx].lazy;
      s[i].rh += s[idx].lazy;
      s[i].lo += s[idx].lazy;
      s[i].lazy += s[idx].lazy;
    }
  }
  s[idx].flag = false;
  s[idx].lazy = 0;
}

void update(int idx, int l, int r, ll L, ll R) {
  if (s[idx].l >= l && s[idx].r <= r) {
    s[idx].lh = min(L + s[idx].l - l + 1, R + r - s[idx].l + 1);
    s[idx].rh = min(L + s[idx].r - l + 1, R + r - s[idx].r + 1);
    s[idx].lo = min(s[idx].lh, s[idx].rh);
    s[idx].flag = true;
    s[idx].lazy = 0;
    return;
  }
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    update(lson, l, r, L, R);
  if (mid + 1 <= r)
    update(rson, l, r, L, R);
  calc(idx);
}

void add(int idx, int l, int r) {
  if (s[idx].l >= l && s[idx].r <= r) {
    s[idx].lh++;
    s[idx].rh++;
    s[idx].lo++;
    s[idx].lazy++;
    return;
  }
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    add(lson, l, r);
  if (mid + 1 <= r)
    add(rson, l, r);
  calc(idx);
}

ll query(int idx, int l, int r) {
  if (r < 1 || l > w)
    return INF;
  if (s[idx].l >= l && s[idx].r <= r)
    return s[idx].lo;
  pushdown(idx);
  ll ans = INF;
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    ans = min(ans, query(lson, l, r));
  if (mid + 1 <= r)
    ans = min(ans, query(rson, l, r));
  return ans;
}

class Solution {
public:
  void solve() {
    read(h), read(w);
    vector<int> l(h), r(h);
    for (int i = 0; i < h; ++i)
      read(l[i]), read(r[i]);
    vector<ll> ans(h, INF);
    build(1, 1, w);
    for (int i = 0; i < h; ++i) {
      if (l[i] > 1)
        add(1, 1, l[i] - 1);
      if (r[i] < w)
        add(1, r[i] + 1, w);
      ll L = query(1, l[i] - 1, l[i] - 1);
      ll R = query(1, r[i] + 1, r[i] + 1);
      update(1, l[i], r[i], L, R);
      ans[i] = min(ans[i], query(1, 1, w));
      if (ans[i] == INF)
        break;
    }
    for (ll i : ans)
      cout << (i == INF ? -1 : i) << endl;
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  Solution solution = Solution();
  solution.solve();
}
```

:::
