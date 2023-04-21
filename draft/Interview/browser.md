### 浏览器多 tab 通讯
浏览器多tab之间的通讯，本质上是利用一些可以共享的中间介质，来实现数据的传递和同步。常用的方法有以下几种：

- 使用cookie或localStorage，它们在同一个域名下的多个tab页面中都是共享的，可以通过读写它们来实现通讯。但是这种方法需要轮询或监听storage事件来获取数据的变化，效率不高。
- 使用SharedWorker，它是一种可以在多个tab页面中共享的后台线程，可以通过它来创建一个消息中心，让不同的tab页面向它发送和接收消息。但是这种方法兼容性不好，需要使用特殊的调试工具。
- 使用BroadcastChannel，它是一种可以在同一个域名下的多个tab页面中创建一个广播频道，让不同的tab页面向它发布和订阅消息。但是这种方法兼容性也不好，只有较新的浏览器支持。
- 使用window.open和postMessage，它们可以实现父子页面之间的通讯，父页面可以通过window.open打开子页面，并且获取子页面的window对象，然后通过postMessage向子页面发送消息，子页面也可以通过postMessage向父页面发送消息。但是这种方法只适用于有父子关系的tab页面。

### 浏览器的缓存体系
浏览器的缓存体系主要包括以下四个方面：

- Service Worker Cache：是一种可以在浏览器后台运行的脚本，可以拦截和处理网络请求，实现离线缓存、消息推送等功能。
- Memory Cache（内存缓存）：是一种临时的缓存，它会将请求的资源缓存在内存中，当页面关闭后就会被释放。它的优点是读取速度快，缺点是空间有限，不能持久化。
- Disk Cache（硬盘缓存）：是一种持久的缓存，它会将请求的资源缓存在硬盘中，即使页面关闭也不会被释放。它的优点是空间大，可以长期保存，缺点是读取速度慢。
- Push Cache（推送缓存）：是一种基于HTTP/2协议的缓存，它可以让服务器主动向客户端推送资源，而不需要客户端请求。它的优点是可以提高首屏加载速度，缺点是生命周期短，只在会话(session)中存在。

浏览器在请求资源时，会根据HTTP头部中的缓存标识来决定是否使用缓存。常用的缓存标识有以下几种：

- Expires：指定一个绝对时间，表示资源在这个时间之前是有效的，可以直接使用缓存。这种方式受本地时间影响，不够准确。
- Cache-Control：指定一个相对时间，表示资源在这个时间段内是有效的，可以直接使用缓存。这种方式优先级高于Expires。
- Last-Modified：指定资源的最后修改时间，表示资源在这个时间之后有没有被修改过。如果没有修改过，可以使用缓存。
- ETag：指定资源的唯一标识符，表示资源是否有变化。如果没有变化，可以使用缓存。

### 浏览器缓存策略

浏览器在使用缓存时，会根据HTTP头部中的缓存标识来确定使用哪种方式。常用的方式有以下两种：

- 强缓存：浏览器直接从本地缓存中读取资源，不需要发送请求到服务器。这种方式由Cache-Control或Expires来控制。
- 协商缓存：浏览器发送一个带有条件的请求到服务器，由服务器判断资源是否有变化。如果没有变化，服务器返回304状态码和空响应体，浏览器从本地缓存中读取资源；如果有变化，服务器返回200状态码和新的响应体，浏览器更新本地缓存并显示新的资源。这种方式由Last-Modified或ETag来控制。

### 浏览器并发连接限制 
浏览器并发连接限制是指浏览器对同一个域名下的资源请求的最大并发数量的限制，超过这个限制的请求会被阻塞，直到有空闲的连接可用。这个限制是为了避免过多的连接占用服务器资源，影响服务器性能和稳定性¹。不同的浏览器对并发连接限制的数值有所不同，一般在6-10之间。

浏览器并发连接限制会影响页面的加载速度和用户体验，因此有一些解决方案可以尝试突破或绕过这个限制，例如：

- 使用域名分片(Domain Sharding)，即将资源分布在不同的域名下，从而增加总的并发连接数。但是这种方法会增加DNS解析的时间和开销，而且在HTTP/2协议下失效。
- 使用WebSocket协议，它是一种全双工通信协议，可以在客户端和服务器之间建立一个持久的连接，不受浏览器并发连接限制。但是这种方法需要服务器支持WebSocket协议，并且可能存在安全风险。
- 使用HTTP/2协议，它是一种基于二进制帧的多路复用协议，可以在同一个TCP连接上发送多个HTTP请求，并且支持请求优先级、头部压缩、服务器推送等特性。但是这种方法需要服务器和客户端都支持HTTP/2协议，并且可能存在兼容性问题。

### 如何通过 Memory 面板定位内存泄露
通过Memory面板定位内存泄露的一般流程如下：

- 打开DevTools，切换到Memory面板，选择Heap snapshot模式。
- 在页面上执行可能发生内存泄露的操作，例如打开或关闭某个组件，切换路由等。
- 点击Take snapshot按钮，记录下当前的堆内存快照。
- 重复执行第二步和第三步，记录多个堆内存快照。
- 选择最后一个堆内存快照，在顶部的All objects下拉框中选择Objects allocated between snapshots 1 and 2（或者其他两个快照），过滤出两个快照之间新分配的对象。
- 在过滤出的对象中，找到可能发生内存泄露的对象，例如Detached DOM tree（已经从DOM树上移除但仍被JS引用的DOM节点），或者Retained Size大于Shallow Size的对象（被其他对象保留引用的对象）。
- 点击对象，查看其Retainers面板，找到保留该对象引用的源头，定位到对应的代码行。

### HTML数据存储方案

HTML数据存储方案是指在HTML页面中使用不同的方法来存储数据，以便在本地或服务器上进行数据的保存、读取、修改和删除¹。HTML数据存储方案主要有以下几种：

- Cookie：Cookie是一种在客户端和服务器端之间传递的小型文本文件，它可以用来保存用户的偏好、状态和会话信息。Cookie的优点是可以跨域访问，缺点是大小受限（一般为4KB），数量受限（一般为20个），安全性低，每次请求都会携带，影响性能。
- LocalStorage：LocalStorage是HTML5提供的一种本地存储方法，它可以用来保存用户浏览器中的键值对数据。LocalStorage的优点是可以永久保存数据，直到手动删除，大小一般为5MB，数量不限，不会随请求发送，缺点是不能跨域访问，安全性低。
- SessionStorage：SessionStorage是HTML5提供的另一种本地存储方法，它与LocalStorage类似，但是它只在当前会话有效，即当用户关闭浏览器窗口或标签页后，数据会被删除。SessionStorage的优点是可以临时保存数据，不会随请求发送，缺点是不能跨域访问，安全性低，大小和数量与LocalStorage相同。
- IndexedDB：IndexedDB是HTML5提供的一种本地数据库存储方法，它可以用来保存复杂的结构化数据。IndexedDB的优点是可以存储大量的数据（一般为50MB或更多），支持事务、索引、游标等操作，缺点是不能跨域访问，兼容性较差，使用较复杂。