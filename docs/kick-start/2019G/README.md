# Google Kick Start 2019 Round G

## Problem A - Book Reading

### 题目描述

有一本$N$页的书，其中缺了$M$页，分别为$P_1, P_2, ..., P_M$。
现在有$Q$个读者，其中的第$i$个读者只会阅读页码数为$R_i$整数倍的那些页（缺失的页除外）。
请统计所有读者阅读的页数总和。

数据范围：
$1\leq M\leq N\leq 10^5, 1\leq Q\leq 10^5$。

### 题解

我们需要的实际上是一个数组`cnt[N+1]`，用于记录从1到N每个数字的整数倍中，缺页的数量。求得`cnt`后，只需要统计$\sum_{i=1}^Q(N/R_i-cnt[R_i])$即可。

#### 思路1 穷举倍数

用一个哈希表`torn[N+1]`记录第$i$页是否损坏，然后我们从1开始，遍历它不超过$N$的所有倍数，记录下损坏的总页数。

时间复杂度为$O(N+N/2+N/3+N/4+...+N/N+Q)\simeq O(N\lg N+Q)$

:::details 参考代码

```cpp
#include <algorithm>
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;
typedef long long ll;

class Solution {

public:
  void solve(int case_num) {
    int n, m, q;
    cin >> n >> m >> q;
    vector<int> cnt(n + 1), torn(n + 1);
    for (int i = 0; i < m; ++i) {
      int p;
      scanf("%d", &p);
      torn[p]++;
    }
    for (int i = 1; i <= n; ++i)
      for (int j = 1; j <= n / i; ++j)
        if (torn[i * j])
          cnt[i]++;

    ll ans = 0;
    for (int i = 0; i < q; ++i) {
      int r;
      scanf("%d", &r);
      ans += n / r - cnt[r];
    }
    cout << "Case #" << case_num << ": " << ans << endl;
  }
};

int main() {
  Solution solution;
  int t;
  cin >> t;

  for (int i = 1; i <= t; ++i)
    solution.solve(i);
}
```

:::

#### 思路2 分解因数

对于每一个缺失的页码$P_i$，将其分解质因数，然后搜索得到其所有的因子$F_1,F_2,...F_k$，给对应的`cnt`加上1。(这是我比赛时用的方法，比前一种方法的工作量要大上不少，也导致了第一题用时比较久，40分钟才过。）

:::details 参考代码

```cpp
#include <algorithm>
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;
typedef long long ll;

vector<int> primes{2, 3, 5, 7};

class Solution {
  void process(int p, vector<ll> &cnt) {
    unordered_map<int, int> factor;
    int i = 0;
    int p0 = p;
    while (p > 1) {
      while (p % primes[i] == 0) {
        factor[primes[i]]++;
        p /= primes[i];
      }
      i++;
      if (primes[i] * primes[i] > p) {
        if (p > 1)
          factor[p]++;
        break;
      }
    }
    vector<int> nums{1};
    for (const auto &f : factor) {
      int n = nums.size();
      for (int j = 0; j < n; ++j) {
        int m = nums[j];
        for (int k = 1; k <= f.second; ++k) {
          m *= f.first;
          nums.emplace_back(m);
        }
      }
    }
    for (int num : nums) {
      cnt[num] += 1;
    }
  }

public:
  void solve(int case_num) {
    int n, m, q;
    cin >> n >> m >> q;
    vector<ll> cnt(n + 1);
    for (int i = 0; i < m; ++i) {
      int p;
      scanf("%d", &p);
      process(p, cnt);
    }

    ll ans = 0;
    for (int i = 0; i < q; ++i) {
      int r;
      scanf("%d", &r);
      ans += n / r - cnt[r];
    }
    cout << "Case #" << case_num << ": " << ans << endl;
  }
};

int main() {
  Solution solution;
  int t;
  cin >> t;

  for (int i = 4; i < 501; ++i) {
    int n = 2 * i + 1;
    int j = 0;
    bool prime = true;
    while (primes[j] * primes[j] <= n) {
      if (n % primes[j] == 0) {
        prime = false;
        break;
      }
      j++;
    }
    if (prime)
      primes.emplace_back(n);
  }

  for (int i = 1; i <= t; ++i)
    solution.solve(i);
}
```

:::

## Problem B - The Equation

### 题目描述

有$N$个非负整数$A_1,A_2,...A_N$，以及一个目标值$M$，请找出满足$\sum_{i=1}^N(A_i \ xor\ k)\leq M$的最大的非负整数$k$。如果不存在这样的$k$，输出-1。

数据范围：$1\leq N\leq 10^3,0\leq M\leq 10^{15},0\leq A_i\leq10^{15}$。

### 题解

这一题的小数据集数据规模非常小，数字上限只到100，所以暴力穷举就可以通过。但这一做法显然对于大数据集是不奏效的。

所有与异或相关的题目，必然要考虑二进制有关的性质。我们首先考虑和式$\sum_{i=1}^N(A_i \ xor\ k)$，不妨看一个例子：

|  数字   | 二进制表示 |
| :-----: | :--------: |
|  A1=15  |  1 1 1 1   |
|  A2=8   |  1 0 0 1   |
|  A3=6   |  0 1 1 0   |
|  A4=3   |  0 0 1 1   |
| 1的个数 |  2 2 3 3   |
| 0的个数 |  2 2 1 1   |
|  -----  |  -------   |
|   k=7   |  0 1 1 1   |

在计算异或和的时候，我们原本是计算$k$与每一个$A_i$的异或值，然后求和。但实际上，通过观察，可以发现，异或计算的每一位是独立的，也即，我们可以计算$k$的每一位与所有$A_i$这一位的异或值，最后对所有的结果求和。

这启发我们用两个数组`ones[64]`和`zeros[64]`统计所有$A_i$二进制表示中每一位上1和0的数量。然后就可以把刚才的和式重写为：

$\sum_{i=0}^{50}2^i\times(ones[i]\times(1-k[i])+zeros[i]\times k[i])$

其中$k$已经写成二进制形式。这里上限取50，是因为$2^{50}>10^{15}$，所以最终的结果不会超过$2^{50}$。

写成这样的形式之后，我们不难找到一条贪心策略。我们从二进制最高位开始，如果这一位上设为1后，可以异或和满足不超过$M$的条件，我们就把这一位设为1，因为这样得到的数一定比把这一位设为0得到的数大。

我们如何判断能不能满足条件呢？对于第$i$位来说，它产生的和是有最小值的，这个最小值就是$\min(ones[i],zeros[i])\times2^i$。所以我们可以预先计算出从第0位到第50位的最小值，并求出累积和`min_val[64]`。

得到这一累积和后，我们就可以很容易地判断某一位上取1之后，后面的位置是否存在一种取法，使得总异或和不超过$M$。只要这一条件能够满足，我们就取1。否则检查取0时能否满足，如果能满足，就取0。如果取0也不行，说明无解。

:::details 参考代码

```cpp
#include <algorithm>
#include <bitset>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

class Solution {
public:
  void solve(int case_num) {
    ll n, m;
    cin >> n >> m;
    vector<ll> a(n), ones(64), zeros(64);
    for (int i = 0; i < n; ++i) {
      ll d;
      cin >> d;
      bitset<64> bs(d);
      for (int j = 0; j < 64; ++j) {
        if (bs[j])
          ones[j]++;
        else
          zeros[j]++;
      }
    }

    vector<ll> min_val(64);
    ll last = 0;
    for (int i = 0; i <= 50; ++i) {
      ll num = (1ll << i);
      last += (ll)min(ones[i], zeros[i]) * num;
      min_val[i] = last;
    }

    ll sum = 0;
    bitset<64> k(0);
    for (int i = 50; i >= 0; --i) {
      ll num = (1ll << i);
      ll one = num * zeros[i];
      ll zero = num * ones[i];
      if (sum + one + (i > 0 ? min_val[i - 1] : 0) <= m) {
        k.set(i);
        sum += one;
      } else if (sum + zero + (i > 0 ? min_val[i - 1] : 0) <= m) {
        sum += zero;
      } else {
        cout << "Case #" << case_num << ": " << -1 << endl;
        return;
      }
    }

    ll ans = k.to_ullong();
    cout << "Case #" << case_num << ": " << ans << endl;
  }
};

int main() {
  Solution solution;
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i)
    solution.solve(i);
}
```

:::

## Problem C - Shifts

### 题目描述

有A和B两个保安，他们要排一个$N$天的值班表。每一天至少要有一个人值班，也可以两个人都值班。A第$i$天值班的快乐值为$A_i$，B第$i$天值班的快乐值为$B_i$。求出一共有多少种排法，可以使得A和B的快乐值总和都不少于$H$。

数据范围：$N\leq 20, 0\leq A_i,B_i,H\leq 10^9$

### 题解

这题有一个很容易看出来的穷举方法。因为要求每一天至少有一个人值班，所以每一天实际上有三种情况：A值班，B值班，或者A、B都值班。那么我们就可以穷举每一天的情况，然后检查是否满足条件。这样的时间复杂度是$O(3^n)$，对于小数据集$N\leq 12$没有问题，但大数据集$N\leq 20$，而$3^{20}$约等于$3.4\times10^9$，显然会超时。

怎么办？

#### 思路1 剪枝

剪枝是搜索类问题中的常用策略。这一题可以怎么剪枝呢？

1. 如果穷举到某一天时，发现即使后面所有天都给A排班，A的快乐值也不够，或者所有天都给B排班，B的快乐值也不够，那么这条分支就不用继续向下搜索了。
2. 如果穷举到某一天时，发现已经满足A和B的快乐值都不少于H，那么剩下来的$k$天一共$3^k$种情况都能满足要求。所以直接累加到总的方法数中，不再继续搜索。

由于本题数据比较弱，使用这两个剪枝条件就可以通过了。

:::details 参考代码

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

vector<ll> three;

class Solution {
  ll ans, n, h;
  vector<ll> ca, cb;

  void dfs(vector<ll> &a, vector<ll> &b, ll asum, ll bsum, int n) {
    if (n == 0) {
      if (asum >= h && bsum >= h)
        ans++;
      return;
    }

    for (int i = 1; i <= 3; ++i) {
      ll na = asum, nb = bsum;
      if (i & 1)
        na += a[n - 1];
      if (i & 2)
        nb += b[n - 1];
      if (ca[n - 1] + na < h || cb[n - 1] + nb < h)
        continue;
      if (na >= h && nb >= h) {
        ans += three[n - 1];
        continue;
      }
      dfs(a, b, na, nb, n - 1);
    }
  }

public:
  void solve(int case_num) {
    cin >> n >> h;
    vector<ll> a(n), b(n);

    ca = vector<ll>(n + 1);
    cb = vector<ll>(n + 1);
    for (int i = 0; i < n; ++i) {
      scanf("%lld", &a[i]);
      ca[i + 1] = ca[i] + a[i];
    }

    for (int i = 0; i < n; ++i) {
      scanf("%lld", &b[i]);
      cb[i + 1] = cb[i] + b[i];
    }

    if (ca[n] < h || cb[n] < h) {
      cout << "Case #" << case_num << ": " << 0 << endl;
      return;
    }

    ans = 0;

    dfs(a, b, 0, 0, n);

    cout << "Case #" << case_num << ": " << ans << endl;
  }
};

int main() {
  Solution solution;
  ll n = 1;
  for (int i = 0; i < 21; ++i) {
    three.emplace_back(n);
    n *= 3l;
  }
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i)
    solution.solve(i);
}
```

:::

#### 思路2 状压DP

朴素穷举的最大问题是底数是3，如果我们能把底数降到2，$2^{20}\simeq10^6$就是一个可以处理的数据规模了。

很容易想到把A和B分开处理。计算A能够满足条件的排法，再计算B能够满足条件的排法。问题是，如何去掉不合法的情况，也即存在没有人站岗的情况的排法？

我们用一个$N$位的二进制数`state`表示A每天的站岗情况，1表示A这天站岗，0表示A这天不站岗。我们先假设A、B不同时站岗。那么A不站岗的时候，B就要站岗。我们可以计算出每一个`state`对应的B得到的快乐值，如果不少于$H$，就记为`f[state]=1`。

接下来，我们需要派生出包含A、B都站岗的情形。对于一个已经满足B的`state`，我们保持B的状态不变，然后将其中的0替换为1，就可以得到所有满足B的快乐值的`(A，B)`状态组。这样可以保证每天至少有一个人站岗。

比如说，如过`state`是`1001`，且满足B的快乐值不少于$H$，那么就可以从`1001`这个`state`，得到了`(1001, 1001)`、`(1101, 1001)`、`(1011, 1001)`、`(1111, 1001)`这几个状态。第二个数，实际上就是B的排班表，不过0和1正好是反过来的，也即0站岗，1不站岗。

为了不重复不遗漏，在派生过程中，我们需要一位一位进行（可以参考代码中这部分内外循环的顺序）。

这样，我们就得到了所有满足B的快乐值不小于$H$的方法，然后，我们再检查是否满足A的快乐值不小于$H$即可。

:::details 参考代码

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

class Solution {

public:
  void solve(int case_num) {
    ll n, h;
    cin >> n >> h;
    ll states = (1 << n);
    vector<ll> a(n), b(n), f(states);

    for (int i = 0; i < n; ++i) {
      scanf("%lld", &a[i]);
    }

    for (int i = 0; i < n; ++i) {
      scanf("%lld", &b[i]);
    }

    // 检查B的快乐值是否被满足。
    for (int i = 0; i < states; ++i) {
      ll sum = 0;
      for (int j = 0; j < n; ++j)
        if (!(i & (1 << j)))
          sum += b[j];
      if (sum >= h)
        f[i]++;
    }

    // 派生B的状态。
    // 注意这里循环的顺序，要把位的循环放在外层，才能保证不重复不遗漏。
    for (int j = 0; j < n; ++j)
      for (int i = 0; i < states; ++i)
        if (i & (1 << j))
          f[i] += f[i ^ (1 << j)];

    // 检查A的快乐值是否被满足。
    ll ans = 0;
    for (int i = 0; i < states; ++i) {
      ll sum = 0;
      for (int j = 0; j < n; ++j)
        if (i & (1 << j))
          sum += a[j];
      if (sum >= h)
        ans += f[i];
    }

    cout << "Case #" << case_num << ": " << ans << endl;
  }
};

int main() {
  Solution solution;
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i)
    solution.solve(i);
}
```

:::
