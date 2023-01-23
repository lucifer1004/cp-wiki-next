# AtCoder Beginner Contest 187 Editorial

[Video Editorial](https://www.youtube.com/watch?v=pcPlZAiC3HY)

<iframe width="560" height="315" src="https://www.youtube.com/embed/pcPlZAiC3HY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A - [Large Digits](https://atcoder.jp/contests/abc187/tasks/abc187_a)

Calculate the sum of digits and compare.

Time complexity is $\mathcal{O}(\log(AB))$.

:::details Code (Python 3)

```python
def dsum(n):
    return sum(int(x) for x in str(n))

a, b = map(int, input().split())
print(max(dsum(a), dsum(b)))
```

:::

## Problem B - [Gentle Pairs](https://atcoder.jp/contests/abc187/tasks/abc187_b)

Enumerate all pairs and calculate the slope.

Time complexity is $\mathcal{O}(N^2)$.

:::details Code (Python 3)

```python
n = int(input())
x = []
y = []
for _ in range(n):
    xi, yi = map(int, input().split())
    x.append(xi)
    y.append(yi)

ans = 0
for i in range(n):
    for j in range(i + 1, n):
        if abs(y[j] - y[i]) <= abs(x[j] - x[i]):
            ans += 1
print(ans)
```

:::

## Problem C - [1-SAT](https://atcoder.jp/contests/abc187/tasks/abc187_c)

Use two HashSets to store strings with `!` and without `!` separately. If their intersection is non-empty, we can output any string in it, otherwise we output `satisfiable`.

Time complexity is $\mathcal{O}(N)$.

:::details Code (C++)

```cpp
#include <iostream>
#include <unordered_set>

using namespace std;
int main() {
  int n;
  cin >> n;
  unordered_set<string> clean, banged;
  for (int i = 0; i < n; ++i) {
    string s;
    cin >> s;
    if (s[0] == '!')
      banged.insert(s.substr(1));
    else
      clean.insert(s);
  }
  for (string s : clean)
    if (banged.count(s)) {
      cout << s;
      return 0;
    }
  cout << "satisfiable";
}
```

:::

## Problem D - [Choose Me](https://atcoder.jp/contests/abc187/tasks/abc187_d)

Sort all the towns by $2A_i+B_i$ in the descending order, then make speeches greedily.

Time complexity is $\mathcal{O}(N\log N)$.

:::details Code (C++)

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int n;
  cin >> n;
  vector<pair<ll, ll>> towns;
  ll sa = 0, sb = 0;
  for (int i = 0; i < n; ++i) {
    int a, b;
    cin >> a >> b;
    towns.emplace_back(a, b);
    sa += a;
  }
  sort(towns.begin(), towns.end(), [](pair<ll, ll> &p, pair<ll, ll> &q){
    return p.first * 2 + p.second > q.first * 2 + q.second;
  });
  for (int i = 0; i < n; ++i) {
    if (sa < sb) {
      cout << i;
      return 0;
    }
    sa -= towns[i].first, sb += towns[i].first + towns[i].second;
  }
  cout << n;
}
```

:::

## Problem E - [Through Path](https://atcoder.jp/contests/abc187/tasks/abc187_e)

Store the changes lazily at the root of each subtree. If in one operation, the nodes to be modified do not form a subtree, then they must be the compliment of a subtree. In this case, we add $x$ to all nodes (the value is stored in a global variable), and add $-x$ to the subtree. After all modifications, we can get the value of each node recursively.

Time complexity is $\mathcal{O}(N+Q)$.

:::details Code (C++)

```cpp
#include <iostream>
#include <vector>
#define MAXN 200005

using namespace std;
typedef long long ll;
vector<int> adj[MAXN]{};
int parent[MAXN]{};
ll lazy[MAXN]{}, val[MAXN];
ll global_lazy = 0;

void build_tree(int u) {
  for (int v : adj[u]) {
    if (v != parent[u]) {
      parent[v] = u;
      build_tree(v);
    }
  }
}

void push_down(int u, ll lazy_acc) {
  lazy_acc += lazy[u];
  val[u] = global_lazy + lazy_acc;
  for (int v : adj[u]) {
    if (v != parent[u])
      push_down(v, lazy_acc);
  }
}

int main() {
  int n;
  cin >> n;
  vector<pair<int, int>> edges;
  for (int i = 0; i < n - 1; ++i) {
    int u, v;
    cin >> u >> v;
    adj[u].emplace_back(v);
    adj[v].emplace_back(u);
    edges.emplace_back(u, v);
  }
  build_tree(1);

  int q;
  cin >> q;
  while (q--) {
    int t, e, x;
    cin >> t >> e >> x;
    int u = edges[e - 1].first, v = edges[e - 1].second;
    if (t == 2)
      swap(u, v);
    if (parent[v] == u) {
      global_lazy += x;
      x = -x;
      swap(u, v);
    }
    lazy[u] += x;
  }

  push_down(1, 0);
  for (int i = 1; i <= n; ++i)
    cout << val[i] << endl;
}
```

:::

## Problem F - [Close Group](https://atcoder.jp/contests/abc187/tasks/abc187_f)

Precalculate if a subset can be made up of a single connected components, then do a subset DP.

Time complexity is $\mathcal{O}(N^2\cdot2^N+3^N)$.

:::details Code (C++)

```cpp
#include <iostream>
#include <vector>

using namespace std;
int main() {
  int n, m;
  cin >> n >> m;
  vector<vector<bool>> adj(n, vector<bool>(n));
  for (int i = 0; i < m; ++i) {
    int u, v;
    cin >> u >> v;
    u--, v--;
    adj[u][v] = adj[v][u] = true;
  }
  int mask = 1 << n;
  vector<bool> can(mask);
  for (int i = 1; i < mask; ++i) {
    vector<int> v;
    for (int j = 0; j < n; ++j)
      if (i & (1 << j))
        v.emplace_back(j);
    if (v.size() == 1)
      can[i] = true;
    else {
      bool valid = true;
      for (int j = 0; j < v.size(); ++j) {
        for (int k = j + 1; k < v.size(); ++k)
          if (!adj[v[j]][v[k]]) {
            valid = false;
            break;
          }
        if (!valid)
          break;
      }
      can[i] = valid;
    }
  }

  const int INF = 1e9;
  vector<int> dp(mask, INF);
  for (int i = 1; i < mask; ++i) {
    if (can[i])
      dp[i] = 1;
    else {
      for (int sub = (i - 1) & i; sub; sub = (sub - 1) & i)
        dp[i] = min(dp[i], dp[sub] + dp[i ^ sub]);
    }
  }

  cout << dp[mask - 1];
}
```

:::
