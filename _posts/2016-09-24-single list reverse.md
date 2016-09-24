---
layout: post
title: 反转单链表
date: 2016-09-24 16:27:31
disqus: y
---
### 普通的单链表反转算法
大学的时候也做过好几次单链表的反转，记得当时都是用三个变量不断修改next的值然后实现反转。

    ListNode* reverseList(ListNode* head) {
        ListNode *pre = NULL,*tmp,*cur = head;
        while(cur != NULL){
            tmp = cur->next;
            cur->next = pre;
            pre = cur;
            cur = tmp;
        }
        return pre;
    }   
    
整个过程很简单，就是cur指向当前节点，pre之前cur的前一个节点，然后不断向前推进直到结束。  
最后返回的pre即为新链表的头指针。  

### 一个有意思的反转算法
最近解题的时候发现了一个特别好玩反转算法，简单的来说就是把整个指针地址交换掉的算法。
最后还是返回原链表的头指针就OK。

    ListNode* reverseList(ListNode *head) {
    ListNode **prev = &head;
    prev = &(*prev)->next;
    ListNode **pivot = &(*prev)->next;
    while(prev) {
        swap(*prev, (*pivot)->next);
        swap(*prev, *pivot);
    }
    return head;
    }
   
有的时候想一想代码的世界真的没有终结，只有你想不到，没有做不到的事。
