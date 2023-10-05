import { getDetail } from './api';

// fetch(`https://www.zcygov.cn/front/detail/item/1579116973633721?timestamp=${Math.ceil(Date.now() / 1000)}`)
//   .then(async (res) => {
//     const data = await res.json();
//     console.log('这是请求数据', data);
//     ipcRenderer.send('ceshi', data);
//   })
//   .catch((err) => {
//     console.log('error', err);
//   });

export default {
  caiji() {
    getDetail(1579116973633721)
      .then(async (res) => {
        const data = await res.json();
        console.log('这是请求数据', data);
        // ipcRenderer.send('ceshi', data);
      })
      .catch((err) => {
        console.log('error', err);
      });
  },
};
