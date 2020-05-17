// // console.error
// const consoleError = window.console.error;

// window.console.error = function () {
//   // do something capture console error
//   consoleError && consoleError.apply(window, arguments);
// }

// // XMLHttpRequest
// if (!window.XMLHttpRequest) return;
// const xhr = window.XMLHttpRequest;
// const _send = xhr.prototype.send;
// const _handleEvent = function (event) {
//   if (event && event.currentTarget && event.currentTarget.status !== 200) {
//     // do something
//   }

//   xhr.prototype.send = function () {
//     if (this['addEventListener']) {
//       this['addEventListener']('error', _handleEvent);
//       this['addEventListener']('load', _handleEvent);
//       this['addEventListener']('abort', _handleEvent);
//     } else {
//       var _stateChange = this['onreadystatechange'];
//       this['onreadystatechange'] = function (event) {
//         if (this.readyState === 4) {
//           _handleEvent(event);
//         }
//         _stateChange && _stateChange.apply(this, arguments);
//       };
//     }
//     return _send.apply(this, arguments);
//   }
// }


// // fetch
// if (!window.fetch) return
// const _fetch = window.fetch;
// window.fetch = function () {
//   return _fetch.apply(this, arguments)
//     .then(res => {
//       if (!res.ok) {
//         // do something
//       }
//       return res;
//     })
//     .catch((error) => {
//       // do something
//     })
// }