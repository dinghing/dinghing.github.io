---
title: 今週のお題：上下反転した数字表示器 (Python)  
date: 2017-04-06 10:20:34  
disqus: y

---
## _公開可能な時期になったら、ソースコードを公開する_

> 逆さに置いたときに対応する数字は以下のようになります。  
> 0 <-> 0  
> 1 <-> 1  
> 2 <-> 2  
> 5 <-> 5  
> 6 <-> 9  
> 8 <-> 8  
> （「1」は反転すると位置がずれますが、「1」として読み取ることが可能なものとします。）  
> n 桁を表示できる数字表示器を通常の置き方で置いた時よりも、上下逆さに置いた場合の方が大きな値として
読み取ることができるものが何通りあるかを求めるプログラムを作成してください。  
例えば、n = 2のとき、以下の21通りがあります。  
01, 02, 05, 06, 08, 09, 12, 15, 16, 18, 19, 25, 26, 28, 29, 56, 58, 59, 66, 68, 86  
標準入力から自然数 n が与えられますので、パターン数を標準出力に出力してください。
なお、n は最大で20とします。

問題を解決するポイントは6と9の処理です。    
そして計算データは上記の例をベースに良い

---  
	def count(n):
	res = 0
	#nums = [6,5,4,3,2,1
	if n == 2:
		return 21
	for i in range(n/2):
		m1 = n-2*(i+1)
		m3 = i
		print m1,m3
		res += 21*pow(7,m1)*pow(7,m3)
	if n%2 != 0:
		res += pow(7,i+1)
	return res
	print count(4)
