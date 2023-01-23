# AtCoder Beginner Contest 188

[视频题解](https://www.youtube.com/watch?v=AV8LJWgWL7I)

<iframe width="560" height="315" src="https://www.youtube.com/embed/AV8LJWgWL7I" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A -  [Three-Point Shot](https://atcoder.jp/contests/abc188/tasks/abc188_a)

直接判断是否满足$|X-Y|\leq2$即可。

时间复杂度$\mathcal{O}(1)$。

:::details 参考代码 （Python 3）

```python
x, y = map(int, input().split())
print('Yes' if abs(x - y) <= 2 else 'No')
```

:::

## Problem B - [Orthogonality](https://atcoder.jp/contests/abc188/tasks/abc188_b)

直接计算即可。

时间复杂度$\mathcal{O}(N)$。

:::details 参考代码 （Python 3）

```python
n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
print('Yes' if sum(ai * bi for ai, bi in zip(a, b)) == 0 else 'No')
```

:::

## Problem C - [ABC Tournament](https://atcoder.jp/contests/abc188/tasks/abc188_c)

找出前一半的最大值和后一半的最大值，二者中较小的那一个对应的序号就是最后的答案。

时间复杂度$\mathcal{O}(2^N)$。

:::details 参考代码 （Python）

```python
n = int(input())
a = list(map(int, input().split()))
half = 1 << (n - 1)
left_win = 0
for i in range(half):
    if a[i] > a[left_win]:
        left_win = i
right_win = half
for i in range(half, 1 << n):
    if a[i] > a[right_win]:
        right_win = i
if a[left_win] > a[right_win]:
    print(right_win + 1)
else:
    print(left_win + 1)
```

:::

## Problem D - [Snuke Prime](https://atcoder.jp/contests/abc188/tasks/abc188_d)

:::tip 提示

本题题解已经**重写**。

:::

最初我们的时间区间是$[0,+\infty)$。每一个服务都会将这一区间分割为若干不重合的子区间。比如说，如果我们有$[1,4]$和$[3,8]$两个服务，将会得到如下的区间（注意我们删去了最左端的$[0,0]$）：

$$
[1,2],[3,4],[5,8],[9,+\infty)
$$

这些区间也可以被写作：

$$
[1,3),[3,5),[5,9),[9,+\infty)
$$

要表示这些区间，我们只需要它们的左端点，也即$1,3,5,9$。可以看到，这些左端点或者来自于$a_i$，或者来自于$b_i+1$。这是因为只有一个服务的开始或结束才会对当前的总费用产生影响。由于$[a_i,b_i]$是一个闭区间，服务开始的时间是$a_i$，但结束的时间实际上是$b_i+1$。从第$a_i$天开始，总费用会增加$c_i$，而从第$b_i+1$天开始，总费用会减少$c_i$.

得到这些区间之后，我们需要计算每个区间内的花费，并将其与$C$，也即订阅会员服务的费用进行比较。每个区间的长度可以利用下一区间的起点和这一区间的起点作差得到。

我们可以用两种方式来处理这些区间：

1. （麻烦）我们可以对区间端点进行离散化，然后用差分数组求和的方式计算出每一区间内的花费。
2. （简单）我们可以用一个`map`来存储每个关键时间点（$a_i$或$b_i+1$，也即区间起点）上的费用变化，然后按顺序处理区间，对这些变化进行累加。

两种方法的时间复杂度都是$\mathcal{O}(N\log N)$，因为我们总是需要对时间点进行排序。

:::details 参考代码（C++，离散化）

```cpp
#include <iostream>
#include <map>
#include <set>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int N;
  ll C;
  cin >> N >> C;
  vector<int> a(N), b(N), c(N);
  set<int> s;
  for (int i = 0; i < N; ++i) {
    cin >> a[i] >> b[i] >> c[i];

    // We only need a[i] and b[i]+1 to represent the final segments.
    // For example, [1, 4] and [3, 8] will make
    // [1, 2], [3, 4], [5, 8] and [9, +inf].
    // We need 1, 3, 5, and 9 to represent these segments.
    s.insert(a[i]), s.insert(b[i] + 1);
  }

  // Discretize the endpoints.
  int idx = 0;
  map<int, int> mp;
  for (int si : s)
    mp[si] = idx++;
  int M = s.size();
  vector<int> v(s.begin(), s.end());

  // Use a difference array to handle the services.
  vector<ll> diff(M);
  for (int i = 0; i < N; ++i)
    diff[mp[a[i]]] += c[i], diff[mp[b[i] + 1]] -= c[i];

  // Accumulate the difference array to get the value of each segment.
  // At the same time, add to the total cost.
  vector<ll> acc(M);
  acc[0] = diff[0];
  ll ans = 0;
  for (int i = 0; i < M - 1; ++i) {
    if (i >= 1)
      acc[i] = acc[i - 1] + diff[i];
    int span = v[i + 1] - v[i];
    ans += min(C, acc[i]) * span;
  }
  cout << ans;
}
```

:::

:::details 参考代码（C++，map）

```cpp
#include <iostream>
#include <map>
#include <set>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int N;
  ll C;
  cin >> N >> C;
  vector<int> a(N), b(N), c(N);
  set<int> s;
  map<int, ll> changes;
  for (int i = 0; i < N; ++i) {
    cin >> a[i] >> b[i] >> c[i];

    // We only need a[i] and b[i]+1 to represent the final segments.
    // For example, [1, 4] and [3, 8] will make
    // [1, 2], [3, 4], [5, 8] and [9, +inf).
    // They can also be seen as [1, 3), [3, 5), [5, 9) and [9, +inf].
    // We need 1, 3, 5, and 9 to represent these segments.
    s.insert(a[i]), s.insert(b[i] + 1);

    // We use a map to store the change of cost on each critical day.
    changes[a[i]] += c[i];
    changes[b[i] + 1] -= c[i];
  }

  vector<int> v(s.begin(), s.end());
  int M = v.size();

  ll ans = 0, acc = 0;
  for (int i = 0; i < M - 1; ++i) {
    // Deal with the starting and ending of segments.
    acc += changes[v[i]];

    // Add to the total cost.
    ans += min(C, acc) * (v[i + 1] - v[i]);
  }
  cout << ans;
}
```

:::

## Problem E - [Peddler](https://atcoder.jp/contests/abc188/tasks/abc188_e)

从$N$开始倒序进行动态规划即可。

时间复杂度$\mathcal{O}(N+M)$。

:::details 参考代码 （C++）

```cpp
#include <iostream>
#include <vector>
#define MAXN 200005

using namespace std;

int main() {
  int N, M;
  cin >> N >> M;

  vector<int> A(N + 1);
  for (int i = 1; i <= N; ++i)
    cin >> A[i];

  vector<vector<int>> adj(N + 1);
  for (int i = 0; i < M; ++i) {
    int u, v;
    cin >> u >> v;
    adj[u].emplace_back(v);
  }

  vector<int> hi(N + 1, -1e9);
  int ans = -1e9;
  for (int i = N; i >= 1; --i) {
    for (int v : adj[i])
      hi[i] = max(hi[i], hi[v]);
    ans = max(ans, hi[i] - A[i]);
    hi[i] = max(hi[i], A[i]);
  }
  cout << ans;
}
```

:::

## Problem F - [+1-1x2](https://atcoder.jp/contests/abc188/tasks/abc188_f)

- 如果$X\geq Y$，答案为$X-Y$
- 如果$X<Y$，采用BFS求解。为了减少状态分支数，从$Y$而非$X$开始。对于每一个当前值$Y'$，首先尝试用$d+|Y'-X|$更新最优解。然后，如果$Y'>X$，再进一步考虑使用三种操作：
    - 如果$Y'$为偶数，则$\div2$（$\times2$的逆操作）
    - 如果$Y'$为奇数，考虑$+1$或$-1$。
    特别地，如果当前队首元素的操作步数已经大于等于最优解，则提前结束搜索。

:::details 参考代码 （Python）

```python
from collections import deque

X, Y = map(int, input().split())
if X >= Y:
    print(X - Y)
else:
    ans = Y - X
    dq = deque([(Y, 0)])
    vis = set([Y])
    while dq:
        u, d = dq.popleft()
        if d >= ans:
            break
        ans = min(ans, d + abs(u - X))
        if u <= X:
            continue
        if u % 2 == 0:
            if u // 2 not in vis:
                vis.add(u // 2)
                dq.append((u // 2, d + 1))
        else:
            if u + 1 not in vis:
                vis.add(u + 1)
                dq.append((u + 1, d + 1))
            if u - 1 not in vis:
                vis.add(u - 1)
                dq.append((u - 1, d + 1))
    print(ans)
```

:::
