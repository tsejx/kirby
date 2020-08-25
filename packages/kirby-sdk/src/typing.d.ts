interface Constructable<T> {
  new (...args: any): T;
}

interface Window {
  __kirby__: any;
  __hashInitKirbySdk__: boolean;
  webkitPerformance: Performance;
  msPerformance: Performance;
  mozPerformance: Performance;
  requestIdleCallback: function;
}

interface Performance {
  webkitNow: () => DOMHighResTimeStamp;
  mozNow: () => DOMHighResTimeStamp;
  msNow: () => DOMHighResTimeStamp;
  oNow: () => DOMHighResTimeStamp;
}

enum InitiatorTypes {
  all,
  other,
  link,
  script,
  img,
  css,
  iframe,
  xmlhttprequest,
}

interface PerformanceResourceTiming {
  domInteractive: DOMHighResTimeStamp;
  domContentLoadedEventEnd: DOMHighResTimeStamp;
  loadEventStart: DOMHighResTimeStamp;
  initatorType?: InitiatorTypes | 'all';
  nextHopProtocol?: string;
}

interface Navigator {
  connection: any;
}

type EventType = keyof GlobalEventHandlersEventMap;

interface EventAttachableElement extends HTMLElement {
  attachEvent(ev: string, fn: (e: any) => void): void;
  detachEvent(ev: string, fn: (e: any) => void): void;
  [key: string]: (e: any) => void;
}

interface WindowScreenInterface extends Screen {
  systemXDPI?: number;
  logicalXDPI?: number;
}
