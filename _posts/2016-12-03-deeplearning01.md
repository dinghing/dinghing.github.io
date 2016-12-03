---
layout: post
title: 机器学习－简单的感知机实现
date: 2016-12-03 16:27:31
disqus: y
---

### 简单的感知机
感知机，就是接受每个感知元（神经元）传输过来的数据，当数据到达某个阀值的时候就会产生对应的行为
如下图，对应每个感知元有一个对应的权重，当数据到达阀值u的时候就会执行对应的行为。
![text](https://dinghing.github.io/images/deeplearning01/01.png)

    u = w0 + w1x1 + w2x2 + w3x3 + ......

对应到垃圾邮件处理上，当u > 0时就是正常邮件。相反则为垃圾邮件
对于这样的模型就可以称之为简单的感知机。也就是一个神经网络的基本单位。

### 权重向量的更新
上面所提到的w1,w2等就是就是对应每个是否是垃圾邮件的衡量标准，而x1,x2...就是邮件中被监测的词组的数目
比如x1和x2相同的时候，w1和w2的绝对值较大的一方对结果，也就是u的影响更大。所以，我们也把w1,w2....称之为x1,x2..的权重值
向量![text](https://dinghing.github.io/images/deeplearning01/02.png)即为权重向量

根据训练数据中的期待结果和预测结果不断的修改权重即可。那么具体到项目中应该怎么修改w呢

  1. 随机为w1,w2,...wn设置一个值  
  2. 不断重复以下步骤  

    * 输入训练数据，如果结果不正确就进行修改  
    * 当所有的训练数据的结果都正确时就结束运算  
思想很简单，那么［不正确就修改］这一段，在简单的感知机中能够很简单的修改，那么在深度神经网络中的时候该怎么计算呢

### 梯度下降法
首先介绍一个定义[误差函数（即损失函数）]E，即输出结果和期待结果的差值
为了方便以后的计算这个定义又可以改为变化根据向量w的变化误差函数是否在朝着最小变化的方向递进
w和误差函数的关系如下图所示
![text](https://dinghing.github.io/images/deeplearning01/03.png)
曲线最下方的w的值即为一次计算所期望的值,如果仔细分析我们可以知道这种计算就是微分计算
而这种变化趋势就是微分计算的值  
![text](https://dinghing.github.io/images/deeplearning01/04.png)  
那么wi的变化过程即为  
![text](https://dinghing.github.io/images/deeplearning01/05.png)  
简答的理解就是当变化趋势为负时wi朝正直方向移动，反之亦然.但是当变化趋势很大的时候wi的变化就会很大，
而变化趋势很小的时候wi的变化就又会很小。这样的计算会让整个过程很难收敛，因此我们会设置一个比较小的正数参数
来参与计算。
![text](https://dinghing.github.io/images/deeplearning01/06.png)

在上面的表达之中p就是学习速率。一般会设置一个比1小的正数。但是如果太小的话同样会让计算量大大增加。
这种通过不断的微分修正权重的方法就是_梯度下降法_。如果想要知道更多关于梯度下降的细节可以参考我之前的[一篇文章](http://dinghing.github.io/2016/10/21/Neural-Networks-and-Deep-Learning/)

然后就是误差函数的具体表达形式了。

### 简单感知机的误差函数
对于一个感知机，我们使用以下的公式来表达他的误差函数

    E = max(0,-twx)

max(a,b)就是选取a,b中较大值的运算函数。t就是正确与否的标志
t = 1(正常邮件)，t=-1(垃圾邮件)
这里有个细节就是垃圾邮件的判断是－1而不是0.
那么为什么要误差函数要采用max(0,-twx)形式呢。

考虑以下x1,x2的二次元方程。
对于算式wx（w0 + w1x1 + w2x2）的值。在直线wx＝0上面的所有值毫无疑问就是0，而在直线上方的就是正值
在直线下方的就是负值。当t＝1的所有点都在正值区域，而－1的点都在负值区域的时候训练就结束。
类似于下图。
![text](https://dinghing.github.io/images/deeplearning01/08.png)
这种就是学习还没有结束的情况，B和D的区分暂时处于一个错误的区域。
可以着重看一下A的情况
A是一个垃圾邮件，而现在的分类情况也是正确的，那么wx>0。也就是t=1。所以我们可以看到
-twx = -wx<0。因此E = max(0,-twx) = 0。误差函数的结果为0。
因此对于误差函数，当点x被正确分类成功的时候可以得到误差值0，相反则是|wx|。

那么'|wx|'到底代表着什么呢？  
简单的理解就是这个点和直线wx=0的距离。没记错的话这个应该是高中知识

### 感知机算法的实现
根据上文介绍的权重的更新的函数
![text](https://dinghing.github.io/images/deeplearning01/09.png)  
对于误差函数E = max(0,-twx)，当误差不为0 的时候就返回-twx。我们来简单推算以下。  
![text](https://dinghing.github.io/images/deeplearning01/10.png)  
因此可以得到更新后的运算公式:  
![text](https://dinghing.github.io/images/deeplearning01/11.png)  
权重整体来表达的时候如下:    
![text](https://dinghing.github.io/images/deeplearning01/12.png)  

根据以上的推论我们可以得到一个感知机的伪代码如下:

* 为w1,w2....wn设置随机值
* 输入每一个训练数据
  * 输入的训练数据所得到的结果与期望值是否一致
    * 一致，进行下一组运算
    * 不一致，按照w <- w + ptx 来进行运算
* 在上一组循环运算中w的值是否发生了改变
  * 被改变了，那么再重复一此上述的循环
  * 没有改变（所有的值都是期望值）,训练结束

这个伪代码的我用python实现了。如果需要可以参考[这里](https://github.com/dinghing/MachineLearn)

### 阀值
_提示，这节对于这篇文章没有太多帮助，主要为了下一篇文章，多层感知机做铺垫_
对于每一个感知机都是一个激活阀值，当参数到达了该阀值的时候被能执行某个行为。那么如何确定这个阀值呢？
![text](https://dinghing.github.io/images/deeplearning01/13.png)
决定输出值的阀值又被称为激活参数。简单来说激活参数的表达式如下f(u)=u。
类似于垃圾邮件分类我们可以有如下表达式:
![text](https://dinghing.github.io/images/deeplearning01/14.png)  
用图表示的时候如下:  
![text](https://dinghing.github.io/images/deeplearning01/15.png)  
换成我们上面使用的－1和1 的形式
![text](https://dinghing.github.io/images/deeplearning01/16.png)
![text](https://dinghing.github.io/images/deeplearning01/17.png)

以上，如果有疑问欢迎讨论。
