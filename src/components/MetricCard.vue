<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center">
      <slot name="icon"></slot>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 truncate">
            {{ title }}
          </dt>
          <dd>
            <div class="text-lg font-medium text-gray-900">
              {{ value }}
            </div>
          </dd>
        </dl>
      </div>
    </div>
    <div v-if="trend" class="mt-4 flex items-center text-sm">
      <span :class="[trend === 'up' ? 'text-green-600' : 'text-red-600', 'mr-1']">
        <component
          :is="trend === 'up' ? 'ChevronUp' : 'ChevronDown'"
          class="w-4 h-4 inline"
        />
      </span>
      <span :class="[trend === 'up' ? 'text-green-600' : 'text-red-600', 'font-medium']">
        {{ trendValue }}
      </span>
      <span class="text-gray-500 ml-1">vs last week</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronUp, ChevronDown } from "lucide-vue-next";

defineProps<{
  title: string;
  value: string;
  trend?: "up" | "down";
  trendValue?: string;
}>();
</script>
