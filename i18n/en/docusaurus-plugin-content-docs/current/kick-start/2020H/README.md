# Google Kick Start 2020 Round H

## Problem A - [Retype](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff49/000000000043adc7)

We only have two options, thus

$$
ans=K-1+\min(N + 1, K - S + N - S + 1)
$$

Time complexity is $O(1)$.

:::details Code (C++)

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
  void solve(int case_num) {
    cout << "Case #" << case_num << ": ";
    long long N, K, S;
    cin >> N >> K >> S;
    cout << K - 1 + min(N + 1, K - S + N - S + 1) << endl;
  }
};

int main() {
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem B - [Boring Numbers](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff49/000000000043b0c6)

All problems such that require counting of numbers within range $[L,R]$ can be transformed into solving for $[0,R]$ and $[0,L]$ separately, and taking their difference as the final answer.

Now suppose $X$ has $D$ digits and we want to count boring numbers within $[0,X]$.

First, let's consider all numbers with $d<D$ digits. For $d$ digits, we can generate $5^d$ boring nubmers since we have $5$ options for each position (the most significant nubmer must be add so it cannot be $0$). So all numbers with $d<D$ digits make a contribution of $\sum_{i<D}5^i$.

Then we consider numbers with $D$ digits and are no larger than $X$.

Start from the most significant digit, and suppose that we are at the $i$-th digit now.

- If $X[i]$ does not satisfy the requirement of parity, we just need to count the digits that are smaller than $X[i]$ and can satisfy the parity (we can precalculate such numbers in $b[X[i]]$), then add to the total number $b[X[i]]\cdot5^{D-i}$. Since for these $b[X[i]]$ numbers, the following $D-i$ digits can be chose arbitrarily. In this case, we can stop right here.
- Otherwise, we first count the digits that are smaller than $X[i]$ and can satisfy the parity (we can precalculate such numbers in $a[X[i]]$) and add to the total number $a[X[i]]\cdot5^{D-i}$. Then we are going to count boring numbers that have exactly same $i$ digits as $X$ and continue our processing. Note that if $i=D$, we need to add $1$ to the total number, since this means $X$ itself is a boring number.

Time complexity is $O(\log R)$ if we exclude the precalculations.

:::details Code (C++)

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;
ll five[20], pre[20];
int a[10] = {0, 0, 1, 1, 2, 2, 3, 3, 4, 4};
int b[10] = {0, 1, 1, 2, 2, 3, 3, 4, 4, 5};

class Solution {
  ll count(ll x) {
    string s = to_string(x);
    int n = s.size();
    ll ans = pre[n - 1];
    for (int i = 1; i <= n; ++i) {
      int c = s[i - 1] - '0';
      if (c % 2 != i % 2) {
        ans += five[n - i] * b[c];
        break;
      } else {
        ans += five[n - i] * a[c];
        if (i == n)
          ans++;
      }
    }
    return ans;
  }

public:
  void solve(int case_num) {
    cout << "Case #" << case_num << ": ";
    ll L, R;
    cin >> L >> R;
    cout << count(R) - count(L - 1) << endl;
  }
};

int main() {
  int t;
  cin >> t;
  five[0] = 1;
  for (int i = 1; i < 20; ++i)
    five[i] = five[i - 1] * 5;
  pre[0] = 0;
  for (int i = 1; i < 20; ++i)
    pre[i] = pre[i - 1] + five[i];
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem C - [Rugby](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff49/000000000043b027)

Apparently, we can solve for $x$ and $y$ independently.

First consider $y$. Since all the people will be in the same row, this becomes a classical problem in which we just need to take the median of $Y_i$ as the meeting place.

Then we consider $x$. It is obvious that once we determine the starting point $x$, the optimal movement is determined. The leftmost person will go to the leftmost cell, and the rest follow.

Thus we can solve this problem via ternary search. In order to prove the correctness, we need to prove that $dist(x)$ has only one extreme point, which is also its minimum point. (If we consider integer points, there might be two, but the two must be $x$ and $x+1$).

Obviously, when $x+N-1\leq\min(X_i)$, $dist(x)$ decreases with $x$. While when $x\geq\max(X_i)$, $dist(x)$ increases with $x$.

We then observe that, when we move the starting point from $x$ to $x+1$, there will be $k(x)$ people who will move $1$ less, and $N-k(x)$ people who will move $1$ more. So $dist(x+1)-dist(x)=N-2\cdot k(x)$. During the process where $x$ moves from $-\infty$ to $\infty$, $k(x)$ goes to $0$ from $N$, and will never increase. So $dist(x+1)-dist(x)$ will increase from $-N$ to $N$ and will never increase. So $dist(x)$ will take its extreme value (also its minimum) at the minimum $x$ that makes $dist(x+1)-dist(x)\geq0$.

The final time complexity is $O(N\log N+N\log MAX)$, in which $MAX$ is our search range.

:::details Code (C++, ternary search)

```cpp
#include <algorithm>
#include <climits>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

class Solution {
public:
  void solve(int case_num) {
    cout << "Case #" << case_num << ": ";
    int N;
    cin >> N;
    vector<int> X(N), Y(N);
    for (int i = 0; i < N; ++i)
      cin >> X[i] >> Y[i];
    sort(Y.begin(), Y.end());
    ll ylo = 0;
    for (int yi : Y)
      ylo += abs(yi - Y[N / 2]);
    sort(X.begin(), X.end());
    ll l = -2e9, r = 2e9;
    ll xlo = LLONG_MAX;
    auto dist = [&](ll start) {
      ll ret = 0;
      int idx = 0;
      for (int xi : X) {
        ret += abs(start + idx - xi);
        idx++;
      }
      xlo = min(xlo, ret);
      return ret;
    };
    while (l <= r) {
      ll ml = l + (r - l) / 3, mr = r - (r - l) / 3;
      ll dl = dist(ml), dr = dist(mr);
      if (dl <= dr)
        r = mr - 1;
      if (dl >= dr)
        l = ml + 1;
    }
    cout << ylo + xlo << endl;
  }
};

int main() {
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

We can also do binary search on $dist(x+1)-dist(x)$, or $k(x)$, and the solution is very similar.

:::details Code (C++, binary search)

```cpp
#include <algorithm>
#include <climits>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

class Solution {
public:
  void solve(int case_num) {
    cout << "Case #" << case_num << ": ";
    int N;
    cin >> N;
    vector<int> X(N), Y(N);
    for (int i = 0; i < N; ++i)
      cin >> X[i] >> Y[i];
    sort(Y.begin(), Y.end());
    ll ylo = 0;
    for (int yi : Y)
      ylo += abs(yi - Y[N / 2]);
    sort(X.begin(), X.end());
    ll l = -2e9, r = 2e9;
    ll xlo = LLONG_MAX;
    auto dist = [&](ll start) {
      ll ret = 0;
      int idx = 0;
      for (int xi : X) {
        ret += abs(start + idx - xi);
        idx++;
      }
      xlo = min(xlo, ret);
      return ret;
    };
    while (l <= r) {
      ll mid = (l + r) / 2;
      ll delta = dist(mid + 1) - dist(mid);
      if (delta >= 0)
        r = mid - 1;
      else
        l = mid + 1;
    }
    cout << ylo + xlo << endl;
  }
};

int main() {
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

Actually, we can also apply the median method on $x$. But we need to substitute $X_i$ with $X_i-i$ after the first sort, and then do a second sort. Detailed explanation can be seen in the [official analysis](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff49/000000000043b027#analysis).

:::details Code (C++, two-pass sorting for $x$)

```cpp
#include <algorithm>
#include <climits>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

class Solution {
public:
  void solve(int case_num) {
    cout << "Case #" << case_num << ": ";
    int N;
    cin >> N;
    vector<int> X(N), Y(N);
    for (int i = 0; i < N; ++i)
      cin >> X[i] >> Y[i];
    sort(Y.begin(), Y.end());
    ll ylo = 0;
    for (int yi : Y)
      ylo += abs(yi - Y[N / 2]);
    sort(X.begin(), X.end());
    for (int i = 0; i < N; ++i)
      X[i] -= i;
    sort(X.begin(), X.end());
    ll xlo = 0;
    for (int xi : X)
      xlo += abs(xi - X[N / 2]);
    cout << ylo + xlo << endl;
  }
};

int main() {
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem D - [Friends](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff49/000000000043aee7)

If we build a graph with the strings, we will have too many edges.

So instead we can build a graph with different letters (in this problem we have $C=26$ letters). We will save this graph in an adjacent matrix.

The initial setting is $d[i][j]=\infty$ and $d[i][i]=0$. Then we enumerate on all $N$ strings. If two different letters $a$ and $b$ both occur in the same string $S$, we set $d[a][b]=d[b][a]=1$. The meaning is that, if we have a string $S'$ with $a$ and another string $S''$ with $b$, we can build a chain $S'\to S\to S''$ which has $1$ middle point.

Then we do Floyd-Warshall on this adjacent matrix. Now $d[i][j]$ means the minimum middle points that are needed to build a chain from $i$ to $j$.

For each query, we enumerate on letters in $S[X_i]$ and $S[Y_i]$, and the final answer will be

$$
\min_{p\in S[X_i],q\in S[Y_i]}d[p][q] + 2
$$

If the answer is $\infty$, we just output $-1$.

The total time complexity is $O((N+Q)L^2+C^3)$, in which $C=26$ is the size of the alphabet.
 
:::details Code (C++)

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;
const int INF = 0x3f3f3f3f;

class Solution {
public:
  void solve(int case_num) {
    cout << "Case #" << case_num << ": ";
    int N, Q;
    cin >> N >> Q;
    vector<string> S(N + 1);
    for (int i = 1; i <= N; ++i)
      cin >> S[i];
    vector<vector<int>> d(26, vector<int>(26, INF));
    for (string s : S)
      for (char c1 : s)
        for (char c2 : s)
          if (c1 != c2)
            d[c1 - 'A'][c2 - 'A'] = 1;
    for (int k = 0; k < 26; ++k)
      for (int i = 0; i < 26; ++i) {
        if (i == k)
          continue;
        for (int j = 0; j < 26; ++j) {
          if (j == i || j == k)
            continue;
          d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
        }
      }

    for (int i = 1; i <= Q; ++i) {
      int X, Y;
      cin >> X >> Y;
      int ans = INF;
      bool found = false;
      for (char c1 : S[X]) {
        for (char c2 : S[Y]) {
          if (c1 == c2) {
            cout << 2 << " ";
            found = true;
            break;
          }
          ans = min(ans, d[c1 - 'A'][c2 - 'A'] + 2);
        }
        if (found)
          break;
      }
      if (!found)
        cout << (ans == INF ? -1 : ans) << " ";
    }
    cout << endl;
  }
};

int main() {
  int t;
  cin >> t;
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::
