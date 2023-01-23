# AtCoder Beginner Contest 176

## Problem A - [Takoyaki](https://atcoder.jp/contests/abc176/tasks/abc176_a)

过水，略。

## Problem B - [Multiple of 9](https://atcoder.jp/contests/abc176/tasks/abc176_b)

### 题目描述

给定一个很大的整数，问其是否是$9$的倍数。

### 题解

$9$的倍数每一位之和也一定是$9$的倍数。

## Problem C - [Step](https://atcoder.jp/contests/abc176/tasks/abc176_c)

### 题目描述

给定一个数组，每次操作可以给一个数增加$1$，问最少多少次操作可以将数组变为不下降序列？

### 题解

贪心地将当前数字加大到左边的最大值即可，如果当前数字大于最大值，则更新最大值。

## Problem D - [Wizard in Maze](https://atcoder.jp/contests/abc176/tasks/abc176_d)

### 题目描述

有一个巫师在迷宫中，要从起点到终点。有两种走法：一是直接沿着路走，二是使用魔法，跳到以当前格子为中心的$5\times5$方阵中任意一个没有障碍的格子上。问最少用几次魔法，可以到终点？如果无解，输出$-1$。

### 题解

非常典型的0-1BFS。沿着路走的代价为$0$，而使用魔法的代价为$1$。使用标准的0-1BFS，也即双端队列来处理即可。

:::details 参考代码（C++）

```cpp
#include <deque>
#include <iostream>
#include <vector>
#define INF 0x3f3f3f3f

using namespace std;

const int dx[4] = {-1, 0, 1, 0}, dy[4] = {0, -1, 0, 1};
int h, w, sx, sy, ex, ey;

int main() {
  cin >> h >> w >> sx >> sy >> ex >> ey;
  sx--, sy--, ex--, ey--;
  vector<string> a(h);
  for (int i = 0; i < h; ++i)
    cin >> a[i];
  vector<vector<int>> dist(h, vector<int>(w, INF));
  vector<vector<bool>> vis(h, vector<bool>(w, false));
  deque<pair<int, int>> q;
  q.push_back({sx, sy});
  dist[sx][sy] = 0;
  while (!q.empty()) {
    auto f = q.front();
    q.pop_front();
    int ci = f.first, cj = f.second;
    if (ci == ex && cj == ey) {
      cout << dist[ci][cj];
      return 0;
    }
    if (vis[ci][cj])
      continue;
    vis[ci][cj] = true;
    for (int k = 0; k < 4; ++k) {
      int ni = ci + dy[k], nj = cj + dx[k];
      if (ni < 0 || ni >= h || nj < 0 || nj >= w ||
          dist[ni][nj] <= dist[ci][cj] || a[ni][nj] == '#')
        continue;
      dist[ni][nj] = dist[ci][cj];
      q.push_front({ni, nj});
    }
    for (int ni = ci - 2; ni <= ci + 2; ++ni)
      for (int nj = cj - 2; nj <= cj + 2; ++nj) {
        if (ni < 0 || ni >= h || nj < 0 || nj >= w || a[ni][nj] == '#' ||
            dist[ni][nj] <= dist[ci][cj] + 1)
          continue;
        dist[ni][nj] = dist[ci][cj] + 1;
        q.push_back({ni, nj});
      }
  }
  cout << -1;
}
```

:::


## Problem E - [Bomber](https://atcoder.jp/contests/abc176/tasks/abc176_e)

### 题目描述

有一个$N\times M$的大方阵，其中若干位置有目标物。可以设置一个炮台，炮台可以攻击同一行和同一列的所有目标。问炮台最多能攻击多少个目标？

### 题解

首先，可以统计出每行和每列的目标总数。假设行的最大值为$R_{max}$，列的最大值为$C_{max}$，则我们能得到的最大值显然不会超过$R_{max}+C_{max}$，因为还有可能恰好有一个目标在行和列的交点处，此时这个目标被重复计算了一次。我们显然应该选择值为$R_{max}$的行和值为$C_{max}$的列，因为这样选择最差的结果是$R_{max}+C_{max}-1$，而其他任何选择的最好结果也不超过$R_{max}+C_{max}-1$。我们希望知道，这些行和列的组合中，是否有结果为$R_{max}+C_{max}$的。如果逐一检查，显然可能超时。但我们可以逆向思考，从目标物出发。如果目标物的总数小于这些行和列的组合数，那么显然存在结果为$R_{max}+C_{max}$的组合；否则，我们则逐一检查所有组合。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <iostream>
#include <set>
#include <vector>

using namespace std;
int main() {
  int h, w, m;
  cin >> h >> w >> m;
  vector<int> hc(h + 1), wc(w + 1);
  vector<pair<int, int>> p(m);
  for (int i = 0; i < m; ++i)
    cin >> p[i].first >> p[i].second, hc[p[i].first]++, wc[p[i].second]++;
  set<pair<int, int>> s(p.begin(), p.end());
  int hm = *max_element(hc.begin(), hc.end());
  int wm = *max_element(wc.begin(), wc.end());
  vector<int> vh, vw;
  for (int i = 1; i <= h; ++i)
    if (hc[i] == hm)
      vh.emplace_back(i);
  for (int i = 1; i <= w; ++i)
    if (wc[i] == wm)
      vw.emplace_back(i);
  int sh = vh.size(), sw = vw.size();
  if (sh * sw > m) {
    cout << hm + wm;
    return 0;
  }
  for (int i : vh)
    for (int j : vw)
      if (!s.count({i, j})) {
        cout << hm + wm;
        return 0;
      }
  cout << hm + wm - 1;
}
```

:::

## Problem F - [Brave CHAIN](https://atcoder.jp/contests/abc176/tasks/abc176_f)

### 题目描述

有一个长度为$3N$（$N\leq2000$）的数组，重复进行以下操作：将前五个数任意排列，然后取走其中三个，如果这三个数两两相等，则得一分。这样操作$n-1$次后，会剩下三个数，如果它们都相等，还可以得一分。问最多能得多少分。

### 题解

容易想到用$dp[i][j]$记录保留$i$和$j$两个数时能够取得的最大值，但朴素的状态转移总时间复杂为$O(N^3)$，显然会超时。仔细思考，我们会发现每一步迭代过程中，并不是所有状态都需要更新——实际上，只有很少一部分状态需要被更新。

那么，我们应该如何进行状态转移呢？假设当前考虑的是$a,b,c$三个数。

- 如果这三个数都相等，我们直接用这三个数组合，$triplets$加一，所有记录的最优状态都不需要改变。
- 将当前保留的两个数替换为这三个数中的任意两个。以$(a,b)$为例，此时我们有两种更进一步的选择：
    - 不产生新的三元组，更新$dp[a][b]$到当前的全局最优解$opt$
    - 取保留了两个$c$的状态，与$c$一起构成一个三元组，更新$dp[a][b]$到$dp[c][c]+1$
- 将当前保留的两个数中的一个替换为这三个数中的某一个数。以$a$为例，此时我们需要遍历另一个保留的数$x$，之后有以下更进一步的选择：
    - 不产生新的三元组，更新$dp[a][x]$到当前至少保留了一个$x$的局部最优解$local\_opt[x]$
    - 特别的，如果$b=c$，我们可以取保留了$(b,x)$的状态，将$dp[a][x]$更新到$dp[b][x]+1$

所有的更新都被记录在一个数组中，在每步迭代的最后进行统一处理。可以看到，在上述过程中，只会产生$O(N)$数量的更新，因此可以达到$O(N^2)$的总时间复杂度。

最后，对于每一个更新$dp[i][j]$，我们需要用它更新

- 全局最优$opt$
- 保留至少一个$i$的局部最优$local\_opt[i]$
- 保留至少一个$j$的局部最优$local\_opt[j]$
- 保留$(i,j)$的最优$dp[i][j]$和$dp[j][i]$

最后还剩下一个数$last$没有被处理到。因此我们还需要比较一下$opt$和$dp[last][last]+1$。之后再加上本身能构成三元组的数目$triplets$就得到了答案。

:::details 参考代码（C++）

```cpp
#include <iostream>
#include <vector>
#define INF 0x3f3f3f3f

using namespace std;
typedef pair<int, int> pii;
int main() {
  int n;
  cin >> n;
  vector<int> a(3 * n);
  for (int i = 0; i < 3 * n; ++i)
    cin >> a[i];
  vector<vector<int>> f(n + 1, vector<int>(n + 1, -INF));
  vector<int> local_opt(n + 1, -INF);
  f[a[0]][a[1]] = f[a[1]][a[0]] = 0;
  local_opt[a[0]] = 0, local_opt[a[1]] = 0;
  vector<pair<pii, int>> updates;
  int triplets = 0, opt = 0;
  for (int i = 2; i < 3 * (n - 1); i += 3) {
    vector<int> b(3);
    for (int j = 0; j < 3; ++j)
      b[j] = a[i + j];
    if (b[0] == b[1] && b[0] == b[2]) {
      triplets++;
      continue;
    }
    updates.clear();
    for (int p = 0; p <= 2; ++p) {
      int q = (p + 1) % 3, s = (p + 2) % 3;
      updates.push_back({{b[p], b[q]}, opt});
      updates.push_back({{b[p], b[q]}, f[b[s]][b[s]] + 1});
      for (int x = 1; x <= n; ++x) {
        updates.push_back({{b[p], x}, local_opt[x]});
        if (b[q] == b[s])
          updates.push_back({{b[p], x}, f[x][b[q]] + 1});
      }
    }
    for (const auto &u : updates) {
      int x = u.first.first, y = u.first.second, val = u.second;
      if (f[x][y] < val) {
        f[x][y] = f[y][x] = val;
        opt = max(opt, val);
        local_opt[x] = max(local_opt[x], val);
        local_opt[y] = max(local_opt[y], val);
      }
    }
  }
  opt = triplets + max(opt, f[a.back()][a.back()] + 1);
  printf("%d", opt);
}
```

:::
