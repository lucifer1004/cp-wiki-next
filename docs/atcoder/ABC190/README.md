# AtCoder Beginner Contest 190

[视频题解](https://www.youtube.com/watch?v=K6_AzyUn8OM)

<iframe width="560" height="315" src="https://www.youtube.com/embed/K6_AzyUn8OM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem A -  [Very Very Primitive Game](https://atcoder.jp/contests/abc190/tasks/abc190_a)

先动的人必须有更多的糖果才能赢，所以我们只要检查这一条件是否满足即可。

- 时间复杂度$\mathcal{O}(1)$
- 空间复杂度$\mathcal{O}(1)$

:::details 参考代码（Rust）

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

我们检查是否存在满足$X_i<S$且$Y_i>D$的咒语。

- 时间复杂度$\mathcal{O}(N)$
- 空间复杂度$\mathcal{O}(1)$

:::details 参考代码（Rust）

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

枚举所有的选择情况（一共$2^K$种），从中找到最大结果即可。

- 时间复杂度$\mathcal{O}(2^K(K+M))$
- 空间复杂度$\mathcal{O}(N)$

:::details 参考代码（Rust）

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

假设数列首元素为$a$，一共有$n$个元素，则总和为$\frac{(a+a+n-1)n}{2}=N$。所以我们可以枚举$2N$的所有因子，检查其是否可以作为$N$。判断的条件是$\frac{2N}{n}+1-n=2a$必须是偶数。

- 时间复杂度$\mathcal{O}(\sqrt{N})$
- 空间复杂度$\mathcal{O}(M)$，其中$M$是$2N$的因子数。

:::details 参考代码（Rust）

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

:::details 参考代码（C++）

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

我们可以把邻接对看成边，然后通过BFS找出所有关键宝石之间的最短路径，这些最短路径构成一个最短路径矩阵。

接下来我们进行状态压缩动态规划。状态为$dp[mask][last]$，其中$mask$表示我们已经获取到的关键宝石，$last$表示当前序列的最后一个宝石（一定是一个关键宝石）。对于每一个状态，我们枚举$next$，也即下一个选取的关键宝石来进行转移。

最后的答案就是$\min_i{dp[2^K-1][i]}$。

- 时间复杂度$\mathcal{O}(KN+K^2\cdot2^K)$
- 空间复杂度$\mathcal{O}(N+M+K\cdot2^K)$

:::details 参考代码（Rust）

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

:::details 参考代码（C++）

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

我们可以用树状数组或类似归并排序的方法（实际上是CDQ分治）来求出原序列的逆序数。接下来，我们注意到当把$K$（从$1$开始的）从序列开始移动到序列结尾时，减少了$K-1$个逆序对，同时新增了$N-K$个逆序对，因此变化量为$N+1-2K$。这样我们就可以逐个求出所有序列的逆序数了。

- 时间复杂度$\mathcal{O}(N\log N)$
- 空间复杂度$\mathcal{O}(N)$

:::details 参考代码（Rust）

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

:::details 参考代码（C++）

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

