# Codeforces Round 669 (CF1407)

## Problem A - [Ahahahahahahahaha](https://codeforces.com/contest/1407/problem/A)

Since we can delete at most $N/2$ numbers, we can always choose to delete the one that occurs less. If $0$ and $1$ occur the same times, we choose to keep $0$ and delete $1$.

Note that if we choose to keep $1$, we need to check the parity and make a correction if needed.

Time complexity is $O(N)$.

:::details Code (C++)

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
    vector<int> a(n);
    int z = 0;
    for (int i = 0; i < n; ++i)
      read(a[i]), z += (a[i] == 0);
    int k = z, d = 0;
    if (z < n - z) {
      d = 1;
      k = n - z;
      if (k % 2 == 1)
        k--;
    }
    printf("%d\n", k);
    vector<int> ans(k, d);
    for (int i : ans)
      printf("%d ", i);
    printf("\n");
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

## Problem B - [Big Vova](https://codeforces.com/contest/1407/problem/B)

We can greedily take the element which makes the $GCD$ of it and current $GCD_t$ largest. If there are many, we can choose any of them, because the rest will be taken in the following rounds.

Time complexity is $O(N^2\log A)$, in which $A$ is the largest number in the array.

:::details Code (C++)

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

int gcd(int x, int y) { return y == 0 ? x : gcd(y, x % y); }

class Solution {
public:
  void solve() {
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    vector<bool> vis(n);
    vector<int> ans(n);
    int g = 0;
    for (int i = 0; i < n; ++i) {
      int hi = -1, hidx = -1;
      for (int j = 0; j < n; ++j) {
        if (vis[j])
          continue;
        int gj = gcd(g, a[j]);
        if (gj > hi) {
          hi = gj;
          hidx = j;
        }
      }
      ans[i] = a[hidx];
      vis[hidx] = true;
      g = hi;
    }
    for (int i : ans)
      printf("%d ", i);
    printf("\n");
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

## Problem C - [Chocolate Bunny](https://codeforces.com/contest/1407/problem/C)

Consider any $a<b$, we have $b\mod a<a=a\mod b$. That is to say, if we query $(i,j)$ and then $j_i$, we can determine the smaller one of $p_i$ and $p_j$, since $p$ is a permutation and there are no equal elements.

So we start from $p_1$ and $p_2$. Each time, we make two queries, determine the smaller one and keep the index of the larger one and continue queries. After $2(n-1)$ queries, we can determine all $p_i<n$，and the current kept index $p_k=n$.

Time complexity is $O(N)$.

:::details Code (C++)

```cpp
#include <iostream>
#include <vector>

using namespace std;

class Solution {
  vector<int> ans;
  vector<vector<pair<int, int>>> adj;

  int query(int i, int j) {
    int k;
    cout << "? " << i << " " << j << endl;
    cin >> k;
    return k;
  }

public:
  void solve() {
    int n;
    cin >> n;
    if (n == 1) {
      cout << "! 1" << endl;
      return;
    }
    ans = vector<int>(n + 1);
    int a = query(1, 2), b = query(2, 1);
    int m;
    if (a > b) {
      m = 2;
      ans[1] = a;
    } else {
      m = 1;
      ans[2] = b;
    }
    for (int i = 3; i <= n; ++i) {
      int a = query(m, i), b = query(i, m);
      if (a > b) {
        ans[m] = a;
        m = i;
      } else {
        ans[i] = b;
      }
    }
    ans[m] = n;
    cout << "! ";
    for (int i = 1; i <= n; ++i)
      cout << ans[i] << " ";
    cout << endl;
  }
};

int main() {
  Solution solution = Solution();
  solution.solve();
}
```

:::

## Problem D - [Discrete Centrifugal Jumps](https://codeforces.com/contest/1407/problem/D)

Valid moves can only be in one of the following situations:

- $h_j$ is the first non smaller than $h_i$ to its right
- $h_j$ is the first non greater than $h_i$ to its right
- $h_i$ is the first non smaller than $h_j$ to its left
- $h_i$ is the first non greater than $h_j$ to its left

Note that $i+1=j$ must have been included in the situations.

We can use monotonic stack to gather the information. After that, we just do a BFS.

Time complexity is $O(N)$.

:::details Code (C++)

```cpp
#include <cstdio>
#include <iostream>
#include <queue>
#include <set>
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
  vector<set<int>> adj;

public:
  void solve() {
    int n;
    read(n);
    vector<int> h(n);
    for (int i = 0; i < n; ++i)
      read(h[i]);
    adj = vector<set<int>>(n);
    stack<int> st;
    for (int i = 0; i < n; ++i) {
      while (!st.empty() && h[i] <= h[st.top()]) {
        adj[st.top()].insert(i);
        st.pop();
      }
      st.push(i);
    }
    while (!st.empty())
      st.pop();
    for (int i = 0; i < n; ++i) {
      while (!st.empty() && h[i] >= h[st.top()]) {
        adj[st.top()].insert(i);
        st.pop();
      }
      st.push(i);
    }
    while (!st.empty())
      st.pop();
    for (int i = n - 1; i >= 0; --i) {
      while (!st.empty() && h[i] <= h[st.top()]) {
        adj[i].insert(st.top());
        st.pop();
      }
      st.push(i);
    }
    while (!st.empty())
      st.pop();
    for (int i = n - 1; i >= 0; --i) {
      while (!st.empty() && h[i] >= h[st.top()]) {
        adj[i].insert(st.top());
        st.pop();
      }
      st.push(i);
    }
    queue<int> q;
    q.push(0);
    vector<int> dist(n, -1);
    dist[0] = 0;
    while (!q.empty()) {
      int u = q.front();
      q.pop();
      if (u == n - 1) {
        printf("%d", dist[u]);
        return;
      }
      for (int v : adj[u]) {
        if (dist[v] == -1) {
          dist[v] = dist[u] + 1;
          q.push(v);
        }
      }
    }
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  Solution solution = Solution();
  solution.solve();
}
```

:::

## Problem E - [Egor in the Republic of Dagestan](https://codeforces.com/contest/1407/problem/E)

Think reversely and color greedily.

All edges $(u,v,t)$ are stored at $v$ side. We start BFS from $N$. Considering node $v$ and edge $(u,v,t)$. If $u$ has been colored to $t$, then this edge cannot be cut and we need to enqueue $u$. Otherwise we set $u$ to the opposite color of $t$ to cut this edge. This coloring strategy is optimal because a node visited earlier corresponds to a shorter distance to $N$.

If after the BFS we have not visited $1$, then it is possible to make $1$ and $N$ not connected. Otherwise $dist[1]$ is just the maximal shortest path distance we are required to find. The coloring has been determined during BFS. For those uncolored nodes, either color is OK.

Time complexity is $O(N+M)$.

:::details Code (C++)

```cpp
#include <cstdio>
#include <iostream>
#include <queue>
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
    int n, m;
    read(n), read(m);
    vector<vector<pair<int, int>>> in(n + 1);
    for (int i = 0; i < m; ++i) {
      int u, v, t;
      read(u), read(v), read(t);
      if (u == v)
        continue;
      t++;
      in[v].emplace_back(u, t);
    }

    queue<pair<int, int>> q;
    q.emplace(n, 0);
    vector<int> close(n + 1);
    vector<int> dist(n + 1);
    vector<bool> vis(n + 1);
    vis[n] = true;
    while (!q.empty()) {
      auto [v, d] = q.front();
      dist[v] = d;
      q.pop();
      for (auto [u, t] : in[v]) {
        if (vis[u])
          continue;
        if ((t == 1 && close[u] == 2) || (t == 2 && close[u] == 1)) {
          vis[u] = true;
          q.emplace(u, d + 1);
        } else
          close[u] = t;
      }
    }
    if (!vis[1])
      printf("-1\n");
    else
      printf("%d\n", dist[1]);
    for (int i = 1; i <= n; ++i)
      printf("%d", min(1, 2 - close[i]));
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  Solution solution = Solution();
  solution.solve();
}
```

:::
