# AtCoder Beginner Contest 190 Editorial

[Video Editorial](https://www.youtube.com/watch?v=K6_AzyUn8OM)

<iframe width="560" height="315" src="https://www.youtube.com/embed/K6_AzyUn8OM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A -  [Very Very Primitive Game](https://atcoder.jp/contests/abc190/tasks/abc190_a)

The person that goes first need to have more candies than the other person to win the game. So we just check if the condition is satisfied.

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

    if c == 0 {
        if a > b {
            println!("Takahashi");
        } else {
            println!("Aoki");
        }
    } else {
        if b > a {
            println!("Aoki");
        } else {
            println!("Takahashi");
        }
    }
}
```

:::

## Problem B - [Magic 3](https://atcoder.jp/contests/abc190/tasks/abc190_b)

We check each spell to see if there is a spell that has $X_i<S$ and $Y_i>D$.

- Time complexity is $\mathcal{O}(N)$.
- Space complexity is $\mathcal{O}(1)$.

:::details Code (Rust)

```rust
use proconio::input;

fn main() {
    input! {
        n: usize,
        s: usize,
        d: usize,
        spells: [(usize, usize); n],
    }

    for (x, y) in spells {
        if x < s && y > d {
            println!("Yes");
            return;
        }
    }

    println!("No");
}
```

:::

## Problem C - [Bowls and Dishes](https://atcoder.jp/contests/abc190/tasks/abc190_c)

We enumerate all possible situations (there are $2^K$ int total), and find the maximum number of conditions that can be satisfied.

- Time complexity is $\mathcal{O}(2^K(K+M))$.
- Space complexity is $\mathcal{O}(N)$.

:::details Code (Rust)

```rust
use proconio::input;
use proconio::marker::Usize1;

fn main() {
    input! {
        n: usize,
        m: usize,
        dishes: [(Usize1, Usize1); m],
        k: usize,
        people: [(Usize1, Usize1); k],
    }

    let mut ans = 0;

    for i in 0..(1 << k) {
        let mut cnt = vec![0; n];
        for j in 0..k {
            if i & (1 << j) > 0 {
                cnt[people[j].1] += 1;
            } else {
                cnt[people[j].0] += 1;
            }
        }

        let mut tot = 0;

        for j in 0..m {
            if cnt[dishes[j].0] > 0 && cnt[dishes[j].1] > 0 {
                tot += 1;
            }
        }

        ans = ans.max(tot);
    }

    println!("{}", ans);
}
```

:::

## Problem D - [Staircase Sequences](https://atcoder.jp/contests/abc190/tasks/abc190_d)

Suppose the first element of the sequence is $a$ and there are $n$ elements, then the sum of the sequence will be $\frac{(a+a+n-1)n}{2}=N$. So we can find all the factors of $2N$ and check each factor to see if it can be valid $n$ by ensuring that $\frac{2N}{n}+1-n=2a$ should be an even number.

- Time complexity is $\mathcal{O}(\sqrt{N})$.
- Space complexity is $\mathcal{O}(M)$ where $M$ is the number of factors of $2N$.

:::details Code (Rust)

```rust
use proconio::input;
use std::collections::HashSet;

fn main() {
    input! {
        n: i64,
    }

    let mut factors = HashSet::new();
    let x = n * 2;

    let mut i = 1i64;
    while i * i <= x {
        if x % i == 0 {
            factors.insert(i.clone());
            factors.insert((x / i).clone());
        }
        i += 1;
    }

    let mut ans = 0;
    for k in factors {
        let rem = x / k;
        if (rem + 1 - k) % 2 == 0 {
            ans += 1;
        }
    }

    println!("{}", ans);
}
```

:::

:::details Code (C++)

```cpp
#include <iostream>
#include <unordered_set>

using namespace std;
using ll = long long;

int main() {
  ll n;
  cin >> n;
  unordered_set<ll> factors;
  ll x = n * 2;
  for (int i = 1; 1LL * i * i <= x; ++i) {
    if (x % i == 0) {
      factors.insert(i);
      factors.insert(x / i);
    }
  }

  int ans = 0;
  for (ll factor : factors)
    if ((x / factor + 1 - factor) % 2 == 0)
      ans++;

  cout << ans;
}
```

:::

## Problem E - [Magical Ornament](https://atcoder.jp/contests/abc190/tasks/abc190_e)

We can view the adjacent pairs as edges, then we can use BFS to find the shortest distance between each pair of "significant gems" (the gems listed in $C_i$), which forms a distance matrix.

Then we do a bitmask DP. The state is $dp[mask][last]$, where $mask$ represents the significant gems we have collected, and $last$ means the last gem (which must be a significant gem) in the sequence. For each state, we enumerate the next significant gem $next$ to do the transitions.

The final answer is $\min_i{dp[2^K-1][i]}$.

- Time complexity is $\mathcal{O}(KN+K^2\cdot2^K)$.
- Space complexity is $\mathcal{O}(N+M+K\cdot2^K)$.

:::details Code (Rust)

```rust
use proconio::input;
use proconio::marker::Usize1;
use std::collections::VecDeque;

const INF: usize = 1_000_000_000;

fn main() {
    input! {
        n: usize,
        m: usize,
        pairs: [(Usize1, Usize1); m],
        k: usize,
        c: [Usize1; k],
    }

    let mut adj: Vec<Vec<usize>> = vec![vec![]; n];
    for (u, v) in pairs.clone() {
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut mapping = vec![k; n];
    for (i, u) in c.clone().into_iter().enumerate() {
        mapping[u] = i;
    }

    let mut dist: Vec<Vec<usize>> = vec![vec![INF; k]; k];
    for i in 0..k {
        let mut dq: VecDeque<(usize, usize)> = VecDeque::new();
        dq.push_back((c[i], 0));
        let mut vis = vec![false; n];
        vis[c[i]] = true;
        while !dq.is_empty() {
            let (u, steps) = dq.pop_front().unwrap();
            if mapping[u] != k {
                dist[i][mapping[u]] = steps;
            }
            for v in adj[u].clone() {
                if !vis[v] {
                    vis[v] = true;
                    dq.push_back((v, steps + 1));
                }
            }
        }
    }


    let mut ans = INF;

    let mut dp = vec![vec![INF; k]; 1 << k];
    for i in 0..k {
        dp[1 << i][i] = 1;
    }

    for state in 0..(1 << k) {
        for last in 0..k {
            if dp[state][last] < INF {
                for next in 0..k {
                    if state & (1 << next) == 0 {
                        dp[state ^ (1 << next)][next] = dp[state ^ (1 << next)][next].min(dp[state][last] + dist[last][next]);
                    }
                }
            }
        }
    }

    for i in 0..k {
        ans = ans.min(dp[(1 << k) - 1][i]);
    }

    if ans == INF {
        println!("-1");
    } else {
        println!("{}", ans);
    }
}
```

:::

:::details Code (C++)

```cpp
#include <iostream>
#include <map>
#include <queue>
#include <vector>

using namespace std;
const int INF = 0x3f3f3f3f;

int main() {
  int n, m;
  cin >> n >> m;
  vector<vector<int>> adj(n);
  for (int i = 0; i < m; ++i) {
    int u, v;
    cin >> u >> v;
    u--, v--;
    adj[u].emplace_back(v);
    adj[v].emplace_back(u);
  }

  int k;
  cin >> k;
  vector<int> c(k);
  map<int, int> mp;
  for (int i = 0; i < k; ++i)
    cin >> c[i], c[i]--, mp[c[i]] = i;

  vector<vector<int>> d(k, vector<int>(k, INF));
  for (int i = 0; i < k; ++i) {
    queue<pair<int, int>> q;
    vector<bool> vis(n);
    q.emplace(c[i], 0);
    vis[c[i]] = true;
    while (!q.empty()) {
      auto [u, steps] = q.front();
      q.pop();
      if (mp.count(u))
        d[i][mp[u]] = steps;
      for (int v : adj[u]) {
        if (!vis[v]) {
          vis[v] = true;
          q.emplace(v, steps + 1);
        }
      }
    }
  }

  vector<vector<int>> dp(1 << k, vector<int>(k, INF));
  for (int i = 0; i < k; ++i)
    dp[1 << i][i] = 1;
  for (int state = 1; state < (1 << k); ++state)
    for (int last = 0; last < k; ++last) {
      if (state & (1 << last)) {
        for (int nxt = 0; nxt < k; ++nxt) {
          if (!(state & (1 << nxt))) {
            dp[state ^ (1 << nxt)][nxt] = min(dp[state ^ (1 << nxt)][nxt],
                                              dp[state][last] + d[last][nxt]);
          }
        }
      }
    }

  int ans = INF;
  for (int i = 0; i < k; ++i)
    ans = min(ans, dp[(1 << k) - 1][i]);

  if (ans == INF)
    cout << "-1";
  else
    cout << ans;
}
```

:::

## Problem F - [Shift and Inversions](https://atcoder.jp/contests/abc190/tasks/abc190_f)

We first use Fenwick Tree or a merge-sort-like (which is actually CQD Divide & Conquer) method to find the number of inversions in the original sequence. Then we observe that when we do the rotation, only the inversions that include the current leading number change. Suppose the leading number is $K$ (we use $1$-index here), then we will lose $K-1$ inversions and gain $N-K$ inversions. So within each rotation, the total number of inversions changes by $N+1-2K$.

- Time complexity is $\mathcal{O}(N\log N)$.
- Space complexity is $\mathcal{O}(N)$.

:::details Code (Rust)

```rust
use proconio::input;

fn low_bit(x: i32) -> i32 {
    x & (-x)
}

struct FenwickTree {
    v: Vec<i32>
}

impl FenwickTree {
    fn new(n: usize) -> Self {
        FenwickTree {
            v: vec![0; n + 1],
        }
    }

    fn update(&mut self, mut x: usize, val: i32) {
        while x < self.v.len() {
            self.v[x as usize] += val;
            x += low_bit(x as i32) as usize;
        }
    }

    fn query(&mut self, mut x: usize) -> i32 {
        let mut ans = 0;
        while x > 0 {
            ans += self.v[x as usize];
            x -= low_bit(x as i32) as usize;
        }
        ans
    }
}



fn main() {
    input! {
        n: usize,
        a: [usize; n],
    }

    let mut ft = FenwickTree::new(n);
    let mut ans = vec![0i64; n];
    for i in 0..n {
        let larger = (i as i32) - ft.query(a[i] + 1);
        ans[0] += larger as i64;
        ft.update(a[i] + 1, 1);
    }

    println!("{}", ans[0]);
    for i in 1..n {
        ans[i] = ans[i - 1] - a[i - 1] as i64 + (n as i64 - 1 - a[i - 1] as i64);
        println!("{}", ans[i]);
    }
}
```

:::

:::details Code (C++)

```cpp
#include <atcoder/fenwicktree>
#include <iostream>
#include <vector>

using namespace std;
using ll = long long;

int main() {
  int n;
  cin >> n;
  vector<int> a(n);
  for (int i = 0; i < n; ++i)
    cin >> a[i];
  vector<ll> ans(n);
  atcoder::fenwick_tree<int> ft(n);
  for (int i = 0; i < n; ++i) {
    ans[0] += ft.sum(a[i] + 1, n);
    ft.add(a[i], 1);
  }
  cout << ans[0] << endl;
  for (int i = 1; i < n; ++i) {
    ans[i] = ans[i - 1] + n - 1 - 2 * a[i - 1];
    cout << ans[i] << endl;
  }
}
```

:::
