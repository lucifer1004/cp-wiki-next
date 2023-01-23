# AtCoder Beginner Contest 184

[视频题解](https://www.youtube.com/watch?v=wnYpGt72S0w)

<iframe width="560" height="315" src="https://www.youtube.com/embed/wnYpGt72S0w" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A - [Determinant](https://atcoder.jp/contests/abc184/tasks/abc184_a)

直接计算即可。

时间复杂度$\mathcal{O}(1)$。

:::details 参考代码 （Python 3）

```python
a, b = map(int, input().split())
c, d = map(int, input().split())
print(a * d - b * c)
```

:::

## Problem B - [Quizzes](https://atcoder.jp/contests/abc184/tasks/abc184_b)

模拟。

时间复杂度$\mathcal{O}(N)$。

:::details 参考代码 （Python 3）

```python
n, x = map(int, input().split())
s = input()
for c in s:
    if c == 'o':
        x += 1
    else:
        x = max(0, x - 1)
print(x)
```

:::

## Problem C - [Super Ryuma](https://atcoder.jp/contests/abc184/tasks/abc184_c)

分情况讨论：

1. 起点和终点重合，总步数为$0$。
2. 一步可到达（共对角线或曼哈顿距离不超过$3$），总步数为$1$。
3. 走两次对角线，设此时中间点为$(r,c)$，可得到关于$r$和$c$的二元一次方程组，判断其是否有整数解（其实就是判断奇偶）。如果有整数解，总步数为$2$。
4. 枚举起点的邻近点，然后判断是否一步可到达。如果可到达，则总步数为$2$。
5. 其他所有情况都可以通过移动到一个相邻的格子转化为第三种情况，从而总步数为$3$。

时间复杂度$\mathcal{O}(1)$。

:::details 参考代码 （Python 3）

```python
r1, c1 = map(int, input().split())
r2, c2 = map(int, input().split())
if r1 == r2 and c1 == c2:
    print(0)
elif r1 + c1 == r2 + c2 or r1 - c1 == r2 - c2 or abs(r1 - r2) + abs(c1 - c2) <= 3:
    print(1)
elif (r1 + c1 + r2 - c2) % 2 == 0:
    print(2)
else:
    for i in range(-3, 4):
        for j in range(-3, 4):
            if abs(i) + abs(j) > 3:
                continue
            r = r1 + i
            c = c1 + j
            if r + c == r2 + c2 or r - c == r2 - c2 or abs(r - r2) + abs(c - c2) <= 3:
                print(2)
                exit(0)
    print(3)
```

:::

## Problem D - [increment of coins](https://atcoder.jp/contests/abc184/tasks/abc184_d)

记忆化递归。

时间复杂度$\mathcal{O}(T^3)$，其中$T=100$。

:::details 参考代码 （C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <vector>
#define MAXN 101

using namespace std;
double memo[MAXN][MAXN][MAXN]{};

double dfs(vector<int> &coins) {
  if (coins[1] == 0)
    return 100.0 - coins[0];
  if (coins[0] == 100 || coins[1] == 100 || coins[2] == 100)
    return 0.0;
  if (memo[coins[0]][coins[1]][coins[2]] >= 0)
    return memo[coins[0]][coins[1]][coins[2]];
  int s = 0;
  for (int coin : coins)
    s += coin;
  double ans = 0;
  for (int i = 0; i < 3; ++i) {
    if (coins[i] > 0) {
      vector<int> nxt(coins);
      nxt[i]++;
      ans += (double)coins[i] / s * (1 + dfs(nxt));
    }
  }
  return memo[coins[0]][coins[1]][coins[2]] = ans;
}

int main() {
  vector<int> coins(3);
  for (int i = 0; i < 3; ++i)
    cin >> coins[i];
  sort(coins.rbegin(), coins.rend());
  memset(memo, -1.0, sizeof(memo));
  printf("%.12f", dfs(coins));
}
```

:::

## Problem E - [Third Avenue](https://atcoder.jp/contests/abc184/tasks/abc184_e)

BFS。注意同一种类型的传送点只考虑一次。

时间复杂度$\mathcal{O}(HW)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <queue>
#include <vector>

using namespace std;
const int dx[4] = {-1, 0, 1, 0}, dy[4] = {0, -1, 0, 1};
const int INF = 0x3f3f3f3f;

int main() {
  int h, w;
  cin >> h >> w;
  vector<string> a(h);
  int si, sj, gi, gj;
  vector<vector<pair<int, int>>> tele(26);
  for (int i = 0; i < h; ++i) {
    cin >> a[i];
    for (int j = 0; j < w; ++j) {
      if (a[i][j] == 'S')
        si = i, sj = j;
      if (a[i][j] == 'G')
        gi = i, gj = j;
      if (a[i][j] >= 'a' && a[i][j] <= 'z')
        tele[a[i][j] - 'a'].emplace_back(i, j);
    }
  }
  vector<bool> used(26);
  vector<vector<int>> dist(h, vector<int>(w, INF));
  dist[si][sj] = 0;
  queue<pair<int, int>> q;
  q.emplace(si, sj);
  while (!q.empty()) {
    auto [i, j] = q.front();
    q.pop();
    if (i == gi && j == gj) {
      cout << dist[i][j] << endl;
      return 0;
    }
    for (int k = 0; k < 4; ++k) {
      int ni = i + dy[k], nj = j + dx[k];
      if (ni < 0 || ni >= h || nj < 0 || nj >= w || dist[ni][nj] != INF ||
          a[ni][nj] == '#')
        continue;
      dist[ni][nj] = dist[i][j] + 1;
      q.emplace(ni, nj);
    }
    if (a[i][j] >= 'a' && a[i][j] <= 'z' && !used[a[i][j] - 'a']) {
      used[a[i][j] - 'a'] = true;
      for (auto [ni, nj] : tele[a[i][j] - 'a']) {
        if (dist[ni][nj] == INF) {
          dist[ni][nj] = dist[i][j] + 1;
          q.emplace(ni, nj);
        }
      }
    }
  }
  cout << -1 << endl;
}
```

:::

## Problem F - [Programming Contest](https://atcoder.jp/contests/abc184/tasks/abc184_f)

折半搜索。

时间复杂度$\mathcal{O}(N\cdot2^{\frac{N}{2}})$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <set>
#include <vector>

using namespace std;
typedef long long ll;
int main() {
  int n, t;
  cin >> n >> t;
  vector<int> a(n);
  for (int i = 0; i < n; ++i)
    cin >> a[i];
  set<int> L, R;
  L.insert(0), R.insert(0);
  int l = n / 2, r = n - l;
  for (int i = 0; i < (1 << l); ++i) {
    int s = 0;
    for (int j = 0; j < l; ++j) {
      if (i & (1 << j))
        s += a[j];
      if (s > t)
        break;
    }
    if (s <= t)
      L.insert(s);
  }
  for (int i = 0; i < (1 << r); ++i) {
    int s = 0;
    for (int j = 0; j < r; ++j) {
      if (i & (1 << j))
        s += a[l + j];
      if (s > t)
        break;
    }
    if (s <= t)
      R.insert(s);
  }
  int ans = 0;
  for (int li : L) {
    auto it = R.lower_bound(t + 1 - li);
    if (it != R.begin())
      --it;
    if (li + *it <= t)
      ans = max(ans, li + *it);
    if (ans == t)
      break;
  }
  cout << ans << endl;
}
```

:::
