---
title: 在OS X上安装Pyhton3.x的简单方法
date: 2016-11-18 16:30:31
disqus: y
---
### 安装pyenv
为了能顺利的将系统的python和下载的python版本呼唤，使用Homebrew下载pyenv  

	brew install pyenv  

设置默认路径   

	export PYENV_ROOT="$HOME/.pyenv"
	export PATH="$PYENV_ROOT/bin:$PATH"
	eval "$(pyenv init -)"

### 安装Python
使用pyenv查看可安装Python的版本   

	pyenv install --list

我的情况下可以看到如下几个最新的版本  

	3.5.0
	3.5-dev
	3.5.1
	3.5.2
	3.6.0b3
	3.6-dev
	3.7-dev

我个人比较习惯3.5.2版本，所以就安装了3.5.2版本

	 > pyenv install 3.5.0

然后就可以查看安装好的版本信息    

	pyenv versions
	* system (set by /Users/XXXX/.pyenv/version)
	3.5.2

将系统的版本和当前版本切换

	pyenv global 3.5.0  
	pyenv rehash

现在查看你的Python版本  

	python --version
	python 3.5.0

到此你的Python已经升级到了最新 的版本，如果你使用的是IDE开发你也不用自己去修改路径了.
