# Codeforces Round 669 (CF1407)

## Problem A - [Ahahahahahahahaha](https://codeforces.com/contest/1407/problem/A)

### 题目描述

长度为$N$（$N$为偶数）的$01$串，要求删去至多$N/2$个数，使得剩下的数满足交错和$a_1-a_2+a_3\dots=0$。

### 题解

因为至多删去$N/2$个数，所以我们总可以删除$0$和$1$中出现次数较少的那一种。出现次数相同时我们选择留下$0$，因为$0$的交错和总为$0$。

但要特别注意，如果留下的是$1$，需要检查一下总个数是否为偶数，如果不是，还需要进行调整。

时间复杂度$O(N)$。

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

### 题目描述

要求将数组$a_i$重新排序，使得$c_i=GCD(a_1,\dots,a_i)$所构成的序列字典序最大。

### 题解

每次贪心地从剩下元素中找出能使得其与当前最大公约数的最大公约数最大的元素即可。如果存在多个，选择其中任何一个都行，因为剩下几个在接下来的轮次里也一定会被选到。

时间复杂度$O(N^2\log A)$，其中$A$是数组中的最大元素。

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

### 题目描述

交互题。给定$1$到$N$的一个排列$p$，每次可以询问两个位置$i$和$j$，系统会告诉你$p_i\mod p_j$。要求用不超过$2n$次询问确定$p$。

### 题解

考虑任意两个不相等的数$a<b$，则必有$b\mod a<a=a\mod b$。也就是说，两个数正反各询问一次，就可以确定较小那个数的值。

所以我们从$1$和$2$开始，每次确定小的数，保留大的数的位次，继续向后询问。经过$2(n-1)$次询问后，我们可以确定所有小于$n$的数，那么此时的最大位次对应的数即为$n$。

时间复杂度$O(N)$。

:::details 参考代码（C++）

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

### 题目描述

给定一系列高度$h_i$，规定可以从$i$移动到$j$（$i<j$），当且仅当满足下列条件中的一种：

- $i+1=j$
- $\min(h_i,h_j)>\max_{k=i+1}^{j-1} h_k$
- $\max(h_i,h_j)<\min_{k=i+1}^{j-1} h_k$

求从$1$到$N$的最少移动次数。

### 题解

不难发现，合法的移动只有：

- $h_j$是$h_i$右边第一个不小于$h_i$的
- $h_j$是$h_i$右边第一个不大于$h_i$的
- $h_i$是$h_j$左边第一个不小于$h_j$的
- $h_i$是$h_j$左边第一个不大于$h_j$的

注意$i+1=j$一定包含在上面的情况中，不需要单独讨论。

因此跑四次单调栈获取上述信息后，进行BFS即可。

时间复杂度$O(N)$。

:::details 参考代码（C++）

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

### 题目描述

有一个$N$个节点$M$条边的有向图。每条边有黑白两种颜色（黑色为$0$，白色为$1$）。现在要给每个节点染色，染色之后所有不同颜色的出边都失效。找出一种染色方案，使得$1$到$N$不连通，或最短距离尽可能大。

### 题解

逆向思考，贪心染色。

所有边$(u,v,t)$都存在$v$处。从$N$开始进行BFS。对于当前访问到的节点$v$，考虑边$(u,v,t)$。如果当前$u$已经被设为颜色$t$，则不可能阻断这条边，将$u$入队；否则，将$u$设为$t$的相反颜色，从而阻断这条边。这样的染色方法一定是最优的，因为后访问到的节点对应更长的距离，所以一定应该优先解决先访问到的节点。

如果最后无法访问到$1$，则说明存在使得$1$到$N$不连通的染色方案；否则到$1$的距离即为所要求的最大最短距离。染色方案在BFS过程中已经确定。没有访问到的点可以染成任意一种颜色。

:::details 参考代码（C++）

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
