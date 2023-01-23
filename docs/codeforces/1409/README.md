# Codeforces Round 667 (CF1409)

## Problem A - [Yet Another Two Integers Problem](https://codeforces.com/contest/1409/problem/A)

### 题目描述

初始有两个数$a$和$b$，每次可以选择其中一个，加上或减去$[1,10]$中的任意一个数，问至少多少次操作后能让$a=b$。

### 题解

签到题。显然差距大于等于$10$的时候应该尽量用$10$，所以$ans=\left\lceil\frac{|a-b|}{10}\right\rceil$。

时间复杂度$O(1)$。

:::details 参考代码（Python 3）

```python
def read_int():
    return int(input())


def read_ints():
    return map(int, input().split(' '))


t = read_int()
for case_num in range(t):
    a, b = read_ints()
    delta = abs(a - b)
    print(delta // 10 + (1 if delta % 10 != 0 else 0))
```

:::

## Problem B - [Minimum Product](https://codeforces.com/contest/1409/problem/B)

### 题目描述

给定$a\geq x$以及$b\geq y$，每次可以将$a$或$b$减去$1$，但需要保持$a\geq x$和$b\geq y$始终成立。最多操作$n$次后，所能得到的最小的$a\cdot b$是多少？

### 题解

在$a<b$时，我们一定有$(a-1)b<a(b-1)$，所以我们应当尽可能减小一个数，如果还有操作机会，再去减小另一个数。分别考虑一下先减小$a$和先减小$b$的情况即可。

时间复杂度$O(1)$。

:::details 参考代码（Python 3）

```python
import sys


def read_int():
    return int(sys.stdin.readline())


def read_ints():
    return map(int, sys.stdin.readline().split(' '))


t = read_int()
for case_num in range(t):
    a, b, x, y, n = read_ints()
    n1 = min(n, a - x)
    ans = (a - n1) * (b - min(n - n1, b - y))
    n2 = min(n, b - y)
    ans = min(ans, (b - n2) * (a - min(n - n2, a - x)))
    print(ans)
```

:::

## Problem C - [Yet Another Array Restoration](https://codeforces.com/contest/1409/problem/C)

### 题目描述

给定正整数$x<y$，要求构造一个同时包含$x,y$，总共$n$项且均为正整数的等差数列，并且这个等差数列的最大值最小。

### 题解

假设这个等差数列的公差$d>0$，显然有$y-x=kd$，其中$1\leq k\leq n-1$，因此$y-x\equiv0\mod k$。

不妨从大到小枚举$k$（这样等于是从小到大枚举$d$）。当我们找到第一个能够整除$y-x$的$k$时，就得到了满足条件的最小的$d$。可以证明，此时的等差数列最大值就是我们要求的最小结果。

假设$d=d_0$时小于$x$的最多安排$m$项，则$d>d_0$时小于$x$的至多安排$m$项（如果$d>d_0$能安排$m+1$项，$d=d_0$至少也能安排$m+1$项）。$d=d_0$时大于$x$的一共$n-m-1$项，因此最大值为$x+(n-m-1)d_0$。而在$d>d_0$时，大于$x$的至少$n-m-1$项，从而最大值大于等于$x+(n-m-1)d>x+(n-m-1)d_0$。

时间复杂度$O(n)$。

:::details 参考代码（Python 3）

```python
def read_int():
    return int(input())


def read_ints():
    return map(int, input().split(' '))


t = read_int()
for case_num in range(t):
    n, x, y = read_ints()
    d = y - x
    for i in range(n - 1, 0, -1):
        if d % i == 0:
            d //= i
            l = min(n - (i + 1), (x - 1) // d)
            ans = [x - l * d + i * d for i in range(n)]
            print(' '.join(map(str, ans)))
            break
```

:::

## Problem D - [Decrease the Sum of Digits](https://codeforces.com/contest/1409/problem/D)

### 题目描述

给定一个数$n$，每次操作可以使$n$加$1$，问至少多少次操作后，可以使$n$的各位数字之和不超过$s$。

### 题解

显然要使数位和减小，必须将数字变成$0$。因为要求最少操作次数，所以我们从最后一位开始，逐步尝试修改。每次修改后需要将前一位加$1$，如果有进位，还需要处理进位问题。在整个过程中，我们不断更新当前的数位和。当数位和第一次满足要求时，我们就找到了答案。

时间复杂度$O(\log_{10}n)$。

:::details 参考代码（Python 3）

```python
import sys


def read_int():
    return int(sys.stdin.readline())


def read_ints():
    return map(int, sys.stdin.readline().split(' '))


t = read_int()
for case_num in range(t):
    n, s = read_ints()
    a = [0] + [int(i) for i in str(n)]
    ds = sum(a)
    cost = 0
    idx = len(a) - 1
    radix = 1
    while ds > s:
        if a[idx] > 0:
            cost += (10 - a[idx]) * radix
            ds -= a[idx]
            a[idx] = 0
            ds += 1
            a[idx - 1] += 1
            i = idx - 1
            while a[i] >= 10:
                a[i - 1] += 1
                a[i] -= 10
                ds -= 9
                i -= 1
        radix *= 10
        idx -= 1
    print(cost)
```

:::

## Problem E - [Two Platforms](https://codeforces.com/contest/1409/problem/E)

### 题目描述

二维空间中有$n$个点，每个点的坐标为$(x_i,y_i)$。现在你可以设置两个平台，每个平台的宽度为$k$，要求平台平行于$x$轴设置。问至多能接到多少个小球。

### 题解

首先，平台可以放在$y=-\infty$处，所以点的$y$值并不需要考虑。

两个平台显然不应该有重叠部分，因为我们总可以固定其中一个，然后将另一个向旁边移动使得它们不重叠，并且总共接到的小球数只会增加而不会减少。

另一方面，我们总可以将平台的起点设置在某一个小球对应的$x$处。因为如果平台的起点$x_s$没有小球，我们总可以将平台向右移动，直到遇到一个小球，而总共接到的小球数只会增加而不会减少。

所以，我们可以对$x$进行排序，然后用双指针求出从第$i$位开始放一个平台所能够得到的最大小球数$L[i]$。得到$L[i]$后，我们再得到后缀最大值$R[i]$，也即从$i$位及之后位置开始放一个平台所能够得到的最大小球数。

最后，我们的答案就是$\max(L[i]+R[i+L[i]])$。

时间复杂度$O(n\log n)$，瓶颈是排序。

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
    int n, k;
    read(n), read(k);
    vector<int> x(n), y(n);
    for (int i = 0; i < n; ++i)
      read(x[i]);
    for (int i = 0; i < n; ++i)
      read(y[i]);
    sort(x.begin(), x.end());
    vector<int> L(n + 1), R(n + 1);
    int r = 0;
    for (int l = 0; l < n; ++l) {
      while (r + 1 < n && x[r + 1] <= x[l] + k)
        r++;
      R[l] = L[l] = r - l + 1;
    }
    for (int i = n - 1; i >= 0; --i)
      R[i] = max(R[i], R[i + 1]);
    int ans = 0;
    for (int i = 0; i < n; ++i)
      ans = max(ans, L[i] + R[i + L[i]]);
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

## Problem F - [Subsequences of Length Two](https://codeforces.com/contest/1409/problem/F)

### 题目描述

给定字符串$s$和一个长度为$2$的字符串$t$，至多对$s$进行$K$次修改，每次修改可以将任意位置的字母替换为任意其他字母。问修改后的字符串，最多包含多少个与$t$相同的子序列？

### 题解

首先，如果$t$的两个字母相同（假设都为$a$），我们可以单独处理，直接将$s$中所有非$a$字母都尽可能改为$a$即可，假设最后可以得到$m$个$a$，那么最后的答案就是$\frac{m(m-1)}{2}$。

如果$t$的两个字母不同（设为$a$和$b$），我们可以进行动态规划。令$dp[i][j][k]$表示前$i$位有$j$个$a$，用了$k$次修改可以得到的最大子序列数目。对于下一位，我们可以讨论是否将其修改为$b$和是否将其修改为$a$，从而对状态进行转移。因为$dp[i+1]$只与$dp[i]$有关，所以可以用滚动数组优化空间。

时间复杂度$O(|s|^2k)$。

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
    int n, k;
    read(n), read(k);
    string s, t;
    cin >> s >> t;
    if (t[0] == t[1]) {
      int cnt = 0;
      for (char c : s)
        cnt += c == t[0];
      int hi = min(n, cnt + k);
      printf("%d", hi * (hi - 1) / 2);
    } else {
      char a = t[0], b = t[1];
      vector<vector<int>> g(n + 1, vector<int>(k + 1, -1));
      g[0][0] = 0;
      for (int i = 0; i < n; ++i) {
        vector<vector<int>> ng(g);
        for (int j = 0; j <= i; ++j)
          for (int p = 0; p <= k; ++p) {
            if (g[j][p] == -1)
              continue;

            // Set to b
            if (s[i] == b)
              ng[j][p] = max(ng[j][p], g[j][p] + j);
            else if (p < k)
              ng[j][p + 1] = max(ng[j][p + 1], g[j][p] + j);

            // Set to a
            if (s[i] == a)
              ng[j + 1][p] = max(ng[j + 1][p], g[j][p]);
            else if (p < k)
              ng[j + 1][p + 1] = max(ng[j + 1][p + 1], g[j][p]);
          }
        g = move(ng);
      }
      int ans = 0;
      for (int i = 1; i <= n; ++i)
        for (int j = 0; j <= k; ++j)
          ans = max(ans, g[i][j]);
      printf("%d", ans);
    }
  }
};

int main() {
  Solution solution = Solution();
  solution.solve();
}
```

:::
