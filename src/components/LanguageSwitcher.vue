<template>
  <div class="flex items-center" :class="compact ? 'justify-center' : 'gap-x-3'">
    <button
      @click="changeLanguage('en')"
      class="px-2 py-1 rounded text-sm font-semibold leading-6"
      :class="currentLocale === 'en' ? 'bg-gray-800 text-white' : 'text-gray-400'"
    >
      EN
    </button>
    <button
      @click="changeLanguage('zh')"
      class="px-2 py-1 rounded text-sm font-semibold leading-6"
      :class="currentLocale === 'zh' ? 'bg-gray-800 text-white' : 'text-gray-400'"
    >
      {{ compact ? "中" : "中文" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";
import { useLayoutStore } from "@/stores/layout";

const { locale } = useI18n();
const appStore = useAppStore();
const layoutStore = useLayoutStore();

const currentLocale = computed(() => locale.value);
const compact = computed(() => !layoutStore.sidebarExpanded);

function changeLanguage(lang: string) {
  locale.value = lang;
  appStore.setLanguage(lang);
}
</script>
@/stores/app@/stores/layout
