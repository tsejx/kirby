import { KirbyNamespace } from './kirby';
import sendBeacon from './sendBeacon';

interface ResourceMetricsItem {
  type: InitiatorTypes | 'all' | undefined;
  name: string;
  ptc: string;
  trans: number;
  duration: string | number;
  size?: number;
}

function performancePolyfill() {
  const performance =
    window.performance ||
    window.webkitPerformance ||
    window.msPerformance ||
    window.mozPerformance ||
    null;

  if (!performance || 'object' !== typeof performance) return null;

  performance.now =
    performance.now ||
    performance.webkitNow ||
    performance.msNow ||
    performance.oNow ||
    function () {
      return new Date().getTime();
    };

  return performance;
}

function initPerformanceMetrics() {
  const perf = performancePolyfill();

  if (!perf || 'object' !== typeof perf || !perf.getEntriesByType) return null;

  const timing = perf.getEntriesByType('navigation')[0] as PerformanceResourceTiming;
  const round = Math.round;

  const {
    fetchStart,
    domainLookupStart,
    domainLookupEnd,
    connectStart,
    connectEnd,
    secureConnectionStart,
    requestStart,
    responseStart,
    responseEnd,
    domInteractive,
    domContentLoadedEventEnd,
    loadEventStart,
  } = timing;

  return {
    dns: round(domainLookupEnd - domainLookupStart),
    tcp: round(connectEnd - connectStart),
    ssl: round(connectEnd - secureConnectionStart),
    ttfb: round(responseStart - requestStart),
    trans: round(responseEnd - responseStart),
    dom: round(domInteractive - responseEnd),
    res: round(loadEventStart - domContentLoadedEventEnd),
    fb: round(responseStart - domainLookupStart),
    fpt: round(responseEnd - fetchStart),
    tti: round(domInteractive - fetchStart),
    ready: round(domContentLoadedEventEnd - fetchStart),
    load: round(loadEventStart - fetchStart),
  };
}

function initEntriesMetrics() {
  const perf = this.getPerformanceMetrics();

  if (!perf || 'object' !== typeof perf || !perf.getEntriesByType) return null;

  const resource = perf.getEntriesByType('resource') as PerformanceResourceTiming[];

  return resource.reduce<Array<ResourceMetricsItem>>((acc: Array<ResourceMetricsItem>, item) => {
    const conf = {
      type: item.initatorType,
      name: item.name,
      ptc: item.nextHopProtocol,
      trans: item.responseEnd - item.responseStart,
      duration: item.duration.toFixed(2) || 0,
    };

    return acc.concat([conf]);
  }, []);
}

const initPerformance = (options: KirbyNamespace.Options): void => {
  window.addEventListener('onload', function () {
    setTimeout(function () {
      // 监听上报页面加载性能
      const performanceInfo = initPerformanceMetrics();
      // 监听上报页面资源加载性能
      const resourceLoadInfo = initEntriesMetrics();

      if (performanceInfo) {
        sendBeacon(options.url, performanceInfo);
      }

      if (resourceLoadInfo) {
        sendBeacon(options.url, resourceLoadInfo);
      }
    }, 500);
  });
};

export default initPerformance;
