import { Circle, Img, Rect, Txt, makeScene2D } from '@motion-canvas/2d';
import { createRef, all, map, chain, waitFor, ThreadGenerator, BBox } from '@motion-canvas/core';
import { slideTransition, Direction, fadeTransition } from '@motion-canvas/core';
/**
 * 给定一个文本，计算朗读这句话所需的时间
 */
function calculateReadingTime(text: string): number {
  const baseDuration = 0.2;
  const perCharDuration = 0.2;
  const pauseDuration = 0.5;  // 逗号句号的停顿时间

  let duration = baseDuration;
  let inBrackets = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // 处理括号
    if (char === '（' || char === '(') {
      inBrackets = true;
      continue;
    }
    if (char === '）' || char === ')') {
      inBrackets = false;
      continue;
    }
    // 在括号内的文字不计入时间
    if (inBrackets) {
      continue;
    }

    // 处理标点符号
    if (char === '，' || char === '。' || char === ',' || char === '.') {
      duration += pauseDuration;
      continue;
    }

    // 普通字符
    duration += perCharDuration;
  }

  return duration;
}


class VideoScript {
  constructor(
    public text: string,
    public callback: () => ThreadGenerator
  ) { }
}





// function* textAnimation(text: Txt, texts: string[]) {
//   for (const t of texts) {
//     const duration = calculateReadingTime(t);
//     const fadeInDuration = 0.3;
//     const fadeOutDuration = 0.3;
//     yield* chain(
//       text.opacity(0, fadeOutDuration),  // 淡出效果
//       text.text(t, 0),       // 更新文本
//       text.opacity(1, fadeInDuration),  // 淡入效果
//       waitFor(duration)      // 根据文本长度等待
//     );
//   }
// }

function* executeVideoScript(script: VideoScript, view: any) {
  const text = createRef<Txt>();
  view.add(
    <Txt
      ref={text}
      text={script.text}
      y={480}
      opacity={0}
      fontSize={48}
    />
  );

  // 执行脚本的回调函数（生成器函数）
  yield* script.callback();

  // 添加文本动画效果
  const fadeInDuration = 0.5;
  const fadeOutDuration = 0.3;
  const duration = calculateReadingTime(script.text);

  yield* chain(
    text().opacity(1, fadeInDuration),  // 淡入效果
    waitFor(duration),                  // 等待文本显示完成
    text().opacity(0, fadeOutDuration)  // 淡出效果
  );
}

export default makeScene2D(function* (view) {

  //增加转场


  // yield* fadeTransition(0.4);
  const background = createRef<Rect>();




  const videoScript = [
    new VideoScript('', function* () {
      //增加背景白色矩形
      view.add(
        <Rect ref={background} width={view.width()} height={view.height()} fill={'#000000'} />
      );
      yield* background().fill('#eeeeee',1);
    }),
    new VideoScript('你是否擅长某一个领域（程序，美术），但是你没有办法一个人cover项目', function* () {
      const rect1 = createRef<Rect>();
      view.add(
        <Rect
          ref={rect1}
          width={200}
          height={200}
          fill={'#FF6B6B'}
          position={[-250, view.height()]}
          radius={20}
        />
      );
      yield* rect1().position.y(0, 1);
    }),
    new VideoScript('你是否还在苦恼如何入门游戏开发。', function* () {
      const rect2 = createRef<Rect>();
      view.add(
        <Rect
          ref={rect2}
          width={200}
          height={200}
          fill={'#4ECDC4'}
          position={[0, view.height()]}
          radius={20}
        />
      );
      yield* rect2().position.y(0, 1);
    }),
    new VideoScript('通过本课程，可以让0基础小白，入门全栈游戏开发。', function* () {
      const rect3 = createRef<Rect>();
      view.add(
        <Rect
          ref={rect3}
          width={200}
          height={200}
          fill={'#45B7D1'}
          position={[250, view.height()]}
          radius={20}
        />
      );
      yield* rect3().position.y(0, 1);
    }),
    new VideoScript('本课程完全免费，公开。', function* () {
      //清除所有矩形，但是不删除背景白色矩形
      view.children().forEach(child => {
        if (child instanceof Rect && child !== background()) {
          child.remove();
        }
      });
    }),
    new VideoScript('从小开始，制作独立游戏都是我的梦想。', function* () {
      //创建一个图片
      const img = createRef<Img>(); 
      view.add(
        <Img
          ref={img}
          src={'/imgs/test.jpg'}
          width={200}
          height={200}
          opacity={0}
          scale={4}

        />
      );
      yield* img().opacity(1, 1);
    }),
  ];


  // 依次执行每个视频脚本
  for (const script of videoScript) {
    yield* executeVideoScript(script, view);
  }
});
