# 第 46 场双周赛

## Problem A - [最长的美好子字符串](https://leetcode.cn/problems/longest-nice-substring/)

### 方法一：双指针

- 时间复杂度 $\mathcal{O}(N|\Sigma|)$。
- 空间复杂度 $\mathcal{O}(|\Sigma|)$。

:::details 参考代码（C++）

```cpp
class Solution {
public:
    string longestNiceSubstring(string s) {
        int maxPos = 0, maxLen = 0;
        auto check = [&](int typeNum) {
            vector<int> lowerCnt(26);
            vector<int> upperCnt(26);
            int cnt = 0;
            for (int l = 0, r = 0, total = 0; r < s.size(); ++r) {
                int idx = tolower(s[r]) - 'a';
                if (islower(s[r])) {
                    ++lowerCnt[idx];
                    if (lowerCnt[idx] == 1 && upperCnt[idx] > 0) {
                        ++cnt;
                    }
                } else {
                    ++upperCnt[idx];
                    if (upperCnt[idx] == 1 && lowerCnt[idx] > 0) {
                        ++cnt;
                    }
                }
                total += (lowerCnt[idx] + upperCnt[idx]) == 1 ? 1 : 0;

                while (total > typeNum) {
                    idx = tolower(s[l]) - 'a';
                    total -= (lowerCnt[idx] + upperCnt[idx]) == 1 ? 1 : 0;
                    if (islower(s[l])) {
                        --lowerCnt[idx];
                        if (lowerCnt[idx] == 0 && upperCnt[idx] > 0) {
                            --cnt;
                        }
                    } else {
                        --upperCnt[idx];
                        if (upperCnt[idx] == 0 && lowerCnt[idx] > 0) {
                            --cnt;
                        }
                    }
                    ++l;
                }
                if (cnt == typeNum && r - l + 1 > maxLen) {
                    maxPos = l;
                    maxLen = r - l + 1;
                }
            }
        };

        int mask = 0;
        for (char & ch : s) {
            mask |= 1 << (tolower(ch) - 'a');
        }
        int types = __builtin_popcount(mask);
        for (int i = 1; i <= types; ++i) {
            check(i);
        }
        return s.substr(maxPos, maxLen);
    }
};
```

:::

## Problem B - [通过连接另一个数组的子数组得到一个数组](https://leetcode.cn/problems/form-array-by-concatenating-subarrays-of-another-array/)

### 方法一：KMP

- 时间复杂度 $\mathcal{O}(\sum G_i+N)$。
- 空间复杂度 $\mathcal{O}(\sum G_i+N)$。

:::details 参考代码（C++）

```cpp
class Solution {
public:
    bool canChoose(vector<vector<int>>& groups, vector<int>& nums) {
        int wild = 1e8, split = 1e9;
        vector<int> t;
        for (auto &group : groups) {
            t.push_back(wild);
            t.insert(t.end(), group.begin(), group.end());
        }
        int target = t.size();
        t.push_back(split);
        t.insert(t.end(), nums.begin(), nums.end());

        vector<int> pi(t.size());
        for (int i = 0; i < t.size(); ++i) {
            if (t[i] == split) {
                continue;
            } else if (t[i] == wild) {
                pi[i] = i;
            } else {
                int j = pi[i - 1];
                while (t[j] != wild && t[j] != t[i])
                    j = pi[j - 1];
                if (t[j] == wild && i != j + 1 && t[i] == t[j + 1])
                    pi[i] = j + 2;
                else if (t[i] == t[j])
                    pi[i] = j + 1;
                else
                    pi[i] = j;
            }
        }

        return *max_element(pi.begin(), pi.end()) >= target;
    }
};
```

:::

## Problem C - [地图中的最高点](https://leetcode.cn/problems/map-of-highest-peak/)

### 方法一：多源 BFS

- 时间复杂度 $\mathcal{O}(NM)$ 。
- 空间复杂度 $\mathcal{O}(NM)$ 。

:::details 参考代码（C++）

```cpp
const int d[4][2] = {{-1, 0}, {0, -1}, {0, 1}, {1, 0}};

class Solution {
public:
    vector<vector<int>> highestPeak(vector<vector<int>>& isWater) {
        int n = isWater.size(), m = isWater[0].size();
        queue<pair<int, int>> q;
        vector<vector<int>> ans(n, vector<int>(m, -1));
        for (int i = 0; i < n; ++i)
            for (int j = 0; j < m; ++j)
                if (isWater[i][j]) {
                    q.emplace(i, j);
                    ans[i][j] = 0;
                }
        while (!q.empty()) {
            auto [i, j] = q.front();
            q.pop();
            for (int k = 0; k < 4; ++k) {
                int ni = i + d[k][0], nj = j + d[k][1];
                if (ni < 0 || ni >= n || nj < 0 || nj >= m || ans[ni][nj] != -1)
                    continue;
                q.emplace(ni, nj);
                ans[ni][nj] = ans[i][j] + 1;
            }
        }

        return ans;
    }
};
```

:::

## Problem D - [互质树](https://leetcode.cn/problems/tree-of-coprimes/)

### 方法一：DFS

- 时间复杂度 $\mathcal{O}(NC)$ 。
- 空间复杂度 $\mathcal{O}(N)$ 。

:::details 参考代码（C++）

```cpp
#define VAL 51
bool coprime[VAL][VAL]{}, inited = false;

void init() {
    inited = true;
    for (int i = 1; i < VAL; ++i)
        for (int j = i; j < VAL; ++j)
            if (__gcd(i, j) == 1)
                coprime[i][j] = coprime[j][i] = true;
}

class Solution {
    int n;
    vector<int> nums, ans;
    vector<vector<int>> adj;
    
    void dfs(int u, int p, vector<vector<int>> &hist) {
        if (!hist[nums[u]].empty())
            ans[u] = hist[nums[u]].back();
        for (int i = 1; i < VAL; ++i)
            if (coprime[nums[u]][i])
                hist[i].emplace_back(u);

        for (int v : adj[u])
            if (v != p)
                dfs(v, u, hist);

        for (int i = 1; i < VAL; ++i)
            if (coprime[nums[u]][i])
                hist[i].pop_back();
    }
public:
    vector<int> getCoprimes(vector<int>& nums, vector<vector<int>>& edges) {
        if (!inited)
            init();
        
        n = nums.size();
        this->nums = vector<int>(nums);
        ans = vector<int>(n, -1);
        adj = vector<vector<int>>(n + 1);
        for (auto &edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].emplace_back(v);
            adj[v].emplace_back(u);
        }
        
        vector<vector<int>> hist(VAL);
        
        dfs(0, -1, hist);
        
        return ans;
    }
};
```
