import { Kirby } from './kirby'
import { key, hasInitKey } from './utils'

const win = window;
(win as { [key: string]: any })[key] = Kirby
const KirbySDK = Kirby

function initSDK(config: Kirby.InitializeOptions) {
  const sdk = new window.Kirby(config)
  win[key] = sdk;
  (win as { [key: string]: any })[hasInitKey] = true
  return sdk
}

function initCdnSDK() {
  if ((win as { [key: string]: any })[hasInitKey]) return win[key]
  return key in win && initSDK((win as any)[key].config || {})
}

(KirbySDK as any).init = function (config: Kirby.InitializeOptions) {
  return (win as any)[hasInitKey] ? win[key] : initSDK(config)
}

const isBrowser = 'object' === typeof win && !!win.navigator

isBrowser && win[key] && ((KirbySDK as any).init = initCdnSDK())

export default KirbySDK
