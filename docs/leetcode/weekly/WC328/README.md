# 第 328 场周赛

## Problem A - [数组元素和与数字和的绝对差](https://leetcode.cn/problems/difference-between-element-sum-and-digit-sum-of-an-array/)

### 方法一：模拟

- 时间复杂度 $\mathcal{O}(N\log C)$。
- 空间复杂度 $\mathcal{O}(N\log C)$。

:::details 参考代码（Python 3）

```python
class Solution:
    def differenceOfSum(self, nums: List[int]) -> int:
        return sum(num - sum(map(int, str(num))) for num in nums)
```

:::

## Problem B - [子矩阵元素加 1](https://leetcode.cn/problems/increment-submatrices-by-one/)

### 方法一：二维差分

- 时间复杂度 $\mathcal{O}(N^2+Q)$。
- 空间复杂度 $\mathcal{O}(N^2)$。

:::details 参考代码（C++）

```cpp
class Solution {
public:
    vector<vector<int>> rangeAddQueries(int n, vector<vector<int>>& queries) {
        vector<vector<int>> diff(n + 1, vector<int>(n + 1));
        for (auto &v : queries) {
            int row1 = v[0], col1 = v[1], row2 = v[2], col2 = v[3];
            diff[row1][col1]++;
            diff[row2 + 1][col1]--;
            diff[row1][col2 + 1]--;
            diff[row2 + 1][col2 + 1]++;
        }
        
        vector<vector<int>> ans(n, vector<int>(n));
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                ans[i][j] += diff[i][j];
                if (i > 0)
                    ans[i][j] += ans[i - 1][j];
                if (j > 0)
                    ans[i][j] += ans[i][j - 1];
                if (i > 0 && j > 0)
                    ans[i][j] -= ans[i - 1][j - 1];
            }
        }
        
        return ans;
    }
};
```

:::

## Problem C - [统计好子数组的数目](https://leetcode.cn/problems/count-the-number-of-good-subarrays/)

### 方法一：双指针

- 时间复杂度 $\mathcal{O}(N)$ 。
- 空间复杂度 $\mathcal{O}(N)$ 。

:::details 参考代码（C++）

```cpp
class Solution {
public:
    long long countGood(vector<int>& nums, int k) {
        unordered_map<int, int> cnt;
        long long now = 0;
        int n = nums.size();
        long long ans = 1LL * n * (n + 1) / 2;
        int l = 0;
        for (int r = 0; r < n; ++r) {
            now += cnt[nums[r]];
            cnt[nums[r]]++;
            while (now >= k) {
                cnt[nums[l]]--;
                now -= cnt[nums[l]];
                l++;
            }
            ans -= r - l + 1;
        }
        return ans;
    }
};
```

:::

## Problem D - [最大价值和与最小价值和的差值](https://leetcode.cn/problems/difference-between-maximum-and-minimum-price-sum/)

### 方法一：DFS

- 时间复杂度 $\mathcal{O}(N)$ 。
- 空间复杂度 $\mathcal{O}(N)$ 。

:::details 参考代码（C++）

```cpp
class Solution {
    int n;
    long long ans;
    vector<int> price;
    vector<vector<int>> adj;
    
    pair<long long, long long> dfs(int u, int p) {
        long long hi = 0, hi_no = -price[u];
        for (int v : adj[u]) {
            if (v == p) continue;
            auto [h, h_no] = dfs(v, u);
            ans = max(ans, hi + h_no + price[u]);
            ans = max(ans, hi_no + h + price[u]);
            hi = max(hi, h);
            hi_no = max(hi_no, h_no);
        }
                
        ans = max(ans, hi);
        return {hi + price[u], hi_no + price[u]};
    }
public:
    long long maxOutput(int n, vector<vector<int>>& edges, vector<int>& price) {
        this->price = price;
        this->n = n;
        adj = vector<vector<int>>(n);
        for (auto &e : edges) {
            int u = e[0], v = e[1];
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
        
        ans = 0;
        dfs(0, -1);
        return ans;
    }
};
```
