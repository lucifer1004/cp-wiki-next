# SnarkNews Summer Series 2020 Round 2

## Problem B - [Sequence Analysis](https://contest.yandex.com/snss2020/contest/19321/problems/B/)

### 题目描述

给定两个序列$A$和$B$，求其公共子序列的总数$\mod 998244353$。

### 题解

动态规划。如果$A_i\neq B_j$，$dp[i][j]=dp[i][j-1]+dp[i-1][j]-dp[i-1][j-1]$（容斥原理），如果$A_i=B_j$，还要额外加上$dp[i-1][j-1]+1$。

:::details 参考代码（C++）

```cpp
#include <cstring>
#include <iostream>
#define MAXN 1005
#define MOD 998244353

using namespace std;
typedef long long ll;

int a[MAXN], b[MAXN], dp[MAXN][MAXN];
int main() {
  int n, m;
  cin >> n >> m;
  for (int i = 1; i <= n; ++i)
    cin >> a[i];
  for (int i = 1; i <= m; ++i)
    cin >> b[i];
  memset(dp, 0, sizeof(dp));
  for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= m; ++j) {
      dp[i][j] =
          ((ll)dp[i - 1][j] + dp[i][j - 1] - dp[i - 1][j - 1] + MOD) % MOD;
      if (a[i] == b[j])
        dp[i][j] = ((ll)dp[i][j] + dp[i - 1][j - 1] + 1) % MOD;
    }
  cout << dp[n][m];
}
```

:::

## Problem D - [Meet Readers](https://contest.yandex.com/snss2020/contest/19321/problems/D/)

### 题目描述

有$N$个作家，每个人可以在$[l_i,r_i)$的时间范围内参加会议，参会的不满度是$W_i$。问，要使得$[L,R)$的范围内都有人，并使得不满度的最大值最小的情况下，应该怎么安排（不要求作家的人数最少）。

### 题解

二分答案。判断可行性时，将作家按照时间段排序，然后扫描即可。细节的处理需要稍加注意，必须是连续覆盖$[L,R)$，中间不能有中断。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;
struct Author {
  ll l, r, w, idx;
  bool operator<(const Author &other) const {
    return l < other.l || (l == other.l && r > other.r);
  }
};
int main() {
  int n;
  cin >> n;
  vector<Author> a;
  for (int i = 0; i < n; ++i) {
    ll l, r, w;
    cin >> l >> r >> w;
    a.push_back(Author{l, r, w, i + 1});
  }
  sort(a.begin(), a.end());
  ll L, R;
  cin >> L >> R;
  ll lo = 0, hi = 1e18;
  while (lo <= hi) {
    ll mid = lo + (hi - lo) / 2;
    ll l = -1, r = -1;
    bool ok = true;
    for (int i = 0; i < n; ++i) {
      if (a[i].w > mid)
        continue;
      if (r < a[i].l)
        l = a[i].l;
      r = max(r, a[i].r);
      if (r >= R)
        break;
    }
    if (l != -1 && l <= L && r >= R)
      hi = mid - 1;
    else
      lo = mid + 1;
  }
  if (lo >= 1e18) {
    cout << -1;
    return 0;
  }
  vector<int> ans;
  for (int i = 0; i < n; ++i)
    if (a[i].w <= lo && a[i].l < R)
      ans.emplace_back(a[i].idx);
  cout << ans.size() << endl;
  for (int i : ans)
    cout << i << " ";
}
```

:::

## Problem E - [Distance in Line](https://contest.yandex.com/snss2020/contest/19321/problems/E/)

### 题目描述

$Q$个人按照`L`、`R`、`U`、`D`的顺序排队，问相隔$N$位的两个人总共有多少次相邻。

### 题解

模拟。俄文机翻的英文不是很通顺，不过在纸上尝试一下之后就能比较容易弄懂题目的意思。只要按照序列把整个队伍的形状画出来，然后判断一下有多少间隔为$N$的位置是相邻（包括对角线）的。

:::details 参考代码（C++）

```cpp
#include <iostream>
#include <map>
#include <vector>

using namespace std;
int main() {
  int q, n;
  string s;
  cin >> q >> s >> n;
  vector<pair<int, int>> pos;
  pos.emplace_back(0, 0);
  int cx = 0, cy = 0;
  map<char, int> dx = {{'L', -1}, {'R', 1}, {'U', 0}, {'D', 0}},
                 dy = {{'L', 0}, {'R', 0}, {'U', -1}, {'D', 1}};
  for (char c : s) {
    cx += dx[c], cy += dy[c];
    pos.emplace_back(cx, cy);
  }
  int ans = 0;
  for (int i = 0; i + n < q; ++i) {
    if (abs(pos[i].first - pos[i + n].first) <= 1 &&
        abs(pos[i].second - pos[i + n].second) <= 1)
      ans++;
  }
  cout << ans;
}
```

:::
