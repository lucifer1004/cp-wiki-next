# Google Kick Start 2019 Round D

## Problem A - [X or What?](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000051061/0000000000161426)

### 题目描述

有$N$个数，进行$Q$次单点修改，在每次修改后，给出当前异或和的二进制表示中$1$的个数为偶数的最长子数组的长度。

### 题解

观察“异或奇”和“异或偶”的运算性质，可以发现其与奇偶数在加法中的运算性质类似，奇奇或偶偶为偶，奇偶或偶奇为奇。

如果当前所有数的异或和为“异或偶”，那么显然应该回答$N$。否则，我们应当找到左侧第一个“异或奇”和右侧第一个“异或奇”，然后比较剩下部分的长度，选择较长的那一段。用一个`set`维护当前所有“异或奇”的位置即可。

:::details 参考代码（C++）

```cpp
#include <bitset>
#include <iostream>
#include <set>
#include <vector>

using namespace std;

inline int odd(int x) { return bitset<12>(x).count() % 2; }

int main() {
  int t;
  cin >> t;
  for (int case_num = 1; case_num <= t; ++case_num) {
    cout << "Case #" << case_num << ": ";
    int n, q;
    cin >> n >> q;
    vector<int> a(n);
    set<int> odds;
    int tot = 0;
    for (int i = 0; i < n; ++i) {
      int ai;
      cin >> ai;
      a[i] = odd(ai);
      tot += a[i];
      if (a[i])
        odds.insert(i);
    }
    for (int i = 0; i < q; ++i) {
      int p, v;
      cin >> p >> v;
      int new_val = odd(v);
      tot += new_val - a[p];
      if (a[p])
        odds.erase(p);
      if (new_val)
        odds.insert(p);
      a[p] = new_val;
      int ans = tot % 2 == 0 ? n : max(*odds.rbegin(), n - *odds.begin() - 1);
      cout << ans << " ";
    }
    cout << endl;
  }
}
```

:::

## Problem B - [Latest Guests](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000051061/0000000000161427)

### 题目描述

有$N$座塔楼围成环形，$G$个游客各自从某一塔楼出发，有一些人按照顺时针行进，另一些人按照逆时针行进。所有人的速度都一样，所有塔楼之间距离都相等，每过一分钟，所有人都会到达其方向上的下一座塔楼。每个塔楼的守卫只会记住最后一次来访的客人，如果最后一次是多人来访，他会记住所有的客人。求过了$M$分钟后，每个客人被多少个守卫记住。

### 题解

这道题的关键是想到把顺时针和逆时针的人分开处理。

对于一个方向的人，我们可以计算出他们各自的最终位置，然后从任意一个最终位置开始倒推，如果碰到的塔楼里最后来访时间还未被更新，就将其更新。

两个方向都计算完毕后，我们只要比较同一个塔楼被顺时针访问到的最后时间和逆时针访问到的最后时间哪一个更靠后即可。

:::tip 小贴士

所有起点相同方向也相同的人可以合并成一个进行处理。

:::

:::details 参考代码（C++）

```cpp
#include <iostream>
#include <map>
#include <vector>

using namespace std;

int main() {
  int t;
  cin >> t;
  for (int case_num = 1; case_num <= t; ++case_num) {
    cout << "Case #" << case_num << ": ";
    int n, g, m;
    cin >> n >> g >> m;
    map<int, int> C, A;
    vector<pair<int, int>> ct(n, make_pair(-1, -1)), at(n, make_pair(-1, -1));
    vector<pair<int, char>> p;
    for (int i = 0; i < g; ++i) {
      int hi;
      char c;
      cin >> hi >> c;
      hi--;
      p.emplace_back(hi, c);
      if (c == 'C')
        C[hi] = 0;
      else
        A[hi] = 0;
    }

    // Handle clockwise
    int pos = -1;
    for (auto pc : C) {
      int pe = (pc.first + m) % n;
      ct[pe] = {pc.first, m};
      if (pos == -1)
        pos = pe;
    }
    if (pos != -1) {
      int lp = ct[pos].first, lt = ct[pos].second;
      for (int i = 1; i < n; ++i) {
        lt--, pos--;
        if (pos < 0)
          pos = n - 1;
        if (lt > ct[pos].second)
          ct[pos] = make_pair(lp, lt);
        else
          lp = ct[pos].first, lt = ct[pos].second;
      }
    }

    // Handle anticlockwise
    pos = -1;
    for (auto pc : A) {
      int pe = (pc.first - m) % n;
      if (pe < 0)
        pe += n;
      at[pe] = {pc.first, m};
      if (pos == -1)
        pos = pe;
    }
    if (pos != -1) {
      int lp = at[pos].first, lt = at[pos].second;
      for (int i = 1; i < n; ++i) {
        lt--, pos++;
        if (pos >= n)
          pos = 0;
        if (lt > at[pos].second)
          at[pos] = make_pair(lp, lt);
        else
          lp = at[pos].first, lt = at[pos].second;
      }
    }

    // Compare the latest clockwise guest and anticlockwise guest.
    for (int i = 0; i < n; ++i) {
      if (at[i].second > ct[i].second)
        A[at[i].first]++;
      else if (at[i].second < ct[i].second)
        C[ct[i].first]++;
      else {
        A[at[i].first]++;
        C[ct[i].first]++;
      }
    }
    for (int i = 0; i < g; ++i) {
      if (p[i].second == 'C')
        cout << C[p[i].first] << " ";
      else
        cout << A[p[i].first] << " ";
    }
    cout << endl;
  }
}
```

:::

## Problem C - [Food Stalls](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000051061/0000000000161476)

### 题目描述

一条直线上有$N$个备选位置，要从中选出$K+1$个位置，$K$个用于建设商铺，还有$1$个用于建设仓库。建设的总代价为所有位置的代价总和，再加上所有商铺到仓库的距离之和。求最小代价。

### 题解

容易联想到一道经典题目：一条直线上有$N$个点，找出一个点，使得所有点到其距离之和最短。对应的方法是找中位数。那么，本题是否可以借鉴这一思想呢？

因为我们只要考虑商铺到仓库的距离，而不需要考虑商铺之间的距离，所以仓库就扮演了中位数的角色。不妨枚举仓库的位置，然后从左边找出$\left\lceil\frac{K}{2}\right\rceil$个代价（建设+运输）最小的位置，右边找出$\left\lfloor\frac{K}{2}\right\rfloor$个代价最小的位置。我们可以用堆来维护当前的最优值。一开始，左边的堆中没有多余元素，而右边可能存在多余元素，因此右边需要一个额外的堆来存放多余元素，因为之后随着仓库位置的右移，右边的堆中可能有元素被删除，需要从额外堆中取出元素来进行补充。

随着仓库位置的移动，原来仓库位置的点需要加入左边的堆中。这时左边所有点与仓库的距离增大了，但我们不能修改堆中的点，而是应该逆向修改新加入堆中的点，同时记下这个修改值。同理，右边点与仓库的距离减小了，但因为右边没有新增元素，所以我们直接使用全局维护的变化值即可。

在仓库位置从左到右遍历的过程中，我们就可以找到全局的最小代价。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <iostream>
#include <set>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int t;
  cin >> t;
  for (int case_num = 1; case_num <= t; ++case_num) {
    cout << "Case #" << case_num << ": ";
    int k, n;
    cin >> k >> n;
    k++;
    vector<pair<int, int>> pos(n);
    for (int i = 0; i < n; ++i)
      cin >> pos[i].first;
    for (int i = 0; i < n; ++i)
      cin >> pos[i].second;
    sort(pos.begin(), pos.end());
    ll ans = 1e18;
    int L = k / 2, R = k - k / 2 - 1;
    ll lsum = 0, rsum = 0;
    set<pair<ll, int>> lheap, rheap, r2;
    vector<ll> c(n);
    for (int i = 0; i < L; ++i) {
      ll cost = pos[i].second + pos[L].first - pos[i].first;
      c[i] = cost;
      lheap.emplace(cost, i);
      lsum += cost;
    }
    for (int i = L + 1; i < n; ++i) {
      ll cost = pos[i].second + pos[i].first - pos[L].first;
      c[i] = cost;
      rheap.emplace(cost, i);
      rsum += cost;
      if (rheap.size() > R) {
        r2.insert(*rheap.rbegin());
        rsum -= rheap.rbegin()->first;
        rheap.erase(*rheap.rbegin());
      }
    }
    ll extra = 0;
    for (int mid = L; mid + R < n; ++mid) {
      ans = min(ans, lsum + extra * (L - R) + rsum + pos[mid].second);
      if (mid + 1 < n) {
        lheap.emplace(pos[mid].second - extra, mid);
        lsum += pos[mid].second - extra;
        lsum -= lheap.rbegin()->first;
        lheap.erase(*lheap.rbegin());
        if (rheap.count(make_pair(c[mid + 1], mid + 1))) {
          rheap.erase(make_pair(c[mid + 1], mid + 1));
          rsum -= c[mid + 1];
          rheap.insert(*r2.begin());
          rsum += r2.begin()->first;
          r2.erase(*r2.begin());
        } else {
          r2.erase(make_pair(c[mid + 1], mid + 1));
        }
        extra += pos[mid + 1].first - pos[mid].first;
      }
    }
    cout << ans << endl;
  }
}
```

:::
