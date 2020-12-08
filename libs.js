/**
 * 以秒为单位 延时一段时间
 */
import { secondTimeStampLength } from "../config/index.js";
import LockClass from './Lock.js';
import QueueClass from './Queue.js';
import RC from './ResponsibilityChain.js';

export const Lock = LockClass;
export const Queue = QueueClass;
export const ResponsibilityChain = RC;

export function sleep(timeout = 1) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout * 1000);
  });
}

/**
 * 异步加载js脚本
 */
export function loadScript(id, url) {
  return new Promise((resolve, reject) => {
    let script = document.querySelector(id);
    script.type = 'text/javascript';
    if (script.readyState) {
      // 改变的时候触发  IE才有
      script.onreadystatechange = function () {
        if (script.readyState == 'complete' || script.readyState == 'loaded') {
          resolve();
        }
      };
    } else {
      // IE没有
      script.onload = function () {
        resolve();
      };
    }
    // 可能加载的速度非常快，状态不会发生改变
    // 所以需要在下面加载
    script.src = url;
  });
}

/**
 * 移除左右两边空格
 * @param data
 */
export function trim(data) {
  if (typeof data == typeof {}) {
    for (let prop in data) {
      data[prop] = trim(data[prop]);
    }
  } else if (typeof data == typeof '') {
    data = data.trim();
  }
  return data;
}

/**
 * 判断是否是空值
 * 这些是我认为的空值
 */
export function isEmptyValue(val) {
  return typeof val != typeof 0 && (val == null || val == undefined || val == '');
}

/**
 * 实际移除操作的实现
 * @param data
 */
export function removeEmptyValue(data) {
  if (typeof data == typeof '') {
    return isEmptyValue(data) ? null : data;
  }
  for (let prop in data) {
    isEmptyValue(data[prop]) ?
      delete data[prop] :
      (
        data[prop] = typeof data[prop] == typeof {} ?
          removeEmptyValue(data[prop]) :
          data[prop]
    );
  }
  if (Array.isArray(data)) {
    data = data.filter(val =>
            (val != null && val != undefined && val != '')
          );
  }
  return data
}

/**
 * 删除`回车` 和 `换行` 和 `,`
 * @param list
 */
export function removeEnter(list) {
  let reg = /[,\n\r]/g;
  list.forEach((item, idx) => {
    for (let p in item) {
      item[p] = item[p] && item[p].toString().replace(reg, ' ');
    }
  });
}

/**
 * 不足位补0
 * @param {number|string} num
 * @returns {string}
 */
export function addZero(num, length = 2) {
  return String(num).padStart(length, '0');
}

/**
 * 转换时间戳 10位转13位
 * 13位就直接返回
 * @param {number} timeStamp
 */
export function getTimeStamp(timeStamp) {
  return secondTimeStampLength == timeStamp.toString().length ? (timeStamp *= 1000) : timeStamp;
}

/**
 * 获取元素的属性
 * 不止能获取行间
 * margin 也性
 */ 
export function getStyle(el,attr){
  if(el.currentStyle){      
    return el.currentStyle[attr];    
  } else {
    return document.defaultView.getComputedStyle(el,null)[attr];
  }
}

/**
 * 从url中获取参数
 * @param {string} key 
 */
export function getParamFromUrl(key) {
  if (key === undefined) {
    return {};
  }
  // 取所有参数并去掉?
  let search = location.search.substr(1);
  let mReg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
  let mValue = search.match(mReg);
  if (mValue != null) {
    return unescape(mValue[2]);
  }
  return null;
}

/**
 * 判断是不是一个没有任何属性的对象
 * @param {any} obj 
 */
export function isPlainObject(obj) {
  if (typeof obj != 'object') {
    // 抛异常的时候最后new Error 
    // 不然没有stack
    // 不方便找错
    throw new Error("Param is not object");
  }
  for (const prop in obj) {
    return false;
  }
  return true;
}

/**
 * @param {string} url 下载的blob地址
 * @param {string} filename 下载的文件名
 * @Author   tujiawei
 * @DateTime 2020-06-10T09:49:54+0800
 */
export function downloadBlob(url, filename) {
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', filename);

  document.body.appendChild(link);
  link.click();

  // 释放资源
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 将一个函数转换成一个立即调用的地址
 * 主要是为了 new Worker(url)
 * 需要注意函数不能是 native code
 * 1. 函数转字符串
 * 2. 将函数转换成IIFE
 * 3. 通过new Blob生成地址
 * @param {function} func
 * @Author   tujiawei
 * @DateTime 2020-06-10T10:28:14+0800
 */
export function initScriptUrl(func) {
  return URL.createObjectURL(new Blob([`(${func.toString()})();`]));
}

/**
 * 锁
 * @filename: Lock.js
 * @author: Mr Prince
 * @date: 2020-09-02 20:06:39
 */

class Lock {
  /**
   * 放等待锁的回调函数
   */
  queue = [];
  size = 0;
  maxSize = 1;

  /**
   * @param {number} size - 能够同时获取多少次权限
   */
  constructor(size = 1) {
    this.setSize(size);
  }

  setSize(size = 1) {
    if(size <= 0) {
      throw new Error('size 不能小于1');
    }
    this.maxSize = size;
  }

  /**
   * 获取锁
   */
  async lock() {
    this.size++;
    if(this.size <= this.maxSize) {
      return ;
    }
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  /**
   * 释放锁
   */
  unLock() {
    if(this.size <= 0) {
      throw new Error('无法释放锁');
    }
    this.size--;
    /**
     * 触发下一个回调
     * 如果逻辑复杂
     * 可以新增一个dispatch函数
     */
    this.queue.length && this.queue.shift()();
  }
}

export default Lock;


/**
 * 队列封装
 * 同一时间只能处理一件事
 * @filename: decorator.js
 * @author: Mr Prince
 * @date: 2020-09-02 17:12:29
 */
import Lock from './Lock.js';

class Queue {
  queue = [];
  access = new Lock(1);

  /**
   * @param {object} options
   * @param {number} options.timeout - 最长等待时间
   * @param {function} options.handler - push执行的函数
   */
  constructor(options) {
    this.setOptions(options);
  }

  /**
   * 方便修改延时和回调函数
   * @param {object} options
   * @param {number} options.timeout - 最长等待时间, ms
   * @param {function} options.handler - push执行的函数
   */
  setOptions(options) {
    this.timeout = options.timeout;
    this.handler = options.handler;
  }

  /**
   * 执行回调
   * 需传入handler对应参数
   */
  async push(...args) {
    try {
      // 这里的await 不能省
      // 不然直接就同步释放锁了
      // 起不到限制的作用
      await this.getAccess();
      return await this.handler(...args);
    } finally {
      this.access.unLock();
    }
  }
  
  /**
   * 获取执行权限
   * 超过一定时间后自动结束
   */
  getAccess() {
    return new Promise(async (resolve, reject) => {
      this.timeout && setTimeout(() => {
        reject('timeout');
      }, this.timeout);
      await this.access.lock();
      resolve();
    });
  }
}

export default Queue;


/**
 * 职责链模式
 * @filename: ResponsibilityChain.js
 * @author: Mr Prince
 * @date: 2020-09-09 20:19:27
 */

class ResponsibilityChain {
  chain = [];
  /**
   * @param {function} callback - 验证一些事情，如果返回的值判断为true就不通过
   */
  add(callback) {
    chain.push(callback);
  }

  doAction(...args) {
    let res;
    for(let i = 0; i < chain.length; i++) {
      res = chain[i](...args);
      if(res) {
        break;
      }
    }
    return res;
  }
}

export default ResponsibilityChain;


/**
 * 以秒为单位 延时一段时间
 */
import { secondTimeStampLength } from "../config/index.js";
import LockClass from './Lock.js';
import QueueClass from './Queue.js';
import RC from './ResponsibilityChain.js';

export const Lock = LockClass;
export const Queue = QueueClass;
export const ResponsibilityChain = RC;

export function sleep(timeout = 1) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout * 1000);
  });
}

/**
 * 异步加载js脚本
 */
export function loadScript(id, url) {
  return new Promise((resolve, reject) => {
    let script = document.querySelector(id);
    script.type = 'text/javascript';
    if (script.readyState) {
      // 改变的时候触发  IE才有
      script.onreadystatechange = function () {
        if (script.readyState == 'complete' || script.readyState == 'loaded') {
          resolve();
        }
      };
    } else {
      // IE没有
      script.onload = function () {
        resolve();
      };
    }
    // 可能加载的速度非常快，状态不会发生改变
    // 所以需要在下面加载
    script.src = url;
  });
}

/**
 * 移除左右两边空格
 * @param data
 */
export function trim(data) {
  if (typeof data == typeof {}) {
    for (let prop in data) {
      data[prop] = trim(data[prop]);
    }
  } else if (typeof data == typeof '') {
    data = data.trim();
  }
  return data;
}

/**
 * 判断是否是空值
 * 这些是我认为的空值
 */
export function isEmptyValue(val) {
  return typeof val != typeof 0 && (val == null || val == undefined || val == '');
}

/**
 * 实际移除操作的实现
 * @param data
 */
export function removeEmptyValue(data) {
  if (typeof data == typeof '') {
    return isEmptyValue(data) ? null : data;
  }
  for (let prop in data) {
    isEmptyValue(data[prop]) ?
      delete data[prop] :
      (
        data[prop] = typeof data[prop] == typeof {} ?
          removeEmptyValue(data[prop]) :
          data[prop]
    );
  }
  if (Array.isArray(data)) {
    data = data.filter(val =>
            (val != null && val != undefined && val != '')
          );
  }
  return data
}

/**
 * 删除`回车` 和 `换行` 和 `,`
 * @param list
 */
export function removeEnter(list) {
  let reg = /[,\n\r]/g;
  list.forEach((item, idx) => {
    for (let p in item) {
      item[p] = item[p] && item[p].toString().replace(reg, ' ');
    }
  });
}

/**
 * 不足位补0
 * @param {number|string} num
 * @returns {string}
 */
export function addZero(num, length = 2) {
  return String(num).padStart(length, '0');
}

/**
 * 转换时间戳 10位转13位
 * 13位就直接返回
 * @param {number} timeStamp
 */
export function getTimeStamp(timeStamp) {
  return secondTimeStampLength == timeStamp.toString().length ? (timeStamp *= 1000) : timeStamp;
}

/**
 * 获取元素的属性
 * 不止能获取行间
 * margin 也性
 */ 
export function getStyle(el,attr){
  if(el.currentStyle){      
    return el.currentStyle[attr];    
  } else {
    return document.defaultView.getComputedStyle(el,null)[attr];
  }
}

/**
 * 从url中获取参数
 * @param {string} key 
 */
export function getParamFromUrl(key) {
  if (key === undefined) {
    return {};
  }
  // 取所有参数并去掉?
  let search = location.search.substr(1);
  let mReg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
  let mValue = search.match(mReg);
  if (mValue != null) {
    return unescape(mValue[2]);
  }
  return null;
}

/**
 * 判断是不是一个没有任何属性的对象
 * @param {any} obj 
 */
export function isPlainObject(obj) {
  if (typeof obj != 'object') {
    // 抛异常的时候最后new Error 
    // 不然没有stack
    // 不方便找错
    throw new Error("Param is not object");
  }
  for (const prop in obj) {
    return false;
  }
  return true;
}

/**
 * @param {string} url 下载的blob地址
 * @param {string} filename 下载的文件名
 * @Author   tujiawei
 * @DateTime 2020-06-10T09:49:54+0800
 */
export function downloadBlob(url, filename) {
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', filename);

  document.body.appendChild(link);
  link.click();

  // 释放资源
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 将一个函数转换成一个立即调用的地址
 * 主要是为了 new Worker(url)
 * 需要注意函数不能是 native code
 * 1. 函数转字符串
 * 2. 将函数转换成IIFE
 * 3. 通过new Blob生成地址
 * @param {function} func
 * @Author   tujiawei
 * @DateTime 2020-06-10T10:28:14+0800
 */
export function initScriptUrl(func) {
  return URL.createObjectURL(new Blob([`(${func.toString()})();`]));
}


/**
 * 锁
 * @filename: Lock.js
 * @author: Mr Prince
 * @date: 2020-09-02 20:06:39
 */

class Lock {
  /**
   * 放等待锁的回调函数
   */
  queue = [];
  size = 0;
  maxSize = 1;

  /**
   * @param {number} size - 能够同时获取多少次权限
   */
  constructor(size = 1) {
    this.setSize(size);
  }

  setSize(size = 1) {
    if(size <= 0) {
      throw new Error('size 不能小于1');
    }
    this.maxSize = size;
  }

  /**
   * 获取锁
   */
  async lock() {
    this.size++;
    if(this.size <= this.maxSize) {
      return ;
    }
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  /**
   * 释放锁
   */
  unLock() {
    if(this.size <= 0) {
      throw new Error('无法释放锁');
    }
    this.size--;
    /**
     * 触发下一个回调
     * 如果逻辑复杂
     * 可以新增一个dispatch函数
     */
    this.queue.length && this.queue.shift()();
  }
}

export default Lock;

/**
 * 队列封装
 * 同一时间只能处理一件事
 * @filename: decorator.js
 * @author: Mr Prince
 * @date: 2020-09-02 17:12:29
 */
import Lock from './Lock.js';

class Queue {
  queue = [];
  access = new Lock(1);

  /**
   * @param {object} options
   * @param {number} options.timeout - 最长等待时间
   * @param {function} options.handler - push执行的函数
   */
  constructor(options) {
    this.setOptions(options);
  }

  /**
   * 方便修改延时和回调函数
   * @param {object} options
   * @param {number} options.timeout - 最长等待时间, ms
   * @param {function} options.handler - push执行的函数
   */
  setOptions(options) {
    this.timeout = options.timeout;
    this.handler = options.handler;
  }

  /**
   * 执行回调
   * 需传入handler对应参数
   */
  async push(...args) {
    try {
      // 这里的await 不能省
      // 不然直接就同步释放锁了
      // 起不到限制的作用
      await this.getAccess();
      return await this.handler(...args);
    } finally {
      this.access.unLock();
    }
  }
  
  /**
   * 获取执行权限
   * 超过一定时间后自动结束
   */
  getAccess() {
    return new Promise(async (resolve, reject) => {
      this.timeout && setTimeout(() => {
        reject('timeout');
      }, this.timeout);
      await this.access.lock();
      resolve();
    });
  }
}

export default Queue;


/**
 * 职责链模式
 * @filename: ResponsibilityChain.js
 * @author: Mr Prince
 * @date: 2020-09-09 20:19:27
 */

class ResponsibilityChain {
  chain = [];
  /**
   * @param {function} callback - 验证一些事情，如果返回的值判断为true就不通过
   */
  add(callback) {
    chain.push(callback);
  }

  doAction(...args) {
    let res;
    for(let i = 0; i < chain.length; i++) {
      res = chain[i](...args);
      if(res) {
        break;
      }
    }
    return res;
  }
}

export default ResponsibilityChain;

/**
 * 发送短信倒计时
 * 写过无数遍了，烦死
 */
import { sleep } from "tu-util";

class CountDown {

  /**
   * 定义结束消息是什么
   * @param {string} message
   */
  constructor(message) {
    this.message = message;
    this.callbacks = [];
  }

  /**
   * 开始倒计时
   * @param {number} from 倒计时开始
   * @param {number} to 倒计时结束
   * @param {number} timeout 计数间隔(秒)
   */
  async start(from = 60, to = 0, timeout = 1) {
    for (let i = from; i > to; i--) {
      this.publish({
        message: i,
        done: false
      });
      await sleep(timeout);
    }
    this.publish({
      message: this.message,
      done: true
    });
  }

  /**
   * 内部函数，发布每次变化
   * @param {string|number} message
   */
  async publish(message) {
    this.callbacks.forEach(fn => {
      fn(message);
    });
  }

  /**
   * 添加订阅
   * @param {function} callback 订阅函数
   */
  subscribe(callback) {
    this.callbacks.push(callback);
  }

  /**
   * 取消订阅
   * @param {function} callback 订阅函数
   */
  unsubscribe(callback) {
    let index = this.callbacks.findIndex(cb => cb == callback);
    if(-1 != index) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * 清空所有订阅函数
   */
  clear() {
    this.callbacks = [];
  }
}

export default CountDown;

import { addZero } from "tu-util";

class DateTimeTool {

  /**
   * 格式化时间
   * @param {Date} date
   * @returns {string}
   */
  static timeFormat(date) {
    let res = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ];
    return res.map(num => addZero(num)).join(':');
  }

  /**
   * 格式化日期
   * @param {Date} date
   * @returns {string}
   */
  static dateFormat(date) {
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    ].map(num => {
      return addZero(num);
    }).join('-');
  }

  /**
   * 格式化日期时间
   * @param {Date} date
   * @returns {string}
   */
  static dateTimeFormat(date) {
    return `${this.dateFormat(date)} ${this.timeFormat(date)}`;
  }

  /**
   * 获取n天以前时间和当前日期时间
   * @param {number} n
   * @returns {Date[]}
   */
  static getNthDayBefore(n) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * n);
    return [start, end];
  }

  /**
   * 获取n小时之前到当前时间
   * @param {number} n
   * @returns {Date[]}
   */
  static getNthHourBefore(n) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * n);
    return [start, end];
  }

  /**
   * 获取n月以前时间到当前月时间
   * @param {number} n
   * @returns {Date[]}
   */
  static getNthMonthBefore(n = 1) {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - n);
    return [start, end];
  }
}

export default DateTimeTool;

/**
 * 不能保存函数，建议funcname.toString() 后保存
 * 保存时，如果没有给value， 不会包错，
 * 但取值时，如果为undefined，会提示
 * 保存的类型为 Symbol 时，无法正常保存
 * 不提供遍历的方法，可以使用原生
 */

/**
 * localData 可以在构造的时候给个选项
 * localStorage 或者 sessionStorage
 * 就可以实现存储方式的改变
 */

/**
 * 保存数据到本地
 * 这里写成函数的形式
 * 是为了私有变量
 * @author 屠佳伟 Mrprince 2019-09-28
 * @param  {String} prefix 保存键值对的前缀，避免冲突
 *
 *
 * !!! 需要注意的是，不能保存函数到本地
 * 需要将函数装换成字符串再保存
 */

class LocalData {
    private readonly prefix;
    constructor(prefix = 'tujiawei') {
        this.prefix = prefix;
    }
    private getString (key) {
        return localStorage.getItem(this.prefix + key);
    }
    get (key) {
      let res = this.getString(key);
      try {
        res = JSON.parse(res);
      } catch (e) {
        console.warn('无法转换');
      }
      return res;
    }
    set (key, value) {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }
    clear () {
      localStorage.clear();
    }
    remove (key) {
      localStorage.removeItem(this.prefix + key);
    }
}

export default LocalData;

/**
 * 前端分页
 * 数据逻辑处理
 * 主要是我不知道
 * 怎么把jsx或者dom操作等编译到这里面去
 */
interface TableData {
    pageNum: number;
    pageSize: number;
    total: number;
    list: any[];
}

interface Callback {
    (tableData: TableData): void;
}

export class PaginationUtil {
    private tableData: TableData;
    private callbacks: Callback[] = [];

    constructor(tableData: TableData) {
        this.tableData = tableData;
    }

    setOrder(key: string = 'order') {
        this.tableData.list.forEach((item, index) => {
            item[key] = index + 1;
        });
    }

    /**
     * 必须是能够排序的
     * 如果不能够排序，就另加一个字段来排序
     */
    sort(key: string, order: 'asc' | 'desc' = 'desc') {
        if (order == 'asc') {
            this.tableData.list.sort((a, b) => a[key] - b[key]);
        } else {
            this.tableData.list.sort((a, b) => b[key] - a[key]);
        }
    }

    /**
     * 跳转到指定页
     * 不传参默认跳转当前页
     * 不返回任何数据
     * 需要监听subscribe
     */
    to(pageNum?: number) {
        pageNum = pageNum || this.tableData.pageNum;
        this.tableData.pageNum = pageNum;
        let {pageSize} = this.tableData;
        let start = (pageNum - 1) * pageSize;
        let end = start + pageSize;
        let list = this.tableData.list.slice(start, end);
        this.publish({
            ...this.tableData,
            list,
        });
        return list;
    }

    setPageSize(pageSize: number) {
        this.tableData.pageSize = pageSize;
    }

    private publish(tableData: TableData) {
        this.callbacks.forEach(callback => callback(tableData));
    }

    subscribe(callback: Callback) {
        this.callbacks.push(callback);
    }
}

/**
 * 双向链表
 * 我觉得这里会出很多问题
 * 因为前后指针的原因
 * 需要再检查一遍
 *
 * 除了 head 和 tail 只需要处理一个指针
 * 其他所有节点都需要处理两个
 */
export class Node<T> {
    value: T;
    prev: Node<T>;
    next: Node<T>;

    constructor(value?: T, prev?: Node<T>, next?: Node<T>) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

const funcType = typeof function () {};
const isFunc = (value: any): boolean => typeof value == funcType;
const identity = (value: any, index?: number) => value;
const isDef = (value: any): boolean => typeof value !== "undefined";

export class LinkList<T> {
    private head: Node<T> = new Node<T>();
    private tail: Node<T> = new Node<T>();
    private length;

    constructor() {
        this.clear();
    }

    /**
     * 检查下标，如果不对就报个错
     */
    checkIndex(index: number): void {
        if (index < 0 || index >= this.size()) {
            throw new Error('Index out of range!');
        }
    }

    /**
     * 清空
     */
    clear(): void {
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.length = 0;
    }

    /**
     * 连接
     */
    concat(linkList: LinkList<T>): LinkList<T> {
        if (linkList) {
            let firstNode = linkList.head.next;
            this.tail.prev.next = firstNode;
            firstNode.prev = this.tail.prev;
            this.tail = linkList.tail;
            this.length += linkList.size();
        }
        return this;
    }

    /**
     * 是否包含某个值
     */
    contains(value: T): boolean {
        return this.indexOf(value) != -1;
    }

    /**
     * 过滤出所有的值
     */
    filter(fn: (value: T, index: number) => boolean): LinkList<T> {
        let linkList = new LinkList<T>();
        this.forEach((value, index) => {
            fn(value, index) && linkList.push(value);
        });
        return linkList;
    }

    /**
     * 查找第一个满足要求的元素, 找不到就是undefined
     */
    find(fn: (value: T, index: number) => boolean): T {
        for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
            if (fn(node.value, i)) {
                return node.value;
            }
        }
    }

    /**
     * 查找第一个满足要求的元素下标
     */
    findIndex(fn: (value: T, index: number) => boolean): number {
        for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
            if (fn(node.value, i++)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 简单循环
     */
    forEach(fn: (val?: T, index?: number) => void): void {
        for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
            fn(node.value, i);
        }
    }

    /**
     * 获取指定下标的值
     */
    get(index: number): T {
        this.checkIndex(index);
        let node = this.head.next;
        for (let i = 0; i < index; node = node.next, i++);
        return node.value;
    }

    /**
     * 判断是否包含某一个值
     */
    includes(value: T): boolean {
        return this.indexOf(value) != -1;
    }

    /**
     * 查找指定值的下标
     */
    indexOf(value: T): number {
        return this.findIndex(val => val == value);
    }

    /**
     * 判断是否为空
     */
    isEmpty(): boolean {
        return this.size() == 0;
    }

    /**
     * 根据指定分隔符连接字符串
     */
    join(delimiter?: string, transfer?: (value: T, index?: number) => string): string {
        let format = transfer || identity;
        if (!isFunc(format)) {
            throw new Error('Transfer function is not a function');
        }
        let result = [];
        this.forEach((value, index) => {
            result.push(format(value, index));
        });
        return result.join(delimiter);
    }

    /**
     * 指定值的最大下标
     */
    lastIndexOf(value: T): number {
        for (let node = this.tail.prev, i = this.size() - 1; node != this.head; node = node.prev, i--) {
            if (value == node.value) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 指定条件的映射
     * 返回一个新
     */
    map(fn: (value: T, index: number) => T): LinkList<T> {
        let linkList = new LinkList<T>();
        this.forEach((value) => {
            linkList.push(value);
        });
        return linkList;
    }

    /**
     * 去掉最后一个
     */
    pop(): T {
        if (!this.size()) {
            return null;
        }
        this.length--;
        let tail = this.tail.prev;
        tail.prev.next = this.tail;
        this.tail.prev = tail.prev;
        return tail.value;
    }

    /**
     * 向尾部添加
     */
    push(value: T): void {
        let node = new Node<T>(value);
        node.next = this.tail;
        node.prev = this.tail.prev;
        this.tail.prev.next = node;
        this.tail.prev = node;
        this.length++;
    }

    /**
     * 缩减
     */
    reduce(fn: (prev: any, currentValue: T, index: number) => any, initialValue?: any): any {
        if (!this.size() && !isDef(initialValue)) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        this.forEach((value, index) => {
            if (index == 0) {
                if(isDef(initialValue)){
                    initialValue = fn(initialValue, value, index);
                } else {
                    initialValue = value;
                }
                return ;
            }
            initialValue = fn(initialValue, value, index);
        });
        return initialValue;
    }

    /**
     * 反向缩减
     */
    reduceRight(fn: (prev: any, currentValue: T, index: number) => any, initialValue?: any): any {
        let i = this.size() - 1;
        let node = this.tail.prev;
        if(!isDef(initialValue)) {
            if(!this.size()) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            initialValue = node.value;
            node = node.prev;
            i--;
        }
        for (; node != this.head; node = node.prev, i--) {
            initialValue = fn(initialValue, node.value, i);
        }
        return initialValue;
    }

    /**
     * 移除指定下标的值
     */
    remove(index: number): T {
        this.checkIndex(index);
        for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
            if (i == index) {
                node.prev.next = node.next;
                node.next.prev = node.prev;
                this.length--;
                return node.value;
            }
        }
    }

    /**
     * 反转， 应该要改变原来的
     * 这里不是简单改个头指针就行了
     * 需要交换每个节点的前后指针
     */
    reverse(): LinkList<T> {
        let startNode = this.head.next;
        let endNode = this.tail;
        this.clear();
        while(startNode != endNode) {
            this.unshift(startNode.value);
            startNode = startNode.next;
        }
        return this;
    }

    /**
     * 设置指定位置的值
     */
    set(index: number, value: T): void {
        this.checkIndex(index);
        for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
            if (i == index) {
                node.value = value;
                break;
            }
        }
    }

    /**
     * 移除第一个
     */
    shift(): T {
        if (this.size()) {
            let node = this.head.next;
            this.head.next = node.next;
            node.next.prev = this.head;
            this.length--;
            return node.value;
        }
    }

    /**
     * 获取的长度
     */
    size(): number {
        return this.length;
    }

    /**
     * 获取其中的一段
     */
    slice(start?: number, end?: number): LinkList<T> {
        start = start || 0;
        end = isDef(end) ? end : this.size();
        end = end > -1 ? end : (this.size() - end);
        let linkList = new LinkList<T>();
        this.forEach((value, index) => {
            if (index >= start && index < end) {
                linkList.push(value);
            }
        });
        return linkList;
    }

    /**
     * 遍历其中的一部分, 和findIndex逻辑几乎一样
     */
    some(fn: (value: T, index: number) => boolean): boolean {
        return this.findIndex(fn) != -1;
    }

    /**
     * 排序,选择排序，毕竟是自己写的工具，要求不能太高
     */
    sort(fn?: (item1: T, item2: T) => number) {
        for (let startNode = this.head.next; startNode != this.tail; startNode = startNode.next) {
            let changeNode = startNode;
            for (let currentNode = startNode.next; currentNode != this.tail; currentNode = currentNode.next) {
                if (fn(changeNode.value, currentNode.value) > 0) {
                    changeNode = currentNode;
                }
            }
            [startNode.value, changeNode.value] = [changeNode.value, startNode.value];
        }
        return this;
    }

    /**
     * 切割数据, 会改变原数据
     * 找到中间一段，放到新的LinkList里面
     */
    splice(start?: number, end?: number): LinkList<T> {
        start = start || 0;
        end = isDef(end) ? end : this.size();
        end = end > -1 ? end : (this.size() - end);
        let linkList = new LinkList<T>();
        linkList.length = end - start;
        let startNode,
            endNode;
        for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
            if (i == start) {
                startNode = node;
            } else if (i == end) {
                endNode = node;
                break;
            }
        }
        startNode.prev.next = endNode;
        let temp = endNode.prev;
        endNode.prev = startNode.prev;

        linkList.head.next = startNode;
        linkList.length = end - start;
        startNode.prev = linkList.head;
        linkList.tail.prev = temp;
        temp.next = linkList.tail;
        this.length -= linkList.length;
        return linkList;
    }

    toString(): string {
        return this.join();
    };

    toArray(): T[] {
        return this.reduce((result, value) => {
            result.push(value);
            return result;
        }, []);
    }

    /**
     * 向头部添加
     */
    unshift(value: T): void {
        let node = new Node<T>(value);
        node.next = this.head.next;
        node.prev = this.head;

        this.head.next = node;
        this.length++;
    }

    /**
     * 返回一个迭代器
     * 为了能够for..of循环
     */
    [Symbol.iterator]() {
        let node = this.head.next;
        let end = this.tail;
        return {
            next() {
                let done = node == end;
                let value;
                if(!done) {
                    value = node.value;
                    node = node.next;
                }
                return {
                    value,
                    done
                };
            }
        }
    }
}

import {functionType, LOG_LEVEL} from "./config";

export function Publish(target, key: string, descriptor) {
    const level = key.toUpperCase();
    descriptor.value = function (...message: string[]) {
        if (LOG_LEVEL[level] >= this.level) {
            this.publish(this.formatMessage(LOG_LEVEL[level], getParameters(message)));
        }
    }
}

const _toString = Object.prototype.toString;
/**
 * 处理参数
 * @param {any} args
 * @return {string}
 */
export function getParameters(args) {
    let params = Array.isArray(args) ? args : [args];
    return params.map(param => {
      if (_toString.call(param) == _toString.call('')) {
        return param;
      }

      if (typeof param == 'undefined') {
        return 'undefined';
      }

      if (_toString.call(param) == _toString.call(null)) {
        return 'null';
      }

      if (param instanceof Error) {
        return `${param.message}: \n${param.stack}`;
      }

      if (param instanceof Date) {
        return `date: ${param.getTime}`
      }

      try {
        return JSON.stringify(param, null, '\t');
      } catch(e) {
        return param.toString();
      }
    // 打印对象的时候有空格很难受？
    // 以后说不定会改回来
    }).join('');
}

/**
 * 判断是否是promise
 * @param {any} val
 * @return {boolean}
 */
export function isPromise(val) {
    return val && typeof val.then == functionType && typeof val.catch == functionType;
}

/**
 * 统一处理返回值
 * 因为重复代码太多
 * @param {Logger} logger
 * @param {string} key
 * @param {any} res
 */
export function returnResult(logger, key, res) {
    logger.info(`function ${key} return => ${getParameters(res)}`);
    logger.info(`function ${key} finished`);
    return res;
}

/**
 * 代理增强
 * 这里还是把异常抛出去了
 * 日志打印归日志打印
 * 原来的逻辑还是不变的
 * 就是做了一层封装，提取了公共代码
 * @param {Logger} logger 打印日志
 * @param {string} key 函数名
 * @param {function} originMethod 需要增强的方法
 * @return {function} 增强后的方法
 */
export function proxyMethod(logger, key, originMethod) {
    return function (...args) {
        logger.info(`function ${key} call =>  ${key}(${getParameters(args)})`);
        try {
            // @ts-ignore
            let res = originMethod.apply(this, args);
            return isPromise(res) ?
                res.then(res => returnResult(logger, key, res))
                    .catch(e => {
                        logger.error(`promise error: ${getParameters(e)}`);
                        logger.info(`function ${key} finished`);
                        throw e;
                }) :
                returnResult(logger, key, res);
        } catch (e) {
            logger.error(e.stack);
            throw e;
        }
    }
}

export enum LOG_LEVEL {
    ALL,
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL,
    OFF
};

export const functionType = typeof function () {};

import {Logger} from "./Logger";
import {proxyMethod} from "./util";
import {functionType, LOG_LEVEL} from "./config";

let logger = Logger.getLogger();
logger.setLevel(LOG_LEVEL.ALL);
logger.subscribe(console.log);

/**
 * 方法注释
 * 不管同步异步
 * 只加这一个
 */
export function Log(target, key: string, descriptor) {
    descriptor.value = proxyMethod(logger, key, descriptor.value);
}

/**
 * 类中所有方法日志处理
 * 需要判断是同步还是异步的
 * 这个判断还真的有点复杂呢
 */
export function EnableLog(ctor) {
    for (let key in ctor.prototype) {
        let originVal = ctor.prototype[key];
        if (typeof originVal != functionType) {
            continue;
        }
        ctor.prototype[key] = proxyMethod(logger, key, originVal);
    }
}

/**
 * 测试方法,方便我测试
 */
export function Test(target, key: string, descriptor) {
    let originMethod = descriptor.value;
    descriptor.value = function (...args) {
        logger.trace(`Test ${key} start`);
        try {
            originMethod.apply(this, args);
            logger.info(`Test ${key} passed`);
        } catch (e) {
            logger.error(e.message);
            throw e;
        } finally {
            logger.trace(`Test ${key} finished`);
        }
    }
}
import {LOG_LEVEL} from '../src/config';

export interface ListenHandle {
    (message: string): void;
}

/**
 * 日志记录工具类
 * 我的想法是进行一波日志处理后
 * 把处理完的日志用发布订阅的方式交给用户处理
 * 通过subscribe 订阅事件
 * 这个订阅的事件可以用工作线程处理
 */
export interface LoggerD {
    /**
     * trace 追踪
     * info 信息
     * debug 调试
     * warn 警告
     * error 错误
     * fatal 严重错误
     * off 关闭
     */
    /**
     * 设置日志等级
     */
    setLevel(level: LOG_LEVEL): void;
    /**
     * 输出追踪信息
     */
    trace(message: string): void;
    /**
     * 输出信息
     */
    info(message: string): void;

    /**
     * 输出调试信息
     */
    debug(message: string): void;

    /**
     * 输出警告信息
     */
    warn(message: string): void;

    /**
     * 输出严重错误信息
     */
    error(message: string): void;

    /**
     * 输出严重错误信息
     */
    fatal(message: string): void;

    /**
     * 订阅事件
     */
    subscribe(fn: ListenHandle): void;

    /**
     * 取消订阅
     */
    unsubscribe(fn: ListenHandle): void;
}
/**
 * 防抖 延迟${timeout}(ms)后再触发
 * 如果在么没触发之前又点了会重新开始计时
 * @param timeout
 * @constructor
 */
export function Debounce(timeout: number) {
    return function (target, key: string, descriptor) {
        let originMethod = descriptor.value;
        let handle: number | null = null;
        descriptor.value = function (...args) {
            handle && clearTimeout(handle);
            handle = setTimeout(() => {
                originMethod.apply(this, args);
                handle = null;
            }, timeout);
        }
    }
}
/**
 * 流程控制注解
 * 现在只想到了打印日志，其他好像没有什么作用
 * 因为我并不写后端
 */

/**
 * 根据命名空间来决定是否有需要提前或滞后的操作
 * 这里用target的原因是 descriptor只能拿到执行的函数
 * target能够直接作用到整个实例上
 * @param namespace {string}
 * @constructor 返回一个新的函数
 */
export function Before(namespace = 'default') {
    return function (target, key: string, descriptor) {
        target[namespace] = target[namespace] || {};
        target[namespace].before = descriptor.value;
    }
}

export function After(namespace = 'default') {
    return function (target, key: string, descriptor) {
        target[namespace] = target[namespace] || {};
        target[namespace].after = descriptor.value;
    }
}

export function Around(namespace = 'default') {
    return function (target, key: string, descriptor) {
        let originMethod = descriptor.value;
        descriptor.value = async function (...args) {
            let fns = target[namespace];
            if (!fns) {
                originMethod.apply(this, args);
                return;
            }
            fns.before && await fns.before.apply(this);
            await originMethod.apply(this, args);
            fns.after && await fns.after.apply(this);
        };
    }
}
/**
 * 重试，如果抛出异常了就重复执行一次
 */
export function Retry(target, key: string, descriptor) {
    let originMethod = descriptor.value;
    descriptor.value = async function (...args) {
        let data;
        try {
            data = await originMethod.apply(this, args);
        } catch (e) {
            data = await originMethod.apply(this, args);
        }
        return data;
    }
}

/**
 * 给工厂函数做单例用的
 * 主要是异步的单例
 * 所以写起来比较麻烦
 * 1. 先判断是不是已经完成初始化
 * 2. 完成直接返回
 * 3. 判断是不是正在初始化
 * 4. 是的话加一个promise的回调，等待初始化完成后直接返回
 * 5. 初始化，设置instance
 * 6. 通知所有的回调
 * 7. 返回instance
 */
export function Singleton(target, key: string, descriptor): any {
    /**
     * 如果key不存在的话
     * 说明是加在类上的
     * 给这个类做个懒加载的单例
     */
    if(!key) {
        let instance;
        return () => instance ? instance : (instance = new target);
    }
    let originMethod = descriptor.value;
    let instance = null;
    let initializing = false;
    let listeners = [];
    descriptor.value = async function (...args) {
        if(instance) {
            return instance;
        }
        if(initializing) {
            return new Promise(resolve => {
                listeners.push(resolve);
            });
        }
        initializing = true;
        instance = await originMethod.apply(this, args);
        while(listeners.length) {
            listeners.pop()(instance);
        }
        return instance;
    }
}

interface Option {
    leading?: boolean,
    trailing?: boolean
}

/**
 * 注意
 * 节流的参数还是上一次的参数
 * 除非执行完成之后
 */

/**
 * 自定义的节流注解
 */
export function Throttle(timeout: number = 500, option: Option = {leading: true}) {
    return option.leading ? Leading(timeout) : Trailing(timeout);
}

/**
 * 第一次直接执行
 * 之后节流
 * @param timeout
 * @constructor
 */
export function Leading(timeout: number = 500) {
    let timer: number | null = null,
        hadCall: boolean = false;
    return function (target, key: string, descriptor) {
        let originMethod = descriptor.value;
        let params: any = [];
        descriptor.value = function (...args) {
            params = args;
            if (!timer) {
                originMethod.call(this, params);
                timer = setInterval(() => {
                    if (hadCall) {
                        originMethod.call(this, params);
                    } else {
                        // @ts-ignore
                        clearInterval(timer);
                        timer = null;
                    }
                    hadCall = false;
                }, timeout);
            } else {
                hadCall = true;
            }
        }
    }
}

/**
 * 延迟节流
 * @param timeout
 */
export function Trailing(timeout: number = 500) {
    let timer: number | null = null;
    return function (target, key: string, descriptor) {
        let originMethod = descriptor.value;
        let params: any = [];
        descriptor.value = function (...args) {
            params = args;
            if (!timer) {
                timer = setTimeout(() => {
                    timer = null;
                    originMethod.call(this, params);
                }, timeout);
            }
        }
    }
}

// 参数去除左右两边空格
// import trim, {removeEmptyValue} from "../../util/src/RemoveEmpty";
function trim(data) {
  if (typeof data == typeof {}) {
    for (let prop in data) {
      data[prop] = trim(data[prop]);
    }
  } else if (typeof data == typeof '') {
    data = data.trim();
  }
  return data;
}

function isEmptyValue(val) {
  return typeof val != typeof 0 && (val == null || val == undefined || val == '');
}

function removeEmptyValue(data) {
  if (typeof data == typeof '') {
    return isEmptyValue(data) ? null : data;
  }
  for (let prop in data) {
    isEmptyValue(data[prop]) ?
      delete data[prop] :
      (
        data[prop] = typeof data[prop] == typeof {} ?
          removeEmptyValue(data[prop]) :
          data[prop]
    );
  }
  if (Array.isArray(data)) {
    data = data.filter(val => (val != null && val != undefined && val != ''));
  }
  return data
}
export function Trim(target, key: string, index: number) {
  target.validate = target.validate || {};
  target.validate.trim = target.validate.trim || {};
  target.validate.trim[key] = target.validate.trim[key] || [];
  target.validate.trim[key].push(index);
}

/**
 * 移除所有空值的注解
 * 建议只对对象和数组使用
 */
export function RemoveEmpty(target, key: string, index: number) {
  target.validate = target.validate || {};
  target.validate.empty = target.validate.empty || {};
  target.validate.empty[key] = target.validate.empty[key] || [];
  target.validate.empty[key].push(index);
}

/**
 * 在实现方法上加
 * @param target
 * @param key
 * @param descriptor
 * @constructor
 */
export function Validate(target, key: string, descriptor) {
  // 需要去除空格的
  let needTrim = (target.validate && target.validate.trim && target.validate.trim[key]) || [];
  let needRemove = (target.validate && target.validate.empty && target.validate.empty[key]) || [];
  let originMethod = descriptor.value;
  descriptor.value = function (...args) {
    needTrim.forEach((idx: number) => {
      args[idx] = trim(args[idx]);
    });
    needRemove.forEach((idx: number) => {
      args[idx] = removeEmptyValue(args[idx]);
    });
    originMethod.apply(this, args);
  }
}


#!/usr/bin/env node
const Koa = require('koa');
const static = require('koa-static');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const server = new Koa();
server.use(bodyParser());
server.use(static(process.cwd()));
const router = new Router();
const port = 3000;

server
.use(router.routes())
.use(router.allowedMethods());

server.listen(port, () => {
 console.log(`Server is runnig at http://localhost:${port}`);
});

  "dependencies": {
    "koa": "^2.11.0",
    "koa-bodyparser": "^4.2.1",
    "koa-router": "^7.4.0",
    "koa-static": "^5.0.0"
  }

import {ConnectionD} from "../types/TransactionMysqlD";
// @ts-ignore
import {PoolConnection} from "mysql";

export default class Connection implements ConnectionD {
    conn: PoolConnection;
    constructor(conn: PoolConnection) {
        this.conn = conn;
    }
    execute(sql: string, params?: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, params, (err, results) => {
                err && reject(err);
                resolve(results);
            });
        });
    }
    commit(): Promise<void> {
        return new Promise(((resolve, reject) => {
            this.conn.commit(err => {
                err && reject(err);
                resolve();
            });
        }));
    }
    rollback(): Promise<void> {
        return new Promise(((resolve, reject) => {
            this.conn.rollback(err => {
                err && reject(err);
                resolve();
            });
        }));
    }
    release(): void {
        this.conn.release();
    }
}

import {TransactionMysqlD} from "../types/TransactionMysqlD";

export function Connection(conn: TransactionMysqlD) {
    return function(target) {
        target.prototype.conn = conn;
    }
}

/**
 *
 * @param sql 查询语句
 * @constructor
 */
export function Select(sql: string) {
    return function (target, key: string, descriptor) {
        // 直接忽略函数体，因为真的用不上
        descriptor.value = function (...args) {
            return target.conn.execute(sql, args);
        }
    }
}

/**
 * 事务控制注解
 * 使用的时候稍微麻烦了点
 * @param target
 * @param key
 * @param descriptor
 * @constructor
 */
export function Transactional(target, key: string, descriptor) {
    let originMethod = descriptor.value;
    descriptor.value = async function (...args) {
        let conn = await target.conn.begin();
        let result;
        try {
            result = await originMethod.apply(this, args.concat(conn));
            await conn.commit();
        } catch (e) {
            await conn.rollback();
            console.log(e);
        } finally {
            conn.release();
        }
        return result;
    }
}

// @ts-ignore
import mysql, {Pool, PoolConfig} from "mysql";
import {TransactionMysqlD} from "./types/TransactionMysqlD";
import Connection from "./src/Connection";

export class TransactionMysql implements TransactionMysqlD {
  pool: Pool;
  constructor(config: PoolConfig) {
    this.pool = mysql.createPool(config);
    this.pool.on('connection', conn => {
      conn.query('set session auto_increment_increment=1');
    });
  }
  execute(sql: string, params?: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (err, results) => {
        err && reject(err);
        resolve(results);
      });
    });
  }
  async begin(): Promise<Connection> {
    let conn = await this.getConnection();
    return new Promise(((resolve, reject) => {
      conn.beginTransaction(err => {
        err && reject(err);
        /**
         * 这里可以池化，如果有必要的话
         */
        resolve(new Connection(conn));
      });
    }));
  }

  /**
   * 获取单个连接
   * @author 屠佳伟 Mrprince 2020-01-04
   * @return {connection} conn
   */
  private getConnection(): Promise<any> {
    return new Promise(((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        err && reject(err);
        resolve(conn);
      });
    }));
  }
}

// @ts-ignore
import {Pool, PoolConnection} from "mysql";

/**
 * 0. 数据库连接池
 * 1. 数据库操作
 * 2. 事务处理
 * @author 屠佳伟 Mrprince 2020-01-04
 */
export interface TransactionMysqlD {
     /**
     * 连接池
     */
    pool: Pool;
    /**
     * 执行单条sql语句
     * 自动获取释放链接
     * 没有事务
     * @param sql
     * @param params
     */
    execute(sql: string, params?: any[]): Promise<any[]>;
    /**
     * 开始事务，
     * 返回一个连接
     * 所有事务都在连接上操作
     */
    begin(): Promise<ConnectionD>;
}

interface ConnectionD {
    /**
     * 连接池中的一个链接，并且已经开启了事务
     */
    conn: PoolConnection;

    /**
     * 执行事务操作
     * @param sql
     * @param params
     */
    execute(sql: string, params?: any[]): Promise<any[]>;

    /**
     * 提交事务
     */
    commit(): Promise<void>;

    /**
     * 回滚事务
     */
    rollback(): Promise<void>;

    /**
     * 释放链接
     * 这个链接就没有了
     * 不能再继续使用
     */
    release(): void;
}

/**
 * 以秒为单位 延时一段时间
 */
import { secondTimeStampLength } from "../config/index.js";
import LockClass from './Lock.js';
import QueueClass from './Queue.js';
import RC from './ResponsibilityChain.js';

export const Lock = LockClass;
export const Queue = QueueClass;
export const ResponsibilityChain = RC;

export function sleep(timeout = 1) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout * 1000);
  });
}

/**
 * 异步加载js脚本
 */
export function loadScript(id, url) {
  return new Promise((resolve, reject) => {
    let script = document.querySelector(id);
    script.type = 'text/javascript';
    if (script.readyState) {
      // 改变的时候触发  IE才有
      script.onreadystatechange = function () {
        if (script.readyState == 'complete' || script.readyState == 'loaded') {
          resolve();
        }
      };
    } else {
      // IE没有
      script.onload = function () {
        resolve();
      };
    }
    // 可能加载的速度非常快，状态不会发生改变
    // 所以需要在下面加载
    script.src = url;
  });
}

/**
 * 移除左右两边空格
 * @param data
 */
export function trim(data) {
  if (typeof data == typeof {}) {
    for (let prop in data) {
      data[prop] = trim(data[prop]);
    }
  } else if (typeof data == typeof '') {
    data = data.trim();
  }
  return data;
}

/**
 * 判断是否是空值
 * 这些是我认为的空值
 */
export function isEmptyValue(val) {
  return typeof val != typeof 0 && (val == null || val == undefined || val == '');
}

/**
 * 实际移除操作的实现
 * @param data
 */
export function removeEmptyValue(data) {
  if (typeof data == typeof '') {
    return isEmptyValue(data) ? null : data;
  }
  for (let prop in data) {
    isEmptyValue(data[prop]) ?
      delete data[prop] :
      (
        data[prop] = typeof data[prop] == typeof {} ?
          removeEmptyValue(data[prop]) :
          data[prop]
    );
  }
  if (Array.isArray(data)) {
    data = data.filter(val =>
            (val != null && val != undefined && val != '')
          );
  }
  return data
}

/**
 * 删除`回车` 和 `换行` 和 `,`
 * @param list
 */
export function removeEnter(list) {
  let reg = /[,\n\r]/g;
  list.forEach((item, idx) => {
    for (let p in item) {
      item[p] = item[p] && item[p].toString().replace(reg, ' ');
    }
  });
}

/**
 * 不足位补0
 * @param {number|string} num
 * @returns {string}
 */
export function addZero(num, length = 2) {
  return String(num).padStart(length, '0');
}

/**
 * 转换时间戳 10位转13位
 * 13位就直接返回
 * @param {number} timeStamp
 */
export function getTimeStamp(timeStamp) {
  return secondTimeStampLength == timeStamp.toString().length ? (timeStamp *= 1000) : timeStamp;
}

/**
 * 获取元素的属性
 * 不止能获取行间
 * margin 也性
 */
export function getStyle(el,attr){
  if(el.currentStyle){
    return el.currentStyle[attr];
  } else {
    return document.defaultView.getComputedStyle(el,null)[attr];
  }
}

/**
 * 从url中获取参数
 * @param {string} key
 */
export function getParamFromUrl(key) {
  if (key === undefined) {
    return {};
  }
  // 取所有参数并去掉?
  let search = location.search.substr(1);
  let mReg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
  let mValue = search.match(mReg);
  if (mValue != null) {
    return unescape(mValue[2]);
  }
  return null;
}

/**
 * 判断是不是一个没有任何属性的对象
 * @param {any} obj
 */
export function isPlainObject(obj) {
  if (typeof obj != 'object') {
    // 抛异常的时候最后new Error
    // 不然没有stack
    // 不方便找错
    throw new Error("Param is not object");
  }
  for (const prop in obj) {
    return false;
  }
  return true;
}

/**
 * @param {string} url 下载的blob地址
 * @param {string} filename 下载的文件名
 * @Author   tujiawei
 * @DateTime 2020-06-10T09:49:54+0800
 */
export function downloadBlob(url, filename) {
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', filename);

  document.body.appendChild(link);
  link.click();

  // 释放资源
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 将一个函数转换成一个立即调用的地址
 * 主要是为了 new Worker(url)
 * 需要注意函数不能是 native code
 * 1. 函数转字符串
 * 2. 将函数转换成IIFE
 * 3. 通过new Blob生成地址
 * @param {function} func
 * @Author   tujiawei
 * @DateTime 2020-06-10T10:28:14+0800
 */
export function initScriptUrl(func) {
  return URL.createObjectURL(new Blob([`(${func.toString()})();`]));
}

/**
 * 锁
 * @filename: Lock.js
 * @author: Mr Prince
 * @date: 2020-09-02 20:06:39
 */

class Lock {
  /**
   * 放等待锁的回调函数
   */
  queue = [];
  size = 0;
  maxSize = 1;

  /**
   * @param {number} size - 能够同时获取多少次权限
   */
  constructor(size = 1) {
    this.setSize(size);
  }

  setSize(size = 1) {
    if(size <= 0) {
      throw new Error('size 不能小于1');
    }
    this.maxSize = size;
  }

  /**
   * 获取锁
   */
  async lock() {
    this.size++;
    if(this.size <= this.maxSize) {
      return ;
    }
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  /**
   * 释放锁
   */
  unLock() {
    if(this.size <= 0) {
      throw new Error('无法释放锁');
    }
    this.size--;
    /**
     * 触发下一个回调
     * 如果逻辑复杂
     * 可以新增一个dispatch函数
     */
    this.queue.length && this.queue.shift()();
  }
}

export default Lock;
/**
 * 队列封装
 * 同一时间只能处理一件事
 * @filename: decorator.js
 * @author: Mr Prince
 * @date: 2020-09-02 17:12:29
 */
import Lock from './Lock.js';

class Queue {
  queue = [];
  access = new Lock(1);

  /**
   * @param {object} options
   * @param {number} options.timeout - 最长等待时间
   * @param {function} options.handler - push执行的函数
   */
  constructor(options) {
    this.setOptions(options);
  }

  /**
   * 方便修改延时和回调函数
   * @param {object} options
   * @param {number} options.timeout - 最长等待时间, ms
   * @param {function} options.handler - push执行的函数
   */
  setOptions(options) {
    this.timeout = options.timeout;
    this.handler = options.handler;
  }

  /**
   * 执行回调
   * 需传入handler对应参数
   */
  async push(...args) {
    try {
      // 这里的await 不能省
      // 不然直接就同步释放锁了
      // 起不到限制的作用
      await this.getAccess();
      return await this.handler(...args);
    } finally {
      this.access.unLock();
    }
  }

  /**
   * 获取执行权限
   * 超过一定时间后自动结束
   */
  getAccess() {
    return new Promise(async (resolve, reject) => {
      this.timeout && setTimeout(() => {
        reject('timeout');
      }, this.timeout);
      await this.access.lock();
      resolve();
    });
  }
}

export default Queue;
/**
 * 职责链模式
 * @filename: ResponsibilityChain.js
 * @author: Mr Prince
 * @date: 2020-09-09 20:19:27
 */

class ResponsibilityChain {
  chain = [];
  /**
   * @param {function} callback - 验证一些事情，如果返回的值判断为true就不通过
   */
  add(callback) {
    chain.push(callback);
  }

  doAction(...args) {
    let res;
    for(let i = 0; i < chain.length; i++) {
      res = chain[i](...args);
      if(res) {
        break;
      }
    }
    return res;
  }
}

export default ResponsibilityChain;
function Transaction(target, key: string, descriptor) {
  descriptor.value = function (...args) {
    return new Promise((resolve, reject) => {
      let request = this.transaction()[key](...args);
      request.onsuccess = e => resolve(request.result);
      request.onerror = reject;
    });
  }
}

/**
 * 先写操作单个数据库的
 * 毕竟我也没有什么需要操作多个库的
 */
class DB {
  db;
  name;

  constructor(db) {
    this.db = db;
  }

  /**
   * @param {string} name
   */
  setTableName(name) {
    this.name = name;
  }

  transaction(name?) {
    name = name || this.name;
    return this.db.transaction(this.name, 'readwrite').objectStore(this.name);
  }

  @Transaction
  add(data) { }

  @Transaction
  put(data) { }

  @Transaction
  delete(data) { }

  @Transaction
  get(data) { }

  forEach(fn) {
    let request = this.transaction().openCursor();
    return new Promise((resolve, reject) => {
      request.onerror = reject;
      request.onsuccess = async e => {
        let cursor = request.result;
        if (cursor) {
          fn(cursor.value);
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

export class WebDBUtil {
    dbs = {};
    Initializing = {};
    eventType = {};

    /**
     * @param {string} dbName
     * @param {function} upgradeFn
     * @param {number | string} version
     * @return {Promise<DB>}
     */
    getDB(dbName, upgradeFn?, version?) {
        if (this.dbs[dbName]) {
            return Promise.resolve(this.dbs[dbName]);
        }
        if (this.Initializing[dbName]) {
            return new Promise(resolve => {
                this.addEventListener(`${dbName}-init-finish`, instance => {
                    resolve(instance);
                });
            });
        }
        return this.init(dbName, upgradeFn, version);
    }

    /**
     * @param {string} dbName
     * @param {function} upgradeFn
     * @param {number | string} version
     * @return {Promise<DB>}
     */
    init(dbName, upgradeFn, version) {
        this.Initializing[dbName] = true;
        let request = indexedDB.open(dbName, version);
        return new Promise((resolve, reject) => {
            request.onsuccess = e => {
                let db = new DB(request.result);
                this.dbs[dbName] = db;
                this.dispatch(`${dbName}-init-finish`, db);
                resolve(db);
            };
            request.onerror = reject;
            request.onupgradeneeded = e => {
                upgradeFn(request.result);
            };
        });
    }

    addEventListener(type, fn) {
        this.eventType[type] = this.eventType[type] || [];
        this.eventType[type].push(fn);
    }

    dispatch(type, data) {
        let listeners = this.eventType[type];
        if (listeners) {
            listeners.forEach(fn => {
                fn(data);
            });
        }
    }
}

