export type AnimationStatus = 'RUNNING' | 'PAUSING' | 'OVER';

export type BezierTimingFunctionName =
  | 'linear'
  | 'ease'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | string;

declare class BezierAnimation {
  constructor(
    duration?: number,
    bezierTimingFunction?: (BezierTimingFunctionName | any[])[],
    handlers?: (time: number, progress: number) => void,
    delay?: number,
    playNum?: number
  );

  stop: () => void;
  getStatus: () => AnimationStatus;
  end: () => void;
  play: () => void;
}

export default BezierAnimation;
