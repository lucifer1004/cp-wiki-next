# Google Kick Start 2020 Round D

[Problems](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff08)

## Problem A - Record Breaker

Implementation. Keep a record of the current maximum. Compare the current value to it, and also to the next number.

Time complexity is $O(N)$.

:::details Code

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
  void solve(int case_num) {
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    int ans = 0, hi = -1;
    for (int i = 0; i < n; ++i) {
      if (a[i] > hi && (i == n - 1 || a[i] > a[i + 1]))
        ans++;
      hi = max(hi, a[i]);
    }
    printf("Case #%d: %d\n", case_num, ans);
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

## Problem B - Alien Piano

Simple DP. Enumerate all choices of the last step and the current step.

Time complexity is $O(P^2K)$, where $P=4$ in this problem.

:::details Code

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
  void solve(int case_num) {
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    vector<vector<int>> dp(n, vector<int>(4, n));
    for (int k = 0; k < 4; ++k)
      dp[0][k] = 0;
    for (int i = 1; i < n; ++i) {
      for (int last = 0; last < 4; ++last)
        for (int now = 0; now < 4; ++now) {
          if (now == last) {
            if (a[i] == a[i - 1])
              dp[i][now] = min(dp[i][now], dp[i - 1][last]);
            else
              dp[i][now] = min(dp[i][now], dp[i - 1][last] + 1);
          } else if (now > last) {
            if (a[i] > a[i - 1])
              dp[i][now] = min(dp[i][now], dp[i - 1][last]);
            else
              dp[i][now] = min(dp[i][now], dp[i - 1][last] + 1);
          } else {
            if (a[i] < a[i - 1])
              dp[i][now] = min(dp[i][now], dp[i - 1][last]);
            else
              dp[i][now] = min(dp[i][now], dp[i - 1][last] + 1);
          }
        }
    }
    int ans = n;
    for (int k = 0; k < 4; ++k)
      ans = min(ans, dp[n - 1][k]);
    printf("Case #%d: %d\n", case_num, ans);
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

## Problem C - Beauty of Tree

Inclusion-exclusion, DFS.

We need to find, for every node, the number of descendants has a distance that can be divided by $A$, and similar for $B$. This can be done during DFS if we keep a record of the current path.

After having $ca[i]$ and $cb[i]$, we can simply calculate how many times the current node will be counted, via inclusion-exclusion:

$$t[i]=(ca[i]+cb[i])\cdot N-ca[i]\cdot cb[i]$$

Then we add up all the results and divide it by $N^2$.

The total time complexity is $O(N)$.

:::details Code

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
  int n, a, b;
  vector<vector<int>> adj;
  vector<int> pa, pb, ac, bc;
  void dfs(int u, vector<int> &path) {
    int l = path.size();
    if (l >= a)
      pa[u] = path[l - a];
    if (l >= b)
      pb[u] = path[l - b];
    path.emplace_back(u);
    ac[u] = 1, bc[u] = 1;
    for (int v : adj[u])
      dfs(v, path);
    path.pop_back();
    if (pa[u] > 0)
      ac[pa[u]] += ac[u];
    if (pb[u] > 0)
      bc[pb[u]] += bc[u];
  }

public:
  void solve(int case_num) {
    read(n), read(a), read(b);
    adj = vector<vector<int>>(n + 1);
    for (int i = 2; i <= n; ++i) {
      int v;
      read(v);
      adj[v].emplace_back(i);
    }
    pa = vector<int>(n + 1);
    pb = vector<int>(n + 1);
    ac = vector<int>(n + 1);
    bc = vector<int>(n + 1);
    vector<int> path;
    dfs(1, path);
    double ans = 0;
    for (int i = 1; i <= n; ++i) {
      ans += (double)(ac[i] + bc[i]) * n;
      ans -= (double)ac[i] * bc[i];
    }
    printf("Case #%d: %.12f\n", case_num, ans / n / n);
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

## Problem D - Locked Doors

I used a rather complicated algorithm leveraging monotonic stack, sparse table and binary search.

For each door, calculate the first door to its left having higher difficulty, and the first door to its right having higher difficulty. For simplicity, a door with infinite difficulty is added at either end. This part is done by monotonic stack in $O(N)$.

Then construct a sparse table for range maximum query in $O(N\log N)$.

In each query, on the $K_i$-th day, there will be $K_i-1$ opened doors. Some are to the left of the $S_i$-th room, while some are to the right. If there are $l$ opened doors to the left on the $K_i$-th day, there needs to be at least $f(l)$ opened doors to the right, so that the highest difficulty among the $f(l)$ doors to the right is higher than the highest difficulty among the $l$ doors to the left. An observation is that $l+f(l)$ is monotonic. So the suitable $l$ can be found via binary search.

The last step is to determine whether we should use the leftmost room or the rightmost room. This can be done by comparing the highest difficulty of the doors to the left and those to the right. If the highest difficulty is to the left, then on the $K_i$-th day we must be in the leftmost room, otherwise rightmost.

The total time complexity is $O((N+Q)\log N)$.

:::details Code

```cpp
#include <cmath>
#include <cstdio>
#include <iostream>
#include <stack>
#include <vector>
#define INF 0x3f3f3f3f;
#define K 18

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
    int n, q;
    read(n), read(q);
    vector<int> a(n + 1);
    for (int i = 1; i <= n - 1; ++i)
      read(a[i]);
    a[0] = INF;
    a[n] = INF;
    printf("Case #%d: ", case_num);
    vector<int> lf(n + 1, -1), rf(n + 1, n + 1);
    vector<vector<int>> sparse(n + 1, vector<int>(K));
    for (int i = 0; i <= n; ++i)
      sparse[i][0] = i;
    for (int k = 1; k < K; ++k) {
      for (int i = 0; i <= n; ++i) {
        sparse[i][k] = sparse[i][k - 1];
        int right = i + (1 << (k - 1));
        if (right <= n && a[sparse[right][k - 1]] > a[sparse[i][k]])
          sparse[i][k] = sparse[right][k - 1];
      }
    }
    auto query_sparse = [&](int l, int r) {
      if (l == r)
        return l;
      int len = r - l + 1;
      int half = trunc(log2(len - 1));
      int ans = sparse[l][half];
      if (a[sparse[r - (1 << half) + 1][half]] > a[ans])
        ans = sparse[r - (1 << half) + 1][half];
      return ans;
    };
    stack<int> st;
    for (int i = 0; i <= n; ++i) {
      while (!st.empty() && a[st.top()] < a[i]) {
        rf[st.top()] = i;
        st.pop();
      }
      st.push(i);
    }
    st = stack<int>();
    for (int i = n; i >= 0; --i) {
      while (!st.empty() && a[st.top()] < a[i]) {
        lf[st.top()] = i;
        st.pop();
      }
      st.push(i);
    }
    while (q--) {
      int s, k;
      read(s), read(k);

      auto output = [&](int ans) { printf("%d ", ans); };

      if (rf[s - 1] - (s - 1) > k - 1) {
        int ans = s + k - 1;
        if (ans > n)
          ans = n - k + 1;
        output(ans);
        continue;
      }
      if (s - lf[s] > k - 1) {
        int ans = s - k + 1;
        if (ans < 1)
          ans = k;
        output(ans);
        continue;
      }
      int l = 1, r = min(k - 2, s);
      while (l <= r) {
        int mid = (l + r) >> 1;
        int ma = query_sparse(s - mid, s - 1);
        int right = rf[ma];
        int tot = right - (s - mid);
        if (tot > k - 1)
          r = mid - 1;
        else
          l = mid + 1;
      }
      int lmost = s - r;
      int rmost = s - r + k - 2;
      int ans;
      if (rmost > n)
        ans = n - k + 1;
      else {
        int hi = query_sparse(lmost, rmost);
        if (hi >= s)
          ans = rmost + 1;
        else
          ans = lmost;
      }
      output(ans);
    }
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

And here is [Heltion](https://codeforces.com/profile/Heltion)'s Cartesian tree solution.

:::details Code

```cpp
#include <bits/stdc++.h>
using namespace std;
using LL = long long;
constexpr int maxn = 240000;
int D[maxn], S[maxn], L[maxn], R[maxn], H[maxn];
int RL[maxn], RR[maxn];
int SZ[maxn], F[maxn][20];
void DFS(int u) {
  SZ[u] = u & 1;
  if (u & 1)
    RL[u] = RR[u] = (u + 1) / 2;
  for (int i = 1; i < 20; i += 1)
    F[u][i] = F[F[u][i - 1]][i - 1];
  if (~L[u]) {
    F[L[u]][0] = u;
    DFS(L[u]);
    SZ[u] += SZ[L[u]];
    RL[u] = RL[L[u]];
  }
  if (~R[u]) {
    F[R[u]][0] = u;
    DFS(R[u]);
    SZ[u] += SZ[R[u]];
    RR[u] = RR[R[u]];
  }
}
void work() {
  int N, Q;
  cin >> N >> Q;
  for (int i = 1; i < N; i += 1)
    cin >> D[i];
  for (int i = 1; i < 2 * N; i += 1) {
    L[i] = R[i] = -1;
    if (i & 1)
      H[i] = 0;
    else
      H[i] = D[i / 2];
  }
  for (int i = 1, top = 0; i < 2 * N; i += 1) {
    int k = top;
    while (k and H[S[k]] < H[i])
      k -= 1;
    if (k)
      R[S[k]] = i;
    if (k < top)
      L[i] = S[k + 1];
    S[k += 1] = i;
    top = k;
  }
  int root = max_element(H + 1, H + 2 * N) - H;
  F[root][0] = 0;
  DFS(root);
  SZ[0] = INT_MAX;
  for (int i = 0, S, K, X; i < Q; i += 1) {
    cin >> S >> K;
    if (K == 1)
      cout << S << " ";
    else {
      X = S * 2 - 1;
      for (int j = 19; ~j; j -= 1)
        if (SZ[F[X][j]] < K)
          X = F[X][j];
      int L = RL[X], R = RR[X];
      if (L == 1)
        cout << K;
      else if (R == N)
        cout << N - K + 1;
      else if (D[L - 1] > D[R])
        cout << L + K - 1;
      else
        cout << R - K + 1;
      cout << " ";
    }
  }
  cout << "\n";
}
int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
  cout.tie(nullptr);
  int T;
  cin >> T;
  for (int t = 1; t <= T; t += 1) {
    cout << "Case #" << t << ": ";
    work();
  }
  return 0;
}
```

:::
