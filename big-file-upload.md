# 大文件上传

## 前端部分

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
