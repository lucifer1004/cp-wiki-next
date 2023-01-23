# AtCoder Beginner Contest 191 Editorial

## Problem A -  [Vanishing Pitch](https://atcoder.jp/contests/abc191/tasks/abc191_a)

To avoid dealing with floats, we can calculate the invisible range of distance instead. If $D$ falls within this range, then Aoki cannot hit the ball.

- Time complexity is $\mathcal{O}(1)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        v: usize,
        t: usize,
        s: usize,
        d: usize,
    }

    println!("{}", if d < v * t || d > v * s {"Yes"} else {"No"});
}
```

:::

## Problem B - [Remove It](https://atcoder.jp/contests/abc191/tasks/abc191_b)

Just perform the simulation. Actually we even do not need an array. We can just read from the stream and process the numbers one by one.

- Time complexity is $\mathcal{O}(N)$.
- Space complexity is $\mathcal{O}(N)$ or $\mathcal{O}(1)$ if we read the numbers one by one.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        n: usize,
        x: usize,
        a: [usize; n],
    }

    for num in a {
        if num != x {
            print!("{} ", num);
        }
    }
}
```

:::

## Problem C - [Digital Graffiti](https://atcoder.jp/contests/abc191/tasks/abc191_c)

It would be a lot easier if we could explicitly draw the outline. How can we achive that?

My trick here is to extend the board, so that 

```
....
.#..
.##.
....
```

becomes

```
.........
.........
..###....
..###....
..#####..
..#####..
..#####..
.........
.........
```

A big advantage is that in the new pattern, each side of the polygon has a minimum length of $3$. As a result, we just need to count the number of turning points to get the number of sides. They must equal!

How do we find turing points?

We define a `#` cell which is in touch with a `.` cell in any of the 8 directions (diagonals included) as an **outer cell**. These cells form the outline of the pattern. Of course, a turning point must be an **outer cell**.

We can observe that all turning points must form a right angle with two of its 4-direction neighbors, which should also be **outer cell**s, Thus we can find all the turning points by checking if they can form a right angle.

- Time complexity is $\mathcal{O}(HW)$.
- Space complexity is $\mathcal{O}(HW)$.

:::details Code (Rust)

```rust
use proconio::input;
use proconio::marker::Chars;

fn main() {
    input! {
        h: usize,
        w: usize,
        s: [Chars; h],
    }

    let mut extended = vec![vec!['.'; w * 2 + 1]; h * 2 + 1];
    for i in 1..h - 1 {
        for j in 1..w - 1 {
            if s[i][j] == '#' {
                for x in 2 * i..=2 * i + 2 {
                    for y in 2 * j..=2 * j + 2 {
                        extended[x][y] = '#';
                    }
                }
            }
        }
    }

    let mut outer = vec![vec![false; w * 2 + 1]; h * 2 + 1];
    for i in 1..h * 2 {
        for j in 1..=w * 2 {
            if extended[i][j] == '#' {
                for x in i - 1..=i + 1 {
                    for y in j - 1..=j + 1 {
                        if extended[x][y] == '.' {
                            outer[i][j] = true;
                        }
                    }
                }
            }
        }
    }

    let mut ans = 0;
    for i in 1..=h * 2 {
        for j in 1..=w * 2 {
            if outer[i][j] {
                if (outer[i - 1][j] && outer[i][j - 1]) || (outer[i][j - 1] && outer[i + 1][j]) || (outer[i + 1][j] && outer[i][j + 1]) || (outer[i][j + 1] && outer[i - 1][j]) {
                    ans += 1;
                }
            }
        }
    }

    println!("{}", ans);
}
```

:::

## Problem D - [Circle Lattice Points](https://atcoder.jp/contests/abc191/tasks/abc191_d)

The idea is easy to come up with. We can do a sweeping line either along the $x$-axis or the $y$-axis.

Supposing that we sweep along the $y$-axis from the lowest integer point to the highest integer point. We can easily find the two intersections of our current line $y=y_0$ and the circle, which should be $(X-\sqrt{R^2-(Y-y_0)^2}, y_0)$ and $(X+\sqrt{R^2+(Y-y_0)^2},y_0)$. We can then find the number of interger points between these two points.

However, the floating point precision is a bit annoying. Many contestants got **AC** on most test cases but could not pass the rest due to this issue.

My solution is to avoid the usage of floats from the beginning. Since there are at most $4$ digits after the decimal point, we can multiply all the numbers by $10000$ and they would fit in `i32`, which means their squares can fit in `i64`.

An offset can be used to further avoid negative number divisions, which is also a source of error.

Finally, instead of calculating the radius, we can use binary search to find the leftmost and the rightmost integer points.

- Time complexity is $\mathcal{O}(R\log R)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

const TEN: [i64; 4] = [1, 10, 100, 1000];

fn parse(s: String) -> i64 {
    let v = s.split(".").collect::<Vec<&str>>();
    if v.len() == 1 {
        v[0].parse::<i64>().unwrap() * 10000
    } else {
        let sub = v[1].parse::<i64>().unwrap();
        let len0 = v[1].len();
        if v[0].starts_with('-') {
            v[0].parse::<i64>().unwrap() * 10000 - sub * TEN[4 - len0]
        } else {
            v[0].parse::<i64>().unwrap() * 10000 + sub * TEN[4 - len0]
        }
    }
}

fn main() {
    input! {
        x: String,
        y: String,
        r: String,
    }

    let offset = 20_000_000_000_000;
    let offset_s = 2_000_000_000;

    let mut ans = 0i64;
    let x = parse(x);
    let y = parse(y);
    let r = parse(r);

    for i in (y - r + offset) / 10000 - offset_s..=(y + r - 1 + offset) / 10000 + 1 - offset_s {
        let h = y - i * 10000;

        let mut lo = -offset_s;
        let mut hi = x;

        while lo <= hi {
            let mid = (lo + hi) / 2;
            if (mid - x) * (mid - x) + h * h <= r * r {
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }

        let left = (lo - 1 + offset) / 10000 + 1 - offset_s;

        lo = x;
        hi = offset_s;

        while lo <= hi {
            let mid = (lo + hi) / 2;
            if (mid - x) * (mid - x) + h * h <= r * r {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        let right = (hi + offset) / 10000 - offset_s;
        if right >= left {
            ans += right - left + 1;
        }
    }

    println!("{}", ans);
}
```

:::

## Problem E - [Come Back Quickly](https://atcoder.jp/contests/abc191/tasks/abc191_e)

Problem E proved to be much easier than Problem D. We can solve it by running a Dijkstra from each town.

- Time complexity is $\mathcal{O}(N^2\log M)$.
- Space complexity is $\mathcal{O}(N+M)$.

:::details Code (Rust)

```rust
use proconio::input;
use proconio::marker::Usize1;
use std::collections::BinaryHeap;

const INF: i64 = 1_000_000_000_000;

fn main() {
    input! {
        n: usize,
        m: usize,
        edges: [(Usize1, Usize1, i64); m],
    }

    let mut adj: Vec<Vec<(usize, i64)>> = vec![vec![]; n];
    for (u, v, c) in edges {
        adj[u].push((v, c));
    }

    let mut ans = vec![-1; n];
    for i in 0..n {
        let mut dist = vec![INF; n];
        let mut pq: BinaryHeap<(i64, usize)> = BinaryHeap::new();
        pq.push((0, i));
        while !pq.is_empty() {
            let (d, u) = pq.pop().unwrap();
            let d = -d;
            if d > dist[u] {
                continue;
            }
            for (v, c) in adj[u].clone() {
                if d + c < dist[v] {
                    dist[v] = d + c;
                    pq.push((-dist[v], v));
                }
            }
        }
        if dist[i] != INF {
            ans[i] = dist[i];
        }
    }

    for i in ans {
        println!("{}", i);
    }
}
```

:::

## Problem F - [GCD or MIN](https://atcoder.jp/contests/abc191/tasks/abc191_f)

An important observation is $\gcd(x,y)\leq\min(x,y)$. So the minimum of all numbers $\min{A_i}$ proves to be the maximum answer we could get.

Since all the possible answers must be a factor of some number in the array, we can find the factors of every number within $\mathcal{O}(N\sqrt{\max{A_i}})$ iterations.

Not all factors can be the final answer. Supposing that a factor $k<\min{A_i}$ can be the final answer,

- $k$ must be a factor of some number $A_i$.
- $k$ comes from a series $\gcd$ operations, e.g., $\gcd(A_{p_1},A_{p_2},\dots)$. $k$ cannot be $A_i$ itself since we have $k<\min{A_i}$.
- Since the order of $\gcd$ operations does not matter, the first time we meet $k$, supposing that we are dealing with the number $A_i$, we can set $memo[k]$ to $A_i$. Note that here we have $memo[k]\geq k$.
- Our goal is to get $k$ in the end ($memo[k]=k$), so each time we have the chance to perform a $\gcd$ operation (meaning that $k$ is also a factor of some other number $A_j$), we should perform the $\gcd$ operation to reduce the number $memo[k]$ to $\gcd(memo[k],A_j)$. Since both $memo[k]$ and $A_j$ can be divided by $k$, it is assured that $memo[k]$ can be divided by $k$. We do the $\gcd$ operation whenever possible because $\gcd(x,y)\leq\min(x,y)$, and we want to reduce the value $memo[k]$.

After processing all the numbers, we check our $memo$ and count for how many factors $memo[k]=k$ holds.

And the final answer would be that count plus $1$ (by using $\min$ operations only).

- Time complexity is $\mathcal{O}(N\sqrt{\max{A_i}}\log{\max{A_i}})$.
- Space complexity is $\mathcal{O}(Nd)$, where $d$ is the maximum number of factors of a single number.

:::details Code (C++)

```cpp
#include <algorithm>
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;
int main() {
  int n;
  cin >> n;

  vector<int> a(n);
  for (int i = 0; i < n; ++i)
    cin >> a[i];
  int lo = *min_element(a.begin(), a.end());

  unordered_map<int, int> memo;
  for (int ai : a) {
    for (int j = 1; j * j <= ai && j < lo; ++j) {
      if (ai % j == 0) {
        memo[j] = __gcd(ai, memo[j]);
        if (ai / j < lo)
          memo[ai / j] = __gcd(ai, memo[ai / j]);
      }
    }
  }

  int ans = 1;
  for (auto [factor, terminal] : memo)
    if (factor == terminal)
      ans++;

  cout << ans;
}
```

:::

:::details Code (Rust)

```rust
use proconio::input;
use std::collections::HashMap;

fn gcd(x: usize, y: usize) -> usize {
    if y == 0 {
        x
    } else {
        gcd(y, x % y)
    }
}

fn main() {
    input! {
        n: usize,
        a: [usize; n],
    }

    let mut factors: HashMap<usize, usize> = HashMap::new();
    let lo = *a.iter().min().unwrap();

    for i in 0..n {
        for j in 1..lo {
            if j * j > a[i] {
                break;
            }

            if a[i] % j == 0 {
                let original = *factors.entry(j).or_insert(a[i]);
                factors.insert(j, gcd(original, a[i]));
                if a[i] / j < lo {
                    let original = *factors.entry(a[i] / j).or_insert(a[i]);
                    factors.insert(a[i] / j, gcd(original, a[i]));
                }
            }
        }
    }

    let mut ans = 1;
    for (original, terminal) in factors {
        if original == terminal {
            ans += 1;
        }
    }

    println!("{}", ans);
}
```

:::
