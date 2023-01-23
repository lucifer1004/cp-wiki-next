# Google Kick Start 2021 Round A

## Problem A - [K-Goodness String](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000436140/000000000068cca3)

首先计算出当前分数$K_c$。因为每次操作可以增加或减少$1$点分数，所以最后的答案就是$|K_c-K|$。

- 时间复杂度为$\mathcal{O}(|S|)$。
- 空间复杂度为$\mathcal{O}(1)$。

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
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n, k;
    read(n), read(k);
    string s;
    cin >> s;
    int cnt = 0;
    for (int i = 0; i < n / 2; ++i) {
      if (s[i] != s[n - 1 - i])
        cnt++;
    }
    printf("%d\n", abs(cnt - k));
  }
};

int main() {
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem B - [L Shaped Plots](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000436140/000000000068c509)

首先计算出从每个格子开始的最长连续$1$的串的长度$W[i][j]$，$E[i][j]$，$N[i][j]$和$S[i][j]$。

接下来枚举L型的中心点。确定中心点之后，需要考虑四个朝向：

- WN
- WS
- EN
- ES

对于每种类型，需要再讨论长边的方向。

- 时间复杂度为$\mathcal{O}(RC)$.
- 空间复杂度为$\mathcal{O}(RC)$.

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;
using ll = long long;

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
    int r, c;
    read(r), read(c);
    vector<vector<int>> m(r, vector<int>(c));
    for (int i = 0; i < r; ++i)
      for (int j = 0; j < c; ++j)
        read(m[i][j]);
    vector<vector<int>> W(r, vector<int>(c));
    vector<vector<int>> E(r, vector<int>(c));
    vector<vector<int>> N(r, vector<int>(c));
    vector<vector<int>> S(r, vector<int>(c));
    for (int i = 0; i < r; ++i) {
      for (int j = 0; j < c; ++j) {
        if (m[i][j]) {
          W[i][j] = 1;
          if (j >= 1)
            W[i][j] += W[i][j - 1];
        }
      }
      for (int j = c - 1; j >= 0; --j) {
        if (m[i][j]) {
          E[i][j] = 1;
          if (j + 1 < c)
            E[i][j] += E[i][j + 1];
        }
      }
    }
    for (int j = 0; j < c; ++j) {
      for (int i = 0; i < r; ++i) {
        if (m[i][j]) {
          N[i][j] = 1;
          if (i >= 1)
            N[i][j] += N[i - 1][j];
        }
      }
      for (int i = r - 1; i >= 0; --i) {
        if (m[i][j]) {
          S[i][j] = 1;
          if (i + 1 < r)
            S[i][j] += S[i + 1][j];
        }
      }
    }

    ll ans = 0;
    for (int i = 0; i < r; ++i)
      for (int j = 0; j < c; ++j) {
        ans += max(0, min(W[i][j], N[i][j] / 2) - 1);
        ans += max(0, min(W[i][j] / 2, N[i][j]) - 1);
        ans += max(0, min(W[i][j], S[i][j] / 2) - 1);
        ans += max(0, min(W[i][j] / 2, S[i][j]) - 1);
        ans += max(0, min(E[i][j], N[i][j] / 2) - 1);
        ans += max(0, min(E[i][j] / 2, N[i][j]) - 1);
        ans += max(0, min(E[i][j], S[i][j] / 2) - 1);
        ans += max(0, min(E[i][j] / 2, S[i][j]) - 1);
      }

    printf("%lld\n", ans);
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

## Problem C - [Rabbit House](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000436140/000000000068cb14)

显然最高的格子不需要再加高了。因此，我们考虑采用类Dijkstra的方法求解。

用一个大根堆存储当前需要处理的格子。处理一个高度为$h$的格子时，将其相邻的格子的高度设置为至少$h-1$。如果一个格子被加高了，就将它再次入队。

最后累加所有格子的最终高度和原始高度的差就得到了答案。

- 时间复杂度为$\mathcal{O}(RC\log(RC))$.
- 空间复杂度为$\mathcal{O}(RC\log(RC))$.

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <queue>
#include <tuple>
#include <vector>

using namespace std;
using ll = long long;

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

const int d[4][2] = {{-1, 0}, {0, -1}, {1, 0}, {0, 1}};

class Solution {
public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int r, c;
    read(r), read(c);
    vector<vector<int>> g(r, vector<int>(c));
    priority_queue<tuple<int, int, int>> pq;
    for (int i = 0; i < r; ++i)
      for (int j = 0; j < c; ++j) {
        read(g[i][j]);
        pq.emplace(g[i][j], i, j);
      }
    vector<vector<int>> g0(g);
    while (!pq.empty()) {
      auto [h, i, j] = pq.top();
      pq.pop();
      if (h < g[i][j])
        continue;
      for (int k = 0; k < 4; ++k) {
        int ni = i + d[k][0], nj = j + d[k][1];
        if (ni < 0 || ni >= r || nj < 0 || nj >= c)
          continue;
        if (h - 1 > g[ni][nj]) {
          pq.emplace(h - 1, ni, nj);
          g[ni][nj] = h - 1;
        }
      }
    }

    ll ans = 0;
    for (int i = 0; i < r; ++i)
      for (int j = 0; j < c; ++j)
        ans += g[i][j] - g0[i][j];

    printf("%lld\n", ans);
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

## Problem D - [Checksum](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000436140/000000000068c2c3)

最难的部分是认识到这道题目实际上是求最小生成树（其实是最大生成树，不过这两个是等价的）。

首先，我们可以将所有已知的格子看成是消耗为$0$的未知格子。

接下来，我们发现我们必须解开$(N-1)^2$个格子：

- 如果少于$(N-1)^2$，那么至少有$2N$个未解开的，而我们至多进行$2N-1$次推导。
- 如果多于$(N-1)^2$，则至少有一行/一列解开了$N$个格子，这显然是不必要的。

下面，我们尝试确定剩下的$2N-1$个格子，并使其代价总和最大（这样剩下的总和就最小）。

如果把每一行和每一列看成一个节点，把每个格子看成一条边，我们就有了$2N$个节点和$N^2$条边。我们要从中选出$2N-1$条边，使其权重之和最大。多么像最小（大）生成树啊！

到底是不是最小生成树呢？我们来看看是否可以有环。

因为所有边都是连接了一行和一列，所以一个环必然是$r_0\leftrightarrow c_0\leftrightarrow r_1\leftrightarrow c_1\cdots\leftrightarrow r_0$的形式。那么，在有环存在的情况下，环中涉及的每一行和列都至少有两个未知数，从而无法确定每个格子的数值。

因此，我们需要在$2N$个节点的图中选出$2N-1$条边，使得权重总和最大，并且没有环。好了，确定是最小（大）生成树无误了。

最小（大）生成树的部分就很简单了，Kruskal或Prim算法都可以顺利通过。

- 时间复杂度为$\mathcal{O}(N^2\log N)$（Kruskal），或$\mathcal{O}(N^2)$（Prim），因为是稠密图，所以这里用Prim算法可以有更优的时间复杂度。
- 空间复杂度为$\mathcal{O}(N^2)$.
 
:::details 参考代码（C++, Kruskal）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;
using ll = long long;

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

class UnionFind {
  int n;
  vector<int> parent, size;

public:
  UnionFind(int n) {
    this->n = n;
    parent = vector<int>(n);
    size = vector<int>(n, 1);
    for (int i = 0; i < n; ++i)
      parent[i] = i;
  }

  int find(int idx) {
    if (parent[idx] == idx)
      return idx;
    return parent[idx] = find(parent[idx]);
  }

  void connect(int a, int b) {
    int fa = find(a), fb = find(b);
    if (fa != fb) {
      if (size[fa] > size[fb]) {
        parent[fb] = fa;
        size[fa] += size[fb];
      } else {
        parent[fa] = fb;
        size[fb] += size[fa];
      }
    }
  }
};

class Solution {
public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n;
    read(n);
    vector<vector<int>> a(n, vector<int>(n));
    vector<vector<int>> b(n, vector<int>(n));
    vector<int> r(n);
    vector<int> c(n);
    for (int i = 0; i < n; ++i)
      for (int j = 0; j < n; ++j)
        read(a[i][j]);

    vector<tuple<int, int, int>> edges;
    ll tot = 0;
    for (int i = 0; i < n; ++i)
      for (int j = 0; j < n; ++j) {
        read(b[i][j]);
        tot += b[i][j];
        edges.emplace_back(b[i][j], i, n + j);
      }
    sort(edges.rbegin(), edges.rend());
    UnionFind uf(n * 2);

    for (int i = 0; i < n; ++i)
      read(r[i]);
    for (int i = 0; i < n; ++i)
      read(c[i]);

    ll remove = 0;
    for (auto [weight, u, v] : edges) {
      if (uf.find(u) == uf.find(v))
        continue;
      remove += weight;
      uf.connect(u, v);
    }

    printf("%lld\n", tot - remove);
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
