# Google Kick Start 2020 Round H

## Problem A - [Retype](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff49/000000000043adc7)

一共只有两种选择，我们直接计算出来对应的耗时，取较小的那个即可。

$$
ans=K-1+\min(N + 1, K - S + N - S + 1)
$$

时间复杂度为$O(1)$。

:::details 参考代码（C++）

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

所有类似这样求$[L,R]$范围内符合条件的数的个数的题目，都可以变为分别求$[0,R]$范围和$[0,L]$范围内的个数，然后二者相减即可得到答案。

如何求$[0,X]$范围内符合条件的数的个数呢？

首先，我们考虑所有位数比$X$小的数。对于一个$d$位数，Boring Number的总个数显然为$5^d$（每一位有$5$个数字可以选择）。所以说，如果$X$有$D$位，那么所有位数比$X$小的数的贡献为$\sum_{i<D}5^i$。

接下来，我们考虑所有小于等于$X$的$D$位数。

我们从最高位开始。假设当前处理到第$i$位。

- 如果$X$在当前位置的数字不符合条件（奇偶性），那么我们只要统计出所有比$X[i]$小的数字中符合条件的数的个数（预设为$b[X[i]]$），然后给总数加上$b[X[i]]\cdot5^{D-i}$即可。因为对于这$b[X[i]]$个数，后面的$D-i$位是可以任意选择的。在这种情况下，我们不需要继续向后处理了。
- 否则，我们首先统计出比$X[i]$小的数字中符合条件的数的个数（预设为$a[X[i]]$），给总数加上$a[X[i]]\cdot5^{D-i}$。接下来，我们还需要考虑第$i$位取为$X[i]$的符合条件的数的个数，继续向后进行即可。需要注意的是，如果$i=D$，我们直接在总数上加上$1$，表示$X$自己就是一个符合条件的数。

时间复杂度为$O(\log R)$（这里没有考虑预处理的时间）。

:::details 参考代码（C++）

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

显然，$x$方向和$y$方向的移动步数是相互独立的。

首先考虑$y$方向。因为最后所有数的$y$是一样的，所以这就变成了一道经典问题，直接取$Y_i$的中位数即可。

接下来考虑$x$方向。显然，在起点确定之后，我们的移动方案也就随之确定——所有人按照$X_i$排序，然后从左到右依次去对应的格子即可。

接下来，我们可以用三分查找的方法求出最后的答案。为了说明三分查找的正确性，我们需要说明距离函数$dist(x)$只有一个极小值，同时这个极小值也是最小值（如果考虑整点，则可能有两个，但这两个点必然是相邻的两个整数）。

显然，当$x+N-1\leq\min(X_i)$时，随着$x$的增大，$dist(x)$总是减小的；而当$x\geq\max(X_i)$时，随着$x$的增大，$dist(x)$总是增大的。

我们发现，当$x$在某一位置时，将起点从$x$移动到$x+1$，有$k(x)$个人的移动距离会减小$1$，同时有$N-k(x)$个人的移动距离会增加$1$，因此$dist(x+1)-dist(x)=N-2\cdot k(x)$。在$x$从$-\infty$移动到$\infty$的过程中，$k(x)$从$N$减小到$0$，并且整个过程中不会增大。所以说，$dist(x+1)-dist(x)$将会从$-N$增加到$N$，并且过程中不会减小。因此，$dist(x)$总会在满足$dist(x+1)-dist(x)\geq0$的最小的$x$处取得极小值，同时也是最小值。

最后的时间复杂度为$O(N\log N+N\log MAX)$，这里的$MAX$为我们进行三分查找的范围。

:::details 参考代码（C++，三分查找）

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

我们也可以对$dist(x+1)-dist(x)$或$k(x)$进行二分查找，方法是类似的。

:::details Code (C++，二分查找)

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

事实上，我们也可以对$x$使用中位数方法。但是，我们需要在第一次排序后，用$X_i-i$替换$X_i$，然后再次排序。[官方题解](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff49/000000000043b027#analysis)给出了很好的解释。

:::details Code (C++，对$x$两次排序)

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

因为最多有$N=5\times10^4$个不同的字符串，所以如果我们以字符串为节点建图，边数的规模会非常大。

转变思路，我们考虑以字母为节点来建图，并用邻接矩阵来表示这个图。初始状态为$d[i][j]=\infty$，$d[i][i]=0$。如果两个不同的字母$a$和$b$同时出现在了一个字符串$S$中，我们就设置$d[a][b]=d[b][a]=1$。这里的含义是，如果我们现在有一个含有$a$的字符串$S'$和另一个含有$b$的字符串$S''$，那么可以通过$S$构建一个链$S'\to S\to S''$，这个链的中间节点有$1$个。

接下来，我们在这个邻接矩阵上跑一遍Floyd算法，从而现在$d[i][j]$就表示$i$到$j$的链的最少的中间节点数。

最后，对于每一个查询，我们遍历$S[X_i]$的字母和$S[Y_i]$的字母的配对，则最后的答案为

$$
\min_{p\in S[X_i],q\in S[Y_i]}d[p][q] + 2
$$

如果结果为$\infty$，则说明无解。

总时间复杂度为$O((N+Q)L^2+C^3)$，其中$C=26$为字母表的大小。
 
:::details 参考代码（C++）

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
