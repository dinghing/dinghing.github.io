---
layout: post
title: Using OpenCV with Python on Mac
date: 2017-01-28 13:34:31
disqus: y
---
##Step 1
You need install [numpy](http://www.numpy.org) already in your Mac in order to install cv.py and cv2.py which are the library of Python automatically  (OpenCV  will be installed by brew at /usr/local/Cellar/opencv/version/)

##Step 2
Install OpenCV  

	brew tap homebrew/science
	
If the numpy had been installed already,you can do next:

	brew install opencv

Next , you need to back to the directly of Python  

* if you are using virtualenv,it should be here

 		cd ~/.virtualenv/name/lib/python2.7/site-packages

* Otherwise:
		
		cd /Library/Python/2.7/site-packages/

Link the Python with OpenCV

	ln -s /usr/local/Cellar/opencv/2.4.9/lib/python2.7/site-packages/cv.py cv.py
	ln -s /usr/local/Cellar/opencv/2.4.9/lib/python2.7/site-packages/cv2.so cv2.so

##Step 3
Test you Python.
It is Ok if it shows like below
	
	➜  ~  python
	Python 2.7.8 (default, Oct 16 2014, 05:18:45) 
	[GCC 4.2.1 Compatible Apple LLVM 6.0 (clang-600.0.51)] on darwin
	Type "help", "copyright", "credits" or "license" for more information
	>>> import cv
	>>> import cv2


You can also read this [post](https://jjyap.wordpress.com/2014/05/24/installing-opencv-2-4-9-on-mac-osx-with-python-support/)