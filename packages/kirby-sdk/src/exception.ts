import sendBeacon from './sendBeacon';
import { KirbyNamespace } from './kirby';
import { ErrorTypeMap } from './constants';
import { getTime } from './utils';

export interface ErrorInfo {
  type: string;
  t: number;
  row?: number;
  col?: number;
  stack?: string;
  msg?: string;
  file?: string;
  errType?: string;
  tagName?: string;
  html?: string;
}

const initExceptionListener = (options: KirbyNamespace.Options): void => {
  window.addEventListener(
    'error',
    (evt: any) => {
      let errorInfo = {} as ErrorInfo;

      if (evt.error) {
        // JavaScript Runtime Error
        const { colno, lineno, filename, message, error, timeStamp } = evt;

        errorInfo = {
          type: ErrorTypeMap.RUNTIME,
          row: lineno,
          col: colno,
          stack: error && error.stack && error.stack.toString(),
          msg: message ? message : error && error.message,
          file: filename,
          t: timeStamp || getTime(),
        };

        if (/^([A-z]+Error)/.test(error.stack)) {
          errorInfo.errType = RegExp.$1;
        }
      } else {
        // Resource Fails to Load
        const target = evt.target ? evt.target : (evt.srcElement as HTMLScriptElement);

        errorInfo = {
          type: ErrorTypeMap.RESOURCE,
          file: (target || ({} as any)).src || (target || ({} as any)).href,
          tagName: target.localName,
          html: target.outerHTML,
          t: evt.timeStamp || getTime(),
        };
      }

      sendBeacon(options.url, errorInfo);
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (e: PromiseRejectionEvent) => {
      const errorInfo = {
        type: ErrorTypeMap.PROMISE,
        msg: (e.reason && e.reason.msg) || e.reason || '',
        timestamp: getTime(),
      };

      sendBeacon(options.url, errorInfo);
    },
    true
  );

  if (options.consoleErr) {
    const consoleError = window.console.error;
    window.console.error = function (...args: any[]) {
      const errorInfo = {
        type: ErrorTypeMap.CONSOLE,
        msg: Array.from(args),
        t: getTime(),
      };

      sendBeacon(options.url, errorInfo);

      consoleError && consoleError(args);
    };
  }
};

export default initExceptionListener;
