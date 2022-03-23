import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import '@/assets/index.scss'

const app = createApp(App)
app.use(ElementPlus, { locale })
app.use(router)
app.mount('#app')