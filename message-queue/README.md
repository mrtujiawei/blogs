# 消息队列 #

削峰填谷


```javascript
/**
 * 基本使用
 */
const amqp = require('amqplib');

const queue = 'queue';
const host = '192.168.3.102';


class MessageQueueChannel {
  constructor(connection, channel, queue) {
    this.connection = connection;
    this.channel = channel;
    this.queue = queue;
  }

  /**
   * @param {string} content
   */
  sendToQueue(content) {
    this.channel.sendToQueue(this.queue, Buffer.from(content));
  }

  consume(callback) {
    this.channel.consume(this.queue, message => {
      if (null != message) {
        callback(message.content.toString());
        this.channel.ack(message);
      }
    });
  }

  close() {
    this.channel.close();
    this.connection.close();
  }
}

class MessageQueue {
  /**
   * @param {string} queue
   * @param {string} host
   * @param {number} port default 5672
   * @returns {Promise<MessageQueueChannel>}
   */
  static async getChannel(queue, host, port = 5672) {
    const connection = await amqp.connect(`amqp://${host}:${port}`);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    return new MessageQueueChannel(connection, channel, queue);
  }
}
```

```javascript
/**
 * 发布订阅，channel绑定交换机
 * 一个消息可以被多个消费者消费
 */
```

```javascript
/**
 * routing 模式
 * routintKey 指定，只有符合的才会消费消息
 */
```

```javascript
/**
 * topic
 * 可以正则匹配
 */
```
