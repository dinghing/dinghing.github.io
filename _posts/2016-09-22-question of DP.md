---
layout: post
title: 动态规划
date: 2016-09-22 16:27:31
disqus: y
---
### 什么叫做动态规划
动态规划简而言之就是把一个大的问题不断的按照某个规定的状态逐渐分化，直到出现一个可以直接计算的结果。
所以，动态规划最后的代码实现往往都是递归。（当然，非递归实现也是非常重要的）

以leetcode上的[一道题](https://leetcode.com/problems/unique-paths/)为例进行分析：  
一个二维矩阵grid[m,n]，一个只能向下或者向右移动的机器人，从左上角到达右下角一共有多少种方法。

###寻找状态方程
机器人到达grid[m,n]时会有多少种方法呢？
简单想象以下应该就可以知道应该是从grid[m-1,n]或者grid[m,n-1]来计算。
所以可以找到状态方程f(x,y)=f(x-1,y)+f(x,y-1);

举例，机器人到达grid[1,1]的时候，只能是从grid[0,1],或者grid[1,0]而来。而到达grid[0,1]的方法只有一个，同理grid[1,0]也为1.

OK，有了上面的状态方程之后，题目也就很简单了。我们需要处理的就是边界的grid[m,0],grid[0,n].
那么代码就出来了:  

      int uniquePaths(int m, int n) {
        vector<vector<int>> sum(m,vector<int>(n));
        for(int i=0;i<m;i++)
        sum[i][0]=1;
        for(int j=0;j<n;j++)
        sum[0][j]=1;
        
        for(int i =1;i<m;i++){
            for(int j =1;j<n;j++){
                sum[i][j]=sum[i-1][j]+sum[i][j-1];
            }
        }
      return sum[m-1][n-1];  
      }
    
代码还能改进，就这样吧。

###简单的扩展
leetcode上还有[一道题](https://leetcode.com/problems/minimum-path-sum/)  
基本一样就是二维矩阵每个顶点都对应着值，那么从右上角到左下角过程中顶点的和最小为多少。

思路完全一样，就是增加判断当前点之前状态的最小值。  

    cur[i] = min(cur[i-1],cur[i])+grid[i][j];




