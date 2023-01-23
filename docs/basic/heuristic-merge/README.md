---
sidebar_position: 6
---

# 启发式合并

启发式合并是一个非常实用的策略，但却很少被专门提及。其中心思想是，在处理两组或多组状态的合并（可能是同一级状态之间的合并；也可能是父子状态之间的合并）时，始终将状态数较少的那一组向状态数较多的那一组进行合并，以减少状态移动或修改的次数。

## 练习题

### [CF1455G - Forbidden Value](https://codeforces.com/contest/1455/problem/G)

:::details 提示一
显然我们应当保存对应每一个数值的最小代价。不难发现，进入If分支相当于是从对应于If条件的那个数值出发，这样可以得到一些新的最小代价；而在结束If分支之后，我们需要将这些代价与上一层的代价进行合并。可以通过递归，利用系统栈来保存进入嵌套的If分支前的状态。
:::

:::details 提示二
我们可以利用启发式合并的思想，每次总是将状态数较少的那一组向状态数较多的那一组进行合并。
:::

:::details 参考代码（C++）

```cpp
#include <iostream>
#include <set>
#include <unordered_map>

typedef long long ll;

using namespace std;
int n, s;

void work(unordered_map<int, ll> &cost, set<pair<ll, int>> &pq, ll &extra) {
  string cmd;
  int x, y;
  unordered_map<int, ll> nc;
  set<pair<ll, int>> nq;
  ll ne;
  while (n--) {
    cin >> cmd;
    if (cmd == "if") {
      cin >> x;
      nc.clear();
      nq.clear();
      ne = 0;
      if (cost.count(x)) {
        nc[x] = cost[x];
        nq.emplace(cost[x], x);
        pq.erase({cost[x], x});
        cost.erase(x);
      }
      work(nc, nq, ne);
      if (nc.size() > cost.size()) {
        extra += ne;
        ne = -ne;
        swap(cost, nc);
        swap(pq, nq);
      }
      for (auto [c, v] : nq)
        if (!cost.count(v) || cost[v] > c + ne) {
          pq.erase({cost[v], v});
          cost[v] = c + ne;
          pq.emplace(cost[v], v);
        }
    } else if (cmd == "set") {
      cin >> x >> y;
      if (cost.empty())
        continue;
      if (x != s) {
        auto [c, v] = *pq.begin();
        if (!cost.count(x) || cost[x] > c - y) {
          pq.erase({cost[x], x});
          cost[x] = c - y;
          pq.emplace(cost[x], x);
        }
      }
      extra += y;
    } else
      return;
  }
};

int main() {
  cin >> n >> s;
  string cmd;
  unordered_map<int, ll> cost;
  set<pair<ll, int>> pq;
  ll extra = 0;
  cost[0] = 0;
  pq.emplace(0, 0);
  work(cost, pq, extra);
  printf("%lld", pq.begin()->first + extra);
}
```

:::

### [ABC183F - Confluence](https://atcoder.jp/contests/abc183/tasks/abc183_f)

:::details 提示
利用并查集，合并时把包含不同班级较少的合并到较多的里面去。
:::

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
