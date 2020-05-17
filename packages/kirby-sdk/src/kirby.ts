import Reporter from './reporter';

interface KirbyConstructor {
  // new(options: Kirby.InitializeOptions): void;
}

interface ResourceItem {
  type: InitiatorTypes | 'all' | undefined,
  name: string,
  ptc: string,
  trans: number,
  duration: string | number,
  dbs: number,
}

export class Kirby extends Reporter implements KirbyConstructor {
  private options: Kirby.InitializeOptions;

  constructor(options: Kirby.InitializeOptions) {
    super();
    this.initialize(options);
  }

  private initialize(options: Kirby.InitializeOptions): void {
    if (!options || !options.appId) {
      console.warn('Please provid appId in options.');
      return;
    }

    const _this = this;

    _this.options = options;

    _this.initExceptionListener();
    // _this.initInterfaceListener();

    window.addEventListener('onload', function () {
      setTimeout(function () {
        const perf = _this.initPerforamcne();
        const res = _this.initResource();
      }, 500);
    });
  }

  private initExceptionListener(): void {
    window.addEventListener(
      'error',
      (e: ErrorEvent) => {
        const target = e.target;

        if (target instanceof ErrorEvent) {
          const { message, filename, lineno, colno, error } = target;

          const errorInfo = {
            type: 'javascript',
            row: lineno,
            col: colno,
            msg: error && error.stack ? error.stack : message,
            url: filename,
            timestamp: new Date().getTime(),
          };
        }
      },
      true
    );

    window.addEventListener(
      'unhandledrejection',
      (e: PromiseRejectionEvent) => {
        const errorInfo = {
          type: 'promise',
          msg: (e.reason && e.reason.msg) || e.reason || '',
          timestamp: new Date().getTime(),
        };
      },
      true
    );
  }

  private getPerformance(): Performance {
    const performance =
      window.performance ||
      window.webkitPerformance ||
      window.msPerformance ||
      window.mozPerformance ||
      {};

    performance.now = performance.now ||
      performance.webkitNow ||
      performance.msNow ||
      performance.oNow ||
      function () {
        return new Date().getTime();
      }

    return performance;
  }

  private initPerforamcne() {
    const perf = this.getPerformance();

    if (!perf || !perf.getEntriesByType) return undefined;
    const timing = (perf.getEntriesByType('navigation')[0] as PerformanceResourceTiming);
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

  private initResource() {
    const perf = this.getPerformance();
    const resource = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]);

    return resource.reduce<Array<ResourceItem>>((acc: Array<ResourceItem>, item) => {
      const conf = {
        type: item.initatorType,
        name: item.name,
        ptc: item.nextHopProtocol,
        trans: item.responseEnd - item.responseStart,
        duration: item.duration.toFixed(2) || 0,
        dbs: item.decodedBodySize,
      };

      return acc.concat([conf]);
    }, []);
  }
}

export namespace Kirby {
  export interface InitializeOptions {
    appId: string;
  }
}