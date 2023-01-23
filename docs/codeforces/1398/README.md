# Educational Codeforces Round 93 (CF1398)

## Problem A - Bad Triangle

### 题目描述

给定一个升序数组$a$，找出任意一个三元组$(i,j,k)$（$i<j<k$）使得$a_i,a_j,a_k$不能构成三角形。

### 题解

贪心选取最小的两个数和最大的数，如果它们可以构成三角形，那么本题无解；否则它们就是一组合法的解。

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
public:
  void solve() {
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    if (a[0] + a[1] <= a[n - 1])
      printf("1 2 %d\n", n);
    else
      printf("-1\n");
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

## Problem B - Substring Removal Game

### 题目描述

给定一个01字符串，A、B两人玩游戏，每次每人可以取走任意一段连续相同的字符，A先动，问最多可以取到多少个1。

### 题解

显然每次选取都会选择当前最长的1串。所以只要找出所有的1串，按长度降序排列，然后累加奇数项即为答案。

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
    string s;
    cin >> s;
    s += "0";
    vector<int> v;
    int d = '$', cnt = 0;
    for (char c : s) {
      if (c == d)
        cnt++;
      else {
        if (d == '1')
          v.emplace_back(cnt);
        d = c;
        cnt = 1;
      }
    }
    sort(v.rbegin(), v.rend());
    int ans = 0;
    for (int i = 0; i < v.size(); i += 2)
      ans += v[i];
    printf("%d\n", ans);
  }
};

int main() {
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

## Problem C - Good Subarrays

### 题目描述

给定数组$a$（以一个大整数的形式给出），问$a$有多少个子数组满足元素之和等于子数组长度。

### 题解

如果将所有元素都减去1，那么要求的子数组就变成了和为0的子数组，进而可以用前缀哈希的方法来解决。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <map>
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
public:
  void solve() {
    int n;
    read(n);
    string s;
    cin >> s;
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      a[i] = s[i] - '0' - 1;
    map<int, int> cnt;
    cnt[0] = 1;
    int sum = 0;
    ll ans = 0;
    for (int i = 0; i < n; ++i) {
      sum += a[i];
      ans += cnt[sum];
      cnt[sum]++;
    }
    printf("%lld\n", ans);
  }
};

int main() {
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

## Problem D - Colored Rectangles

### 题目描述

给定红绿蓝三种木条，分别有$R$对，$G$对，$B$对，要求每次取出两对不同颜色的木条组成矩形，求能够组成的矩形的最大总面积。

### 题解

显然每种颜色的木条应该先用长的再用短的，但是具体用哪两种颜色并不容易确定。考虑到数据范围（$R,G,B\leq200$），使用动态规划来求解。$dp[i][j][k]$表示用了$i$对红色，$j$对绿色，$k$对蓝色时的最大面积，转移很简单，分别枚举三种取法即可。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
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

ll dp[202][202][202];

class Solution {
public:
  void solve() {
    int R, G, B;
    read(R), read(G), read(B);
    vector<int> r(R), g(G), b(B);
    for (int i = 0; i < R; ++i)
      read(r[i]);
    for (int i = 0; i < G; ++i)
      read(g[i]);
    for (int i = 0; i < B; ++i)
      read(b[i]);
    sort(r.rbegin(), r.rend());
    sort(g.rbegin(), g.rend());
    sort(b.rbegin(), b.rend());
    memset(dp, 0, sizeof(dp));
    for (int i = 0; i <= R; ++i)
      for (int j = 0; j <= G; ++j)
        for (int k = 0; k <= B; ++k) {
          if (i < R && j < G)
            dp[i + 1][j + 1][k] =
                max(dp[i + 1][j + 1][k], dp[i][j][k] + r[i] * g[j]);
          if (i < R && k < B)
            dp[i + 1][j][k + 1] =
                max(dp[i + 1][j][k + 1], dp[i][j][k] + r[i] * b[k]);
          if (j < G && k < B)
            dp[i][j + 1][k + 1] =
                max(dp[i][j + 1][k + 1], dp[i][j][k] + g[j] * b[k]);
        }
    ll ans = 0;
    for (int i = 0; i <= R; ++i)
      for (int j = 0; j <= G; ++j)
        for (int k = 0; k <= B; ++k)
          ans = max(ans, dp[i][j][k]);
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

## Problem E - Two Types of Spells

### 题目描述

有火焰和闪电两种咒语，它们都有能量值，同时闪电咒语还有一个额外效果，可以让下一个咒语的能量值翻倍。现在有$N$次询问，每次会增加或删除一个咒语（保证任意时刻不会有相同能量值的咒语），在每次询问后，给出当前所有咒语排列可以得到的最大能量值。

### 题解

可以发现，如果当前有$K$个闪电咒语，那么就可以有$K$个咒语的能量值翻倍（除非一共只有$K$个咒语），但有一条限制，就是这$K$个咒语不能都为闪电咒语（第一个闪电咒语无法翻倍）。不妨维护三个堆，第一个堆记录当前翻倍的咒语，第二个堆记录当前不翻倍的咒语，第三个堆记录当前不翻倍的火焰咒语。在每一次询问后的更新过程中，我们始终保持最大的$K$个咒语被翻倍，以此为前提对三个堆进行更新；但在回答询问之前，需要检查当前第一个堆中的咒语是否都是闪电咒语。如果都是闪电咒语，则利用第三个堆对结果进行更新。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <set>

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
public:
  void solve() {
    int n;
    read(n);
    set<int> fire, lightning, topk, rest, rf;
    int l = 0, tl = 0;
    ll ans = 0;
    auto move_from_rest_to_topk = [&](int k) {
      rest.erase(k);
      topk.insert(k);
      if (fire.count(k))
        rf.erase(k);
      else
        tl++;
      ans += k;
    };
    auto move_from_topk_to_rest = [&](int k) {
      topk.erase(k);
      rest.insert(k);
      if (fire.count(k))
        rf.insert(k);
      else
        tl--;
      ans -= k;
    };
    for (int i = 0; i < n; ++i) {
      int tp, p;
      read(tp), read(p);
      if (tp == 0) {
        if (p > 0) {
          fire.insert(p);
          if (l > 0 && p > *topk.begin()) {
            int rep = *topk.begin();
            move_from_topk_to_rest(rep);
            topk.insert(p);
            ans += 2 * p;
          } else {
            rest.insert(p);
            rf.insert(p);
            ans += p;
          }
        } else {
          p = -p;
          fire.erase(p);
          if (rest.count(p)) {
            ans -= p;
            rest.erase(p);
            rf.erase(p);
          } else {
            topk.erase(p);
            int rep = *rest.rbegin();
            move_from_rest_to_topk(rep);
            ans -= 2 * p;
          }
        }
      } else {
        if (p > 0) {
          lightning.insert(p);
          l++;
          rest.insert(p);
          ans += p;
          int rep = *rest.rbegin();
          move_from_rest_to_topk(rep);
        } else {
          p = -p;
          lightning.erase(p);
          l--;
          if (rest.count(p)) {
            rest.erase(p);
            ans -= p;
            int rep = *topk.begin();
            move_from_topk_to_rest(rep);
          } else {
            topk.erase(p);
            ans -= p * 2;
            tl--;
          }
        }
      }
      ll cans = ans;
      if (tl == l && tl > 0) {
        int rep = *topk.begin();
        cans -= rep;
        int other = 0;
        if (!rf.empty())
          other = *rf.rbegin();
        cans += other;
      }
      printf("%lld\n", cans);
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

## Problem F - Controversial Rounds

### 题目描述

有一个长度为$n$的含有`'?'`的01字符串（`'?'`表示可以为0，也可以为1）。问通过对`'?'`的不同设置，最多能有多少个互不重叠的长度为$i$的连续子串？$i$从$1$取到$n$。

### 题解

对于长度$i$，如果我们可以在前$m$个字符中构成一个串，那么一定优于在前$m+1$个字符中构成一个串，也即应该尽可能往前安排。

因此，我们可以构建两个串$s$和$t$。$s$通过把原字符串中所有的`'?'`替换为`'0'`得到，$t$通过把所有的`'?'`替换为`'1'`得到。得到这两个串后，如果我们希望构建一个`'0'`的连续子串，我们就从$s$中选取；否则就从$t$中选取。

在$O(n)$时间内，我们可以预处理得到从每个位置开始的最长连续子串长度$p$和$q$。同时，我们可以预处理得到$s$串每个位置的下一个`'0'`串的起点$np$，以及$t$串每个位置的下一个`'1'`串的起点$nq$。

我们从长度为$1$的子串开始。对于每一个长度，我们首先从下标$1$开始，如果当前$p[idx]$和$q[idx]$中有一个满足要求，我们则尽可能地构建子串；如果两个都不满足要求，我们就移动到$np[idx]$和$nq[idx]$中的较小值，同时，如果当前位置等于上一个位置$last$的后指针$np[last]$或$nq[last]$，我们则相应地对$np[last]$或$nq[last]$进行更新（因为如果对于当前长度不行，那么对于下一个长度肯定也不行，所以下一次就可以直接跳过这一下标），这有些类似于并查集中的路径压缩。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <vector>
#define INF 0x3f3f3f3f

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
    string s;
    cin >> s;
    string t(s);
    for (int i = 0; i < n; ++i)
      if (s[i] == '?')
        s[i] = '0', t[i] = '1';
    vector<int> p(n + 2), q(n + 2);
    for (int i = n; i >= 1; --i)
      p[i] = s[i - 1] == '0' ? p[i + 1] + 1 : 0,
      q[i] = t[i - 1] == '1' ? q[i + 1] + 1 : 0;
    vector<int> np(n + 1), nq(n + 1);
    for (int i = n, pp = INF, qq = INF, npp = INF, nqq = INF; i >= 1; --i) {
      if (s[i - 1] == '0')
        pp = i;
      if (s[i - 1] == '1')
        npp = pp;
      np[i] = npp;

      if (t[i - 1] == '0')
        nqq = qq;
      if (t[i - 1] == '1')
        qq = i;
      nq[i] = nqq;
    }
    printf("%d ", n);
    for (int i = 2; i <= n; ++i) {
      int cnt = 0, idx = 1, last = 0;
      while (idx + i - 1 <= n) {
        int delta = max(p[idx], q[idx]);
        if (p[idx] <= i && np[last] == idx)
          np[last] = np[idx];
        if (q[idx] <= i && nq[last] == idx)
          nq[last] = nq[idx];
        last = idx;
        if (delta >= i)
          cnt += delta / i, idx += delta / i * i;
        else
          idx = min(np[idx], nq[idx]);
      }
      printf("%d ", cnt);
    }
  }
};

int main() {
  Solution solution = Solution();
  solution.solve();
}
```

:::

## Problem G - Running Competition

### 题目描述

有一个长为$x$，宽为$y$的矩形跑道，中间还有$n-1$条垂直的跑道。$n+1$条垂直跑道的位置为$x_0,\cdots,x_n$。

现在需要进行若干场比赛，每场比赛的总长度为$L_i$，要求选取两条垂直跑道，使得这两条跑道所围成的矩形的周长为$L_i$的因子，且尽可能大，输出这个长度。如果无解，输出$-1$。

### 题解

显然可以枚举出所有能够组成的跑道长度；对于之后的每一个询问，直接以$\sqrt{L_i}$的复杂度枚举因子即可。

如何枚举出跑道长度呢？暴力枚举的$O(n^2)$复杂度是不可接受的。

实际上我们需要枚举的是$x_j-x_i$，容易想到，我们可以构建两个多项式

$$f(x)=\sum_{i=0}^nx^{x_i}$$
$$g(x)=\sum_{i=0}^nx^{-x_i}$$

将这两个多项式相乘，得到的$f(x)g(x)$中系数大于0且阶数大于0的项，就是我们可以得到的跑道的长度，进而就可以得到所有可能的周长。

用FFT来计算即可。

:::details 参考代码（C++）

```cpp
#include <cmath>
#include <complex>
#include <cstdio>
#include <iostream>
#include <vector>
#ifndef M_PI
#define M_PI 3.14159265358979323846264338327950288
#endif

using namespace std;
typedef complex<double> cd;
const cd I{0, 1};

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

void change(vector<cd> &f, int n) {
  for (int i = 1, j = n / 2; i < n - 1; i++) {
    if (i < j)
      swap(f[i], f[j]);
    int k = n / 2;
    while (j >= k) {
      j = j - k;
      k = k / 2;
    }
    if (j < k)
      j += k;
  }
}

void fft(vector<cd> &f, int n, int rev) {
  change(f, n);
  for (int len = 2; len <= n; len <<= 1) {
    cd omega = exp(I * (2 * M_PI / len * rev));
    for (int j = 0; j < n; j += len) {
      cd now = 1;
      for (int k = j; k < j + len / 2; ++k) {
        cd g = f[k], h = now * f[k + len / 2];
        f[k] = g + h, f[k + len / 2] = g - h;
        now *= omega;
      }
    }
  }
  if (rev == -1)
    for (int i = 0; i < n; ++i)
      f[i] /= n;
}

class Solution {
public:
  void solve() {
    int n, x, y;
    read(n), read(x), read(y);
    vector<int> a(n + 1);
    for (int i = 0; i <= n; ++i)
      read(a[i]);
    int q;
    read(q);
    vector<bool> vis(x + y + 1);
    int k = 1 << (32 - __builtin_clz(x * 8 + 2));
    vector<cd> A(k), B(k);
    for (int i = 0; i <= n; ++i)
      A[a[i] + x] = cd{1, 0}, B[x - a[i]] = cd{1, 0};
    fft(A, k, 1);
    fft(B, k, 1);
    for (int i = 0; i < k; ++i)
      A[i] *= B[i];
    fft(A, k, -1);
    for (int i = 2 * x + 1; i < 4 * x; ++i)
      if ((int)round(A[i].real()) > 0)
        vis[i - 2 * x + y] = true;
    int hi = x + y;
    for (int i = 0; i < q; ++i) {
      int l;
      read(l);
      l >>= 1;
      int ans = -1;
      for (int j = 1; j * j <= l; ++j) {
        if (l % j == 0) {
          if (j <= hi && vis[j])
            ans = j;
          if (l / j <= hi && vis[l / j]) {
            ans = l / j;
            break;
          }
        }
      }
      printf("%d ", ans == -1 ? ans : ans * 2);
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
