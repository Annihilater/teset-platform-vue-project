import { createApp } from 'vue';
import { Toast, options } from './plugins/toast';
console.log('[日志] 加载插件 toast 来自 ./plugins/toast');
import { Icon } from '@iconify/vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import pinia from './stores';
import directives from './directives';
import './index.css';
console.log('[日志] 已加载全局样式 index.css');
import './components/ui/style.css'
console.log('[日志] 已加载 UI 组件样式 components/ui/style.css');

const app = createApp(App);
app.component('Icon', Icon);

app.use(router);
app.use(i18n);
app.use(pinia);
app.use(directives);
app.use(Toast, options);

app.mount('#app');