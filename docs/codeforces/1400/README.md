# Educational Codeforces Round 94 (CF1400)

## Problem A - [String Similarity](https://codeforces.com/contest/1400/problem/A)

### 题目描述

给定一个长度为$2n-1$的字符串，要求构造一个长度为$n$的字符串，使得其与原字符串所有长度为$n$的子串都至少有一个位置相同。

### 题解

最简单的构造就是用第一个子串的第一位，第二个子串的第二位……观察后会发现这些位置刚好是原字符串的第$1,3,\cdots,2n-1$位。

:::details 参考代码（C++）

```cpp
#include <iostream>

using namespace std;

int main() {
  int t;
  cin >> t;
  while (t--) {
    int n;
    string s, ans;
    cin >> n >> s;
    for (int i = 0; i < n; ++i)
      ans.push_back(s[2 * i]);
    cout << ans << endl;
  }
}
```

:::

## Problem B - [RPG Protagonist](https://codeforces.com/contest/1400/problem/B)

### 题目描述

两个人能带的东西的重量分别为$p$和$f$，两种东西的重量分别为$s$和$w$，数量分别为$cs$和$cw$，求两个人能带的东西的数量总和的最大值。

### 题解

一开始以为有贪心策略，但事实证明就是得穷举。

两种东西对称，所以我们可以通过交换，保证$s\leq w$。

因为$\sum cs\leq2\times10^5$且$\sum cw\leq2\times10^5$，所以直接穷举第一个人拿$s$的数量，再让第一个人尽量拿$w$。之后第二个人先尽量拿$s$，再尽量拿$w$。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>

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
    int p, f, cs, cw, s, w;
    read(p), read(f), read(cs), read(cw), read(s), read(w);
    int ans = 0;
    if (s > w)
      swap(s, w), swap(cs, cw);
    for (int i = 0; i <= cs && i * s <= p; ++i) {
      int p1 = p - i * s;
      int pw = min(p1 / w, cw);
      int cw1 = cw - pw;
      int fs = min(f / s, cs - i);
      int f1 = f - fs * s;
      int fw = min(f1 / w, cw1);
      ans = max(ans, i + pw + fs + fw);
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

## Problem C - [Binary String Reconstruction](https://codeforces.com/contest/1400/problem/C)

### 题目描述

在长度为$n$的串$w$的基础上，按照以下方法构造长度为$n$的串$s$:

- 如果$w_{i-x}=1$或$w_{i+x}=1$，则$s_i=1$（$i-x$和$i+x$需要是合法的下标）
- 否则$s_i=0$

给定$s$和$x$，重构$w$。

### 题解

逆向思考。$s_i=0$说明$w_{i-x}=w_{i+1}=0$，我们可以把$w$串先设为全$1$，然后根据$s$中$0$的情况对$w$进行对应修改。之后我们再检查$w$中剩余的$1$是否能保证$s$中的每个$1$成立。

因为这样构造出的$w$一定是所有满足$0$的条件中含$1$数量最多的，所以如果这样的$w$都不能满足$1$的条件，就一定无解。

:::details 参考代码（C++）

```cpp
#include <iostream>

using namespace std;

class Solution {
public:
  void solve() {
    string s;
    int x;
    cin >> s >> x;
    int n = s.size();
    string w(n, '1');
    for (int i = 0; i < n; ++i)
      if (s[i] == '0') {
        if (i >= x)
          w[i - x] = '0';
        if (i + x < n)
          w[i + x] = '0';
      }
    for (int i = 0; i < n; ++i)
      if (s[i] == '1') {
        bool ok = false;
        if (i >= x && w[i - x] == '1')
          ok = true;
        if (i + x < n && w[i + x] == '1')
          ok = true;
        if (!ok) {
          cout << -1 << endl;
          return;
        }
      }
    cout << w << endl;
  }
};

int main() {
  int t;
  cin >> t;
  while (t--) {
    Solution solution = Solution();
    solution.solve();
  }
}
```

:::

## Problem D - [Zigzags](https://codeforces.com/contest/1400/problem/D)

### 题目描述

给定长度为$N$（$N\leq3000$）的数组，求满足$i<j<k<l$，同时满足$a_i=a_k$和$a_j=a_l$的四元组$(i,j,k,l)$的数目。

### 题解

容易求出$a_i=a_j=a_k=a_l$的四元组数目。

接下来求$a_i\neq a_j$情况下符合条件的四元组数目。

我们可以先固定$l$，然后枚举$j$的位置。在$j$移动的过程中，$j$左边和$j$右边的计数器分别只会有一个元素的数量发生变化，因此可以在$O(1)$时间内更新左右两边的配对数。当$a_j=a_l$时，我们就可以将当前的配对数加入答案。

总时间复杂度为$O(n^2)$。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
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

class Solution {
public:
  void solve() {
    int n;
    read(n);
    vector<int> a(n), cnt(n + 1);
    for (int i = 0; i < n; ++i)
      read(a[i]), cnt[a[i]]++;
    ll ans = 0;
    for (int i = 1; i <= n; ++i) {
      int &t = cnt[i];
      if (t >= 4)
        ans += (ll)t * (t - 1) * (t - 2) * (t - 3) / 24;
    }
    for (int i = 3; i < n; ++i) {
      vector<int> l(n + 1), r(n + 1);
      ll cnt = 0;
      for (int j = 0; j < i; ++j)
        r[a[j]]++;
      for (int j = 0; j < i; ++j) {
        if (a[j] == a[i])
          ans += cnt;
        else {
          cnt -= l[a[j]] * r[a[j]];
          l[a[j]]++, r[a[j]]--;
          cnt += l[a[j]] * r[a[j]];
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

## Problem E - [Clear the Multiset](https://codeforces.com/contest/1400/problem/E)

### 题目描述

给定一个长度为$N$（$N\leq5000$）的数组，每次可以进行以下任一操作：

1. 将一段连续区间减$1$，要求操作前区间所有数都大于$0$
2. 将某个位置置为$0$

问将所有位置变为$0$所需要的最小操作数。

### 题解

观察后可以得出一个结论：如果对某个区间$[L,R]$进行第一种操作，至少需要进行$\min_{i=L}^R a_i$次，否则的话，并不能减少需要进行第二种操作的次数，总次数不会减少。因此，我们可以从$[1,N]$开始进行DFS，每次利用$\min_{i=L}^R a_i$把原始区间分割成若干小区间。对于每个区间，我们比较其进行第一种操作时所需要的次数和只进行第二种操作时所需要的次数。因为总共形成的区间不会超过$N$个，所以可以在$O(N^2)$的时间复杂度内解决本题。

:::details 参考代码（C++）

```cpp
#include <iostream>
#define N 5005

int n, a[N];

int dfs(int l, int r, int b) {
  if (l == r)
    return a[l] > b;
  int lo = 1e9;
  for (int i = l; i <= r; ++i)
    lo = std::min(lo, a[i]);
  int cl = -1, cr = -1;
  int tot = lo - b, cnt = 0;
  for (int i = l; i <= r; ++i) {
    if (a[i] == b) {
      if (cr != -1)
        tot += dfs(cl, cr, lo);
      cl = -1, cr = -1;
    } else {
      cnt++;
      if (cl == -1)
        cl = i;
      cr = i;
    }
  }
  if (cr != -1)
    tot += dfs(cl, cr, lo);
  return std::min(tot, cnt);
}

int main() {
  std::cin >> n;
  for (int i = 0; i < n; ++i)
    std::cin >> a[i];
  std::cout << dfs(0, n - 1, 0);
}
```

:::

## Problem F - [x-Prime Substrings](https://codeforces.com/contest/1400/problem/F)

### 题目描述

定义$x$-Prime串为所含数字之和为$x$（1\leq x\leq20），且其除了自身之外的所有子串的数字之和都无法整除$x$的串。问，从原始串$s$（$|s|\leq 1000$）中至少删除多少个数字后，可以使得$s$的所有子串都不为$x$-Prime串？

### 题解

因为$x$并不大，我们可以枚举出所有的$x$-Prime串（$x=19$的时候最多，有两千多个）。

这时可以发现原问题变成了一个字符串与多个模式串的匹配问题，自然地想到使用刚才枚举出的$x$-Prime串来构建一个Aho-Corasick自动机。

接下来就是简单的动态规划了。$dp[i][j]$表示$s$的前$i$位，经过删除后的串在AC自动机上的位置为$j$时所能取得的最小值。有两种转移方式：

- 放弃$i+1$，最小值加一。
- 取$i+1$，串在AC自动机上的位置移动到$nxt=nodes[j].children[s_{i+1}]$。如果$nxt$不为终点，则可以进行这一转移，最小值不变。

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
int x, dp[1005][5005];
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

## Problem G - [Mercenaries](https://codeforces.com/contest/1400/problem/G)

### 题目描述

有$N$个雇佣兵（$N\leq3\times10^5$），每个人要求组团的人数在$[L_i,R_i]$之间。另外有$m$（$m\leq20$）条规则，规定了$A_i$和$B_i$不能一起组团。求组建雇佣兵团的方法数（模$998244353$）。

### 题解

考虑使用容斥原理来求解。

总方法数等于不考虑规则的方法数，减去至少违反一条规则的方法数，加上至少违反两条规则的方法数……

需要预先计算出每种团队规模下，可选的雇佣兵人数$can[i]$。这可以通过扫描算法来求解。

在给定的违反规则情况下，我们至少要选择这些规则中涉及到的$k$个人。因为$m\leq20$，所以$k\leq40$。另一方面，这$k$个人会把可选的人数范围压缩到$[L,R]$，其中$L=\max L_i$，$R=\min R_i$。所以，这一情况下的总方法数就为$\sum_{i=L}^R C_{can[i]-k}^{i-k}$。因为我们需要枚举所有$2^m$种规则集，所以需要尽快计算出这一组合数的总和。为此，我们计算所有$k\leq2m$情况下的前缀和$\sum_{i=1}^jC_{can[i]-k}^{i-k}$，从而可以在$O(1)$时间内计算出刚才的方法数。

预计算$n!$的开销为$O(n\log MOD)$，预计算前缀和的开销为$O(nm)$，每种规则下的计算开销为$O(m\log m)$（因为使用`set`来维护这些规则涉及到的不同的人），所以最后的总时间复杂度为$O(n\log MOD+nm+2^mm\log m)$。

:::details 参考代码（C++）

```cpp
#include <bitset>
#include <cstdio>
#include <iostream>
#include <set>
#include <vector>
#define MAXN 300005
#define MAXK 41
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

ll fac[MAXN], rev[MAXN];

ll fexp(ll x, ll y) {
  ll ans = 1;
  while (y) {
    if (y & 1)
      ans = ans * x % MOD;
    x = x * x % MOD;
    y >>= 1;
  }
  return ans;
}

ll C(int n, int k) {
  if (n < 0 || n < k || k < 0)
    return 0;
  return fac[n] * rev[k] % MOD * rev[n - k] % MOD;
}

ll pre[MAXK][MAXN];

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int n, m;
  read(n), read(m);
  fac[0] = 1, rev[0] = 1;
  for (int i = 1; i <= n; ++i) {
    fac[i] = fac[i - 1] * i % MOD;
    rev[i] = fexp(fac[i], MOD - 2);
  }
  vector<pair<int, int>> p(n), c(m);
  vector<int> start(n + 1), end(n + 1);
  for (int i = 0; i < n; ++i) {
    read(p[i].first), read(p[i].second);
    start[p[i].first]++;
    end[p[i].second]++;
  }
  int cnt = 0;
  vector<int> can(n + 1);
  for (int i = 1; i <= n; ++i) {
    cnt += start[i];
    can[i] = cnt;
    cnt -= end[i];
  }
  for (int i = 0; i < m; ++i) {
    read(c[i].first), read(c[i].second);
    c[i].first--, c[i].second--;
  }
  for (int k = 0; k <= 2 * m; ++k) {
    pre[k][0] = 0;
    for (int i = 1; i <= n; ++i)
      pre[k][i] = (pre[k][i - 1] + C(can[i] - k, i - k)) % MOD;
  }
  ll ans = 0;
  for (int i = 0; i < (1 << m); ++i) {
    bitset<32> bs(i);
    int t = bs.count();
    int sig = (t & 1) ? -1 : 1;
    int l = 1, r = n;
    set<int> chosen;
    for (int j = 0; j < m; ++j)
      if (bs.test(j)) {
        chosen.insert(c[j].first);
        chosen.insert(c[j].second);
      }
    for (auto x : chosen) {
      l = max(l, p[x].first);
      r = min(r, p[x].second);
    }
    int k = chosen.size();
    l = max(l, k);
    if (l > r)
      continue;
    ll tot = (pre[k][r] - pre[k][l - 1] + MOD) % MOD;
    ans = (ans + sig * tot + MOD) % MOD;
  }
  printf("%lld", ans);
}
```

:::
