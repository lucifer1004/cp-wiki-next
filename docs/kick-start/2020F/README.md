# Google Kick Start 2020 Round F

## Problem A - [ATM Queue](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff48/00000000003f4ed8)

一个人要用$\left\lceil\frac{A_i}{X}\right\rceil$轮才能取到$A_i$。所以我们可以把$A_i$变为二元组$(\left\lceil\frac{A_i}{X}\right\rceil, i)$，然后排序就可以得到最终的序列。

因为进行了排序，最终的时间复杂度为$O(N\log N)$。

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
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n, x;
    read(n), read(x);
    vector<pair<int, int>> v;
    for (int i = 0; i < n; ++i) {
      int a;
      read(a);
      v.emplace_back((a - 1) / x + 1, i);
    }
    sort(v.begin(), v.end());
    for (auto vi : v)
      printf("%d ", vi.second + 1);
    printf("\n");
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem B - [Metal Harvest](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff48/00000000003f4b8b)

首先，我们对所有区间进行排序。因为区间不会有重叠，所以我们可以逐个处理。在这个过程中，我们一直记录着当前最后一个覆盖的右端点$R$。

对于每个区间，如果它已经被最后一个覆盖完全覆盖，我们不需要进行任何操作。否则，我们需要对一段长度为$r_i-\max(l_i,R)$的区间进行覆盖，这需要$\left\lceil\frac{r_i-\max(l_i,R)}{K}\right\rceil$个机器人。在添加了这些机器人后，我们将$R$更新为$\max(l_i, R)+K\cdot\left\lceil\frac{r_i-\max(l_i,R)}{K}\right\rceil$。

因为进行了排序，最终的时间复杂度为$O(N\log N)$。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;
using ll = int64_t;

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
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n, k;
    read(n), read(k);
    vector<pair<ll, ll>> v;
    for (int i = 0; i < n; ++i) {
      ll s, e;
      read(s), read(e);
      v.emplace_back(s, e);
    }
    sort(v.begin(), v.end());
    ll ans = 0, r = 0;
    for (auto vi : v) {
      if (vi.second > r) {
        ll l = max(r, vi.first);
        ll len = vi.second - l;
        ll num = (len - 1) / k + 1;
        r = l + num * k;
        ans += num;
      }
    }
    printf("%d\n", ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem C - [Painters' Duel](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff48/00000000003f47fb)

博物馆的结构可以用一个有$S^2$个节点，同时每个节点拥有不超过$3$条边的无向图来表示。

最困难的是如何表示当前游戏的局面。因为最多只有$6^2=36$个房间，一个$64$位整数就可以满足我们的需要。我们可以用最后$40$位记录房间的状态，$[41,50]$位记录$B$（后动的人）的位置，$[51,60]$位记录$A$（先动的人）的位置。如果一个房间已经被画过，或者正在维修，就将对应的位置为$1$。

接下来就可以用DFS来进行求解。

每一步有三种情况：

- $A$可以移动。从所有可选的房间中，我们需要找到一个可以最小化下一步得分的房间（因为在下一步中$A$和$B$的身份会互换）。  
- $A$无法移动，而$B$可以移动。直接交换$A$和$B$，进入下一步操作。
- $A$和$B$都无法移动。这是边界条件，返回$0$。

当然，我们会进行记忆化，以避免重复的计算。

理论的时间复杂度为$O(2^{S^2})$，这很大，但就像许多DFS问题一样，许多状态并不会被访问到，所以这一方法已经足够通过所有的测试。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;
typedef long long ll;
const ll mask = (1 << 10) - 1;

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

ll encode(ll state, ll a, ll b) { return state | (a << 50) | (b << 40); }

class Solution {
  vector<vector<int>> adj;
  unordered_map<ll, int> memo;
  void connect(int u, int v) {
    adj[u].emplace_back(v);
    adj[v].emplace_back(u);
  }
  int dfs(ll state, ll a, ll b) {
    ll code = encode(state, a, b);
    if (memo.count(code))
      return memo[code];
    bool a_can_move = false, b_can_move = false;
    int lo = 100;
    for (int u : adj[a]) {
      if (state & (1ll << u))
        continue;
      a_can_move = true;
      int result = dfs(state | (1ll << u), b, u);
      lo = min(lo, result);
    }
    if (a_can_move) {
      memo[code] = 1 - lo;
      return memo[code];
    }
    for (int u : adj[b]) {
      if (state & (1ll << u))
        continue;
      b_can_move = true;
      break;
    }
    if (!b_can_move) {
      memo[code] = 0;
      return 0;
    }
    memo[code] = -dfs(state, b, a);
    return memo[code];
  }

public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int s, ra, pa, rb, pb, c;
    read(s), read(ra), read(pa), read(rb), read(pb), read(c);
    int n = s * s;
    adj = vector<vector<int>>(n + 1);
    auto encode = [&](int i, int j) { return (i - 1) * (i - 1) + j; };
    vector<bool> ban(n + 1);
    for (int i = 0; i < c; ++i) {
      int ri, pi;
      read(ri), read(pi);
      ban[encode(ri, pi)] = true;
    }
    for (int i = 1; i <= s; ++i)
      for (int j = 1; j <= i * 2 - 1; ++j) {
        int u = encode(i, j);
        if (j < i * 2 - 1) {
          int v1 = encode(i, j + 1);
          if (!ban[v1])
            connect(u, v1);
        }
        if (j % 2 == 1 && i < s) {
          int v2 = encode(i + 1, j + 1);
          if (!ban[v2])
            connect(u, v2);
        }
      }
    ll start = 0;
    for (int i = 1; i <= n; ++i)
      if (ban[i])
        start |= (1ll << i);
    ll a = encode(ra, pa), b = encode(rb, pb);
    start |= (1ll << a);
    start |= (1ll << b);
    printf("%d\n", dfs(start, a, b));
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem D - [Yeetzhee](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff48/00000000003f4dea)

一个关键点是：除非当前状态已经不合法，否则我们不应当重新投掷骰子（严格证明暂时无法给出）。

在这一前提之下，我们就可以进行动态规划了。和C题一样，难点在于如何表示状态，并判断一个状态是否合法。

我们可以使用前缀和来表示状态。令$S[i]$表示出现次数不超过$i$次的数字的数目。比如说，如果最终的目标是$[1,2,2,3]$（这说明$N=8$）同时$M=6$，则目标状态的前缀和为$[2,3,5,6]$（因为最大的频率是$3$，所以将数组在$i=3$处截断），而初始状态的前缀和为 $[6,6,6,6]$。对于任何一个合法的中间状态，其所有位置都不应小于目标状态的对应位置，因为在转移过程中，前缀和中的元素只会减小而不会增大。

在每次转移中，我们枚举所有当前的合法状态。对于一个状态$(S,p,e)$，其中$S$表示前缀和，$p$表示这一状态的概率，$e$表示到达这一状态掷骰子次数的期望，我们首先找出所有可能的更新。一个更新$(i_k,c_k)$是合法的，当且仅当至少有一个数字出现了$i_k$次（也即$c_k=S[i_k]-S[i_k-1]>0$），同时$S[i_k]>target[i_k]$。我们可以求出所有“好”的数字的个数$g$。则我们在这一步掷骰子次数的期望为$\frac{M}{g}$。而这一个更新会被记录为$(S',p\cdot\frac{c_k}{g},e+\frac{M}{g})$。

接下来，我们应用所有的更新。对于一个新状态$S'$，它的概率为所有以其为目标的更新的概率之和，而它的期望为所有以其为目标的更新的期望的加权和（权值为归一化概率，也即需要把每一个概率值除以总概率）。

时间复杂度的计算是比较困难的。但是因为$50$的划分数大约为$10^6$量级，在整个动态规划过程中并不会产生太多的状态，因此可以顺利地通过所有测试。
 
:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <map>
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
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n, m, k;
    read(n), read(m), read(k);
    vector<int> a(k);
    vector<int> cnt(n + 1);
    for (int i = 0; i < k; ++i)
      read(a[i]), cnt[a[i]]++;
    int hi = a.back();
    vector<int> target(hi + 1);
    target[0] = m - k;
    for (int i = 1; i <= hi; ++i)
      target[i] = target[i - 1] + cnt[i];
    map<vector<int>, double> p, e;
    vector<int> raw(hi + 1, m);
    p[raw] = 1, e[raw] = 0;
    for (int i = 1; i <= n; ++i) {
      map<vector<int>, double> np, ne;
      vector<pair<vector<int>, pair<double, double>>> updates;
      for (const auto &pr : p) {
        const vector<int> &state = pr.first;
        double pi = pr.second;
        double ei = e[state];
        int good = 0;
        vector<pair<int, int>> choices;
        for (int j = 0; j < hi; ++j) {
          if (state[j] == target[j])
            continue;
          int rem = state[j] - (j == 0 ? 0 : state[j - 1]);
          if (!rem)
            continue;
          good += rem;
          choices.emplace_back(j, rem);
        }
        for (auto choice : choices) {
          int j = choice.first, c = choice.second;
          vector<int> nxt(state);
          nxt[j]--;
          double pnxt = pi * c / good;
          np[nxt] += pnxt;
          updates.emplace_back(nxt, make_pair(pnxt, ei + (double)m / good));
        }
      }
      for (const auto &update : updates) {
        const vector<int> &nxt = update.first;
        double pnxt = update.second.first, enxt = update.second.second;
        ne[nxt] += pnxt / np[nxt] * enxt;
      }
      p = move(np);
      e = move(ne);
    }
    double ans = 0;
    for (auto pr : e)
      ans += pr.second * p[pr.first];
    printf("%.8f\n", ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::
