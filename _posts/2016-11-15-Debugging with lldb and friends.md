---
layout: post
title: 使用命令行（lldb）调试iOS程序
date: 2016-11-15 22:30:31
disqus: y
---

Xcode自带的debug功能在调试iOS程序的时候是非常强大的。除了功能丰富的分析工具DTrace之外，还可以使用命令行进行任何调试。当然你也可以只使用GUI调试工具就能处理大部分的调试。
这篇文章不打算比较哪种调试更加强大，只是为了介绍一下iOS的命令行调试方法和一些使用技巧

想知道关于iOS调试更加详细的信息可以查看[这里](http://iosptl.com)

#### LLVM
Apple 在以前还使用过GNU，但现在默认都是使用[LLVM](http://lldb.llvm.org)进行debug的。当然LLVM也提供了first-class的支持。


#### 设置断点
使用Xcode自带的功能可以非常方便的在任何地方设置断点,然后使用命令行在需要设置断点的地方进行设置。命令行代码如下：

    (lldb)breakpoint set --name myfunction  //在多个方法上设置断点
    (lldb)breakpoint set --name selector mySelector  //在callback上设置断点

具体到Xcode上设置断点的时候显示如下  
![text](https://dinghing.github.io/images/lldb/breakpoint1.png)
![text](https://dinghing.github.io/images/lldb/breakpoint2.png)

使用lldb的时候，我们甚至没有必要敲出命令行的整个单词，比如breakpoint可以简单的写成break或者b

当你想要同时设置多个断点的时候可以使用`-r`命令

    (lldb)break set -r tableView
![text](https://dinghing.github.io/images/lldb/breakpoint3.png)

当你想要取消某个断点的时候可以使用一下命令

    (lldb) breakpoint disable

#### 查看当前断点信息
使用 `(lldb)frame variable`命令就可以查看当前断点下所有变量的参数
![text](https://dinghing.github.io/images/lldb/breakpoint4.png)

同样也可以查看当前进程的堆栈情况`(llab)bt`
![text](https://dinghing.github.io/images/lldb/breakpoing5.png)

使用bt可以看到整个进程的堆栈情况，但是如果只想查看当前函数的堆栈情况或者具体到某个方法上呢。
这个时候`(lldb)frame select`就刚好可以满足你的要求
![text](https://dinghing.github.io/images/lldb/breakpoing6.png)

当你在使用`(lldb)bt`看到整个堆栈情况，然后想跳转到具体的函数该怎么办呢`(lldb)frame select 7`(跳转到7)就可以实现
![text](https://dinghing.github.io/images/lldb/breakpoint7.png)

但需要输出某个值（不一定是变量，也可以是整个类）的时候就可以使用`print object`缩写为`po`

#### 对运行中的值进行修改
试想一下你经常遇到的场景：代码运行到某个断点，然后你输入某个值测试运行效果，这个时候或许表达式值修改命令就非常有效了

    (lldb) expression self.displayFoodName.text = @"asasasas"
![text](https://dinghing.github.io/images/lldb/breakpoint8.png)

使用这个命令你可以修改任何你想修改的值而不是仅限于变量，比如framework的class都可以

#### 设置断点行为
这节没有涉及到lldb 的行为，只要介绍一下GUI操作下的断点行为设置。因为关于这点其实并没有很详细的文档介绍，
相信很多人都是自己的经验操作。在此介绍一下我个人的经验。
![text](https://dinghing.github.io/images/lldb/breakpoint9.png)

简单说明一下：定义了一个打印log的行为，然后设置`po`操作将更具体的信息输出出来。
由于本文主要介绍lldb命令行，图形操作就简单介绍到这里。

#### 使用lldb命令查看当前系统信息
使用lldb可以直接调用Apple的系统API
![text](https://dinghing.github.io/images/lldb/breakpoint10.png)

#### 结束语
简单的总结了一些自己常用的一些调试命名，但是这些常用的调试命令一般适用于自己的项目或者。
但是如果涉及到一些并不是自己的代码或者弄懂整个代码需要一些时间的时候，黑盒测试就会比较好用。
