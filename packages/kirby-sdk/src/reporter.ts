export default class Reporter {
  constructor() { }

  reportData(url: string, data: any) {
    data = JSON.stringify(data)

    if (window && window.navigator && typeof window.navigator.sendBeacon === 'function') {
      const didSusseed = navigator.sendBeacon(url, data)
      if (didSusseed) return
    }

    try {
      const xhr = new window.XMLHttpRequest()

      xhr.open('POST', url, true)
      xhr.send(data)
    } catch (e) {
      new window.Image().src = url
    }
  }
}
