import Fingerprint2 from 'fingerprintjs2';
import initExceptionListener from './exception';
import initPerformance from './performance';
import initBehavior from './behavior';
import defaultOptions from './defaultOptions';
import { warning } from './utils';

export default class Kirby {
  private options: KirbyNamespace.Options;

  constructor(options: KirbyNamespace.Options) {
    const initFPCallback = this.initFingerPrintCallback.bind(this, options);

    if (window.requestIdleCallback) {
      requestIdleCallback(initFPCallback);
    } else {
      setTimeout(initFPCallback, 500);
    }

    return this;
  }

  private initFingerPrintCallback(options: KirbyNamespace.Options) {
    const _this = this;

    Fingerprint2.get(function (components) {
      const values = components.map((component) => component.value);
      const uuid = Fingerprint2.x64hash128(values.join(''), 31);

      options = {
        ...options,
        uuid,
      };

      const mergeOptions = _this.mergeOptions(options);

      if (!mergeOptions) return;

      _this.options = mergeOptions;
      _this.initialize(_this.options);
    });
  }

  private mergeOptions(options: KirbyNamespace.Options) {
    options = Object.assign({}, defaultOptions, options);

    if (!options.appKey) {
      warning('Option `appKey` is required to provided but not found.');
      return null;
    }

    if (!options.url) {
      warning('Option `url` is required to provided but not found.');
      return null;
    }

    if (!options.uuid) {
      warning('Option `uuid` is required to provided but not found.');
      return null;
    }

    return options;
  }

  private initialize(options: KirbyNamespace.Options): void {
    if (!options || !options.appKey) {
      warning('Please provid appKey in options');
      return;
    }

    initExceptionListener(options);
    initPerformance(options);
    initBehavior(options);
  }
}

export namespace KirbyNamespace {
  export interface Options {
    /**
     * appKey: Application Identifier
     */
    appKey: string | undefined | null;

    /**
     * url: Report URL
     */
    url: string | undefined | null;

    /**
     * uuid: User Identifier
     */
    uuid: string | undefined | null;

    /**
     * jsErr: Whether to report JavaScript Runtime Error
     */
    jsErr: boolean;

    /**
     * resRrr: Whether to report resource failed loaded error
     */
    resErr: boolean;

    /**
     * ajaxErr: Whether to report ajax / fetch error
     */
    ajaxErr: boolean;

    /**
     * consoleErr: Whether to report console.error message
     */
    consoleErr: boolean;

    /**
     * scriptErr: Whether to report third party script error
     */
    scriptErr: boolean;
  }
}
