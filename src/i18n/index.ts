import { createI18n } from 'vue-i18n';
import en from './locales/en';
import zh from './locales/zh';

type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], 'en' | 'zh'>({
  legacy: false,
  locale: navigator.language.startsWith('zh') ? 'zh' : 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
});

export default i18n; 