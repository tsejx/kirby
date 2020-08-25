import Kirby, { KirbyNamespace } from './kirby';
import { key, hasInitKey } from './utils';

const win: Window = window;

class KirbySDK extends Kirby {
  public init(options: KirbyNamespace.Options) {
    return win[hasInitKey] ? win[key] : initSDK(options);
  }
}

function initSDK(options: KirbyNamespace.Options) {
  const sdk = new Kirby(options);
  win[key] = sdk;
  win[hasInitKey] = true;
  return sdk;
}

function initCdnSDK() {
  if (win[hasInitKey]) return win[key];

  let options = {} as KirbyNamespace.Options;
  if (key in win) {
    options = win[key].options;
  }

  return initSDK(options);
}

const isBrowser = 'object' === typeof win && !!win.navigator;

isBrowser && win[key] && ((KirbySDK as any).kby = initCdnSDK());

export default KirbySDK;
