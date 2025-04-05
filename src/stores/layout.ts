import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebarExpanded: true,
  }),
  
  actions: {
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded;
    },
    
    setSidebarExpanded(expanded: boolean) {
      this.sidebarExpanded = expanded;
    },
  },
}); 