const { resolve } = require('path');
const args = require('minimist')(process.argv.slice(2));
const { build } = require('esbuild');
const { Logger } = require('@mrtujiawei/utils');

const logger = Logger.getLogger('dev');
logger.setLevel(Logger.LOG_LEVEL.ALL);
logger.subscribe((content) => {
  console.log(content.getFormattedMessage());
});

const target = args._[0] || 'vue';
const format = args.f || 'global';

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

const outputFormat = (function () {
  if (format.startsWith('global')) {
    return 'iife';
  } else if ('cjs' == format) {
    return 'cjs';
  }
  return 'esm';
})();

const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`);

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions?.name,
  platform: 'cjs' == format ? 'node' : 'browser',
  watch: {
    onRebuild(error) {
      if (!error) {
        logger.trace('rebuild');
      }
    },
  },
}).then(() => {
  logger.trace('watching');
});
