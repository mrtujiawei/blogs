# node snippets

## 远程调试

> -brk 是暂停到第一行代码前
> 默认情况下 会暂停到 第一个 debugger 所在行
`node --inspect[-brk]=[ip:port] xxx.js`

需要 chrome://inspect 配置 域名和 ip

## electron 源码 加密

[electron 代码加密](https://github.com/toyobayashi/electron-asar-encrypt-demo)

## 编译器开发

[c 编译器](https://www.bilibili.com/medialist/play/181099947?from=space&business=space&sort_field=pubtime&tid=0&spm_id_from=333.999.0.0)

## 公钥 - 私钥 验证

```typescript
import crypto from 'crypto';

const content = 'test';

const cert = 'cert';
const key = 'key';

// 证书不对会抛出异常
const result = crypto.publicEncrypt(cert, Buffer.from(content));
const transformed = crypto.privateDecrypt(key, result);

content == transformed // true
```
