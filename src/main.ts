import { createApp } from 'vue';
import ElementPlus from 'element-plus';

import './style.css';
import App from './App.vue';
import 'element-plus/dist/index.css';
import './samples/loading';

createApp(App)
  .use(ElementPlus, { zIndex: 3000 })
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
