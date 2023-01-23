# Google Kick Start 2019 Round F

## Problem A - Flattening

### 题目描述

给定一列数 $a_1,a_2...a_n$，问至少改变几个数字，可以使得相邻两个数字不相同的对数不超过 $k$ 对。

**示例：**
$$n=8,k=2$$
$$a=[300,100,300,300,200,100,800,500]$$

答案为 $3$，一种可行的策略是：

- $a_2$ 100->300
- $a_6$ 100->200
- $a_7$ 800->200

注意，不管数字的改变有多大，只计算为一次改变。

### 题解

可以参考 [LC265-粉刷房子](https://leetcode.cn/problems/paint-house-ii/)

预先对数字进行标号处理，记为 $nums[1]...nums[t]$。

我们用 $f[i][j][m]$ 表示前 $i$ 个数，至多包含 $j$ 对不相同的相邻数字，且最后一个数字为 $nums[m]$ 时的最少改变次数。可以得到转移方程：

$f[i][j][m]=\min(f[i-1][j][m], minf[i-1][j-1]) + (a[i] != nums[m])$

其中 $minf[i-1][j-1]$ 为预先维护的最小值。

$f[i-1][j][m]$ 的情况，由于上一个数字是 $nums[m]$，和当前增加的这个数字一样，所以不会增加不一致的对数。
$minf[i-1][j-1]$ 的情况，不管取得最小值时的最后一个数字是什么，至多增加一对不一致的对数，所以不一致对数不会超过 $j$。

最后一项，表示如果当前数字不为 $nums[m]$，则需要进行一次改变。

由于转移方程只涉及 $i-1$和$j-1$，所以可以用滚动数组处理。不过本题对空间的要求不高（$n\leq100$），直接三维数组毫无压力。

最后的答案就是 $\min f[n][j][m]$。

:::details 参考代码

```cpp
#include <algorithm>
#include <climits>
#include <iostream>
#include <unordered_set>
#include <vector>

typedef long long ll;

using namespace std;

void solve(int case_num) {
  int n, k;
  cin >> n >> k;
  vector<ll> a;
  unordered_set<ll> nums_set;
  for (int i = 0; i < n; ++i) {
    int ai;
    cin >> ai;
    a.emplace_back(ai);
    nums_set.insert(ai);
  }
  vector<ll> nums(nums_set.begin(), nums_set.end());
  int t = nums.size();

  vector<vector<vector<ll>>> f(
      n + 1, vector<vector<ll>>(k + 1, vector<ll>(t, INT_MAX)));
  vector<vector<ll>> minf(n + 1, vector<ll>(k + 1, INT_MAX));

  for (int i = 0; i < t; ++i) {
    if (nums[i] != a[0]) {
      f[1][0][i] = 1;
    } else {
      f[1][0][i] = 0;
      minf[1][0] = 0;
    }
  }

  for (int i = 2; i <= n; ++i) {
    for (int j = 0; j <= min(k, i - 1); ++j) {
      for (int m = 0; m < t; ++m) {
        f[i][j][m] = f[i - 1][j][m];
        if (j > 0)
          f[i][j][m] = min(f[i][j][m], minf[i - 1][j - 1]);
        if (a[i - 1] != nums[m])
          f[i][j][m]++;
        if (f[i][j][m] < minf[i][j])
          minf[i][j] = f[i][j][m];
      }
    }
  }

  ll ans = INT_MAX;
  for (int j = 0; j <= k; ++j)
    for (int m = 0; m < t; ++m)
      ans = min(ans, f[n][j][m]);

  cout << "Case #" << case_num << ": " << ans << endl;
}

int main() {
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i) {
    solve(i);
  }
  return 0;
}
```

:::

## Problem B - Teach Me

### 题目描述

给定 $n$ 个人和 $s$ 项技能，每个人掌握不超过 $5$ 项技能，但至少掌握一项技能，问有多少对 $(i,j)$，满足第 $i$ 个人可以给第 $j$ 个人教技能。

数据范围：$n\leq50000,s\leq1000$。

### 题解

这一题比赛时没有做出来大数据集，用 bitset 暴力过了小数据集。比赛之后看了前几名的代码，才恍然大悟。
这题的数据范围其实包含了暗示。每个人掌握不超过5项技能，这就意味着每个人的技能的子集至多 $C_5^1+C_5^2+C_5^3+C_5^4+C_5^5=31$。对于每个人，给他的技能集的每个子集计一次数。那么最后得到的每个技能集的计数次数，就是覆盖该技能集的技能集总数，也即这个人教不了的人的数量。
所以最后第 $i$ 个人能够教的人的数量就等于 $n-hash[skill_i]$。

最后一个问题是如何表示 $skill_i$。本题中由于 $s\leq1000$，可以用一个 1001 进制的 5 位数来表示，也就是用一个 `long long`。为了保证表示的唯一性，要对技能进行排序。当然，其实用字符串之类的表示方式也完全可行，不过在运算效率上就要逊色不少了。

:::details 参考代码

```cpp
#include <algorithm>
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;

typedef long long ll;
const ll radix = 1001;

void solve(int case_num) {
  int n, s;
  cin >> n >> s;
  vector<ll> a;
  unordered_map<ll, int> cnt;
  for (int i = 0; i < n; ++i) {
    int skill_count;
    cin >> skill_count;
    vector<int> skills(skill_count);
    for (int j = 0; j < skill_count; ++j)
      scanf("%d", &skills[j]);
    sort(skills.begin(), skills.end());
    ll hash = 0;
    for (const int &skill : skills)
      hash = hash * radix + skill;
    a.emplace_back(hash);
    for (int j = 0; j < (1 << skill_count); ++j) {
      ll hash = 0;
      for (int k = 0; k < skill_count; ++k)
        if (j & (1 << k))
          hash = hash * radix + skills[k];
      cnt[hash]++;
    }
  }
  ll ans = 0;
  for (int i = 0; i < n; ++i) {
    ans += n - cnt[a[i]];
  }
  cout << "Case #" << case_num << ": " << ans << endl;
}

int main() {
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i) {
    solve(i);
  }
  return 0;
}
```

:::

## Problem C - Spectating Villages

### 题目描述

$n$ 个村子由 $n-1$ 条无向边连接，保证任意两个村子可达（也即构成一棵树）。每个村子有一盏灯，一个村子点亮灯之后，所有相邻的村子也会被照亮。每个村子有一个美观值 $b_i$（$-10^5\leq b_i\leq 10^5$）。现在可以点亮任意多盏灯（也可以一盏都不点亮），求所有被照亮的村子的美观值总和的最大值。

### 题解

一道非常典型的树形动态规划。在把题目给出的无根树转为有根树之后，我们可以很容易地发现：

- 对于叶子节点，只有点灯、不点灯两种情况。
- 对于非叶子节点，有点灯、不点灯且不被点亮、不点灯但被点亮（也即至少一个孩子节点点灯）三种情况。

所以我们可以用一个二维数组$f[i][0,1,2]$来记录每个节点所在子树的最大美观值。

- $f[i][0]=\sum_{j\in adj[i]} \max(f[j][0], f[j][2])$。
- $f[i][1]=\sum_{j\in adj[i]} \max(f[j][0], f[j][1] - b_j, f[j][2] - b_j)+b_j$
- $f[i][2]$ 稍微复杂一些，需要比较所有的 $\max(f[j][0], f[j][2])$ 和 $f[j][1]$。如果存在 $f[j][1]\leq\max(f[j][0], f[j][2])$，那么直接取总和即可；否则需要用与对应的 $\max(f[j][0], f[j][2])$ 差距最小的 $f[j][1]$ 去替换，这样才能保证至少有一个孩子节点的灯是亮的，从而当前节点是被照亮的。

:::details 参考代码

```cpp
#include <algorithm>
#include <climits>
#include <iostream>
#include <vector>

typedef long long ll;

using namespace std;

class Graph {
  vector<ll> val, parent;
  vector<vector<ll>> adj, f;

  void dfs(int u, int fa) {
    int d = adj[u].size();
    for (int i = 0; i < d; i++) {
      int v = adj[u][i];
      if (v != fa)
        dfs(v, parent[v] = u);
    }
  }

  void to_tree() {
    parent = vector<ll>(val.size());
    parent[0] = -1;
    dfs(0, -1);
    for (int i = 0; i < val.size(); ++i)
      adj[i].clear();
    for (int i = 1; i < val.size(); ++i) {
      adj[parent[i]].emplace_back(i);
    }
  }

  void traverse(int u) {
    if (adj[u].empty()) {
      f[u][0] = 0;
      f[u][1] = val[u];
      f[u][2] = INT_MIN;
    } else {
      f[u][0] = 0;
      for (const int j : adj[u]) {
        traverse(j);
        f[u][0] += max(f[j][0], f[j][2]);
      }
      bool open = false;
      ll sec = 0;
      for (const int j : adj[u]) {
        ll m = max(f[j][0], f[j][2]);
        sec += max(m, f[j][1]);
        if (f[j][1] >= m)
          open = true;
      }
      if (!open) {
        ll delta = INT_MAX;
        for (const int j : adj[u]) {
          delta = min(delta, max(f[j][0], f[j][2]) - f[j][1]);
        }
        sec -= delta;
      }
      f[u][2] = sec + val[u];

      f[u][1] = val[u];
      for (const int j : adj[u]) {
        f[u][1] += max(f[j][0], max(f[j][1], f[j][2]) - val[j]) + val[j];
      }
    }
  }

public:
  Graph(vector<ll> &a) {
    val = vector<ll>(a);
    adj = vector<vector<ll>>(a.size(), vector<ll>{});
  }

  void add_edge(int a, int b) {
    adj[a].emplace_back(b);
    adj[b].emplace_back(a);
  }

  ll best() {
    to_tree();
    f = vector<vector<ll>>(val.size(), vector<ll>(3));
    traverse(0);
    return max(f[0][0], max(f[0][1], f[0][2]));
  }
};

void solve(int case_num) {
  int v;
  cin >> v;
  vector<ll> val;
  for (int i = 0; i < v; ++i) {
    int vi;
    cin >> vi;
    val.emplace_back(vi);
  }
  Graph g = Graph(val);
  for (int i = 0; i < v - 1; ++i) {
    int a, b;
    cin >> a >> b;
    g.add_edge(a - 1, b - 1);
  }

  cout << "Case #" << case_num << ": " << g.best() << endl;
}

int main() {
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i) {
 
   solve(i);
  }
  return 0;
}
```

:::
