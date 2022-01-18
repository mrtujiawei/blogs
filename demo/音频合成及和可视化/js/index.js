/**
 * <audio></audio>
 * @type {HTMLAudioElement}
 */
let audio;

/**
 * 音频上下文
 * @type {AudioContext}
 * 以目前我的眼光来看，有点全局的控制
 */
let audioContext;

const playByAudioTag = (src, audio) => {
  if (!audioContext) {
    audio = document.createElement('audio');
    audio.src = src;
    audio.crossOrigin = 'Anonymous';
    audio.loop = true;
    audio.play();

    /**
     * create MediaElement source node
     */
    const source = audioContext.createMediaElementSource(audio);

    /**
     * 将源连接到扬声器
     *
     * 播放声音的目标:
     * audioContext.destination
     */
    source.connect(audioContext.destination);
  } else {
    audio.pause();
    audioContext.close();
    audioContext = audio = null;
  }
};

const setup = () => {
  createCanvas(windowWidth, windowHeight);
};

const windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
};

const draw = () => {
  background('black');
  fill('white');
  noStroke();

  const dim = min(width, height);
  if (audioContext) {
    polygon(width / 2, height / 2, dim * .1, 4, PI / 4);
  } else {
    polygon(width / 2, height / 2, dim * .1, 3);
  }
};

const polygon = (x, y, radius, angle) => {
  beginShape();
  for (let i = 0; i < sides; i++) {
    const a = angle + TWO_PI * (i / sides);
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }

  endShape(CLOSE);
};

/**
 * 加载音频数据
 */
const loadAudio = (() => {
  const cache = new Map();
  return async (url) => {
    if (!audioContext) {
      audioContext = new AudioContext();
    }

    if (!cache.has(url)) {
      const response = await fetch(url);
      const data = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(data);
      return buffer;
    }
    return cache.get(url);
  }
})();

const playAudioBuffer = async (buffer) => {
  /**
   * 恢复之前暂停播放的音频
   *
   * 主要是用来处理一些特殊情况
   * 1. 浏览器阻止
   * 2. 一些特殊的用户行为: 离开返回
   */
  await audioContext.resume();

  /**
   * 添加一个播放的源
   */
  const source = audioContext.createBufferSource();

  /**
   * 设置增益(音量)
   */
  const gainNode = new GainNode(audioContext);

  const analyserNode = audioContext.createAnalyser();

  // fft 快速傅里叶变换
  const analyserData = new Float32Array(analyserNode.fftSize);

  // 获取分析数据
  setTimeout(() => {
    analyserNode.getFloatTimeDomainData(analyserData);
    console.log(analyserData);
    const min = Math.min(...analyserData);
    const max = Math.max(...analyserData);
    console.log(min, max);
  }, 1000);

  // 过滤器
  // const filter = audioContext.createBiquadFilter();
  // filter.frequency.value = frequency;
  // filter.Q.value = 1;
  // filter.type = 'bandpass';

  // 获取分析数据
  setTimeout(() => {
    analyserNode.getFloatTimeDomainData(analyserData);
    console.log(analyserData);
  }, 3000);

  // 和分析节点连接，用户分析
  gainNode.connect(analyserNode);

  source.connect(gainNode);

  // 直接输出
  // source.connect(audioContext.destination);

  // 经过增益后输出
  gainNode.connect(audioContext.destination);
  source.buffer = buffer;

  // 调整音量
  // setTimeout(() => {
  //  0.01 变化时间? 如果突然变化会产生杂音
  //   gainNode.gain.setTargetAtTime(.1, audioContext.currentTime, 0.01);
  // }, 2000);

  /**
   * @when - 延迟多少s播放
   * @offset - 偏移量
   * @duration - 播放时长
   */
  source.start(0, 60, 5);
};

document
  .getElementById('player')
  .addEventListener('click', async () => {
    const buffer = await loadAudio('../mp3/victory.mp3')
    await playAudioBuffer(buffer);
  });

