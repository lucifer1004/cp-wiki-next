# Google Kick Start 2020 Round E

## Problem A - [Longest Arithmetic](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff47/00000000003bf4ed)

### 题目描述

给定一个长度为$N$（$2\leq N\leq2\times10^5$）的数组，找出其中最长的由数组连续元素构成的等差数列。

### 题解

显然，前两个数字可以构成一个等差数列，所以我们从第三个数字开始。

如果当前数字和前一个数字的差，与前一个数字与再前面一个数字的差相等，就可以把当前数字接到前一个等差数列的后面，从而当前等差数列的长度增加$1$。否则，我们需要开始一个新的等差数列，将计数器重新置为$2$。

总时间复杂度为$O(N)$。

:::details 参考代码（Python）

```python
t = int(input())
for case_num in range(1, t + 1):
    n = int(input())
    a = list(map(int, input().split()))
    ans = 2
    cnt = 2
    for i in range(2, n):
        if a[i] - a[i - 1] == a[i - 1] - a[i - 2]:
            cnt += 1
        else:
            cnt = 2
        ans = max(ans, cnt)
    print("Case #{}: {}".format(case_num, ans))
```

:::

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;

template <typename T> void read(T &x) {
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
  void solve(int case_num) {
    int n;
    read(n);
    vector<int> a(n);
    for (int i = 0; i < n; ++i)
      read(a[i]);
    int ans = 2, current = 2;
    for (int i = 2; i < n; ++i) {
      if (a[i] - a[i - 1] == a[i - 1] - a[i - 2])
        current++;
      else
        current = 2;
      ans = max(ans, current);
    }
    printf("Case #%d: %d\n", case_num, ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem B - [High Buildings](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff47/00000000003bef73)

### 题目描述

有$N$座建筑物排成一排，小A从最左边往右看，小B从最右边往左看。已知建筑物的遮挡规则为：如果一个建筑物左边没有严格高于它的建筑物，它就能在左边被看到；如果右边没有严格高于它的建筑物，就能在右边被看到。小A发现自己能看到$A$座建筑物，小B发现自己能看到$B$座建筑物，他俩交换了一下信息，发现有$C$座建筑物是他俩都能看到的。问：是否存在一种可能的建筑物高度设置方案（建筑物的高度必须是$[1,N]$范围内的整数），使得他们的信息成立？如果可能，输出任意一种方案；如果不可能，输出无解。

数据范围：

- $1\leq N\leq100$
- $1\leq C\leq N$
- $C\leq A\leq N$
- $C\leq B\leq N$

### 题解

这题并不难，但是需要考虑到每一种情况，所以即使排名靠前的参赛者，也有很多人这一题吃了WA。

首先，有一种显而易见的无解情形。小A和小B共同看到的有$C$座，那么小A单独看到的有$A-C$座，小B单独看到的有$B-C$座，因此，这里就有了$C+(A-C)+(B-C)=A+B-C$座不同的建筑物。如果$A+B-C>N$，那么显然不存在合法的情形。

还有一种容易被遗漏的无解情形。如果$A=B=C=1$而$N\neq1$，那么无论我们将最高的建筑物放在哪一个位置，小A和小B中总有一个人会看到超过一个建筑物，从而$A=1$和$B=1$不能同时成立。

接下来考虑有解时的布局。因为如果$A$、$B$互换，我们只需要将所有建筑物按倒序排列即可，所以下面我们假定$A\leq B$。

$C$座共同看到的建筑物，肯定是最高的，同时它们的高度应该都一样。不妨将它们的高度设为$N$。

直观的想法是把这$C$座连续地排列在中间，但这可能会带来问题。比如$A=B=C=2$，而$N=4$时，我们如果把两个$C$连续排列，则无论怎么排列，$A$和$B$都会有一个人无法被满足。因此，我们考虑将这$C$座最高的建筑物分两组排列。这样，我们正好可以把既没有被小A看到，也没有被小B看到的$N-(A+B-C)$座放在这两部分之间，并且高度设置为$1$。然后我们在两边分别放$A$和$B$独自看到的建筑物，并把高度统一设置为$N-1$（这里至少需要设置为$2$，原因在下面会解释）。这样就能够满足要求了。

有一种特殊情况是$C=1$，这时我们没有办法分出两组来。我们用$X$表示两者都没有看到的建筑物，则可能的情形有

1. $\underbrace{A\cdots A}_{A-C个}C\underbrace{X\cdots X}_{N-(A+B-C)个}\underbrace{B\cdots B}_{B-C个}$
2. $\underbrace{A\cdots A}_{A-C个}\underbrace{X\cdots X}_{N-(A+B-C)个}C\underbrace{B\cdots B}_{B-C个}$

这两种。注意$A\leq B$，因为我们已经排除了$A=B=C=1$且$N\neq1$这一情形，所以此时必然有$B>1$，也即$B-C=B-1>0$。但是$A=1$是有可能的，也就是说$A-C$有可能为$0$。这时，如果我们采用第二种方案，小A就会看到本来不应该看到的$X$，这样就错了。因此，我们需要保证小A那一侧至少有一个$C$，也就是要采用上面的第一种方案。但这时，我们还需要保证小B不能看见$X$，因此我们需要有$B>X$，这也就是上面要把高度设置为$N-1$的原因。

所以，我们最后的放置方法为：

$\underbrace{A\cdots A}_{A-C个}C\underbrace{X\cdots X}_{N-(A+B-C)个}\underbrace{C\cdots C}_{C-1个}\underbrace{B\cdots B}_{B-C个}$

特别的，$N=2$时，$N-1$就是$1$，但我们可以逐一验证$N=2$的情形，去掉无解的情况之后，其他情形，我们的放置方法都是成立的。

当然，如果我们前面交换过$A$和$B$，最后还需要倒序输出。

总时间复杂度为$O(N)$。


:::details 参考代码（Python）

```python
t = int(input())
for case_num in range(1, t + 1):
    n, a, b, c = map(int, input().split())
    if a + b - c > n or (a == b and a == c and c < min(n, 2)):
        print("Case #{}: IMPOSSIBLE".format(case_num))
        continue
    rev = False
    if a > b:
        tmp = a
        a = b
        b = tmp
        rev = True
    arrangement = [n - 1] * (a - c) + [n] + [1] * (n - (a + b - c)) + \
        [n] * (c - 1) + [n - 1] * (b - c)
    if rev:
        arrangement = arrangement[::-1]
    ans = ' '.join(map(str, arrangement))
    print("Case #{}: {}".format(case_num, ans))
```

:::

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;

template <typename T> void read(T &x) {
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
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n, a, b, c;
    read(n), read(a), read(b), read(c);
    if (a + b - c > n || a < c || b < c) {
      printf("IMPOSSIBLE\n");
      return;
    }
    if (a == c && b == c && c < min(n, 2)) {
      printf("IMPOSSIBLE\n");
      return;
    }
    bool rev = false;
    if (a > b)
      swap(a, b), rev = true;
    vector<int> ans;
    int ra = a - c, rb = b - c;
    for (int i = 0; i < ra; ++i)
      ans.emplace_back(n - 1);
    ans.emplace_back(n);
    for (int i = 0; i < n - ra - rb - c; ++i)
      ans.emplace_back(1);
    for (int i = 0; i < c - 1; ++i)
      ans.emplace_back(n);
    for (int i = 0; i < rb; ++i)
      ans.emplace_back(n - 1);
    if (rev)
      reverse(ans.begin(), ans.end());
    for (int i : ans)
      printf("%d ", i);
    printf("\n");
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem C - [Toys](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff47/00000000003bede9)

### 题目描述

编号为$1\cdots N$的$N$（$N\leq10^5$）个玩具排成一圈，每个玩具有一个玩耍时间$e_i$（表示小朋友会持续玩这个玩具的时间），还有一个冷却时间$r_i$（表示小朋友两次玩这个玩具之间至少需要间隔的时间）。现在小朋友从$1$号玩具开始按顺序玩起，当他第一次遇到一个还没有到冷却时间的玩具时，他就会停下来。问，最少去掉其中的几个玩具，可以让小朋友无限地玩下去，或者玩的时间最长？

### 题解

显然，第一次玩一个玩具的时候是不存在冷却时间这一说法的。对于之后的玩耍，两次玩同一个玩具之间的间隔里必然玩了其他所有玩具，所以我们不妨将冷却时间这一概念用公式进行一下表达，一个玩具能被再次玩耍的前提条件是：

$$r_i\leq\sum_{j\neq i}e_j=(\sum_je_j)-e_i$$

移项后得到:

$$r_i+e_i\leq\sum_je_j$$

从这里，我们隐约可以看出，需要把$r_i+e_i$作为一个重要的量来进行考虑。

假设现在所有玩具都满足$r_i+e_i\leq\sum_je_j$，小朋友就可以无限地玩下去。而如果有玩具不满足，小朋友就必定会在再次玩那个玩具之前停止。下面，因为存在删除的情况，我们用$CSUM$代表当前剩余玩具的玩耍时间之和。

首先，我们考虑能否通过删除一些玩具，让小朋友能够无限玩下去。我们应该优先删除什么样的玩具呢？考虑某个玩具$a$，它满足$r_a+e_a>CSUM$。如果我们不删除$a$，而是删除了其他玩具，则$CSUM$会减小，而$r_a+e_a$不变，因此我们不可能通过删除其他玩具使得该玩具能够满足冷却时间条件。因此，我们必须删除该玩具。所以，我们可以将这些玩具按照$r_i+e_i$进行降序排列，从最大的不符合条件的开始删除，在删除的过程中同时更新$CSUM$，直到剩下所有玩具都满足条件（我们得到了问题的解：删除刚才那些元素可以使得小朋友无限地玩下去），或者所有玩具都被删除（不可能使得小朋友无限地玩下去）。

如果不可能使得小朋友无限玩下去，我们可以发现，小朋友最多玩同一个玩具两次。因为，如果小朋友玩了某一个玩具三次，就代表所有玩具都至少被玩了两次，说明冷却时间条件都可以被满足，可以无限玩下去，这就与假设矛盾了。

我们不妨考虑哪些玩具可以被玩两次。玩两次，意味着这一玩具需要满足冷却时间条件。从上面解决无限循环部分的经验，我们可以想到用一个大根堆维护当前被选择玩两次的玩具的$e_i+r_i$。

我们从所有玩具都只玩了一次的状态开始。最初没有玩具被删除，$CSUM=\sum_je_j$，此时的总玩耍时间$CVAL=CSUM$，已删除玩具的个数$CDEL=0$。

当我们考虑第$i$个玩具时，如果$e_i+r_i\leq CSUM$，代表这一玩具当前能够满足冷却时间条件，所以我们把它加入大根堆，同时更新$CVAL$，并更新答案。反之，如果它不能满足，则我们不能取这一玩具，此时我们首先要从$CVAL$中去掉$e_i$（因为我们一开始玩了一次这个玩具，而删除后就一次都不能玩了），同时要更新$CSUM$。因为$CSUM$变小了，原本大根堆中的满足冷却时间条件的玩具，可能不再满足，所以我们要从$e_j+r_j$最大的开始逐个删除，在每次删除时，要从$CVAL$中去掉$2e_i$（因为在我们原本的规划中，这个玩具玩了两次，而删除后就一次都不能玩了），同时继续更新$CSUM$，然后继续判断大根堆中的玩具是否都满足冷却时间条件，这样循环下去，直到大根堆中所有玩具都满足条件，或大根堆为空（不再有玩了两次的玩具）。

在整个过程中，我们需要记录能够得到的最长玩耍时间$MAX\_VAL$和对应的删除次数$MIN\_DEL$。因为我们一直在删除，而没有重新添加过，所以只有在$CVAL>MAX\_VAL$时才需要进行更新。

:::details 参考代码（C++）

```cpp
#include <cstdio>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;
typedef long long ll;

template <typename T> void read(T &x) {
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
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n;
    read(n);
    vector<int> e(n + 1), r(n + 1);
    priority_queue<pair<int, int>> pq;
    ll sum = 0;
    for (int i = 1; i <= n; ++i) {
      read(e[i]), read(r[i]);
      pq.push({e[i] + r[i], i});
      sum += e[i];
    }
    ll csum = sum;
    while (!pq.empty()) {
      int val = pq.top().first, i = pq.top().second;
      if (val <= csum)
        break;
      else {
        pq.pop();
        csum -= e[i];
      }
    }
    if (!pq.empty()) {
      printf("%d INDEFINITELY\n", n - (int)pq.size());
      return;
    }
    ll max_val = csum = sum, min_del = 0, cdel = 0, cval = sum;
    for (int i = 1; i <= n; ++i) {
      if (e[i] + r[i] <= csum) {
        cval += e[i];
        pq.push({e[i] + r[i], i});
        if (cval > max_val) {
          max_val = cval;
          min_del = cdel;
        }
      } else {
        csum -= e[i];
        cval -= e[i];
        cdel++;
        while (!pq.empty() && pq.top().first > csum) {
          int val = pq.top().first, j = pq.top().second;
          pq.pop();
          csum -= e[j];
          cval -= 2 * e[j];
          cdel++;
        }
      }
    }
    printf("%lld %lld\n", min_del, max_val);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

## Problem D - [Golden Stone](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ff47/00000000003bef29)

### 题目描述

有$N$座城市被$M$条无向边联通，保证任意两座城市之间相互可达。一共有$S$种石头，每个城市可以获取其中的若干种，但没有城市能获取第$1$种石头。另外，有$R$种配方，每个配方最多需要三块石头作为原料（三块石头可能相同，也可能不同），可以产出一块新石头。题目保证第$1$种石头可以被生产出来。小明每次可以带着一块石头在城市间穿梭，带着一块石头经过一条边，需要消耗一个单位的能量。小明在根据配方制作石头时，必须手头同时有所有的原料（不能有些在这个城市，另一些在另一个城市）。问小明最少需要多少能量，可以生产出一块第$1$种石头。如果答案大于等于$10^{12}$，则输出$-1$。

### 题解

这一题看起来非常复杂。相对容易想到的是用$cost[i][j]$表示在第$j$个城市制造（或直接获得）一块第$i$种石头的代价，最后我们要求的就是$\min cost[1][j]$。如果把$(i,j)$二元组看成节点，这一问题有可能被转化为一个最短路径问题。

路径的转移有两种情况：

- 我们根据某一配方，在第$j$个城市制造出一种新石头$s_k$。这样可以转移到状态$(s_k,j)$。
- 我们带着这块石头去另一个城市$c_k$。这样可以转移到状态$(i,c_k)$。

第二种转移很好处理，直接把当前的花费加一即可，麻烦的是如何对配方进行处理。这一块我在比赛时并没能很好地处理。比赛后，我读了前几名的代码，其中让我印象最深刻是第一名的[ecnerwala](https://codingcompetitions.withgoogle.com/kickstart/submissions/000000000019ff47/ZWNuZXJ3YWxh)的代码。他处理配方的方法非常漂亮。他是怎么做的呢？

我们用数组$ingredients\_need[r_i]$记录第$r_i$种配方需要的原料数目，用二维数组$needed\_by[i]$记录第$i$种石头在哪些配方里被用到了（如果在某个配方里被用了多次，就记录多次），用数组$ingredients\_got[r_i][j]$记录在第$j$个城市已经收集了第$r_i$种配方的原料的数目，用数组$recipe\_cost[r_i][j]$记录在第$j$个城市收集第$r_i$种配方的原料的成本。

关键点在于，在Dijkstra算法求最短路径的过程中，每一个状态$(i,j)$只会被松弛一次。所以说，我们可以在松弛$(i,j)$时，根据$needed\_by[i]$，将第$i$种石头加入到对应的$ingredients\_got$和$recipe\_cost$中。如果当前$ingredients\_got[r_i][j]=ingredients\_need[r_i]$，这就表示第$r_i$种配方已经具备了在$j$城市进行制作的条件，我们就可以尝试进行第一种转移。因为这是第一次该配方能够在该城市被制作（在此之前$ingredients\_got[r_i][j]$还未被满足），所以Dijkstra算法的性质可以保证，我们的这一方案，一定是在$j$城市制作第$r_i$种配方的最优方案。

这一算法的总时间复杂度为$O((SN+MS+RN)\log(SN))$。

下面的代码是我比赛后参考[ecnerwala](https://codingcompetitions.withgoogle.com/kickstart/submissions/000000000019ff47/ZWNuZXJ3YWxh)的代码重写的版本。

:::details 参考代码（C++）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <queue>
#include <vector>

using namespace std;
typedef long long ll;
const ll INF = 1e12;

template <typename T> void read(T &x) {
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
  int n, m, s, r;

  int hash(int si, int ni) const { return si * (n + 1) + ni; };

public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    read(n), read(m), read(s), read(r);
    vector<vector<int>> adj(n + 1), needed_by_recipe(s + 1);
    vector<vector<ll>> stone_cost(s + 1, vector<ll>(n + 1, INF)),
        recipe_cost(r, vector<ll>(n + 1));
    vector<vector<int>> ingredients_got(r, vector<int>(n + 1));
    vector<int> ingredients_need(r), product(r);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    for (int i = 0; i < m; ++i) {
      int u, v;
      read(u), read(v);
      adj[u].emplace_back(v);
      adj[v].emplace_back(u);
    }

    for (int city = 1; city <= n; ++city) {
      int stone_num;
      read(stone_num);
      for (int j = 0; j < stone_num; ++j) {
        int stone;
        read(stone);
        stone_cost[stone][city] = 0;
        pq.push({0, hash(stone, city)});
      }
    }

    for (int i = 0; i < r; ++i) {
      read(ingredients_need[i]);
      for (int j = 0; j < ingredients_need[i]; ++j) {
        int ingredient;
        read(ingredient);
        needed_by_recipe[ingredient].emplace_back(i);
      }
      read(product[i]);
    }

    while (!pq.empty()) {
      auto top = pq.top();
      pq.pop();
      ll c = top.first;
      int u = top.second;
      int stone = u / (n + 1), city = u % (n + 1);
      if (c != stone_cost[stone][city])
        continue;
      for (int recipe : needed_by_recipe[stone]) {
        ingredients_got[recipe][city]++;
        ll nc = recipe_cost[recipe][city] += c;
        if (ingredients_got[recipe][city] == ingredients_need[recipe]) {
          if (nc < stone_cost[product[recipe]][city]) {
            stone_cost[product[recipe]][city] = nc;
            pq.push({nc, hash(product[recipe], city)});
          }
        }
      }
      for (int nxt : adj[city]) {
        if (c + 1 < stone_cost[stone][nxt]) {
          stone_cost[stone][nxt] = c + 1;
          pq.push({c + 1, hash(stone, nxt)});
        }
      }
    }
    ll ans = *min_element(stone_cost[1].begin(), stone_cost[1].end());
    printf("%lld\n", ans == INF ? -1 : ans);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::

比赛时，我使用的是另一种思路。在每次迭代中，遍历所有的配方，如果某一配方当前可以被制作，就尝试在每一个城市制作它，如果更新了之前的状态，就再尝试把这一配方的产物搬运到其他所有城市，更新在其他城市获取这一产物的代价。如果某次迭代中，没有任何状态被更新，就终止迭代。

这种方法的时间复杂度我无法准确给出，但肯定是比较高的。可能比赛的评测数据并没有特别刁钻的，所以最后勉强通过了。姑且也放在这里，供大家批评。

:::details 参考代码（C++，我自己比赛时的解答）

```cpp
#include <algorithm>
#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;
typedef long long ll;
const ll INF = 1e12;

template <typename T> void read(T &x) {
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

struct Recipe {
  vector<int> in;
  int out;
};

class Solution {

public:
  void solve(int case_num) {
    printf("Case #%d: ", case_num);
    int n, m, s, r;
    read(n), read(m), read(s), read(r);
    vector<vector<ll>> dist(n + 1, vector<ll>(n + 1, INF)),
        cost(s + 1, vector<ll>(n + 1, INF));
    vector<ll> lo(s + 1, INF);
    vector<Recipe> recipes;
    for (int i = 0; i < m; ++i) {
      int u, v;
      read(u), read(v);
      dist[u][v] = dist[v][u] = 1;
    }

    for (int k = 1; k <= n; ++k) {
      dist[k][k] = 0;
      for (int i = 1; i <= n; ++i) {
        if (i == k)
          continue;
        for (int j = 1; j <= n; ++j) {
          if (j == k || j == i)
            continue;
          dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
        }
      }
    }

    for (int i = 1; i <= n; ++i) {
      int c;
      read(c);
      for (int j = 0; j < c; ++j) {
        int si;
        read(si);
        lo[si] = 0;
        cost[si][i] = 0;
        for (int k = 1; k <= n; ++k)
          cost[si][k] = min(cost[si][k], dist[i][k]);
      }
    }

    for (int i = 0; i < r; ++i) {
      int k;
      read(k);
      vector<int> v(k);
      for (int j = 0; j < k; ++j)
        read(v[j]);
      sort(v.begin(), v.end());
      int result;
      read(result);
      recipes.push_back({v, result});
    }

    bool changed = true;
    auto valid = [&](Recipe &r) {
      for (int i : r.in)
        if (lo[i] == INF)
          return false;
      return true;
    };
    while (changed) {
      changed = false;
      for (auto &recipe : recipes) {
        if (!valid(recipe))
          continue;
        for (int i = 1; i <= n; ++i) {
          ll c = 0;
          for (int si : recipe.in)
            c += cost[si][i];
          if (c < cost[recipe.out][i]) {
            changed = true;
            lo[recipe.out] = min(lo[recipe.out], c);
            cost[recipe.out][i] = c;
            for (int j = 1; j <= n; ++j)
              cost[recipe.out][j] = min(cost[recipe.out][j], c + dist[i][j]);
          }
        }
      }
    }
    printf("%lld\n", lo[1] == INF ? -1 : lo[1]);
  }
};

int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int t;
  read(t);
  for (int i = 1; i <= t; ++i) {
    Solution solution = Solution();
    solution.solve(i);
  }
}
```

:::
