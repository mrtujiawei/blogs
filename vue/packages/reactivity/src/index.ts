import { Logger } from '@mrtujiawei/utils';
import { isObject } from '@vue/shared';

const logger = Logger.getLogger('@vue/reactivity');
logger.setLevel(Logger.LOG_LEVEL.ALL);
logger.subscribe((content) => {
  console.log(content.getFormattedMessage());
});

logger.trace(isObject('a'));

logger.debug('debug');

logger.info('Hello World');
