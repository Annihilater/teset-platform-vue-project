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
import { RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";
import { useAppLogic } from "./App.logic";
import "./App.styles.css";

const { layoutStore, isAuthRoute } = useAppLogic();
</script>
