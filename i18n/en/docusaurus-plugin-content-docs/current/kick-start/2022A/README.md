# Google Kick Start 2022 Round A Tutorial

Here are my solutions to Google Kick Start 2022 Round A.

## Problem A - [Speed Typing](https://codingcompetitions.withgoogle.com/kickstart/round/00000000008cb33e/00000000009e7021)

### Solution I: Single Pointer

We use a pointer which points to the position to be matched in the target string. We then enumerate the original string and move forward the pointer whenever a match is found.

If the target string is fully matched, the answer will be the difference between the length of the original string and the target string, otherwise there will be no valid answer.

Complexity:

- Time complexity is $\mathcal{O}(|S|+|T|)$
- Space complexity is $\mathcal{O}(1)$

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

### Solution I: Math + Greedy

We know that a number is divided by 9 is equivalent to that its digit sum can be divided by 9. We can quickly determine the digit we need based on this. If the number is already divided by 9, we can add either 0 or 9, but to make the answer the smallest, we will choose 0 instead.

We then look for the position of insertion greedily. We enumerate from to left and find the first position which is larger than the digit to be inserted.

However, when we are inserting 0, we cannot place it at the beginning, so we have to put it in the second place.

Complexity:

- Time complexity is $\mathcal{O}(N)$
- Space complexity is $\mathcal{O}(N)$

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

### Solution I: Dynamic Programming

Any palindrom with length $\ge$ 5 must either contain a 5-character palindrom or a 6-character palindrom. So we can find all the 5- and 6- palindroms and mark them, then maintain the possible situations of the last 6 positions during a dynamic programming.

Complexity:

- Time complexity is $\mathcal{O}(2^K\cdot|S|)$, where $K=5$
- Space complexity is $\mathcal{O}(2^K)$

:::details Code (C++)

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

### Solution I: Digit Dynamic Programming

Such problems that ask for interval $[L,R]$ can usually be transformed to $F(R)-F(L-1)$. In this problem, $F(x)$ means the number of good numbers in the interval $[1,x]$.

Then we can calculate $F(x)$ via digit dynamic programming.

- We need to consider the relationship between digit product and digit sum. When the digit sum is fixed, we only need to record the GCD of the digit product and the digit sum.
- We can only use numbers no larger than $x$. Such problems with an upper bound or a lower bound can be solved by using a flag to denote whether the current prefix is equal to the bound.
- We need an extra flag to denote whether we are still within the leading zeros.

Suppose the upper bound has $N$ digits, then the digit sum cannot exceed $9N$. Then we can enumerate the digit sums. For a fixed digit sum $sum$, we do a 4-dimension DP like $dp[p][s][z][same]$, in which:

- $p$ denotes the GCD of the digit product and $sum$
- $s$ denotes the current digit sum
- $z$ denotes whether the current number is larger than zero
- $same$ denotes whether the current prefix is equal to that of the upper bound

The contribution of this DP to the final answer is $dp[sum][sum][1][0]+dp[sum][sum][1][1]$.

The details of the dynamic programming can be found in the code below.

Complexity:

- Time complexity is $\mathcal{O}(S^{5/2}\cdot ND)$, where $S\le9\times12=108$, $N$ is the length of the upper bound and $D=10$
- Time complexity is $\mathcal{O}(S^2)$

:::details Code (C++)

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
