# Codeforces Round 665 (CF1401)

## Problem A - [Distance and Axis](https://codeforces.com/contest/1401/problem/A)

### 题目描述

数轴上一点A的位置为$x=n$，问，至少将A移动多少距离，才能使得存在一个整数点B，满足$||\vec{AB}|-|\vec{OB}||=k$？

### 题解

$||\vec{AB}|-|\vec{OB}||\leq|\vec{AB}-\vec{OB}|=|\vec{OA}|=n$，因此如果$n<k$，我们必须移动A。此时移动的最小距离为$k-n$，移动后，我们可以将B取在O点处。

如果$n>k$，我们必定可以在$\vec{OA}$上找到一点B使得$||\vec{AB}|-|\vec{OB}||=k$，只要取$x_B=\frac{n-k}{2}$即可。但由于题目要求B为整数点，因此如果$n-k$为奇数，我们还需要将A右移$1$个单位。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>

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

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    int n, k;
    read(n), read(k);
    printf("%d\n", n < k ? k - n : (n + k) & 1);
  }
}
```

:::

## Problem B - [Ternary Sequence](https://codeforces.com/contest/1401/problem/B)

### 题目描述

有$a$和$b$两个数组，它们长度相等。$a$中有$x_1$个$0$，$y_1$个$1$和$z_1$个$2$，$b$中有$x_2$个$0$，$y_2$个$1$和$z_2$个$2$。现在要求找出一种$a$和$b$的排列方式，使得$\sum_{i=1}^N f(a_i,b_i)$最大，求出这个最大值。

其中，$f(x,y)$的表达式为：
$$
f(x,y)=\left\{
\begin{aligned}
xy & & x>y \\
0 & & x=y \\
-xy & & x<y 
\end{aligned}
\right.
$$

### 题解

不难发现，只有$x=2,y=1$时$f(x,y)$才为正，只有$x=1,y=2$时$f(x,y)$才为负。所以我们需要最大化$x=2,y=1$的对数，同时最小化$x=1,y=2$的对数。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>

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
    int x1, y1, z1, x2, y2, z2;
    read(x1), read(y1), read(z1), read(x2), read(y2), read(z2);
    int zy = min(z1, y2);
    int pos = 2 * zy;
    z1 -= zy;
    int uz = min(z1 + x1, z2);
    z2 -= uz;
    int neg = -2 * min(y1, z2);
    printf("%d\n", pos + neg);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

## Problem C - [Mere Array](https://codeforces.com/contest/1401/problem/C)

### 题目描述

有一个数组，现在每次可以选择两个元素，如果这两个元素的最大公约数等于数组的最小值，则可以将这两个元素交换位置。问能否经过若干次操作后，将数组升序排列？

### 题解

所有是最小值倍数的元素可以排成升序（因为任意一个这样的元素都可以和最小值交换位置，所以经过若干次操作后一定可以将这些元素排成升序），而其他任意元素的位置都不能改变（不是最小值的倍数，意味着它和任意一个其他元素的最大公约数不会是最小值）。所以按照这个方式进行模拟，然后检查得到的数组是否是升序排列即可。

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

class Solution {
public:
  void solve() {
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    int lo = *min_element(a.begin(), a.end());
    vector<int> v;
    for (int i = 0; i < n; ++i)
      if (a[i] % lo == 0)
        v.emplace_back(i);
    vector<int> pos(v);
    sort(v.begin(), v.end(), [&](int i, int j) { return a[i] < a[j]; });
    vector<int> b(a);
    for (int i = 0; i < v.size(); ++i)
      b[pos[i]] = a[v[i]];
    int hi = 0;
    for (int i : b) {
      if (i < hi) {
        printf("NO\n");
        return;
      }
      hi = i;
    }
    printf("YES\n");
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

## Problem D - [Maximum Distributed Tree](https://codeforces.com/contest/1401/problem/D)

### 题目描述

有一棵$n$个节点的树，另外有$m$个质数，要求给这棵树的$n-1$条边分别标记一个权重$w_i$，使得所有权重的乘积等于这$m$个质数的乘积，并且权重中所含$1$的数量尽可能少。在这样的情况下，求$\sum_{i=1}^{n-1}\sum_{j=i+1}^ndist(i,j)$的最大值（模$10^9+7$）。其中，$dist(i,j)$为$i$节点到$j$节点简单路径的权值之和。

### 题解

显然可以求出每条边被计算的总次数。为了使得结果最大，我们应该把最大的权重赋给计算次数最多的边，依次类推。

如果质数的个数超过$n-1$个，我们可以把前$m-n+2$个合并（相乘）；否则我们需要在末尾补$1$。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>
#define MOD 1000000007

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

class Solution {
  int n, m;
  vector<vector<int>> adj;
  vector<int> cnt;
  vector<ll> weight;
  void dfs(int u, int p) {
    cnt[u] = 1;
    for (int v : adj[u])
      if (v != p) {
        dfs(v, u);
        cnt[u] += cnt[v];
      }
    weight[u] = (ll)cnt[u] * (n - cnt[u]);
  }

public:
  void solve() {
    read(n);
    adj = vector<vector<int>>(n + 1);
    cnt = vector<int>(n + 1);
    weight = vector<ll>(n + 1);
    for (int i = 0; i < n - 1; ++i) {
      int u, v;
      read(u), read(v);
      adj[u].emplace_back(v);
      adj[v].emplace_back(u);
    }
    read(m);
    vector<int> p(m);
    for (int i = 0; i < m; ++i)
      read(p[i]);
    sort(p.rbegin(), p.rend());
    dfs(1, 0);
    int idx = 0;
    if (m > n - 1) {
      for (int i = 1; m - i >= n - 1; ++i)
        p[i] = (ll)p[i - 1] * p[i] % MOD;
      idx = m - n + 1;
    }
    int ans = 0;
    sort(weight.rbegin(), weight.rend());
    for (int i = 0; i < n - 1; ++i)
      ans = ((ll)ans + weight[i] * (i < m ? p[i + idx] : 1)) % MOD;
    printf("%d\n", ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

## Problem E - [Devide Square](https://codeforces.com/contest/1401/problem/E)

### 题目描述

有一个左下角为$(0,0)$，右上角为$(10^6,10^6)$的正方形，现在有$n$条水平线段和$m$条竖直线段，已知所有线段至少有一边在正方形的边上，而另一边在正方形内，且任意两条线段均不共线，问这些线段把正方形分成了多少个区域？

### 题解

不妨把正方形的四条边也加入一并考虑。

经过试验和观察，我们可以发现，如果一条竖直的线段与$k$条水平线段相交，其中有$p$个交点是对应的水平线段上的第二个或以后的交点，那么就会增加$p-1$个区域。我们可以维护一个线段树，记录每一个高度处的水平线段当前的交点数情况（没有交点，一个交点，两个或更多交点）。这个线段树需要支持以下几种操作：

- $[l,r]$范围内的每条线段交点数增加$1$，也即增加了一条高度范围为$[l,r]$竖直线段，此时原本一个交点的变成两个交点，没有交点的变成一个交点
- $y$处的线段数增加$1$，此时新增一条没有交点的线段。
- $y$处的线段数减少$1$，此时所有情况都变为$0$（因为原本至多有一条）。

分别实现对应的操作，然后从左向右扫描即可。

本题坐标最大为$10^6$，而离散化之后最多需要处理$3\times10^5$个端点，二者差别不大，因此可以不离散化。如果坐标范围更大，比如到$10^9$，则必须进行离散化。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>
#define MAXN 1000000
#define lson (idx << 1)
#define rson (idx << 1 | 1)

using namespace std;
typedef long long ll;
typedef pair<int, int> pii;

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

struct Node {
  int l, r, zero = 0, first = 0, second = 0;
  bool lazy = false;
} s[(MAXN + 10) << 2];

void calc(int idx) {
  s[idx].zero = s[lson].zero + s[rson].zero;
  s[idx].first = s[lson].first + s[rson].first;
  s[idx].second = s[lson].second + s[rson].second;
}

void update(int idx) {
  s[idx].second += s[idx].first;
  s[idx].first = s[idx].zero;
  s[idx].zero = 0;
  s[idx].lazy = true;
  return;
}

void pushdown(int idx) {
  if (s[idx].lazy)
    for (int i = lson; i <= rson; ++i)
      update(i);
  s[idx].lazy = false;
}

void build(int idx, int l, int r) {
  s[idx].l = l, s[idx].r = r;
  if (l == r)
    return;
  int mid = (l + r) >> 1;
  build(lson, l, mid);
  build(rson, mid + 1, r);
}

void update(int idx, int l, int r) {
  if (s[idx].l >= l && s[idx].r <= r) {
    update(idx);
    return;
  }
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    update(lson, l, r);
  if (mid + 1 <= r)
    update(rson, l, r);
  calc(idx);
}

void inc(int idx, int pos) {
  if (s[idx].l == s[idx].r && s[idx].l == pos) {
    s[idx].zero++;
    return;
  }
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (pos <= mid)
    inc(lson, pos);
  else
    inc(rson, pos);
  calc(idx);
}

void dec(int idx, int pos) {
  if (s[idx].l == s[idx].r && s[idx].l == pos) {
    s[idx].zero = s[idx].first = s[idx].second = 0;
    return;
  }
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (pos <= mid)
    dec(lson, pos);
  else
    dec(rson, pos);
  calc(idx);
}

int query(int idx, int l, int r) {
  if (s[idx].l >= l && s[idx].r <= r)
    return s[idx].second;
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  int ans = 0;
  if (l <= mid)
    ans += query(lson, l, r);
  if (mid + 1 <= r)
    ans += query(rson, l, r);
  return ans;
}

class Solution {
public:
  void solve() {
    int n, m;
    read(n), read(m);
    vector<pair<int, pii>> hseg, vseg;
    vector<vector<int>> start(MAXN + 1), end(MAXN + 1);
    for (int i = 0; i < n; ++i) {
      int y, l, r;
      read(y), read(l), read(r);
      hseg.push_back({y, {l, r}});
    }
    hseg.push_back({0, {0, MAXN}});
    hseg.push_back({MAXN, {0, MAXN}});
    for (auto p : hseg) {
      int y = p.first;
      int l = p.second.first, r = p.second.second;
      start[l].emplace_back(y);
      end[r].emplace_back(y);
    }
    for (int i = 0; i < m; ++i) {
      int x, l, r;
      read(x), read(l), read(r);
      vseg.push_back({x, {l, r}});
    }
    vseg.push_back({0, {0, MAXN}});
    vseg.push_back({MAXN, {0, MAXN}});
    sort(vseg.begin(), vseg.end());
    ll ans = 0;
    build(1, 1, MAXN + 1);
    for (int i = 0; i < vseg.size(); ++i) {
      auto &p = vseg[i];
      int x = p.first;
      for (int y : start[x])
        inc(1, y + 1);
      int l = p.second.first, r = p.second.second;
      update(1, l + 1, r + 1);
      int cross = query(1, l + 1, r + 1);
      ans += max(0, cross - 1);
      for (int y : end[x])
        dec(1, y + 1);
      if (i + 1 < vseg.size())
        for (int j = x + 1; j < vseg[i + 1].first; ++j) {
          for (int y : start[j])
            inc(1, y + 1);
          for (int y : end[j])
            dec(1, y + 1);
        }
    }
    printf("%lld", ans);
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

## Problem F - [Reverse and Swap](https://codeforces.com/contest/1401/problem/F)

### 题目描述

有一个总长度为$2^n$的数组，要求支持以下四种操作：

- $replace(x,k)$，将位置$x$处的数设为$k$
- $reverse(k)$，将每一段长度为$2^k$的子区间倒序
- $swap(k)$，交换每两段相邻的长度为$2^k$的子区间
- $sum(l,r)$，求$[l,r]$范围内所有数的和

### 题解

整个数组可以用一个线段树维护（并且这个线段树是一个完全二叉树），麻烦的是如何处理倒序和交换这两种操作。

无论倒序还是交换，相同的操作连续进行两次，等价于没有进行操作；另一方面，对于任意一层，它的两个孩子的分组关系是恒定不变的，会改变的只有它们的左右位置和内部顺序。以$[1,2,3,4,5,6,7,8]$为例，无论是进行倒序，还是交换，都不会改变$\{1,2,3,4\}$和$\{5,6,7,8\}$这样的分组关系；同样，向下一层，$\{1,2\}$和$\{3,4\}$的分组，$\{5,6\}$和$\{7,8\}$的分组也是始终保持的。

因此，我们可以用两个二进制数，一个记录当前的倒序操作，另一个记录当前的交换操作。每次有新的操作，就与当前的状态进行异或即可。

对于倒序和交换这两种操作，我们并不需要对线段树进行任何操作，直接修改对应的状态即可。实际需要实现的线段树操作就是单点赋值和区间查询。这里的难点在于，操作中给出的位置，并不一定对应实际的位置，而需要我们根据当前的倒序和交换状态，将其进行变换，以得到最终的实际位置。

赋值的情况相对简单，因为我们只需要处理一个点。如果当前层有倒序操作，我们就把这个点翻转到对称点上；如果还有交换操作，我们就再将这个点进行一个循环平移。

查询时我们需要处理一个区间，这时我们不能简单地只处理两个端点，因为对于两个端点跨越了当前区间中点的情形，这段连续区间实际上会对应两个不连续的区间。比如，数组$[1,2,3,4,5,6,7,8]$经过$swap(2)$和$reverse(3)$操作后，变为了$[4,3,2,1,8,7,6,5]$。这时，假设我们查询$[3,7]$，因为在最上层有倒序操作，所以我们翻转区间，将其变为$[2,6]$；然后，因为有交换操作，两个端点会变为$6$和$2$，但此时，如果我们继续按照$[2,6]$来进行操作，显然会发生错误，因为我们可以看到这段区间对应的值是$[2,1,8,7,6]$，实际上是$[1,2]$和$[6,8]$这两段不连续的区间。因此，我们要把倒序后得到的$[2,6]$首先拆分为$[2,4]$和$[5,6]$，然后对这两段区间分别进行平移，就可以得到$[1,2]$和$[6,8]$了。而如果两个端点在当前区间中点的同一侧，则不需要进行这一额外处理。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#define MAXN 300005
#define lson (idx << 1)
#define rson (idx << 1 | 1)

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

int a[MAXN], ss = 0, rr = 0;
ll s[MAXN << 2];

void calc(int idx) { s[idx] = s[lson] + s[rson]; }

void build(int idx, int l, int r) {
  if (l == r) {
    s[idx] = a[l];
    return;
  }
  int mid = (l + r) >> 1;
  build(lson, l, mid);
  build(rson, mid + 1, r);
  calc(idx);
}

void move(int &idx, int level) { idx = ((idx - 1) ^ (1 << (level - 1))) + 1; }

void update(int idx, int pos, int val, int level, int cl, int cr) {
  if (level == 0) {
    s[idx] = val;
    return;
  }
  bool fr = (rr & (1 << level));
  bool fs = (ss & (1 << level));
  int mid = (cl + cr) >> 1;
  if (fr)
    pos = cl + cr - pos;
  if (fs)
    move(pos, level);
  if (pos <= mid)
    update(lson, pos, val, level - 1, cl, mid);
  else
    update(rson, pos, val, level - 1, mid + 1, cr);
  calc(idx);
}

ll query(int idx, int l, int r, int level, int cl, int cr) {
  if (cl >= l && cr <= r)
    return s[idx];
  ll ans = 0;
  bool fr = (rr & (1 << level));
  bool fs = (ss & (1 << level));
  int mid = (cl + cr) >> 1;
  if (fr)
    l = cl + cr - l, r = cl + cr - r, swap(l, r);
  if (r <= mid || l >= mid + 1) {
    if (fs)
      move(l, level), move(r, level);
    if (l <= mid)
      ans += query(lson, l, r, level - 1, cl, mid);
    else
      ans += query(rson, l, r, level - 1, mid + 1, cr);
  } else {
    int le = mid, rs = mid + 1;
    if (fs)
      move(l, level), move(le, level), move(rs, level), move(r, level);
    if (l > rs)
      swap(l, rs), swap(le, r);
    ans += query(lson, l, le, level - 1, cl, mid);
    ans += query(rson, rs, r, level - 1, mid + 1, cr);
  }
  return ans;
}

class Solution {
public:
  void solve() {
    int n, q;
    read(n), read(q);
    int R = 1 << n;
    for (int i = 1; i <= R; ++i)
      read(a[i]);
    build(1, 1, R);
    while (q--) {
      int t, x, k, l, r;
      read(t);
      switch (t) {
      case 1:
        read(x), read(k);
        update(1, x, k, n, 1, R);
        break;
      case 2:
        read(k);
        rr ^= (1 << k);
        break;
      case 3:
        read(k);
        ss ^= (1 << (k + 1));
        break;
      default:
        read(l), read(r);
        printf("%lld\n", query(1, l, r, n, 1, R));
      }
    }
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
