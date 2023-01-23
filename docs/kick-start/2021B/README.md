# Google Kick Start 2021 Round B

## Problem A - [Increasing Substring](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000435a5b/000000000077a882)

遍历字符串，尝试将当前字母接到上一个字母之后即可。

复杂度：
- 时间复杂度为$\mathcal{O}(|S|)$。
- 空间复杂度为$\mathcal{O}(|S|)$。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-') sig = -1;
  for (; isdigit(c); c = getchar()) x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

class Solution {
 public:
  void solve(int case_num) {
    printf("Case #%d: 1 ", case_num);
    int n;
    read(n);
    string s;
    cin >> s;
    int last = 1;
    for (int i = 1; i < n; i++) {
      last = s[i] > s[i - 1] ? (last + 1) : 1;
      printf("%d ", last);
    }

    printf("\n");
  }
};

int main() {
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem B - [Longest Progression](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000435a5b/000000000077a3a5)

对于$N\leq3$，结果显然为$N$。

对于$N\geq4$，我们可以首先计算出$l[i]$，也即从左边开始到$i$结束的最长等差数列（不对数组进行改变）的长度；以及$r[i]$，也即从右边开始到$i$结束的最长等差数列（不对数组进行改变）的长度。接下来我们检查每个位置，看看我们是否能通过改变这一位置来得到一个更长的等差数列：

- 结合$l[i-1]$和$r[i+1]$ 
- 结合$l[i-1]$和$a[i+1]$
- 结合$a[i-1]$和$r[i+1]$

复杂度：
- 时间复杂度为$\mathcal{O}(N)$。
- 空间复杂度为$\mathcal{O}(N)$。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;

template <typename T>
void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-') sig = -1;
  for (; isdigit(c); c = getchar()) x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

class Solution {
 public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i) read(a[i]);

    if (n <= 3) {
      printf("%d\n", n);
      return;
    }

    vector<int> l(n), r(n);
    l[0] = 1;
    l[1] = 2;
    for (int i = 2; i < n; ++i) {
      if (a[i] - a[i - 1] == a[i - 1] - a[i - 2])
        l[i] = l[i - 1] + 1;
      else
        l[i] = 2;
    }

    r[n - 1] = 1;
    r[n - 2] = 2;
    for (int i = n - 3; i >= 0; --i) {
      if (a[i + 1] - a[i] == a[i + 2] - a[i + 1])
        r[i] = r[i + 1] + 1;
      else
        r[i] = 2;
    }

    int ans = max(l[n - 2] + 1, r[1] + 1);
    for (int i = 1; i < n - 1; ++i) {
      ans = max(ans, max(l[i - 1] + 1, r[i + 1] + 1));
      if (i >= 2 && a[i + 1] - a[i - 1] == 2 * (a[i - 1] - a[i - 2]))
        ans = max(ans, l[i - 1] + 2);
      if (i + 2 < n && a[i + 1] - a[i - 1] == 2 * (a[i + 2] - a[i + 1]))
        ans = max(ans, r[i + 1] + 2);
      if (i >= 2 && i + 2 < n &&
          a[i + 1] - a[i - 1] == 2 * (a[i - 1] - a[i - 2]) &&
          a[i - 1] - a[i - 2] == a[i + 2] - a[i + 1])
        ans = max(ans, l[i - 1] + r[i + 1] + 1);
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

## Problem C - [Consecutive Primes](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000435a5b/000000000077a8e6)

### 解法一：找出最接近$\sqrt{S}$的三个素数$A<B\leq\sqrt{S}<C$

官方题解利用了素数间隔（Prime gap）的知识，给出了一个非常优美的暴力解法。

有关素数间隔的内容可以参考官方题解。这里说说素数检测（Primality test）。大家最熟悉的就是枚举$[2,\sqrt{N}]$之间的所有整数这种方法，时间复杂度是$\mathcal{O}(\sqrt{N})$。本题中使用这一方法也就可以通过了。但是借助[Miller-Rabin算法](https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test)，我们可以做到$\mathcal{O}(K\log^3N)$的时间复杂度，其中$K$是检测因子的个数。对于$10^9$之内的整数，我们只需要使用$[2,7,61]$这三个因子就可以确保检测的正确性。

:::details 参考代码（C++）

```cpp
#include <cmath>
#include <cstdio>
#include <iostream>

using namespace std;
using ll = long long;

template <typename T>
void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-') sig = -1;
  for (; isdigit(c); c = getchar()) x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

int mod_pow(int a, int b, int mod) {
  int result = 1;

  while (b > 0) {
    if (b & 1) result = 1LL * result * a % mod;
    a = 1LL * a * a % mod;
    b >>= 1;
  }

  return result;
}

bool miller_rabin(int n) {
  if (n < 2) return false;

  // Check small primes.
  for (int p : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29})
    if (n % p == 0) return n == p;

  int r = __builtin_ctz(n - 1);
  int d = (n - 1) >> r;

  // https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test#Testing_against_small_sets_of_bases
  for (int a : {2, 7, 61}) {
    int x = mod_pow(a % n, d, n);
    if (x <= 1 || x == n - 1) continue;
    for (int i = 0; i < r - 1 && x != n - 1; i++) x = 1LL * x * x % n;
    if (x != n - 1) return false;
  }

  return true;
}

class Solution {
 public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    ll s;
    read(s);

    if (s < 15) {
      printf("6\n");
      return;
    }

    int n = sqrt(s);
    int b = n;
    while (!miller_rabin(b)) b--;
    int a = b - 1;
    while (!miller_rabin(a)) a--;
    int c = n + 1;
    while (!miller_rabin(c)) c++;

    if (1LL * b * c <= s)
      printf("%lld\n", 1LL * b * c);
    else
      printf("%lld\n", 1LL * a * b);
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

### 解法二：找出所有素数，然后二分查找

我们也可以利用欧拉筛在线性时间内求出所有不超过$\sqrt{\text{MAXN}}$的素数，然后二分求解每一个询问。注意这里$\text{MAXN}$需要比$10^{18}$略大一些，这样才能生成比$10^9$大的最小质数。

为了尽可能节约空间，标记数组需要使用`bitset`，而不是`bool[]`。

复杂度：
- 时间复杂度为$\mathcal{O}(\sqrt{\text{MAXN}}+Q\log\frac{\sqrt{\text{MAXN}}}{\ln\sqrt{\text{MAXN}}})$。
- 空间复杂度为$\mathcal{O}(\sqrt{\text{MAXN}})$。

:::details 参考代码（C++）

```cpp
#include <bitset>
#include <cstdio>
#include <iostream>
#define MAXN 1000000010
#define MAXP 51000000

using namespace std;
typedef long long ll;

bitset<MAXN> p;
int primes[MAXP], ptr = 0;

template <typename T>
void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-') sig = -1;
  for (; isdigit(c); c = getchar()) x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

class Solution {
 public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    ll n;
    read(n);
    int lo = 0, hi = ptr - 2;
    while (lo <= hi) {
      int mid = (lo + hi) >> 1;
      ll prod = 1LL * primes[mid] * primes[mid + 1];
      if (prod <= n)
        lo = mid + 1;
      else
        hi = mid - 1;
    }
    printf("%lld\n", 1LL * primes[lo - 1] * primes[lo]);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);

  p[1] = true;
  for (int i = 2; i < MAXN; ++i) {
    if (!p[i]) primes[ptr++] = i;
    for (int j = 0; j < ptr && 1LL * i * primes[j] < MAXN; ++j) {
      p[i * primes[j]] = true;
      if (i % primes[j] == 0) break;
    }
  }

  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem D - [Truck Delivery](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000435a5b/000000000077a885)

官方题解使用了线段树。不过，我们也可以利用分块解决本题。

我们按照限重$L_i$将边分块，每个块的最优大小是$\sqrt{N}$。

我们首先进行一次DFS来获取需要的信息。对于每个节点，我们需要计算出从根节点到该节点的路径上属于每个分块的边的权重的GCD结果（也即下面代码中的$acc[i][j]$），以及从根节点到该节点的路径上属于每个分块的上一条边的序号（也即下面代码中的$last[i][j]$）。

对于每次查询，我们首先确定$W_i$所属的块的序号$j$。所有小于$j$的块的结果都是我们需要的。而对于第$j$个块，我们利用$last$数组找出路径上所有属于该块的边，并检查是否$L_k\leq W_i$。

复杂度：
- 时间复杂度为$\mathcal{O}((N+Q)\sqrt{N})$，如果块的大小设置为$\sqrt{N}$。在下面的代码中，块的大小被固定为500，这是为了避免对边的限重进行离散化。注意到$L_i$各不相同，所以每个大小为$\sqrt{N}$的块里至多有$\sqrt{N}$条边，这保证了时间复杂度的正确性。
- 空间复杂度为$\mathcal{O}(N\sqrt{N})$。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <vector>
#define LMAX 200000
#define LBLKSIZE 500
#define LBLKNUM 400

using namespace std;
typedef long long ll;

template <typename T>
void read(T &x) {
  x = 0;
  char c = getchar();
  T sig = 1;
  for (; !isdigit(c); c = getchar())
    if (c == '-') sig = -1;
  for (; isdigit(c); c = getchar()) x = (x << 3) + (x << 1) + c - '0';
  x *= sig;
}

ll gcd(ll a, ll b) { return b == 0 ? a : gcd(b, a % b); }

class Solution {
  vector<vector<pair<int, int>>> adj;
  vector<int> limit, from, to;
  vector<ll> toll;
  vector<vector<ll>> acc;
  vector<vector<int>> last;

  void dfs(int u, int p, vector<ll> &gcd_memo, vector<int> &last_memo) {
    for (auto [v, i] : adj[u]) {
      if (v == p) continue;
      int lidx = (limit[i] - 1) / LBLKSIZE;

      // Save current value.
      int last_tmp = last_memo[lidx];
      ll gcd_tmp = gcd_memo[lidx];

      // Modify.
      last_memo[lidx] = i;
      gcd_memo[lidx] = gcd(gcd_memo[lidx], toll[i]);
      last[v] = vector<int>(last_memo);
      acc[v] = vector<ll>(gcd_memo);
      from[i] = u;
      to[i] = v;

      // Do recursion.
      dfs(v, u, gcd_memo, last_memo);

      // Restore.
      last_memo[lidx] = last_tmp;
      gcd_memo[lidx] = gcd_tmp;
    }
  }

 public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n, q;
    read(n), read(q);
    adj = vector<vector<pair<int, int>>>(n + 1);
    limit = vector<int>(n - 1);
    toll = vector<ll>(n - 1);
    from = vector<int>(n - 1);
    to = vector<int>(n - 1);
    acc = vector<vector<ll>>(n, vector<ll>(LBLKNUM));
    last = vector<vector<int>>(n, vector<int>(LBLKNUM, -1));

    for (int i = 0; i < n - 1; ++i) {
      int x, y;
      read(x), read(y), read(limit[i]), read(toll[i]);
      x--, y--;
      adj[x].emplace_back(y, i);
      adj[y].emplace_back(x, i);
    }

    vector<int> last_memo(LBLKNUM, -1);
    vector<ll> gcd_memo(LBLKNUM);
    dfs(0, -1, gcd_memo, last_memo);

    while (q--) {
      ll ans = 0;
      int x, w;
      read(x), read(w);
      x--;
      int lidx = (w - 1) / LBLKSIZE;
      for (int i = 0; i < lidx; ++i) {
        ans = gcd(ans, acc[x][i]);
      }
      while (true) {
        int r = last[x][lidx];
        if (r == -1) break;
        if (w >= limit[r]) ans = gcd(ans, toll[r]);
        x = from[r];
      }

      printf("%lld ", ans);
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
