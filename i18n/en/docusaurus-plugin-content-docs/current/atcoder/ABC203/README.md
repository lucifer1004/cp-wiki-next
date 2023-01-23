# AtCoder Beginner Contest 203 Editorial

## Problem A -  [Chinchirorin](https://atcoder.jp/contests/abc203/tasks/abc203_a)

- If $a=b$, print $c$.
- If $a=c$, print $b$.
- If $b=c$, print $a$.
- Otherwise, print $0$.

- Time complexity is $\mathcal{O}(1)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        a: usize,
        b: usize,
        c: usize,
    }

    if a == b {
        println!("{}", c);
    } else if a == c {
        println!("{}", b);
    } else if b == c {
        println!("{}", a);
    } else {
        println!("0");
    }
}
```

:::

## Problem B - [AtCoder Condominium](https://atcoder.jp/contests/abc203/tasks/abc203_b)

Under the given constraints, the answer can be expressed as:

$$
\dfrac{n(n+1)}{2}\cdot k\cdot100+\dfrac{k(k+1)}{2}\cdot n
$$

- Time complexity is $\mathcal{O}(1)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        n: usize,
        k: usize,
    }

    println!("{}", n * (n + 1) / 2 * k * 100 + k * (k + 1) / 2 * n);
}
```

:::

## Problem C - [Friends and Travel costs](https://atcoder.jp/contests/abc203/tasks/abc203_c)

First, sort the friends according to their distances. Then we enumerate the friends. When we do not have enough money to go to the place of the current friend, we break the loop, spend the remaining money and stop.

- Time complexity is $\mathcal{O}(N\log N)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        n: usize,
        mut k: usize,
        mut friends: [(usize, usize); n],
    }

    friends.sort();
    let mut now = 0;
    for (friend, money) in friends {
        if now + k < friend {
            break;
        }
        k -= friend - now;
        k += money;
        now = friend;
    }

    println!("{}", now + k);
}
```

:::

## Problem D - [Pond](https://atcoder.jp/contests/abc203/tasks/abc203_d)

If the median of a section is $M$, then there should be at least $\left\lceil\dfrac{K^2}{2}\right\rceil$ numbers in this section that satisfy $A_{ij}\le M$.

Based on this observation, we can binary search for the answer. Given the guess of the median $M$, we first turn the original matrix into a $0$-$1$ matrix, in which $0$ means $A_{ij}>M$ and $1$ means $A_{ij}\le M$. Then we can find the sum of all $K\times K$ sections in $\mathcal{O}(N^2)$ time based on the precalculated $2$-D prefix sum. If the maximum among all section sums is smaller than $\left\lceil\dfrac{K^2}{2}\right\rceil$, it means the guessed median is too large, and vice versa.

- Time complexity is $\mathcal{O}(N^2\log\operatorname{AMAX})$, in which $\operatorname{AMAX}=10^9$.
- Space complexity is $\mathcal{O}(N^2)$.

:::details Code (C++)

```cpp
#include <cstdio>
#include <iostream>
#include <vector>

#define INF 0x3f3f3f3f

using namespace std;

template<typename T>
void read(T &x) {
    x = 0;
    char c = getchar();
    T sig = 1;
    for (; !isdigit(c); c = getchar())
        if (c == '-')
            sig = -1;
    for (; isdigit(c); c = getchar())
        x = (x << 3) + (x << 1) + c - '0';
    x *= sig;
}

class Solution {
public:
    void solve() {
        int n, k;
        read(n), read(k);
        vector <vector<int>> a(n, vector<int>(n));
        for (int i = 0; i < n; ++i)
            for (int j = 0; j < n; ++j)
                read(a[i][j]);

        int pos = (k * k - 1) / 2 + 1;
        int lo = 0, hi = INF;
        vector <vector<int>> v(n, vector<int>(n)), s(n + 1, vector<int>(n + 1));
        while (lo <= hi) {
            int mid = (lo + hi) >> 1;
            for (int i = 0; i < n; ++i)
                for (int j = 0; j < n; ++j)
                    v[i][j] = (int) (a[i][j] <= mid);
            for (int i = 1; i <= n; ++i)
                for (int j = 1; j <= n; ++j)
                    s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + v[i - 1][j - 1];
            if (s[n][n] < pos) {
                lo = mid + 1;
                continue;
            }
            bool found = false;
            for (int i = k; i <= n; ++i) {
                for (int j = k; j <= n; ++j)
                    if (s[i][j] - s[i - k][j] - s[i][j - k] + s[i - k][j - k] >= pos) {
                        found = true;
                        break;
                    }
                if (found)
                    break;
            }

            if (found)
                hi = mid - 1;
            else
                lo = mid + 1;
        }

        printf("%d\n", lo);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    Solution solution = Solution();
    solution.solve();
}
```

:::

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        n: usize,
        k: usize,
        a: [[usize; n]; n],
    }

    let pos = (k * k - 1) / 2 + 1;

    let mut lo: i32 = 0;
    let mut hi: i32 = 1_000_000_000;
    let mut v = vec![vec![0; n]; n];
    let mut s = vec![vec![0; n + 1]; n + 1];

    while lo <= hi {
        let mid = (lo + hi) >> 1;
        for i in 0..n {
            for j in 0..n {
                if a[i][j] <= mid as usize {
                    v[i][j] = 1;
                } else {
                    v[i][j] = 0;
                }
            }
        }
        for i in 1..=n {
            for j in 1..=n {
                s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + v[i - 1][j - 1];
            }
        }

        if s[n][n] < pos {
            lo = mid + 1;
            continue;
        }

        let mut found = false;
        for i in k..=n {
            for j in k..=n {
                if s[i][j] - s[i - k][j] - s[i][j - k] + s[i - k][j - k] >= pos {
                    found = true;
                    break;
                }
            }
            if found {
                break;
            }
        }

        if found {
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }

    println!("{}", lo);
}
```

:::

## Problem E - [White Pawn](https://atcoder.jp/contests/abc203/tasks/abc203_e)

Since we can only move down, we will divide the black pawns into groups based on their row number, and process the groups in the ascending order.

We maintain a hash set of the available columns during the processing. A black pawn located in the $j$-th column will make the $j$-th column unavailable if it is originally available, while if either the $j-1$-th column or the $j+1$-th column is originally available, the $j$-th column will be available regardless of its original state. So we should record the removals and insertions, then handle the removals before handling the insertions.

- Time complexity is $\mathcal{O}(N\log N)$.
- Space complexity is $\mathcal{O}(N)$.

:::details Code (Rust)

```rust
use std::collections::HashSet;

use proconio::input;

fn main() {
    input! {
        n: usize,
        m: usize,
        mut black: [(usize, usize); m],
    }

    black.sort();
    let mut pos: HashSet<usize> = HashSet::new();
    pos.insert(n);

    let mut l = 0;
    let mut r = 0;
    while l < m {
        while r + 1 < m && black[r + 1].0 == black[l].0 {
            r += 1;
        }
        let mut insert = vec![];
        let mut remove = vec![];
        for i in l..=r {
            let y = black[i].1;
            remove.push(y);
            if y > 0 && pos.contains(&(y - 1)) {
                insert.push(y);
            }
            if y + 1 <= 2 * n && pos.contains(&(y + 1)) {
                insert.push(y);
            }
        }
        for i in remove {
            pos.remove(&i);
        }
        for i in insert {
            pos.insert(i);
        }
        l = r + 1;
    }

    println!("{}", pos.len());
}
```

:::

## Problem F - [Weed](https://atcoder.jp/contests/abc203/tasks/abc203_f)

The original order does not matter in this problem, so we can safely sort the heights in the ascending order. Then we can calculate for each height the range it can cover if it is the highest at the moment of an operation, and we will have an increasing array of segments.

For example, the heights $[2, 3, 4, 9]$ will become segments $[[1, 1], [1, 2], [2, 3], [4, 4]]$.

Our goal is to choose several non-overlapping segments such that the remaining positions do not exceed $K$. And we need to first minimize the number of chosen segments and then minimize the number of remaining positions.

An observation is that in this problem, the segments are not arbitrary. Consider the situation in which Aoki removes no weeds at first. Then Takahashi would need to operate at most $\log\operatorname{\max A_i} + 1$ times, since in each operation, the maximum height of the remaining weeds is at least cut by half.

So we will need no more than $\log\operatorname{\max A_i} + 1$ operations.

Now we can use dynamic programming to solve this problem. Let $dp[i][j]$ mean the minimum number of remaining weeds (that is to say, Aoki needs to pull these weeds at first) if we cover the range $[1,i]$ with $j$ operations. There are two types of transitions:

1. We perform an operation with the $i$-th weed as the highest, thus transit from $(l[i]-1,j-1)$  to $(i,j)$.
2. We skip the $i$-th weed (let Aoki pull it), thus transit from $(i-1,j)$ to $(i,j)$.

- Time complexity is $\mathcal{O}(N\log\operatorname{HMAX})$, where $\operatorname{HMAX}=10^9$.
- Space complexity is $\mathcal{O}(N\log\operatorname{HMAX})$.

:::details Code (Rust)

```rust
use proconio::input;

const K: usize = 31;

fn main() {
    input! {
        n: usize,
        k: usize,
        mut a: [usize; n],
    }

    if k == n {
        println!("0 {}", n);
        std::process::exit(0);
    }

    a.sort();
    let mut l = vec![0; n];
    for i in 0..n {
        let mut lo = 0;
        let mut hi = i;
        while lo <= hi {
            let mid = (lo + hi) >> 1;
            if a[mid] > a[i] / 2 {
                if mid == 0 {
                    break;
                }
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        l[i] = lo;
    }

    let mut dp = vec![vec![k + 1; K]; n + 1];
    dp[0][0] = 0;
    for i in 0..n {
        for j in 0..K {
            if j + 1 < K {
                dp[i + 1][j + 1] = dp[i + 1][j + 1].min(dp[l[i]][j]);
            }
            dp[i + 1][j] = dp[i + 1][j].min(dp[i][j] + 1);
        }
    }

    for i in 1..K {
        if dp[n][i] <= k {
            println!("{} {}", i, dp[n][i]);
            std::process::exit(0);
        }
    }
}
```

:::
