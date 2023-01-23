# Advent of Code 2021

今年我采用了笔记本的方式，并将获取输入和提交答案的功能也一并集成在其中。参考代码见 [lucifer1004/AoC](https://github.com/lucifer1004)中的以下目录：

- [Python](https://github.com/lucifer1004/AoC/tree/main/2021)
- [Kotlin](https://github.com/lucifer1004/AoC/tree/main/2021/kotlin)
- [Julia](https://github.com/lucifer1004/AoC/tree/main/2021/julia)

## Day01

- 模拟。

## Day02

- 模拟。

## Day03

- 模拟。

## Day04

- 暴力模拟，每次逐个检查每个矩阵是否有一行或一列已经全都出现。
- 预先计算出每个元素对应的序号，从而确定每个矩阵获胜时对应的序号。

## Day05

- 模拟。

## Day06

- 动态规划。可以使用矩阵快速幂进一步优化。

## Day07

- 暴力。枚举 $[\min,\max]$ 范围内的每个整数，找到代价函数的最小值。
- 更好的方法
  - 第一问：可以利用绝对值函数性质得到在中位数处总代价最小；
  - 第二问：每一段上的代价函数是一个二次函数，可以利用二次函数性质求出这一段上的最小值；从左到右依次处理，从一段移动到另一段时，可以在 $\mathcal{O}(1)$ 时间内更新二次函数的系数。

## Day08

- 分析。在确定了1、4、7、8对应的字母组合后，可以利用其他数字与已知数字的交集大小来逐步确定出所有的数字。

## Day09

- 第一问：枚举。
- 第二问：BFS/DFS。

## Day10

- 栈。

## Day11

- BFS。

## Day12

- DFS。

## Day13

- 模拟。

## Day14

- 动态规划，以两个字母为一组进行计数，不需要考虑顺序。注意特殊处理首尾两个字母。

## Day15

- Dijkstra算法求最短路。