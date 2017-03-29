---
title: Face Recognition and autocross with Python 
date: 2017-03-27 12:35:31  
disqus: y

---
In this post we’ll look at a surprisingly simple way to get started with face recognition using Python and the open source library OpenCV.

All the code is below.I will explain it later.

	# -*- coding:utf-8 -*-
	import cv2 
	import numpy as np
	import cv2.cv as cv
	import glob

	#cascade = cv2.CascadeClassifier("haarcascade_frontalface_alt.xml")
	def detect(img, cascade):
    	rects = cascade.detectMultiScale(img, scaleFactor=1.1, minNeighbors=3, minSize=(10, 10), flags = 	cv.CV_HAAR_SCALE_IMAGE)
    	if len(rects) == 0:
    		return []
    	rects[:,2:] += rects[:,:2]
    	return rects
    	
	def faceCrop(imagePattern,boxScale=1):
		imgList=glob.glob(imagePattern)
    	if len(imgList)<=0:
        	print 'No Images Found'
        	return
    	i = 0
    	for img in imgList:
    		print img
        	image = cv2.imread(img)
        	cascade = cv2.CascadeClassifier("./haarcascades/haarcascade_frontalface_alt.xml")
        	gray = cv2.cvtColor(image, cv.CV_BGR2GRAY)
        	gray = cv2.equalizeHist(gray)
        	
        	rects = detect(gray, cascade)
        	x1 = rects[0][1]
        	y1 = rects[0][0]
        	x2 = rects[0][3]
        	y2 = rects[0][2]
        	faceROI = image[x1:x2, y1:y2]
        	cv2.imwrite('./new/' + '%s.jpg'% i, faceROI)
        	i += 1
        	
	faceCrop('./data/boss/*.jpg',boxScale=1)

