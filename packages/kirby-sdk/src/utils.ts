export const key = '__kirby__';

export const hasInitKey = '__hashInitKirbySdk__';

export const noop = function () {};

export const warning = (msg: string) => console.warn(`[kirby] ${msg}`);

export function subscribe(
  ele: EventAttachableElement,
  eventName: EventType,
  callback: (e: Event) => any,
  useCapture: boolean = false
) {
  if (ele.addEventListener) {
    return ele.addEventListener(eventName, function addEvent(e) {
      ele.removeEventListener(eventName, addEvent, useCapture);
      callback.call(this, e);
    });
  } else if (ele.attachEvent) {
    return (
      ele.attachEvent &&
      ele.attachEvent('on' + eventName, function attach(e) {
        ele.detachEvent('on' + eventName, attach);
        callback.call(this, e);
      })
    );
  } else {
    eventName;
    ele['on' + eventName] = callback;
  }
}

export function unsuubscribe(
  ele: EventAttachableElement,
  eventName: EventType,
  callback: (e: Event) => any
) {
  return callback
    ? (ele.removeEventListener
        ? ele.removeEventListener(eventName, callback)
        : ele.detachEvent(eventName, callback),
      this)
    : this;
}

export function isFunction(val: any) {
  return 'function' === typeof val;
}

export function isPlainObject(val: any) {
  return '[object Object]' === Object.prototype.toString.call(val);
}

export function isString(val: any) {
  return '[object String]' === Object.prototype.toString.call(val);
}

export function isArray(val: any) {
  return '[object Array]' === Object.prototype.toString.call(val);
}

export function isBlob(val: any) {
  return val instanceof Blob;
}

export function getTime() {
  return new Date().getTime();
}

export function getDevicePixelRatio() {
  let ratio = 1;

  const screen: WindowScreenInterface = window.screen;

  if (
    typeof screen !== undefined &&
    screen.systemXDPI !== undefined &&
    screen.logicalXDPI !== undefined &&
    screen.systemXDPI > screen.logicalXDPI
  ) {
    ratio = screen.systemXDPI / screen.logicalXDPI;
  } else if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio || 1;
  }

  return ratio;
}
