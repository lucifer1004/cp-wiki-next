# AtCoder Beginner Contest 182

## Problem A - [twiblr](https://atcoder.jp/contests/abc182/tasks/abc182_a)

Just output $2A+100-B$. Time complexity is $\mathcal{O}(1)$.

:::details Code (Python 3)

```python
a, b = map(int, input().split())
print(2 * a + 100 - b)
```

:::

## Problem B - [Almost GCD](https://atcoder.jp/contests/abc182/tasks/abc182_b)

Brute force. Time complexity is $\mathcal{O}(N\cdot\max(a))$.

:::details Code (Python 3)

```python
n = int(input())
a = list(map(int, input().split()))
hi = 0
ans = 0
for i in range(2, max(a) + 1):
    cnt = 0
    for j in a:
        if j % i == 0:
            cnt += 1
    if cnt > hi:
        hi = cnt
        ans = i
print(ans)
```

:::

## Problem C - [To 3](https://atcoder.jp/contests/abc182/tasks/abc182_c)

A number can be divided by $3$ if and only if the sum of its digits can be divided by $3$.

- $N\equiv0\mod 3$, no digits need to be removed.
- $N\equiv1\mod 3$, first try to delete one digit that $\equiv1\mod3$, then try to delete two digits that $\equiv2\mod3$.
- $N\equiv2\mod 3$, first try to delete one digit that $\equiv2\mod3$, then try to delete two digits that $\equiv1\mod3$.

Time complexity is $\mathcal{O}(\log N)$.

:::details Code (Python 3)

```python
s = input()
n = int(s)
if n % 3 == 0:
    print(0)
else:
    a = list(map(int, list(s)))
    c = [0] * 3
    for i in a:
        c[i % 3] += 1
    if c[n % 3] >= 1 and len(a) > 1:
        print(1)
    elif c[3 - n % 3] >= 2 and len(a) > 2:
        print(2)
    else:
        print(-1)
```

:::

## Problem D - [Wandering](https://atcoder.jp/contests/abc182/tasks/abc182_d)

We can maintain the farthest position $ans$, the current position $pos$, the prefix sum $sum$, and the maximum of prefix sum $hi$.

In each round, we first update $sum$, then update $hi$. It is obvious that we can reach at most $pos+hi$ in this round, so we will use it to update $ans$, and then use $pos+sum$ to update $pos$.

Time complexity is $\mathcal{O}(N)$。

:::details Code (C++)

```cpp
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int n;
  cin >> n;
  int a;
  ll ans = 0, hi = 0, sum = 0, pos = 0;
  for (int i = 1; i <= n; ++i) {
    cin >> a;
    sum += a;
    hi = max(hi, sum);
    ans = max(ans, pos + hi);
    pos += sum;
  }
  cout << ans;
}
```

:::

## Problem E - [Akari](https://atcoder.jp/contests/abc182/tasks/abc182_e)

Just put all the light bulbs and the walls into the matrix, then do a $4$-pass scan.

- For each row, from left to right.
- For each row, from right to left.
- For each column, from top to bottom.
- For each column, from bottom to top.

Time complexity is $\mathcal{O}(HW)$.

:::details Code (C++)

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
  int h, w, n, m;
  cin >> h >> w >> n >> m;
  int a, b, c, d;
  vector<vector<int>> mat(h, vector<int>(w));
  for (int i = 0; i < n; ++i) {
    cin >> a >> b;
    mat[a - 1][b - 1] = 1;
  }
  for (int i = 0; i < m; ++i) {
    cin >> c >> d;
    mat[c - 1][d - 1] = -1;
  }
  for (int i = 0; i < h; ++i) {
    bool light = false;
    for (int j = 0; j < w; ++j) {
      if (mat[i][j] == 1) {
        light = true;
      } else if (mat[i][j] == -1) {
        light = false;
      } else if (light)
        mat[i][j] = 2;
    }
    light = false;
    for (int j = w - 1; j >= 0; --j) {
      if (mat[i][j] == 1) {
        light = true;
      } else if (mat[i][j] == -1) {
        light = false;
      } else if (light)
        mat[i][j] = 2;
    }
  }
  for (int j = 0; j < w; ++j) {
    bool light = false;
    for (int i = 0; i < h; ++i) {
      if (mat[i][j] == 1) {
        light = true;
      } else if (mat[i][j] == -1) {
        light = false;
      } else if (light)
        mat[i][j] = 2;
    }
    light = false;
    for (int i = h - 1; i >= 0; --i) {
      if (mat[i][j] == 1) {
        light = true;
      } else if (mat[i][j] == -1) {
        light = false;
      } else if (light)
        mat[i][j] = 2;
    }
  }
  int ans = 0;
  for (int i = 0; i < h; ++i)
    for (int j = 0; j < w; ++j)
      ans += mat[i][j] > 0;
  cout << ans;
}
```

:::

## Problem F - [Valid payments](https://atcoder.jp/contests/abc182/tasks/abc182_f)

Actually we need to find the number of tuples $\{k_i\}$ that satisfy

$$
\sum k_ia_i=x
$$

and

$$
\forall k_i, |k_ia_i| < a_{i+1}
$$

We can choose from left to right. It is easy to see that, we only need to store each state that can be reached, and the corresponding number of ways. We do not need to store the detailed coefficients.

Since $a_{i+1}$ is a multiple of $a_i$, so after we determine $k_i$, we need to ensure that the current sum can be divided by $a_{i+1}$. On the other hand, according to the constraint $|k_ia_i| < a_{i+1}$, we only have two choices for each state.

We start from $\{x,1\}$. It seems that there will be exponentional states, but actually, there are at most two states at any time. So the total time complexity is $\mathcal{O}(N)$.

### Example

$a=[1,3,12,36,108],\ x=190$

The states in each step are:

- $(190,1)\dots\text{original}$
- $(189,1),(192,1)$ 
- $(180,1),(192,2)$ 
- $(180,3),(216,2)$
- $(108,3),(216,5)$
- $(0,8)\dots\text{terminal}$

As we can see from the example, after each step, all states must be divided by $a_{i+1}$ (for the last step, the only valid state is $0$). Also, the states cannot change more than $a_{i+1}$, e.g., in the first step, we can only go from $190$ to $189$ or $192$, which are the nearest number that can be divided by $a_1=3$ to the left and to the right. We cannot go any further because that means we will go more than $3$, and thus violates the rule that both people use the minimum number of coins (because we can use the $3$-Yen coin instead of the $1$-Yen coin).

![Illustration](./F.png)

We can also see that, the span is either $0$ or exactly $a_{i+1}$ for each step.

:::details Code (C++)

```cpp
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;
typedef long long ll;

int main() {
  int n;
  ll x;
  cin >> n >> x;
  vector<ll> a(n);
  for (int i = 0; i < n; ++i)
    cin >> a[i];
  unordered_map<ll, ll> v;
  v[x] = 1;
  ll ans = 0;
  for (int i = 0; i < n; ++i) {
    unordered_map<ll, ll> nv;
    for (auto [c, f] : v) {
      if (i + 1 < n) {
        ll rem = c % a[i + 1];
        nv[c - rem] += f;
        if (rem > 0)
          nv[c + a[i + 1] - rem] += f;
      } else {
        if (c % a[i] == 0)
          nv[0] += f;
      }
    }
    v = move(nv);
  }
  cout << v[0];
}
```

:::
