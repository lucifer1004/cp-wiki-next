# Leetcode 第295场周赛

## Problem A - [重排字符形成目标字符串](https://leetcode.cn/problems/rearrange-characters-to-make-target-string/)

### 方法一：计数

- 时间复杂度 $\mathcal{O}(|S|+|T|)$。
- 空间复杂度 $\mathcal{O}(|\Sigma|)$。

:::details参考代码（Python 3）

```python
class Solution:
    def rearrangeCharacters(self, s: str, target: str) -> int:
        cs = collections.Counter(s)
        ct = collections.Counter(target)
        return min(cs[key] // ct[key] for key in ct)
```

:::

## Problem B - [价格减免](https://leetcode.cn/problems/apply-discount-to-prices/)

### 方法一：模拟 + 正则表达式

- 时间复杂度 $\mathcal{O}(|S|)$。
- 空间复杂度 $\mathcal{O}(|S|)$。

:::details参考代码（Python 3）

```python
class Solution:
    def discountPrices(self, sentence: str, discount: int) -> str:
        return ' '.join([f'${int(word[1:]) * (100 - discount) / 100:.2f}' if re.fullmatch(r'\$[1-9]\d*', word) else word for word in sentence.split()])
```

:::

## Problem C - [使数组按非递减顺序排列](https://leetcode.cn/problems/steps-to-make-array-non-decreasing/)

### 方法一：链表模拟

直接模拟，每次从头到尾检查一遍是 $\mathcal{O}(N^2)$ 的复杂度，肯定不能接受。

一个比较容易想到的优化点是：下一次发生删除的位置，只有可能是上一次发生删除的位置的下一个位置。所以我们可以每次记录下来上一次发生删除的位置，下一次只检查这些位置之后的位置，判断是否要进行新的删除。

但是因为有大量的删除操作，所以不能使用数组，而应该使用链表进行模拟。下面的参考代码使用了 C++ 的 `list`。

- 时间复杂度 $\mathcal{O}(N)$ 。
- 空间复杂度 $\mathcal{O}(N)$ 。

:::details参考代码（C++）

```cpp
class Solution {
public:
    int totalSteps(vector<int>& nums) {
        list<int> lst(nums.begin(), nums.end());
        vector<list<int>::iterator> to_del;
        for (auto p = lst.begin(); next(p) != lst.end(); ++p) {
            if (*p > *next(p))
                to_del.push_back(next(p));
        }
        
        int ans = 0;
        while (!to_del.empty()) {
            ans++;
            vector<list<int>::iterator> check;
            for (auto p : to_del) {
                auto pre = prev(p);
                lst.erase(p);
                if (check.empty() || check.back() != pre)
                    check.push_back(pre);
            }
            to_del.clear();
            for (auto p: check) {
                if (next(p) != lst.end() && *p > *next(p))
                    to_del.push_back(next(p));
            }
        }
        
        return ans;
    }
};
```

:::

## Problem D - [到达角落需要移除障碍物的最小数目](https://leetcode.cn/problems/minimum-obstacle-removal-to-reach-corner/)

### 方法一：0-1 BFS

移除障碍物可以视为移动的代价为 `1`，而走空地的移动代价为 `0`。因此本题可算是一道 0-1 BFS 的模板题。

- 时间复杂度为 $\mathcal{O}(RC)$。
- 空间复杂度 $\mathcal{O}(RC)$。

:::details参考代码（C++）

```cpp
const int d[4][2] = {{-1, 0}, {0, -1}, {0, 1}, {1, 0}};

class Solution {
public:
    int minimumObstacles(vector<vector<int>>& grid) {
        int n = grid.size(), m = grid[0].size();
        vector<vector<int>> dis(n, vector<int>(m, INT_MAX));
        dis[0][0] = 0;
        deque<pair<int, int>> dq;
        dq.emplace_back(0, 0);
        while (!dq.empty()) {
            auto [i, j] = dq.front();
            dq.pop_front();
            for (int k = 0; k < 4; ++k) {
                int ni = i + d[k][0], nj = j + d[k][1];
                if (ni < 0 || ni >= n || nj < 0 || nj >= m || dis[ni][nj] < INT_MAX)
                    continue;
                dis[ni][nj] = dis[i][j] + grid[ni][nj];
                if (grid[ni][nj])
                    dq.emplace_back(ni, nj);
                else
                    dq.emplace_front(ni, nj);
            }
        }
        return dis[n - 1][m - 1];
    }
};
```

:::
