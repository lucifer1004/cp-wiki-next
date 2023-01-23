# AtCoder Beginner Contest 183

[视频题解](https://www.youtube.com/watch?v=paWC0OYpOHk)

<iframe width="560" height="315" src="https://www.youtube.com/embed/paWC0OYpOHk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A - [ReLU](https://atcoder.jp/contests/abc183/tasks/abc183_a)

直接输出$\max(0,N)$即可，时间复杂度$\mathcal{O}(1)$。

:::details 参考代码 （Python 3）

```python
print(max(int(input()), 0))
```

:::

## Problem B - [Billiards](https://atcoder.jp/contests/abc183/tasks/abc183_b)

简单的几何计算，令$G'$为$G$关于$x$轴的对称点，连接$SG$，计算其与$x$轴交点的横坐标

$$
x=S_x+(G_x-S_x)\frac{S_y-0}{S_y-(-G_y)}
$$

即为答案。

时间复杂度$\mathcal{O}(1)$。

:::details 参考代码 （Python 3）

```python
sx, sy, gx, gy = map(int, input().split())
print("{:.12f}".format(sx + (gx - sx) * sy / (sy + gy)))
```

:::

## Problem C - [Travel](https://atcoder.jp/contests/abc183/tasks/abc183_c)

$N$很小，枚举所有路线即可。

时间复杂度$\mathcal{O}(N!)$。

:::details 参考代码 （Python 3）

```python
from itertools import permutations

n, k = map(int, input().split())
t = []
for _ in range(n):
    t.append(list(map(int, input().split())))
rem = list(permutations(range(1, n)))
ans = 0
for perm in rem:
    dist = 0
    perm = [0] + list(perm) + [0]
    for i in range(n):
        dist += t[perm[i]][perm[i + 1]]
    if dist == k:
        ans += 1
print(ans)
```

:::

## Problem D - [Water Heater](https://atcoder.jp/contests/abc183/tasks/abc183_d)

扫描线算法。

对于第$i$个人，给$S_i$增加$P_i$，同时给$T_i$减少$P_i$。

从第一分钟开始扫描，如果在某一时刻总需求超过了总供给，则无解。

时间复杂度$\mathcal{O}(N+T)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <vector>
#define MAXN 200005

using namespace std;
typedef long long ll;
int main() {
  int n, w;
  cin >> n >> w;
  vector<ll> delta(MAXN);
  for (int i = 0; i < n; ++i) {
    int s, t, p;
    cin >> s >> t >> p;
    delta[s] += p;
    delta[t] -= p;
  }
  ll curr = 0;
  for (int i = 0; i < MAXN; ++i) {
    curr += delta[i];
    if (curr > w) {
      cout << "No";
      return 0;
    }
  }
  cout << "Yes";
}
```

:::

## Problem E - [Queen on Grid](https://atcoder.jp/contests/abc183/tasks/abc183_e)

动态规划。记录每行、每列和每条对角线当前的前缀方法总和即可。

到达$(i,j)$的方法总数为$dp[i][j]=row[i]+col[j]+diag[i-j+w]$。之后，再用$dp[i][j]$去更新$row[i]$、$col[j]$和$diag[i-j+w]$。

如果$(i,j)$是墙，需要把$row[i]$、$col[j]$和$diag[i-j+w]$都清零。

时间复杂度$\mathcal{O}(HW)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <vector>
#define MOD 1000000007

using namespace std;
typedef long long ll;
int main() {
  int h, w;
  cin >> h >> w;
  vector<string> a(h);
  for (int i = 0; i < h; ++i)
    cin >> a[i];
  vector<vector<ll>> dp(h, vector<ll>(w));
  dp[0][0] = 1;
  vector<ll> row(h), col(w), diag(h + w);
  for (int i = 0; i < h; ++i)
    for (int j = 0; j < w; ++j) {
      if (a[i][j] == '#') {
        row[i] = 0;
        col[j] = 0;
        diag[i - j + w] = 0;
        continue;
      }
      if (i > 0)
        dp[i][j] += col[j];
      if (j > 0)
        dp[i][j] += row[i];
      if (i > 0 && j > 0)
        dp[i][j] += diag[i - j + w];
      dp[i][j] %= MOD;
      col[j] = (col[j] + dp[i][j]) % MOD;
      row[i] = (row[i] + dp[i][j]) % MOD;
      diag[i - j + w] = (diag[i - j + w] + dp[i][j]) % MOD;
    }
  cout << dp[h - 1][w - 1];
}
```

:::

## Problem F - [Confluence](https://atcoder.jp/contests/abc183/tasks/abc183_f)

并查集，合并时把包含不同班级较少的合并到较多的里面去。

时间复杂度$\mathcal{O}(N\log N+Q)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <unordered_map>
#include <vector>
#define MOD 1000000007

using namespace std;
typedef long long ll;
int main() {
  int n, q;
  cin >> n >> q;
  vector<int> c(n);
  for (int i = 0; i < n; ++i)
    cin >> c[i];
  vector<int> parent(n);
  vector<unordered_map<int, int>> mem(n);
  for (int i = 0; i < n; ++i) {
    parent[i] = i;
    mem[i][c[i]]++;
  }
  auto find = [&](auto self, int u) {
    if (parent[u] == u)
      return u;
    return parent[u] = self(self, parent[u]);
  };

  auto merge = [&](int u, int v) {
    int pu = find(find, u), pv = find(find, v);
    if (pu == pv)
      return;
    if (mem[pu].size() >= mem[pv].size()) {
      for (auto [t, f] : mem[pv])
        mem[pu][t] += f;
      parent[pv] = pu;
    } else {
      for (auto [t, f] : mem[pu])
        mem[pv][t] += f;
      parent[pu] = pv;
    }
  };

  while (q--) {
    int t, x, y;
    cin >> t >> x >> y;
    if (t == 1) {
      merge(x - 1, y - 1);
    } else {
      int root = find(find, x - 1);
      if (mem[root].count(y))
        cout << mem[root][y] << endl;
      else
        cout << 0 << endl;
    }
  }
}
```

:::
