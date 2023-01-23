# Codeforces Round 661 (CF1399)

## Problem A - Remove Smallest

### 题目描述

给定$n$个数，每次操作中，可以选取任意两个相差不超过$1$的数，然后删去其中一个，问能否删到只剩下一个数。

### 题解

先排序，然后从小到大遍历，判断较小的那一个能否被删除。

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
  void solve() {
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    sort(a.begin(), a.end());
    for (int i = 0; i + 1 < n; ++i)
      if (a[i + 1] - a[i] > 1) {
        printf("NO\n");
        return;
      }
    printf("YES\n");
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

用FP的思想，就是要得到一个$b_i=a_{i+1}-a_i$的差数组，然后判断$b_i$的最大值是否超过$1$。

:::details 参考代码（Haskell）

```haskell
import Control.Monad
import Data.Bool
import Data.List

solve :: IO ()
solve = do
  getLine
  as <- map read . words <$> getLine
  putStrLn $ bool "NO" "YES" $ all (<= 1) $ zipWith subtract <*> tail $ sort as

main :: IO ()
main = do
  getLine >>= flip replicateM_ solve . read
  
```

:::

## Problem B - Gifts Fixing

### 题目描述

有$n$个盒子，每个盒子里有$a_i$个A，$b_i$个B，每次操作可以从任意盒子里去除一个A或一个B或一对A+B，问至少多少次操作，可以让所有盒子中的A和B数量都相等？

### 题解

所有盒子的A都要以最少的A为准，所有盒子的B都要以最少的B为准。对于某一个盒子，需要的总操作次数等于A的差量和B的差量中较大的那一个。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <vector>
#define INF 0x3f3f3f3f

using namespace std;
typedef long long ll;

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
  void solve() {
    int n;
    read(n);
    vector<int> a(n);
    vector<int> b(n);
    int la = INF, lb = INF;
    for (int i = 0; i < n; ++i)
      read(a[i]), la = min(la, a[i]);
    for (int i = 0; i < n; ++i)
      read(b[i]), lb = min(lb, b[i]);
    ll ans = 0;
    for (int i = 0; i < n; ++i)
      ans += max(a[i] - la, b[i] - lb);
    printf("%lld\n", ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

这题的FP相对来说是比较容易实现的。

:::details 参考代码（Haskell）

```haskell
import Control.Monad

solve :: IO ()
solve = do
  getLine
  as <- map read . words <$> getLine
  bs <- map read . words <$> getLine
  let moves = zip (subtract (minimum as) <$> as) (subtract (minimum bs) <$> bs)
  print $ sum $ (\(a, b) -> a + b - min a b) <$> moves

main :: IO ()
main = do
  getLine >>= flip replicateM_ solve . read
  
```

:::

## Problem C - Boats Competition

### 题目描述

将$n$（$n\leq50$）个体重分别为$w_i$（$w_i\leq n$）的人两两组队，要求每一组的体重总和相等，最多能分多少组？

### 题解

考虑到数据范围，直接枚举体重总和，然后计算每种体重总和下的最大配对数。当然，在枚举之前，首先要将体重数据有序化。这可以通过排序或哈希表两种方式来实现。

:::details 参考代码（C++）

```cpp
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
  void solve() {
    int n;
    read(n);
    vector<int> cnt(n + 1);
    for (int i = 0; i < n; ++i) {
      int a;
      read(a);
      cnt[a]++;
    }
    int ans = 0;
    for (int s = 2; s <= n * 2; ++s) {
      int tot = 0;
      for (int i = max(1, s - n); i * 2 <= s; ++i) {
        int j = s - i;
        if (j != i)
          tot += min(cnt[i], cnt[j]);
        else
          tot += cnt[i] / 2;
      }
      ans = max(ans, tot);
    }
    printf("%d\n", ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

FP就递归处理就好了。

:::details 参考代码（Haskell）

```haskell
import Control.Monad
import Data.List

teamsWithSum :: Int -> [Int] -> Int
teamsWithSum s ws = f ws (reverse ws) `div` 2
  where
    f (a : as) (b : bs)
      | a + b < s = f as (b : bs)
      | a + b == s = 1 + f as bs
      | otherwise = f (a : as) bs
    f _ _ = 0

solve :: IO ()
solve = do
  n <- read <$> getLine
  ws <- sort . map read . words <$> getLine
  print $ maximum [teamsWithSum s ws | s <- [2 .. 2 * n]]

main :: IO ()
main = do
  getLine >>= flip replicateM_ solve . read
  
```

:::

## Problem D - Binary String To Subsequences

### 题目描述

有一个二进制串，问最少要将其分成多少个子序列，才能保证每个子序列都为$0$-$1$交替的形式？

输出需要的子序列的个数，以及每个元素所属子序列的编号。

### 题解

记录下一个待使用的编号，以及当前结尾为$0$的子序列的编号和当前结尾为$1$的子序列的编号。对于每一个元素，如果没有能与其匹配的子序列，就要申请一个新的子序列；否则就将其进行匹配，并将对应的子序列移入另一组（$0$到$1$，$1$到$0$）。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <stack>
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
  void solve() {
    int n;
    read(n);
    string s;
    cin >> s;
    stack<int> a, b;
    vector<int> color(n);
    int idx = 1;
    for (int i = 0; i < n; ++i) {
      char c = s[i];
      if (c == '0') {
        if (a.empty()) {
          color[i] = idx++;
        } else {
          color[i] = a.top();
          a.pop();
        }
        b.push(color[i]);
      } else {
        if (b.empty()) {
          color[i] = idx++;
        } else {
          color[i] = b.top();
          b.pop();
        }
        a.push(color[i]);
      }
    }
    printf("%d\n", idx - 1);
    for (int i : color)
      printf("%d ", i);
    printf("\n");
  }
};

int main() {
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

FP通过递归进行处理。

:::details 参考代码（Haskell）

```haskell
import Control.Monad

rec :: Int -> [Int] -> [Int] -> [Bool] -> [Int]
rec next (z : zs) os (False : s) = z : rec next zs (z : os) s
rec next [] os (False : s) = next : rec (succ next) [] (next : os) s
rec next zs (o : os) (_ : s) = o : rec next (o : zs) os s
rec next zs [] (_ : s) = next : rec (succ next) (next : zs) [] s
rec _ _ _ _ = []

solve :: IO ()
solve = do
  getLine
  s <- map (== '1') <$> getLine
  let a = rec 1 [] [] s
  print $ maximum a
  putStrLn $ unwords $ map show a

main :: IO ()
main = do
  getLine >>= flip replicateM_ solve . read
```

:::

## Problem E1 - Weights Division (easy version)

### 题目描述

有一棵根为$1$的树，每条边有权重，每次操作可以把任意一条边的权重从$w_i$变为$\left\lfloor\frac{w_i}{2}\right\rfloor$，问最少多少次操作，可以让根节点到所有叶子节点的路径权重和不超过$S$？

### 题解

显然通过DFS可以计算出每一条边影响的叶子节点数量，从而可以计算对每一条边进行操作的回报（减少的总权重）。那么，自然想到基于优先队列的贪心方法，每次操作都选择回报最大的那条边进行，这样得到的结果一定是最优的。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;
typedef long long ll;

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

struct Node {
  ll reward;
  int w, n;
  bool operator<(const Node &other) const { return reward < other.reward; }
};

class Solution {
  vector<vector<pair<int, int>>> adj;
  vector<int> leaves;
  ll sum = 0;
  priority_queue<Node> pq;
  void dfs(int u, int p, ll c) {
    bool leaf = true;
    for (auto &[v, w] : adj[u]) {
      if (v == p)
        continue;
      leaf = false;
      dfs(v, u, c + w);
      pq.push(Node{(ll)(w - w / 2) * leaves[v], w, leaves[v]});
      leaves[u] += leaves[v];
    }
    if (leaf) {
      sum += c;
      leaves[u] = 1;
    }
  }

public:
  void solve() {
    int n;
    ll s;
    read(n), read(s);
    adj = vector<vector<pair<int, int>>>(n + 1);
    leaves = vector<int>(n + 1);
    for (int i = 1; i < n; ++i) {
      int u, v, w;
      read(u), read(v), read(w);
      adj[u].emplace_back(v, w);
      adj[v].emplace_back(u, w);
    }
    dfs(1, 0, 0);
    ll ans = 0;
    while (sum > s) {
      ans++;
      Node top = pq.top();
      pq.pop();
      sum -= top.reward;
      int w = top.w / 2;
      pq.push(Node{(ll)(w - w / 2) * top.n, w, top.n});
    }
    printf("%lld\n", ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

## Problem E2 - Weights Division (hard version)

### 题目描述

大致与简单版本相同，但每条边额外增加了成本属性，成本为$1$或$2$，要求最后使用的总成本最低。

### 题解

在简单版本解答的基础上，改为使用两个优先队列，分别储存成本为$1$和成本为$2$的边。

当有一个队列为空时，显然应该从另一队列中取边进行操作。

如果两个队列都非空，则需要进行比较。
- 情形一：使用一条成本为$1$的边就可以满足要求，此时显然应该选择这条边。
- 情形二：比较对成本为$1$的优先队列连续操作两次的回报，与对成本为$2$的优先队列操作一次的回报。如果前者大于后者，则对优先队列$1$进行**一次**操作；否则对优先队列$2$进行一次操作。要注意，这里不能对优先队列$1$连续进行两次操作，因为第二和第三次操作的总回报可能小于对优先队列$2$操作一次的回报。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;
typedef long long ll;

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

struct Edge {
  int to, w, c;
};

struct Node {
  ll reward;
  int w, n;
  bool operator<(const Node &other) const { return reward < other.reward; }
};

class Solution {
  vector<vector<Edge>> adj;
  vector<int> leaves;
  ll sum = 0;
  priority_queue<Node> pqa, pqb;
  void dfs(int u, int p, ll c) {
    bool leaf = true;
    for (auto &[v, w, t] : adj[u]) {
      if (v == p)
        continue;
      leaf = false;
      dfs(v, u, c + w);
      Node node{(ll)(w - w / 2) * leaves[v], w, leaves[v]};
      if (t == 1)
        pqa.push(node);
      else
        pqb.push(node);
      leaves[u] += leaves[v];
    }
    if (leaf) {
      sum += c;
      leaves[u] = 1;
    }
  }

public:
  void solve() {
    int n;
    ll s;
    read(n), read(s);
    adj = vector<vector<Edge>>(n + 1);
    leaves = vector<int>(n + 1);
    for (int i = 1; i < n; ++i) {
      int u, v, w, c;
      read(u), read(v), read(w), read(c);
      adj[u].push_back(Edge{v, w, c});
      adj[v].push_back(Edge{u, w, c});
    }
    dfs(1, 0, 0);
    ll ans = 0;
    while (sum > s) {
      if (pqa.empty()) {
        ans += 2;
        Node top = pqb.top();
        pqb.pop();
        sum -= top.reward;
        int w = top.w / 2;
        pqb.push(Node{(ll)(w - w / 2) * top.n, w, top.n});
      } else if (pqb.empty()) {
        ans++;
        Node top = pqa.top();
        pqa.pop();
        sum -= top.reward;
        int w = top.w / 2;
        pqa.push(Node{(ll)(w - w / 2) * top.n, w, top.n});
      } else {
        Node ta = pqa.top();
        pqa.pop();
        if (sum - ta.reward <= s) {
          ans++;
          break;
        }
        ll am = ta.reward, am1 = 0;
        int w = ta.w / 2;
        am += (ll)(w - w / 2) * ta.n;
        if (!pqa.empty())
          am1 = ta.reward + pqa.top().reward;
        ll bm = pqb.top().reward;
        if (max(am, am1) <= bm) {
          ans += 2;
          Node top = pqb.top();
          pqb.pop();
          sum -= top.reward;
          int wb = top.w / 2;
          pqb.push(Node{(ll)(wb - wb / 2) * top.n, wb, top.n});
          pqa.push(ta);
        } else {
          ans++;
          sum -= ta.reward;
          pqa.push({(ll)(w - w / 2) * ta.n, w, ta.n});
        }
      }
    }
    printf("%lld\n", ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

## Problem F - Yet Another Segments Subset

### 题目描述

有$n$（$n\leq3000$）个区间$[l_i,r_i]$，要求从中选出尽可能多的区间，使得选出的区间中任意两个均相离或相含，问最多能选出多少个区间。

### 题解

从最大独立集（最大团）的角度考虑，这是个NP问题，但如果我们利用区间的性质，是可以在多项式时间解决本题的。

从数据范围看，$O(n^2)$的算法就可以接受，因此考虑进行区间DP。

第一步当然是离散化，离散化之后，区间端点的范围为$[0,6000)$。

DP的顺序自然是从短的区间到长的区间，因为长的可以覆盖短的。接下来的问题是如何进行转移。

对于当前区间$[L,R]$：

- 如果存在一个对应的区间，显然应该将其选中
- 如果不使用从$L$开始的区间，那么最优的显然是$[L+1,R]$
- 如果使用从$L$开始的区间，那么我们需要枚举所有从$L$开始且右端点小于$R$的区间，假设当前枚举到的区间为$[L,R']$，我们能够得到的额外区间数就是$[L,R']+[R'+1,R]$

最后的结果就是$[0,M-1]$（$M$是离散化后点的总数）。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <map>
#include <set>
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
  void solve() {
    int n;
    read(n);
    vector<int> l(n), r(n);
    set<int> s;
    for (int i = 0; i < n; ++i)
      read(l[i]), read(r[i]), s.insert(l[i]), s.insert(r[i]);
    int m = s.size();
    map<int, int> d;
    int idx = 0;
    for (int i : s)
      d[i] = idx++;
    for (int i = 0; i < n; ++i)
      l[i] = d[l[i]], r[i] = d[r[i]];
    vector<vector<int>> dp(m, vector<int>(m));
    vector<vector<bool>> exist(m, vector<bool>(m));
    vector<vector<int>> lr(m);
    for (int i = 0; i < n; ++i)
      lr[l[i]].emplace_back(r[i]), exist[l[i]][r[i]] = true;
    for (int i = 0; i < m; ++i)
      sort(lr[i].begin(), lr[i].end());
    for (int k = 0; k < m; ++k)
      for (int i = 0; i + k < m; ++i) {
        int j = i + k;
        if (exist[i][j])
          dp[i][j] = 1;
        int extra = 0;
        if (i < j)
          extra = dp[i + 1][j];
        for (int rr : lr[i]) {
          if (rr >= j)
            break;
          extra = max(extra, dp[i][rr] + dp[rr + 1][j]);
        }
        dp[i][j] += extra;
      }
    printf("%d\n", dp[0][m - 1]);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::
