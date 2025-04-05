<template>
  <div class="min-h-screen bg-gray-100 flex overflow-hidden">
    <!-- 左侧导航栏 - 只在用户登录后显示 -->
    <Navigation v-if="!isAuthRoute" class="flex-shrink-0" />

    <!-- 主要内容区域 -->
    <main
      :class="{
        'flex-1 transition-all overflow-y-auto h-screen': !isAuthRoute,
        'w-full': isAuthRoute,
        'ml-20': !isAuthRoute && !layoutStore.sidebarExpanded,
        'ml-64': !isAuthRoute && layoutStore.sidebarExpanded,
      }"
    >
      <div :class="{ 'w-full px-4': !isAuthRoute }">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Navigation from "./components/Navigation.vue";
import { useLayoutStore } from "./stores/layout";

const route = useRoute();
const layoutStore = useLayoutStore();

// 判断当前是否为认证相关路由（登录和注册页面）
const isAuthRoute = computed(() => {
  return (
    route.meta.requiresAuth === false ||
    route.path === "/login" ||
    route.path === "/register"
  );
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
./stores/layout
