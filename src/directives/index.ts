import type { App } from 'vue';
import clickOutside from './clickOutside';

export default {
  install(app: App) {
    app.directive('click-outside', clickOutside);
  }
}; 