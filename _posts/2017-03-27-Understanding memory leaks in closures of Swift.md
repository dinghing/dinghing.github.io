---
layout: post  
title: Memory leaks in Closures of Swift  
date: 2017-03-27 12:35:31  
disqus: y

---
OK, so maybe now is the time to understand clearly, when memory leaks can happen and what tools you can use to get rid of them.

Apple made a great article about [strong reference cycles](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/AutomaticReferenceCounting.html#//apple_ref/doc/uid/TP40014097-CH20-ID51) in classes. It’s easy to understand what is a memory leak and how to avoid them in this case. 
However, this is a pretty rare scenario, and quite easy to spot. I find the part about closures a lot more confusing. So let’s clarify this once and for all.

##Reference cycles with closures
First, you have to understand what a closure is and what it does. I like to picture it as a piece of code which, when declared, creates its own temporary class, that contains a reference to all the objects it needs in order to execute itself.
Let’s take a simple example to start with: A <code>ViewController</code> that has a CustomView. That CustomView has a closure that is called when a button is tapped.

    class CustomView:UIView{ 
    var onTap:(()->Void)?
    ...
    }

    class ViewController:UIViewController{ 
    let customView = CustomView() 
    var buttonClicked = false
    
    func setupCustomView(){
        var timesTapped = 0
        customView.onTap = {
            timesTapped += 1 
            print("button tapped \(timesTapped) times")
            self.buttonClicked = true
        }
      }
    }

When we give a value to the closure, it needs to keep a reference to some variables in order to execute itself. Here, it needs self and timesTapped. They’re the only external values it needs; and to keep those values available, it will create a strong reference to them. That will prevent those values from being freed, and the closure from crashing in case they were deallocated.

But wait, ViewController has a strong reference to CustomView, that has strong reference to the onTap closure that just created a strong reference to self. So here’s what we have:  

![text](![text](https://dinghing.github.io/images/memoryleaks/1.png)

As you can see pretty clearly we have a cycle. Meaning that, if you exit this view controller, it can’t be removed from memory because it’s still referenced by the closure.

This example is pretty clear, our <code>viewController</code> has a property subview, that has a property <code>onTap</code> which captures <code>self</code> . But unfortunately, it can become a lot more complicated.

## Potential cycle examples

The question you always have to ask yourself is: **Who owns the closure?**

### UITableView
If you’ve ever built an iOS app you have had to deal with a UITableView at some point, and chances are, you also had to deal with custom cells with a custom button.

Here’s one way to do it in swift, first you have a CustomCell that has an action closure that allows you to define what happens when the button is tapped.

	class CustomCell: UITableViewCell {
  	@IBOutlet weak var customButton: UIButton!
  	var onButtonTap:(()->Void)?
  	@IBAction func buttonTap(){
      	onButtonTap?()
  	  }
	}

Then in your ViewController, you define the action you want to have for this button.

	class ViewController: UITableViewController {
  	override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> 	UITableViewCell {
      	let cell = tableView.dequeueReusableCell(withIdentifier: "CustomCell", for: indexPath) as! 	CustomCell
      	cell.onButtonTap = {
          	self.navigationController?.pushViewController(NewViewController(), animated: true)
      		}
  		}
	}

Who owns the closure? In here, it’s pretty clear, since we declare it explicitly in CustomCell. But, the cell belongs to the tableView which belongs to the tableViewController.

Like previously there’s a cycle, but this one is harder to spot if you’ve never seen it before:

![text](https://dinghing.github.io/images/memoryleaks/2.png)
<center>TableViewController retain cycle</center>

##GCD
You’ve certainly dealt with Grand Central Dispatch before, can you spot if there’s any cycle?

	override func viewDidLoad() {
  	super.viewDidLoad()
  	DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
    	self.navigationController?.pushViewController(NewViewController())
  		}
	}

First, who owns the closure? The ViewController doesn’t have any property that references it. It is called on a DispatchQueue singleton, so worst case scenario, within the call asyncAfter, the singleton keeps a reference to it. Unfortunately we cannot see what is the implementation. However, that closure will be executed only once, at a predefined time, so it doesn’t make sense for the singleton to keep a reference to it. In this case, when the closure is executed it will drop its reference to self and since self doesn’t reference the closure, there’s no cycle.

Note that the same logic can be applied to the UIView animations closures.

##Alamofire
Let’s say you have an app with a LoginViewController and you are using Alamofire to get a response from your backend:

	Alamofire.request("https://yourapi.com/login", method: .post, parameters: 	["email":"test@gmail.com","password":"1234"]).responseJSON { (response:DataResponse<Any>) in
    	if response.response?.statusCode == 200 {
        	self.navigationController?.pushViewController(NewViewController(), animated: true)
    	}else{
        	//Show alert
    	}
	}

Who owns the closure? The closure is declared as a parameter of a function of request. But you don’t really know what Alamofire will do with that closure nor when it is released.

If you take a look at the implementation, you can see that the request has an OperationQueue: queue. When calling the function response() we pass the closure that is then added to the queue. When the closure finishes its execution, it is simply removed from the queue. So there’s is no cycle in here because only the queue retains the closure but it’s released once executed.

Note that, even if you keep a reference to the request or retain a SessionManager, the closure will be released and you won’t have any cycle.

##RxSwift
In this example, you have an UISearchBar, and whenever you change the text in the searchBar you would like to update a label.

	class ViewController: UIViewController {
  	@IBOutlet weak var searchBar: UISearchBar!
  	@IBOutlet weak var label: UILabel!
 	override func viewDidLoad() {
    	searchBar.rx.text.throttle(0.2, scheduler: MainScheduler.instance).subscribe(onNext: 	{(searchText) in
      	self.label.text = "new value: \(searchText)"
    		}).addDisposableTo(bag)
  		}
	}

Who owns the closure? The closure can be called many times and we don’t don’t know when, so RxSwift needs to keep a reference to it. In this case the closure is actually owned indirectly by searchBar. It makes sense because the closure is released when searchBar is. But wait, searchBar is owned by self when it’s added to the view hierarchy, and the closure references self. So in this case we have a cycle, and we need to break it in order to avoid a memory leak.

##Breaking cycles
To break a cycle, you just need to break one reference, and you will want to break the easiest one. When dealing with a closure you will always want to break the last link, which is what the closure references.

To do so, you need to specify when capturing a variable that you don’t want a strong link. The two options that you have are: weak or unowned and you declare it at the very beginning of the closure.

In the UITableView example it would look like this:

	cell.onButtonTap = { [unowned self] in
    	self.navigationController?.pushViewController(NewViewController(), animated: true)
	}

Whether to use weak or unowned, can be a bit tricky, generally you want to use unowned if the closure cannot exist longer than the objects it captures. In this scenario, the cell and the closure cannot live longer than the tableViewController so we can use unowned. If you would like to know more about weak and unowned I would recommend to read these great articles.

##Debugging memory leaks
Since it is hard sometimes to know if your closure is kept as a reference, especially when you’re using third party libraries or private implementation, you will need to debug to find the cycles. Xcode provides a new tool that is really handy to help you find leaks. Navigate through your app and click on the little graph icon at the bottom of Xcode to check what’s in memory.

In the TableView example, if you don’t put weak or unowned in the <code>onButtonTapclosure</code> you will see something like:

![text](https://dinghing.github.io/images/memoryleaks/3.png)

TableViewController and CustomCells are leaking
The exclamation mark on the right indicates a leak. But Xcode sometimes has troubles detecting the leaks. It is entirely possible that you have a leak but no exclamation mark. In that case you just need to pay attention to what is in memory and if you see something that shouldn’t be there you most likely have a leak.

