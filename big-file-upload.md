# 大文件上传

## 前端部分

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>文件上传</title>
    <script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mrtujiawei/web-utils"></script>
  </head>

  <body>
    <div>
      <input id="file" type="file" name="avatar" />
      <div style="padding: 10px 0">
        <input id="submitBtn" type="button" value="提交" />
        <input id="pauseBtn" type="button" value="暂停" />
      </div>
      <div class="precent">
        <input type="range" value="0" /><span id="precentVal">0%</span>
      </div>
    </div>
    <script type="text/javascript">
      const server = 'http://192.168.3.102:5555';
      const { sliceFile } = TWebUtils;
      const submitBtn = $('#submitBtn'); //提交按钮
      const precentDom = $('.precent input')[0]; // 进度条
      const precentVal = $('#precentVal'); // 进度条值对应dom
      const pauseBtn = $('#pauseBtn'); // 暂停按钮

      // 提交
      submitBtn.on('click', async () => {
        var pauseStatus = false;
        // 1.读取文件
        const fileDom = $('#file')[0];
        const files = fileDom.files;
        const file = files[0];
        if (!file) {
          alert('没有获取文件');
          return;
        }
        const { hash, forms } = await sliceFile(file);
        const axiosOptions = {
          onUploadProgress: (e) => {
            console.log({ loaded: e.loaded, total: e.total });
          },
        };
        for (let i = 0; i < forms.length; i++) {
          const result = await axios.post(
            `${server}/file/upload`,
            forms[i],
            axiosOptions
          );
          setPrecent(i, forms.length);
        }
        setPrecent(forms.length, forms.length);
        await axios.post(`${server}/file/merge_chunks`, {
          hash,
          name: file.name,
          total: forms.length,
        });
        // 设置进度条
        function setPrecent(now, total) {
          var prencentValue = ((now / total) * 100).toFixed(2);
          precentDom.value = prencentValue;
          precentVal.text(prencentValue + '%');
          precentDom.style.cssText = `background:-webkit-linear-gradient(top, #059CFA, #059CFA) 0% 0% / ${prencentValue}% 100% no-repeat`;
        }
        // 暂停
        pauseBtn.on('click', (e) => {
          pauseStatus = !pauseStatus;
          e.currentTarget.value = pauseStatus ? '开始' : '暂停';
          if (!pauseStatus) {
            uploadFile(nowUploadNums);
          }
        });
      });
    </script>
  </body>
</html>
```

```typescript
import SparkMD5 from 'spark-md5';

/**
 * 计算文件的hash: 名字和内容
 */
export const hashFile = async (
  file: File,
  { chunkSize } = { chunkSize: 1 * 1024 * 1024 }
) => {
  const chunks = Math.ceil(file.size / chunkSize);
  const spark = new SparkMD5.ArrayBuffer();
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const buffer = await blobToArrayBuffer(file.slice(start, end));
    spark.append(buffer);
  }
  const result = spark.end();
  const hexHash = new SparkMD5().append(result).append(file.name).end();
  return hexHash;
};

/**
 * 上传处理
 * 切割 file, 并生成 FormData 数组
 * content-type: multipart/form-data
 */
export const sliceFile = async (
  file: File,
  { chunkSize } = { chunkSize: 1 * 1024 * 1024 }
) => {
  const chunks = Math.ceil(file.size / chunkSize);
  const hash = await hashFile(file);
  const forms: FormData[] = new Array(chunks);
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const form = new FormData();
    form.append('file', file.slice(start, end));
    form.append('index', `${i}`);
    form.append('hash', hash);
    forms[i] = form;
  }
  return {
    hash,
    forms,
  };
};
```

## 后端部分

```typescript
import multer from '@koa/multer';
import { mergeSlices, sliceDirctory, uploadSlice } from './File';

// 目标目录
const upload = multer({ dest: sliceDirctory });

router.post('/file/upload', upload.single('file'), async (ctx) => {
  const file = ctx.request.file;
  const index: number = ctx.request.body.index;
  const hash: string = ctx.request.body.hash;
  await uploadSlice({
    index,
    hash,
    currentPath: file.path,
  });
  ctx.body = JSON.stringify({
    code: 200,
    message: '',
    data: null,
  });
});

router.post('/file/merge_chunks', async (ctx) => {
  const { name, total, hash } = ctx.request.body;
  mergeSlices({
    name,
    hash,
    total,
  });
  ctx.body = JSON.stringify({
    code: 200,
    message: '',
    data: null,
  });
});
```

```typescript
import fs from 'fs/promises';
import path from 'path';

// 目标目录
export const sliceDirctory = path.join(process.cwd(), 'upload');

/**
 * 接收保存文件切片
 */
export async function uploadSlice({
  index,
  hash,
  currentPath,
}: {
  index: number;
  hash: string;
  currentPath: string;
}) {
  const targetDirectory = path.join(sliceDirctory, hash, '/');
  try {
    await fs.stat(targetDirectory);
  } catch {
    await fs.mkdir(targetDirectory, {
      recursive: true,
    });
  }

  fs.rename(currentPath, path.resolve(targetDirectory, `${hash}-${index}`));
}

export async function mergeSlices({
  name,
  hash,
  total,
}: {
  name: string;
  hash: string;
  total: number;
}) {
  const chunksPath = path.join(sliceDirctory, hash, '/');
  const filePath = path.join(sliceDirctory, name);
  const chunks = await fs.readdir(chunksPath);
  await fs.writeFile(filePath, '');
  if (chunks.length == 0 || chunks.length != total) {
    throw new RangeError('slice total not valid');
  }
  for (let i = 0; i < total; i++) {
    await fs.appendFile(
      filePath,
      await fs.readFile(path.resolve(chunksPath, `${hash}-${i}`))
    );
    await fs.unlink(path.resolve(chunksPath, `${hash}-${i}`));
  }
  await fs.rmdir(chunksPath);
}
```
