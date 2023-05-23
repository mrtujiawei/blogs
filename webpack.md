# webpack

> 代码生成完后修改其中的内容

```typescript
import { Compilation, Compiler, sources } from 'webpack';

class ShebangWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.make.tap(ShebangWebpackPlugin.name, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: ShebangWebpackPlugin.name,
          stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED,
        },
        (assets) => {
          Object.entries(assets).forEach(([pathname, source]) => {
            const code = source.source();
            const newSource = new sources.RawSource(`#!/bin/env node\n${code}`);
            assets[pathname] = newSource;
          });
        }
      );
    });
  }
}

export default ShebangWebpackPlugin;
```
