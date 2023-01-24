# 第 96 场双周赛

## Problem A - [最小公共值](https://leetcode.cn/problems/minimum-common-value/)

### 方法一：暴力

- 时间复杂度 $\mathcal{O}(N)$。
- 空间复杂度 $\mathcal{O}(N)$。

:::details 参考代码（Python 3）

```python
class Solution:
    def getCommon(self, nums1: List[int], nums2: List[int]) -> int:
        s = set(nums1) & set(nums2)
        return -1 if len(s) == 0 else min(s)
```

:::

## Problem B - [使数组中所有元素相等的最小操作数 II](https://leetcode.cn/problems/minimum-operations-to-make-array-equal-ii/)

### 方法一：贪心

:::caution 注意
小心 $k=0$ 的情形！
:::

- 时间复杂度 $\mathcal{O}(N)$。
- 空间复杂度 $\mathcal{O}(N)$。

:::details 参考代码（Python 3）

```python
class Solution:
    def minOperations(self, nums1: List[int], nums2: List[int], k: int) -> int:
        if k == 0:
            return 0 if nums1 == nums2 else -1
        
        pos = 0
        neg = 0
        for a, b in zip(nums1, nums2):
            if (a - b) % k != 0:
                return -1
            if a > b:
                pos += (a - b) // k
            else:
                neg += (b - a) // k
        if pos == neg:
            return pos
        return -1
```

:::

## Problem C - [最大子序列的分数](https://leetcode.cn/problems/maximum-subsequence-score/)

### 方法一：排序 + 堆

- 时间复杂度 $\mathcal{O}(N\log N)$ 。
- 空间复杂度 $\mathcal{O}(N)$ 。

:::details 参考代码（Python 3）

```python
from heapq import heappush, heappop

class Solution:
    def maxScore(self, nums1: List[int], nums2: List[int], k: int) -> int:
        p = [(num, i) for i, num in enumerate(nums2)]
        p.sort(reverse=True)
        
        a = []
        ans = 0
        s = 0
        for num, i in p:
            heappush(a, nums1[i])
            s += nums1[i]
            if len(a) > k:
                d = heappop(a)
                s -= d
            if len(a) == k:
                ans = max(ans, s * num)
        return ans
```

:::

## Problem D - [判断一个点是否可以到达](https://leetcode.cn/problems/check-if-point-is-reachable/)

### 方法一：数学

- 时间复杂度 $\mathcal{O}(\log N)$ 。
- 空间复杂度 $\mathcal{O}(1)$ 。

:::details 参考代码（Python 3）

```python
class Solution:
    def isReachable(self, targetX: int, targetY: int) -> bool:
        return gcd(targetX, targetY).bit_count() == 1
```
