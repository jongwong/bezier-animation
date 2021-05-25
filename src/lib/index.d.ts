type AnimationStatus = 'RUNNING' | 'PAUSING' | 'OVER';

declare let BezierAnimation: (
  duration?: number,
  bezierTimingFunction?: (string | any[])[],
  handlers?: (...args: number[]) => void,
  delay?: number,
  playNum?: number
) => {
  stop: () => void;
  getStatus: () => AnimationStatus;
  end: () => void;
  play: () => void;
};
