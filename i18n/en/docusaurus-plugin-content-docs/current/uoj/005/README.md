# UOJ005 - Zoo

[Submit Your Solution](http://uoj.ac/problem/5)

:::tip

This problem is from NOI 2014.

:::

## Description

The zoo director is teaching animals the KMP algorithm. In KMP, we have $next[i]$ meaning the length of the longest substring of $s[1..i]$ which is both prefix and suffix of $s[1..i]$ and is not $s[1..i]$ itself. The zoo director is not satisfied with that and further asks animals to find $num[i]$, which is the number of substrings of $s[1..i]$ which are both prefix and suffix of $s[1..i]$, and the prefix and the suffix do not overlap. Can you write a program for that to help the animals?

You only need to output $\prod_{i=1}^L(num[i]+1)\mod(10^9+7)$.

## Input

- The first line contains one integer $t$ ($t\leq5$), number of test cases.
- The following $t$ lines each contain a string $s$ ($|s|\leq10^6$) which consists of lower case letters only.

## Output

$t$ lines for $t$ test cases. Every line contains one integer, the result $\prod_{i=1}^L(num[i]+1)\mod(10^9+7)$ for string $s$ in this test case.

## Samples

### Input 1

```txt
3
aaaaa
ab
abcababc
```

### Output 1

```txt
36
1
32
```

## Tutorial

:::details Hint 1

Use Z-Algorithm.

:::

:::details Hint 2

Each $z[i]$ (we need to constraint it below $i$ since overlapping is not allowed) will contribute $1$ to $num[i\dots i+z[i]-1]$. So we can use a difference array and then get the values of each $num[i]$.

:::

:::details Code (C++)

```cpp
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;
const ll MOD = 1e9 + 7;

vector<int> z_function(string s) {
  int n = (int)s.size();
  vector<int> z(n);
  for (int i = 1, l = 0, r = 0; i < n; ++i) {
    if (i <= r)
      z[i] = min(r - i + 1, z[i - l]);
    while (i + z[i] < n && s[z[i]] == s[i + z[i]])
      ++z[i];
    if (i + z[i] - 1 > r)
      l = i, r = i + z[i] - 1;
  }
  return z;
}

int main() {
  int t;
  cin >> t;
  while (t--) {
    string s;
    cin >> s;
    vector<int> z = z_function(s);
    int n = (int)s.size();
    vector<int> diff(n + 1);
    for (int i = 1; i < n; ++i) {
      int zi = min(z[i], i);
      diff[i]++, diff[i + zi]--;
    }
    vector<int> num(n);
    for (int i = 1; i < n; ++i)
      num[i] = num[i - 1] + diff[i];
    ll ans = 1;
    for (int ni : num)
      ans = ans * (ni + 1) % MOD;
    cout << ans << endl;
  }
}
```

:::
