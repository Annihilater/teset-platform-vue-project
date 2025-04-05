import { defineStore } from 'pinia';

interface AppState {
  currentView: string;
  darkMode: boolean;
  language: string;
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    currentView: 'dashboard',
    darkMode: localStorage.getItem('darkMode') === 'true',
    language: localStorage.getItem('language') || (navigator.language.startsWith('zh') ? 'zh' : 'en')
  }),

  actions: {
    setCurrentView(view: string) {
      this.currentView = view;
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode.toString());
    },

    setLanguage(lang: string) {
      this.language = lang;
      localStorage.setItem('language', lang);
    }
  }
}); 