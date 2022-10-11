import { createApp } from 'vue'

import './utils/axios'
import './utils/permission'
import './index.css'
import './assets/css/normalize.css'
import 'element-plus/dist/index.css'
import 'md-editor-v3/lib/style.css';

import MdEditor from 'md-editor-v3';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueAxios from 'vue-axios'
import store from './utils/store.js'
import bus from './utils/bus.js'
import axiosInstance from './utils/axios'
import SocketService from './utils/websocket.js'
import App from './App.vue'
import router from './utils/router.js'

const app = createApp(App)

app.config.productionTip = false
app.config.globalProperties.$axios = axiosInstance;
app.config.globalProperties.$store = store;
app.config.globalProperties.$bus = bus;
app.config.globalProperties.$socket = SocketService.Instance;
app.config.devtools = true

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(store).use(VueAxios, axiosInstance)
  .use(ElementPlus)
  .use(MdEditor)
  .mount('#app')