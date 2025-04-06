<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-900">404</h1>
      <p class="text-2xl font-medium text-gray-600 mt-4">
        {{ t("error.pageNotFound") }}
      </p>
      <p class="text-gray-500 mt-2">{{ t("error.pageNotFoundMessage") }}</p>
      <div class="mt-6">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ t("error.returnHome") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import "./NotFound.styles.css";

const { t } = useI18n();
</script>
