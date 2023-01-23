# AtCoder Beginner Contest 175

## Problem A - [Rainy Season](https://atcoder.jp/contests/abc175/tasks/abc175_a)

过水，略。

## Problem B - [Making Triangle](https://atcoder.jp/contests/abc175/tasks/abc175_b)

### 题目描述

给定$N$根长度分别为$L_i$的棍子，问能组成多少个三边长度各不相同的三角形？如果两个三角形至少用了一根不同编号的棍子，则称它们是不同的三角形。

### 题解

本题的范围很小（$N\leq100$），所以可以在对棍子长度排序后（这样保证最后一个是最长边，只需要检查一次就能确定是否能构成三角形），直接枚举所有三元组，然后检查是否满足条件。

进一步地优化，可以在固定最长边的基础上，用双指针确定另外两条边的可选范围，时间复杂度可以降低到$O(N^2)$。

## Problem C - [Walking Takahashi](https://atcoder.jp/contests/abc175/tasks/abc175_c)

### 题目描述

有一个数$X$，对它进行$K$次$+D$或$-D$的操作，求操作后的$\min|X'|$。

### 题解

首先$X$的正负不影响结果，所以我们可以只考虑$|X|$。

如果$|X|>D$，那么我们首先应该向原点移动，直到$|X'|<D$。这时还剩下$K'$次操作，我们应当在原点的左右两侧来回移动。根据$K'$的奇偶判断一下最后在哪一个位置即可。

## Problem D - [Moving Piece](https://atcoder.jp/contests/abc175/tasks/abc175_d)

### 题目描述

有$N$（$N\leq5000$）个方格，从第$i$个方格会跳到第$P_i$个方格。$P$是$1,\cdots,N$的一个排列。

每个方格上写了一个数字$C_i$。每次跳跃时，会得到等同于$C_{P_i}$的分数。你可以从任意方格开始，跳跃至少一次，至多$K$次，求能够取得的最高分数。

### 题解

枚举起点。由于$P$是排列，所以我们从任意位置$i$开始，经过若干次跳跃后一定会回到$i$。我们可以计算出一个周期内的前缀和。然后，根据周期长度$C$与$K$之间的关系，分情况讨论。

- $K\leq C$，此时我们应该选择前$K$个前缀和中的最大值。
- $K>C$，令$K=nc+r$，则我们可以选择
    - 不循环，选择所有前缀和中的最大值。
    - 循环$n$次，再加上前$r$个前缀和中的最大值。
    - 循环$n-1$次，再加上所有前缀和中的最大值。

总时间复杂度$O(N^2)$。

:::details 参考代码（C++）

```cpp
#include <climits>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int n, k;
  cin >> n >> k;
  vector<int> p(n), c(n);
  for (int i = 0; i < n; ++i)
    cin >> p[i];
  for (int i = 0; i < n; ++i)
    cin >> c[i];
  ll ans = LLONG_MIN;
  for (int i = 0; i < n; ++i) {
    vector<bool> vis(n);
    int idx = i;
    vector<ll> sum = {0}, hi = {LLONG_MIN};
    while (!vis[p[idx] - 1]) {
      idx = p[idx] - 1;
      vis[idx] = true;
      sum.emplace_back(sum.back() + c[idx]);
      hi.emplace_back(max(hi.back(), sum.back()));
    }
    int m = sum.size() - 1;
    int f = k / m, rem = k % m;
    ll result;
    if (f > 0)
      result = max(hi[m], max(sum[m] * f + (rem == 0 ? 0 : hi[rem]),
                              sum[m] * (f - 1) + hi[m]));
    else
      result = hi[rem];
    ans = max(ans, result);
  }
  cout << ans;
}
```

:::

思考：如果$N\leq10^5$，应该如何改进算法？

:::details 提示一

在上面的算法中，对于一个循环，设其长度为$L$，我们实际上重复计算了$L$次（针对每一个起点）。有没有可能减少这样的重复计算呢？

:::

:::details 提示二

在每一个循环内，问题实际上可以转化为，给定一个由$L$个数围成的圈，从中取出长度不超过$K$的一段连续串，求能取得的最大和。

:::

:::details 提示三

前缀和+RMQ。

:::

:::details 参考代码（C++）

```cpp
#include <cmath>
#include <iostream>
#include <vector>

#define MAXN 5005
#define K 15

using namespace std;
typedef long long ll;
const ll LO = -1e16;
int n, k;

ll st[MAXN * 2][K];

ll query(int l, int r) {
  int len = r - l + 1;
  int j = log2(len);
  return min(st[l][j], st[r - (1 << j) + 1][j]);
}

ll solve(vector<int> &v) {
  int len = v.size();
  vector<ll> s = {0};
  for (int i = 0; i < 2 * len; ++i)
    s.emplace_back(s.back() + v[i % len]);
  int slen = s.size();
  for (int i = 0; i < slen; ++i)
    st[i][0] = s[i];
  for (int j = 1; j <= log2(slen); ++j)
    for (int i = 0; i < slen; ++i) {
      st[i][j] = st[i][j - 1];
      int right = i + (1 << (j - 1));
      if (right < slen)
        st[i][j] = min(st[i][j], st[right][j - 1]);
    }
  ll sum = s[len], hi_r = LO, hi_all = LO;
  int r = k % len;
  for (int i = 1; i < slen; ++i) {
    if (r)
      hi_r = max(hi_r, s[i] - query(max(0, i - r), i - 1));
    hi_all = max(hi_all, s[i] - query(max(0, i - len), i - 1));
  }
  if (k < len)
    return hi_r;
  return max(hi_all, max(sum * (k / len - 1) + hi_all, sum * (k / len) + hi_r));
}

int main() {
  cin >> n >> k;
  vector<int> p(n), c(n);
  for (int i = 0; i < n; ++i)
    cin >> p[i];
  for (int i = 0; i < n; ++i)
    cin >> c[i];
  ll ans = LO;
  vector<bool> vis(n);
  for (int i = 0; i < n; ++i) {
    if (vis[i])
      continue;
    vector<int> v;
    int idx = i;
    while (!vis[p[idx] - 1]) {
      idx = p[idx] - 1;
      vis[idx] = true;
      v.emplace_back(c[idx]);
    }
    ans = max(ans, solve(v));
  }
  cout << ans;
}
```

:::

## Problem E - [Picking Goods](https://atcoder.jp/contests/abc175/tasks/abc175_e)

### 题目描述

$R$行$C$列的方阵，其中有$K$个格子里有东西，第$i$个东西的价值为$v_i$。从左上角走到右下角，只能向下或向右走，限定每行最多拿$3$个东西，求能取得的最大价值。

### 题解

在常规的方阵DP基础上再加一维记录当前行取了几个东西即可。因为$3$是常数，所以总时间复杂度为$O(RC)$。

:::details 参考代码（C++）

```cpp
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

ll dp[3005][3005][4];

class Solution {
public:
  void solve() {
    int R, C, K;
    read(R), read(C), read(K);
    vector<vector<int>> a(R + 1, vector<int>(C + 1));
    memset(dp, 0, sizeof(0));
    for (int i = 0; i < K; ++i) {
      int r, c, v;
      read(r), read(c), read(v);
      a[r][c] = v;
    }
    for (int i = 1; i <= R; ++i)
      for (int j = 1; j <= C; ++j) {
        for (int k = 0; k <= 3; ++k)
          dp[i][j][0] = max(dp[i][j][0], dp[i - 1][j][k]);
        for (int k = 0; k <= 3; ++k)
          dp[i][j][k] = max(dp[i][j][k], dp[i][j - 1][k]);
        if (a[i][j])
          for (int k = 3; k > 0; --k)
            dp[i][j][k] = max(dp[i][j][k], dp[i][j][k - 1] + a[i][j]);
      }
    ll ans = 0;
    for (int i = 0; i <= 3; ++i)
      ans = max(ans, dp[R][C][i]);
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

## Problem F - [Making Palindrome](https://atcoder.jp/contests/abc175/tasks/abc175_f)

### 题目描述

有$N$（$N\leq50$）个长度不超过$L$（$L\leq20$）的字符串，每个字符串可以使用无限次，第$i$个字符串使用一次的代价为$C_i$。问最少花费多少代价，能够用这些字符串组成一个回文串？或者说明无解。

### 题解

直接搜索，状态似乎是无穷无尽的。如何减少状态空间，让搜索变为可能？

我们考虑从左右两边分别构建字符串。最开始，左边和右边都是空的。我们希望最后能将左边部分和右边部分进行匹配。这里，匹配的意思是，对于串$A$和$B$，两串中较短的那串是较长那串的子串。在匹配之后，如果剩下的部分是一个回文串（或为空），则我们就成功构建了一个回文串。

我们每次可以把某个字符串加入到左边或右边，这样就得到一个中间状态。在转移过程中，我们应当保证始终只有至多一边有未匹配部分，而其余部分都应该得到匹配。也就是说，如果当前左边有未被匹配的部分，我们就把新字符串添加到右边；反之亦然。

从而，我们只需要保存当前未被匹配的部分。而因为我们总是在相反的一边添加，这里的未被匹配部分必定为原来某个字符串的前缀或后缀。这样，我们就把总状态数限制到了$O(NL)$。

此时，原题就变成了一个最短路径问题。因为数据范围很小，可以用各种最短路径算法来求解。

:::details 参考代码（C++）

```cpp
#include <iostream>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#define INF 10000000000000000LL

using namespace std;
typedef long long ll;

bool is_palindrome(string &s) {
  int n = s.size();
  for (int i = 0; i < n / 2; ++i)
    if (s[i] != s[n - i - 1])
      return false;
  return true;
}

int n;
unordered_map<string, ll> memo[2];
unordered_set<string> vis[2];
vector<string> S[2];
vector<ll> C;
ll dfs(string s, int p) {
  if (memo[p].count(s))
    return memo[p][s];
  if (is_palindrome(s))
    return 0;
  if (vis[p].count(s))
    return INF;
  vis[p].insert(s);
  ll ans = INF;
  int ls = s.size();
  for (int i = 0; i < n; ++i) {
    string t = S[!p][i];
    int lt = t.size();
    int l = min(ls, lt);
    string ps = s.substr(0, l);
    string pt = t.substr(0, l);
    if (ps != pt)
      continue;
    ll cost =
        ls > lt ? dfs(s.substr(l, ls - l), p) : dfs(t.substr(l, lt - l), !p);
    if (cost < ans)
      ans = min(ans, cost + C[i]);
  }
  vis[p].erase(s);
  memo[p][s] = ans;
  return ans;
}

int main() {
  cin >> n;
  S[0] = vector<string>(n);
  S[1] = vector<string>(n);
  C = vector<ll>(n);
  ll ans = INF;
  for (int i = 0; i < n; ++i) {
    cin >> S[0][i] >> C[i];
    S[1][i] = string(S[0][i].rbegin(), S[0][i].rend());
  }
  for (int i = 0; i < n; ++i)
    ans = min(ans, dfs(S[0][i], 0) + C[i]);
  cout << (ans == INF ? -1 : ans);
}
```

:::
