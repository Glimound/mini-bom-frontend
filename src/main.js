import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(pinia)
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
