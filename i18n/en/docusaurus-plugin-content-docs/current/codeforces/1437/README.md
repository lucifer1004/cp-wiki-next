# Educational Codeforces Round 97 (CF1437)

## Problem A - [Marketing Scheme](https://codeforces.com/contest/1437/problem/A)

:::details Hint
What will happen if $r\geq2l$?
:::

:::details Solution
Suppose that $r\geq2l$, then at least we need to cover $[l,2l]$. Obviously, we must have $a>l$, since the length of the segment is already longer than $l$. Now if $l<a\leq2l$, there are at most $l$ modules of $a$ which are no less than $\frac{a}{2}$, which cannot cover the segment whose length is $l+1$. But if $a>2l$, then $l$ cannot be a good value.

On the contrary, if $r<2l$, we can always choose $a=2l$ which will be a valid answer.

So this problem can be simplified to judging whether $r<2l$ holds.

Time complexity is $O(1)$.
:::

:::details Code (Python 3)

```python
def read_int():
    return int(input())


def read_ints():
    return map(int, input().split(' '))


t = read_int()
for case_num in range(t):
    l, r = read_ints()
    print('YES' if l * 2 > r else 'NO')
```

:::

## Problem B - [Reverse Binary Strings](https://codeforces.com/contest/1437/problem/B)

:::details Hint
How many $00$ or $11$ pairs can be reduced within one reverse?
:::

:::details Solution
We can reduce the number of $00$ or $11$ pairs by at most $2$ within one reverse. So we can simply count the total number of such pairs, and get the answer.

Time complexity is $O(N)$.
:::

:::details Code (Python 3)

```python
def read_int():
    return int(input())


def read_ints():
    return map(int, input().split(' '))


t = read_int()
for case_num in range(t):
    n = read_int()
    s = input()
    tot = 0
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            tot += 1
    print((tot + 1) // 2)
```

:::

## Problem C - [Chef Monocarp](https://codeforces.com/contest/1437/problem/C)

:::details Hint

1. We will never use numbers larger than $2n$.
2. The original sequence of the array does not matter.

:::

:::details Solution
We will never put out an oven at $t>2n$, because $a[i]\leq n$, so even if we put out the first oven at $t=n$, we can put out the last oven at $t=2n-1$. Thus in any case that we put out an oven at $t>2n$, we can always reduce the total unpleasant values by replacing it with a smaller timestamp. Actually, the upper limit can be further squeezed, but $2n$ is fine enough.

We can sort the array first, then do simple dynamic programming, with $dp[t]$ meaning the total unpleasant values if the last oven is put out at $t$.

Since time is monotonic, when we consider the next oven, we can only transit from smaller timestamps. For the $i$-th oven, we will update $dp[t]$ with $\min_{t'<t}(dp[t'])+|t-a[i]|$. In order to save time, we can maintain a prefix minimum $lo$ during the iteration.

Total time complexity is $O(N^2)$, which is enough to pass the time limit.
:::

:::details Code (Python 3)

```python
def read_int():
    return int(input())


def read_ints():
    return map(int, input().split(' '))


inf = int(1e9)
t = read_int()
for case_num in range(t):
    n = read_int()
    a = list(read_ints())
    a.sort()
    dp = [0 for _ in range(n * 2 + 1)]
    for t in a:
        ndp = [inf for _ in range(n * 2 + 1)]
        lo = inf
        for i in range(n * 2):
            lo = min(lo, dp[i])
            ndp[i + 1] = min(ndp[i + 1], lo + abs(i + 1 - t))
        dp = ndp
    print(min(dp))
```

:::

## Problem D - [Minimal Height Tree](https://codeforces.com/contest/1437/problem/D)

:::details Hint
Just go greedy.
:::

:::details Solution
We can arrange the nodes greedily. Unless the current number is smaller than the last one, we will keep connecting the numbers to the current parent node. Otherwise, we will move to the next parent node (which might be at the next level).

Time complexity is $O(N)$.
:::

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
    int height = 0;
    vector<int> level = {1};
    int col = 0, first, last = 0;
    read(first);
    for (int i = 0; i < n - 1; ++i) {
      int u;
      read(u);
      if (u < last) {
        col++;
        if (col == level[height]) {
          height++;
          col = 0;
        }
      }
      if (level.size() <= height + 1)
        level.emplace_back(0);
      level[height + 1]++;
      last = u;
    }
    printf("%d\n", (int)level.size() - 1);
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

## Problem E - [Make It Increasing](https://codeforces.com/contest/1437/problem/E)

:::details Hint

1. We can add two sentinel elements at either end of $a$ and $b$. Then the original problem will be split into several subtasks.
2. For each subtask, we actually need to find the longest increasing subsequence.

:::

:::details Solution
The first step is to split the original problem into subtasks. Each subtask has four parameters, $l$ and $r$ for the start and the end of the interval, and $lo$ and $hi$ for the minimum valid value of the left end, and the maximum valid value of the right end.

Then for each subtask, we have three situations:

- $l>r$, which means the interval is empty. The answer is $0$.
- $l=r$, which means the length of the interval is $1$. The answer depends on whether $a[l]$ fits in $[lo,hi]$.
- $l<r$. In this case, we need to find the longest increasing subsequence. However, there are two differences compared to the classical LIS problem. One is that, if the current number does not fit in its valid range (which can be calculated using $lo$, $hi$, and $i$), it cannot be used in the LIS. The other difference is that we cannot use $a[i]$ directly. Considering the following case, $[2,5,3,1]$. Can we make an LIS with $[2,3]$? In this problem, we cannot, because there will be no room for the middle elements. How can we take the distance into consideration? We can use $a[i]-i$ instead of $a[i]$, and now we will find the longest non-decreasing subsequence instead of the longest increasing subsequence.

The algorithm for LIS is a classical DP enhanced with binary search, which takes $O(L\log L)$ time for an interval of length $L$.

So we have the total time complexity of $O(N\log N)$.
:::

:::details Code (C++)

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>
#define INF 0x3f3f3f3f

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
    int n, k;
    read(n), read(k);
    vector<int> a(n + 2), b(k + 2);
    a[0] = -INF, a[n + 1] = INF;
    b[0] = 0, b[k + 1] = n + 1;
    for (int i = 1; i <= n; ++i)
      read(a[i]);
    for (int i = 1; i <= k; ++i) {
      read(b[i]);
      if (a[b[i]] - a[b[i - 1]] < b[i] - b[i - 1]) {
        printf("-1");
        return;
      }
    }
    int ans = 0;
    auto handle = [&](int l, int r, int lo, int hi) {
      if (l > r)
        return 0;
      if (l == r)
        return (a[l] >= lo && a[l] <= hi) ? 0 : 1;
      vector<int> LIS;
      for (int i = l; i <= r; ++i) {
        int clo = lo + i - l, chi = hi - r + i;
        if (a[i] < clo || a[i] > chi)
          continue;
        int pos = upper_bound(LIS.begin(), LIS.end(), a[i] - i) - LIS.begin();
        if (pos >= LIS.size())
          LIS.emplace_back(a[i] - i);
        else
          LIS[pos] = a[i] - i;
      }
      return r - l + 1 - (int)LIS.size();
    };
    for (int i = 1; i <= k + 1; ++i)
      ans += handle(b[i - 1] + 1, b[i] - 1, a[b[i - 1]] + 1, a[b[i]] - 1);
    printf("%d", ans);
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

## Problem F - [Emotional Fishermen](https://codeforces.com/contest/1437/problem/F)

:::details Hint
When the current maximum value is $a$, what is the maximum possible value of the second-largest number?
:::

:::details Solution
An important observation is that, if the current maximum is $max$, then the current second-largest number $second$ must follow $2second<max$.

First, we will sort the numbers. Then we can find $pre[i]$ for each $i$, which means the largest index that can be included in the set when the largest number is $a[i]$ (after sorting).

After that, we will do dynamic programming, where $dp[i]$ means the number of valid permutations when the current largest number is $a[i]$. There are two types of transitions:

1. From $dp[i]$ to $dp[i]$. This requires that we choose a number $a[j]$ where $j\leq pre[i]$. The possible choices can be determined from the current size of the set, since all numbers except $a[i]$ that are in the set right now must have indices $\leq i$.
2. From $dp[j]$ to $dp[i]$, where $j\leq pre[i]$. To calculate this type of transition quickly, we can calculate the prefix sum of the $dp$ array after each iteration.

The original state is $dp[i]=1$, which means the set contains $a[i]$ only.

The total time complexity is $O(N^2)$.
:::

:::details Code (C++)

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>
#define MOD 998244353

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
    for (int i = 0; i < n; ++i)
      read(a[i]);
    sort(a.begin(), a.end());
    if (a[n - 2] * 2 > a[n - 1]) {
      printf("0");
      return;
    }

    vector<int> pre(n, -1);
    int l = n - 2;
    for (int r = n - 1; r >= 0; --r) {
      while (l >= 0 && a[l] * 2 > a[r])
        l--;
      if (l >= 0)
        pre[r] = l;
    }

    ll ans = 0;
    vector<ll> dp(n, 1), S(n + 1);
    for (int i = 1; i <= n; ++i)
      S[i] = i;
    for (int i = 1; i < n; ++i) {
      vector<ll> ndp(n, 0);
      for (int j = 0; j < n; ++j) {
        // Case 1: j to j
        int left = pre[j] == -1 ? 0 : pre[j] + 1;
        left -= i - 1;
        if (left > 0)
          ndp[j] = (ndp[j] + dp[j] * left % MOD);

        // Case 2: smaller to j
        if (pre[j] != -1)
          ndp[j] = (ndp[j] + S[pre[j] + 1]) % MOD;
      }
      for (int j = 1; j <= n; ++j)
        S[j] = (S[j - 1] + ndp[j - 1]) % MOD;
      dp = move(ndp);
    }
    printf("%lld", S[n]);
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

## Problem G - [Death DBMS](https://codeforces.com/contest/1437/problem/G)

:::details Hint
We need to find the occurrences of all names in a given string. Aha-Corasick Automaton is just made for this.
:::

:::details Solution
This is a very typical ACA problem. Since there might be duplicate names, we can use a set for each name in order to maintain the largest value of this name.

For each query, we need to travel up the trie following the fail pointers, in order to collect all the valid names we have met, and find the maximum value.
:::

:::details Code (C++)

```cpp
#include <iostream>
#include <queue>
#include <set>
#include <unordered_map>
#include <vector>

using namespace std;
struct Node {
  int idx = -1, fail = 0, children[26]{};
};

int main() {
  int n, q;
  cin >> n >> q;

  vector<string> names(n + 1);
  unordered_map<string, int> dict;
  unordered_map<int, int> id_dict;
  vector<set<pair<int, int>, greater<>>> heaps;
  vector<int> suspicion(n + 1);
  suspicion[0] = -1;
  vector<Node> nodes = {Node{}};
  int idx = 0;
  for (int i = 1; i <= n; ++i) {
    cin >> names[i];
    if (dict.count(names[i])) {
      heaps[dict[names[i]]].emplace(0, i);
      id_dict[i] = dict[names[i]];
      continue;
    }
    dict[names[i]] = idx;
    id_dict[i] = idx;
    heaps.push_back({{0, i}});
    int p = 0;
    for (char c : names[i]) {
      if (!nodes[p].children[c - 'a']) {
        nodes[p].children[c - 'a'] = nodes.size();
        nodes.emplace_back(Node{});
      }
      p = nodes[p].children[c - 'a'];
    }
    nodes[p].idx = idx++;
  }

  queue<int> que, visited;
  vector<bool> vis(nodes.size());
  for (int u : nodes[0].children)
    if (u)
      que.push(u);
  while (!que.empty()) {
    int u = que.front();
    que.pop();
    for (int i = 0; i < 26; ++i) {
      auto &v = nodes[u].children[i];
      if (v) {
        nodes[v].fail = nodes[nodes[u].fail].children[i];
        que.push(v);
      } else
        v = nodes[nodes[u].fail].children[i];
    }
  }

  string output;

  auto query = [&](string &s) {
    int ans = -1;
    int p = 0;
    int idx = 0;
    while (idx < s.size()) {
      char c = s[idx];
      if (nodes[p].children[c - 'a']) {
        p = nodes[p].children[c - 'a'];
        if (!vis[p]) {
          vis[p] = true;
          que.push(p);
        }
        idx++;
      } else {
        p = nodes[p].fail;
        if (!p)
          idx++;
      }
    }
    while (!que.empty()) {
      int u = que.front();
      que.pop();
      visited.push(u);
      if (nodes[u].idx != -1)
        ans = max(ans, heaps[nodes[u].idx].begin()->first);
      if (nodes[u].fail && !vis[nodes[u].fail]) {
        vis[nodes[u].fail] = true;
        que.push(nodes[u].fail);
      }
    }
    while (!visited.empty()) {
      vis[visited.front()] = false;
      visited.pop();
    }
    output += to_string(ans) + "\n";
  };

  while (q--) {
    int t;
    cin >> t;
    if (t == 1) {
      int i, x;
      cin >> i >> x;
      heaps[id_dict[i]].erase({suspicion[i], i});
      suspicion[i] = x;
      heaps[id_dict[i]].emplace(suspicion[i], i);
    } else {
      string s;
      cin >> s;
      query(s);
    }
  }

  cout << output;
}
```

:::
