# Google Kick Start 2022 Round A

## Problem A - [Speed Typing](https://codingcompetitions.withgoogle.com/kickstart/round/00000000008cb33e/00000000009e7021)

### 方法一：单指针

我们用单指针指向目标串的当前待匹配位置，然后遍历原串。如果原串中的字符与当前待匹配的字符相同，则将指针后移。

如果最后完全匹配成功，答案就是原串和目标串的长度差。否则无解。

复杂度：

- 时间复杂度为$\mathcal{O}(|S|+|T|)$。
- 空间复杂度为$\mathcal{O}(1)$。

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

    string s, f;
    cin >> f >> s;

    int ptr = 0;
    for (char ch : s) {
      if (ptr < f.size() && ch == f[ptr]) ptr++;
    }

    if (ptr == f.size())
      printf("%d\n", (int)s.size() - (int)f.size());
    else
      printf("IMPOSSIBLE\n");
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

## Problem B - [Challenge Nine](https://codingcompetitions.withgoogle.com/kickstart/round/00000000008cb33e/00000000009e7997)

### 方法一：数学+贪心

我们知道能够一个数能被 9 整除，等价于其各位之和也能被 9 整除。因此我们首先可以找出需要填补的那个数字。如果原本已经能被 9 整除，那么我们可以添加 0 也可以添加 9。为了让得到的新数字最小，我们显然应该添加 0。

对于具体的插入位置，我们可以贪心寻找：如果原数的某个位置比我们将要插入的这个数字大，那么我们将新数字插入在它前面的结果一定是最优的。

需要特别注意的是，如果要插入的数字是 0，我们不能将它放在开头，而只能放在第一个数字之后。

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

    string N;
    cin >> N;
    int sum = 0;
    for (char ch : N) sum += ch - '0';
    int need = (9 - sum % 9) % 9;
    if (need == 0) {
      cout << N[0] << '0' << N.substr(1) << endl;
      return;
    }
    int n = N.size();
    for (int i = 0; i < n; ++i) {
      if (N[i] > (need + '0')) {
        cout << N.substr(0, i) << (char)(need + '0') << N.substr(i, n - i)
             << endl;
        return;
      }
    }
    cout << N << (char)(need + '0') << endl;
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

## Problem C - [Palindrome Free Strings](https://codingcompetitions.withgoogle.com/kickstart/round/00000000008cb33e/00000000009e762e)

### 方法一：动态规划

任何一个长度不小于 5 的回文串，必然包含一个长度为 5 的回文串，或包含一个长度为 6 的回文串。因此，我们首先找出所有长度为 5 和 6 的回文串并记录，然后在动态规划过程中维护当前最后六位的可能情况即可。

复杂度：

- 时间复杂度为$\mathcal{O}(2^K\cdot|S|)$，其中 $K=5$。
- 空间复杂度为$\mathcal{O}(2^K)$。

:::details 参考代码（C++）

```cpp
#include <bitset>
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;
const int K = 5;
const int MSK1 = (1 << K) - 1;
const int MSK = (1 << (K + 1)) - 1;

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

bool bad1[1 << K]{};
bool bad[1 << (K + 1)]{};

class Solution {
 public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);

    int n;
    string s;
    cin >> n >> s;

    if (n <= 4) {
      cout << "POSSIBLE" << endl;
      return;
    }

    vector<bool> dp(1 << (K + 1));
    dp[0] = true;
    for (int i = 0; i < n; ++i) {
      vector<bool> ndp(1 << (K + 1));
      if (s[i] == '0' || s[i] == '?') {
        for (int j = 0; j <= MSK; ++j) {
          if (!dp[j]) continue;
          int nxt1 = (j << 1) & MSK1;
          if (i >= 4 && bad1[nxt1]) continue;
          int nxt = (j << 1) & MSK;
          if (i >= 5 && bad[nxt]) continue;
          ndp[nxt] = true;
        }
      }
      if (s[i] == '1' || s[i] == '?') {
        for (int j = 0; j <= MSK; ++j) {
          if (!dp[j]) continue;
          int nxt1 = ((j << 1) & MSK1) + 1;
          if (i >= 4 && bad1[nxt1]) continue;
          int nxt = ((j << 1) & MSK) + 1;
          if (i >= 5 && bad[nxt]) continue;
          ndp[nxt] = true;
        }
      }
      dp = move(ndp);
    }

    for (int i = 0; i < MSK; ++i) {
      if (dp[i]) {
        cout << "POSSIBLE" << endl;
        return;
      }
    }

    cout << "IMPOSSIBLE" << endl;
  }
};

bool is_palindrom(string s) {
  string t(s.rbegin(), s.rend());
  return s == t;
}

int main() {
  for (int i = 0; i < (1 << K); i++) {
    string s = bitset<K>(i).to_string();
    if (is_palindrom(s)) bad1[i] = true;
  }

  for (int i = 0; i < (1 << (K + 1)); i++) {
    string s = bitset<K + 1>(i).to_string();
    if (is_palindrom(s)) bad[i] = true;
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

## Problem D - [Interesting Integers](https://codingcompetitions.withgoogle.com/kickstart/round/00000000008cb33e/00000000009e73ea)

### 方法一：数位动态规划

这种 $[L, R]$ 区间的问题，一般都可以转化为 $F(R)-F(L-1)$，本题中 $F(x)$ 表示 $[1,x]$ 范围内满足要求的数的个数。

下面考虑如何求 $F(x)$。这种问题的一般求解方法是数位 DP。

- 我们需要考察数位积与数位和的关系。在数位和一定的情况下，我们只需要记录当前数位积与数位和的最大公约数即可。
- 我们得到的数不能超过 $x$，这种有上限/下限的问题，可以用一个标志位来记录当前前缀是否与上限/下限相等，并分别处理。
- 前缀的零不参与乘积。所以我们还需要一个标志位来记录当前数是否已经大于零。

假设上限为 $N$ 位，显然数位和的最大值为 $9N$。那么，我们可以枚举数位和 $sum$，对于每一个确定的数位和，我们进行形如 $dp[p][s][z][same]$ 的四维 DP，其中：

- $p$ 表示当前数位积与目标数位和 $sum$ 的最大公约数
- $s$ 表示当前数位和
- $z$ 为当前是否大于零的标志位
- $same$ 为当前前缀是否与上限相等的标志位

之后，从上限的第一位到最后一位依次进行动态规划的计算即可。这一次动态规划对最后答案的贡献为 $dp[sum][sum][1][0]+dp[sum][sum][1][1]$。具体的转移可以参考代码。

复杂度：

- 时间复杂度为$\mathcal{O}(S^{5/2}\cdot ND)$，其中 $S\le9\times12=108$，$N$ 为上限的位数，$D=10$。
- 空间复杂度为$\mathcal{O}(S^2)$。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <cstring>
#include <iostream>
#include <vector>

using namespace std;
using ll = long long;

int gcd(int a, int b) {
  if (b == 0) return a;
  return gcd(b, a % b);
}

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

ll gcd_[1200][120];
ll dp[120][120][2][2];

class Solution {
  ll calc(ll num) {
    if (num == 0) return 0;

    string S = to_string(num);
    int n = S.size();
    int max_sum = 9 * n;

    ll ans = 0;
    for (int sum = 1; sum <= max_sum; ++sum) {
      memset(dp, 0, sizeof(dp));
      dp[0][0][0][1] = 1;
      for (int i = 0; i < n; ++i) {
        int si = S[i] - '0';
        for (int p = sum; p >= 0; --p) {
          // Optimization 1: p can only be 0 or a factor of sum
          if (p != 0 && sum % p != 0) continue;
          for (int s = min(sum, i * 9); s >= 0; --s) {
            ll v00 = dp[p][s][0][0], v01 = dp[p][s][0][1], v10 = dp[p][s][1][0],
               v11 = dp[p][s][1][1];
            // Optimization 2: all are 0 so have no future effects
            if (v00 + v01 + v10 + v11 == 0) continue;
            dp[p][s][0][0] = dp[p][s][0][1] = dp[p][s][1][0] = dp[p][s][1][1] =
                0;

            // Enumerate choice of the current position
            for (int nxt = 0; nxt <= 9; ++nxt) {
              int np = gcd_[max(p, 1) * nxt][sum];
              int ns = s + nxt;

              // Case 1: z == 0 && same == 0
              if (nxt == 0)
                dp[p][s][0][0] += v00;
              else if (s + nxt <= sum)
                dp[np][ns][1][0] += v00;

              // Case 2: z == 0 && same == 1
              if (nxt == 0) {
                dp[p][s][0][0] += v01;
              } else {
                if (nxt < si && ns <= sum) {
                  dp[np][ns][1][0] += v01;
                } else if (nxt == si && ns <= sum) {
                  dp[np][ns][1][1] += v01;
                }
              }

              // Case 3: z == 1 && same == 0
              if (ns <= sum) dp[np][ns][1][0] += v10;

              // Case 4: z == 1 && same == 1
              if (nxt < si && ns <= sum) {
                dp[np][ns][1][0] += v11;
              } else if (nxt == si && ns <= sum) {
                dp[np][ns][1][1] += v11;
              }
            }
          }
        }
      }
      ans += dp[sum][sum][1][0] + dp[sum][sum][1][1];
    }

    return ans;
  }

 public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    ll A, B;
    read(A), read(B);
    cout << calc(B) - calc(A - 1) << endl;
  }
};

int main() {
  int t;
  read(t);

  // Optimization 3: Precalculate GCDs
  for (int i = 0; i < 1200; ++i)
    for (int j = 0; j < 120; ++j) gcd_[i][j] = gcd(i, j);

  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::
