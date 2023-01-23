# AtCoder Beginner Contest 176 Tutorial

## Problem A - [Takoyaki](https://atcoder.jp/contests/abc176/tasks/abc176_a)

The time needed equals to $\left\lceil\frac{N}{X}\right\rceil\cdot T$.

:::details Code (Python3)

```python
n, x, t = map(int, input().split(' '))
print(((n - 1) // x + 1) * t)
```

:::

## Problem B - [Multiple of 9](https://atcoder.jp/contests/abc176/tasks/abc176_b)

Let $n=\sum a_i\times10^i$, since $\forall i,10^i\equiv1(\mod9)$, we have $n\equiv\sum a_i(\mod 9)$ . So we just need to check the sum of all the digits of $n$.

:::details Code (Python3)

```python
print('Yes' if sum(map(int, input())) % 9 == 0 else 'No')
```

:::

## Problem C - [Step](https://atcoder.jp/contests/abc176/tasks/abc176_c)

Just greedily increase current number to the maximum to its left, and then update the maximum if current number is larger than it.

:::details Code (C++)

```cpp
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;
int main() {
  int n;
  cin >> n;
  vector<int> a(n + 1);
  for (int i = 1; i <= n; ++i)
    cin >> a[i];
  int hi = 0;
  ll ans = 0;
  for (int i = 1; i <= n; ++i) {
    ans += max(0, hi - a[i]);
    hi = max(hi, a[i]);
  }
  cout << ans;
}
```

:::

## Problem D - [Wizard in Maze](https://atcoder.jp/contests/abc176/tasks/abc176_d)

It's a very typical $0$-$1$ BFS, since the cost is $0$ if we go along the roads, while the cost is $1$ if we cast a magic spell.

Compared to ordinary BFS, we need to use a deque instead of a single-ended queue. For relaxations that cost $0$, we do `push_front`, while for those cost $1$, we do `push_back`. In this way, the elements in the deque are kept in an non-decreasing order, which means we will happily take the current value as the optimal value when we first reach the target position. 

:::details Code (C++)

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

First, we can simply count how many targets there are in each row and each column.

Supposing the maximum of rows is $R_{max}$, and $C_{max}$ for columns. It is obvious that we can never achieve any value greater than $R_{max}+C_{max}$. In addition, we may not achieve $R_{max}+C_{max}$ because there might be a target at the crossing point of the row and the column, in which case this target is counted twice. So our worst case value is $R_{max}+C_{max}-1$ if we choose a row from those having $R_{max}$, and a column from those having $C_{max}$. Since all other choices cannot give better results, we only need to consider these rows and columns.

There might still be a log of combinations (worst case $O(NM)$). However, we do not need to check these combinations one by one. We can consider it from the perspective of targets. Say there are $n$ rows of $R_{max}$ and $m$ columns of $C_{max}$, if the number of target is smaller than $nm$, then it is ensured than there is at least one combination which will give us $R_{max}+C_{max}$. Otherwise, there are not so many combinations, so we can check them one by one, until we find a combination giving $R_{max}+C_{max}$, or we finish all the combinations and none is suitable, then we will have $R_{max}+C_{max}-1$ instead.

:::details Code (C++)

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

There is an obvious $O(N^3)$ DP idea, in which we maintain states $dp[i][j]$, meaning the maximum we can get when we choose to keep numbers (not indices) $i$ and $j$. But this is not enough to pass.

Do we always need to update all the states? For each segment of length $3$, only a few of all states can be updated, because we are only given at most $3$ different numbers, which means we do not have many choices.

So, how to do state transitions? Supposing we are considering $a,b,c$.

- If $a=b=c$, then we should choose them all. In this case, instead of updating states, we should keep the number of such triplets in a separate variable. So the transition is $O(1)$.
- We change the current reserved numbers to two of $a,b,c$, e.g., $(a,b)$. In this case, we have two further choices
    - Make no triplets, and update $dp[a][b]$ to current global optimal value $opt$.
    - Make a triplet using two reserved $c$ and current $c$, then update $dp[a][b]$ to $dp[c][c]+1$.
    The transition is $O(1)$.
- We change one of the reserved number to one of $a,b,c$, e.g., $a$. In this case, we need to enumerate the other reserved number $x$, and we have two further choices
    - Make no triplets, and update $dp[a][x]$ to local optimal value $local\_opt[x]$, which means the best value we can get when we reserve at least one $x$.
    - Particularly, if $b=c$, then we can update $dp[a][x]$ to $dp[b][x]+1$
    The transition is $O(N)$
    
So the overall time complexity becomes $O(N^2)$, which is acceptable. It should be noted that all these updates should not be applied instantly. Instead, we store them and apply them at last.

During the update $dp[i][j]\rightarrow val$, we need to update

- Global optimum $opt\rightarrow\max\{opt,val\}$
- Local optimum $local\_opt[i]\rightarrow\max\{local\_opt[i],val\}$, and $local\_opt[j]\rightarrow\max\{local\_opt[j],val\}$
- State $dp[i][j]\rightarrow\max\{dp[i][j],val\}$, and $dp[j][i]\rightarrow\max\{dp[j][i],val\}$

After all these, we still have not handled the last number $last$. So we need to compare $opt$ and $dp[last][last]+1$. After that, we add to $opt$ the number of natural triplets $triplets$, and now we have the answer.

:::details Code (C++)

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
