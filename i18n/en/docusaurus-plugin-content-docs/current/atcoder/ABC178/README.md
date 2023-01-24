# AtCoder Beginner Contest 178

## Problem A - [Not](https://atcoder.jp/contests/abc178/tasks/abc178_a)

Just output $1-x$, which takes $O(1)$ time.

:::details Code (Python 3)

```python
x = int(input())
print(1 - x)
```

:::

## Problem B - [Product Max](https://atcoder.jp/contests/abc178/tasks/abc178_b)

At first glance, there seem to be many conditions. But after you realize that the maximum must be within the set $\{ac,ad,bc,bd\}$, things become a lot easier.

Time complexity is $O(1)$.

:::details Code (Python 3)

```python
a, b, c, d = map(int, input().split())
x = [a * c, a * d, b * c, b * d]
print(max(x))
```

:::

## Problem C - [Ubiquity](https://atcoder.jp/contests/abc178/tasks/abc178_c)

Simple inclusion-exclusion.

$$
\text{seq with both 0 and 9}=\text{all seq}-\text{seq without 0}-\text{seq without 9}+\text{seq without 0 or 9}.
$$

So the answer equals to $10^n-2\cdot9^n+8^n$.

Time complexity is $O(\log n)$.

:::details Code (Python 3)

```python
mod = 1000000007


def fexp(x, y):
    ans = 1
    while y > 0:
        if y % 2 == 1:
            ans = ans * x % mod
        x = x * x % mod
        y //= 2
    return ans


n = int(input())
ans = fexp(10, n) - 2 * fexp(9, n) + fexp(8, n)
ans %= mod
if ans < 0:
    ans += mod
print(ans)
```

:::

## Problem D - [Redistribution](https://atcoder.jp/contests/abc178/tasks/abc178_d)

Enumerate how many numbers there are.

For example, when there are $k$ numbers, we first take $2k$ out of $n$, so now all numbers should be larger than or equal to $1$, instead of $3$. Then the problem becomes, how many ways there are, if we want to separate $n-2k$ into $k$ numbers. This can be considered as insert $k-1$ partitions into $n-2k-1$ positions, which is $n-2k-1\choose k-1$.

Time complexity is $O(n)$, if we consider that the calculation of factorials and their modulo inverses takes constant time.

:::details Code (Python 3)

```python
mod = 1000000007


def fexp(x, y):
    ans = 1
    while y > 0:
        if y % 2 == 1:
            ans = ans * x % mod
        x = x * x % mod
        y //= 2
    return ans


fac = [1]
rev = [1]

for i in range(1, 2006):
    fac.append(fac[-1] * i % mod)
    rev.append(fexp(fac[-1], mod - 2))


def C(n, k):
    if n < k:
        return 0
    return fac[n] * rev[k] % mod * rev[n - k] % mod


def distribute(n, m):
    return C(n - 1, m - 1)


n = int(input())
if n < 3:
    print(0)
else:
    ans = 0
    parts = 1
    while n - parts * 2 >= 0:
        rest = n - parts * 2
        ans += distribute(rest, parts)
        ans %= mod
        parts += 1
    print(ans)
```

:::

## Problem E - [Dist Max](https://atcoder.jp/contests/abc178/tasks/abc178_e)

This is a well-known problem and solutions can be easily found on the Internet. However, what is more important is to grasp the essence of such problems.

Our target is to find $\max|x_i-x_j|+|y_i-y_j|$. Brute force will not work because it takes $O(N^2)$ time which we cannot afford.

The key point is to expand absolute values. We should be aware that there is another definition of $|x|$, that is $|x|=\max\{x,-x\}$.

So in this problem, we have

$$
|x_i-x_j|+|y_i-y_j|=\max\{x_i-x_j+y_i-y_j,x_i-x_j+y_j-y_i,x_j-x_i+y_i-y_j,x_j-x_i+y_j-y_i\}
$$

Which can be further rearranged to 

$$
|x_i-x_j|+|y_i-y_j|=\max\{x_i+y_i-(x_j+y_j),x_i-y_i-(x_j-y_j),-x_i+y_i-(-x_j+y_j),-x_i-y_i-(-x_j-y_j)\}
$$

Then we have 

$$
\max|x_i-x_j|+|y_i-y_j|=\max\{\max(x_i+y_i-(x_j+y_j)),\max(x_i-y_i-(x_j-y_j)),\max(-x_i+y_i-(-x_j+y_j)),\max(-x_i-y_i-(-x_j-y_j))\}
$$

Which can be easily done in $O(N)$ time by storing maximum and minimum of each of the four forms.

If you have referred to a solution on the Internet, that is OK. But the important thing is to understand how this works. The simple expression $|x|=\max\{x,-x\}$ can help you in many more problems.

:::details Code (C++)

```cpp
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;
const int d[4][2] = {{1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
int main() {
  int n;
  cin >> n;
  vector<ll> lo(4, 1e12), hi(4, -1e12);
  for (int i = 0; i < n; ++i) {
    ll x, y;
    cin >> x >> y;
    for (int k = 0; k < 4; ++k) {
      ll result = x * d[k][0] + y * d[k][1];
      lo[k] = min(lo[k], result);
      hi[k] = max(hi[k], result);
    }
  }
  ll ans = 0;
  for (int k = 0; k < 4; ++k)
    ans = max(ans, hi[k] - lo[k]);
  cout << ans;
}
```

:::

## Problem F - [Contrast](https://atcoder.jp/contests/abc178/tasks/abc178_f)

This problem is similar to [CF1381C - Mastermind](https://codeforces.com/contest/1381/problem/C).

First we need to handle the conflicting numbers. The strategy is based on swapping. We use a max-heap to store all conflicting numbers. Each time, we pick one from the top group $x$, and one from the second top group $y$, and put an $x$ at the $y$'s position, while putting a $y$ at the $x$'s position. There is only one exceptional case. If there are three groups left in the heap, and they all have only one position left, we should make a triplet swap, $x\rightarrow y,y\rightarrow z,z\rightarrow x$.

After this, there can be at most one conflicting group left. We try to put all the nubmers of this group (not only the conflicting ones, considering the $\{1,2\},\{2,2\}$ example, there is only one pair of conflicting $2$, but we need to handle all $2$s) into valid positions.

If this cannot be done, then this configuration has no solution.

After that, we can put the rest numbers (which cannot cause conflicts) into the rest positions.

:::details Code (C++)

```cpp
#include <iostream>
#include <queue>
#include <vector>

using namespace std;
int main() {
  int n;
  cin >> n;
  vector<int> a(n), b(n), cb(n + 1);
  vector<bool> taken(n);
  vector<vector<int>> ca(n + 1);
  for (int i = 0; i < n; ++i) {
    cin >> a[i];
    ca[a[i]].emplace_back(i);
  }
  for (int i = 0; i < n; ++i) {
    cin >> b[i];
    cb[b[i]]++;
  }
  priority_queue<pair<int, int>> pq;
  for (int i = 1; i <= n; ++i) {
    int lo = min((int)ca[i].size(), cb[i]);
    if (lo)
      pq.emplace(lo, i);
  }
  while (pq.size() >= 2) {
    auto [cx, x] = pq.top();
    pq.pop();
    auto [cy, y] = pq.top();
    pq.pop();
    if (cx == 1 && pq.size() == 1) {
      auto [cz, z] = pq.top();
      pq.pop();
      int px = ca[x].back();
      int py = ca[y].back();
      int pz = ca[z].back();
      taken[px] = taken[py] = taken[pz] = true;
      b[px] = y;
      b[py] = z;
      b[pz] = x;
      ca[x].pop_back();
      ca[y].pop_back();
      ca[z].pop_back();
      cb[x]--;
      cb[y]--;
      cb[z]--;
    } else {
      int px = ca[x].back();
      int py = ca[y].back();
      taken[px] = taken[py] = true;
      b[px] = y;
      b[py] = x;
      ca[x].pop_back();
      ca[y].pop_back();
      cb[x]--;
      cb[y]--;
      if (cx > 1)
        pq.emplace(cx - 1, x);
      if (cy > 1)
        pq.emplace(cy - 1, y);
    }
  }
  int idx = 0;
  if (!pq.empty()) {
    auto [cx, x] = pq.top();
    pq.pop();
    while (cb[x]) {
      while (idx < n && (taken[idx] || a[idx] == x))
        idx++;
      if (idx >= n)
        break;
      b[idx] = x;
      cb[x]--;
      taken[idx] = true;
    }
    if (cb[x]) {
      cout << "No" << flush;
      return 0;
    }
  }
  vector<int> rest;
  for (int i = 1; i <= n; ++i)
    if (cb[i]) {
      for (int j = 0; j < cb[i]; ++j)
        rest.emplace_back(i);
    }
  idx = 0;
  for (int i : rest) {
    while (taken[idx])
      idx++;
    b[idx] = i;
    taken[idx] = true;
  }
  cout << "Yes" << endl;
  for (int i : b)
    cout << i << " ";
  cout << flush;
}
```

:::
