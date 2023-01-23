# AtCoder Beginner Contest 174

## Problem A - Air Conditioner

过水，略。

## Problem B - Distance

过水，略。

## Problem C - Repsept

暴力，略。

## Problem D - Alter Altar

### 题目描述

一个`R`-`W`串，可以进行两种操作：1. 交换任意两个字符，2. 改变任意一个字符。问最少操作几次，可以使得串中不包含`WR`？

### 题解

可以发现，使用操作1总不劣于操作2的。最终需要把串变为`R...RW...W`的形式，所以先统计`R`的个数$r$，然后统计前$r$个字符中`R`的个数$r'$，最后的结果就是$\Delta r=r-r'$。

## Problem E - Logs

### 题目描述

有$N$根木条，每条长为$L_i$，最多锯$K$次，问锯完后最长的木条最短有多长（结果进位为整数）。

### 题解

经典二分。二分查找最后的答案，判断所需要的次数是否超过$K$次。

:::details 参考代码（C++）

```cpp
#include <algorithm>
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
    int n, k;
    read(n), read(k);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    ll l = 1, r = *max_element(a.begin(), a.end());
    while (l <= r) {
      ll mid = l + (r - l) / 2;
      ll req = 0;
      for (int i : a)
        req += (i - 1) / mid;
      if (req > k)
        l = mid + 1;
      else
        r = mid - 1;
    }
    printf("%lld", l);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  Solution solution = Solution();
  solution.solve();
}
```

:::

## Problem F - Range Set Query

### 题目描述

给定数组$A$，进行$Q$次询问，每次需要回答$[L_i,R_i]$区间内不同数字的个数。

### 题解

经典题。离线做法是按查询区间右端点排序然后依次处理，过程中用树状数组记录和更新当前状态。同一个数字，只有最后一次出现是有效的。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>

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

template <class T> class FenwickTree {
  int limit;
  vector<T> arr;

  T lowbit(T x) { return x & (-x); }

public:
  FenwickTree(int limit) {
    this->limit = limit;
    arr = vector<T>(limit + 1);
  }

  void update(int idx, T delta) {
    for (; idx <= limit; idx += lowbit(idx))
      arr[idx] += delta;
  }

  T query(int idx) {
    T ans = 0;
    for (; idx > 0; idx -= lowbit(idx))
      ans += arr[idx];
    return ans;
  }
};

class Solution {
public:
  void solve() {
    int n, q;
    read(n), read(q);
    vector<int> a(n + 1);
    for (int i = 1; i <= n; ++i)
      read(a[i]);
    vector<pair<int, int>> queries;
    for (int i = 0; i < q; ++i) {
      int l, r;
      read(l), read(r);
      queries.emplace_back(l, r);
    }
    vector<int> order(q);
    for (int i = 0; i < q; ++i)
      order[i] = i;
    sort(order.begin(), order.end(),
         [&](int i, int j) { return queries[i].second < queries[j].second; });
    vector<int> ans(q);
    vector<int> pos(n + 1);
    int last = 0;
    FenwickTree<int> ft(n);
    for (int i = 0; i < q; ++i) {
      int k = order[i];
      int l = queries[k].first, r = queries[k].second;
      for (int j = last + 1; j <= r; ++j) {
        if (pos[a[j]] != 0)
          ft.update(pos[a[j]], -1);
        ft.update(j, 1);
        pos[a[j]] = j;
      }
      ans[k] = ft.query(r) - ft.query(l - 1);
      last = r;
    }
    for (int i : ans)
      printf("%d\n", i);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  Solution solution = Solution();
  solution.solve();
}
```

:::
