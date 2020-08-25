/**
 * Refer: https://github.com/miguelmota/Navigator.sendBeacon
 */

import { isString, isBlob, warning } from './utils';

function sendBeaconPolyfill(url: string | null | undefined, data: any) {
  const event = this.event && this.event.type;
  const sync = event === 'unload' || event === 'beforeunload';

  const xhr =
    'XMLHttpRequest' in this ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('POST', url, !sync);
  xhr.withCredentials = true;
  xhr.setRequestHeader('Accept', '*/*');

  if (isString(data)) {
    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    xhr.responseType = 'text';
  } else if (isBlob(data) && data.type) {
    xhr.setRequestHeader('Content-Type', data.type);
  }

  try {
    xhr.send(data);
  } catch (error) {
    return false;
  }

  return true;
}

export default function sendBeacon(url: string | undefined | null, data: any) {
  if (!url) return false;

  const _this = typeof window === 'object' ? window : this || {};

  data = JSON.stringify(data);

  if (!('navigator' in _this)) {
    _this.navigator = {};
  }

  if (typeof _this.navigator.sendBeacon !== 'function') {
    warning('window.navigator.sendBeacon is not supported, so consider using a polyfill.');

    _this.navigator.sendBeacon = sendBeaconPolyfill.bind(_this);
  }

  return _this.navigator.sendBeacon(url, data);
}
