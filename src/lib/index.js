import bezier from './cubic-bezier';
//
import Frame from './frame';
var FPS = 60,
  interval = 1 / FPS,
  status = {
    RUNNING: 'RUNNING',
    PAUSING: 'PAUSING',
    OVER: 'OVER',
  };

/**
 * [bezierAnimation 给定参数，返回动画对象]
 * @method bezierAnimation
 * @param  {number}        duration             [动画时长]
 * @param  {[string|array]}        bezierTimingFunction [缓动函数]
 * @param  {[function|Array[function]]}        handlers             [帧渲染时的回调]
 * @param  {[number]}        delay                [动画延时]
 * @param  {number}        playNum                [播放次数]
 * @return {[object]}                             [description]
 */
function bezierAnimation(duration, bezierTimingFunction, handlers, delay, playNum) {
  if (!this instanceof bezierAnimation) {
    return new bezierAnimation(duration, bezierTimingFunction, handlers, delay);
  }
  var timingFunction = createBezier(bezierTimingFunction);
  var frameHandler,
    infinite = false;
  if (typeof handlers === 'function') {
    frameHandler = new Frame([handlers]);
  } else if (Object.prototype.toString.call(handlers) === '[object Array]') {
    frameHandler = new Frame(handlers);
  }
  if (!delay) delay = 0;
  if (/^[1-9]\d+$/.test(playNum)) {
    playNum = parseInt(playNum);
    infinite = false;
  } else if (!playNum) {
    playNum = 1;
    infinite = false;
  } else if (playNum === 'infinite') {
    playCount = 1;
  }

  var isRunning = false,
    isDone = true,
    delayTimer = null,
    playCount = playNum;
  var param = {
    startTime: 0,
    passedTime: 0,
    duration: duration,
    progress: 0,
  };

  this.play = function (isLoop) {
    if (!param.startTime) param.startTime = Date.now();
    if (isRunning) {
      if (isLoop) {
        if (playCount == 0) {
          return this;
        }
      } else {
        return this;
      }
    }
    if (isDone) isDone = false;
    isRunning = true;

    function playCurrFrame() {
      frameHandler.execute(param, timingFunction).then(function () {
        playNext();
      });
    }

    function done() {
      isRunning = false;
      isDone = true;
      param.passedTime = 0;
      param.startTime = 0;
      param.progress = 0;
      playCount = playNum;
      delayTimer = null;
      for (var i = 0, count = endCb.length; i < count; i++) {
        endCb[i]();
      }
    }
    var self = this;

    function reset() {
      param.startTime = 0;
      param.progress = 0;
    }

    function playNext() {
      if (!isRunning) return;
      if (param.progress >= 1) {
        if (playNum !== 'infinite') {
          playCount--;
          if (playCount > 0) {
            reset();
            self.play(true);
          } else {
            done();
          }
        } else {
          reset();
          self.play(true);
        }
      } else {
        playCurrFrame();
      }
    }
    if (!delay) {
      playCurrFrame();
    } else {
      if (!delayTimer) {
        delayTimer = setTimeout(function () {
          param.startTime = Date.now();
          playCurrFrame();
        }, delay * 1000);
      } else {
        playCurrFrame();
      }
    }
    return this;
  };
  this.stop = function () {
    if (!isRunning) return this;
    param.passedTime = param.passedTime + (Date.now() - param.startTime);
    param.startTime = 0;
    isRunning = false;
    frameHandler.cancelRaf();
  };
  this.getStatus = function () {
    if (isRunning) {
      return status.RUNNING;
    } else {
      if (isDone) {
        return status.OVER;
      } else {
        return status.PAUSING;
      }
    }
  };
  var endCb = [];
  this.end = function (cb) {
    endCb.push(cb);
    return this;
  };
}
/**
 * [createBezier description]
 * @method createBezier
 * @param  {[type]}     cubicBezierTiming [数组或者字符串]
 * @return {[type]}                       [返回对应的贝塞尔对象]
 */
function createBezier(cubicBezierTiming) {
  if (typeof cubicBezierTiming === 'string') {
    if (bezier[cubicBezierTiming]) {
      return bezier[cubicBezierTiming];
    }
    console.error('未找到预置的贝塞尔函数');
    return;
  } else if (
    Object.prototype.toString.call(cubicBezierTiming) === '[object Array]' &&
    cubicBezierTiming.length === 4
  ) {
    return new bezier(
      cubicBezierTiming[0],
      cubicBezierTiming[1],
      cubicBezierTiming[2],
      cubicBezierTiming[3]
    );
    //console.error("贝塞尔参数应为四个介于【0，1】之间的数值");
  } else if (typeof cubicBezierTiming === 'function' && cubicBezierTiming instanceof bezier) {
    return cubicBezierTiming;
  }
}
export default bezierAnimation;
