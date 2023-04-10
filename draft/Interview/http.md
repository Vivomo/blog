### XHR 与 fetch 的区别

XHR 与 fetch 的区别主要有以下几个方面：

- **接口形式**：XHR 是一个基于事件的接口，需要创建一个 XMLHttpRequest 对象，并为其添加各种事件监听器，例如 onreadystatechange、onload、onerror 等，然后调用其 open 和 send 方法来发起请求，例如：

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', 'url');
xhr.onload = function() {
  if (xhr.status === 200) {
    // handle success
  } else {
    // handle error
  }
};
xhr.onerror = function() {
  // handle error
};
xhr.send();
```

fetch 是一个基于 Promise 的接口，可以直接调用 fetch 函数，并传入一个 url 参数，返回一个 Promise 对象，然后使用 then 和 catch 方法来添加成功和失败的回调函数，例如：

```js
fetch('url')
  .then(response => {
    if (response.ok) {
      // handle success
    } else {
      // handle error
    }
  })
  .catch(error => {
    // handle error
  });
```

- **错误处理**：XHR 在发生网络错误或者超时错误时，会触发 onerror 事件，并将 status 设为 0；在发生 HTTP 错误时，会触发 onload 事件，并将 status 设为对应的 HTTP 状态码。因此，需要在两个事件中分别处理不同类型的错误。

fetch 在发生网络错误或者超时错误时，会 reject 这个 Promise，并传递一个 TypeError 对象；在发生 HTTP 错误时，不会 reject 这个 Promise，而是将 ok 属性设为 false，并将 status 设为对应的 HTTP 状态码。因此，需要在 catch 中处理网络错误，在 then 中处理 HTTP 错误。

- **请求和响应**：XHR 可以通过设置 responseType 属性来指定响应的类型，例如 text、json、blob、arraybuffer 等，并通过 response 属性来获取响应的数据；也可以通过设置 overrideMimeType 方法来覆盖服务器返回的 MIME 类型。

fetch 可以通过 Response 对象的各种方法来获取不同类型的响应数据，例如 text()、json()、blob()、arrayBuffer() 等，并返回一个 Promise 对象；也可以通过 headers 属性来获取响应头的信息。

- **进度监控**：XHR 可以通过监听 progress 事件来获取请求或响应的进度信息，并通过 event.loaded 和 event.total 属性来计算百分比。

fetch 没有提供原生的进度监控功能，如果需要实现，可以使用第三方库或者自己封装。


