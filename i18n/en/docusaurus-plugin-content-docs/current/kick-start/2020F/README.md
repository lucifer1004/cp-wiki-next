# Google Kick Start 2020 Round F Tutorial

## Problem A - [ATM Queue](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff48/00000000003f4ed8)

It takes a person $\left\lceil\frac{A_i}{X}\right\rceil$ rounds to withdraw $A_i$. So we can turn $A_i$ into pairs $(\left\lceil\frac{A_i}{X}\right\rceil, i)$, then sort the pairs to get the final sequence.

Total time complexity is $O(N\log N)$ since we need to sort.

:::details Code (C++)

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

First we need to sort all the time segments. Since there are no overlaps, we then handle them one by one. During the process, we keep record of the right endpoint of the last coverage, $R$.

For each segment, if it can be covered by the last coverage, we do nothing. Otherwise, we will need to cover a length of $r_i-\max(l_i,R)$, which requires $\left\lceil\frac{r_i-\max(l_i,R)}{K}\right\rceil$ robots. After adding those robots, we update $R$ with $\max(l_i, R)+K\cdot\left\lceil\frac{r_i-\max(l_i,R)}{K}\right\rceil$.

Total time complexity is $O(N\log N)$ since we need to sort.

:::details Code (C++)

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

The museum can be easily represented by a graph with $S^2$ nodes, and each node has at most $3$ edges.

The hardest point is how to represent the current state of the museum. Since there are at most $6^2=36$ rooms, a $64$-bit integer is just enough. We can use the last $40$ bits for rooms, $[41,50]$ for person $B$ (who moves second), and $[51,60]$ for person $A$ (who moves first). A room bit is set if it is under construction or it has been painted in previous steps.

Then we can do DFS.

There are in total three cases for each step:

- $A$ can move to a room. From all choices, we need to choose the one that minimizes the points (since the role of $A$ and $B$ are swapped).   
- $A$ cannot move while $B$ can move. We just swap $A$ and $B$ and continue.
- Neither $A$ nor $B$ can move. This is a boundary condition. The value is $0$.

Of course, we will use memoization to avoid duplicate calculation.

The theoretical time complexity is $O(2^{S^2})$ which is huge, but as in many other DFS problems, many conditions are automatically pruned, and this solution is enough to pass all test cases.

:::details Code (C++)

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

An intuition is that we should not reroll dices unless current situation is already invalid.

Similar to Problem C, the hardest point is how to represent a state, and how to validate it.

Here, prefix sum can be a good choice. We use $S[i]$ to represent the number of colors (I change "numbers" to "colors" just for narrative convenience) that have occured no more than $i$ times.

For example, if the target state is $[1,2,2,3]$ (which implies that $N=8$) and $M=6$, the target prefix sum can be represented as $[2,3,5,6]$ (the array is truncated at $i=3$ since the largest frequency is $3$). And the original prefix sum is $[6,6,6,6]$. For any valid state, all elements in the prefix sum array should be larger than or equal to the corresponding element in the target prefix sum array, because numbers in the prefix sum array can only decrease.

During each transition, we enumerate all current states. For each state $(S, p, e)$ where $S$ is the prefix sum, $p$ is its probability and $e$ is the expected value of rolling times, we first find all valid updates. An update $(i_k, c_k)$ is valid, only if there is at least one color occuring $i_k$ times (which means $c_k=S[i_k]-S[i_k-1]>0$) and $S[i_k]>target[i_k]$. We can then count the number of good colors $g$. We are expected to roll $\frac{M}{g}$ times to get a good color. This update is stored as $(S',p\cdot\frac{c_k}{g},e+\frac{M}{g})$.

We then apply all updates. For a new state $S'$, its probability is the sum of all updates targeted at it, while its expected value is the weighted sum of all updates targeted at it.

The time complexity is hard to estimate. But since the partition number of $50$ is $\sim10^6$, there will not be too many states at each step. So this solution can pass all the test cases.
 
:::details Code (C++)

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
