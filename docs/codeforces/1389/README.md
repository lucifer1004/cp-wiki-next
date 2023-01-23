# Educational Codeforces Round 92 (CF1389)

## Problem A - [LCM Problem](https://codeforces.com/contest/1389/problem/A)

### 题目描述

给定范围$[L,R]$（$L<R$），找出两个数$x$和$y$（$L\leq x<y\leq R$），使得$L\leq LCM(x,y)\leq R$。

### 题解

首先，我们有$\forall x<y, LCM(x,y)\geq2x$。证明很简单，设$GCD(x,y)=g$，$x=ag$，$y=bg$，显然有$b\geq2$，则$LCM(x,y)=abg\geq2ag=2x$。

那么就可以贪心地给出答案了，如果$R\geq2L$，我们可以使用$(L,2L)$这组答案；否则无解。

时间复杂度$O(1)$。

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
    int l, r;
    read(l), read(r);
    if (r >= l * 2)
      printf("%d %d\n", l, l * 2);
    else
      printf("-1 -1\n");
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

## Problem B - [Array Walk](https://codeforces.com/contest/1389/problem/B)

### 题目描述

有$1$到$N$共$N$个位置，从$1$开始，初始分数为$a_1$，每次可以向左或向右移动，并得到所在位置的分数，但不能连续两次向左移动。总共移动$k$（$1\leq k\leq N-1$）次，其中至多左移$z$（$0\leq z\leq\min(5,k)$）次。求能够取得的最高分数。

### 题解

我们总可以把最后的总得分分为两部分，一部分是$1,\cdots,E$的总分（其中$E$）是最远走到的位置，剩下的则是$\sum_ia_{l_i}+a_{l_i-1}$，其中$l_i$为第$i$次向左走时所在的位置。假设向左走$x$次，则我们向右的最远距离$E=k+1-2x$。另一方面，我们应当在$a_i+a_{i-1}$最大的位置来回左右走，这样一定优于在别的位置用掉向左的机会。所以我们可以预计算出$a_i+a_{i-1}$的前缀最大值$L_i$，最后的最高分数就是

$$
\max_{x=0}^z(L_{k+1-2x}\cdot x+S_{k+1-2x})
$$

其中$S_i$为前缀和。

时间复杂度$O(n)$。

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
    int n, k, z;
    read(n), read(k), read(z);
    vector<int> a(n), s(n + 1), l(n);
    for (int i = 0; i < n; ++i) {
      read(a[i]), s[i + 1] = s[i] + a[i];
      if (i >= 1)
        l[i] = max(l[i - 1], a[i] + a[i - 1]);
    }
    int ans = s[k + 1];
    for (int j = 1; j <= z && 2 * j <= k; ++j)
      ans = max(ans, l[k + 1 - j * 2] * j + s[k + 1 - j * 2]);
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

## Problem C - [Good String](https://codeforces.com/contest/1389/problem/C)

### 题目描述

左循环一位和右循环一位得到的字符串相同的字符串称为“好字符串”。问给定字符串至少删去几个字母可以变为“好字符串”？

### 题解

“好字符串”等价于$\forall i, s_i=s_{i+2}$。所以我们可以枚举最后的循环节，然后看原始字符串中最多包含多少个这一循环节。

时间复杂度$O(|s|c^2)$，其中$c$为字母表中的字母数（本题为$10$）。

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
    int n = s.size();
    vector<int> cnt(10);
    for (char c : s)
      cnt[c - '0']++;
    int ans = n - *max_element(cnt.begin(), cnt.end());
    for (int i = 0; i < 10; ++i)
      for (int j = 0; j < 10; ++j) {
        vector<char> t{(char)(i + '0'), (char)(j + '0')};
        int tot = 0, idx = 0;
        for (char c : s) {
          if (c == t[idx]) {
            idx++;
            if (idx == 2)
              tot++, idx = 0;
          }
        }
        ans = min(ans, n - tot * 2);
      }
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

## Problem D - [Segment Intersections](https://codeforces.com/contest/1389/problem/D)

### 题目描述

最开始有$[al_1,ar_1]=[al_2,ar_2]=\dots=[al_n,ar_n]=[l_1,r_1]$和$n$个$[bl_1,br_1]=[bl_2,br_2]=\dots=[bl_n,br_n]=[l_2,r_2]$。每次可以选择任一区间$[x,y]$，将其变为$[x-1,y]$或$[x,y+1]$。定义区间总重叠长度

$$
I=\sum_{i=1}^n intersection([al_i,ar_i],[bl_i,br_i])
$$

问最少操作多少次，可以使得$I\geq k$？

### 题解

不妨假设$l_1<=l_2$（否则交换即可）。

第一种情况是$r_1<l_2$，也即两段初始不相交。这就意味着对于每一对区间，最开始有$l_2-r_1$次操作是不提升总和的。之后有$r_2-l_1$次操作可以以$1$的代价提升总和，再之后需要以$2$的代价提升总和。令$p=r_2-l_1$。如果$np<k$，那么我们即使把每一对区间都变成$[l_1,r_2]$也不够，总需要使用到代价为$2$的操作。否则，假设$m=\left\lceil\frac{k}{p}\right\rceil$,我们需要比较对$m$对区间进行操作（激活，再进行代价为$1$的操作），以及对$m-1$对区间进行操作（激活，进行代价为$1$的操作，剩余次数用代价为$2$的操作完成）。为什么不需要考虑$m-2$以及更小的值呢？因为激活的花费$l_2-r_1$总小于代价为$1$的操作比起代价为$2$的操作所能够节省的$r_2-l_1$。

第二种情况是$r_1\geq l_2$，也即两段初始相交，这样就没有激活的代价，之后有$l_2-l_1+|r_2-r_1|$次代价为$1$的操作，再之后是代价为$2$的操作。注意有两种特殊情况需要单独考虑：

- $I_0\geq k$，也即一开始已经满足条件。
- $l_1=r_1,l_2=r_2$，此时$l_2-l_1+|r_2-r_1|=0$，只能进行代价为$2$的操作。

对于一般情况，因为没有激活成本，所以一定先用代价为$1$的操作，如果还不够，再用代价为$2$的操作。

时间复杂度$O(1)$。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>

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
    int n, k;
    read(n), read(k);
    int l1, r1, l2, r2;
    read(l1), read(r1), read(l2), read(r2);
    if (l1 > l2) {
      swap(l1, l2);
      swap(r1, r2);
    }
    ll ans;
    if (r1 < l2) {
      int start = l2 - r1, supply = r2 - l1;
      int need = (k - 1) / supply + 1;
      if (need > n) {
        ans = (ll)n * (start + supply) + 2 * (k - n * supply);
      } else {
        ans = (ll)need * start + k;
        if (need > 1)
          ans = min(ans, (ll)(need - 1) * (start + supply) +
                             (k - (need - 1) * supply) * 2);
      }
    } else {
      ll current = (ll)n * (min(r1, r2) - l2);
      if (current >= k) {
        ans = 0;
      } else {
        k -= current;
        int supply = l2 - l1 + abs(r2 - r1);
        if (supply == 0) {
          ans = 2 * k;
        } else {
          int need = (k - 1) / supply + 1;
          if (need <= n)
            ans = k;
          else
            ans = (ll)n * supply + 2 * (k - n * supply);
        }
      }
    }
    printf("%lld\n", ans);
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

## Problem E - [Calendar Ambiguity](https://codeforces.com/contest/1389/problem/E)

### 题目描述

某个国家，一年有$m$个月，每个月有$d$天，每个星期有$w$天（$1\leq m,d,w\leq10^9$）。每年的第一天也一定是星期一（最后一个星期可能是不完整的）。一个数对$(x,y)$（$x<y$）被称为“混淆对”，当且仅当$x$月$y$天和$y$月$x$天是一个星期中的同一天。问一共有多少“混淆对”。

### 题解

不妨翻译一下，$x$月$y$天和$y$月$x$天是一个星期中的同一天，其实就是说$(x-1)d+y-((y-1)d+x)=(y-x)(1-d)\equiv0\mod w$。

令$GCD(w,d-1)=g$，则$y-x\equiv0\mod\frac{w}{g}$。因为$x<y\leq\min(m,d)$，所以在$y=y_i$时，$x$有$\left\lfloor\frac{y_i-1}{w/g}\right\rfloor$种取法。不妨假设$\frac{w}{g}=3$，我们尝试写出$\left\lfloor\frac{y_i-1}{w/g}\right\rfloor$随$y_i$的变化。

$$
y_i=1,2,3,4,5,6,7,8,9,10,\cdots
$$

$$
\left\lfloor\frac{y_i-1}{w/g}\right\rfloor=0,0,0,1,1,1,2,2,2,3,\cdots
$$

显然可以分组聚合后再进行等差数列求和。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>

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

int gcd(int x, int y) { return y == 0 ? x : gcd(y, x % y); }

class Solution {
public:
  void solve() {
    int m, d, w;
    read(m), read(d), read(w);
    if (m == 1 || d == 1) {
      printf("0\n");
      return;
    }
    int g = gcd(d - 1, w);
    int k = w / g;
    int t = min(m, d);
    int t0 = t / k * k, t1 = t % k;
    ll ans = (ll)t0 * (t0 / k - 1) / 2 + t1 * (t0 / k);
    printf("%lld\n", ans);
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

## Problem F - [Bicolored Segments](https://codeforces.com/contest/1389/problem/F)

待补做。

## Problem G - [Directing Edges](https://codeforces.com/contest/1389/problem/G)

待补做。