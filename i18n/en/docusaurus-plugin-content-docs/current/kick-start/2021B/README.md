# Google Kick Start 2021 Round B Tutorial

Here are my solutions to Google Kick Start 2021 Round B. Some of them (C & D) are not optimal, albeit they passed all the test cases.

## Problem A - [Increasing Substring](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000435a5b/000000000077a882)

We simply go ahead and try appending the current letter after the last letter.

Complexity:

- Time complexity is $\mathcal{O}(|S|)$.
- Space complexity is $\mathcal{O}(|S|)$.

:::details Code (C++)

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

For $N\leq3$, it is obvious that the answer is $N$.

For $N\geq4$, we can first calculate $l[i]$, which denotes the length of the longest arithmetic array from left till $i$ without making any changes, and $r[i]$, which denotes the length of the longest arithmetic array from right till $i$ without making changes.

Then we check each position $i$ to see if we could get a longer length by changing $a[i]$ so that we can:

- combine $l[i-1]$ and $r[i+1]$ 
- combine $l[i-1]$ and $a[i+1]$
- combine $a[i-1]$ and $r[i+1]$

And the complexity:

- Time complexity is $\mathcal{O}(N)$.

- Space complexity is $\mathcal{O}(N)$.

:::details Code (C++)

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

### Solution I: Find the three primes $A<B\leq\sqrt{S}<C$ closest to $\sqrt{S}$

The official solution leverages the concept of the prime gap and is a very beautiful brute-force solution.

I would not repeat the prime gap part, but will instead talk about the primality test. In this problem, a naive $\sqrt{N}$ primality test is enough to pass, but we could do better with [Miller-Rabin](https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test), which runs in $\mathcal{O}(K\log^3N)$ time.

Since $S\leq10^{18}$, the largest number we would need to check will be around $10^9$, in this case, $[2,7,61]$ would be enough to ensure the correctness of the primality test.

:::details Code (C++)

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

### Solution II: Find all primes and binary search 

Since the test cases are bundled, we can also pass Test 3 if we use Euler sieve to generate all primes smaller than $\sqrt{\text{MAXN}}$ optimally, and then use binary search for each query. Note that we need to make $\text{MAXN}$ a bit larger than $10^{18}$ so that we will also generate the smallest prime that is larger than $10^9$.

Note that we need to use `bitset` instead of `bool[]` to save space.

And the complexity:

- Time complexity is $\mathcal{O}(\sqrt{\text{MAXN}}+Q\log\frac{\sqrt{\text{MAXN}}}{\ln\sqrt{\text{MAXN}}})$.
- Space complexity is $\mathcal{O}(\sqrt{\text{MAXN}})$.

:::details Code (C++)

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

The official solution uses segment tree. However, we can also use blocking to solve this problem.

We separate edges into blocks according to their limits $L_i$, and each block will have an optimal size of $\sqrt{N}$.

We first do a depth-first search to gather the information we need. That is, for each node, we would like to know the GCD value of all the edges whose limits are within the same block ($acc[i][j]$ in the code below), along the path from the root (capital city) to the current node. Also, we would like to know the previous edge ($last[i][j]$ in the code below) that has a limit that falls within a certain block, along the path.

For each query, we first determine the block $j$ that $W_i$ belongs to. Then we can safely calculate the GCD value of all the blocks that are smaller than $j$. For the $j$-th block, however, we need to check each edge to find out whether $L_k\leq W_i$, which can be done with the help of the $last$ array.

And the complexity:

- Time complexity is $\mathcal{O}((N+Q)\sqrt{N})$, if the block size is set as $\sqrt{N}$. (In the code below, I used a constant block size of $500$ to avoid discretization.) Also note that all $L_i$ are distinct, so each block with size $\sqrt{N}$ can contain at most $\sqrt{N}$ edges, which ensures the correctness of the time complexity.
- Space complexity is $\mathcal{O}(N\sqrt{N})$.

:::details Code (C++)

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
