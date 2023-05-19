# Image Orientation

## install dependency

```bash
$ yarn add exif-js @mrtujiawei/utils
```

```typescript
import { Types } from '@mrtujiawei/utils';
import EXIF from 'exif-js';

/**
 * 获取图片的朝向
 * 0 | undefined: 未获取到
 * 1: 不翻转
 * 2: 左右翻转
 * 3: 180度翻转
 * 4: 上下翻转
 * 5: 顺时针翻转90度后，左右翻转
 * 6: 顺时针翻转90度
 * 7: 逆时针翻转90度后，左右翻转
 * 8: 逆时针翻转90度
 */
export const getOrientation = async (srcOrImage: string | HTMLImageElement) => {
  let image: HTMLImageElement;
  if (Types.isString(srcOrImage)) {
    image = await loadImage(srcOrImage);
  } else {
    image = srcOrImage;
  }

  let orientation = 1;
  EXIF.getData(image as unknown as string, () => {
    console.log({ before: orientation });
    orientation = EXIF.getTag(image, 'Orientation');
    console.log({ after: orientation });
    console.log(EXIF.getAllTags(image));
  });

  return orientation;
};
```

```typescriptreact
/**
 * 图片翻转恢复
 * @filename: packages/playground/src/demos/ImageRotateRecover/index.tsx
 * @author: Mr Prince
 * @date: 2022-11-04 11:51:42
 */
import { ChangeEventHandler, useEffect, useRef } from 'react';
import { rotateRecover } from '@mrtujiawei/web-utils';
import './index.less';

const ImageRotateRecover = () => {
  const src = 'https://a.xingqiu.tv/test/1.jpg';
  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files![0];
    const result = await rotateRecover(file, 0);
    console.log({ result });
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 400;
      const context = canvas.getContext('2d');

      if (context) {
        const image = new Image(300, 400);
        image.onload = () => {
          alert(`canvasWidth: ${canvas.width}, canvasHeight: ${canvas.height}`);
          // 顺时针旋转(度)
          let type = 0;
          if (type == 0) {
            // 0
            context.rotate(0);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
          } else if (type == 1) {
            // 90
            context.rotate(Math.PI / 2);
            context.drawImage(image, 0, 0, canvas.width, -canvas.height);
          } else if (type == 2) {
            // 180
            context.rotate(Math.PI);
            context.drawImage(image, 0, 0, -canvas.width, -canvas.height);
          } else if (type == 3) {
            // 270
            context.rotate((3 / 2) * Math.PI);
            context.drawImage(image, 0, 0, -canvas.width, canvas.height);
          } else if (type == 4) {
            // 镜像水平翻转
            context.scale(-1, 1);
            context.drawImage(image, 0, 0, -canvas.width, canvas.height);
          } else if (type == 5) {
            // 镜像垂直翻转
            context.scale(1, -1);
            context.drawImage(image, 0, 0, canvas.width, -canvas.height);
          } else if (type == 6) {
            // 90 + 镜像水平翻转
            context.rotate(Math.PI / 2);
            context.scale(-1, 1);
            context.drawImage(image, 0, 0, -canvas.width, -canvas.height);
          } else if (type == 7) {
            // 90 + 镜像垂直翻转
            context.rotate(Math.PI / 2);
            context.scale(1, -1);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
          }
        };
        image.src = src;
      }
    }
  }, []);

  return (
    <div>
      <div className="uploader">
        上传
        <input
          className="input"
          type="file"
          name="图片上传"
          onChange={handleChange}
        />
      </div>
      <canvas className="canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default ImageRotateRecover;
```

```less
/* index.less */

.uploader {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  border: none;
  outline: none;
  background: transparent;
  outline: none;
  width: 100px;
  height: 100px;
  background: #008c8c;
  position: relative;
  .input {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
}

.canvas {
  border: 1px solid #000;
}
```
