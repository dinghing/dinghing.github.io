---
title: Using big data to suspect the earth quake
date: 2017-04-05 22:35:31

---
It will be a great idea to suspect the earth quake by data. However , it is not so easy.  
In this post, I just want to explain how to analyst big data in Python

	import pandas as pd
	import numpy as np
	import matplotlib.pyplot as plt
	import datetime as dt
	import seaborn as sns
	from mpl_toolkits.basemap import Basemap
	import warnings

Data Exploration  

* Mapping all the affected areas  
* Number of occurrences of earthquake with different magnitude ranges
* Severity of an earthquake
* Mapping Highly affected areas based on Magnitude
* Correlation between Magnitude vs Depth
* Which month has highest earthquake occurrences?
* Which year has highest earthquake occurrences?     


<code>earth_quake = pd.read_csv("../input/database.csv")  </code>  

Add some label to the data  
<code>earth = earth_quake[["Date","Latitude","Longitude","Magnitude","Depth","Type"]]</code>

	Date	Latitude	Longitude	Magnitude	Depth	Type
	23407	12/28/2016	38.3917	  -118.8941	5.6	12.30   Earthquake  
	23408	12/28/2016	38.3777	  -118.8957	5.5	8.80	Earthquake  
	23409	12/28/2016	36.9179	  140.4262	5.9	10.00	Earthquake  
	23410	12/29/2016	-9.0283	  118.6639	6.3	79.00	Earthquake  
	23411	12/30/2016	37.3973	  141.4103	5.5	11.94	Earthquake  

From this data we know the date need to be changed  

<code>earth["Date"] = pd.to_datetime(earth["Date"])</code>  


This first problem that need to be solved is to draw the affected areas on the earth map.  
By the way,the map API for Python is  <code>mpl_toolkits.basemap </code>

	m = Basemap(projection='mill',llcrnrlat=-80,urcrnrlat=80, llcrnrlon=-180,urcrnrlon=180,lat_ts=20,resolution='c')
	
	longitudes = earth["Longitude"].tolist()
	latitudes = earth["Latitude"].tolist()
	x,y = m(longitudes,latitudes)
	
	fig = plt.figure(figsize=(12,10))
	plt.title("affected areas")
	
	m.plot(x, y, "o", markersize = 3, color = 'blue')
	m.drawcoastlines()
	
	m.fillcontinents(color='coral',lake_color='aqua')
	m.drawmapboundary()
	m.drawcountries()
	
	plt.show()

After this, you will get the affected areas like below  
![text](https://dinghing.github.io/images/earthquake/1.png)

---
Next time will solve the problem of _Number of occurrences of earthquake with different magnitude ranges_


