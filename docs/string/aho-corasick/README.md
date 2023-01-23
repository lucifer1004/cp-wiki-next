# AC 自动机

## 练习题

### [洛谷 P5357 - AC 自动机（二次加强版）](https://www.luogu.com.cn/problem/P5357)

### [CF1400F - x-prime Substrings](https://codeforces.com/contest/1400/problem/F)

:::details 提示一

可以通过 DFS 枚举出所有的 x-prime string。

:::

:::details 提示二

利用所有的 x-prime string 构建 AC 自动机。

:::

:::details 提示三

考虑两种转移：删除当前字母，总花费加一；保留当前字母，在 AC 自动机上移动。

本题中，由于任意一个 $x$-prime 串都不会是其他 $x$-prime 串的后缀（否则它们的数位和不等），所以在 AC 自动机上移动时，并不需要利用 `fail` 指针逐级上跳。但务必注意，只有很少的题目能够满足这一条件，不要因此在其他 AC 自动机的题目上吃到 WA（~~就像我在[ADAJOBS](./#spoj-ada-and-jobs)那题一样~~）。

:::

:::details 参考代码（C++）

```cpp
#include <cstring>
#include <iostream>
#include <queue>
#include <set>
#include <vector>

using namespace std;
const int INF = 0x3f3f3f3f;

struct Node {
  int fail = 0, children[9]{};
  bool match = false;
};

string s, t;
int x, dp[5005][5005];
set<string> xprime;
vector<int> suffix = {0};
vector<Node> nodes;

void generate_xprime() {
  if (suffix[0] == x) {
    xprime.insert(t);
    return;
  }
  for (int i = 1; i <= 9 && i + suffix[0] <= x; ++i) {
    t.push_back(i + '0');
    for (int &j : suffix)
      j += i;
    suffix.emplace_back(i);
    bool ok = true;
    for (int &j : suffix)
      if (j != x && x % j == 0) {
        ok = false;
        break;
      }
    if (ok)
      generate_xprime();
    suffix.pop_back();
    for (int &j : suffix)
      j -= i;
    t.pop_back();
  }
}

void build_aca() {
  nodes.emplace_back(Node{});
  for (const string &str : xprime) {
    int curr = 0;
    for (const char &c : str) {
      if (!nodes[curr].children[c - '1']) {
        nodes[curr].children[c - '1'] = nodes.size();
        nodes.emplace_back(Node{});
      }
      curr = nodes[curr].children[c - '1'];
    }
    nodes[curr].match = true;
  }
  queue<int> q;
  for (const int &u : nodes[0].children)
    if (u)
      q.push(u);

  while (!q.empty()) {
    int u = q.front();
    q.pop();
    for (int i = 0; i < 9; ++i) {
      int &v = nodes[u].children[i];
      if (v) {
        nodes[v].fail = nodes[nodes[u].fail].children[i];
        q.push(v);
      } else
        v = nodes[nodes[u].fail].children[i];
    }
  }
}

int main() {
  cin >> s >> x;

  // Step 1: Enumerate all x-prime strings
  generate_xprime();

  // Step 2: Build Aho-Corasick automaton with x-prime strings
  build_aca();

  // Step 3: Dynamic programming
  memset(dp, 0x3f, sizeof(dp));
  int n = s.size(), m = nodes.size(), ans = INF;
  dp[0][0] = 0;
  for (int i = 0; i < n; ++i)
    for (int j = 0; j < m; ++j) {
      if (dp[i][j] == INF)
        continue;
      dp[i + 1][j] = min(dp[i + 1][j], dp[i][j] + 1);
      int nxt = nodes[j].children[s[i] - '1'];
      if (!nodes[nxt].match)
        dp[i + 1][nxt] = min(dp[i + 1][nxt], dp[i][j]);
    }
  for (int j = 0; j < m; ++j)
    ans = min(ans, dp[n][j]);
  cout << ans;
}
```

:::

### [SPOJ - Ada and Jobs](https://www.spoj.com/problems/ADAJOBS/)

本题的难点在于，字符串是动态添加的，但我们不可能在每次查询时都重新构建整个 AC 自动机。那么应该如何做呢？

:::details 提示一

离线所有修改操作和查询，在构建 AC 自动机时给每个终止节点一个时间戳（代表它是第几个被添加的字符串）；同时，记录每个查询操作发生时字典中总单词数。这样，我们只需要构建一次 AC 自动机。在每次匹配的过程中，我们需要匹配到时间戳小于等于对应查询操作时间戳的终止节点才算是匹配成功。

:::

:::details 提示二

在匹配过程中，并不需要逐级跳 `fail` 指针来查找是否存在匹配。可以在构建自动机时顺便将时间戳下推。

:::

:::details 参考代码（C++）

```cpp
#include <iostream>
#include <queue>
#include <vector>
#define INF 0x3f3f3f3f

using namespace std;

struct Node {
  int occur = INF, fail = 0, children[26]{};
};

int main() {
  int q;
  cin >> q;
  vector<string> dict;
  vector<pair<int, string>> query;
  while (q--) {
    int t;
    string s;
    cin >> t >> s;
    if (t == 0)
      dict.emplace_back(s);
    else
      query.emplace_back(dict.size(), s);
  }
  int m = dict.size();
  vector<Node> nodes(1);
  for (int i = 1; i <= m; ++i) {
    int current = 0;
    for (char c : dict[i - 1]) {
      if (!nodes[current].children[c - 'a']) {
        nodes[current].children[c - 'a'] = nodes.size();
        nodes.emplace_back(Node{});
      }
      current = nodes[current].children[c - 'a'];
    }
    nodes[current].occur = min(nodes[current].occur, i);
  }
  queue<int> que;
  for (const int &u : nodes[0].children)
    if (u)
      que.push(u);
  while (!que.empty()) {
    int u = que.front();

    // Push down the timestamp. This is critical.
    nodes[u].occur = min(nodes[u].occur, nodes[nodes[u].fail].occur);
    que.pop();
    for (int i = 0; i < 26; ++i) {
      int &v = nodes[u].children[i];
      if (v) {
        nodes[v].fail = nodes[nodes[u].fail].children[i];
        que.push(v);
      } else
        v = nodes[nodes[u].fail].children[i];
    }
  }
  string ans;
  for (auto &[ts, s] : query) {
    int current = 0;
    bool found = false;
    int idx = 0;
    while (idx < s.size()) {
      char c = s[idx];
      if (nodes[current].children[c - 'a']) {
        current = nodes[current].children[c - 'a'];
        if (nodes[current].occur <= ts) {
          ans += "YES\n";
          found = true;
          break;
        }
        idx++;
      } else {
        current = nodes[current].fail;
        if (!current)
          idx++;
      }
    }
    if (!found)
      ans += "NO\n";
  }
  cout << ans;
}
```

:::
