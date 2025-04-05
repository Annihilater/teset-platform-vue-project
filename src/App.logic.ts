import { useRoute } from "vue-router";
import { computed } from "vue";
import { useLayoutStore } from "./stores/layout";

console.log('[日志] App.logic.ts 已加载');

export function useAppLogic() {
  const route = useRoute();
  const layoutStore = useLayoutStore();

  const isAuthRoute = computed(() => {
    return (
      route.meta.requiresAuth === false ||
      route.path === "/login" ||
      route.path === "/register"
    );
  });

  return {
    layoutStore,
    isAuthRoute
  };
}