# Google Kick Start 2019 Round C

## Problem A - [Wiggie Walk](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000050ff2/0000000000150aac)

### 题目描述

有一个机器人在方格上按照指令行走，如果当前格子之前已经走过，它会按照指令继续向前走，直到走到一个没走过的格子。给定机器人的起始位置和指令，保证过程中机器人不会碰到方格的边界，求机器人的最终位置。

### 题解

把每行每列已经走过的区间用集合存储，则我们只需要实现两个操作：

- 给定起始位置（行、列）和方向，找出下一个空位置
- 将走到的新位置加入所在行和列的区间集合

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <iostream>
#include <set>
#include <vector>

using namespace std;

// Validated by [LC57](https://leetcode.cn/problems/insert-interval/).
// Need to change "r + 1" to "r" due to difference in the definition of segment.
void insert(set<pair<int, int>> &s, pair<int, int> p) {
  s.insert(p);
  auto it = s.lower_bound(p);
  if (it != s.begin())
    --it;
  int l = it->first, r = it->second;
  ++it;
  while (l <= p.first) {
    if (it == s.end())
      break;
    if (it->first > r + 1) {
      l = it->first;
      r = it->second;
      ++it;
    } else {
      s.erase({l, r});
      r = max(r, it->second);
      ++it;
      s.erase(prev(it));
      s.insert({l, r});
    }
  }
}

int find(set<pair<int, int>> &s, int pos, int type) {
  if (type) {
    auto it = s.lower_bound({pos, pos});
    if (it != s.end() && it->first == pos)
      return it->second + 1;
    --it;
    return it->second + 1;
  } else {
    auto it = s.lower_bound({pos, pos});
    if (it != s.end() && it->first == pos)
      return pos - 1;
    --it;
    return it->first - 1;
  }
}

int main() {
  int t;
  cin >> t;
  for (int case_num = 1; case_num <= t; ++case_num) {
    int n, r, c, sr, sc;
    string s;
    cin >> n >> r >> c >> sr >> sc >> s;
    cout << "Case #" << case_num << ": ";
    vector<set<pair<int, int>>> row(r + 1), col(c + 1);
    insert(row[sr], {sc, sc});
    insert(col[sc], {sr, sr});
    for (char c : s) {
      switch (c) {
      case 'W':
        sc = find(row[sr], sc, 0);
        break;
      case 'E':
        sc = find(row[sr], sc, 1);
        break;
      case 'N':
        sr = find(col[sc], sr, 0);
        break;
      default:
        sr = find(col[sc], sr, 1);
        break;
      }
      insert(row[sr], {sc, sc});
      insert(col[sc], {sr, sr});
    }
    cout << sr << " " << sc << endl;
  }
}
```

:::

## Problem B - [Circuit Board](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000050ff2/0000000000150aae)

### 题目描述

给定一个矩阵，从中划出一个矩形，要求矩形每行的最大值和最小值之差都不超过$K$，求矩形的最大面积。

### 题解

分两步实现。首先对每行进行预处理，得到以$(i,j)$结尾的最长的符合要求的串的长度。接下来对每列求最大矩形面积。

如果第一步使用`set`来维护当前区间的最大和最小值，则总时间复杂度为$O(RC\log C)$。

:::details 参考代码（C++，使用set）

```cpp
#include <iostream>
#include <set>
#include <stack>
#include <vector>

using namespace std;

int main() {
  int t;
  cin >> t;
  for (int case_num = 1; case_num <= t; ++case_num) {
    int r, c, k;
    cin >> r >> c >> k;
    cout << "Case #" << case_num << ": ";
    vector<vector<int>> v(r + 1, vector<int>(c + 1));
    for (int i = 1; i <= r; ++i)
      for (int j = 1; j <= c; ++j)
        cin >> v[i][j];
    vector<vector<int>> f(r + 2, vector<int>(c + 1));
    for (int i = 1; i <= r; ++i) {
      set<pair<int, int>> s;
      int l = 1;
      for (int j = 1; j <= c; ++j) {
        s.emplace(v[i][j], j);
        while (s.rbegin()->first - s.begin()->first > k) {
          if (s.rbegin()->second < s.begin()->second) {
            l = max(l, s.rbegin()->second + 1);
            s.erase(*s.rbegin());
          } else {
            l = max(l, s.begin()->second + 1);
            s.erase(*s.begin());
          }
        }
        f[i][j] = j - l + 1;
      }
    }
    int ans = 0;
    for (int j = 1; j <= c; ++j) {
      stack<pair<int, int>> st;
      for (int i = 1; i <= r + 1; ++i) {
        int l = i;
        while (!st.empty() && f[i][j] < st.top().first) {
          ans = max(ans, st.top().first * (i - st.top().second));
          l = st.top().second;
          st.pop();
        }
        if (st.empty() || st.top().first < f[i][j])
          st.emplace(f[i][j], l);
      }
    }
    cout << ans << endl;
  }
}
```

:::

如果改为用两个单调队列，则总时间复杂度为$O(RC)$。

:::details 参考代码（C++，使用单调队列）

```cpp
#include <deque>
#include <iostream>
#include <stack>
#include <vector>

using namespace std;

int main() {
  int t;
  cin >> t;
  for (int case_num = 1; case_num <= t; ++case_num) {
    int r, c, k;
    cin >> r >> c >> k;
    cout << "Case #" << case_num << ": ";
    vector<vector<int>> v(r + 1, vector<int>(c + 1));
    for (int i = 1; i <= r; ++i)
      for (int j = 1; j <= c; ++j)
        cin >> v[i][j];
    vector<vector<int>> f(r + 2, vector<int>(c + 1));
    for (int i = 1; i <= r; ++i) {
      deque<pair<int, int>> asc, desc;
      int l = 1;
      for (int j = 1; j <= c; ++j) {
        while (!asc.empty() && asc.back().first >= v[i][j])
          asc.pop_back();
        while (!asc.empty() && v[i][j] - asc.front().first > k) {
          l = max(l, asc.front().second + 1);
          asc.pop_front();
        }
        asc.emplace_back(v[i][j], j);
        while (!desc.empty() && desc.back().first <= v[i][j])
          desc.pop_back();
        while (!desc.empty() && desc.front().first - v[i][j] > k) {
          l = max(l, desc.front().second + 1);
          desc.pop_front();
        }
        desc.emplace_back(v[i][j], j);
        f[i][j] = j - l + 1;
      }
    }
    int ans = 0;
    for (int j = 1; j <= c; ++j) {
      stack<pair<int, int>> st;
      for (int i = 1; i <= r + 1; ++i) {
        int l = i;
        while (!st.empty() && f[i][j] < st.top().first) {
          ans = max(ans, st.top().first * (i - st.top().second));
          l = st.top().second;
          st.pop();
        }
        if (st.empty() || st.top().first < f[i][j])
          st.emplace(f[i][j], l);
      }
    }
    cout << ans << endl;
  }
}
```

:::

## Problem C - [Catch Some](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000050ff2/0000000000150a0d)

### 题目描述

在一条直路上有$N$条狗，每条有一个颜色。小明想要观察$K$条狗（不能重复），他必须穿着相同颜色的衣服才能观察某条狗，只有在家（原点）他才能换衣服。

问小明从家出发，观察$K$条狗所需要的最短路程。

### 题解

显然，如果一个计划中包含了多条同种颜色的狗，应当一次性对这些狗进行观察。另一方面，应当优先观察位置最靠前的具有该种颜色的狗。

不难发现，只有最后一次有区别，因为最后一次不需要回头，只用计算一倍路程，而之前的都需要计算双倍路程；而具体先看哪种颜色后看哪种颜色对结果并没有影响。

直接的想法是枚举最后一次看的狗的颜色然后进行$N$次动态规划，这样复杂度就多了一个$N$，但是如果代码有一定优化，也可能通过大测试集。

更好的办法是在动态规划中加一个标志位，$dp[i][0]$表示当前看了$i$条狗，还没有进行最后一次观察的最短路程；$dp[i][1]$表示当前看了$i$条狗，已经进行了最后一次观察的最短路程（我们可以假想把最后一次观察提到前面进行）。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <vector>

using namespace std;

int main() {
  int t;
  cin >> t;
  for (int case_num = 1; case_num <= t; ++case_num) {
    cout << "Case #" << case_num << ": ";
    int n, k;
    cin >> n >> k;
    vector<pair<int, int>> dogs(n);
    for (int i = 0; i < n; ++i)
      cin >> dogs[i].first;
    for (int i = 0; i < n; ++i)
      cin >> dogs[i].second;
    sort(dogs.begin(), dogs.end());
    map<int, vector<int>> c;
    for (auto dog : dogs)
      c[dog.second].emplace_back(dog.first);
    vector<vector<int>> vc;
    for (auto p : c)
      vc.push_back(p.second);
    vector<vector<int>> dp(k + 1, vector<int>(2, 1e9));
    dp[0][0] = 0;
    for (int i = 0; i < vc.size(); ++i) {
      vector<vector<int>> ndp(dp);
      for (int j = 0; j < vc[i].size(); ++j) {
        for (int s = k; s >= j + 1; --s) {
          ndp[s][0] = min(ndp[s][0], dp[s - j - 1][0] + 2 * vc[i][j]);
          ndp[s][1] = min(ndp[s][1], min(dp[s - j - 1][1] + 2 * vc[i][j],
                                         dp[s - j - 1][0] + vc[i][j]));
        }
      }
      dp = move(ndp);
    }
    cout << dp[k][1] << endl;
  }
}
```

:::
