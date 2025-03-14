import { Circle, Img, Rect, Txt, makeScene2D } from '@motion-canvas/2d';
import { createRef, all, map, chain, waitFor } from '@motion-canvas/core';



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





function* textAnimation(text: Txt, texts: string[]) {
  for (const t of texts) {
    const duration = calculateReadingTime(t);
    const fadeInDuration = 0.3;
    const fadeOutDuration = 0.3;
    yield* chain(
      text.opacity(0, fadeOutDuration),  // 淡出效果
      text.text(t, 0),       // 更新文本
      text.opacity(1, fadeInDuration),  // 淡入效果
      waitFor(duration)      // 根据文本长度等待
    );
  }
}

export default makeScene2D(function* (view) {
  const texts = ['你是否擅长某一个领域（程序，美术），但是你没有办法一个人cover项目',
    '你是否还在苦恼如何入门游戏开发。',
    '通过本课程，可以让0基础小白，入门全栈游戏开发。',
    '本课程完全免费，公开。',
    "从小开始，制作独立游戏都是我的梦想。",
    "然而，最近的引擎和各种教程的兴起，给了我一种我上我也行的错觉。"];


  const image = createRef<Img>();
  // const rect = createRef<Rect>();
  const text = createRef<Txt>();

  // view.add(<Circle ref={circle} size={320} fill={'lightseagreen'} />);
  // view.add(<Img ref={image} src={'/imgs/test.jpg'} scale={0.09} position={[-500, 0]} />)
  // view.add(<Rect ref={rect} size={320} fill={'rgba(0,0,0,0.5)'} />)
  view.add(
    <Txt
      ref={text}
      text={texts[0]}
      y={480}
      opacity={1}
      fontSize={48}
    />
  );

  yield* all(
    // circle().scale(2, 2).to(1, 2).to(0.5, 1),
    // image().scale(0.18, 2).to(0.09, 2),
    // circle().fill('red', 1).to('blue', 2),
    // rect().position.x(-100, 2),
    textAnimation(text(), texts)
  );
});
