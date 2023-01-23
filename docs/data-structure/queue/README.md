# 队列

队列（Queue）是一种具有先进先出特性的线性数据结构。

## 用栈实现队列

部分语言（比如JavaScript）的标准库没有提供队列实现，如果直接用数组之类的数据结构，那么模拟出队操作的时间复杂度会是$\mathcal{O}(N)$，这是我们所不能接受的。

用链表来实现队列是一种可行的操作。但更简单的办法是利用标准库中已有的数组数据结构，用两个栈来模拟队列。原理很简单，栈是后入先出（LIFO）的，但再加上一个栈，负负得正，就得到了我们需要的先入先出（FIFO）性质，同时，出队操作的复杂度在均摊意义下是$\mathcal{O}(1)$的。

练习：[LC232 - 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)。

## 双端队列

双端队列（Deque）是可以在两端进行插入和弹出操作的线性数据结构。

## 单调队列

单调队列（Monotonic Queue）在数据结构层面就是最普通的队列（或双端队列），但我们需要在新元素入队时维护队列的单调性，使队列中的元素始终保持升序或降序。在一类与区间有关的问题中，单调队列可以实现$O(N)$的复杂度，因为每个元素至多入队和出队一次。

## 练习题

### [LC862 - 和至少为K的最短子数组](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/)

:::details 提示一

计算前缀和。

:::

:::details 提示二

用单调队列维护单调递增的前缀和。注意，如果最左端的一个元素已经被使用过，那么后面不会再使用它（因为后面使用它得到的区间长度一定比当前得到的区间长度更长）。

:::

:::details 参考代码（C++）

```cpp
typedef long long ll;

class Solution {
public:
    int shortestSubarray(vector<int>& A, int K) {
        int n = A.size();
        vector<ll> s(n + 1);
        for (int i = 1; i <= n; ++i)
            s[i] = s[i - 1] + A[i - 1];
        deque<int> dq;
        int ans = n + 1;
        for (int i = 0; i <= n; ++i) {
            while (!dq.empty() && s[dq.back()] >= s[i])
                dq.pop_back();
            while (!dq.empty() && s[dq.front()] + K <= s[i]) {
                ans = min(ans, i - dq.front());
                dq.pop_front();
            }
            dq.push_back(i);
        }
        return ans == n + 1 ? -1 : ans;
    }
};
```

:::

### [KS2019C2 - Circuit Board](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000050ff2/0000000000150aae)

:::details 提示一

求出第$i$行以$(i,j)$结尾的最长的合法长度。因为有$k$的限制，我们需要知道区间最大值和最小值，并且在指针移动过程中，我们需要对其进行更新。用`set`是一种可行的策略，还有更优的方法吗？

:::

:::details 提示二

使用两个单调双端队列，一个升序，一个降序。

:::

:::details 提示三

对于每一列求解最大矩形面积问题。

:::

:::details 参考代码（C++）

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

### [BS - Bunnyhopping](https://binarysearch.com/problems/Bunnyhopping)

:::details 提示
考虑第$i$个位置，我们需要找到$[i-k,i-1]$这一段区间内的最小成本。也即，我们需要维护一个滑动窗口的最小值。
:::

:::details 参考代码（C++）

```cpp
#include "solution.hpp"
using namespace std;
const int INF = 0x3f3f3f3f;

class Solution {
    public:
    int solve(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> cost(n, INF);
        cost[0] = nums[0];
        deque<int> dq;
        dq.push_back(0);
        for (int i = 1; i < n; ++i) {
            while (!dq.empty() && i - dq.front() > k)
                dq.pop_front();
            cost[i] = cost[dq.front()] + nums[i];
            while (!dq.empty() && cost[dq.back()] >= cost[i])
                dq.pop_back();
            dq.push_back(i);
        }
        return cost[n - 1];
    }
};
```

:::

### [BS - Longest Equivalent Sublist After K Increments](https://binarysearch.io/problems/Longest-Equivalent-Sublist-After-K-Increments)

:::details 提示一
我们需要计算当前一段区间$[L,R]$所需要的操作次数。固定$L$不变，如果我们增大$R$，区间的最大值只会增大，那么需要的操作次数也一定增加。可以考虑使用双指针算法。
:::

:::details 提示二
可以利用单调队列维护区间内的最大值。
:::

:::details 参考代码（C++）

```cpp
#include "solution.hpp"
using namespace std;


class Solution {
    public:
    int solve(vector<int>& nums, int k) {
        int ans = 0;
        int n = nums.size();
        int l = 0, sum = 0;
        deque<int> q;
        auto check = [&](int len, int s){
            if (q.empty())
                return true;
            int need = nums[q.front()] * len - s;
            return need <= k;
        };
        for (int r = 0; r < n; ++r) {
            sum += nums[r];
            while (!q.empty() && nums[q.back()] <= nums[r])
                q.pop_back();
            q.push_back(r);
            while (!check(r - l + 1, sum)) {
                sum -= nums[l];
                l++;
                while (!q.empty() && q.front() < l)
                    q.pop_front();
            }
            ans = max(ans, r - l + 1);
        }
        return ans;
    }
};
```

:::
