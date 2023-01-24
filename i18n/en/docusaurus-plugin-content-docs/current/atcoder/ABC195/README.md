# AtCoder Beginner Contest 195

## Problem A -  [Health M Death](https://atcoder.jp/contests/abc195/tasks/abc195_a)

Just check if $H\equiv 0\pmod{M}$.

- Time complexity is $\mathcal{O}(1)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        m: usize,
        h: usize,
    }

    println!("{}", if h % m == 0 { "Yes" } else { "No" });
}
```

:::

## Problem B - [Many Oranges](https://atcoder.jp/contests/abc195/tasks/abc195_b)

> Note that $W$ is in kilogram, so we need to use $1000W$ instead of $W$.

Let's first consider the upper bound.

We will try to use $A$ as many times as we can to achieve the upper bound. Problem is that there might be leftover grams, which we need to assign to the $hi=\lfloor\frac{1000W}{A}\rfloor$ oranges, and we can assign at most $k(B-A)$ grams. If the leftover is larger than $k(B-A)$, then this problem has no solution.

Now that the upper bound has been fixed (or the problem is doomed), we turn to the lower bound. Now we will use $B$ as many times as we can. First, we get $\lfloor\frac{1000W}{B}\rfloor$ oranges. Then we need to consider the leftover. If there are no leftover grams, then we have $lo=\lfloor\frac{1000W}{B}\rfloor$, otherwise, we have $lo=\lfloor\frac{1000W}{B}\rfloor+1$. It can be shown that we can always make $lo=\lfloor\frac{1000W}{B}\rfloor+1$ oranges when there are leftover grams, since the no-solution situation has been excluded in the previous phase.

- Time complexity is $\mathcal{O}(1)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        a: usize,
        b: usize,
        mut w: usize,
    }

    w *= 1000;
    let hi = w / a;
    if w % a > hi * (b - a) {
        println!("UNSATISFIABLE");
    } else {
        let lo = if w % b == 0 {
            w / b
        } else {
            w / b + 1
        };
        println!("{} {}", lo, hi);
    }
}
```

:::

## Problem C - [Comma](https://atcoder.jp/contests/abc195/tasks/abc195_c)

- $[1, 9]$: 9 numbers, each has 0 commas.
- $[10, 99]$: 90 numbers, each has 0 commas.
- $[100,999]$: 900 numbers, each has 0 commas.
- $[1000,9999]$: 9000 numbers, each has 1 comma.
- $\cdots$

Based on the pattern above,  we can simply start from $1000$ and multiply by $10$ in each turn until $N$ is exceeded.

- Time complexity is $\mathcal{O}(\log_{10}N)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        n: usize,
    }

    let mut base: usize = 1_000;
    let mut ans: usize = 0;
    let mut cnt = 3;
    while base <= n {
        let num = (n - base + 1).min(base * 9);
        ans += num * (cnt / 3);
        cnt += 1;
        base *= 10;
    }
    println!("{}", ans);
}
```

:::

## Problem D - [Shipping Center](https://atcoder.jp/contests/abc195/tasks/abc195_d)

Note that $N,M,Q$ are all very small, we can solve this problem via some brute force.

For each query, we collect all the available boxes, and sort them in the ascending order with respect to their capacities. For each box, we greedily choose the mose valuable baggage from all that have not been used and the box can contain.

- Time complexity is $\mathcal{O}(QM(N+\log M))$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        n: usize,
        m: usize,
        q: usize,
        bags: [(usize, usize); n],
        boxes: [usize; m],
        queries: [(usize, usize); q],
    }

    for (l, r) in queries {
        let mut available_boxes = vec![];
        for i in 0..l - 1 {
            available_boxes.push(boxes[i]);
        }
        for i in r..m {
            available_boxes.push(boxes[i]);
        }
        available_boxes.sort();
        let mut used = vec![false; n];
        let mut ans = 0;
        for b in available_boxes {
            let mut hi = 0;
            let mut hi_idx = n;
            for i in 0..n {
                if !used[i] && bags[i].0 <= b && bags[i].1 > hi {
                    hi = bags[i].1;
                    hi_idx = i;
                }
            }
            if hi_idx != n {
                used[hi_idx] = true;
                ans += hi;
            }
        }
        println!("{}", ans);
    }
}
```

:::

## Problem E - [Lucky 7 Battle](https://atcoder.jp/contests/abc195/tasks/abc195_e)

It is easy to observe that only the number modulo $7$ is important in this game. So we will have exactly $7$ states, denoting the current modulo.

Instead of going forward, we go backward because we only know the winning/losing state at the end of the game: $0=\text{Takahashi wins}$ and $\text{others}=\text{Aoki wins}$.

For each step, we enumerate all $7$ modulos, and calculate their successors: $a = (last * 10) \% 7$, and $b=(last*10+s[i])\%7$.

If Takahashi moves, he needs either $a$ or $b$ to be a winning state (for Takahashi) so that $last$ will be a winning state.

if Aoki moves, he needs either $a$ and $b$ to be a losing state (for Takahashi) so that $last$ will be a losing state, otherwise (both $a$ and $b$ are winning states), $last$ will be a winning state.

And we only need to check if $0$ is a winning state at first.

- Time complexity is $\mathcal{O}(CN)$, where $C=7$.
- Space complexity is $\mathcal{O}(C)$.

:::details Code (Rust)

```rust
use proconio::input;
use proconio::marker::Chars;

fn main() {
    input! {
        n: usize,
        s: Chars,
        x: Chars,
    }

    let mut dp = vec![false; 7];
    dp[0] = true;
    for i in (0..n).rev() {
        let c = s[i].to_string().parse::<usize>().unwrap();
        let mut ndp = vec![false; 7];
        if x[i] == 'A' {
            // Aoki moves
            for last in 0..7 {
                let a = last * 10 % 7;
                let b = (last * 10 + c) % 7;
                if dp[a] && dp[b] {
                    ndp[last] = true;
                }
            }
        } else {
            // Takahashi moves
            for last in 0..7 {
                let a = last * 10 % 7;
                let b = (last * 10 + c) % 7;
                if dp[a] || dp[b] {
                    ndp[last] = true;
                }
            }
        }
        dp = ndp;
    }

    println!("{}", if dp[0] { "Takahashi" } else { "Aoki" });
}
```

:::

## Problem F - [Coprime Present](https://atcoder.jp/contests/abc195/tasks/abc195_f)

An important observation is that, if there are two numbers that are not coprime, then the largest prime factor of their $\gcd$ will not exceed $71$.

We list all the prime numbers that are no larger than $71$. There are exactly $20$ such primes:

$$
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71]
$$

Then we can solve this problem via bitmask DP. The state would be all the prime factors that occur in our chosen set. We will start from $dp[0]=1$ (for the empty set) and all other $dp$ values equal to $0$.

For each number $A\leq i\leq B$, we find its bitmask representation (denoting which prime factors it has), and only make transitions from those states that do not conflict (sharing common prime factors) with this number.

- Time complexity is $\mathcal{O}((B-A+1)\cdot2^C)$, where $C=20$.
- Space complexity is $\mathcal{O}(2^C)$.

:::details Code (Rust)

```rust
use proconio::input;

const PRIMES: [usize; 20] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
    31, 37, 41, 43, 47, 53, 59, 61, 67, 71];

fn main() {
    input! {
        a: usize,
        b: usize,
    }

    let mut dp = vec![0; 1 << 20];
    dp[0] = 1;
    for i in a..=b {
        let mut now = 0;
        for j in 0..20 {
            if i % PRIMES[j] == 0 {
                now = now | (1 << j);
            }
        }
        for last in (0..(1 << 20)).rev() {
            if (last & now) == 0 {
                dp[last ^ now] += dp[last];
            }
        }
    }

    let mut ans = 0;
    for i in 0..(1 << 20) {
        ans += dp[i];
    }

    println!("{}", ans);
}
```

:::
