---
sidebarDepth: 3
---

# 线段树

## 什么是线段树

线段树（Segment Tree）是一种树型数据结构，树中的每个节点代表一段$[L,R]$的区间，一个节点的左孩子和右孩子的区间不相交且其并恰好等于该节点对应的区间。树的叶子节点对应的区间为$[L,L]$，也即单点。

下图给出了一个对应区间为$[1,4]$的线段树示例。

![线段树示例](./segment-tree.png)

:::details 作图代码（SageMath）

```python
G = Graph({0: [1, 2], 1: [3, 4], 2: [5, 6]})
G.relabel({0: '[1,4]', 1: '[3,4]', 2: '[1,2]', 3: '[4,4]', 4: '[3,3]', 5: '[2,2]', 6: '[1,1]'})
P = G.plot(vertex_size=1500, layout='tree', tree_root='[1,4]', tree_orientation='down')
P.show()
```

:::

线段树常用于含修改的区间查询。比较裸的题目会直接包含若干种操作，其中一些为修改操作，另一些为查询操作。还有些题目，则需要通过一定的观察才能发现可以用线段树进行求解。

## 标记永久化

标记永久化指的是不下传懒标记，而是在每次查询时，逐层考虑懒标记中的信息。对于主席树、树套树等复杂数据结构，标记永久化有减小常数的作用，并能够一定程度上减少代码量。

## 学习资源

### ITMO Academy: pilot course

- [Part 1](https://codeforces.com/edu/course/2/lesson/4)
- [Part 2](https://codeforces.com/edu/course/2/lesson/5)

来自Codeforces EDU。包括视频教程、图文教程和35道练习题。其中Part 1侧重于单点修改，基本不涉及懒标记；Part 2侧重于区间修改，懒标记是其中的重要内容。

## 练习题

### 模板题：[CF EDU - Segment Tree for the Minimum](https://codeforces.com/edu/course/2/lesson/4/1/practice/contest/273169/problem/B)

单点修改+区间查询。

:::details 参考实现（Kotlin）

```kotlin
fun readInts(): List<Int> {
    return readLine()!!.split(" ").map(String::toInt)
}

class SegmentTree(private val a: List<Int>) {
    private val len = a.size * 4
    private val s = LongArray(len)

    private fun calc(idx: Int) {
        s[idx] = s[idx shl 1].coerceAtMost(s[idx shl 1 xor 1])
    }

    fun build(idx: Int, l: Int, r: Int) {
        if (l == r)
            s[idx] = a[l - 1].toLong()
        else {
            val mid = (l + r) shr 1
            build(idx shl 1, l, mid)
            build(idx shl 1 xor 1, mid + 1, r)
            calc(idx)
        }
    }

    fun update(idx: Int, pos: Int, v: Int, cl: Int, cr: Int) {
        if (cl == pos && cl == cr) {
            s[idx] = v.toLong()
            return
        }
        val mid = (cl + cr) shr 1
        if (pos <= mid)
            update(idx shl 1, pos, v, cl, mid)
        else
            update(idx shl 1 xor 1, pos, v, mid + 1, cr)
        calc(idx)
    }

    fun query(idx: Int, l: Int, r: Int, cl: Int, cr: Int): Long {
        if (cl >= l && cr <= r)
            return s[idx]
        var ans = Long.MAX_VALUE
        val mid = (cl + cr) shr 1
        if (l <= mid)
            ans = ans.coerceAtMost(query(idx shl 1, l, r, cl, mid))
        if (mid < r)
            ans = ans.coerceAtMost(query(idx shl 1 xor 1, l, r, mid + 1, cr))
        return ans
    }
}

fun main() {
    val (n, m) = readInts()
    val st = SegmentTree(readInts())
    st.build(1, 1, n)
    val ans = mutableListOf<String>()
    for (i in 0 until m) {
        val (op, v1, v2) = readInts()
        if (op == 1)
            st.update(1, v1 + 1, v2, 1, n)
        else
            ans.add(st.query(1, v1 + 1, v2, 1, n).toString())
    }
    println(ans.joinToString("\n"))
}
```

:::

### 模板题：[洛谷 P3372 - 线段树 1](https://www.luogu.com.cn/problem/P3372)

区间修改+区间查询。因为修改和查询都是区间操作，所以需要使用懒标记。

:::details 参考实现：普通版本（C++）

```cpp
#include <iostream>
#define lson(idx) (idx << 1)
#define rson(idx) (idx << 1 | 1)
#define MAXN 100005
typedef long long ll;
using namespace std;
struct Node {
  ll sum = 0, lazy = 0;
  int l, r;
} s[MAXN << 2];
int a[MAXN];

void calc(int idx) {
  s[idx].sum = 0;
  for (int i = lson(idx); i <= rson(idx); ++i)
    s[idx].sum += s[i].sum;
}

void build(int idx, int l, int r) {
  s[idx].l = l, s[idx].r = r;
  if (l == r) {
    s[idx].sum = a[l];
    return;
  }
  int mid = (l + r) >> 1;
  if (l <= mid)
    build(lson(idx), l, mid);
  if (mid < r)
    build(rson(idx), mid + 1, r);
  calc(idx);
}

void pushdown(int idx) {
  if (s[idx].lazy == 0)
    return;
  for (int i = lson(idx); i <= rson(idx); ++i) {
    s[i].sum += s[idx].lazy * (s[i].r - s[i].l + 1);
    s[i].lazy += s[idx].lazy;
  }
  s[idx].lazy = 0;
}

void update(int idx, int l, int r, int delta) {
  if (s[idx].l >= l && s[idx].r <= r) {
    s[idx].sum += delta * (s[idx].r - s[idx].l + 1);
    s[idx].lazy += delta;
    return;
  }
  pushdown(idx);
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    update(lson(idx), l, r, delta);
  if (mid < r)
    update(rson(idx), l, r, delta);
  calc(idx);
}

ll query(int idx, int l, int r) {
  if (s[idx].l >= l && s[idx].r <= r)
    return s[idx].sum;
  pushdown(idx);
  ll ans = 0;
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    ans += query(lson(idx), l, r);
  if (mid < r)
    ans += query(rson(idx), l, r);
  return ans;
}

int main() {
  int n, m;
  cin >> n >> m;
  for (int i = 1; i <= n; ++i)
    cin >> a[i];
  build(1, 1, n);
  for (int i = 1; i <= m; ++i) {
    int op, l, r;
    cin >> op >> l >> r;
    if (op == 1) {
      int x;
      cin >> x;
      update(1, l, r, x);
    } else
      cout << query(1, l, r) << endl;
  }
}
```

:::

我们也可以引入标记永久化，虽然对这一题来说，性能上无法有明显提升，但代码量可以略微减少一些。

:::details 参考实现：标记永久化版本（C++）

```cpp
#include <iostream>
#define lson(idx) (idx << 1)
#define rson(idx) (idx << 1 | 1)
#define MAXN 100005
typedef long long ll;
using namespace std;
struct Node {
  ll sum = 0, lazy = 0;
  int l, r;
} s[MAXN << 2];
int a[MAXN];

void calc(int idx) {
  s[idx].sum = 0;

  // 注意在pushup的时候带上孩子节点的懒标记值
  for (int i = lson(idx); i <= rson(idx); ++i)
    s[idx].sum += s[i].sum + s[i].lazy * (s[i].r - s[i].l + 1);
}

void build(int idx, int l, int r) {
  s[idx].l = l, s[idx].r = r;
  if (l == r) {
    s[idx].sum = a[l];
    return;
  }
  int mid = (l + r) >> 1;
  if (l <= mid)
    build(lson(idx), l, mid);
  if (mid < r)
    build(rson(idx), mid + 1, r);
  calc(idx);
}

void update(int idx, int l, int r, int delta) {
  if (s[idx].l >= l && s[idx].r <= r) {
    s[idx].lazy += delta;
    return;
  }
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    update(lson(idx), l, r, delta);
  if (mid < r)
    update(rson(idx), l, r, delta);
  calc(idx);
}

ll query(int idx, int l, int r, ll lz) {
  if (s[idx].l >= l && s[idx].r <= r)
    return s[idx].sum + (lz + s[idx].lazy) * (s[idx].r - s[idx].l + 1);
  ll ans = 0;
  int mid = (s[idx].l + s[idx].r) >> 1;

  // 懒标记值自上而下逐层累加
  if (l <= mid)
    ans += query(lson(idx), l, r, lz + s[idx].lazy);
  if (mid < r)
    ans += query(rson(idx), l, r, lz + s[idx].lazy);
  return ans;
}

int main() {
  int n, m;
  cin >> n >> m;
  for (int i = 1; i <= n; ++i)
    cin >> a[i];
  build(1, 1, n);
  for (int i = 1; i <= m; ++i) {
    int op, l, r;
    cin >> op >> l >> r;
    if (op == 1) {
      int x;
      cin >> x;
      update(1, l, r, x);
    } else
      cout << query(1, l, r, 0) << endl;
  }
}
```

:::

### [SPOJ - GSS1](https://www.spoj.com/problems/GSS1/)

本题只需要实现查询，不需要实现修改。关键是，我们需要存储哪些信息，才能够由子区间的最大值，得到父区间的最大值？

:::details 提示一：节点需要存储的信息

- 最大和
- 最大前缀和
- 最大后缀和
- 总和

:::

:::details 提示二：区间的合并

合并两个区间时：

- 总和可以直接由左右区间总和相加得到。
- 最大前缀可能来自左区间的最大前缀，或整个左区间加上右区间的最大前缀。
- 最大后缀可能来自右区间的最大后缀，或整个右区间加上左区间的最大后缀。
- 最大和可能是最大前缀，最大后缀，或左区间的最大后缀加上右区间的最大前缀，或左区间的最大和，或右区间的最大和。

:::

:::details 参考实现（C++）

```cpp
#include <iostream>
#define lson (idx << 1)
#define rson (idx << 1 | 1)
#define INF 0x3f3f3f3f
#define MAXN 50005

using namespace std;
struct Node {
  int l = 0, r = 0, lhi = 0, rhi = 0, hi = 0, sum = 0;
} s[MAXN << 2];
int a[MAXN];

Node merge(Node l, Node r) {
  Node ret;
  ret.l = l.l;
  ret.r = r.r;
  ret.sum = l.sum + r.sum;
  ret.lhi = max(l.lhi, l.sum + r.lhi);
  ret.rhi = max(r.rhi, l.rhi + r.sum);
  ret.hi = max(max(max(ret.lhi, ret.rhi), max(l.hi, r.hi)), l.rhi + r.lhi);
  return ret;
}

void calc(int idx) { s[idx] = merge(s[lson], s[rson]); }

void build(int idx, int l, int r) {
  if (l == r) {
    s[idx].l = l, s[idx].r = r;
    s[idx].hi = s[idx].lhi = s[idx].rhi = s[idx].sum = a[r];
    return;
  }

  int mid = (l + r) >> 1;
  build(lson, l, mid);
  build(rson, mid + 1, r);
  calc(idx);
}

Node query(int idx, int l, int r) {
  if (s[idx].l >= l && s[idx].r <= r)
    return s[idx];
  Node ans;
  int mid = (s[idx].l + s[idx].r) >> 1;
  if (l <= mid)
    ans = query(lson, l, r);
  if (mid + 1 <= r) {
    Node right = query(rson, l, r);
    if (!ans.l)
      return right;
    ans = merge(ans, right);
  }
  return ans;
}

int main() {
  int n;
  cin >> n;
  for (int i = 1; i <= n; ++i)
    cin >> a[i];
  build(1, 1, n);
  int m;
  cin >> m;
  for (int i = 1; i <= m; ++i) {
    int l, r;
    cin >> l >> r;
    cout << query(1, l, r).hi << endl;
  }
}
```

:::

<Utterances />
