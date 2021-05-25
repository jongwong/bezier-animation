var l = 0,
  id = 0,
  handlerQuene = [],
  frameInterval = 1000 / 60;
export const cancel = function () {
  let caf = function (tickId) {
    for (var i = 0, count = handlerQuene.length; i < count; i++) {
      if (handlerQuene[i].id === tickId) {
        handlerQuene[i].canceled = true;
      }
    }
  };
  caf(arguments);
};

export default function (fn) {
  let raf = function (callback) {
    if (handlerQuene.length == 0) {
      var n = Date.now(),
        e = Math.max(0, frameInterval - n + l);
      var next = l == 0 ? Math.round(frameInterval) : Math.round(e);
      l = n + Math.round(e);
      setTimeout(function () {
        var c = handlerQuene.slice(0);
        handlerQuene.length > 0 && (handlerQuene = []);
        for (var i = 0, count = c.length; i < count; i++) {
          try {
            if (!c[i].canceled) {
              c[i].callback(l);
            }
          } catch (e) {
            setTimeout(function () {
              throw e;
            });
          }
        }
      }, next);
    }
    handlerQuene.push({
      id: ++id,
      callback: callback,
      canceled: false,
    });

    return id;
  };
  return raf(fn);
}
