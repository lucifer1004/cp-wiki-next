# Google Kick Start 2021 Round A

## Problem A - [K-Goodness String](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000436140/000000000068cca3)

First, we need to calculate the current score $K_c$. Since in one operation we can increase or decrease the score by $1$, the answer is $|K_c-K|$.

- Time complexity is $\mathcal{O}(|S|)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (C++)

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

First, we calculate the length of longest continuous $1$ starting from each cell via simple dynamic programming, namely, $W[i][j]$, $E[i][j]$, $N[i][j]$ and $S[i][j]$.

Then we enumerate each cell and count the L-shaped plots centering at the cell. There are four types of L-shaped plots considering the orientation:

- WN
- WS
- EN
- ES

And for each type, we need to consider which side to be the longer side.

- Time complexity is $\mathcal{O}(RC)$.
- Space complexity is $\mathcal{O}(RC)$.

:::details Code (C++)

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

Obviously, the highest cell should not be increased. With this insight, we can solve this problem in a Dijkstra-like manner.

We use a max-heap to store the cells to be processed. When we process a cell with height $h$, we need to ensure that all its neighbors are at least as high as $h-1$. If the height of any of its neighbors is increased, then we should enqueue that cell with the new height.

In the end, we accumulate the difference between each cell's final height and original height to get the answer.

- Time complexity is $\mathcal{O}(RC\log(RC))$.
- Space complexity is $\mathcal{O}(RC\log(RC))$.

:::details Code (C++)

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

The hardest part of this problem is to recognize that it is actually a Minimum Spanning Tree (actually Maximum Spanning Tree, but they are equivalent) problem.

The first observation is that we can consider the known numbers to be unknown with a cost of $0$, and solve an equivalent problem in which all numbers are unknown.

The second observation is that we need to check exactly $(N-1)^2$ cells for a $N\times N$ matrix:

- If we check fewer than $(N-1)^2$, then at least $2N$ cells are unknown, while we can induce at most $2N-1$ cells.
- If we check more than $(N-1)^2$, then there is at least a row/column whose cells are all checked, which is unnecessary.

Now, instead of determining the $(N-1)^2$ cells to be checked, we try to determine the $2N-1$ cells which are induced. We want the sum of their costs to be maximized so that the sum of the checked cells can be minimized.

An insight is that, if we consider the $N$ rows and $N$ columns to be nodes, and the cells to be undirected edges (cell $(i,j)$ is considered to be an edge $r_i\leftrightarrow c_j$), then there will be exactly $2N$ nodes, while we need to choose $2N-1$ edges from all edges such that the sum of their weights is maximized. Very close to MST!

To confirm that it is exactly MST, we need to check whether loops are allowed. Since there are no edges that connect two rows or two columns, a loop must be in the form $r_0\leftrightarrow c_0\leftrightarrow r_1\leftrightarrow c_1\cdots\leftrightarrow r_0$. If a loop occurs, then all the rows and columns in this loop would have at least two unknown cells, which is unsolvable.

So we need to choose $2N-1$ edges in a graph with $2N$ nodes and loops are not allowed. Now we are confirmed that this is an MST.

The MST part is quite trivial, both Kruskal and Prim can work fluently.

- Time complexity is $\mathcal{O}(N^2\log N)$ for Kruskal, and $\mathcal{O}(N^2)$ for Prim (since it is a dense graph).
- Space complexity is $\mathcal{O}(N^2)$.
 
:::details Code (C++)

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
