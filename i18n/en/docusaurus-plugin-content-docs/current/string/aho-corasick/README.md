# Aho-Corasick Automaton

## Exercises

### [Luogu P5357 - AC Automaton](https://www.luogu.com.cn/problem/P5357)

### [CF1400F - x-prime Substrings](https://codeforces.com/contest/1400/problem/F)

:::details Hint 1

We can enumerate all x-prime strings via DFS.

:::

:::details Hint 2

We can build an Aho-Corasick automaton with the generated strings.

:::

:::details Hint 3

Consider two types of transitions:

- Discard the current digit, and increase the cost by $1$.
- Keep the current digit, and move on the Aho-Corasick automaton. This transition is prohibited if the target position is marked.

In this specific problem, no $x$-prime string is a suffix of another $x$-prime string, otherwise they will have different digit sums. In consequence, we do not need to follow `fail` pointers when moving on the automaton. However, do note that this is seldom the case, or you might get WA on other ACA problems (~~like me on [ADAJOBS](#spoj-ada-and-jobs)~~).

:::

:::details Code (C++)

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

The challenge lies in that tasks are added dynamically, but we cannot afford reconstructing the whole automaton every time a new word is added.

:::details Hint 1

Store all operations offline. When constructing the automaton, assign every stop node a timestamp indicating its order. Meanwhile, store the number of words in the dictionary at the time a query is made. In this way, we only need to build the ACA once. During matching, we need to find a stop node whose timestamp is no larger than the timestamp of the query.

:::

:::details Hint 2

During matching, we do not need to go all the way up along the `fail` pointers. Instead, we can push down the timestamp during construction.

:::

:::details Code (C++)

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
