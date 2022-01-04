# node snippets #

```javascript
// 服务端推送
const http = require("http");

http.createServer(function (req, res) {
  let fileName = "." + req.url;

  if (fileName === "./stream") {
    res.writeHead(200, {
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache",
      "Connection":"keep-alive",
      "Access-Control-Allow-Origin": '*'
    });

    // 重连事件
    res.write("retry: 10000\n");

    // 触发事件
    res.write("event: connecttime\n");

    // 发送数据
    res.write("data: " + (new Date()) + "\n\n");
    res.write("data: " + (new Date()) + "\n\n");
    res.write('id:msg1\n');
    let count = 0;
    interval = setInterval(function() {
      // 发送ID:相当于保存个锚点,出错了从这里开始恢复
      res.write('id:msg' + count + '\n');
      res.write("data: " + (new Date()) + '---' + count + '---' + "\n\n");
      count ++;
    }, 1000);

    req.connection.addListener("close", function () {
      clearInterval(interval);
    }, false);
  }
}).listen(4444);
```
