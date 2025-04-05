import { createApp } from 'vue';
import { Toast, options } from './plugins/toast';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import pinia from './stores';
import directives from './directives';
import './index.css';
import './components/ui/style.css'

const app = createApp(App);

app.use(router);
app.use(i18n);
app.use(pinia);
app.use(directives);
app.use(Toast, options);

app.mount('#app');