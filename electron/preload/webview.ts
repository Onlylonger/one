// // 此文件作为 <webview preload /> 脚本

import { ipcRenderer, contextBridge, session } from 'electron';

// import AnyXHR from './anyXhr';
// // contextBridge.exposeInMainWorld('__OnePick', {
// //   ipcRenderer,
// // });

// // console.log(333);

// // document.addEventListener('DOMContentLoaded', () => {
// //   console.log(JSON.stringify(document.body));
// // });

// // fetch(`https://www.zcygov.cn/front/detail/item/1579116973633721?timestamp=${Math.ceil(Date.now() / 1000)}`)
// //   .then(async (res) => {
// //     const data = await res.json();
// //     console.log('这是请求数据', data);
// //     ipcRenderer.send('ceshi', data);
// //   })
// //   .catch((err) => {
// //     console.log('error', err);
// //   });

// // const READY_STATE_CHANGE = 'readystatechange';

// // let gHandlerList = []; //截获请求的处理函数列表
// // let gIsInited = false; //是否已经初始化

// // let T_RSC_HANDLERS = Symbol('readyStateChangeHandler');

// // let initProxy = function () {
// //   if (gIsInited) return;

// //   gIsInited = true; //这里先缓存一份原生的XMLHttpRequest类

// //   let winXMLHttpRequest = window.XMLHttpRequest; //用于替换原生XMLHttpRequest的类，继承自XMLHttpRequest

// //   let ProxyXHR = class extends winXMLHttpRequest {
// //     constructor() {
// //       super(...arguments); //readystatechange //数组中第0个为页面中调用xhr.onreadystatechange的回调函数 //其他的为页面中调用addEventListener('readystatechange')时的回调函数

// //       this[T_RSC_HANDLERS] = [null]; //调用原生XMLHttpRequest的addEventListener，添加对readystatechange事件的监听

// //       super.addEventListener(READY_STATE_CHANGE, async () => {
// //         if (this.readyState == 4 && gHandlerList.length) {
// //           //只有4的时候会回调proxyHandler

// //           try {
// //             //调用注册的handler

// //             await gHandlerList.map((proxyHandler) => proxyHandler.call(this, this));
// //           } catch (e) {
// //             //TODO 这里可以替换为其他的错误处理逻辑

// //             console.error(e);
// //           }
// //         } //调用页面中注册的回调函数，保证页面中逻辑正常

// //         this[T_RSC_HANDLERS].forEach((handler) => handler && handler.apply(this, arguments));
// //       });
// //     }
// //     /**
// //      * 重写addEventListener函数，对readystatechange事件做特殊处理
// //      */

// //     addEventListener(type, handler) {
// //       if (type == READY_STATE_CHANGE) {
// //         this[T_RSC_HANDLERS].push(handler);
// //       } else {
// //         return super.addEventListener(...arguments);
// //       }
// //     }
// //     /**
// //      * 重写removeEventListener函数，对readystatechange事件做特殊处理
// //      */

// //     removeEventListener(type, handler) {
// //       if (type == READY_STATE_CHANGE) {
// //         this[T_RSC_HANDLERS] = this[T_RSC_HANDLERS].filter((i) => i !== handler);
// //       } else {
// //         return super.removeEventListener(...arguments);
// //       }
// //     }
// //     /**
// //      * 重写onreadystatechange属性的setter
// //      */

// //     set onreadystatechange(val) {
// //       this[T_RSC_HANDLERS][0] = val;
// //     }
// //     /**
// //      * 重写onreadystatechange属性的getter
// //      */

// //     get onreadystatechange() {
// //       return this[T_RSC_HANDLERS][0] || null;
// //     }
// //   }; //覆盖原生的XMLHttpRequest

// //   window.XMLHttpRequest = ProxyXHR;
// // };

// // /**
// //  * 增加一个handler
// //  * 当xhr.readyState == 4时，回调handler，handler中，可以通过xhr.responseText获取请求返回内容
// //  * @param {function} handler function(xhr){}
// //  */

// // let addHandler = function (handler) {
// //   initProxy();

// //   gHandlerList.push(handler);
// // };

// // /**
// //  * 移除指定的handler
// //  * @param {function} handler 调用addHandler时添加的handler
// //  */

// // let removeHandler = function (handler) {
// //   gHandlerList = gHandlerList.filter((h) => h !== handler);
// // };

// // // module.exports.addHandler = addHandler;

// // // module.exports.removeHandler = removeHandler;

// // addHandler(function (xhr) {
// //   let data = {
// //     a: 1111,
// //   }; //TODO 具体业务代码 //通过ipcRenderer.sendToHost即可将xhr内容发送到BrowserWindow中
// //   console.log('data', data);
// //   setTimeout(() => {
// //     ipcRenderer.sendToHost('channel', data);
// //   }, 4000);
// // });

contextBridge.exposeInMainWorld('__OnePick', {
  ipcRenderer,
  // AnyXHR: AnyXHR,
  XMLHttpRequest() {
    console.log('??? haha xmlhttp');
  },
});

// let oldXHROpen = window.XMLHttpRequest.prototype.open;
// window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
//   this.addEventListener('load', function () {
//     console.log('data: ' + this.responseText);
//   });

//   return oldXHROpen.apply(this, arguments);
// };

// process.once('loaded', () => {
//   // console.log('resolve', document.body);
//   const script = document.createElement('script');
//   // script.textContent = 'console.log(123123123)';
//   document.appendChild(script);
//   // console.log('document', document);
// });
// document.app
// console.log('window.XMLHttpRequest', window.XMLHttpRequest);

// ipcRenderer.sendToHost('channel', 'data');

// import { proxy } from 'ajax-hook';
// proxy({
//   //请求发起前进入
//   onRequest: (config, handler) => {
//     console.log(config.url);
//     handler.next(config);
//   },
//   //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
//   onError: (err, handler) => {
//     console.log(err.type);
//     handler.next(err);
//   },
//   //请求成功后进入
//   onResponse: (response, handler) => {
//     console.log(response.response);
//     handler.next(response);
//   },
// });
