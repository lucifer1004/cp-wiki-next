# AtCoder Beginner Contest 177

## Problem A - [Don't be late](https://atcoder.jp/contests/abc177/tasks/abc177_a)

### 题目描述

有$T$分钟，每分钟能跑$S$米，能不能到一个距离为$D$米的地方？

### 题解

比较能跑的最远距离和需要跑的距离即可。

:::details 参考代码（Python）

```python
d, t, s = map(int, input().split(' '))
print('Yes' if s * t >= d else 'No')
```

:::

## Problem B - [Substring](https://atcoder.jp/contests/abc177/tasks/abc177_b)

### 题目描述

给定两个字符串$S$和$T$（$|T|\leq|S|\leq1000$），问至少需要修改$T$中的几个字母，可以将$T$变为$S$的子串？

### 题解

数据范围很小，枚举即可。

:::details 参考代码（Python）

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

### 题目描述

求$\prod_{i<j} a_ia_j\mod 1000000007$ 。

### 题解

$\prod_{i<j} a_ia_j=\frac{\sum a_i(\sum a_j-a_i)}{2}$，注意取模意义下除以$2$要变为乘$2$的逆元。

:::details 参考代码（Python）

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

### 题目描述

有$N$（$N\leq2\times10^5$）个人和$M$（$M\leq2\times10^5$）对朋友关系，朋友关系可以传递，求要让每个分组中任意两人都不是朋友，最少要分多少组？

### 题解

并查集找出最大的连通分量即为答案。

:::details 参考代码（C++）

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

### 题目描述

有$N$（$N\leq10^6$）个数，这些数都不超过$10^6$。如果这些数两两互质，输出`pairwise coprime`；如果这些数互质，输出`setwise coprime`，否则输出`not coprime`。

### 题解

质因数分解，统计含有每个质因子的数的个数，然后求出最大的个数。如果这个值为$1$，说明两两互质；如果这个值小于$N$，说明总体互质。

:::details 参考代码（C++）

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

### 题目描述

有一个$H+1$（$H\leq2\times10^5$）行$W$（$W\leq2\times10^5$）列的方阵，只能向下或向右走。前$H$行每行从$A_i$到$B_i$不能向下走。求出走到第$2,3,\cdots,H+1$行所需要的最短步数。

### 题解

使用线段树求解。对于某一行，如果这行不能向下走的区间是$[L,R]$，则：

- 对$[1,L-1]$和$[R+1,W]$整段加一
- $[L,R]$区间更新为$f(L-1)+i-L+1$（因为这个区间必须从$L-1$这个位置走过来）

需要查询的是区间最小值。

实现以上两种操作和一种查询即可。

:::details 参考代码（C++）

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

:::tip 小贴士

如果题目改为可以向左或向右走，只需要对数据结构稍作修改即可。

:::

:::details 参考代码（C++）

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
