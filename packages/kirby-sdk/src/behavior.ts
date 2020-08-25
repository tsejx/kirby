import { KirbyNamespace } from './kirby';
import { getDevicePixelRatio } from './utils';
import sendBeacon from './sendBeacon';

export interface NavigatorInfo {
  ua: string;
  resolution: string;
  screenSize: string;
  dpr: number;
}

const initBehavior = (options: KirbyNamespace.Options): void => {
  window.addEventListener('load', () => {
    const navigatorInfo: NavigatorInfo = {
      ua: window.navigator.userAgent,
      resolution: `${window.screen.width}*${window.screen.height}`,
      screenSize: `${document.documentElement.clientWidth || document.body.clientWidth}*${
        document.documentElement.clientHeight || document.body.clientHeight
      }`,
      dpr: getDevicePixelRatio(),
    };

    sendBeacon(options.url, navigatorInfo);
  });
};

export default initBehavior;
