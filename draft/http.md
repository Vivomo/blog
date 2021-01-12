# http协议原理 笔记梳理

## 浏览器输入URL后 http请求返回的完整过程
* redirect 检测当前地址是否已被记录为永久跳到新的地址
* App cache 检测资源是否已缓存
* DNS解析 在上一步检测没有缓存的情况下进行域名解析
* 创建TCP链接 （三次握手，如果是https需要创建一个https的链接保证安全）
* request 发送请求
* response 接收请求

### 五层模型
应用层（HTTP，FTP）
  ↓↑
传输层（TCP，UDP）
  ↓↑
网络层
  ↓↑
数据链路层
  ↓↑
物理层
  ↓↑            
客户端/服务端
  ↓↑
互联网

#### 低三层

物理层主要作用是定义武力设备如何传输数据
数据链路层在通信的实体间建立数据链路连接
网络层为数据在节点之间传输创建逻辑链路

#### 传输层

向用户提供可靠的端到端服务
向高层屏蔽了下层数据通信的细节

#### 应用层

为应用软件提供了很多服务
构建于TCP协议之上
屏蔽网络传输相关细节

### HTTP历史

* http/0.9 只有get，没有HEADER等描述数据的信息，服务器发送完毕就关闭TCP连接
* http/1.0 增加了很多命令、status code、header和多字符集支持、多部分发送、权限、缓存
* http/1.1 持久连接，pipeline，增加host和其他一些命令
* http/2.0 所有数据以二进制传输，同一个连接里面发送多个请求不在需要按顺序，头信息压缩以及推送等提高效率的功能

### 三次握手

* client (SYN=1,Seq=X) -> server SYN是一个标志位，创建连接的数据包
* server (SYN=1,ACK=X+1,Seq=Y) -> client
* client (ACK=Y+1,Seq=Z) -> server

### URI URL URN

* URI Uniform Resource Identifier/统一资源标志符， 用来唯一标识互联网上的信息资源 包括URL和URN
* URL Uniform Resource Locator/统一资源定位器 （http://user:pw@host.com:80/path?query=str#hash）
* URN 永久统一资源定位符，在资源移动之后还能被找到，目前还没有非常成熟的使用方案

### HTTP 报文

#### 请求报文

* 起始行 GET url HTTP/1.0
* 首部 Accept：text/*
      Accept-Language：en
  
#### 响应报文

* 起始行 HTTP/1.1 200 OK
* 首部 Content-type：text/plain
       Content-length:19
  **** 空行
  主体 Hi！ I'm a msg
  
### 跨域 （TODO）


  
