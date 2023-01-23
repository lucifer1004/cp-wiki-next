# UOJ002 - Hard to Get Up

[Submit Your Solution](http://uoj.ac/problem/2)

:::tip

This problem is from NOI 2014.

:::

## Description

A warrior is to slay an evil dragon which hinders people from getting up easily. The dragon has $n$ gates defending it from attacks. On each gate there is an operation $op$ and a parameter $t$. $op$ can be $\text{OR}$, $\text{XOR}$ or $\text{AND}$，while $t$ is a non-negative integer. 

The warrior needs to pass the gates one by one. If his attack power is $x$ before passing the gate, then his attack damage becomes $x\ op\ t$ after passing it. The damage taken by the dragon is the final result after all $m$ operations.

The warrior can freely choose his attack power from $[0,m]$, which must be an integer. However, the intermediate results and the final damage can be larger than $m$. Please help the warrior calculate the highest damage he can make if he chooses his attack power optimally.

## Input

In the first line, there are two integers $n$ ($2\leq n\leq10^5$) and $m$ ($2\leq m<2^{30}$), representing the number of gates and the upper bound of the warrior's attack power.

The following $n$ lines each contain a string $op$ and a non-negative integer $t$ ($0\leq t<2^{30}$) separated by a whitespace. $op$ is one of $\text{OR}$, $\text{XOR}$ or $\text{AND}$, and $t$ is the corresponding parameter.

## Output

An integer, the highest damage the warrior can make.

## Samples

### Input 1

```txt
3 10
AND 5
OR 6
XOR 7
```

### Output 1

```txt
1
```

### Sample Explanation

If the warrior chooses $4$ as his initial attack power, then we have 

$$
\begin{aligned}
4\text{ AND }5=4 \\
4\text{ OR }6=6 \\
6\text{ XOR }7=1
\end{aligned}
$$

So the final damage is $1$.

Similarly, we can calculate that the final damage is $0$ if the initial attack power is $1,3,5,7,9$ and $1$ if the initial attack power is $0,2,4,6,8,10$. So the highest damage the warrior can make is $10$.

## Tutorial

:::details Hint 1

Consider each bit separately.

:::

:::details Hint 2

If for a set bit of $m$, it is not worse to choose $0$, we should choose $0$. More than that, we are free to choose from $0$ and $1$ for the bits following.

:::

:::details Code (C++)

```cpp
#include <bitset>
#include <iostream>
#include <vector>

using namespace std;

inline int go(int x, int y, int op_type) {
  switch (op_type) {
  case 0:
    return x | y;
  case 1:
    return x & y;
  default:
    return x ^ y;
  }
}

int main() {
  int n, m;
  cin >> n >> m;
  vector<int> op(n);
  vector<bitset<32>> t(n);
  for (int i = 0; i < n; ++i) {
    string s;
    int ti;
    cin >> s >> ti;
    t[i] = bitset<32>(ti);
    if (s == "AND")
      op[i] = 1;
    else if (s == "XOR")
      op[i] = 2;
  }
  int ans = 0;
  for (int i = 29; i >= 0; --i) {
    bool flag = m & (1 << i);
    int zero = 0, one = 1;
    for (int j = 0; j < n; ++j) {
      zero = go(zero, t[j][i], op[j]);
      one = go(one, t[j][i], op[j]);
    }
    one = one && flag;
    if (flag && (zero || !one))
      m = (1 << i) - 1;
    if (zero || one)
      ans += 1 << i;
  }
  cout << ans;
}
```

:::
