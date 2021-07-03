const amqp = require('amqplib');
const { Logger, sleep, } = require('@mrtujiawei/utils');

const queue = 'queue';
const queue2 = 'queue2';
const host = '192.168.3.102';

const logger = (function getLogger() {
  const logger = Logger.getLogger();
  
  logger.setLevel(Logger.LOG_LEVEL.ALL);
  
  logger.subscribe((message) => {
    console.log(message);
  });

  return logger;
}());

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

  /**
   * @param {string} content
   */
  publish(content) {
    this.channel.publish('', '', Buffer.from(content));
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

(async function createPublisher() {
  let channel = await MessageQueue.getChannel(queue, host);
  let channel2 = await MessageQueue.getChannel(queue2, host)
  let index = 0;
  let timer = setInterval(() => {
    let content = 'Hello World ' + ++index;
    channel.sendToQueue(content);
    logger.trace(`发送消息 ${content}`);
    if (index >= 30) {
      clearInterval(timer);
    }
  }, 100);

  setTimeout(() => {
    channel2.sendToQueue('channel 2 content');
  }, 3000);

  setTimeout(() => {
  }, 3000);
}());

(async function createConsumer() {
  let channel = await MessageQueue.getChannel(queue, host);
  channel.consume(msg => {
    logger.debug('队列1 - 接收到消息', msg);
  });
}());

(async function createConsumer() {
  let channel = await MessageQueue.getChannel(queue, host);
  channel.consume(msg => {
    logger.debug('队列2 - 接收到消息', msg);
  });
}());

(async function createConsumer() {
  let channel2 = await MessageQueue.getChannel(queue2, host);
  channel2.consume(msg => {
    logger.debug('队列3 - 接收到消息', msg);
  });
}());
