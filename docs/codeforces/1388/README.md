# Codeforces Round 660 (CF1388)

## Problem A - Captain Flint and Crew Recruitment

### 题目描述

给定一个正整数 $n$，问能否将其表示为四个互不相等的正整数的和，要求其中至少三个正整数可以表示为 $p\cdot q$ 的形式（$p$ 和 $q$ 是不相等的质数）。

### 题解

这题乍一看有点恐怖，毕竟跟质数沾上了边，怎么想也不像是 Div 2A。再看题目，关键点是**至少三个**，也就是说，我们只要保证三个数符合条件，剩下一个数直接用剩下的差就行。

考虑符合条件的三个数，我们选尽可能小的，那就是 $6=2\times3$，$10=2\times5$，$14=2\times7$。这三个数的和为 $30$，因此剩下那个数为 $n-30$，所以 $n\leq30$时无解。

还要考虑几个特殊情况，也就是剩下那个数 $n-30$ 跟已有的三个数中某一个相等。此时，把 $14$ 换成 $15$，剩下那个数换成 $n-31$ 即可。

:::tip 小贴士
CF 的题号和难度对应关系一般是比较明确的，在 Div 2的 A/B 题卡住的话，通常可以认为是有关键条件没有注意到，导致想复杂了。
:::

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
    int n;
    read(n);
    if (n <= 30) {
      printf("NO\n");
      return;
    }
    printf("YES\n");
    if (n == 36 || n == 40 || n == 44)
      printf("6 10 15 %d\n", n - 31);
    else
      printf("6 10 14 %d\n", n - 30);
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

## Problem B - Captain Flint and a Long Voyage

### 题目描述

求出能够使得逐位二进制展开再去掉最后$n$位的结果对应的二进制数最大的最小$n$位数。

例如，$9$逐位展开的结果是$1001$，再去掉最后$1$位，变为$100$。

### 题解

因为二进制展开结果不会有先导$0$，所以肯定位数越多结果越大，因此我们的$n$位数每一位只能选$8$或$9$，否则位数就损失了。什么情况下要选$8$呢？因为$8$对应$1000$，$9$对应$1001$，所以只要最后一位是要被删去的，$8$和$9$的结果就没有区别，此时为了使得这一$n$位数最小，这一位上就要选$8$。

所以就是很简单的贪心了，最后$\left\lceil\frac{n}{4}\right\rceil$位放$8$，前面都放$9$。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#define MOD 1000000007

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
    int m = (n - 1) / 4 + 1;
    string a(n - m, '9');
    string b(m, '8');
    string ans = a + b;
    printf("%s\n", ans.c_str());
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

## Problem C - Uncle Bogdan and Country Happiness

### 题目描述

一棵根为$1$的树，一开始所有人都在根节点处，接下来他们会沿着最短路径回家。已知家在第$i$个节点的人有$p_i$个，第$i$个节点处的快乐值为$h_i$表示在该节点处快乐的人和不快乐的人的个数差。已知一个人只会从快乐变成不快乐，问给定的$h$是否有可能成立。

### 题解

很显然是一道DFS的题目，关键是如何提取出约束条件。因为一个人只会从快乐变为不快乐，所以任意子树的根节点处，快乐的人数一定不少于这一子树的所有子节点的快乐人数之和。另一方面，快乐的人数也不会超过经过该节点的总人数。除了这两个比较显而易见的约束，还有一个不那么明显的约束。事实上，我们是可以得到下面的等式的

$$happy[i] - (cnt[i] - happy[i]) = h_i$$

其中$happy[i]$表示第$i$个节点处快乐的人数，$cnt[i]$表示第$i$个节点处的总人数。

我们进一步可以得到

$$happy[i]=\frac{h_i+cnt[i]}{2}$$

因为$happy[i]$需要为非负整数，所以$h_i+cnt[i]$必须为偶数。

然后在DFS过程中判断上面三个条件是否都满足就行了。

:::details 参考代码（C++）

```cpp
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
  bool ok = true;
  int n, m;
  vector<int> p, h, cnt, happy;
  vector<vector<int>> adj;
  void check(int u, int pre) {
    int lo = 0;
    cnt[u] = p[u];
    for (int v : adj[u]) {
      if (v != pre) {
        check(v, u);
        cnt[u] += cnt[v];
        lo += happy[v];
      }
    }
    if ((h[u] + cnt[u]) % 2 != 0)
      ok = false;
    happy[u] = (h[u] + cnt[u]) / 2;
    if (happy[u] < lo || happy[u] > cnt[u])
      ok = false;
  }

public:
  void solve() {
    read(n), read(m);
    adj = vector<vector<int>>(n + 1);
    p = vector<int>(n + 1);
    h = vector<int>(n + 1);
    cnt = vector<int>(n + 1);
    happy = vector<int>(n + 1);
    for (int i = 1; i <= n; ++i)
      read(p[i]);
    for (int i = 1; i <= n; ++i)
      read(h[i]);
    for (int i = 1; i < n; ++i) {
      int u, v;
      read(u), read(v);
      adj[u].emplace_back(v);
      adj[v].emplace_back(u);
    }
    check(1, 0);
    printf(ok ? "YES\n" : "NO\n");
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

## Problem D - Captain Flint and Treasure

### 题目描述

有$n$个数$a_1\cdots a_n$，以及对应的$n$个序号$b_1\cdots b_n$。要求对$n$个数按照某一顺序依次操作一次，使得得到的总和最大，求出这个总和并给出这一顺序。

其中，每次操作会使得总和增加$a_i$，如果$b_i\neq-1$，还会使得$a_{b_i}+=a_i$。

对于任意的$i$，$b_i,b_{b_i},b_{b_{b_i}},\cdots$不构成循环。

### 题解

题目明确说了$b$中不存在环，所以我们可以按照$b$所描述的依赖关系进行拓扑排序，然后依次处理。

对于当前处理到的$i$，如果$a_i>0$，显然我们希望把它加到后面的依赖项上，因此我们应当把$i$排在前面（从左往右排）；反之，我们则应当把$i$排在后面（从右往左排）。

显然，这样得到的结果一定是最优的。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <queue>
#include <vector>

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
  int n;
  vector<ll> a;
  vector<int> b, in, left, right;

public:
  void solve() {
    read(n);
    a = vector<ll>(n + 1);
    b = vector<int>(n + 1);
    in = vector<int>(n + 1);
    for (int i = 1; i <= n; ++i)
      read(a[i]);
    for (int i = 1; i <= n; ++i) {
      read(b[i]);
      if (b[i] != -1)
        in[b[i]]++;
    }
    queue<int> q;
    ll result = 0;
    for (int i = 1; i <= n; ++i) {
      if (in[i] == 0)
        q.push(i);
    }
    while (!q.empty()) {
      int u = q.front();
      q.pop();
      if (a[u] < 0)
        right.emplace_back(u);
      else {
        left.emplace_back(u);
        if (b[u] != -1)
          a[b[u]] += a[u];
      }
      result += a[u];
      if (b[u] != -1) {
        in[b[u]]--;
        if (in[b[u]] == 0)
          q.push(b[u]);
      }
    }
    printf("%lld\n", result);
    reverse(right.begin(), right.end());
    for (int i : left)
      printf("%d ", i);
    for (int i : right)
      printf("%d ", i);
    printf("\n");
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

## Problem E - Uncle Bogdan and Projections

### 题目描述

X轴上方有$n$条互不相交且平行于X轴的线段。现在要求将这些线段互不相交地沿同一方向投影到$X$轴上，问最后得到的投影在X轴上的左端点和右端点间的距离最短为多少。

### 题解

实际上就是要找到最优的倾角。

显然，对于任意两条线段，可以计算出不可行的倾角区间$(\theta_l,\theta_r)$。将这些区间进行合并，可以得到总的不可行区间。

接下来，我们要选择的倾角一定是某个区间的端点（有一种特殊情况是所有线段的$y$都相同，此时可以选择任意倾角）；如果不选择端点，那么在其相邻的端点中，一定有一个比它更优。（证明……略。）

所以，就枚举合并后剩下区间的端点，对每一个倾角的取值，枚举所有线段，计算得到最后的左端点和右端点。

为了避免误差，所有的倾角都用分数表示。

这实际上还是$O(n^3)$的暴力，不过用C++ 64可以在时限内通过。

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

struct Line {
  int l, r, y;
};

int gcd(int x, int y) { return y == 0 ? x : gcd(y, x % y); }

struct Fraction {
  int a, b;
  Fraction(int a, int b) {
    if (b < 0) {
      a = -a;
      b = -b;
    }
    int g = gcd(abs(a), abs(b));
    this->a = a / g;
    this->b = b / g;
  };
  bool operator<(const Fraction &other) const {
    return (ll)a * other.b < (ll)b * other.a;
  }
  bool operator<=(const Fraction &other) const {
    return (ll)a * other.b <= (ll)b * other.a;
  }
  bool operator>(const Fraction &other) const {
    return (ll)a * other.b > (ll)b * other.a;
  }
  bool operator>=(const Fraction &other) const {
    return (ll)a * other.b >= (ll)b * other.a;
  }
  bool operator!=(const Fraction &other) const {
    return (ll)a * other.b != (ll)b * other.a;
  }
  bool operator==(const Fraction &other) const {
    return (ll)a * other.b == (ll)b * other.a;
  }
};

class Solution {
  vector<pair<Fraction, Fraction>> seg;

  Fraction theta(int x1, int x2, int dy) { return Fraction(x1 - x2, dy); }

  void calc(Line a, Line b) {
    if (a.y == b.y)
      return;
    if (a.y < b.y)
      swap(a, b);
    Fraction t1 = theta(a.l, b.r, a.y - b.y);
    Fraction t2 = theta(a.r, b.l, a.y - b.y);
    if (t1 > t2)
      swap(t1, t2);
    seg.emplace_back(t1, t2);
  }

public:
  void solve() {
    int n;
    read(n);
    vector<Line> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i].l), read(a[i].r), read(a[i].y);
    for (int i = 0; i < n; ++i)
      for (int j = i + 1; j < n; ++j)
        calc(a[i], a[j]);
    double ans = 1e18;
    sort(seg.begin(), seg.end());
    vector<pair<Fraction, Fraction>> t;
    const Fraction magic(1, MOD);
    Fraction l0 = magic, r0 = magic;
    for (auto &[l, r] : seg) {
      if (l >= r0) {
        if (r0 != magic)
          t.emplace_back(l0, r0);
        l0 = l;
        r0 = r;
      } else {
        if (l0 == magic) {
          l0 = l;
          r0 = r;
        } else
          r0 = max(r0, r);
      }
    }
    if (l0 != magic)
      t.emplace_back(l0, r0);
    vector<Fraction> vt;
    for (auto &[l, r] : t)
      vt.emplace_back(l), vt.emplace_back(r);
    if (vt.empty())
      vt.emplace_back(0, 1);
    for (Fraction d : vt) {
      double l = 1e18, r = -1e18;
      for (auto &e : a) {
        l = min(l, (double)-d.a / d.b * e.y + e.l);
        r = max(r, (double)-d.a / d.b * e.y + e.r);
      }
      ans = min(ans, r - l);
    }
    printf("%.9f", ans);
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

官方题解$O(n^2\log n)$的凸包方法还没学会。
