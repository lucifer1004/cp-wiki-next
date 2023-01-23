# SnarkNews Summer Series 2020 Round 1

## Problem A - [Electric Lighting](https://contest.yandex.com/snss2020/contest/19320/problems/)

### 题目描述

有$N$个矩形（四个顶点的坐标均为非负整数），要求找到一个最佳的整数点，使得该点到每个矩形四个顶点的Manhattan距离的最小值的总和最小。求出这个最小值。

### 题解

容易看出$x$-轴和$y$-轴可以分别处理，这样就转化为了一维的问题：在数轴上有$N$条线段，要求找到一个最佳的整数点，使得该点到每条线段的两个端点的Manhattan距离的最小值的总和最小。

设$f(x,AB)=min(|x-a|,|x-b|)$，观察可知，函数在$(-\infty,a]$和$[\frac{a+b}{2},b]$单调递减，在$[a,\frac{a+b}{2}]$和$[b,+\infty)$单调递增。所以，我们可以知道$F(x)=\sum_if(x,L_i)$的最小值一定可以在某条线段的端点处取得。

在$x$从左向右移动的过程中，$F(x)$的值如何变化？这与当前每条线段的状态有关。参照上面的讨论，我们可以用每条线段的左端点、中点和右端点确定四个区间。当$x$处在第一和第三区间时，$x$向右移动，值减小；当$x$处在第二和第四区间时，$x$向右移动，值增大。因此，我们可以对所有线段的端点和中点进行离散化，然后使用扫描线算法求解。

:::details 参考代码（C++）

```cpp
#include <climits>
#include <cstdio>
#include <iostream>
#include <set>
#include <vector>
#define MAXN 20000005

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

int dict[MAXN];

class Solution {
public:
  void solve() {
    int n;
    read(n);
    vector<vector<int>> a(n, vector<int>(4));
    for (int i = 0; i < n; ++i)
      for (int j = 0; j < 4; ++j) {
        int aij;
        read(aij);
        a[i][j] = aij << 1;
      }
    ll ans = 0;
    for (int k = 0; k <= 1; ++k) {
      int lo = INT_MAX, hi = 0;
      set<int> ts;
      for (int i = 0; i < n; ++i) {
        lo = min(lo, a[i][k]);
        hi = max(hi, a[i][k + 2]);
        int c = (a[i][k] + a[i][k + 2]) >> 1;
        ts.insert(a[i][k]);
        ts.insert(c);
        ts.insert(a[i][k + 2]);
      }
      vector<int> v(ts.begin(), ts.end());
      int m = v.size();
      for (int i = 0; i < m; ++i)
        dict[v[i]] = i;
      vector<int> start(m), mid(m), end(m);
      for (int i = 0; i < n; ++i) {
        int c = (a[i][k] + a[i][k + 2]) >> 1;
        start[dict[a[i][k]]]++;
        mid[dict[c]]++;
        end[dict[a[i][k + 2]]]++;
      }
      ll tot = 0;
      for (int i = 0; i < n; ++i)
        tot += a[i][k] - lo;
      ll best = tot;
      int c1 = n, c2 = 0, c3 = 0, c4 = 0;
      for (int i = 0; i < m; ++i) {
        if (i > 0)
          tot += (ll)(c2 + c4 - (c1 + c3)) * (v[i] - v[i - 1]);
        c1 -= start[i];
        c2 += start[i];
        c2 -= mid[i];
        c3 += mid[i];
        c3 -= end[i];
        c4 += end[i];
        if (v[i] % 2 == 0)
          best = min(best, tot);
      }
      ans += best;
    }
    printf("%lld", ans / 2);
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

## Problem B - [Loading](https://contest.yandex.com/snss2020/contest/19320/problems/B/)

### 题目描述

有$A$个$5$，$B$个$4$，$C$个$3$，$D$个$2$，$E$个$1$，现在用容量为$5$的盒子去装，至少要几个盒子？

### 题解

贪心：

- 首先放$5$
- 放$4$，同时放$1$
- 放$3$，同时放$2$；如果还有空位置，放$1$
- 放$2$，同时放$1$
- 放$1$

:::details 参考代码（C++）

```cpp
#include <iostream>

using namespace std;

int main() {
  int a, b, c, d, e;
  cin >> a >> b >> c >> d >> e;
  int ans = a + b + c;
  int be = min(b, e);
  e -= be;
  int cd = min(c, d);
  d -= cd;
  c -= cd;
  if (c > 0)
    e -= min(c * 2, e);
  int dd = (d + 1) / 2;
  int extra = dd * 5 - d * 2;
  ans += dd;
  e = max(e - extra, 0);
  ans += (e + 4) / 5;
  cout << ans;
}
```

:::

## Problem C - [Corporate Names](https://contest.yandex.com/snss2020/contest/19320/problems/C/)

### 题目描述

有$N$个公司，每一个的名字都是两个单词，现在要求给每个公司一个缩略名，这一缩略名必须是该公司名称的第一个单词的非空前缀加上第二个单词的非空前缀。要求任意两个公司的缩略名不相同，问能否给出一种满足要求的安排方式。

### 题解

显然，公司名和缩略名可以构成二分图，因为数据范围比较小，直接跑一遍匈牙利算法即可。

:::details 参考代码（C++）

```cpp
#include <cstring>
#include <iostream>
#include <map>
#include <set>
#include <vector>

using namespace std;

bool adj[105][10005], vis[10005];
int n, m, link[10005], match = 0;

bool find(int u) {
  for (int v = 1; v <= m; ++v) {
    if (adj[u][v] && !vis[v]) {
      vis[v] = true;
      if (link[v] == 0 || find(link[v])) {
        link[v] = u;
        return true;
      }
    }
  }
  return false;
}

void hungary() {
  for (int i = 1; i <= n; ++i) {
    memset(vis, 0, sizeof(vis));
    if (find(i))
      match++;
  }
}

int main() {
  cin >> n;

  set<string> abbr;
  vector<vector<string>> comb(n);
  for (int i = 0; i < n; ++i) {
    string s, t;
    cin >> s >> t;
    int ls = s.size(), lt = t.size();
    for (int j = 1; j <= ls; ++j)
      for (int k = 1; k <= lt; ++k) {
        string st = s.substr(0, j) + t.substr(0, k);
        abbr.insert(st);
        comb[i].emplace_back(st);
      }
  }
  vector<string> v(abbr.begin(), abbr.end());
  m = v.size();
  map<string, int> dict;
  for (int i = 0; i < m; ++i)
    dict[v[i]] = i + 1;
  memset(adj, 0, sizeof(adj));
  memset(link, 0, sizeof(link));
  for (int i = 0; i < n; ++i)
    for (string st : comb[i])
      adj[i + 1][dict[st]] = true;

  hungary();
  if (match != n)
    cout << "No solution";
  else {
    vector<string> ans(n + 1);
    for (int i = 1; i <= m; ++i)
      if (link[i])
        ans[link[i]] = v[i - 1];
    for (int i = 1; i <= n; ++i)
      cout << ans[i] << endl;
  }
}
```

:::
