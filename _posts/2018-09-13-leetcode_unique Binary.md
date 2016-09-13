---
layout: post
title: Unique Binary Search Trees I and II解题报告
date: 2016-09-13 16:27:31
disqus: y
---

## Given n, how many structurally unique BST's (binary search trees) that store values 1...n?

计算从1到n可以生成多少个排序二叉树。
首先理解一个定义，排序二叉树即左子树小于根节点小于右子树。   

那么整个过程就可以使用递归和排列组合的思想解决了。  
确定某个点为root节点，那么可能出现的情况为root(n)＝left＊right.    
所以，f(n)=f(0)*f(n-1)+f(1)*f(n-2)+....+f(n-1)*f(0).    
下面用非递归实现一下：  

        int numTrees(int n) {
        vector<int> G(n+1,0);
        G[0]=G[1]=1;
        for(int i = 2;i<=n;i++){
            for(int j=0;j<=i;j++){
                G[i]+=G[j]*G[i-j-1];
            }
        }
        return G[n];
    }

##Given an integer n, generate all structurally unique BST's (binary search trees) that store values 1...n.
在上面的基础上输出所有结果。
整体思想没有改变，就是递归的过程中把所有的情况储存在一个数组中。

       vector<TreeNode*>dfs(int begin,int end){
        vector<TreeNode*>result; 
        if(begin > end){
            result.push_back(NULL);
            return result;
        }
        for(int i = begin;i<=end;i++){
            vector<TreeNode*>lefts = dfs(begin,i-1);
            vector<TreeNode*>rights = dfs(i+1,end);
            
            for(auto left:lefts){
                for(auto right:rights){
                    TreeNode* root = new TreeNode(i);
                    root->left = left;
                    root->right = right;
                    result.push_back(root);
                }
            }
        }
        return result;
    }
    
但是要注意到递归会比较耗内存，所以在一般项目中将上面的递归过程写成非递归是有必要的。    
