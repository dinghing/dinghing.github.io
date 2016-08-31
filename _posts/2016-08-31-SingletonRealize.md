---
layout: post
title: C++与iOS的单例模式实现
date: 2016-08-31 15:27:31
disqus: y
--- 

### 单例模式：从C++去理解iOS
单例模式作为设计模式中比较常见的一种，在面试和工作中也会经常接触到。本文从C++角度来探讨单例模式几种典型实现，进一步了解iOS中的单例实现。

设计模式经典GoF定义的单例模式需要满足以下两个条件：  

* 保证一个类只创建一个实例。
* 提供对该实例的全局访问点。  

如果系统有类似的实体（有且只有一个，且需要全局访问），那么就可以将其实现为一个单例。实际工作中常见的应用举例:
* 日志类：一个日志一般只需要一个实例就可以进行访问
* 资源共享类：多次家在资源可能会影响性能，这时就可以使用单例来减少资源加载 

C++中单例模式的实现方式有很多种，从最初的Lazy Singleton到线程安全，双检锁模式等等。

### Lazy Singleton
	class Singleton  
	{
    public:
        static Singleton& Instance()
        {
            if (instance_ == NULL)
            {
                instance_ = new Singleton;
            }
            return *instance;
         }
    private:
        Singleton()；
        ~Singleton()；
        Singleton(const Singleton&);
        Singleton& operator=(const Singleton&);
    private:
        static Singleton* instance;
	};

以上的实现方法中，构造函数，成员变量等都被声明为私有变量防止生成新的实例。  

同时需要注意Instance返回的是实例引用而非指针。原因很简单，指针都是在堆上面存在，而对堆的操作是没有什么限制的，也就是说实例可以被delete。而且直到Instance被访问到才被初始化，这也就不难理解为什么这种单例模式被称为Lazy Singleton了  

这个模式有一个最大的隐患就是线程不安全。比如A，B线程同时创建实例的时候，单例模式的规则就被打破了。


### Eager Singleton
	class Singleton  
	{
    public:
        static Singleton& Instance()
        {
            return instance;
         }
    private:
        Singleton()；
        ~Singleton()；
        Singleton(const Singleton&);
        Singleton& operator=(const Singleton&);
    private:
        static Singleton instance;
	};
	
最大的特点就是程序开始时实例就生成了（主要原因是不使用指针而实用静态变量）
虽然代码没有太大变但是这个模式是线程安全的，原因就在于初始化是在主函数之前进行的。
但是static对象的初始化顺序不确定导致生成为定义的实例的可能性也存在

### Meyers Singleton
	class Singleton  
	{
    public:
        static Singleton& Instance()
    {
        static Singleton instance；
        return instance；
    }
    private:
        Singleton()；
        ~Singleton()；
        Singleton(const Singleton&);
        Singleton& operator=(const Singleton&);
	};
	
一种简单优雅的单例模式（代码也是极其的简单）
单例模式中的实例也使用了Static声明，确保实例的有效性。当第一次访问Instance时实例得到创建

### pthread_once

	template<typename T>  
	class Singleton : boost::noncopyable  
	{
    public:
        static T& instance()
        {
            pthread_once(&ponce_, &Singleton::init);
            return *value_;
        }

        static void init()
        {
            value_ = new T();
        }
    private:
        static pthread_once_t ponce_;
       static T* value_;
	};
	
多线程编程环境下，使用pthread_once会出现在多个线程中，但是初始化只会执行一次，也就确保了线程安全

### iOS中的单例模式

	@interface LibraryAPI: NSObject//.h文件中声明
	+ (LibraryAPI*)sharedInstance;
	@end//
	
	+ (LibraryAPI*)sharedInstance //.m文件中实现
	{
    // 1
    static LibraryAPI *_sharedInstance = nil;

    // 2 
    static dispatch_once_t oncePredicate; 

    // 3
    dispatch_once(&nocePredicate, ^{
        _sharedInstance = [[LibraryAPI alloc] init];
    });
    return _sharedInstance;
	}
	
关注第三步，使用了dispatch_once_t来确保实例的初始化只执行一次。那么还原到C++中，有没有觉得和pthread_once模式有那么一丝相似

其实在很遥远的古代，iOS中也会使用pthread_once，因为 dispatch_once_t 更容易使用并且不易出错，所以你永远都不会再用到 pthread_once 了。

但是在C++中还没有找到合适的替换方法，也许最近被讨论的比较多的是*双检测锁模式*，但是由于种种坑的存在还没有找到一个万无一失的方法。细节可以参考[这个资料](http://preshing.com/20130930/double-checked-locking-is-fixed-in-cpp11/)  

### 总结
本文主要从C++的几种单例实现开始，扩展到iOS中单例实现。并从iOS反馈C++的单例实现的改良。当然还有许多细节问题没有讨论到，以后有机会再补充。




		
		
		
		
