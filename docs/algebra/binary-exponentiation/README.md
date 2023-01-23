---
sidebarDepth: 3
---

# 倍增

倍增是一种非常重要的思想，在CP中有着丰富的应用。

倍增的本质可以表述为，对于一种操作$f(x)$，通过计算$f(x),f^2(x),f^4(x),\cdots,f^{2^k}(x)$来加速求解$f^n(x)$。假设$f(x)$的时间复杂度为$O(1)$，那么直接计算$f^n(x)$的时间复杂度为$O(n)$，而通过倍增的方法，则可以加速到$O(\log n)$。

## 快速幂

快速幂是倍增最常见的应用场景。所谓快速幂，指的是快速求解数$x$在模$m$意义下的幂$x^y\mod m$。

### 递归求解

比较直接的想法是递归进行求解。很容易得到下面的递归式：

$$
x^y=\left\{\begin{aligned}
&1 & y=0 \\
&(x^{\frac{y}{2}})^2 & y\text{为大于0的偶数} \\
&(x^{\frac{y-1}{2}})^2\cdot x & y\text{为大于0的奇数}\end{aligned}\right.
$$

模板题：[洛谷P1226](https://www.luogu.com.cn/problem/P1226)

:::details 参考代码（C++）

```cpp
#include <iostream>

using namespace std;
int fexp(int b, int p, int k) {
  if (p == 0)
    return 1 % k;
  int half = fexp(b, p / 2, k);
  int ans = (long long)half * half % k;
  if (p & 1)
    ans = (long long)ans * b % k;
  return ans;
}

int main() {
  int b, p, k;
  cin >> b >> p >> k;
  cout << b << "^" << p << " mod " << k << "=" << fexp(b, p, k);
}
```

:::

递归方法对于快速幂已经足够，但其缺乏足够的普适性，无法推广到更加一般性的问题。

### 迭代求解

与递归方法相比，迭代方法的思想更加贴近倍增方法的本质。利用$x^y=x^{\sum_{i=0}^k c_i2^i}$，我们可以从$x^1,x^2,\cdots,x^{2^k}$来计算出$x^y$，而这些数值本身是可以通过反复进行平方运算在$O(k)=O(\log y)$的时间内求得的。这里我们需要得到一个非负整数的二进制表示（从低位到高位），只需要不断除以2取余即可。

模板题：[洛谷P1226](https://www.luogu.com.cn/problem/P1226)

:::details 参考代码（C++）

```cpp
#include <iostream>

using namespace std;

int fexp(int b, int p, int k) {
  int ans = 1 % k;
  while (p) {
    if (p & 1)
      ans = (long long)ans * b % k;
    b = (long long)b * b % k;
    p >>= 1;
  }
  return ans % k;
}

int main() {
  int b, p, k;
  cin >> b >> p >> k;
  cout << b << "^" << p << " mod " << k << "=" << fexp(b, p, k);
}
```

:::

## 倍增思想的推广

### 快速乘

将快速幂中的乘法运算替换为加法运算，我们就可以得到快速乘的算法，也即用$O(\log n)$次加法运算来实现乘$n$的操作。

### 矩阵快速幂

将快速幂中的底数改为一个方阵，并将整数乘法改为矩阵乘法，我们就可以得到矩阵快速幂的算法。

### 倍增法求LCA

如果把$f(x)$看作是求取$x$的父节点，那么$f^n(x)$就可以是看成求取$x$第$n$代的祖先节点。倍增法求LCA的关键就是用倍增方法来快速求取$f^n(x)$。

### 稀疏表

稀疏表是一种用于RMQ（区间最值查询）的数据结构。稀疏表的构建同样使用了倍增的思想。

## 练习题

### [ARC060E - Tak and Hotels](https://atcoder.jp/contests/arc060/tasks/arc060_c)

:::details 提示

我们可以求出从每个旅店出发，一天之内能到的最远的旅店编号；对其进行倍增，就可以得到$2^k$天能到的最远的旅店的编号。

:::

:::details 参考代码（Rust）

```rust
use proconio::input;

const K: usize = 18;

fn main() {
    input! {
        n: usize,
        x: [usize; n],
        l: usize,
        q: usize,
        queries: [(usize, usize); q],
    }

    let mut right = vec![vec![n; K]; n + 1];
    for i in 1..=n {
        let mut lo = i;
        let mut hi = n;
        while lo <= hi {
            let mid = (lo + hi) >> 1;
            let dist = x[mid - 1] - x[i - 1];
            if dist > l {
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        right[i][0] = hi;
    }
    for k in 1..K {
        for i in 1..=n {
            if right[i][k - 1] < n {
                right[i][k] = right[right[i][k - 1]][k - 1];
            }
        }
    }

    let mut left = vec![vec![1usize; K]; n + 1];
    for i in 1..=n {
        let mut lo = 1usize;
        let mut hi = i;
        while lo <= hi {
            let mid = (lo + hi) >> 1;
            let dist = x[i - 1] - x[mid - 1];
            if dist > l {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        left[i][0] = lo;
    }
    for k in 1..K {
        for i in 1..=n {
            if left[i][k - 1] > 1 {
                left[i][k] = left[left[i][k - 1]][k - 1];
            }
        }
    }

    for (a, b) in queries {
        let mut acc = 0;
        let mut pos = a;
        if a < b {
            for k in (0..K).rev() {
                if right[pos][k] < b {
                    acc ^= 1 << k;
                    pos = right[pos][k];
                }
            }
            if pos != b {
                acc += 1;
            }
        } else {
            for k in (0..K).rev() {
                if left[pos][k] > b {
                    acc ^= 1 << k;
                    pos = left[pos][k];
                }
            }
            if pos != b {
                acc += 1;
            }
        }
        println!("{}", acc);
    }
}
```

:::
