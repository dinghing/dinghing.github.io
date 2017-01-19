---
layout: post
title: What is normalize and standardize data in deep learning
date: 2017-01-19 22:35:31
disqus: y
use_math: true
---
### What
#### Normalize Data  
The common method is to map the data to [0,1] by linear transformation of the original data, the transformation function is:
$$
x'=\frac{x-\min}{\max-\min}
$$

Below is an implementation of this in a function called normalize_dataset() that normalizes values of a provided dataset

    def normalize_dataset(dataset, minmax):
      for row in dataset:
        for i in range(len(row)):
          row[i] = (row[i] - minmax[i][0]) / (minmax[i][1] - minmax[i][0])



#### Standardize Data
Commonly used method is the z-score standardization, after processing the data mean is 0, the standard deviation is 1, the processing method is:

$$
x'=\frac{x-\mu}{\sigma}
$$

Where μ is the mean of the sample and σ is the standard deviation of the sample, which can be estimated from the existing samples. In the case of existing samples is relatively stable, suitable for modern noisy large data scenarios

We can implement this function like below:

    def column_means(dataset):
      means = [0 for i in range(len(dataset[0]))]
      for i in range(len(dataset[0])):
        col_values = [row[i] for row in dataset]
        means[i] = sum(col_values) / float(len(dataset))
      return means

    def column_stdevs(dataset, means):
      stdevs = [0 for i in range(len(dataset[0]))]
      for i in range(len(dataset[0])):
        variance = [pow(row[i]-means[i], 2) for row in dataset]
        stdevs[i] = sum(variance)
      stdevs = [sqrt(x/(float(len(dataset)-1))) for x in stdevs]
      return stdevs

### when
Standardization is a scaling technique that assumes your data conforms to a normal distribution. If a given data attribute is normal or close to normal, this is probably the scaling method to use. It is good practice to record the summary statistics used in the standardization process so that you can apply them when standardizing data in the future that you may want to use with your model. Normalization is a scaling technique that does not assume any specific distribution.

If your data is not normally distributed, consider normalizing it prior to applying your machine learning algorithm. It is good practice to record the minimum and maximum values for each column used in the normalization process, again, in case you need to normalize new data in the future to be used with your model.

When it comes to calculating the distance between a point and a point, the use of normalization or normalization will result in an increase in the final result, or even a qualitative difference. Which should be how to choose?
As we have seen in the previous section, if all dimensions of the variables are treated equally, the same effect should be chosen in the final calculation of distance.
If you want to preserve the original data, the potential weight relationships reflected by the standard deviation should be normalized
