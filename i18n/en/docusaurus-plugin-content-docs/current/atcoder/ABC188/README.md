# AtCoder Beginner Contest 188 Editorial

[Video Editorial](https://www.youtube.com/watch?v=AV8LJWgWL7I)

<iframe width="560" height="315" src="https://www.youtube.com/embed/AV8LJWgWL7I" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A -  [Three-Point Shot](https://atcoder.jp/contests/abc188/tasks/abc188_a)

Check if $|X-Y|\leq2$.

Time complexity is $\mathcal{O}(1)$.

:::details Code (Python 3)

```python
x, y = map(int, input().split())
print('Yes' if abs(x - y) <= 2 else 'No')
```

:::

## Problem B - [Orthogonality](https://atcoder.jp/contests/abc188/tasks/abc188_b)

Just calculate the inner product,

Time complexity is $\mathcal{O}(N)$.

:::details Code (Python 3)

```python
n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
print('Yes' if sum(ai * bi for ai, bi in zip(a, b)) == 0 else 'No')
```

:::

## Problem C - [ABC Tournament](https://atcoder.jp/contests/abc188/tasks/abc188_c)

Find the maximum of the lower half and the upper half, and compare them. The index of the smaller value is the answer we need.

Time complexity is $\mathcal{O}(2^N)$.

:::details Code (Python)

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

:::tip

Editorial for this problem has been completely **rewritten**.

:::

Consider at first we have an infinite time span $[0,+\infty)$. The services will split the span into several non-overlapping segments. For example, if we have servcies $[1,4]$ and $[3,8]$, the final segments would be (note that we discard the leftmost segment, which should be $[0,0]$ in this case):

$$
[1,2],[3,4],[5,8],[9,+\infty)
$$

Which can also be seen as:

$$
[1,3),[3,5),[5,9),[9,+\infty)
$$

 To represent these segments, we only need their left endpoints, that is, $1,3,5,9$. And these left endpoints come from either $a_i$ or $b_i+1$. This is because only the start or the end of a service will make a difference. A service $[a_i,b_i]$ can also be seen as $[a_i,b_i+1)$, in which $b_i+1$ is the first day that is not included, which means it is a start of a new segment. On the $a_i$-th day, the total cost will increase by $c_i$, while on the $b_i+1$-th day, the total cost will decrease by $c_i$.

After we get the segments, we need to calculate the cost for each segment, and compare it with $C$, the price of the subscription. The time span of a segment can be easily determined from the start of the current segment and the start of the next segment.

To deal with the segments, we have two choices.

1. (More overhead) We can discretize the endpoints and use a difference array to find the cost of each segment.
2. (Clearer) We can use a map to store the change happening to the total cost on each critical day ($a_i$ or $b_i+1$, which is the start endpoint of a segment), then handle the segments one by one.

Both methods have a time complexity of $\mathcal{O}(N\log N)$, since in both cases we need a sorted list of the timestamps.

:::details Code (C++, Discretization)

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

:::details Code (C++, Map)

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

Do dynamic programming in a reverse order (from $N$ to $1$).

Time complexity is $\mathcal{O}(N+M)$.

:::details Code (C++)

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

- If $X\geq Y$, the answer if $X-Y$.
- Otherwise, we use BFS to solve this problem. To reduce the number of states, we start from $Y$ instead of $X$. For each current value $Y'$, first try updating the answer with $d+|Y'-X|$. If $Y'>X$, then further consider the following cases:
    - If $Y'$ is even, use $\div2$ (reverse of $\times2$)
    - Otherwise, use $+1$ or $-1$.
    Specially, if the steps of the front element is equal to or larger than the answer, we can stop the search.

:::details Code (Python)

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
