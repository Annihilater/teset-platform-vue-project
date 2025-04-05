<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg" v-if="testCase">
    <div class="border-b border-gray-200 flex justify-between items-center">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ testCase.name }}
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          {{ $t("testCase.id") }}: {{ testCase.id }}
        </p>
      </div>
      <StatusBadge :status="testCase.status" />
    </div>
    <div>
      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">{{ $t("testCase.priority") }}</dt>
          <dd class="mt-1 text-sm text-gray-900 capitalize">{{ testCase.priority }}</dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">{{ $t("testCase.duration") }}</dt>
          <dd class="mt-1 text-sm text-gray-900">{{ testCase.duration }}m</dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">
            {{ $t("testCase.automated") }}
          </dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ testCase.automated ? $t("common.yes") : $t("common.no") }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">{{ $t("testCase.modified") }}</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ new Date(testCase.modified).toLocaleString() }}
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-sm font-medium text-gray-500">{{ $t("testCase.tags") }}</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <span
              v-for="(tag, index) in testCase.tags"
              :key="index"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
            >
              {{ tag }}
            </span>
          </dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-sm font-medium text-gray-500">{{ $t("testCase.steps") }}</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
              <li
                v-for="step in testCase.steps"
                :key="step.id"
                class="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
              >
                <div class="w-0 flex-1 flex items-center">
                  <span class="flex-1 w-0 truncate">
                    {{ step.description }}
                    <p class="text-xs text-gray-500 mt-1">
                      {{ $t("testCase.expected") }}: {{ step.expectedResult }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1" v-if="step.actualResult">
                      {{ $t("testCase.actual") }}: {{ step.actualResult }}
                    </p>
                  </span>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <StatusBadge v-if="step.status" :status="step.status" />
                </div>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TestCase } from "@/mock/types/testCase";
import StatusBadge from "@/components/StatusBadge.vue";

defineProps<{
  testCase: TestCase | null;
}>();
</script>
