# Educational Codeforces Round 97 (CF1437)

## Problem A - [Marketing Scheme](https://codeforces.com/contest/1437/problem/A)

:::details 提示
如果$r\geq2l$，会如何？
:::

:::details 解法
如果$r\geq2l$，则我们至少需要覆盖区间$[l,2l]$。显然，我们需要$a>l$，因为这一区间的长度已经为$l+1$。如果$l<a\leq2l$，则模$a$的余数中至多有$l$个满足$\geq\frac{a}{2}$，因此这一长度为$l+1$的区间中，至少有一个数模$a$的余数$<\frac{a}{2}$。但如果取$a>2l$，则$l$模$a$的余数必然$<\frac{a}{2}$。从而，在$r\geq2l$时，不存在满足条件的$a$。

反过来，如果$r<2l$，我们总可以取$a=2l$，易知它是一个满足题意的答案。

所以，这道题我们只需要判断是否满足$r<2l$即可。

时间复杂度为$O(1)$。
:::

:::details 参考代码 （Python 3）

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

:::details 提示
经过一次翻转，$00$或$11$对的数目会减少多少？
:::

:::details 解法
在一次翻转中，$00$或$11$对的数目至多减少$2$。所以我们只需要统计出这样的数对的数目即可。

时间复杂度为$O(N)$。
:::

:::details 参考代码 （Python 3）

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

:::details 提示

1. 我们不会用到超过$2n$的时间。
2. 数组的原始顺序没有影响。

:::

:::details 解法
我们不会用到$t>2n$的时间，这是因为$a[i]\leq n$，所以即使我们是在$t=n$时刻熄灭第一个炉子，也来得及在$t=2n-1$时刻熄灭最后一个炉子。因此，如果我们用到了$t>2n$的时间，就一定可以通过改成更早的时间来降低总的不满度。事实上，这一上界还可以进一步降低，但$2n$已经可以满足要求。

首先，我们对数组进行排序，然后进行动态规划。令$dp[t]$表示在$t$时刻熄灭最后一个炉子的总不满度。

因为时间是单调的，我们考虑下一个炉子的时候，只会从小于当前时刻的时刻向当前时刻转移。对于第$i$个炉子，我们进行这样的更新：令$dp[t]=\min_{t'<t}(dp[t'])+|t-a[i]|$。为了避免重复计算，我们可以维护一个前缀最小值$lo$。

总时间复杂度为$O(N^2)$。
:::

:::details （Python 3）

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

:::details 提示
贪心。
:::

:::details 解法
我们可以贪心地分配节点。除非当前数字比上一个数字小，否则我们总是将其连接到同一个父节点。否则，我们移动到下一个父节点（它可能在树的下一层）。

时间复杂度为$O(N)$。
:::

:::details 参考代码 （C++）

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

:::details 提示

1. 我们可以在数组$a$和$b$的头尾各添加一个哨兵位，这样就可以把原问题分解为若干子问题。
2. 每个子问题实质上是最长上升子序列（LIS）。

:::

:::details 解法
第一步，我们将原问题分解为子问题。每个子问题包括四个参数，$l$和$r$代表区间起点和终点，$lo$代表区间起点的最小取值，$hi$代表区间终点的最大取值。

对于每一子问题，我们考虑以下三种情况：

- $l>r$，也即空区间的情形，对应的结果显然为$0$。
- $l=r$，也即区间长度为$1$的情形，对应的结果取决于$a[l]$是否在$[lo,hi]$范围内。
- $l<r$。在这一情形中，我们需要找到区间内的最长上升子序列。不过，这与经典的LIS问题有两点区别。首先，如果当前数字不在其合法范围内（这一范围可以由$lo$和$hi$计算得到，为$[lo+i-l,hi-r+i]$），它就不能被加入到LIS中。另一区别是，我们不能直接使用$a[i]$。考虑这一例子，$[2,5,3,1]$。我们可以用$[2,3]$作为LIS吗？答案是否定的，因为如果这样的话，中间的数字就无法安排了。我们如何将这一距离因素考虑进来呢？方法是，用$a[i]-i$代替$a[i]$，同时，求取最长不下降子序列而非最长上升子序列。通过$-i$，我们就消去了不同位置间的距离差异。

最长上升子序列（最长不下降子序列）是一个经典的动态规划问题，并可以利用二分搜索进一步优化。对于长度为$L$的区间，其时间复杂度为$O(L\log L)$。

因此，最后的总时间复杂度为$O(N\log N)$。
:::

:::details 参考代码 （C++）

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

:::details 提示
如果当前集合中的最大值为$a$，集合中的次大值最大为多少？
:::

:::details 解法
本题中的关键点是：如果当前集合中的最大值为$max$，次大值为$second$，则它们一定满足$2\cdot second<max$。

首先，我们对数组进行排序。接下来，我们可以用双指针的方法为每一个$a[i]$找出$pre[i]$，也即能够存在于以$a[i]$为最大值中的集合的元素的最大下标。

接下来，我们进行动态规划。令$dp[i]$代表最大元素为$a[i]$的合法排列的数目。一共有两种类型的转移：

1. 从$dp[i]$到$dp[i]$。这一转移要求我们从$[0,pre[i]]$中选择一个元素加入排列。我们可以通过当前集合中的元素个数来求出可能的选择数。
2. 从$dp[j]$到$dp[i]$，其中$j\leq pre[i]$。为了加速计算这一类转移，我们可以在每次循环后计算$dp$数组的前缀和。

初始状态为$dp[i]=1$，也即第$i$个集合中只包含了$a[i]$这一个元素。

总时间复杂度为$O(N^2)$。
:::

:::details 参考代码 （C++）

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

:::details 提示
我们需要找到一个给定的字符串中所有名字的出现情况。是时候登场了，AC自动机！
:::

:::details 解法
这是一道非常典型的AC自动机的题目。因为可能有重复的名字，所以我们可以用`set`来保存相同名字的人的可疑度，这样方便我们获取最大值。

对于每一次询问，在常规遍历结束后，我们还需要沿着`fail`指针向上遍历所有节点，来获取所有完整出现的名字的最大可疑度。
:::

:::details 参考代码 （C++）

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
